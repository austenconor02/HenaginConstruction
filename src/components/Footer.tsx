export function Footer() {
  return (
    <footer className="site-footer border-t border-ploy-border-primary bg-ploy-neutral-primary-s0">
      <div className="mx-auto w-full max-w-7xl px-5 md:px-8 grid gap-10 py-14 md:grid-cols-[auto_1fr_auto_auto] md:items-center md:gap-14">
        <a href="/" aria-label="Henagin Home Improvement home">
          <img
            src="/images/reference/ai-henagin-home-improvement-logo-261104163705.webp"
            alt="Henagin Home Improvement"
            width="1254"
            height="1254"
            className="w-auto h-32 md:h-36"
          />
        </a>
        <div>
          <p className="max-w-xs text-xl font-semibold text-ploy-text-primary">
            {"Your home. Our passion. Let's build something beautiful."}
          </p>
          <p className="mt-3 max-w-sm text-sm text-ploy-text-secondary">
            {'Custom builds. Remodels. Built-ins. Painting. Flooring. Handyman services. ADUs.'}
          </p>
        </div>
        <nav
          aria-label="Footer"
          className="flex flex-col gap-2 md:border-l md:border-ploy-border-primary md:pl-10"
        >
          <a
            href="/#services"
            className="font-semibold text-ploy-text-primary hover:text-ploy-accent-primary"
          >
            {'Services'}
          </a>
          <a
            href="/#built-ins"
            className="font-semibold text-ploy-text-primary hover:text-ploy-accent-primary"
          >
            {'Built-ins'}
          </a>
          <a
            href="/#projects"
            className="font-semibold text-ploy-text-primary hover:text-ploy-accent-primary"
          >
            {'Projects'}
          </a>
          <a
            href="/#about"
            className="font-semibold text-ploy-text-primary hover:text-ploy-accent-primary"
          >
            {'About'}
          </a>
          <a
            href="/#estimate"
            className="font-semibold text-ploy-text-primary hover:text-ploy-accent-primary"
          >
            {'Contact'}
          </a>
        </nav>
        <a href="tel:+19723103255" className="leading-tight">
          <span className="block text-sm text-ploy-text-secondary">{'Call or text'}</span>
          <span className="block font-heading text-3xl font-bold text-ploy-accent-primary">
            {'972-310-3255'}
          </span>
          <span className="mt-1 block text-sm text-ploy-text-secondary">{'Free estimates'}</span>
        </a>
      </div>
      <div className="border-t border-ploy-border-primary">
        <div className="mx-auto w-full max-w-7xl px-5 md:px-8 flex flex-col gap-2 py-5 text-sm text-ploy-text-secondary sm:flex-row sm:justify-between">
          <p>
            {'© '}
            {'2026'} {'Henagin Home Improvement'}
            {'. All rights reserved.'}
          </p>
          <p>{'Built right. Built to last. Built for you.'}</p>
        </div>
      </div>
    </footer>
  )
}
