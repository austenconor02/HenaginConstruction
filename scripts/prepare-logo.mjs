import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

export async function prepareLogo() {
  const source = path.join(root, 'assets/source/logo-no-phone-original.png')
  const { data, info } = await sharp(source)
    .flatten({ background: '#000000' })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })
  let left = info.width,
    top = info.height,
    right = 0,
    bottom = 0
  for (let y = 0; y < info.height; y++) {
    for (let x = 0; x < info.width; x++) {
      const pixel = (y * info.width + x) * info.channels
      if (Math.max(data[pixel], data[pixel + 1], data[pixel + 2]) > 20) {
        left = Math.min(left, x)
        right = Math.max(right, x)
        top = Math.min(top, y)
        bottom = Math.max(bottom, y)
      }
    }
  }

  // The supplied PNG's outer background contains almost-black RGB noise.
  // Normalize only near-black pixels connected to the outside, so the edge
  // meets the #000 header. All visible artwork/color pixels are retained.
  const visited = new Uint8Array(info.width * info.height)
  const queue = new Uint32Array(visited.length)
  let head = 0,
    tail = 0
  function enqueue(x, y) {
    if (x < 0 || y < 0 || x >= info.width || y >= info.height) return
    const index = y * info.width + x
    if (visited[index]) return
    visited[index] = 1
    queue[tail++] = index
  }
  for (let x = 0; x < info.width; x++) {
    enqueue(x, 0)
    enqueue(x, info.height - 1)
  }
  for (let y = 0; y < info.height; y++) {
    enqueue(0, y)
    enqueue(info.width - 1, y)
  }
  while (head < tail) {
    const index = queue[head++]
    const pixel = index * info.channels
    if (Math.max(data[pixel], data[pixel + 1], data[pixel + 2]) > 6) continue
    data[pixel] = 0
    data[pixel + 1] = 0
    data[pixel + 2] = 0
    const x = index % info.width,
      y = Math.floor(index / info.width)
    enqueue(x - 1, y)
    enqueue(x + 1, y)
    enqueue(x, y - 1)
    enqueue(x, y + 1)
  }

  const padding = 16
  left = Math.max(0, left - padding)
  top = Math.max(0, top - padding)
  right = Math.min(info.width - 1, right + padding)
  bottom = Math.min(info.height - 1, bottom + padding)
  const crop = { left, top, width: right - left + 1, height: bottom - top + 1 }
  const logo = sharp(data, {
    raw: { width: info.width, height: info.height, channels: info.channels },
  }).extract(crop)
  const output = path.join(root, 'public/images/logo-no-phone.webp')
  await mkdir(path.dirname(output), { recursive: true })
  const result = await logo
    .clone()
    .resize({ width: 800, withoutEnlargement: true })
    .webp({ lossless: true, effort: 6 })
    .toFile(output)
  await logo
    .clone()
    .resize({ width: 192, withoutEnlargement: true })
    .png()
    .toFile(path.join(root, 'public/favicon.png'))
  const metadata = {
    source:
      'Supplied no-phone PNG; exterior padding cropped, near-black exterior matched to #000, artwork proportionally resized.',
    file: 'logo-no-phone.webp',
    crop,
    width: result.width,
    height: result.height,
    bytes: result.size,
    brandYellow: '#fed904',
  }
  console.log(JSON.stringify(metadata))
  return metadata
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url))
  await prepareLogo()
