import type { ProjectPhoto } from '../types/content'

export interface DesignGallery {
  id: 'kitchens' | 'bathrooms' | 'built-ins'
  title: string
  photos: ProjectPhoto[]
}

// Generated design inspiration, kept separate from approved customer project albums.
export const designGalleries: DesignGallery[] = [
  {
    id: 'kitchens',
    title: 'Kitchens',
    photos: [
      {
        id: 'kitchen-blue-island',
        src: '/images/reference/ai-henagin-kitchen-remodel-261104163654.webp',
        alt: 'Kitchen design with a blue island, white quartz counters and black pendant lights',
      },
      {
        id: 'kitchen-cream-oak',
        src: '/images/gallery/kitchen-cream-oak.webp',
        alt: 'Kitchen design with cream shaker cabinets, an oak island and brass details',
      },
      {
        id: 'kitchen-sage-walnut',
        src: '/images/gallery/kitchen-sage-walnut.webp',
        alt: 'Kitchen design with sage cabinets, a walnut island and warm white tile',
      },
      {
        id: 'kitchen-bright-galley',
        src: '/images/gallery/kitchen-bright-galley.webp',
        alt: 'Compact galley kitchen design with white upper cabinets and oak lower cabinets',
      },
    ],
  },
  {
    id: 'bathrooms',
    title: 'Bathrooms',
    photos: [
      {
        id: 'bathroom-gray-shower',
        src: '/images/reference/ai-henagin-bathroom-remodel-261104163701.webp',
        alt: 'Bathroom design with a glass walk-in shower, gray tile and wood vanity',
      },
      {
        id: 'bathroom-oak-walk-in',
        src: '/images/gallery/bathroom-oak-walk-in.webp',
        alt: 'Bathroom design with an oak vanity, beige tile and a glass walk-in shower',
      },
      {
        id: 'bathroom-classic-tub',
        src: '/images/gallery/bathroom-classic-tub.webp',
        alt: 'Bathroom design with a freestanding tub, greige vanity and brass fixtures',
      },
      {
        id: 'bathroom-sage-vanity',
        src: '/images/gallery/bathroom-sage-vanity.webp',
        alt: 'Small bathroom design with a sage vanity, arched mirror and cream tile',
      },
    ],
  },
  {
    id: 'built-ins',
    title: 'Built-ins',
    photos: [
      {
        id: 'built-in-fireplace',
        src: '/images/reference/ai-henagin-living-room-built-ins-261104163703.webp',
        alt: 'Living room design with illuminated shelves framing a fireplace',
      },
      {
        id: 'built-in-oak-office',
        src: '/images/gallery/built-in-oak-office.webp',
        alt: 'Home office design with a fitted oak desk and white built-in bookshelves',
      },
      {
        id: 'built-in-window-library',
        src: '/images/gallery/built-in-window-library.webp',
        alt: 'Library design with white built-in shelves and a window seat with hidden drawers',
      },
      {
        id: 'built-in-navy-mudroom',
        src: '/images/gallery/built-in-navy-mudroom.webp',
        alt: 'Mudroom design with navy built-in storage, an oak bench and brass pulls',
      },
    ],
  },
]

export function designThumbnail(photo: ProjectPhoto): string {
  return `/images/gallery/${photo.id}-thumb.webp`
}
