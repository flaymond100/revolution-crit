import { Link } from 'react-router-dom';
import { RaceCard } from '../components/RaceCard';
import { SectionIntro } from '../components/SectionIntro';
import { raceCalendar } from '../data/races';

const upcomingRaces = raceCalendar.slice(0, 3);

const categories = [
  {
    title: 'Elite Racing',
    summary: 'Fast grids, aggressive pacing, and clear qualification expectations for experienced criterium riders.',
    details: ['High-speed urban circuits', 'Series points priority', 'Tactical finals'],
  },
  {
    title: 'Women',
    summary: 'Dedicated racing blocks with equal prominence in schedule structure, storytelling, and result visibility.',
    details: ['Equal event presence', 'Series standings', 'Dedicated race comms'],
  },
  {
    title: 'Masters',
    summary: 'Age-group focused racing for experienced riders who want competitive fields and smoother event orientation.',
    details: ['Clear category splits', 'Practical start info', 'Accessible race briefings'],
  },
  {
    title: 'Open and Youth',
    summary: 'Entry routes for new riders, amateur racers, and younger fields with lower friction and clearer guidance.',
    details: ['Beginner-friendly access', 'Flexible formats', 'Growth path into the series'],
  },
];

const latestResults = [
  {
    season: '2025',
    race: 'Berlin Night Circuit',
    winner: 'Lena Hoffmann',
    category: 'Women Elite',
    note: 'Strong late attack, decisive final two laps.',
  },
  {
    season: '2025',
    race: 'Harbor Sprint Weekend',
    winner: 'Jonas Keller',
    category: 'Elite Men',
    note: 'Won the final from a four-rider break after the last corner.',
  },
  {
    season: '2025',
    race: 'Riverside Floodlights',
    winner: 'Mara Stein',
    category: 'Masters Women',
    note: 'Controlled points race with the highest lap score of the night.',
  },
];

const partners = ['VeloPulse', 'Ritmo Lab', 'Apex Wheels', 'City Circuit Coffee', 'Trackline Studio', 'Neon Draft'];

export function HomePage() {
  return (
    <div className="page-shell">
      <section className="hero-grid overflow-hidden rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(124,58,237,0.28),transparent_34%),radial-gradient(circle_at_85%_0%,rgba(0,212,255,0.22),transparent_26%),linear-gradient(135deg,rgba(20,28,39,0.98),rgba(11,15,20,0.92))] px-6 py-8 sm:px-10 sm:py-12 lg:px-14 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:gap-12">
          <div className="relative">
            <span className="eyebrow">2026 race series</span>
            <h1 className="mt-5 max-w-3xl font-heading text-4xl font-semibold leading-[1.02] text-(--text-primary-dark) sm:text-5xl lg:text-7xl">
              Find your next crit fast.
              <span className="block text-(--accent-secondary)">Race days, categories, results, and the next start line.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-(--text-secondary-dark) sm:text-lg">
              Revolution Crit is being rebuilt around quick orientation: upcoming races first, clearer category entry points, and results you can reach in seconds on mobile.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link className="cta-button w-full justify-center sm:w-auto" to="/races">
                Explore Upcoming Races
              </Link>
              <Link className="ghost-button w-full justify-center sm:w-auto" to="/contact">
                Ask About Registration
              </Link>
            </div>

            <dl className="mt-10 grid gap-4 sm:grid-cols-3">
              <div className="stat-card">
                <dt>Next race</dt>
                <dd>18 May</dd>
              </div>
              <div className="stat-card">
                <dt>Series format</dt>
                <dd>Urban crit</dd>
              </div>
              <div className="stat-card">
                <dt>Fast path</dt>
                <dd>Races to results</dd>
              </div>
            </dl>
          </div>

          <div className="grid gap-4 self-end">
            <div className="hero-highlight-card rounded-[1.75rem] border border-white/10 p-5 sm:p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-(--accent-secondary)">Upcoming focus</p>
              <h2 className="mt-3 font-heading text-2xl font-semibold text-(--text-primary-dark)">Berlin Night Circuit</h2>
              <p className="mt-3 text-sm leading-6 text-(--text-secondary-dark)">
                Evening racing, short laps, clear category blocks, and a layout designed to put registration and event details above the fold.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <span className="filter-chip">Tempelhof</span>
                <span className="filter-chip">45 min + 3</span>
                <span className="filter-chip">Entries open</span>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
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
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <SectionIntro
          actionLabel="Full race calendar"
          actionTo="/races"
          description="Reusable race cards anchor the homepage now and can move directly into the dedicated races overview later without redesign work."
          eyebrow="Upcoming races"
          title="Pick a round quickly and get to the details that matter."
        />

        <div className="grid gap-5 xl:grid-cols-3">
          {upcomingRaces.map((race, index) => (
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

      <section className="space-y-6">
        <SectionIntro
          actionLabel="See all categories"
          actionTo="/categories"
          description="Category cards give riders a cleaner first filter: who the race is for, what the pace feels like, and what kind of experience to expect."
          eyebrow="Categories overview"
          title="A faster way to understand where you fit."
        />

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {categories.map((category) => (
            <article key={category.title} className="surface-panel flex flex-col p-6">
              <h3 className="font-heading text-2xl font-semibold text-(--text-primary-dark)">{category.title}</h3>
              <p className="mt-3 text-sm leading-6 text-(--text-secondary-dark)">{category.summary}</p>
              <ul className="mt-5 space-y-3 text-sm text-(--text-secondary-dark)">
                {category.details.map((detail) => (
                  <li key={detail} className="flex items-start gap-3">
                    <span className="mt-2 h-2 w-2 rounded-full bg-(--accent-cta)" />
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <SectionIntro
          actionLabel="Open results hub"
          actionTo="/results/2025"
          description="Recent winners and race outcomes are visible from the homepage, which reduces friction for riders returning to check standings and archives."
          eyebrow="Latest results"
          title="Recent podiums and series movement, without extra clicks."
        />

        <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="surface-panel overflow-hidden">
            <div className="border-b border-white/10 px-6 py-5">
              <h3 className="font-heading text-2xl font-semibold text-(--text-primary-dark)">Recent race winners</h3>
            </div>
            <div className="divide-y divide-white/10">
              {latestResults.map((result) => (
                <article key={`${result.season}-${result.race}`} className="px-6 py-5">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-(--accent-secondary)">{result.season} · {result.category}</p>
                      <h4 className="mt-2 font-heading text-xl font-semibold text-(--text-primary-dark)">{result.race}</h4>
                    </div>
                    <p className="text-sm font-medium text-(--text-primary-dark)">Winner: {result.winner}</p>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-(--text-secondary-dark)">{result.note}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="surface-panel p-6">
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-(--accent-secondary)">Fast orientation</p>
            <h3 className="mt-3 font-heading text-2xl font-semibold text-(--text-primary-dark)">Results need to feel searchable even before full data lands.</h3>
            <p className="mt-3 text-sm leading-6 text-(--text-secondary-dark)">
              This preview establishes the visual system for future tables: strong hierarchy, quick recognition of race and category, and obvious next actions to the full archive.
            </p>
            <div className="mt-6 grid gap-3">
              <Link className="cta-button w-full justify-center" to="/results/2025/berlin-night-circuit">
                Open Sample Result Detail
              </Link>
              <Link className="ghost-button w-full justify-center" to="/results">
                Browse All Seasons
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="surface-panel overflow-hidden p-6 sm:p-8">
          <SectionIntro
            actionLabel="Open gallery"
            actionTo="/gallery/2025"
            description="The gallery teaser uses lightweight layered panels instead of heavy media so the homepage stays fast while still feeling image-ready."
            eyebrow="Gallery teaser"
            title="Visual energy without dragging performance down."
          />

          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-[1.15fr_0.85fr]">
            <div className="gallery-tile gallery-tile-large">
              <span>Night laps</span>
            </div>
            <div className="grid gap-4">
              <div className="gallery-tile gallery-tile-small">
                <span>Grid prep</span>
              </div>
              <div className="gallery-tile gallery-tile-small-alt">
                <span>Podium light</span>
              </div>
            </div>
          </div>
        </div>

        <div className="surface-panel p-6 sm:p-8">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-(--accent-secondary)">Partners</p>
          <h2 className="mt-3 font-heading text-3xl font-semibold text-(--text-primary-dark)">Series backed by brands that fit the street-race tone.</h2>
          <p className="mt-4 text-sm leading-6 text-(--text-secondary-dark)">
            Sponsor presence should feel integrated, not pasted on. This strip is set up for logos now and scalable partner storytelling later.
          </p>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {partners.map((partner) => (
              <div key={partner} className="partner-pill">
                {partner}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="secondary-cta-panel overflow-hidden rounded-[2rem] border border-white/10 px-6 py-8 sm:px-8 sm:py-10 lg:px-10">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div>
            <span className="eyebrow">Next step</span>
            <h2 className="mt-4 font-heading text-3xl font-semibold text-(--text-primary-dark) sm:text-4xl">
              Want race prep, a camp slot, or a direct answer before you sign up?
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-(--text-secondary-dark)">
              Use the training camp route for structured off-race preparation or contact the team directly when registration, categories, or partner questions need a human answer.
            </p>
          </div>

          <div className="grid gap-3">
            <Link className="cta-button w-full justify-center" to="/training-camp">
              Explore Training Camp
            </Link>
            <Link className="ghost-button w-full justify-center" to="/contact">
              Contact The Team
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}