export const MAX_PHOTO_BYTES = 10 * 1024 * 1024
export const PHOTO_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'] as const
const services = [
  '',
  'custom-builds',
  'remodeling',
  'painting',
  'flooring',
  'handyman',
  'fascia',
  'soffit',
  'siding',
  'skid-steer',
  'other',
]
export interface InquiryDraft {
  name: string
  phone: string
  email: string
  contactMethod: 'phone' | 'text' | 'email'
  location: string
  service: string
  description: string
}
export interface PhotoInput {
  name: string
  type: string
  size: number
}
export interface SubmissionInput {
  requestKey: string
  draft: InquiryDraft
  photos: PhotoInput[]
}

function object(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value))
    throw new Error('Invalid request.')
  return value as Record<string, unknown>
}
function text(value: unknown, max: number, required = false) {
  if (typeof value !== 'string' || value.length > max) throw new Error('Invalid field length.')
  const result = value.trim()
  if (required && !result) throw new Error('A required field is missing.')
  return result
}
export function validateRequestKey(value: unknown): string {
  if (
    typeof value !== 'string' ||
    !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)
  )
    throw new Error('Invalid request key.')
  return value.toLowerCase()
}
export function validateSubmission(value: unknown): SubmissionInput {
  const input = object(value),
    source = object(input.draft)
  const contactMethod = text(source.contactMethod, 10)
  if (!['phone', 'text', 'email'].includes(contactMethod))
    throw new Error('Choose a contact method.')
  const draft: InquiryDraft = {
    name: text(source.name, 100, true),
    phone: text(source.phone, 30),
    email: text(source.email, 254),
    contactMethod: contactMethod as InquiryDraft['contactMethod'],
    location: text(source.location, 100, true),
    service: text(source.service, 40),
    description: text(source.description, 5000, true),
  }
  if (!services.includes(draft.service)) throw new Error('Choose a valid service.')
  const phoneValid = /^(?:1)?\d{10}$/.test(draft.phone.replace(/\D/g, ''))
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.email)
  if (
    (draft.phone && !phoneValid) ||
    (draft.email && !emailValid) ||
    (contactMethod === 'email' ? !emailValid : !phoneValid)
  )
    throw new Error('Enter a valid contact for your preferred method.')
  if (!Array.isArray(input.photos) || input.photos.length > 5)
    throw new Error('Up to five photos are allowed.')
  const photos = input.photos.map((value) => {
    const photo = object(value)
    const name =
      text(photo.name, 512, true)
        .replace(/[\x00-\x1f\x7f]/g, '')
        .split(/[\\/]/)
        .at(-1) || 'photo'
    const type = text(photo.type, 40)
    if (
      !PHOTO_TYPES.includes(type as (typeof PHOTO_TYPES)[number]) ||
      !Number.isInteger(photo.size) ||
      Number(photo.size) < 1 ||
      Number(photo.size) > MAX_PHOTO_BYTES
    )
      throw new Error('Photos must be JPG, PNG, WebP, or AVIF and 10 MB or smaller.')
    return { name, type, size: Number(photo.size) }
  })
  return { requestKey: validateRequestKey(input.requestKey), draft, photos }
}
export function matchesImageHeader(bytes: Uint8Array, mime: string): boolean {
  const ascii = (start: number, end: number) =>
    Buffer.from(bytes.subarray(start, end)).toString('ascii')
  if (mime === 'image/jpeg')
    return bytes.length >= 3 && bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255
  if (mime === 'image/png')
    return (
      bytes.length >= 8 &&
      Buffer.from(bytes.subarray(0, 8)).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
    )
  if (mime === 'image/webp')
    return bytes.length >= 12 && ascii(0, 4) === 'RIFF' && ascii(8, 12) === 'WEBP'
  if (mime === 'image/avif') {
    if (bytes.length < 16 || ascii(4, 8) !== 'ftyp') return false
    if (['avif', 'avis'].includes(ascii(8, 12))) return true
    for (let offset = 16; offset + 4 <= bytes.length; offset += 4)
      if (['avif', 'avis'].includes(ascii(offset, offset + 4))) return true
  }
  return false
}
