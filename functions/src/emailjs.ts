import type { InquiryDraft } from './validation.js'

export interface EmailConfig {
  enabled: boolean
  serviceId: string
  templateId: string
  publicKey: string
  privateKey: string
  ownerEmail: string
}
export class EmailDeliveryError extends Error {
  constructor(public readonly outcome: 'failed' | 'uncertain') {
    super('The inquiry was saved; its email notification was not confirmed.')
  }
}
// Server-side only. The recipient is configuration, never visitor-supplied data.
export async function sendInquiryEmail(
  config: EmailConfig,
  inquiry: { id: string; reference: string; draft: InquiryDraft; photoCount: number },
  request: typeof fetch = fetch,
): Promise<'disabled' | 'sent'> {
  if (!config.enabled) return 'disabled'
  if (
    ![
      config.serviceId,
      config.templateId,
      config.publicKey,
      config.privateKey,
      config.ownerEmail,
    ].every((value) => value.trim())
  )
    throw new EmailDeliveryError('failed')
  try {
    const response = await request('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(15_000),
      body: JSON.stringify({
        service_id: config.serviceId,
        template_id: config.templateId,
        user_id: config.publicKey,
        accessToken: config.privateKey,
        template_params: {
          to_email: config.ownerEmail,
          business_name: 'Henagin Home Improvement',
          inquiry_id: inquiry.id,
          reference: inquiry.reference,
          from_name: inquiry.draft.name,
          reply_to: inquiry.draft.email || config.ownerEmail,
          phone: inquiry.draft.phone,
          preferred_contact: inquiry.draft.contactMethod,
          service: inquiry.draft.service || 'Not specified',
          location: inquiry.draft.location,
          project_description: inquiry.draft.description,
          photo_count: inquiry.photoCount,
        },
      }),
    })
    if (response.status !== 200) throw new EmailDeliveryError('failed')
    return 'sent'
  } catch (error) {
    if (error instanceof EmailDeliveryError) throw error
    // A timeout/network error can occur after delivery. Do not automatically
    // retry it and send duplicate notifications; leave it for owner review.
    throw new EmailDeliveryError('uncertain')
  }
}
