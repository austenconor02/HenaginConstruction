import type { EstimateDraft, PublicContent } from '../types/content'

// Part 2/3 can implement these contracts without coupling UI to Firebase/EmailJS.
export interface PublicContentRepository {
  load(): Promise<PublicContent>
}

export interface EstimateGateway {
  readonly available: boolean
  submit(
    draft: EstimateDraft,
    photos: File[],
    requestKey: string,
    onProgress?: (message: string) => void,
  ): Promise<{ reference: string }>
}
