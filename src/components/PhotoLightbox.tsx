import { useEffect, useRef, useState } from 'react'
import type { PointerEvent as ReactPointerEvent } from 'react'
import { ChevronLeft, ChevronRight, RotateCcw, X, ZoomIn, ZoomOut } from 'lucide-react'
import type { ProjectPhoto } from '../types/content'
import '../styles/lightbox.css'

interface Props {
  photos: ProjectPhoto[]
  initialIndex: number
  albumTitle: string
  onClose: () => void
}

export function PhotoLightbox({ photos, initialIndex, albumTitle, onClose }: Props) {
  const dialog = useRef<HTMLDialogElement>(null)
  const [index, setIndex] = useState(Math.max(0, Math.min(initialIndex, photos.length - 1)))
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [failed, setFailed] = useState(false)
  const start = useRef<{ x: number; y: number; panX: number; panY: number } | null>(null)
  const photo = photos[index]

  function changePhoto(direction: number) {
    setIndex((previous) => (previous + direction + photos.length) % photos.length)
    setZoom(1)
    setPan({ x: 0, y: 0 })
    setFailed(false)
  }

  useEffect(() => {
    const element = dialog.current
    if (!element) return
    const focused = document.activeElement as HTMLElement | null
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    element.showModal()
    return () => {
      element.close()
      document.body.style.overflow = overflow
      focused?.focus({ preventScroll: true })
    }
  }, [])

  function pointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if (event.pointerType === 'mouse' && event.button !== 0) return
    start.current = { x: event.clientX, y: event.clientY, panX: pan.x, panY: pan.y }
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  function pointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    if (!start.current || zoom === 1) return
    const bounds = event.currentTarget.getBoundingClientRect()
    setPan({
      x: Math.max(
        (-bounds.width * (zoom - 1)) / 2,
        Math.min(
          (bounds.width * (zoom - 1)) / 2,
          start.current.panX + event.clientX - start.current.x,
        ),
      ),
      y: Math.max(
        (-bounds.height * (zoom - 1)) / 2,
        Math.min(
          (bounds.height * (zoom - 1)) / 2,
          start.current.panY + event.clientY - start.current.y,
        ),
      ),
    })
  }

  function pointerUp(event: ReactPointerEvent<HTMLDivElement>) {
    const origin = start.current
    start.current = null
    if (event.currentTarget.hasPointerCapture(event.pointerId))
      event.currentTarget.releasePointerCapture(event.pointerId)
    if (origin && zoom === 1) {
      const distanceX = event.clientX - origin.x
      const distanceY = event.clientY - origin.y
      if (
        Math.abs(distanceX) > 50 &&
        Math.abs(distanceX) > Math.abs(distanceY) &&
        photos.length > 1
      )
        changePhoto(distanceX < 0 ? 1 : -1)
    }
  }

  function adjustZoom(value: number) {
    setZoom(Math.max(1, Math.min(3, value)))
    setPan({ x: 0, y: 0 })
  }

  if (!photo) return null
  return (
    <dialog
      className="lightbox"
      ref={dialog}
      aria-labelledby="lightbox-title"
      onCancel={(event) => {
        event.preventDefault()
        onClose()
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
      onKeyDown={(event) => {
        if (event.key === 'ArrowLeft' && photos.length > 1) {
          event.preventDefault()
          changePhoto(-1)
        }
        if (event.key === 'ArrowRight' && photos.length > 1) {
          event.preventDefault()
          changePhoto(1)
        }
        if (event.key === '+' || event.key === '=') {
          event.preventDefault()
          adjustZoom(zoom + 0.5)
        }
        if (event.key === '-') {
          event.preventDefault()
          adjustZoom(zoom - 0.5)
        }
        if (event.key === '0') {
          event.preventDefault()
          adjustZoom(1)
        }
      }}
    >
      <div className="lightbox-shell">
        <header className="lightbox-header">
          <div>
            <h2 id="lightbox-title">{albumTitle}</h2>
            <p aria-live="polite">
              {index + 1} / {photos.length}
            </p>
          </div>
          <div className="lightbox-tools">
            <button
              className="icon-button"
              onClick={() => adjustZoom(zoom - 0.5)}
              disabled={zoom <= 1}
              aria-label="Zoom out"
            >
              <ZoomOut size={21} />
            </button>
            <span aria-live="polite">{Math.round(zoom * 100)}%</span>
            <button
              className="icon-button"
              onClick={() => adjustZoom(zoom + 0.5)}
              disabled={zoom >= 3}
              aria-label="Zoom in"
            >
              <ZoomIn size={21} />
            </button>
            <button className="icon-button" onClick={() => adjustZoom(1)} aria-label="Reset zoom">
              <RotateCcw size={19} />
            </button>
            <button
              className="icon-button"
              onClick={onClose}
              aria-label="Close photo viewer"
              autoFocus
            >
              <X />
            </button>
          </div>
        </header>
        <div className="lightbox-stage">
          <button
            className="icon-button lightbox-previous"
            onClick={() => changePhoto(-1)}
            disabled={photos.length < 2}
            aria-label="Previous photo"
          >
            <ChevronLeft size={28} />
          </button>
          <div
            className={`lightbox-image-area ${zoom > 1 ? 'is-zoomed' : ''}`}
            onPointerDown={pointerDown}
            onPointerMove={pointerMove}
            onPointerUp={pointerUp}
            onPointerCancel={() => {
              start.current = null
            }}
            onDoubleClick={() => adjustZoom(zoom === 1 ? 2 : 1)}
          >
            {failed ? (
              <p role="status">This photo could not be loaded. Try another photo.</p>
            ) : (
              <img
                key={photo.id}
                src={photo.src}
                alt={photo.alt}
                style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}
                draggable={false}
                onError={() => setFailed(true)}
              />
            )}
          </div>
          <button
            className="icon-button lightbox-next"
            onClick={() => changePhoto(1)}
            disabled={photos.length < 2}
            aria-label="Next photo"
          >
            <ChevronRight size={28} />
          </button>
        </div>
        <footer className="lightbox-footer">
          <p>{photo.caption || photo.alt}</p>
          <span>Swipe or use ← → to browse · + / − to zoom · Esc to close</span>
        </footer>
      </div>
    </dialog>
  )
}
