import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const output = path.join(root, 'public/images/gallery')
const assets = [
  'kitchen-cream-oak',
  'kitchen-sage-walnut',
  'kitchen-bright-galley',
  'bathroom-oak-walk-in',
  'bathroom-classic-tub',
  'bathroom-sage-vanity',
  'built-in-oak-office',
  'built-in-window-library',
  'built-in-navy-mudroom',
]
const originals = [
  ['kitchen-blue-island', 'ai-henagin-kitchen-remodel-261104163654.webp'],
  ['bathroom-gray-shower', 'ai-henagin-bathroom-remodel-261104163701.webp'],
  ['built-in-fireplace', 'ai-henagin-living-room-built-ins-261104163703.webp'],
]
await mkdir(output, { recursive: true })
const manifest = []
for (const name of assets) {
  const source = path.join(root, 'assets/generated/gallery', `${name}.png`)
  const full = await sharp(source)
    .resize({ width: 1440, withoutEnlargement: true })
    .webp({ quality: 84 })
    .toFile(path.join(output, `${name}.webp`))
  await sharp(source)
    .resize(320, 240, { fit: 'cover' })
    .webp({ quality: 80 })
    .toFile(path.join(output, `${name}-thumb.webp`))
  manifest.push({
    id: name,
    src: `/images/gallery/${name}.webp`,
    thumbnail: `/images/gallery/${name}-thumb.webp`,
    width: full.width,
    height: full.height,
    role: 'AI-generated design inspiration',
  })
}
for (const [id, filename] of originals) {
  await sharp(path.join(root, 'public/images/reference', filename))
    .resize(320, 240, { fit: 'cover' })
    .webp({ quality: 80 })
    .toFile(path.join(output, `${id}-thumb.webp`))
}
await writeFile(path.join(output, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n')
console.log(
  `Prepared ${assets.length} gallery images and ${assets.length + originals.length} thumbnails.`,
)
