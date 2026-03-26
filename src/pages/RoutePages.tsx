import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import { RaceCard } from '../components/RaceCard';
import { RaceTable } from '../components/RaceTable';
import { SectionIntro } from '../components/SectionIntro';
import { raceCalendar } from '../data/races';
import { fetchRaceCalendars } from '../lib/raceCalendar';
import { toFallbackRaceCalendars, toRaceItems } from '../lib/racePresentation';

type PlaceholderPageProps = {
  eyebrow: string;
  title: string;
  description: string;
  highlights: string[];
  ctaLabel?: string;
  ctaTo?: string;
};

function PlaceholderPage({ eyebrow, title, description, highlights, ctaLabel, ctaTo }: PlaceholderPageProps) {
  return (
    <section className="page-shell">
      <div className="surface-panel overflow-hidden">
        <div className="grid gap-8 px-6 py-8 sm:px-8 sm:py-10 lg:grid-cols-[1.2fr_0.8fr] lg:px-10 lg:py-12">
          <div>
            <span className="eyebrow">{eyebrow}</span>
            <h1 className="mt-4 font-heading text-4xl font-semibold text-(--text-primary-dark) sm:text-5xl">
              {title}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-(--text-secondary-dark) sm:text-lg">
              {description}
            </p>
            {ctaLabel && ctaTo ? (
              <Link className="cta-button mt-8 inline-flex" to={ctaTo}>
                {ctaLabel}
              </Link>
            ) : null}
          </div>

          <div className="grid gap-3 self-start">
            {highlights.map((highlight) => (
              <div key={highlight} className="rounded-[1.5rem] border border-white/10 bg-white/5 px-4 py-4 text-sm leading-6 text-(--text-secondary-dark)">
                {highlight}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function RacesPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['race-calendar'],
    queryFn: fetchRaceCalendars,
  });

  const tableRaces = data && data.length > 0 ? data : toFallbackRaceCalendars(raceCalendar);
  const races = data && data.length > 0 ? toRaceItems(data) : raceCalendar;

  if (isLoading) {
    return (
      <section className="page-shell">
        <div className="surface-panel p-6 sm:p-8">
          <div className="h-4 w-36 animate-pulse rounded bg-white/10" />
          <div className="mt-4 h-10 w-full max-w-2xl animate-pulse rounded bg-white/10" />
          <div className="mt-4 h-5 w-full max-w-3xl animate-pulse rounded bg-white/8" />
        </div>

        <div className="surface-panel overflow-hidden p-6 sm:p-8">
          <div className="h-9 w-full animate-pulse rounded bg-white/8" />
          <div className="mt-3 h-9 w-full animate-pulse rounded bg-white/8" />
          <div className="mt-3 h-9 w-full animate-pulse rounded bg-white/8" />
          <div className="mt-3 h-9 w-full animate-pulse rounded bg-white/8" />
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="surface-panel h-[23rem] animate-pulse rounded-[1.75rem] bg-white/5" />
          ))}
        </div>
      </section>
    );
  }

  if (races.length === 0) {
    return (
      <section className="page-shell">
        <div className="surface-panel p-8 text-center sm:p-10">
          <span className="eyebrow">Race calendar</span>
          <h1 className="mt-5 font-heading text-4xl font-semibold text-(--text-primary-dark) sm:text-5xl">
            No races published yet.
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-(--text-secondary-dark)">
            The calendar is currently empty. Check back soon or reach out directly for pre-release race and registration information.
          </p>
          <div className="mx-auto mt-8 flex max-w-sm flex-col gap-3 sm:flex-row sm:justify-center">
            <Link className="cta-button w-full justify-center" to="/contact">
              Contact Organizers
            </Link>
            <Link className="ghost-button w-full justify-center" to="/training-camp">
              See Training Camp
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="page-shell">
      <div className="surface-panel overflow-hidden border-white/10 bg-[radial-gradient(circle_at_top_right,rgba(0,212,255,0.15),transparent_38%),radial-gradient(circle_at_top_left,rgba(124,58,237,0.22),transparent_34%),linear-gradient(145deg,rgba(18,25,35,0.96),rgba(11,15,20,0.98))] px-6 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12">
        <span className="eyebrow">Main calendar</span>
        <h1 className="mt-5 max-w-4xl font-heading text-4xl font-semibold leading-[1.06] text-(--text-primary-dark) sm:text-5xl lg:text-6xl">
          All races, one clear discovery flow.
        </h1>
        <p className="mt-5 max-w-3xl text-base leading-7 text-(--text-secondary-dark)">
          Use the table for fast comparison and the cards for mobile scanning. Every row and card links directly to race detail routes so registration and planning stay friction-free.
        </p>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <Link className="cta-button w-full justify-center sm:w-auto" to={`/races/${races[0].id}`}>
            Open Next Race
          </Link>
          <Link className="ghost-button w-full justify-center sm:w-auto" to="/contact">
            Need Registration Help?
          </Link>
        </div>
      </div>

      <section className="space-y-6" aria-label="Race table">
        <SectionIntro
          eyebrow="Calendar table"
          title="Compare all rounds quickly."
          description="The table is the primary event discovery view on larger screens: date, city, race identity, and registration status in one pass."
        />
        <RaceTable races={tableRaces} />
      </section>

      <section className="space-y-6" aria-label="Race cards">
        <SectionIntro
          eyebrow="Card preview"
          title="Same race data, card-first for mobile users."
          description="Cards reuse the same metadata with visual covers for fast thumb-scanning. They are ready to be reused on future filtered race views."
        />

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
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
    </section>
  );
}

export function RaceDetailPage() {
  const { slug } = useParams();
  const raceName = slug?.split('-').map((part) => part[0]?.toUpperCase() + part.slice(1)).join(' ') ?? 'Race';

  return (
    <>
      <PlaceholderPage
        ctaLabel="Back to races"
        ctaTo="/races"
        description={`This dynamic route is ready for ${raceName} event details, category schedules, route information, registration states, and sponsor placement.`}
        eyebrow="Race detail"
        highlights={[
          `Current slug placeholder: ${slug ?? 'unknown-race'}`,
          'Mobile layout reserves space for a sticky registration CTA.',
          'Content structure can expand into overview, timetable, FAQs, and live results.',
        ]}
        title={raceName}
      />

      <div className="sticky bottom-4 z-40 mx-auto mt-6 flex w-[calc(100%-2rem)] max-w-md justify-center px-4 lg:hidden">
        <Link className="cta-button w-full justify-center text-center shadow-[0_20px_45px_rgba(255,90,54,0.28)]" to="/contact">
          Registration CTA Placeholder
        </Link>
      </div>
    </>
  );
}

export function ResultsPage() {
  return (
    <PlaceholderPage
      ctaLabel="Open 2026 season"
      ctaTo="/results/2026"
      description="The results hub is structured for season navigation, clean tables, race drill-down, and future live timing integrations."
      eyebrow="Results hub"
      highlights={[
        'Designed for season selection and quick jump links.',
        'Prepared for clean standings tables and searchable datasets.',
        'Can support both overall series standings and single-race results.',
      ]}
      title="Results with a clearer hierarchy."
    />
  );
}

export function ResultsSeasonPage() {
  const { season } = useParams();

  return (
    <PlaceholderPage
      ctaLabel="Open season race result"
      ctaTo={`/results/${season ?? '2026'}/berlin-night-circuit`}
      description={`Season ${season ?? '2026'} is ready for race rows, leaderboard summaries, and category-specific result tables.`}
      eyebrow="Season results"
      highlights={[
        `Season parameter: ${season ?? '2026'}`,
        'Intended for overall standings, round summaries, and rider search.',
        'Pairs cleanly with race-level result detail routes.',
      ]}
      title={`Results for ${season ?? '2026'}`}
    />
  );
}

export function ResultsRacePage() {
  const { raceSlug, season } = useParams();

  return (
    <PlaceholderPage
      ctaLabel="Back to season"
      ctaTo={`/results/${season ?? '2026'}`}
      description="This route is reserved for race-specific standings, lap data, category tabs, and result export actions."
      eyebrow="Race results"
      highlights={[
        `Season: ${season ?? '2026'}`,
        `Race: ${raceSlug ?? 'berlin-night-circuit'}`,
        'Table layout can evolve into live or official classifications without reworking navigation.',
      ]}
      title="Race result detail"
    />
  );
}

export function CategoriesPage() {
  return (
    <PlaceholderPage
      description="Category information will explain eligibility, race formats, and start structures with conversion-friendly sign-up prompts."
      eyebrow="Categories"
      highlights={[
        'Good fit for chips, comparison cards, and FAQ modules.',
        'Supports category-specific registration and schedule logic.',
        'Built to reduce confusion before race-day sign-up.',
      ]}
      title="Clearer entry points for every rider level."
    />
  );
}

export function GalleryPage() {
  return (
    <PlaceholderPage
      ctaLabel="Open 2026 gallery"
      ctaTo="/gallery/2026"
      description="Gallery archives are split by season and race so event photography stays easy to browse and sponsor-safe to surface."
      eyebrow="Gallery overview"
      highlights={[
        'Supports season archives and race-specific sub-galleries.',
        'Ready for media grids, filters, and partner placements.',
        'Keeps visual storytelling separate from transactional race flows.',
      ]}
      title="A cleaner media archive for the series."
    />
  );
}

export function GallerySeasonPage() {
  const { season } = useParams();

  return (
    <PlaceholderPage
      ctaLabel="Open race gallery"
      ctaTo={`/gallery/${season ?? '2026'}/berlin-night-circuit`}
      description={`Season ${season ?? '2026'} can now group galleries by round, campaign, or race weekend.`}
      eyebrow="Season gallery"
      highlights={[
        `Season parameter: ${season ?? '2026'}`,
        'Prepared for masonry or grid-based media layouts.',
        'Keeps archive structure consistent with the results hierarchy.',
      ]}
      title={`Gallery archive ${season ?? '2026'}`}
    />
  );
}

export function GalleryRacePage() {
  const { raceSlug, season } = useParams();

  return (
    <PlaceholderPage
      ctaLabel="Back to season gallery"
      ctaTo={`/gallery/${season ?? '2026'}`}
      description="This placeholder covers the race-level media archive with room for image grids, captions, and sponsor-friendly placements."
      eyebrow="Race gallery"
      highlights={[
        `Season: ${season ?? '2026'}`,
        `Race: ${raceSlug ?? 'berlin-night-circuit'}`,
        'Future-ready for photo credits, filtering, and gallery downloads.',
      ]}
      title="Race gallery detail"
    />
  );
}

export function AboutPage() {
  return (
    <PlaceholderPage
      description="The about page is positioned for series story, mission, organizers, and the brand tone that distinguishes urban criterium racing from generic sports sites."
      eyebrow="About"
      highlights={[
        'Ideal for mission, race philosophy, and event model explainers.',
        'Can support organizer profiles and season history modules.',
        'Matches the premium tone established by the shared shell.',
      ]}
      title="About the series"
    />
  );
}

export function TrainingCampPage() {
  return (
    <PlaceholderPage
      description="A secondary route for clinics, off-season prep, and training content that complements the race calendar without competing with it."
      eyebrow="Training camp"
      highlights={[
        'Good fit for camp dates, schedules, and registration plans.',
        'Lives in secondary navigation to keep the primary race flow focused.',
        'Can later branch into packages, coaches, and accommodation content.',
      ]}
      title="Training camp"
    />
  );
}

export function PartnersPage() {
  return (
    <PlaceholderPage
      description="Partner and sponsor content can live here with room for packages, brand visibility opportunities, and event support messaging."
      eyebrow="Partners"
      highlights={[
        'Suitable for logo systems, sponsorship tiers, and contact prompts.',
        'Maintains a cleaner separation from rider-facing competition pages.',
        'Supports storytelling for equipment, venue, and media partners.',
      ]}
      title="Partners"
    />
  );
}

export function ContactPage() {
  return (
    <PlaceholderPage
      description="The contact route is prepared for rider support, partner inquiries, and organizer communication patterns."
      eyebrow="Contact"
      highlights={[
        'Can split contact intents across riders, media, and partners.',
        'Ready for future form handling and validation flows.',
        'Useful destination for CTA overflow before registration is wired.',
      ]}
      title="Contact"
    />
  );
}

export function FaqPage() {
  return (
    <PlaceholderPage
      description="FAQ content will reduce support load by answering registration, categories, timing, and event-day logistics in one place."
      eyebrow="FAQ"
      highlights={[
        'Best paired with accordion sections and deep links from race pages.',
        'Supports rider onboarding and pre-race clarification.',
        'Secondary navigation placement keeps the primary menu tight.',
      ]}
      title="Frequently asked questions"
    />
  );
}

export function ImprintPage() {
  return (
    <PlaceholderPage
      description="Legal disclosure placeholder for required imprint content."
      eyebrow="Legal"
      highlights={[
        'Route exists and is available from the shared footer.',
        'Prepared for static legal copy migration.',
        'Keeps compliance content outside the primary event flow.',
      ]}
      title="Imprint"
    />
  );
}

export function PrivacyPage() {
  return (
    <PlaceholderPage
      description="Privacy policy placeholder ready for the migrated legal copy and any data handling notes tied to registration or analytics."
      eyebrow="Legal"
      highlights={[
        'Future-ready for privacy copy and processor disclosures.',
        'Linked globally from the footer.',
        'Sits in the same design system as the rest of the site.',
      ]}
      title="Privacy policy"
    />
  );
}

export function TermsPage() {
  return (
    <PlaceholderPage
      description="Terms placeholder for future event terms, platform conditions, or ticketing-related policies."
      eyebrow="Legal"
      highlights={[
        'Prepared for static legal text migration.',
        'Completes the requested footer legal stack.',
        'Uses the same accessible shell as other static pages.',
      ]}
      title="Terms"
    />
  );
}

export function WithdrawalPage() {
  return (
    <PlaceholderPage
      description="Withdrawal information placeholder for legal compliance and consumer rights copy where applicable."
      eyebrow="Legal"
      highlights={[
        'Route is wired and linked in the footer.',
        'Ready for static content migration.',
        'Completes the requested legal route set.',
      ]}
      title="Withdrawal"
    />
  );
}