import { EstimateForm } from './EstimateForm'

export function EstimateSection() {
  return (
    <section
      id="estimate"
      className="estimate scroll-mt-24 bg-ploy-background-primary py-16 md:py-24"
    >
      <div className="mx-auto w-full max-w-7xl px-5 md:px-8 grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
        <div>
          <span aria-hidden="true" className="block h-1 w-14 bg-ploy-accent-primary mb-6"></span>
          <h2
            id="estimate-heading"
            className="font-heading typography-heading uppercase text-balance text-5xl md:text-6xl text-ploy-text-primary"
          >
            {'Get your free estimate'}
          </h2>
          <p className="font-body typography-body text-pretty text-lg md:text-xl text-ploy-text-secondary mt-5 max-w-md">
            {
              "Tell us about your project and we'll get back to you to talk it through. Prefer to talk now? Call or text."
            }
          </p>
          <a href="tel:+19723103255" className="mt-8 inline-flex items-center gap-4 group">
            <span className="flex size-14 items-center justify-center rounded-full bg-ploy-accent-primary text-ploy-text-on-accent-primary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-phone size-6"
                aria-hidden="true"
              >
                <path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384"></path>
              </svg>
            </span>
            <span className="leading-tight">
              <span className="block text-sm text-ploy-text-secondary">{'Call or text'}</span>
              <span className="block font-heading text-4xl font-bold transition-colors group-hover:text-ploy-accent-primary">
                {'972-310-3255'}
              </span>
            </span>
          </a>
        </div>
        <div className="border border-ploy-border-primary bg-ploy-neutral-primary-s2 p-6 md:p-10">
          <EstimateForm />
        </div>
      </div>
    </section>
  )
}
