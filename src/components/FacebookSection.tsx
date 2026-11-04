import { ArrowUpRight, Camera, Play } from 'lucide-react'
import { business } from '../content/business'
import { FacebookIcon } from './FacebookIcon'
import '../styles/facebook.css'

export function FacebookSection() {
  return (
    <section
      className="facebook-section scroll-mt-24 bg-ploy-neutral-primary-s2 py-16 md:py-24"
      id="facebook"
      aria-labelledby="facebook-heading"
    >
      <div className="facebook-layout mx-auto w-full max-w-7xl px-5 md:px-8">
        <div className="facebook-copy">
          <span aria-hidden="true" className="block h-1 w-14 bg-ploy-accent-primary mb-6" />
          <p className="font-heading text-xl font-bold uppercase text-ploy-text-secondary mb-3">
            Let&apos;s stay connected
          </p>
          <h2
            id="facebook-heading"
            className="font-heading typography-heading uppercase text-5xl md:text-6xl"
          >
            Follow our work
            <span className="block text-ploy-accent-primary">on Facebook</span>
          </h2>
          <p className="font-body typography-body text-pretty text-lg md:text-xl text-ploy-text-secondary mt-5 max-w-lg">
            Get to know Henagin Home Improvement. Explore the photos, videos, and updates we share
            on our Facebook page.
          </p>
          <a
            className="facebook-button reference-button reference-button--primary mt-8"
            href={business.facebookUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View photos and videos on Facebook (opens in a new tab)"
          >
            View photos &amp; videos
            <ArrowUpRight size={20} aria-hidden="true" />
          </a>
        </div>
        <a
          className="facebook-card"
          href={business.facebookUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Visit Henagin Home Improvement on Facebook (opens in a new tab)"
        >
          <div className="facebook-card-top">
            <FacebookIcon />
            <span className="font-heading text-xl font-bold uppercase">Find us on Facebook</span>
            <ArrowUpRight size={22} aria-hidden="true" />
          </div>
          <div className="facebook-brand">
            <img
              src="/images/reference/ai-henagin-home-improvement-logo-261104163705.webp"
              width="1254"
              height="1254"
              alt="Henagin Home Improvement"
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className="facebook-card-bottom">
            <div>
              <strong className="font-heading text-2xl font-bold uppercase">
                Henagin Home Improvement
              </strong>
              <span className="facebook-card-details text-sm text-ploy-text-secondary">
                <Camera size={15} aria-hidden="true" /> Photos
                <span aria-hidden="true">·</span>
                <Play size={15} aria-hidden="true" /> Videos
                <span aria-hidden="true">·</span> Updates
              </span>
            </div>
            <span className="facebook-card-arrow" aria-hidden="true">
              <ArrowUpRight size={22} />
            </span>
          </div>
        </a>
      </div>
    </section>
  )
}
