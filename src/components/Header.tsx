import { useEffect, useRef, useState } from 'react'
import { business } from '../content/business'

const links = [
  ['Services', 'services'],
  ['Built-ins', 'built-ins'],
  ['Projects', 'projects'],
  ['About', 'about'],
  ['Contact', 'estimate'],
] as const

function PhoneIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-5"
      aria-hidden="true"
    >
      <path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384" />
    </svg>
  )
}

export function Header() {
  const [open, setOpen] = useState(false)
  const toggle = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const close = () => setOpen(false)
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && open) {
        setOpen(false)
        toggle.current?.focus()
      }
    }
    const desktop = window.matchMedia('(min-width: 1024px)')
    window.addEventListener('hashchange', close)
    window.addEventListener('keydown', escape)
    desktop.addEventListener('change', close)
    return () => {
      window.removeEventListener('hashchange', close)
      window.removeEventListener('keydown', escape)
      desktop.removeEventListener('change', close)
    }
  }, [open])

  return (
    <header className="site-nav sticky top-0 z-50 border-b border-ploy-border-primary bg-ploy-background-primary/95 backdrop-blur">
      <div className="mx-auto w-full max-w-7xl px-5 md:px-8 flex h-20 items-center justify-between gap-6 md:h-24">
        <a href="/" className="site-nav__logo shrink-0" aria-label="Henagin Home Improvement home">
          <img
            src="/images/reference/ai-henagin-home-improvement-logo-261104163705.webp"
            alt="Henagin Home Improvement"
            width="1254"
            height="1254"
            className="w-auto h-[4.5rem] md:h-[5.5rem]"
          />
        </a>
        <nav aria-label="Main" className="site-nav__links hidden items-center gap-9 lg:flex">
          {links.map(([label, id]) => (
            <a
              key={id}
              href={`/#${id}`}
              className="text-base font-semibold text-ploy-text-primary transition-colors hover:text-ploy-accent-primary"
            >
              {label}
            </a>
          ))}
        </nav>
        <a
          href={business.callUrl}
          className="site-nav__phone hidden items-center gap-2 font-heading text-2xl font-bold text-ploy-accent-primary lg:flex"
        >
          <PhoneIcon />
          972-310-3255
        </a>
        <div className="flex items-center gap-2 lg:hidden">
          <a
            href={business.callUrl}
            aria-label="Call 972-310-3255"
            className="flex size-11 items-center justify-center text-ploy-accent-primary"
          >
            <PhoneIcon />
          </a>
          <button
            ref={toggle}
            type="button"
            className="flex size-11 items-center justify-center text-ploy-text-primary"
            aria-expanded={open}
            aria-controls="site-nav-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen(!open)}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-6"
              aria-hidden="true"
            >
              {open ? (
                <>
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </>
              ) : (
                <>
                  <path d="M4 5h16" />
                  <path d="M4 12h16" />
                  <path d="M4 19h16" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>
      {open && (
        <nav
          id="site-nav-menu"
          aria-label="Mobile"
          className="site-nav__menu border-t border-ploy-border-primary bg-ploy-background-primary lg:hidden"
        >
          <div className="mx-auto w-full max-w-7xl px-5 md:px-8 flex flex-col py-4">
            {links.map(([label, id]) => (
              <a
                key={id}
                href={`/#${id}`}
                onClick={() => setOpen(false)}
                className="border-b border-ploy-border-primary py-4 font-heading text-2xl font-bold uppercase text-ploy-text-primary"
              >
                {label}
              </a>
            ))}
            <a
              href="/#estimate"
              onClick={() => setOpen(false)}
              className="reference-button reference-button--primary mt-6"
            >
              Get a free estimate
            </a>
          </div>
        </nav>
      )}
    </header>
  )
}
