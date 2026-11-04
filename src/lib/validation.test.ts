import test from 'node:test'
import assert from 'node:assert/strict'
import { isUsablePhone, MAX_PHOTO_BYTES, photoError, validateEstimate } from './validation'
import { publishedContent } from './publishedContent'
import type { EstimateDraft } from '../types/content'

const draft: EstimateDraft = {
  name: 'Example visitor',
  phone: '(972) 310-3255',
  email: '',
  contactMethod: 'text',
  location: 'Dallas',
  service: '',
  description: 'Paint a bedroom.',
}

test('requires a name, location, description, and valid preferred contact', () => {
  assert.deepEqual(validateEstimate(draft), {})
  const errors = validateEstimate({ ...draft, name: ' ', location: '', description: '', phone: '' })
  assert.deepEqual(Object.keys(errors).sort(), ['description', 'location', 'name', 'phone'])
})

test('email-only requests work when email is the preferred method', () => {
  assert.deepEqual(
    validateEstimate({ ...draft, contactMethod: 'email', phone: '', email: 'visitor@example.com' }),
    {},
  )
  assert.ok(validateEstimate({ ...draft, contactMethod: 'email', email: 'bad-address' }).email)
  assert.ok(
    validateEstimate({ ...draft, contactMethod: 'text', phone: '', email: 'visitor@example.com' })
      .phone,
  )
})

test('accepts formatted US phone numbers and rejects incomplete numbers', () => {
  assert.equal(isUsablePhone('+1 (972) 310-3255'), true)
  assert.equal(isUsablePhone('972-310-3255'), true)
  assert.equal(isUsablePhone('310-3255'), false)
  assert.equal(isUsablePhone('9723103255123'), false)
})

test('enforces photo types, nonempty files, and the inclusive 10 MB boundary', () => {
  assert.equal(
    photoError({ name: 'photo.jpg', type: 'image/jpeg', size: MAX_PHOTO_BYTES }),
    undefined,
  )
  assert.ok(photoError({ name: 'large.jpg', type: 'image/jpeg', size: MAX_PHOTO_BYTES + 1 }))
  assert.ok(photoError({ name: 'empty.png', type: 'image/png', size: 0 }))
  assert.ok(photoError({ name: 'script.svg', type: 'image/svg+xml', size: 1024 }))
})

test('publishes only nonempty approved albums and reviews', () => {
  const content = publishedContent({
    albums: [
      {
        id: 'empty',
        title: 'Empty',
        service: 'painting',
        description: '',
        published: true,
        photos: [],
      },
      {
        id: 'draft',
        title: 'Draft',
        service: 'painting',
        description: '',
        published: false,
        photos: [{ id: 'p', src: '/test.jpg', alt: 'Test fixture' }],
      },
      {
        id: 'public',
        title: 'Approved',
        service: 'painting',
        description: '',
        published: true,
        photos: [{ id: 'p', src: '/test.jpg', alt: 'Test fixture' }],
      },
    ],
    reviews: [
      { id: 'draft', author: 'Fixture', text: 'Test fixture', published: false },
      { id: 'empty', author: 'Fixture', text: ' ', published: true },
      { id: 'public', author: 'Fixture', text: 'Test fixture', published: true },
    ],
  })
  assert.deepEqual(
    content.albums.map((album) => album.id),
    ['public'],
  )
  assert.deepEqual(
    content.reviews.map((review) => review.id),
    ['public'],
  )
})
