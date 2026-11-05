export function ExteriorServices() {
  return (
    <section className="exterior bg-ploy-background-primary py-16 md:py-24">
      <div className="mx-auto w-full max-w-7xl px-5 md:px-8">
        <div className="flex flex-col items-center text-center">
          <h2 className="font-heading typography-heading uppercase text-balance text-4xl md:text-5xl text-ploy-text-primary">
            {'Skilled. Reliable. Detail driven.'}
          </h2>
          <p className="font-body typography-body text-pretty text-lg md:text-xl text-ploy-text-secondary mt-4 max-w-xl">
            {'Exterior repairs and property work. If your home needs it, ask us.'}
          </p>
        </div>
        <ul className="exterior-services-list mt-12 grid gap-y-10 lg:divide-x lg:divide-ploy-border-primary">
          <li className="exterior__item flex flex-col items-center px-4 text-center">
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
              className="lucide lucide-warehouse size-10 text-ploy-accent-primary"
              aria-hidden="true"
            >
              <path d="M18 21V10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1v11"></path>
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 1.132-1.803l7.95-3.974a2 2 0 0 1 1.837 0l7.948 3.974A2 2 0 0 1 22 8z"></path>
              <path d="M6 13h12"></path>
              <path d="M6 17h12"></path>
            </svg>
            <h3 className="mt-4 font-heading text-2xl font-bold uppercase leading-none">
              {'Fascia'}
            </h3>
            <p className="mt-2 text-sm text-ploy-text-secondary">{'Install and repair'}</p>
          </li>
          <li className="exterior__item flex flex-col items-center px-4 text-center">
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
              className="lucide lucide-panel-top size-10 text-ploy-accent-primary"
              aria-hidden="true"
            >
              <rect width="18" height="18" x="3" y="3" rx="2"></rect>
              <path d="M3 9h18"></path>
            </svg>
            <h3 className="mt-4 font-heading text-2xl font-bold uppercase leading-none">
              {'Soffit'}
            </h3>
            <p className="mt-2 text-sm text-ploy-text-secondary">{'Install and repair'}</p>
          </li>
          <li className="exterior__item flex flex-col items-center px-4 text-center">
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
              className="lucide lucide-paint-bucket size-10 text-ploy-accent-primary"
              aria-hidden="true"
            >
              <path d="M11 7 6 2"></path>
              <path d="M18.992 12H2.041"></path>
              <path d="M21.145 18.38A3.34 3.34 0 0 1 20 16.5a3.3 3.3 0 0 1-1.145 1.88c-.575.46-.855 1.02-.855 1.595A2 2 0 0 0 20 22a2 2 0 0 0 2-2.025c0-.58-.285-1.13-.855-1.595"></path>
              <path d="m8.5 4.5 2.148-2.148a1.205 1.205 0 0 1 1.704 0l7.296 7.296a1.205 1.205 0 0 1 0 1.704l-7.592 7.592a3.615 3.615 0 0 1-5.112 0l-3.888-3.888a3.615 3.615 0 0 1 0-5.112L5.67 7.33"></path>
            </svg>
            <h3 className="mt-4 font-heading text-2xl font-bold uppercase leading-none">
              {'Siding'}
            </h3>
            <p className="mt-2 text-sm text-ploy-text-secondary">{'Paint jobs'}</p>
          </li>
          <li className="exterior__item flex flex-col items-center px-4 text-center">
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
              className="lucide lucide-tractor size-10 text-ploy-accent-primary"
              aria-hidden="true"
            >
              <path d="m10 11 11 .9a1 1 0 0 1 .8 1.1l-.665 4.158a1 1 0 0 1-.988.842H20"></path>
              <path d="M16 18h-5"></path>
              <path d="M18 5a1 1 0 0 0-1 1v5.573"></path>
              <path d="M3 4h8.129a1 1 0 0 1 .99.863L13 11.246"></path>
              <path d="M4 11V4"></path>
              <path d="M7 15h.01"></path>
              <path d="M8 10.1V4"></path>
              <circle cx="18" cy="18" r="2"></circle>
              <circle cx="7" cy="15" r="5"></circle>
            </svg>
            <h3 className="mt-4 font-heading text-2xl font-bold uppercase leading-none">
              {'Skid steer'}
            </h3>
            <p className="mt-2 text-sm text-ploy-text-secondary">{'Site work'}</p>
          </li>
        </ul>
      </div>
    </section>
  )
}
