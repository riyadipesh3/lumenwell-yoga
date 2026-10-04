import { useEffect, useRef, useState, type ReactNode } from 'react'

/* Scroll reveal uses IntersectionObserver only, never a scroll listener, and
   collapses to fully visible under prefers-reduced-motion. */
function Reveal({
  children,
  delay = 0,
  className = '',
}: {
  children: ReactNode
  delay?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('is-visible')
          io.disconnect()
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`reveal ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

function SectionHead({
  kicker,
  title,
  body,
}: {
  kicker?: string
  title: string
  body?: string
}) {
  return (
    <div className="max-w-2xl">
      {kicker ? <p className="micro mb-6">{kicker}</p> : null}
      <h2 className="display display-md">{title}</h2>
      {body ? <p className="lede mt-6">{body}</p> : null}
    </div>
  )
}

/* --------------------------------------------------------------------------
   TIMETABLE DATA
   One row per time slot, one column per day. This is the studio's real
   weekly grid rather than a set of class cards, so a member can read across a
   row and see what is on at 07:30 before choosing a day.
   -------------------------------------------------------------------------- */
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

const SLOTS = [
  {
    time: '07:30',
    cells: [
      { name: 'Morning Vinyasa', mins: 60, who: 'Ines' },
      null,
      { name: 'Morning Vinyasa', mins: 60, who: 'Ines' },
      { name: 'Slow Flow', mins: 60, who: 'Priya' },
      null,
      { name: 'Weekend Vinyasa', mins: 75, who: 'Tomas' },
    ],
  },
  {
    time: '12:15',
    cells: [
      { name: 'Lunchtime Reset', mins: 45, who: 'Priya' },
      { name: 'Lunchtime Reset', mins: 45, who: 'Priya' },
      null,
      { name: 'Lunchtime Reset', mins: 45, who: 'Priya' },
      { name: 'Lunchtime Reset', mins: 45, who: 'Priya' },
      null,
    ],
  },
  {
    time: '18:00',
    cells: [
      { name: 'Hatha Foundations', mins: 75, who: 'Tomas' },
      { name: 'Hatha Foundations', mins: 75, who: 'Tomas' },
      { name: 'Hatha Foundations', mins: 75, who: 'Tomas' },
      null,
      { name: 'Hatha Foundations', mins: 75, who: 'Tomas' },
      null,
    ],
  },
  {
    time: '19:30',
    cells: [
      { name: 'Slow Flow', mins: 60, who: 'Priya' },
      { name: 'Yin and Breath', mins: 75, who: 'Amara' },
      { name: 'Slow Flow', mins: 60, who: 'Priya' },
      { name: 'Yin and Breath', mins: 75, who: 'Amara' },
      { name: 'Restorative', mins: 60, who: 'Amara' },
      null,
    ],
  },
]

const TEACHERS = [
  {
    name: 'Ines Kowalczyk',
    trained: 'RYT 500, Prague',
    since: 'Teaching here since 2021',
    note: 'Runs the vinyasa classes and the Tuesday beginners course.',
  },
  {
    name: 'Priya Raman',
    trained: 'E-RYT 200 and YACEP, Chennai',
    since: 'Teaching here since 2023',
    note: 'Slow flow and lunchtime reset. Teaches entirely hands-off adjustments.',
  },
  {
    name: 'Tomas Ferreira',
    trained: 'RYT 500, Lisbon',
    since: 'Teaching here since 2019',
    note: 'Hatha foundations and the prop workshop on the first Sunday.',
  },
  {
    name: 'Amara Okonjo',
    trained: 'RYT 500 and Yin specialist, London',
    since: 'Teaching here since 2022',
    note: 'Yin, breathwork, and the restorative evening slot on Fridays.',
  },
]

const SPACE = [
  {
    seed: 'lumenwell-practice-room-morning',
    alt: 'The main practice room at Lumenwell with mats laid out in rows and tall windows along the east wall',
    caption: 'Practice room, first floor',
    span: 'lg:col-span-7 lg:row-span-2',
    ratio: 'aspect-4/3',
    w: 1600,
    h: 1200,
  },
  {
    seed: 'lumenwell-studio-reception',
    alt: 'Reception and shoe rack at the foot of the stair at Lumenwell',
    caption: 'Reception',
    span: 'lg:col-span-5',
    ratio: 'aspect-4/3',
    w: 1200,
    h: 900,
  },
  {
    seed: 'lumenwell-quiet-room',
    alt: 'The quiet room with bolsters, blankets, and a small low light',
    caption: 'Quiet room, used for restorative',
    span: 'lg:col-span-5',
    ratio: 'aspect-4/3',
    w: 1200,
    h: 900,
  },
  {
    seed: 'lumenwell-yard-tea',
    alt: 'The walled yard behind the studio with two benches and a table of tea cups',
    caption: 'The yard, open in summer',
    span: 'lg:col-span-5',
    ratio: 'aspect-16/10',
    w: 1200,
    h: 750,
  },
]

const TIERS = [
  {
    name: 'Class pass',
    price: '96',
    unit: '10 classes, valid six months',
    lead: 'For people who come in some weeks and not others.',
    includes: [
      'Any group class on the timetable',
      'Ten classes, valid six months',
      'Mat and props included, nothing to bring',
      'Unused classes can be gifted to a friend',
    ],
    cta: 'Buy ten classes',
    featured: false,
  },
  {
    name: 'Full membership',
    price: '128',
    unit: 'per month, cancel any time',
    lead: 'Unlimited group classes, plus the quiet room and the Sunday workshops.',
    includes: [
      'Every group class on the timetable',
      'Quiet room use before and after class',
      'Workshops at cost, typically 12 to 18 pounds',
      'One free month a year for a friend',
      'One free pass a year for a friend',
    ],
    cta: 'Start membership',
    featured: true,
  },
]

const STUDIO_DETAILS: [string, string][] = [
  ['Address', '41 Cotham Brow, Redland, Bristol BS6 6AD'],
  ['Phone', '0117 496 2280'],
  ['Email', 'hello@lumenwell.studio'],
  ['Doors', 'Open 20 minutes before each class'],
]

export default function App() {
  const [navOpen, setNavOpen] = useState(false)

  const nav = [
    { label: 'Timetable', href: '#timetable' },
    { label: 'Teachers', href: '#teachers' },
    { label: 'The space', href: '#space' },
    { label: 'Membership', href: '#membership' },
  ]

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-[var(--color-ink)] focus:px-4 focus:py-2 focus:text-[var(--color-canvas)]"
      >
        Skip to content
      </a>

      {/* ---------------------------------------------------------------- */}
      {/* NAV                                                              */}
      {/* ---------------------------------------------------------------- */}
      <header className="sticky top-0 z-40 border-b border-[var(--color-hairline)] bg-[var(--color-canvas)]/92 backdrop-blur-sm">
        <div className="shell flex h-[76px] items-center justify-between">
          <a href="#top" className="display text-[1.5rem] text-[var(--color-ink)]">
            Lumenwell
          </a>

          <nav className="hidden items-center gap-9 md:flex">
            {nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-[0.875rem] font-medium text-[var(--color-body)] transition-colors hover:text-[var(--color-accent)]"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <a href="#enquiry" className="btn btn-primary hidden md:inline-flex">
            Book a class
          </a>

          <button
            type="button"
            aria-label={navOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={navOpen}
            aria-controls="mobile-nav"
            onClick={() => setNavOpen((v) => !v)}
            className="grid h-10 w-10 place-items-center border border-[var(--color-hairline)] text-[var(--color-ink)] md:hidden"
          >
            <span className="flex w-4 flex-col gap-[4px]">
              <span
                className={`h-px w-full bg-[var(--color-ink)] transition-transform duration-200 ${
                  navOpen ? 'translate-y-[2.5px] rotate-45' : ''
                }`}
              />
              <span
                className={`h-px w-full bg-[var(--color-ink)] transition-transform duration-200 ${
                  navOpen ? '-translate-y-[2.5px] -rotate-45' : ''
                }`}
              />
            </span>
          </button>
        </div>

        {navOpen ? (
          <div id="mobile-nav" className="border-t border-[var(--color-hairline)] md:hidden">
            <nav className="shell flex flex-col py-4">
              {nav.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setNavOpen(false)}
                  className="border-b border-[var(--color-hairline)] py-3.5 text-[1rem] font-medium text-[var(--color-ink)] last:border-b-0"
                >
                  {item.label}
                </a>
              ))}
              <a
                href="#enquiry"
                onClick={() => setNavOpen(false)}
                className="btn btn-primary mt-5 w-full"
              >
                Book a class
              </a>
            </nav>
          </div>
        ) : null}
      </header>

      <main id="main">
        {/* -------------------------------------------------------------- */}
        {/* HERO - calm type, real photograph, fits the first viewport      */}
        {/* -------------------------------------------------------------- */}
        <section id="top" className="shell pt-16 pb-16 md:pt-20 md:pb-24">
          <div className="grid items-end gap-12 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-7">
              <p className="micro mb-8">Yoga studio, Redland</p>
              <h1 className="display display-xl">
                Classes in a room
                <br />
                built for quiet.
              </h1>
              <p className="lede mt-9">
                Four teachers, one mat each, and a timetable you can actually read.
                Group classes only, capped at sixteen.
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-3">
                <a href="#timetable" className="btn btn-primary">
                  See the timetable
                </a>
                <a href="#membership" className="btn btn-secondary">
                  Prices
                </a>
              </div>
            </div>

            <div className="lg:col-span-5">
              <Reveal>
                <div className="frame aspect-4/5 w-full">
                  <img
                    src="https://picsum.photos/seed/lumenwell-studio-hero-morning-light/1100/1375"
                    alt="The Lumenwell practice room in morning light, mats laid out in rows"
                    loading="eager"
                    width={1100}
                    height={1375}
                  />
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* -------------------------------------------------------------- */}
        {/* PRACTICAL STRIP - facts, not a logo wall or a trust strip       */}
        {/* -------------------------------------------------------------- */}
        <section aria-label="Studio facts" className="border-y border-[var(--color-hairline)]">
          <div className="shell">
            <dl className="grid gap-x-12 gap-y-8 py-12 md:grid-cols-4">
              {[
                ['Rooms', 'Two, plus a quiet room'],
                ['Class size', 'Capped at 16'],
                ['Mat rental', 'Free, props included'],
                ['Level', 'All levels, no auditions'],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="text-[0.8125rem] font-semibold text-[var(--color-ink)]">
                    {k}
                  </dt>
                  <dd className="mt-2 text-[1rem] leading-relaxed text-[var(--color-body)]">
                    {v}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* -------------------------------------------------------------- */}
        {/* TIMETABLE - real grid, day columns x time slots               */}
        {/* -------------------------------------------------------------- */}
        <section id="timetable" className="shell py-24 md:py-32">
          <Reveal>
            <SectionHead
              title="Weekly timetable"
              body="Monday to Saturday. Sunday is a long restorative class and the prop workshop, both by arrangement."
            />
          </Reveal>

          <Reveal delay={80} className="mt-14">
            <div className="overflow-x-auto pb-2">
              <div className="tt">
                <div className="tt-cell tt-time" />
                {DAYS.map((d) => (
                  <div key={d} className="tt-cell tt-head">
                    {d}
                  </div>
                ))}

                {SLOTS.map((slot) => (
                  <div key={slot.time} className="contents">
                    <div className="tt-cell tt-time">{slot.time}</div>
                    {slot.cells.map((cell, i) =>
                      cell ? (
                        <div key={i} className="tt-cell">
                          <p className="text-[0.9375rem] font-semibold leading-snug text-[var(--color-ink)]">
                            {cell.name}
                          </p>
                          <p className="mt-2 text-[0.8125rem] leading-relaxed text-[var(--color-mute)]">
                            {cell.mins} min
                          </p>
                          <p className="mt-0.5 text-[0.8125rem] text-[var(--color-mute)]">
                            {cell.who}
                          </p>
                        </div>
                      ) : (
                        <div key={i} className="tt-cell bg-[var(--color-surface)]">
                          <p className="text-[0.8125rem] text-[var(--color-mute)]">No class</p>
                        </div>
                      ),
                    )}
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <p className="mt-8 text-[0.875rem] text-[var(--color-mute)]">
              Mat and props are in the room. Bring water, and a jumper if you get
              cold holding a shape for a while.
            </p>
          </Reveal>
        </section>

        {/* -------------------------------------------------------------- */}
        {/* TEACHERS - quiet row list, one row each, no card grid         */}
        {/* -------------------------------------------------------------- */}
        <section id="teachers" className="border-t border-[var(--color-hairline)] py-24 md:py-32">
          <div className="shell">
            <Reveal>
              <SectionHead
                title="Who teaches"
                body="All four hold RYT 500 or above and are insured to teach in the UK."
              />
            </Reveal>

            <ul className="mt-14">
              {TEACHERS.map((t, i) => (
                <Reveal key={t.name} delay={i * 60}>
                  <li className="grid gap-3 border-t border-[var(--color-hairline)] py-9 md:grid-cols-12 md:gap-8">
                    <div className="md:col-span-4">
                      <h3 className="display text-[1.375rem] text-[var(--color-ink)]">
                        {t.name}
                      </h3>
                      <p className="mt-2 text-[0.8125rem] text-[var(--color-mute)]">
                        {t.trained}
                      </p>
                    </div>
                    <div className="md:col-span-3">
                      <p className="text-[0.875rem] leading-relaxed text-[var(--color-body)]">
                        {t.since}
                      </p>
                    </div>
                    <div className="md:col-span-5">
                      <p className="text-[0.9375rem] leading-[1.7] text-[var(--color-body)]">
                        {t.note}
                      </p>
                    </div>
                  </li>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>

        {/* -------------------------------------------------------------- */}
        {/* SPACE - offset gallery, 2 + 1 + 1, no equal card row          */}
        {/* -------------------------------------------------------------- */}
        <section id="space" className="border-t border-[var(--color-hairline)] py-24 md:py-32">
          <div className="shell">
            <Reveal>
              <SectionHead
                title="The building"
                body="A converted print works on Cotham Brow. Four rooms across two floors and a walled yard at the back."
              />
            </Reveal>

            <div className="mt-14 grid gap-6 lg:grid-cols-12">
              {SPACE.map((img, i) => (
                <Reveal key={img.seed} delay={i * 70} className={img.span}>
                  <figure>
                    <div className={`frame ${img.ratio} w-full`}>
                      <img
                        src={`https://picsum.photos/seed/${img.seed}/${img.w}/${img.h}`}
                        alt={img.alt}
                        loading="lazy"
                        width={img.w}
                        height={img.h}
                      />
                    </div>
                    <figcaption className="mt-4 text-[0.875rem] text-[var(--color-mute)]">
                      {img.caption}
                    </figcaption>
                  </figure>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* -------------------------------------------------------------- */}
        {/* MEMBERSHIP - two options, one weighted, no three equal cards    */}
        {/* -------------------------------------------------------------- */}
        <section id="membership" className="border-t border-[var(--color-hairline)] py-24 md:py-32">
          <div className="shell">
            <Reveal>
              <SectionHead
                title="Two ways to pay"
                body="No joining fee, no minimum term on either. Cancel the membership with a month of notice."
              />
            </Reveal>

            <div className="mt-14 grid gap-6 lg:grid-cols-12">
              <Reveal className="lg:col-span-5">
                <div className="flex h-full flex-col border border-[var(--color-hairline)] p-9">
                  <h3 className="display text-[1.625rem] text-[var(--color-ink)]">
                    {TIERS[0].name}
                  </h3>
                  <p className="mt-4 text-[0.9375rem] leading-[1.7] text-[var(--color-body)]">
                    {TIERS[0].lead}
                  </p>
                  <p className="mt-8 flex items-baseline gap-2">
                    <span className="display text-[3.25rem] leading-none text-[var(--color-ink)]">
                      {`£${TIERS[0].price}`}
                    </span>
                    <span className="text-[0.875rem] text-[var(--color-mute)]">
                      {TIERS[0].unit}
                    </span>
                  </p>
                  <ul className="mt-8 flex-1 space-y-3.5">
                    {TIERS[0].includes.map((line) => (
                      <li
                        key={line}
                        className="border-t border-[var(--color-hairline)] pt-3.5 text-[0.9375rem] leading-relaxed text-[var(--color-body)]"
                      >
                        {line}
                      </li>
                    ))}
                  </ul>
                  <a href="#enquiry" className="btn btn-secondary mt-9 w-full">
                    {TIERS[0].cta}
                  </a>
                </div>
              </Reveal>

              <Reveal className="lg:col-span-7" delay={90}>
                <div className="flex h-full flex-col bg-[var(--color-ink)] p-9 text-[var(--color-on-dark)]">
                  <div className="flex items-center gap-4">
                    <h3 className="display text-[1.625rem] text-white">
                      {TIERS[1].name}
                    </h3>
                    <span className="bg-[var(--color-accent)] px-3.5 py-1 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-white">
                      Most people pick this
                    </span>
                  </div>
                  <p className="mt-4 text-[0.9375rem] leading-[1.7] text-white/70">
                    {TIERS[1].lead}
                  </p>
                  <p className="mt-8 flex items-baseline gap-2">
                    <span className="display text-[3.25rem] leading-none text-white">
                      {`£${TIERS[1].price}`}
                    </span>
                    <span className="text-[0.875rem] text-white/55">
                      {TIERS[1].unit}
                    </span>
                  </p>
                  <ul className="mt-8 flex-1 space-y-3.5">
                    {TIERS[1].includes.map((line) => (
                      <li
                        key={line}
                        className="border-t border-white/15 pt-3.5 text-[0.9375rem] leading-relaxed text-white/75"
                      >
                        {line}
                      </li>
                    ))}
                  </ul>
                  <a
                    href="#enquiry"
                    className="btn btn-primary mt-9 w-full bg-white text-[var(--color-ink)] hover:bg-[var(--color-accent-soft)] hover:text-[var(--color-ink)]"
                  >
                    {TIERS[1].cta}
                  </a>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* -------------------------------------------------------------- */}
        {/* ENQUIRY - label above every input, real htmlFor               */}
        {/* -------------------------------------------------------------- */}
        <section id="enquiry" className="border-t border-[var(--color-hairline)] py-24 md:py-32">
          <div className="shell">
            <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
              <Reveal className="lg:col-span-5">
                <h2 className="display display-lg">
                  Book a class
                  <br />
                  or ask first.
                </h2>
                <p className="lede mt-7">
                  Tell us which class and day suits you. If you have never done
                  yoga, say so and we will put you in the foundations class.
                </p>
                <dl className="mt-12 space-y-6">
                  {STUDIO_DETAILS.map(([k, v]) => (
                    <div key={k} className="border-t border-[var(--color-hairline)] pt-4">
                      <dt className="text-[0.8125rem] font-semibold text-[var(--color-ink)]">
                        {k}
                      </dt>
                      <dd className="mt-1.5 text-[0.9375rem] text-[var(--color-body)]">
                        {v}
                      </dd>
                    </div>
                  ))}
                </dl>
              </Reveal>

              <Reveal className="lg:col-span-7" delay={90}>
                <form className="grid gap-6" noValidate>
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="grid gap-2">
                      <label htmlFor="name" className="text-[0.8125rem] font-semibold text-[var(--color-ink)]">
                        Name
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        aria-describedby="name-hint"
                        className="field"
                      />
                      <p id="name-hint" className="text-[0.8125rem] text-[var(--color-mute)]">
                        The name to put on the mat.
                      </p>
                    </div>
                    <div className="grid gap-2">
                      <label htmlFor="email" className="text-[0.8125rem] font-semibold text-[var(--color-ink)]">
                        Email
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        aria-describedby="email-hint"
                        className="field"
                      />
                      <p id="email-hint" className="text-[0.8125rem] text-[var(--color-mute)]">
                        We only use this to answer you.
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="grid gap-2">
                      <label htmlFor="class" className="text-[0.8125rem] font-semibold text-[var(--color-ink)]">
                        Which class
                      </label>
                      <select id="class" name="class" className="field" defaultValue="">
                        <option value="" disabled>
                          Choose a class
                        </option>
                        <option>Morning Vinyasa</option>
                        <option>Lunchtime Reset</option>
                        <option>Hatha Foundations</option>
                        <option>Slow Flow</option>
                        <option>Yin and Breath</option>
                        <option>Restorative</option>
                      </select>
                    </div>
                    <div className="grid gap-2">
                      <label htmlFor="day" className="text-[0.8125rem] font-semibold text-[var(--color-ink)]">
                        Which day
                      </label>
                      <select id="day" name="day" className="field" defaultValue="">
                        <option value="" disabled>
                          Choose a day
                        </option>
                        {DAYS.map((d) => (
                          <option key={d}>{d}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <label htmlFor="notes" className="text-[0.8125rem] font-semibold text-[var(--color-ink)]">
                      Anything we should know
                    </label>
                    <textarea
                      id="notes"
                      name="notes"
                      rows={4}
                      aria-describedby="notes-hint"
                      className="field"
                    />
                    <p id="notes-hint" className="text-[0.8125rem] text-[var(--color-mute)]">
                      Injuries, pregnancy, or a first class. Leave it blank if
                      nothing applies.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 pt-2">
                    <button type="submit" className="btn btn-primary">
                      Send enquiry
                    </button>
                    <p className="text-[0.8125rem] text-[var(--color-mute)]">
                      We reply within one working day.
                    </p>
                  </div>
                </form>
              </Reveal>
            </div>
          </div>
        </section>
      </main>

      {/* ---------------------------------------------------------------- */}
      {/* FOOTER                                                          */}
      {/* ---------------------------------------------------------------- */}
      <footer className="border-t border-[var(--color-hairline)] py-14">
        <div className="shell">
          <div className="flex flex-col gap-10 md:flex-row md:justify-between">
            <div>
              <p className="display text-[1.375rem] text-[var(--color-ink)]">Lumenwell</p>
              <p className="mt-3 max-w-xs text-[0.875rem] leading-relaxed text-[var(--color-mute)]">
                41 Cotham Brow, Redland, Bristol BS6 6AD
              </p>
            </div>

            <nav className="flex flex-col gap-2.5">
              {nav.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="text-[0.875rem] text-[var(--color-mute)] transition-colors hover:text-[var(--color-ink)]"
                >
                  {item.label}
                </a>
              ))}
              <a
                href="#enquiry"
                className="text-[0.875rem] text-[var(--color-mute)] transition-colors hover:text-[var(--color-ink)]"
              >
                Book a class
              </a>
            </nav>

            <div className="md:text-right">
              <p className="text-[0.875rem] text-[var(--color-mute)]">
                0117 496 2280
              </p>
              <p className="mt-2.5 text-[0.875rem] text-[var(--color-mute)]">
                hello@lumenwell.studio
              </p>
            </div>
          </div>

          <div className="mt-12 flex flex-col gap-3 border-t border-[var(--color-hairline)] pt-8 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[0.8125rem] text-[var(--color-mute)]">
              Lumenwell Ltd, registered in England 09472218
            </p>
            <p className="text-[0.8125rem] text-[var(--color-mute)]">
              Developed by{' '}
              <a
                href="https://thediyadevelopers.com"
                className="text-[var(--color-body)] underline decoration-[var(--color-hairline)] underline-offset-4 transition-colors hover:text-[var(--color-accent)]"
              >
                Diya Developers
              </a>
            </p>
          </div>
        </div>
      </footer>
    </>
  )
}
