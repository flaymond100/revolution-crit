import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { RaceCard } from '../components/RaceCard';
import { SectionIntro } from '../components/SectionIntro';
import { fetchRaceCalendars } from '../lib/raceCalendar';
import { toRaceItems } from '../lib/racePresentation';
import { RaceTable } from '../components/RaceTable';

export function HomePage() {
  const { data: raceCalendar } = useQuery({
    queryKey: ['race-calendar'],
    queryFn: fetchRaceCalendars,
  });

  const races = toRaceItems(raceCalendar ?? []);

  const promotedRaceDate = races[0]
    ? new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }).format(new Date(races[0].date))
    : 'Date TBA';

  console.log(races);
  return (
    <div className="page-shell">
      <section className="hero-grid overflow-hidden rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(124,58,237,0.28),transparent_34%),radial-gradient(circle_at_85%_0%,rgba(0,212,255,0.22),transparent_26%),linear-gradient(135deg,rgba(20,28,39,0.98),rgba(11,15,20,0.92))] px-6 py-8 sm:px-10 sm:py-12 lg:px-14 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:gap-12">
          <div className="relative">
            <h1 className="mt-5 max-w-3xl font-heading text-4xl font-semibold leading-[1.02] text-(--text-primary-dark) sm:text-5xl lg:text-7xl">
              Wir wollen den deutschen Straßenradsport
              <span className="block text-(--accent-secondary)">
                revolutionieren!
              </span>
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-(--text-secondary-dark) sm:text-lg">
              Kurze spektakuläre Radrennen durch die Straßenschluchten deutscher
              Innenstädte. Foodtrucks, Moderation, Musik, Rennaction... die
              Zuschauer*innen sollen etwas geboten bekommen. Die Sportler*innen
              sollen vor Publikum ihre Kurven-Skills und Sprintfähigkeiten
              zeigen.
            </p>

            {/* <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                className="cta-button w-full justify-center sm:w-auto"
                to="/calendar"
              >
                Explore Upcoming Races
              </Link>
              <Link
                className="ghost-button w-full justify-center sm:w-auto"
                to="/contact"
              >
                Ask About Registration
              </Link>
            </div> */}

            {/* <dl className="mt-10 grid gap-4 sm:grid-cols-3">
              <div className="stat-card">
                <dt>Next race</dt>
                <dd>18 May</dd>
              </div>
              <div className="stat-card">
                <dt>Series format</dt>
                <dd>crit</dd>
              </div>
              <div className="stat-card">
                <dt>Fast path</dt>
                <dd>Races to results</dd>
              </div>

            </dl> */}
          </div>

          <div className="grid gap-4 self-end">
            <div className="hero-highlight-card rounded-[1.75rem] border border-white/10 p-5 sm:p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-(--accent-secondary)">
                Upcoming Highlight
              </p>
              <h2 className="mt-3 font-heading text-2xl font-semibold text-(--text-primary-dark)">
                {races[0]?.title ?? 'Featured race'}
              </h2>
              <p className="mt-3 text-sm leading-6 text-(--text-secondary-dark)">
                {races[0]
                  ? `Highlighted event in ${races[0].city}. Explore category blocks and participant data from the race detail page.`
                  : 'Promotion race is loading. Check back in a moment for latest event details.'}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <span className="filter-chip">{promotedRaceDate}</span>
                <span className="filter-chip">
                  {races[0]?.city ?? 'Location TBA'}
                </span>
              </div>

              {races[0]?.externalRegistrationUrl && (
                <div className="mt-5">
                  <Link
                    className="cta-button w-full justify-center"
                    target="_blank"
                    to={races[0]?.externalRegistrationUrl ?? '/calendar'}
                  >
                    Register Now
                  </Link>
                </div>
              )}
            </div>

            {/* <div className="grid gap-4 sm:grid-cols-2">
              <article className="surface-panel p-5">
                <p className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-(--accent-secondary)">Latest result</p>
                <h3 className="mt-3 font-heading text-xl font-semibold text-(--text-primary-dark)">2025 winners live here</h3>
                <p className="mt-2 text-sm leading-6 text-(--text-secondary-dark)">Jump from homepage to recent podiums without hunting through archive pages.</p>
              </article>
              <article className="surface-panel p-5">
                <p className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-(--accent-secondary)">Gallery archive</p>
                <h3 className="mt-3 font-heading text-xl font-semibold text-(--text-primary-dark)">Season and race-based</h3>
                <p className="mt-2 text-sm leading-6 text-(--text-secondary-dark)">Visual storytelling stays structured and easy to browse on small screens.</p>
              </article>
            </div> */}
          </div>
        </div>
      </section>

      <section className="space-y-6" aria-label="Race table">
        <SectionIntro eyebrow="Race Calendar" title="" description="" />
        <RaceTable races={raceCalendar ?? []} />
      </section>

      <section className="space-y-6">
        <SectionIntro
          actionLabel="Full race calendar"
          actionTo="/calendar"
          description="Have a deep dive into the races."
          eyebrow="Races"
          title="Pick a race that suits you the most."
        />

        <div className="grid gap-5 xl:grid-cols-3">
          {races.map((race, index) => (
            <RaceCard
              key={race.id}
              categories={race.categories}
              city={race.city}
              cover={race.cover}
              date={race.date}
              description={race.description}
              featured={index === 0}
              format={race.format}
              id={race.id}
              registrationStatus={race.registrationStatus}
              round={race.round}
              title={race.title}
              venue={race.venue}
            />
          ))}
        </div>
      </section>

      {/* <section className="secondary-cta-panel overflow-hidden rounded-[2rem] border border-white/10 px-6 py-8 sm:px-8 sm:py-10 lg:px-10">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div>
            <span className="eyebrow">Next step</span>
            <h2 className="mt-4 font-heading text-3xl font-semibold text-(--text-primary-dark) sm:text-4xl">
              Want race prep, a camp slot, or a direct answer before you sign
              up?
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-(--text-secondary-dark)">
              Use the training camp route for structured off-race preparation or
              contact the team directly when registration, categories, or
              partner questions need a human answer.
            </p>
          </div>

          <div className="grid gap-3">
            <Link
              className="cta-button w-full justify-center"
              to="/training-camp"
            >
              Explore Training Camp
            </Link>
            <Link className="ghost-button w-full justify-center" to="/contact">
              Contact The Team
            </Link>
          </div>
        </div>
      </section> */}
    </div>
  );
}
