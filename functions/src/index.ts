import { createHash } from 'node:crypto'
import { setTimeout as delay } from 'node:timers/promises'
import { initializeApp } from 'firebase-admin/app'
import { FieldValue, Timestamp, getFirestore } from 'firebase-admin/firestore'
import { getStorage } from 'firebase-admin/storage'
import { HttpsError, onCall } from 'firebase-functions/v2/https'
import { onDocumentUpdated } from 'firebase-functions/v2/firestore'
import { defineSecret } from 'firebase-functions/params'
import { logger } from 'firebase-functions'
import { EmailDeliveryError, sendInquiryEmail } from './emailjs.js'
import { matchesImageHeader, validateRequestKey, validateSubmission } from './validation.js'
import type { InquiryDraft, PhotoInput } from './validation.js'
export { cleanupInquiryPhotos } from './cleanup.js'

initializeApp()
const db = getFirestore()
const privateKey = defineSecret('EMAILJS_PRIVATE_KEY')
const options = {
  region: 'us-central1',
  enforceAppCheck: true,
  maxInstances: 3,
  timeoutSeconds: 120,
}
const hash = (value: string) => createHash('sha256').update(value).digest('hex')
const inquiryId = (key: string) => hash(key).slice(0, 40)
const reference = (id: string) => `HHI-${id.slice(0, 10).toUpperCase()}`
interface StoredInquiry {
  fingerprint: string
  draft: InquiryDraft
  photos: PhotoInput[]
  status: 'awaiting_upload' | 'received'
  expiresAt: Timestamp
  notificationStatus: string
}

function requireConnection(origin: string | undefined) {
  if (process.env.INQUIRIES_ENABLED !== 'true')
    throw new HttpsError(
      'failed-precondition',
      'Online submission is unavailable. Please call or text us.',
    )
  const allowed = process.env.INQUIRY_ALLOWED_ORIGIN?.trim()
  if (!allowed || origin !== allowed)
    throw new HttpsError('permission-denied', 'This website is not configured for online requests.')
  if (!process.env.INQUIRY_STORAGE_BUCKET)
    throw new HttpsError('failed-precondition', 'Photo storage is not configured.')
}
function validation<T>(run: () => T): T {
  try {
    return run()
  } catch (error) {
    throw new HttpsError(
      'invalid-argument',
      error instanceof Error ? error.message : 'Please review your request.',
    )
  }
}

export const beginInquiry = onCall(options, async (request) => {
  requireConnection(request.rawRequest.get('origin'))
  const input = validation(() => validateSubmission(request.data))
  const id = inquiryId(input.requestKey),
    document = db.doc(`inquiries/${id}`)
  const fingerprint = hash(JSON.stringify({ draft: input.draft, photos: input.photos }))
  const now = Date.now()
  const expiresAt = Timestamp.fromMillis(now + 30 * 60_000)
  const ipHash = hash(request.rawRequest.ip || 'unknown').slice(0, 32)
  const limit = db.doc(`inquiryLimits/${ipHash}`)
  const stored = await db.runTransaction(async (transaction) => {
    const existing = await transaction.get(document)
    if (existing.exists) {
      const data = existing.data() as StoredInquiry
      if (data.fingerprint !== fingerprint)
        throw new HttpsError(
          'failed-precondition',
          'The request changed. Please start a new request.',
        )
      if (data.status !== 'received' && data.expiresAt.toMillis() < now)
        throw new HttpsError(
          'deadline-exceeded',
          'Your upload session expired. Please start a new request.',
        )
      return data
    }
    const previous = (await transaction.get(limit)).data()
    const recent = previous && now - Number(previous.windowStart) < 60 * 60_000
    const count = recent ? Number(previous.count) : 0
    if (count >= 5)
      throw new HttpsError('resource-exhausted', 'Too many requests. Please call or text us.')
    transaction.set(limit, {
      windowStart: recent ? previous.windowStart : now,
      count: count + 1,
      expiresAt: Timestamp.fromMillis(now + 2 * 60 * 60_000),
    })
    const record: StoredInquiry = {
      fingerprint,
      draft: input.draft,
      photos: input.photos,
      status: 'awaiting_upload',
      expiresAt,
      notificationStatus: 'pending',
    }
    transaction.create(document, {
      ...record,
      reference: reference(id),
      createdAt: FieldValue.serverTimestamp(),
    })
    return record
  })
  if (stored.status === 'received')
    return { id, reference: reference(id), complete: true, uploads: [] }
  const bucket = getStorage().bucket(process.env.INQUIRY_STORAGE_BUCKET)
  const uploads = await Promise.all(
    stored.photos.map(async (photo, index) => {
      // A signed POST enforces both the exact declared size and MIME type at storage.
      // No public Storage write permissions or base64 email attachments are needed.
      const [policy] = await bucket
        .file(`inquiry-staging/${id}/${index}`)
        .generateSignedPostPolicyV4({
          expires: Math.min(Date.now() + 10 * 60_000, stored.expiresAt.toMillis()),
          fields: { 'Content-Type': photo.type, success_action_status: '204' },
          conditions: [['content-length-range', photo.size, photo.size]],
        })
      return { index, url: policy.url, fields: policy.fields }
    }),
  )
  return { id, reference: reference(id), complete: false, uploads }
})

export const finishInquiry = onCall(options, async (request) => {
  requireConnection(request.rawRequest.get('origin'))
  const key = validation(() => validateRequestKey(request.data?.requestKey))
  const id = inquiryId(key),
    document = db.doc(`inquiries/${id}`)
  const snapshot = await document.get()
  if (!snapshot.exists) throw new HttpsError('not-found', 'Please start your request again.')
  const data = snapshot.data() as StoredInquiry
  if (data.status === 'received') return { reference: reference(id) }
  if (data.expiresAt.toMillis() < Date.now())
    throw new HttpsError(
      'deadline-exceeded',
      'Your upload session expired. Please start a new request.',
    )
  const bucket = getStorage().bucket(process.env.INQUIRY_STORAGE_BUCKET)
  const photos: Array<PhotoInput & { path: string; generation: string }> = []
  for (const [index, photo] of data.photos.entries()) {
    const stagingPath = `inquiry-staging/${id}/${index}`
    const [metadata] = await bucket
      .file(stagingPath)
      .getMetadata()
      .catch(() => {
        throw new HttpsError('failed-precondition', 'A photo upload is missing. Please try again.')
      })
    if (Number(metadata.size) !== photo.size || metadata.contentType !== photo.type)
      throw new HttpsError('invalid-argument', 'A photo did not match its upload details.')
    const uploaded = bucket.file(stagingPath, { generation: metadata.generation })
    const [header] = await uploaded.download({ start: 0, end: 63 })
    if (!matchesImageHeader(header, photo.type))
      throw new HttpsError('invalid-argument', 'A photo is not a supported image file.')
    // Copy the verified generation out of staging. Reusing an upload policy can
    // never overwrite the final, private photo attached to a received inquiry.
    const finalPath = `inquiry-photos/${id}/${index}`
    const destination = bucket.file(finalPath)
    try {
      await uploaded.copy(destination, { preconditionOpts: { ifGenerationMatch: 0 } })
    } catch (error) {
      if (Number((error as { code?: number }).code) !== 412) throw error
    }
    const [finalMetadata] = await destination.getMetadata()
    if (
      finalMetadata.md5Hash !== metadata.md5Hash ||
      Number(finalMetadata.size) !== photo.size ||
      finalMetadata.contentType !== photo.type
    )
      throw new HttpsError(
        'failed-precondition',
        'A photo changed during upload. Please start a new request.',
      )
    photos.push({ ...photo, path: finalPath, generation: String(finalMetadata.generation) })
  }
  await db.runTransaction(async (transaction) => {
    const current = await transaction.get(document)
    if (current.data()?.status === 'received') return
    transaction.update(document, {
      status: 'received',
      photos,
      receivedAt: FieldValue.serverTimestamp(),
      expiresAt: FieldValue.delete(),
    })
  })
  // Email is a separate notification of an already saved request. An email
  // failure must not tell the visitor their successfully recorded inquiry failed.
  return { reference: reference(id) }
})

export const notifyInquiryOwner = onDocumentUpdated(
  {
    document: 'inquiries/{id}',
    region: 'us-central1',
    secrets: process.env.EMAILJS_ENABLED === 'true' ? [privateKey] : [],
    maxInstances: 1,
    concurrency: 1,
    timeoutSeconds: 120,
    retry: false,
  },
  async (event) => {
    const before = event.data?.before.data(),
      after = event.data?.after.data()
    if (!after || after.status !== 'received' || before?.status === 'received') return
    const document = event.data!.after.ref
    if (process.env.EMAILJS_ENABLED !== 'true') {
      await document.update({ notificationStatus: 'disabled' })
      return
    }
    const claimed = await db.runTransaction(async (transaction) => {
      const current = (await transaction.get(document)).data()
      if (current?.notificationStatus !== 'pending') return false
      transaction.update(document, {
        notificationStatus: 'sending',
        notificationAttemptedAt: FieldValue.serverTimestamp(),
      })

      return true
    })
    if (!claimed) return
    try {
      // EmailJS allows one request per second. Reserve a shared dispatch slot.
      const slot = await db.runTransaction(async (transaction) => {
        const throttle = db.doc('integrationState/emailjs')
        const next = Number((await transaction.get(throttle)).data()?.nextDispatch || 0)
        const at = Math.max(Date.now(), next)
        transaction.set(throttle, { nextDispatch: at + 1100 })
        return at
      })
      await delay(Math.max(0, slot - Date.now()))
      const status = await sendInquiryEmail(
        {
          enabled: true,
          serviceId: process.env.EMAILJS_SERVICE_ID || '',
          templateId: process.env.EMAILJS_TEMPLATE_ID || '',
          publicKey: process.env.EMAILJS_PUBLIC_KEY || '',
          privateKey: privateKey.value(),
          ownerEmail: process.env.EMAILJS_OWNER_EMAIL || '',
        },
        {
          id: event.params.id,
          reference: after.reference,
          draft: after.draft,
          photoCount: after.photos.length,
        },
      )
      await document.update({
        notificationStatus: status,
        notificationCompletedAt: FieldValue.serverTimestamp(),
      })
    } catch (error) {
      const outcome = error instanceof EmailDeliveryError ? error.outcome : 'uncertain'
      await document.update({
        notificationStatus: outcome,
        notificationCompletedAt: FieldValue.serverTimestamp(),
      })
      logger.error('Inquiry email notification was not confirmed.', {
        inquiryId: event.params.id,
        outcome,
      })
    }
  },
)
