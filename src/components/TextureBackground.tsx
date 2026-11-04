import { useEffect, useRef } from 'react'

export function TextureBackground() {
  const texture = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const surface = texture.current?.closest<HTMLElement>('.main-surface')
    const motion = window.matchMedia(
      '(pointer: fine) and (min-width: 900px) and (prefers-reduced-motion: no-preference)',
    )
    let frame = 0
    const move = (event: PointerEvent) => {
      if (!motion.matches) return
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const x = (event.clientX / window.innerWidth - 0.5) * 14
        const y = (event.clientY / window.innerHeight - 0.5) * 14
        if (texture.current) texture.current.style.transform = `translate3d(${x}px, ${y}px, 0)`
      })
    }
    const reset = () => {
      if (texture.current) texture.current.style.transform = 'translate3d(0, 0, 0)'
    }
    surface?.addEventListener('pointermove', move, { passive: true })
    surface?.addEventListener('pointerleave', reset)
    motion.addEventListener('change', reset)
    return () => {
      surface?.removeEventListener('pointermove', move)
      surface?.removeEventListener('pointerleave', reset)
      motion.removeEventListener('change', reset)
      cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <div className="texture-clip" aria-hidden="true">
      <div className="hex-texture" ref={texture} />
    </div>
  )
}
