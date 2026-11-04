import { useEffect, useState } from 'react'
import { ArrowUpRight, Menu, Phone, X } from 'lucide-react'
import { business } from '../content/business'
import { FacebookIcon } from './FacebookIcon'

export function SiteNavigation({
  hasProjects,
  hasReviews,
}: {
  hasProjects: boolean
  hasReviews: boolean
}) {
  const [open, setOpen] = useState(false)
  const links = [
    { href: '#services', label: 'Services' },
    ...(hasProjects ? [{ href: '#projects', label: 'Our work' }] : []),
    { href: '#facebook', label: 'Follow our work' },
    ...(hasReviews ? [{ href: '#reviews', label: 'Reviews' }] : []),
    { href: '#service-area', label: 'Service area' },
    { href: '#estimate', label: 'Free estimate' },
  ]
  useEffect(() => {
    const close = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', close)
    return () => window.removeEventListener('keydown', close)
  }, [])
  return (
    <div className="site-navigation">
      <div className="navigation-inner container">
        <nav className="desktop-nav" aria-label="Main navigation">
          {links.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>
        <div className="navigation-actions">
          <a className="navigation-phone" href={business.callUrl}>
            <Phone size={15} />
            {business.phone}
          </a>
          <a
            className="social-icon"
            href={business.facebookUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Henagin Home Improvement on Facebook (opens in new tab)"
          >
            <FacebookIcon />
          </a>
          <button
            className="icon-button menu-toggle"
            aria-label={open ? 'Close navigation' : 'Open navigation'}
            aria-expanded={open}
            aria-controls="mobile-navigation"
            onClick={() => setOpen(!open)}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>
      {open && (
        <nav className="mobile-nav" id="mobile-navigation" aria-label="Mobile navigation">
          {links.map((link) => (
            <a key={link.href} href={link.href} onClick={() => setOpen(false)}>
              {link.label}
              <ArrowUpRight size={16} />
            </a>
          ))}
        </nav>
      )}
    </div>
  )
}
