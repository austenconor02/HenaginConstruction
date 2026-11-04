import test from 'node:test'
import assert from 'node:assert/strict'
import { estimateEmailUrl } from './estimateEmail'
import type { EstimateDraft } from '../types/content'

const draft: EstimateDraft = {
  name: 'Jamie & Alex',
  phone: '(972) 555-0123',
  email: 'jamie+home@example.com',
  contactMethod: 'text',
  location: 'Dallas 75201',
  service: 'custom-builds',
  description: 'Built-ins & shelves?\nUse 20% more storage. #home',
}

test('email draft preserves contact, project type, special characters, and manual photo instructions', () => {
  const url = new URL(
    estimateEmailUrl('austenconor02@gmail.com', draft, 'Built-ins', ['living room & shelves.webp']),
  )
  assert.equal(url.protocol, 'mailto:')
  assert.equal(url.pathname, 'austenconor02@gmail.com')
  assert.equal(
    url.searchParams.get('subject'),
    'Henagin Home Improvement estimate request: Built-ins',
  )
  const body = url.searchParams.get('body')!
  assert.match(body, /Name: Jamie & Alex/)
  assert.match(body, /Phone: \(972\) 555-0123/)
  assert.match(body, /Email: jamie\+home@example.com/)
  assert.match(body, /Preferred contact: Text message/)
  assert.match(body, /City or ZIP code: Dallas 75201/)
  assert.match(body, /Project type: Built-ins/)
  assert.ok(body.includes(draft.description))
  assert.match(body, /attach manually before sending/)
  assert.match(body, /living room & shelves\.webp/)
  assert.match(body, /has not sent this request or attached any photos/)
  assert.equal([...url.searchParams.keys()].length, 2)
})

test('email-only draft marks omitted optional fields and does not claim file attachment', () => {
  const url = new URL(
    estimateEmailUrl(
      'austenconor02@gmail.com',
      { ...draft, phone: '', location: '', contactMethod: 'email' },
      'Painting',
    ),
  )
  const body = url.searchParams.get('body')!
  assert.match(body, /Phone: Not provided/)
  assert.match(body, /City or ZIP code: Not provided/)
  assert.match(body, /Preferred contact: Email/)
  assert.match(body, /No photos selected/)
  assert.doesNotMatch(body, /Photos selected \(attach manually/)
})
