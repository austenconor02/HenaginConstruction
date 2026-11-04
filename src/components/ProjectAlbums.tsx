import { useState } from 'react'
import { ArrowUpRight, Images } from 'lucide-react'
import type { ProjectAlbum } from '../types/content'
import { PhotoLightbox } from './PhotoLightbox'

export function AlbumCard({ album, onOpen }: { album: ProjectAlbum; onOpen: () => void }) {
  return (
    <button
      className="album-card"
      onClick={onOpen}
      aria-label={`View ${album.title}, ${album.photos.length} photos`}
    >
      <div className="album-cover">
        <img src={album.photos[0].src} alt={album.photos[0].alt} loading="lazy" />
        <span>
          <Images size={15} />
          {album.photos.length} photos
        </span>
      </div>
      <div className="album-details">
        <div>
          <h3>{album.title}</h3>
          {album.location && <span>{album.location}</span>}
          <p>{album.description}</p>
        </div>
        <ArrowUpRight size={22} />
      </div>
    </button>
  )
}

export function ProjectAlbums({ albums }: { albums: ProjectAlbum[] }) {
  const [active, setActive] = useState<ProjectAlbum | null>(null)
  const published = albums.filter((album) => album.published && album.photos.length)
  if (!published.length) return null
  return (
    <section className="section container" id="projects" aria-labelledby="projects-heading">
      <div className="section-heading">
        <div>
          <p className="eyebrow">A CLOSER LOOK</p>
          <h2 id="projects-heading">Our work, in the details.</h2>
        </div>
        <p>Explore our project albums.</p>
      </div>
      <div className="album-grid">
        {published.map((album) => (
          <AlbumCard key={album.id} album={album} onOpen={() => setActive(album)} />
        ))}
      </div>
      {active && (
        <PhotoLightbox
          key={active.id}
          albumTitle={active.title}
          photos={active.photos}
          initialIndex={0}
          onClose={() => setActive(null)}
        />
      )}
    </section>
  )
}
