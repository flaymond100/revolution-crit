import { Link } from 'react-router-dom';

type RaceCardProps = {
  id: string;
  round: string;
  title: string;
  date: string;
  city: string;
  venue: string;
  description: string;
  categories: string[];
  format: string;
  registrationStatus: string;
  featured?: boolean;
};

export function RaceCard({
  id,
  round,
  title,
  date,
  city,
  venue,
  description,
  format,
  registrationStatus,
  featured = false,
}: RaceCardProps) {
  return (
    <article
      className={[
        'race-card group flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-[color:var(--border-dark)] p-5 sm:p-6',
        featured ? 'race-card-featured' : 'race-card-default',
      ].join(' ')}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-(--accent-secondary)">
            {round}
          </p>
          <h3 className="mt-3 font-heading text-2xl font-semibold text-(--text-primary-dark)">
            {title}
          </h3>
        </div>
        <span className="rounded-full border border-[color:var(--border-dark)] bg-[color:var(--surface-soft)] px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-(--text-primary-dark)">
          {registrationStatus}
        </span>
      </div>

      <div className="mt-5 grid gap-3 text-sm text-(--text-secondary-dark) sm:grid-cols-2">
        <div>
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-(--text-secondary-dark)">
            Date
          </p>
          <p className="mt-1 text-base text-(--text-primary-dark)">{date}</p>
        </div>
        <div>
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-(--text-secondary-dark)">
            City
          </p>
          <p className="mt-1 text-base text-(--text-primary-dark)">{city}</p>
        </div>
      </div>

      <p className="mt-2 text-sm text-(--text-secondary-dark)">{venue}</p>

      <p className="mt-5 text-sm leading-6 text-(--text-secondary-dark)">
        {description}
      </p>

      {/* <div className="mt-5 flex flex-wrap gap-2">
        {categories.map(category => (
          <span key={category} className="filter-chip">
            {category}
          </span>
        ))}
      </div> */}

      <div className="mt-6 flex items-center justify-between gap-3 border-t border-[color:var(--border-dark)] pt-5">
        <div>
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-(--text-secondary-dark)">
            Format
          </p>
          <p className="mt-1 text-sm font-medium text-(--text-primary-dark)">
            {format}
          </p>
        </div>

        <Link className="race-card-link" to={`/calendar/${id}`}>
          Open Race
        </Link>
      </div>
    </article>
  );
}
