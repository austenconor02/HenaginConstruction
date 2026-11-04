import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

export async function preparePaintStrips() {
  const source = path.join(root, 'assets/source/paint-strip-banners-original.png')
  const output = path.join(root, 'public/images/paint-strips')
  await mkdir(output, { recursive: true })
  const { data, info } = await sharp(source)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })
  const bands = []
  for (let y = 0; y < info.height; y++) {
    let ink = 0
    for (let x = 0; x < info.width; x++) if (data[(y * info.width + x) * 4 + 3] > 8) ink++
    if (ink <= 8) continue
    const previous = bands.at(-1)
    if (previous && y === previous.bottom + 1) previous.bottom = y
    else bands.push({ top: y, bottom: y })
  }
  if (bands.length !== 3)
    throw new Error(`Expected three separated paint strips; found ${bands.length}.`)
  const assets = []
  for (const [index, band] of bands.entries()) {
    let left = info.width,
      right = 0
    for (let y = band.top; y <= band.bottom; y++) {
      for (let x = 0; x < info.width; x++) {
        if (data[(y * info.width + x) * 4 + 3] > 0) {
          left = Math.min(left, x)
          right = Math.max(right, x)
        }
      }
    }
    const padding = 8
    const crop = { left: Math.max(0, left - padding), top: Math.max(0, band.top - padding) }
    crop.width = Math.min(info.width, right + padding + 1) - crop.left
    crop.height = Math.min(info.height, band.bottom + padding + 1) - crop.top
    const file = `paint-strip-${index + 1}.webp`
    const result = await sharp(source)
      .extract(crop)
      .resize({ width: 1200, withoutEnlargement: true })
      .webp({ lossless: true, effort: 6 })
      .toFile(path.join(output, file))
    assets.push({ file, width: result.width, height: result.height, bytes: result.size, crop })
  }
  console.log(JSON.stringify({ paintStrips: assets }))
  return assets
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url))
  await preparePaintStrips()
