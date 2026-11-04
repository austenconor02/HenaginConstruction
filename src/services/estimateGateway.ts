import type { EstimateGateway } from './contracts'
import { canSubmitInquiries, readInquiryConfig } from './inquiryConfig'
import { MAX_PHOTOS, photoError, validateEstimate } from '../lib/validation'

const config = readInquiryConfig(import.meta.env ?? {})

export const estimateGateway: EstimateGateway = {
  available: canSubmitInquiries(config),
  async submit(draft, photos, requestKey, onProgress) {
    if (!canSubmitInquiries(config))
      throw new Error('Online estimates are not connected yet. Please call or text (972) 310-3255.')
    if (
      Object.keys(validateEstimate(draft)).length ||
      photos.length > MAX_PHOTOS ||
      photos.some((photo) => photoError(photo))
    )
      throw new Error('Please review your contact details and photos.')
    // No Firebase initialization, App Check script, network request, or email
    // occurs while the explicit connection flag is off (the default).
    const { submitFirebaseInquiry } = await import('./firebaseInquiryTransport')
    return submitFirebaseInquiry(config, draft, photos, requestKey, onProgress)
  },
}
