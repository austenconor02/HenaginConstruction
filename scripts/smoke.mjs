import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { randomUUID } from 'node:crypto'
import { mkdir, readFile, unlink, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright-core'

// Local browser checks use installed Chrome. They never submit an inquiry,
// contact the reference website, download a browser, or publish any content.
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const base = 'http://127.0.0.1:4326'
const errors = []
const requests = []
const tmp = path.join(root, 'tmp')
await mkdir(tmp, { recursive: true })
const fixtureName = `lightbox-${randomUUID()}.html`
const fixturePath = path.join(tmp, fixtureName)
await writeFile(
  fixturePath,
  `<!doctype html><html lang="en"><head><meta name="viewport" content="width=device-width,initial-scale=1"><title>Lightbox QA fixture</title></head><body><div id="root"></div><script type="module">
import React from 'react';
import {createRoot} from 'react-dom/client';
import {PhotoLightbox} from '/src/components/PhotoLightbox.tsx';
import '/src/styles/reference.css';
import '/src/styles.css';
function Fixture(){const [open,setOpen]=React.useState(false);return React.createElement(React.Fragment,null,
React.createElement('button',{onClick:()=>setOpen(true)},'Open QA gallery'),
open&&React.createElement(PhotoLightbox,{albumTitle:'QA fixture, not a published project',initialIndex:0,
photos:[{id:'one',src:'/images/marketing/remodeling-small.webp',alt:'QA image one'},{id:'two',src:'/images/marketing/painting-small.webp',alt:'QA image two'}],onClose:()=>setOpen(false)}));}
createRoot(document.getElementById('root')).render(React.createElement(React.StrictMode,null,React.createElement(Fixture)));
</script></body></html>`,
)

const server = spawn(
  process.execPath,
  [
    path.join(root, 'node_modules/vite/bin/vite.js'),
    '--host',
    '127.0.0.1',
    '--port',
    '4326',
    '--strictPort',
  ],
  { cwd: root, windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] },
)
let browser

function watch(page) {
  page.on('pageerror', (error) => errors.push(error.message))
  page.on('request', (request) => requests.push({ url: request.url(), method: request.method() }))
}

async function load(page, pathname = '/') {
  const response = await page.goto(`${base}${pathname}`, { waitUntil: 'networkidle' })
  if (response) assert.equal(response.status(), 200)
  await page.evaluate(() => document.fonts.ready)
}

async function noOverflow(page, description) {
  const expectedWidth = page.viewportSize().width
  const dimensions = await page.evaluate(() => ({
    content: document.documentElement.scrollWidth,
    viewport: window.innerWidth,
  }))
  assert.ok(
    dimensions.content <= expectedWidth && dimensions.viewport <= expectedWidth,
    `${description}: expected ${expectedWidth}px, got ${JSON.stringify(dimensions)}`,
  )
}

async function decodeImages(page) {
  const images = await page.evaluate(async () => {
    return Promise.all(
      [...document.images].map(async (image) => {
        image.loading = 'eager'
        try {
          await image.decode()
          return { src: image.getAttribute('src'), loaded: image.naturalWidth > 0 }
        } catch {
          return { src: image.getAttribute('src'), loaded: false }
        }
      }),
    )
  })
  assert.ok(images.length > 0)
  assert.deepEqual(
    images.filter((image) => !image.loaded),
    [],
    'All visible-page images decode',
  )
}

async function anchoredBelowHeader(page, target) {
  try {
    await page.waitForFunction(
      (selector) => {
        const section = document.querySelector(selector)?.getBoundingClientRect()
        const header = document.querySelector('.site-nav')?.getBoundingClientRect()
        return (
          section && header && section.top >= header.bottom - 2 && section.top <= header.bottom + 48
        )
      },
      target,
      { timeout: 5000 },
    )
  } catch {
    const position = await page.evaluate(
      (selector) => ({
        target: selector,
        top: document.querySelector(selector)?.getBoundingClientRect().top,
        headerBottom: document.querySelector('.site-nav')?.getBoundingClientRect().bottom,
        viewport: { width: window.innerWidth, height: window.innerHeight },
        scrollY: window.scrollY,
        documentHeight: document.documentElement.scrollHeight,
        hash: window.location.hash,
      }),
      target,
    )
    assert.fail(`Anchor must clear the sticky header: ${JSON.stringify(position)}`)
  }
}

try {
  await new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('Local preview did not become ready.')), 20_000)
    server.once('error', reject)
    server.once('exit', (code) => {
      clearTimeout(timer)
      reject(new Error(`Preview exited with code ${code}.`))
    })
    server.stdout.on('data', (chunk) => {
      if (String(chunk).includes('Local:')) {
        clearTimeout(timer)
        resolve()
      }
    })
    server.stderr.on('data', (chunk) => {
      if (String(chunk).includes('Error')) console.error(String(chunk))
    })
  })
  browser = await chromium.launch({ channel: 'chrome', headless: true })
  const desktop = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    reducedMotion: 'reduce',
  })
  // Capture the actual email-link handoff without opening an OS email application.
  await desktop.addInitScript(() => {
    window.__estimateMailtos = []
    document.addEventListener(
      'click',
      (event) => {
        const link =
          event.target instanceof Element ? event.target.closest('a[href^="mailto:"]') : null
        if (link) {
          event.preventDefault()
          window.__estimateMailtos.push(link.href)
        }
      },
      true,
    )
  })
  const page = await desktop.newPage()
  watch(page)
  await load(page)
  await page.getByRole('heading', { level: 1 }).waitFor()
  assert.equal(await page.getByRole('heading', { level: 1 }).count(), 1)
  assert.equal(await page.locator('.services__item').count(), 5)
  assert.equal(await page.locator('.projects__tile').count(), 3)
  assert.equal(await page.locator('.built-ins li').count(), 8)
  assert.equal(await page.locator('.exterior__item').count(), 4)
  assert.equal(await page.locator('.gallery-thumbnail').count(), 12)
  const publicCopy = await page.locator('body').innerText()
  assert.doesNotMatch(
    publicCopy,
    /custom homes?|from the ground up|new builds|custom builds|\bADUs\b/i,
  )
  assert.doesNotMatch(await page.title(), /Custom Builds/i)
  assert.equal(
    await page
      .locator('#estimate-service option')
      .getByText('Custom build', { exact: true })
      .count(),
    0,
  )
  assert.equal(await page.locator('#estimate').count(), 1)
  const duplicateIds = await page.locator('[id]').evaluateAll((elements) => {
    const ids = elements.map((element) => element.id)
    return ids.filter((id, index) => ids.indexOf(id) !== index)
  })
  assert.deepEqual(duplicateIds, [])
  assert.equal(await page.locator('iframe').count(), 0)
  await noOverflow(page, 'Desktop')
  await decodeImages(page)
  const fonts = await page.evaluate(() => ({
    heading: document.fonts.check('800 32px "Barlow Condensed"'),
    body: document.fonts.check('400 16px "Hanken Grotesk Variable"'),
    loaded: performance
      .getEntriesByType('resource')
      .filter((entry) => /\/fonts\/reference\//.test(entry.name))
      .map((entry) => entry.name),
  }))
  assert.equal(fonts.heading, true)
  assert.equal(fonts.body, true)
  assert.ok(fonts.loaded.length >= 2, 'Heading and body fonts load locally')
  assert.ok(fonts.loaded.every((url) => url.startsWith(base)))
  await page.screenshot({ path: path.join(tmp, 'desktop.png'), fullPage: true })

  await page.keyboard.press('Tab')
  assert.equal(
    await page.locator('.skip-link').evaluate((element) => element === document.activeElement),
    true,
  )
  await page.keyboard.press('Enter')
  await page.waitForURL('**/#main-content')
  assert.equal(await page.locator('#main-content').count(), 1)
  const reviewTrigger = page.getByRole('button', { name: 'Read full review', exact: true })
  await reviewTrigger.click()
  const reviewDialog = page.getByRole('dialog', { name: 'Clayton Ralston', exact: true })
  await reviewDialog.waitFor()
  assert.ok(
    (await reviewDialog.locator('blockquote').textContent()).includes(
      'Adam and his team did an excellent job blowing in insulation into my home! The upstairs was around 82 degrees at noon and now everything is sitting around 74 degrees! From my family to yours Adam we genuinely thank you!',
    ),
  )
  await page.keyboard.press('Escape')
  assert.equal(await reviewDialog.count(), 0)
  assert.equal(await reviewTrigger.evaluate((element) => element === document.activeElement), true)
  await page
    .locator('.review-window-controls')
    .getByRole('button', { name: 'Dismiss customer reviews' })
    .click()
  for (const category of await page.locator('.gallery-category').all()) {
    const thumbnails = category.locator('.gallery-thumbnail')
    assert.equal(await thumbnails.count(), 4)
    await thumbnails.nth(3).click()
    assert.equal(await thumbnails.nth(3).getAttribute('aria-pressed'), 'true')
    await category.locator('.gallery-featured img').evaluate((image) => image.decode())
    await category.locator('.gallery-featured').click()
    await page.getByRole('dialog').waitFor()
    assert.equal(await page.locator('.lightbox-header p').textContent(), '4 / 4')
    await page.getByRole('button', { name: 'Next photo', exact: true }).click()
    assert.equal(await page.locator('.lightbox-header p').textContent(), '1 / 4')
    await page.keyboard.press('Escape')
    assert.equal(await page.getByRole('dialog').count(), 0)
    assert.equal(
      await category
        .locator('.gallery-featured')
        .evaluate((element) => element === document.activeElement),
      true,
    )
  }
  await page.setViewportSize({ width: 320, height: 844 })
  await page.evaluate(() => document.fonts.ready)
  await page.evaluate(
    () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))),
  )
  await noOverflow(page, 'Desktop browser resized to 320px after gallery use')
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page
    .getByRole('navigation', { name: 'Main', exact: true })
    .getByRole('link', { name: 'Built-ins', exact: true })
    .click()
  await anchoredBelowHeader(page, '#built-ins')
  await page
    .getByRole('navigation', { name: 'Main', exact: true })
    .getByRole('link', { name: 'Contact', exact: true })
    .click()
  await anchoredBelowHeader(page, '#estimate')

  assert.match(await page.locator('#form-availability').textContent(), /Opens your email app/)
  const submit = page.getByRole('button', { name: 'Email my estimate request', exact: true })
  await submit.click()
  assert.equal(await page.locator('[aria-invalid="true"]').count(), 4)
  await page.waitForFunction(() => document.activeElement?.id === 'estimate-name')
  assert.match(await page.locator('.form-notice').textContent(), /Nothing has been sent/)
  await page.locator('#estimate-name').fill('QA visitor')
  await page.locator('#estimate-phone').fill('9725550123')
  await page
    .locator('#estimate-description')
    .fill('QA only. Test the local disconnected estimate form.')
  await page.locator('#estimate-service').selectOption('built-ins')
  await submit.click()
  assert.equal(await page.locator('[aria-invalid="true"]').count(), 0)
  assert.match(
    await page.locator('.form-notice').textContent(),
    /Nothing has been sent automatically/,
  )
  let mailtos = await page.evaluate(() => window.__estimateMailtos)
  assert.equal(mailtos.length, 1)
  let emailDraft = new URL(mailtos[0])
  assert.equal(emailDraft.pathname, 'austenconor02@gmail.com')
  assert.match(emailDraft.searchParams.get('body'), /Project type: Built-ins/)
  assert.match(emailDraft.searchParams.get('body'), /Phone: 9725550123/)

  await page.locator('#estimate-service').selectOption('remodeling')
  await page.locator('#estimate-description').fill('x'.repeat(5000))
  await page.locator('#estimate-service').selectOption('built-ins')
  await submit.click()
  assert.equal(await page.locator('#estimate-description').getAttribute('aria-invalid'), 'true')
  assert.match(await page.locator('.form-notice').textContent(), /Nothing has been sent/)
  await page.locator('#estimate-description').fill('QA only. Local built-in estimate preview.')
  await submit.click()
  assert.equal(await page.locator('[aria-invalid="true"]').count(), 0)

  await page.getByText('Add project location and photos', { exact: true }).click()
  assert.equal(await page.locator('#estimate-location').isVisible(), true)
  await page.locator('#estimate-contactMethod').selectOption('email')
  await page.locator('#estimate-phone').fill('')
  await page.locator('#estimate-email').fill('invalid-email')
  await submit.click()
  assert.equal(await page.locator('#estimate-email').getAttribute('aria-invalid'), 'true')
  await page.locator('#estimate-email').fill('qa@example.com')
  await submit.click()
  assert.equal(await page.locator('[aria-invalid="true"]').count(), 0)
  assert.match(
    await page.locator('.form-notice').textContent(),
    /Nothing has been sent automatically/,
  )

  const buffer = await readFile(path.join(root, 'public/images/marketing/remodeling-small.webp'))
  await page.locator('#estimate-photos').setInputFiles(
    Array.from({ length: 6 }, (_, index) => ({
      name: `qa-${index}.webp`,
      mimeType: 'image/webp',
      buffer,
    })),
  )
  assert.equal(await page.locator('.photo-previews li').count(), 5)
  assert.match(await page.locator('.photo-errors').textContent(), /up to five/)
  assert.equal(await page.locator('#estimate-photos').isDisabled(), true)
  await page.locator('.photo-previews button').first().click()
  assert.equal(await page.locator('.photo-previews li').count(), 4)
  assert.equal(await page.locator('#estimate-photos').isEnabled(), true)
  await page.locator('#estimate-location').fill('Dallas 75201')
  await submit.click()
  mailtos = await page.evaluate(() => window.__estimateMailtos)
  emailDraft = new URL(mailtos.at(-1))
  assert.match(emailDraft.searchParams.get('body'), /Email: qa@example\.com/)
  assert.match(emailDraft.searchParams.get('body'), /Preferred contact: Email/)
  assert.match(emailDraft.searchParams.get('body'), /City or ZIP code: Dallas 75201/)
  assert.match(
    emailDraft.searchParams.get('body'),
    /Photos selected \(attach manually before sending\)/,
  )
  assert.match(emailDraft.searchParams.get('body'), /qa-1\.webp/)
  assert.doesNotMatch(emailDraft.searchParams.get('body'), /qa-0\.webp/)
  assert.equal(await page.getByRole('button', { name: 'Request received', exact: true }).count(), 0)
  await page.locator('#estimate-photos').setInputFiles({
    name: 'too-large.webp',
    mimeType: 'image/webp',
    buffer: Buffer.alloc(10 * 1024 * 1024 + 1),
  })
  assert.equal(await page.locator('.photo-previews li').count(), 4)
  assert.match(await page.locator('.photo-errors').textContent(), /10 MB/)
  await page.locator('#estimate-photos').setInputFiles({
    name: 'unsupported.txt',
    mimeType: 'text/plain',
    buffer: Buffer.from('QA unsupported file'),
  })
  assert.match(
    await page.locator('.photo-errors').textContent(),
    /choose a JPG, PNG, WebP, or AVIF/,
  )
  await page.locator('#estimate-photos').setInputFiles({
    name: 'empty.webp',
    mimeType: 'image/webp',
    buffer: Buffer.alloc(0),
  })
  assert.match(await page.locator('.photo-errors').textContent(), /empty/)
  assert.equal(
    requests.some((request) => request.method === 'POST'),
    false,
    'Email-app fallback submits no web requests',
  )
  await page.reload({ waitUntil: 'networkidle' })
  assert.equal(await page.locator('#estimate-name').inputValue(), '')
  assert.equal(await page.locator('.photo-previews li').count(), 0)

  const mobile = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    deviceScaleFactor: 1,
    reducedMotion: 'reduce',
  })
  const mobilePage = await mobile.newPage()
  watch(mobilePage)
  await load(mobilePage)
  await decodeImages(mobilePage)
  await noOverflow(mobilePage, 'Mobile 390')
  await mobilePage.screenshot({ path: path.join(tmp, 'mobile.png'), fullPage: true })
  const menu = mobilePage.getByRole('button', { name: 'Open menu', exact: true })
  await menu.click()
  assert.equal(
    await mobilePage.getByRole('navigation', { name: 'Mobile', exact: true }).isVisible(),
    true,
  )
  await mobilePage.keyboard.press('Escape')
  assert.equal(await mobilePage.locator('#site-nav-menu').count(), 0)
  assert.equal(await menu.evaluate((element) => element === document.activeElement), true)
  for (const [label, target] of [
    ['Built-ins', '#built-ins'],
    ['Contact', '#estimate'],
  ]) {
    await menu.click()
    await mobilePage
      .getByRole('navigation', { name: 'Mobile', exact: true })
      .getByRole('link', { name: label, exact: true })
      .click()
    assert.equal(await mobilePage.locator('#site-nav-menu').count(), 0)
    await anchoredBelowHeader(mobilePage, target)
  }
  await mobilePage.locator('.estimate-form').screenshot({ path: path.join(tmp, 'mobile-form.png') })
  await menu.click()
  await mobilePage.getByRole('button', { name: 'Close menu', exact: true }).click()
  assert.equal(await mobilePage.locator('#site-nav-menu').count(), 0)

  for (const width of [320, 768]) {
    await mobilePage.setViewportSize({ width, height: 1000 })
    await load(mobilePage)
    await noOverflow(mobilePage, `Responsive width ${width}`)
    await menu.click()
    await noOverflow(mobilePage, `Open menu width ${width}`)
    await mobilePage.keyboard.press('Escape')
    await mobilePage.getByRole('link', { name: 'Get a free estimate', exact: true }).first().click()
    await anchoredBelowHeader(mobilePage, '#estimate')
    await noOverflow(mobilePage, `Estimate width ${width}`)
  }

  await load(page, '/#admin')
  await page.getByRole('heading', { name: 'Admin access is coming soon.' }).waitFor()
  await page.getByRole('link', { name: 'Back to the website' }).click()
  await page.getByRole('heading', { level: 1, name: /Home.*remodeling/i }).waitFor()

  await load(page, `/tmp/${fixtureName}`)
  await page.getByRole('button', { name: 'Open QA gallery' }).click()
  await page.getByRole('dialog').waitFor()
  assert.equal(await page.evaluate(() => document.body.style.overflow), 'hidden')
  await page.keyboard.press('ArrowRight')
  assert.equal(await page.locator('.lightbox-header p').textContent(), '2 / 2')
  await page.keyboard.press('ArrowLeft')
  assert.equal(await page.locator('.lightbox-header p').textContent(), '1 / 2')
  await page.getByRole('button', { name: 'Zoom in', exact: true }).click()
  assert.equal(await page.locator('.lightbox-tools>span').textContent(), '150%')
  await page.getByRole('button', { name: 'Reset zoom' }).click()
  const area = await page.locator('.lightbox-image-area').boundingBox()
  assert.ok(area && area.width > 200 && area.height > 200)
  await page.mouse.move(area.x + area.width * 0.7, area.y + area.height / 2)
  await page.mouse.down()
  await page.mouse.move(area.x + area.width * 0.3, area.y + area.height / 2, { steps: 4 })
  await page.mouse.up()
  assert.equal(await page.locator('.lightbox-header p').textContent(), '2 / 2')
  await page.keyboard.press('Escape')
  assert.equal(await page.getByRole('dialog').count(), 0)
  assert.equal(await page.evaluate(() => document.activeElement.textContent), 'Open QA gallery')
  assert.equal(await page.evaluate(() => document.body.style.overflow), '')

  assert.deepEqual(errors, [])
  assert.deepEqual(
    requests.filter(({ url }) => !url.startsWith(base) && !url.startsWith('blob:')),
    [],
    'All runtime assets and requests stay local',
  )
  console.log(
    'PASS: desktop/mobile/320px/tablet layouts, reference sections, local fonts and images, unique anchors, skip link, sticky-header navigation, menu keyboard behavior, estimate email-app handoff/no automatic submission, optional details, photo limits/rejections, admin placeholder, and lightbox keyboard/zoom/swipe/focus. Screenshots: tmp/desktop.png, tmp/mobile.png, tmp/mobile-form.png.',
  )
} finally {
  await browser?.close()
  server.kill()
  await unlink(fixturePath).catch(() => {})
}
