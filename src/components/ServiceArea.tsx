import { ArrowUpRight, MapPin } from 'lucide-react'
import { business } from '../content/business'

export function ServiceArea() {
  return (
    <section
      className="service-area-section container"
      id="service-area"
      aria-labelledby="area-heading"
    >
      <div className="area-art" aria-hidden="true">
        <div className="area-orbit orbit-one" />
        <div className="area-orbit orbit-two" />
        <div className="area-orbit orbit-three" />
        <div className="area-path" />
        <span className="map-point fort-worth">
          <i />
          FORT WORTH
        </span>
        <div className="area-pin">
          <MapPin size={32} strokeWidth={1.5} />
        </div>
        <span className="map-point dallas">
          <i />
          DALLAS
        </span>
        <span className="area-caption">THE METROPLEX &amp; YOUR NEXT PROJECT</span>
      </div>
      <div className="area-copy">
        <p className="eyebrow">LOCAL PROJECTS. PERSONAL CONVERSATIONS.</p>
        <h2 id="area-heading">
          At home in
          <br />
          <span>Dallas–Fort Worth.</span>
        </h2>
        <p>
          Serving homeowners across the DFW metroplex. Share your city or ZIP code and a little
          about your project, and we can talk through the next step.
        </p>
        <a className="text-link" href={business.textUrl}>
          Ask about your area <ArrowUpRight size={17} />
        </a>
      </div>
    </section>
  )
}
