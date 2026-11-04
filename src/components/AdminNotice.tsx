import { useEffect, useRef } from 'react'
import { ArrowLeft, LockKeyhole } from 'lucide-react'

export function AdminNotice() {
  const heading = useRef<HTMLHeadingElement>(null)
  useEffect(() => {
    heading.current?.focus()
  }, [])
  return (
    <main className="admin-notice container" id="main-content">
      <LockKeyhole size={32} strokeWidth={1.5} />
      <p className="eyebrow">HENAGIN HOME IMPROVEMENT</p>
      <h1 ref={heading} tabIndex={-1}>
        Admin access is coming soon.
      </h1>
      <p>The management area is not connected yet.</p>
      <a className="button button-gold" href="#top">
        <ArrowLeft size={17} />
        Back to the website
      </a>
    </main>
  )
}
