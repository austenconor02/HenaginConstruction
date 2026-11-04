import { getStorage } from 'firebase-admin/storage'
import { onDocumentDeleted } from 'firebase-functions/v2/firestore'

// Expired drafts can be removed by Firestore TTL. Delete only that inquiry's
// matching private objects. Accepted inquiries have their expiry field removed.
export const cleanupInquiryPhotos = onDocumentDeleted(
  { document: 'inquiries/{id}', region: 'us-central1', retry: true },
  async (event) => {
    const id = event.params.id
    if (!/^[0-9a-f]{40}$/.test(id) || !process.env.INQUIRY_STORAGE_BUCKET) return
    const bucket = getStorage().bucket(process.env.INQUIRY_STORAGE_BUCKET)
    await bucket.deleteFiles({ prefix: `inquiry-staging/${id}/` })
    await bucket.deleteFiles({ prefix: `inquiry-photos/${id}/` })
  },
)
