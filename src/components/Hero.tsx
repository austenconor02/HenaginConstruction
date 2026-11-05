export function Hero() {
  return (
    <section className="hero relative isolate overflow-clip bg-ploy-background-primary">
      <div className="hero__media absolute inset-0 -z-10">
        <img
          src="/images/reference/ai-henagin-hero-farmhouse-dusk-261104163657.webp"
          alt="Modern farmhouse with stone porch columns and warm lit windows at dusk"
          loading="eager"
          decoding="async"
          fetchPriority="high"
          className="h-full w-full object-cover object-[70%_center]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ploy-background-primary via-ploy-background-primary/80 to-ploy-background-primary/0 md:via-ploy-background-primary/70 md:to-transparent"></div>
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-ploy-background-primary/70 to-transparent"></div>
      </div>
      <div className="mx-auto w-full max-w-7xl px-5 md:px-8 relative flex min-h-[620px] items-center py-20 md:min-h-[680px]">
        <div className="hero__content min-w-0 max-w-xl">
          <h1 className="hero__title font-heading typography-heading text-[3.25rem] uppercase sm:text-7xl lg:text-8xl">
            <span className="block text-ploy-text-primary">{'Home'}</span>
            <span className="block text-ploy-accent-primary">{'remodeling'}</span>
            <span className="block text-ploy-text-primary">{'& repairs'}</span>
          </h1>
          <p className="font-body typography-body text-pretty text-lg md:text-xl text-ploy-text-primary hero__subtitle mt-6 max-w-md">
            {
              'Kitchen and bathroom remodels, custom built-ins, painting and flooring. Quality craftsmanship and fair pricing on every project, big or small.'
            }
          </p>
          <div className="hero__actions mt-9 flex flex-wrap items-center gap-x-8 gap-y-5">
            <a
              href="/#estimate"
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-button font-button typography-button transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ploy-accent-primary focus-visible:ring-offset-2 focus-visible:ring-offset-ploy-background-primary disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-ploy-button-primary-border bg-ploy-button-primary-background text-ploy-button-primary-text hover:bg-ploy-button-primary-background/90 h-14 px-7 text-lg hero__cta--primary"
            >
              {'Get a free estimate'}
            </a>
            <a href="tel:+19723103255" className="hero__cta--phone group leading-tight">
              <span className="block text-sm text-ploy-text-secondary">{'Call or text'}</span>
              <span className="block font-heading text-3xl font-bold text-ploy-text-primary transition-colors group-hover:text-ploy-accent-primary">
                {'972-310-3255'}
              </span>
            </a>
          </div>
        </div>
        <div className="hero__badge absolute bottom-8 right-5 hidden size-32 sm:flex flex-col items-center justify-center rounded-full bg-ploy-accent-primary text-center text-ploy-text-on-accent-primary shadow-2xl md:bottom-14 md:right-8 md:size-48">
          <span className="font-heading text-base font-bold uppercase leading-tight md:text-2xl">
            {'Built right.'}
          </span>
          <span className="font-heading text-base font-bold uppercase leading-tight md:text-2xl">
            {'Built to last.'}
          </span>
          <span className="font-heading text-base font-bold uppercase leading-tight md:text-2xl">
            {'Built for you.'}
          </span>
          <span
            aria-hidden="true"
            className="mt-2 h-0.5 w-8 bg-ploy-text-on-accent-primary md:w-10"
          ></span>
        </div>
      </div>
    </section>
  )
}
