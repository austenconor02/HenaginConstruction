import assert from 'node:assert/strict'
import test from 'node:test'
import { canSubmitInquiries, readInquiryConfig } from '../services/inquiryConfig'
import { estimateGateway } from '../services/estimateGateway'

test('inquiries stay disconnected by default, even when account fields exist', () => {
  const env = {
    VITE_FIREBASE_API_KEY: 'fixture',
    VITE_FIREBASE_AUTH_DOMAIN: 'fixture',
    VITE_FIREBASE_PROJECT_ID: 'fixture',
    VITE_FIREBASE_APP_ID: 'fixture',
    VITE_RECAPTCHA_ENTERPRISE_SITE_KEY: 'fixture',
  }
  assert.equal(canSubmitInquiries(readInquiryConfig(env)), false)
  assert.equal(
    canSubmitInquiries(readInquiryConfig({ ...env, VITE_INQUIRY_SUBMISSION_ENABLED: 'true' })),
    true,
  )
  assert.equal(
    canSubmitInquiries(
      readInquiryConfig({
        ...env,
        VITE_INQUIRY_SUBMISSION_ENABLED: 'true',
        VITE_FIREBASE_APP_ID: '',
      }),
    ),
    false,
  )
})

test('the actual default gateway rejects submission without any network call', async () => {
  const original = globalThis.fetch
  let calls = 0
  globalThis.fetch = async () => {
    calls++
    throw new Error('Network must stay disconnected')
  }
  try {
    assert.equal(estimateGateway.available, false)
    await assert.rejects(
      estimateGateway.submit(
        {
          name: 'Fixture',
          phone: '9723103255',
          email: '',
          contactMethod: 'phone',
          location: 'Dallas',
          service: '',
          description: 'Test fixture only.',
        },
        [],
        '13acb484-5f7e-4c08-9cdf-027a1874c123',
      ),
      /not connected/,
    )
    assert.equal(calls, 0)
  } finally {
    globalThis.fetch = original
  }
})
