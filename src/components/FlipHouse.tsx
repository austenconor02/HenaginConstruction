export function FlipHouse() {
  return (
    <section className="flip-house relative isolate overflow-clip border-y border-ploy-border-primary bg-ploy-background-primary">
      <div className="absolute inset-0 -z-10">
        <img
          src="/images/reference/ai-henagin-flip-house-filming-261104163706.webp"
          alt="Camera on a tripod filming a house mid-renovation"
          loading="lazy"
          decoding="async"
          fetchPriority="auto"
          className="h-full w-full object-cover object-[65%_center] grayscale-[35%]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ploy-background-primary via-ploy-background-primary/70 to-ploy-background-primary/0"></div>
      </div>
      <div className="mx-auto w-full max-w-7xl px-5 md:px-8 flex min-h-[420px] items-center py-16 md:min-h-[460px]">
        <div className="max-w-lg">
          <p className="font-heading text-3xl font-bold uppercase leading-none text-ploy-text-primary md:text-4xl">
            {'As seen on'}
          </p>
          <h2 className="mt-2 font-heading typography-heading text-6xl uppercase text-ploy-accent-primary md:text-7xl">
            {'Flip House Chronicles'}
          </h2>
          <p className="font-body typography-body text-pretty text-lg md:text-xl text-ploy-text-primary mt-6 max-w-sm">
            {
              'We specialize in turning houses into homes. Follow the journey and see the transformation.'
            }
          </p>
        </div>
      </div>
    </section>
  )
}
