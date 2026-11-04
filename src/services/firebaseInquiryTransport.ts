import { initializeApp } from 'firebase/app'
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from 'firebase/app-check'
import { getFunctions, httpsCallable } from 'firebase/functions'
import type { EstimateDraft } from '../types/content'
import type { InquiryConfig } from './inquiryConfig'

interface UploadPolicy {
  index: number
  url: string
  fields: Record<string, string>
}
interface BeginResponse {
  id: string
  reference: string
  complete: boolean
  uploads: UploadPolicy[]
}
let connection: ReturnType<typeof getFunctions> | undefined
function connect(config: InquiryConfig) {
  if (connection) return connection
  const app = initializeApp(
    {
      apiKey: config.apiKey,
      authDomain: config.authDomain,
      projectId: config.projectId,
      appId: config.appId,
    },
    'henagin-inquiries',
  )
  initializeAppCheck(app, {
    provider: new ReCaptchaEnterpriseProvider(config.appCheckSiteKey),
    isTokenAutoRefreshEnabled: true,
  })
  connection = getFunctions(app, config.region)
  return connection
}

export async function submitFirebaseInquiry(
  config: InquiryConfig,
  draft: EstimateDraft,
  photos: File[],
  requestKey: string,
  onProgress?: (message: string) => void,
): Promise<{ reference: string }> {
  const functions = connect(config)
  onProgress?.('Preparing your request…')
  const begin = httpsCallable<unknown, BeginResponse>(functions, 'beginInquiry', {
    timeout: 120_000,
  })
  const result = (
    await begin({
      draft,
      requestKey,
      photos: photos.map((photo) => ({ name: photo.name, type: photo.type, size: photo.size })),
    })
  ).data
  if (result.complete) {
    if (!result.reference) throw new Error('No confirmation was received. Please retry or call us.')
    return { reference: result.reference }
  }
  for (const [index, upload] of result.uploads.entries()) {
    const file = photos[upload.index]
    if (!file) throw new Error('A selected photo is missing. Please choose your photos again.')
    const destination = new URL(upload.url)
    if (
      destination.protocol !== 'https:' ||
      !(
        destination.hostname === 'storage.googleapis.com' ||
        destination.hostname.endsWith('.storage.googleapis.com')
      )
    )
      throw new Error('The photo upload destination could not be verified.')
    const body = new FormData()
    Object.entries(upload.fields).forEach(([key, value]) => body.append(key, value))
    body.append('file', file, file.name)
    onProgress?.(`Uploading photo ${index + 1} of ${result.uploads.length}…`)
    const response = await fetch(upload.url, {
      method: 'POST',
      body,
      signal: AbortSignal.timeout(120_000),
    })
    if (!response.ok)
      throw new Error(
        'A photo could not be uploaded. Your request is not confirmed; please retry or call us.',
      )
  }
  onProgress?.('Saving your request…')
  const finish = httpsCallable<unknown, { reference: string }>(functions, 'finishInquiry', {
    timeout: 120_000,
  })
  const receipt = (await finish({ requestKey })).data
  if (!receipt.reference) throw new Error('No confirmation was received. Please retry or call us.')
  return receipt
}
