export function ProjectShowcase() {
  return (
    <section
      id="projects"
      className="projects scroll-mt-24 bg-ploy-background-primary pb-16 pt-12 md:pb-24 md:pt-16"
    >
      <div className="mx-auto w-full max-w-7xl px-5 md:px-8">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <h2 className="font-heading typography-heading uppercase text-balance text-4xl md:text-5xl text-ploy-text-primary max-w-2xl">
            {'New builds. Remodels. Renovations.'}
          </h2>
          <p className="font-body typography-body text-pretty text-base text-ploy-text-secondary max-w-sm md:text-right">
            {'We take pride in every project, big or small.'}
          </p>
        </div>
        <div className="grid gap-3 md:grid-cols-5 md:grid-rows-2">
          <figure className="projects__tile group relative overflow-clip aspect-[4/3] md:col-span-3 md:row-span-2 md:aspect-auto md:min-h-[560px]">
            <img
              src="/images/reference/ai-henagin-kitchen-remodel-261104163654.webp"
              alt="Remodeled kitchen with a blue island, white quartz and black pendant lights"
              loading="lazy"
              decoding="async"
              fetchPriority="auto"
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            />
            <figcaption className="absolute bottom-0 left-0 bg-ploy-accent-primary px-4 py-2 font-heading text-lg font-bold uppercase leading-none text-ploy-text-on-accent-primary">
              {'Kitchens'}
            </figcaption>
          </figure>
          <figure className="projects__tile group relative overflow-clip aspect-[4/3] md:col-span-2 md:aspect-auto">
            <img
              src="/images/reference/ai-henagin-bathroom-remodel-261104163701.webp"
              alt="Bathroom with a frameless glass walk-in shower and wood double vanity"
              loading="lazy"
              decoding="async"
              fetchPriority="auto"
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            />
            <figcaption className="absolute bottom-0 left-0 bg-ploy-accent-primary px-4 py-2 font-heading text-lg font-bold uppercase leading-none text-ploy-text-on-accent-primary">
              {'Bathrooms'}
            </figcaption>
          </figure>
          <figure className="projects__tile group relative overflow-clip aspect-[4/3] md:col-span-2 md:aspect-auto">
            <img
              src="/images/reference/ai-henagin-living-room-built-ins-261104163703.webp"
              alt="Living room with lit built-in shelves on both sides of a fireplace"
              loading="lazy"
              decoding="async"
              fetchPriority="auto"
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            />
            <figcaption className="absolute bottom-0 left-0 bg-ploy-accent-primary px-4 py-2 font-heading text-lg font-bold uppercase leading-none text-ploy-text-on-accent-primary">
              {'Built-ins'}
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  )
}
