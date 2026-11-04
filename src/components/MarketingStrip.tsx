export function MarketingStrip() {
  return (
    <section className="marketing-section container" aria-labelledby="possibilities-heading">
      <div className="marketing-heading">
        <p className="eyebrow">PICTURE THE POSSIBILITIES</p>
        <h2 id="possibilities-heading">
          A little inspiration
          <br />
          for your next project.
        </h2>
        <p>What does home look like to you?</p>
      </div>
      <figure className="marketing-image">
        <img
          src="/images/marketing/painting.webp"
          srcSet="/images/marketing/painting-small.webp 640w, /images/marketing/painting.webp 1440w"
          sizes="(max-width: 760px) 100vw, 32vw"
          width="1440"
          height="960"
          alt="AI-generated illustration of a painter refreshing an interior wall with a roller and protective eyewear"
          loading="lazy"
        />
        <figcaption>
          <span>01 / A fresh perspective</span>
          <strong>New color. New feeling.</strong>
        </figcaption>
      </figure>
      <figure className="marketing-image">
        <img
          src="/images/marketing/exterior.webp"
          srcSet="/images/marketing/exterior-small.webp 640w, /images/marketing/exterior.webp 1440w"
          sizes="(max-width: 760px) 100vw, 32vw"
          width="1440"
          height="960"
          alt="AI-generated illustration of a carpenter measuring fascia trim beside a North Texas home"
          loading="lazy"
        />
        <figcaption>
          <span>02 / Beyond the front door</span>
          <strong>A welcome change outside.</strong>
        </figcaption>
      </figure>
      <p className="marketing-disclosure">
        AI-generated marketing illustrations for inspiration. Actual project photos will appear
        separately.
      </p>
    </section>
  )
}
