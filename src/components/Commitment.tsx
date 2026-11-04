export function Commitment() {
  return (
    <section
      id="about"
      className="commitment scroll-mt-24 bg-ploy-background-primary py-16 md:py-20"
    >
      <div className="mx-auto w-full max-w-7xl px-5 md:px-8">
        <h2 className="font-heading typography-heading uppercase text-balance text-3xl md:text-4xl text-ploy-text-primary text-center">
          {'Our commitment'}
        </h2>
        <ul className="mt-10 grid border border-ploy-border-primary md:grid-cols-3 md:divide-x md:divide-ploy-border-primary">
          <li className="commitment__item flex flex-col items-center border-b border-ploy-border-primary px-8 py-10 text-center last:border-b-0 md:border-b-0">
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
              className="lucide lucide-shield-check size-11 text-ploy-accent-primary"
              aria-hidden="true"
            >
              <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path>
              <path d="m9 12 2 2 4-4"></path>
            </svg>
            <h3 className="mt-4 font-heading text-3xl font-bold uppercase leading-none">
              {'Quality work'}
            </h3>
            <p className="mt-3 max-w-xs text-ploy-text-secondary">
              {'Built right and built to last, with blue-collar craftsmanship on every job.'}
            </p>
          </li>
          <li className="commitment__item flex flex-col items-center border-b border-ploy-border-primary px-8 py-10 text-center last:border-b-0 md:border-b-0">
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
              className="lucide lucide-handshake size-11 text-ploy-accent-primary"
              aria-hidden="true"
            >
              <path d="m11 17 2 2a1 1 0 1 0 3-3"></path>
              <path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4"></path>
              <path d="m21 3 1 11h-2"></path>
              <path d="M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3"></path>
              <path d="M3 4h8"></path>
            </svg>
            <h3 className="mt-4 font-heading text-3xl font-bold uppercase leading-none">
              {'Honest service'}
            </h3>
            <p className="mt-3 max-w-xs text-ploy-text-secondary">
              {'Fair pricing and a free estimate, so you know the plan before work starts.'}
            </p>
          </li>
          <li className="commitment__item flex flex-col items-center border-b border-ploy-border-primary px-8 py-10 text-center last:border-b-0 md:border-b-0">
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
              className="lucide lucide-users-round size-11 text-ploy-accent-primary"
              aria-hidden="true"
            >
              <path d="M18 21a8 8 0 0 0-16 0"></path>
              <circle cx="10" cy="8" r="5"></circle>
              <path d="M22 20c0-3.37-2-6.5-4-8a5 5 0 0 0-.45-8.3"></path>
            </svg>
            <h3 className="mt-4 font-heading text-3xl font-bold uppercase leading-none">
              {'Customer focused'}
            </h3>
            <p className="mt-3 max-w-xs text-ploy-text-secondary">
              {'Your vision, our hard work. We design around your home and your style.'}
            </p>
          </li>
        </ul>
      </div>
    </section>
  )
}
