import { useState } from 'react'
import { Maximize2 } from 'lucide-react'
import { designGalleries, designThumbnail } from '../content/designGallery'
import type { DesignGallery } from '../content/designGallery'
import { PhotoLightbox } from './PhotoLightbox'
import '../styles/gallery.css'

function GalleryCategory({ gallery }: { gallery: DesignGallery }) {
  const [selected, setSelected] = useState(0)
  const [open, setOpen] = useState(false)
  const photo = gallery.photos[selected]

  return (
    <article className="projects__tile gallery-category" aria-labelledby={`gallery-${gallery.id}`}>
      <div className="gallery-category-heading">
        <h3 id={`gallery-${gallery.id}`} className="font-heading text-3xl font-bold uppercase">
          {gallery.title}
        </h3>
        <span>
          {selected + 1} / {gallery.photos.length}
        </span>
      </div>
      <button
        type="button"
        className="gallery-featured"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-label={`Open ${gallery.title.toLowerCase()} gallery, image ${selected + 1} of ${gallery.photos.length}`}
      >
        <img src={photo.src} alt={photo.alt} loading="lazy" decoding="async" />
        <span className="gallery-expand" aria-hidden="true">
          <Maximize2 size={20} />
        </span>
        <span className="gallery-image-label">View gallery</span>
      </button>
      <div className="gallery-thumbnails" role="group" aria-label={`${gallery.title} design ideas`}>
        {gallery.photos.map((item, index) => (
          <button
            key={item.id}
            type="button"
            className="gallery-thumbnail"
            aria-label={`Show ${gallery.title.toLowerCase()} image ${index + 1}: ${item.alt}`}
            aria-pressed={selected === index}
            onClick={() => setSelected(index)}
          >
            <img
              src={designThumbnail(item)}
              alt=""
              loading="lazy"
              decoding="async"
              width="320"
              height="240"
            />
          </button>
        ))}
      </div>
      {open && (
        <PhotoLightbox
          photos={gallery.photos}
          initialIndex={selected}
          albumTitle={`${gallery.title} design inspiration`}
          onClose={() => setOpen(false)}
        />
      )}
    </article>
  )
}

export function ProjectShowcase() {
  return (
    <section
      id="projects"
      className="projects scroll-mt-24 bg-ploy-background-primary pb-16 pt-12 md:pb-24 md:pt-16"
      aria-labelledby="projects-heading"
    >
      <div className="mx-auto w-full max-w-7xl px-5 md:px-8">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <h2
            id="projects-heading"
            className="font-heading typography-heading uppercase text-balance text-4xl md:text-5xl text-ploy-text-primary max-w-2xl"
          >
            Remodels. Renovations. Built-ins.
          </h2>
          <p className="font-body typography-body text-pretty text-base text-ploy-text-secondary max-w-sm md:text-right">
            Ideas for the spaces you use every day.
          </p>
        </div>
        <div className="design-gallery-grid">
          {designGalleries.map((gallery) => (
            <GalleryCategory key={gallery.id} gallery={gallery} />
          ))}
        </div>
        <p className="gallery-disclosure">
          AI-generated design inspiration. Actual project photos will be shared separately.
        </p>
      </div>
    </section>
  )
}
