export function CallStrip() {
  return (
    <section className="call-strip bg-ploy-accent-primary py-12 text-ploy-text-on-accent-primary md:py-14">
      <div className="mx-auto w-full max-w-7xl px-5 md:px-8 flex flex-col items-center text-center">
        <h2 className="font-heading typography-heading text-5xl uppercase md:text-6xl">
          {'Ready to build something beautiful?'}
        </h2>
        <div className="mt-8 flex flex-col items-center gap-6 sm:flex-row sm:gap-0">
          <a
            href="/#estimate"
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-button font-button typography-button transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ploy-accent-primary focus-visible:ring-offset-2 focus-visible:ring-offset-ploy-background-primary disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-ploy-button-secondary-border bg-ploy-button-secondary-background text-ploy-button-secondary-text hover:bg-ploy-button-secondary-background/85 h-14 px-7 text-lg"
          >
            {'Get a free estimate'}
          </a>
          <span
            aria-hidden="true"
            className="mx-8 hidden h-14 w-px bg-ploy-text-on-accent-primary/40 sm:block"
          ></span>
          <a href="tel:+19723103255" className="text-left leading-tight">
            <span className="block text-base font-semibold">{'Call or text'}</span>
            <span className="block font-heading text-4xl font-extrabold">{'972-310-3255'}</span>
          </a>
        </div>
      </div>
    </section>
  )
}
