import assert from 'node:assert/strict'
import test from 'node:test'
import { matchesImageHeader, MAX_PHOTO_BYTES, validateSubmission } from '../lib/validation.js'
import { EmailDeliveryError, sendInquiryEmail } from '../lib/emailjs.js'

const draft = {
  name: 'Test visitor',
  phone: '',
  email: 'visitor@example.com',
  contactMethod: 'email',
  location: 'Dallas',
  service: 'painting',
  description: 'Test fixture only.',
}
const input = { requestKey: '13acb484-5f7e-4c08-9cdf-027a1874c123', draft, photos: [] }
const config = {
  enabled: false,
  serviceId: '',
  templateId: '',
  publicKey: '',
  privateKey: '',
  ownerEmail: '',
}
const inquiry = { id: 'fixture', reference: 'HHI-FIXTURE', draft, photoCount: 0 }

test('server requires valid contact, known service, bounded fields, and a UUID request key', () => {
  assert.equal(validateSubmission(input).draft.email, draft.email)
  for (const change of [
    { email: 'bad' },
    { contactMethod: 'text' },
    { service: '../other' },
    { name: ' ' },
    { description: 'x'.repeat(5001) },
  ])
    assert.throws(() => validateSubmission({ ...input, draft: { ...draft, ...change } }))
  assert.throws(() => validateSubmission({ ...input, requestKey: 'unsafe-key' }))
})
test('server enforces five images and the exact inclusive size boundary', () => {
  const photo = { name: '../photo.webp', type: 'image/webp', size: MAX_PHOTO_BYTES }
  assert.equal(validateSubmission({ ...input, photos: [photo] }).photos[0].name, 'photo.webp')
  assert.throws(() => validateSubmission({ ...input, photos: Array(6).fill(photo) }))
  assert.throws(() =>
    validateSubmission({ ...input, photos: [{ ...photo, size: MAX_PHOTO_BYTES + 1 }] }),
  )
  assert.throws(() =>
    validateSubmission({ ...input, photos: [{ ...photo, type: 'image/svg+xml' }] }),
  )
})
test('declared MIME types must match an accepted file signature', () => {
  const webp = Buffer.from('RIFF0000WEBPfixture')
  assert.equal(matchesImageHeader(webp, 'image/webp'), true)
  assert.equal(matchesImageHeader(webp, 'image/png'), false)
  assert.equal(matchesImageHeader(Buffer.from('<svg>'), 'image/webp'), false)
})
test('disabled EmailJS does not make any network request', async () => {
  let calls = 0
  const result = await sendInquiryEmail(config, inquiry, async () => {
    calls++
    throw new Error('Must not connect')
  })
  assert.equal(result, 'disabled')
  assert.equal(calls, 0)
})
test('EmailJS uses the configured owner recipient and succeeds only on HTTP 200', async () => {
  const ready = {
    enabled: true,
    serviceId: 'fixture-service',
    templateId: 'fixture-template',
    publicKey: 'fixture-public',
    privateKey: 'fixture-private',
    ownerEmail: 'owner@example.com',
  }
  let payload
  assert.equal(
    await sendInquiryEmail(ready, inquiry, async (url, options) => {
      assert.equal(url, 'https://api.emailjs.com/api/v1.0/email/send')
      payload = JSON.parse(options.body)
      return new Response('OK', { status: 200 })
    }),
    'sent',
  )
  assert.equal(payload.template_params.to_email, 'owner@example.com')
  assert.equal(payload.template_params.reply_to, draft.email)
  await assert.rejects(
    sendInquiryEmail(ready, inquiry, async () => new Response('Rejected', { status: 422 })),
    (error) => error instanceof EmailDeliveryError && error.outcome === 'failed',
  )
})
test('ambiguous email transport errors stay uncertain and never retry automatically', async () => {
  let calls = 0
  const ready = {
    enabled: true,
    serviceId: 'fixture',
    templateId: 'fixture',
    publicKey: 'fixture',
    privateKey: 'fixture',
    ownerEmail: 'owner@example.com',
  }
  await assert.rejects(
    sendInquiryEmail(ready, inquiry, async () => {
      calls++
      throw new Error('Transport timeout')
    }),
    (error) => error.outcome === 'uncertain',
  )
  assert.equal(calls, 1)
})
