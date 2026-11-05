export function Services() {
  return (
    <section
      id="services"
      className="services scroll-mt-24 bg-ploy-background-primary py-6 md:py-8"
    >
      <h2 className="sr-only">{'Our services'}</h2>
      <div className="mx-auto w-full max-w-7xl px-5 md:px-8">
        <ul className="grid grid-cols-2 gap-3 lg:grid-cols-5">
          <li className="services__item flex flex-col items-center border border-ploy-border-primary bg-ploy-neutral-primary-s2 px-3 py-6 text-center last:col-span-2 md:px-5 md:py-8 lg:last:col-span-1 transition-colors hover:border-ploy-accent-primary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-house size-9 text-ploy-accent-primary md:size-11"
              aria-hidden="true"
            >
              <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"></path>
              <path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            </svg>
            <h3 className="mt-4 font-heading text-xl font-bold uppercase leading-none md:text-2xl">
              {'Built-ins'}
            </h3>
            <p className="mt-3 max-w-[16rem] text-sm text-ploy-text-secondary">
              {'Shelving and storage designed around your home.'}
            </p>
          </li>
          <li className="services__item flex flex-col items-center border border-ploy-border-primary bg-ploy-neutral-primary-s2 px-3 py-6 text-center last:col-span-2 md:px-5 md:py-8 lg:last:col-span-1 transition-colors hover:border-ploy-accent-primary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-hammer size-9 text-ploy-accent-primary md:size-11"
              aria-hidden="true"
            >
              <path d="m15 12-9.373 9.373a1 1 0 0 1-3.001-3L12 9"></path>
              <path d="m18 15 4-4"></path>
              <path d="m21.5 11.5-1.914-1.914A2 2 0 0 1 19 8.172v-.344a2 2 0 0 0-.586-1.414l-1.657-1.657A6 6 0 0 0 12.516 3H9l1.243 1.243A6 6 0 0 1 12 8.485V10l2 2h1.172a2 2 0 0 1 1.414.586L18.5 14.5"></path>
            </svg>
            <h3 className="mt-4 font-heading text-xl font-bold uppercase leading-none md:text-2xl">
              {'Remodeling'}
            </h3>
            <p className="mt-3 max-w-[16rem] text-sm text-ploy-text-secondary">
              {'Beautiful home renovations, inside and out.'}
            </p>
          </li>
          <li className="services__item flex flex-col items-center border border-ploy-border-primary bg-ploy-neutral-primary-s2 px-3 py-6 text-center last:col-span-2 md:px-5 md:py-8 lg:last:col-span-1 transition-colors hover:border-ploy-accent-primary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-paint-roller size-9 text-ploy-accent-primary md:size-11"
              aria-hidden="true"
            >
              <rect width="16" height="6" x="2" y="2" rx="2"></rect>
              <path d="M10 16v-2a2 2 0 0 1 2-2h8a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"></path>
              <rect width="4" height="6" x="8" y="16" rx="1"></rect>
            </svg>
            <h3 className="mt-4 font-heading text-xl font-bold uppercase leading-none md:text-2xl">
              {'Painting'}
            </h3>
            <p className="mt-3 max-w-[16rem] text-sm text-ploy-text-secondary">
              {'Interior and exterior painting that transforms a room.'}
            </p>
          </li>
          <li className="services__item flex flex-col items-center border border-ploy-border-primary bg-ploy-neutral-primary-s2 px-3 py-6 text-center last:col-span-2 md:px-5 md:py-8 lg:last:col-span-1 transition-colors hover:border-ploy-accent-primary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-layers size-9 text-ploy-accent-primary md:size-11"
              aria-hidden="true"
            >
              <path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z"></path>
              <path d="M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12"></path>
              <path d="M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17"></path>
            </svg>
            <h3 className="mt-4 font-heading text-xl font-bold uppercase leading-none md:text-2xl">
              {'Flooring'}
            </h3>
            <p className="mt-3 max-w-[16rem] text-sm text-ploy-text-secondary">
              {'Stylish, durable flooring installed with precision.'}
            </p>
          </li>
          <li className="services__item flex flex-col items-center border border-ploy-border-primary bg-ploy-neutral-primary-s2 px-3 py-6 text-center last:col-span-2 md:px-5 md:py-8 lg:last:col-span-1 transition-colors hover:border-ploy-accent-primary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-wrench size-9 text-ploy-accent-primary md:size-11"
              aria-hidden="true"
            >
              <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.106-3.105c.32-.322.863-.22.983.218a6 6 0 0 1-8.259 7.057l-7.91 7.91a1 1 0 0 1-2.999-3l7.91-7.91a6 6 0 0 1 7.057-8.259c.438.12.54.662.219.984z"></path>
            </svg>
            <h3 className="mt-4 font-heading text-xl font-bold uppercase leading-none md:text-2xl">
              {'Handyman services'}
            </h3>
            <p className="mt-3 max-w-[16rem] text-sm text-ploy-text-secondary">
              {'Small jobs. Big impact. We get it done.'}
            </p>
          </li>
        </ul>
      </div>
    </section>
  )
}
