import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'
import { prepareLogo } from './prepare-logo.mjs'
import { preparePaintStrips } from './prepare-paint-strips.mjs'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const source = path.join(root, 'assets/source')
const output = path.join(root, 'public/images')
await mkdir(path.join(output, 'marketing'), { recursive: true })

const logo = await prepareLogo()
const paintStrips = await preparePaintStrips()

// Exact flat-top hexagon geometry; six columns/eight rows make a seamless tile.
// No lettering, tools, or branding are part of the background texture.
const radius = 28
const h = Math.sqrt(3) * radius
const width = radius * 9
const height = h * 8
const outlines = []
for (let column = -1; column <= 7; column++) {
  for (let row = -1; row <= 9; row++) {
    const cx = column * 1.5 * radius
    const cy = row * h + (column % 2 ? h / 2 : 0)
    const points = Array.from({ length: 6 }, (_, index) => {
      const angle = (index * Math.PI) / 3
      return `${(cx + radius * Math.cos(angle)).toFixed(4)},${(cy + radius * Math.sin(angle)).toFixed(4)}`
    }).join(' ')
    outlines.push(`<polygon points="${points}"/>`)
  }
}
const texture = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><g fill="none" stroke="#ffffff" stroke-width="0.8">${outlines.join('')}</g></svg>`
// Higher raster resolution retains fine linework at varying pixel densities.
await sharp(Buffer.from(texture))
  .resize(1008, 1552)
  .webp({ lossless: true, effort: 6 })
  .toFile(path.join(output, 'hexagons.webp'))

for (const scene of ['remodeling', 'painting', 'exterior']) {
  for (const [size, suffix] of [
    [1440, ''],
    [640, '-small'],
  ]) {
    await sharp(path.join(source, `${scene}.png`))
      .resize({ width: size, withoutEnlargement: true })
      .webp({ quality: 82, effort: 6 })
      .toFile(path.join(output, 'marketing', `${scene}${suffix}.webp`))
  }
}
await writeFile(
  path.join(output, 'asset-manifest.json'),
  JSON.stringify(
    {
      logo,
      paintStrips,
      texture: { method: 'Programmatic flat-top hexagon outlines', displayOpacity: 0.05 },
      marketing: {
        method: 'Built-in image_gen',
        disclosure: 'AI-generated marketing illustrations, not actual project photographs.',
        scenes: ['remodeling', 'painting', 'exterior'],
      },
    },
    null,
    2,
  ) + '\n',
)
console.log(
  'Prepared the no-phone logo, three paint strips, honeycomb texture, and marketing WebPs.',
)
