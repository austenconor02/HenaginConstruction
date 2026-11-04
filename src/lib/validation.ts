import type { EstimateDraft } from '../types/content'

export const MAX_PHOTOS = 5
export const MAX_PHOTO_BYTES = 10 * 1024 * 1024
export const PHOTO_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif']

export function isUsablePhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, '')
  return /^\d{10}$/.test(digits) || /^1\d{10}$/.test(digits)
}

export function isUsableEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
}

export function validateEstimate(
  draft: EstimateDraft,
): Partial<Record<keyof EstimateDraft, string>> {
  const errors: Partial<Record<keyof EstimateDraft, string>> = {}
  if (!draft.name.trim()) errors.name = 'Please enter your name.'
  if (!draft.location.trim()) errors.location = 'Please enter your city or ZIP code.'
  if (!draft.description.trim()) errors.description = 'Tell us a little about your project.'
  if (draft.contactMethod === 'email' && !isUsableEmail(draft.email))
    errors.email = 'Enter a valid email address for email contact.'
  if (draft.contactMethod !== 'email' && !isUsablePhone(draft.phone))
    errors.phone = 'Enter a 10-digit phone number for calls or texts.'
  if (draft.phone.trim() && !isUsablePhone(draft.phone))
    errors.phone = 'Enter a valid 10-digit phone number.'
  if (draft.email.trim() && !isUsableEmail(draft.email))
    errors.email = 'Enter a valid email address.'
  return errors
}

export function photoError(file: Pick<File, 'name' | 'type' | 'size'>): string | undefined {
  if (!PHOTO_TYPES.includes(file.type))
    return `${file.name}: please choose a JPG, PNG, WebP, or AVIF image.`
  if (file.size === 0) return `${file.name}: this file is empty.`
  if (file.size > MAX_PHOTO_BYTES) return `${file.name}: photos must be 10 MB or smaller.`
}
