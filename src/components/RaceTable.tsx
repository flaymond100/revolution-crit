import { Link } from 'react-router-dom';
import type { RaceCalendar } from '../types';

type RaceTableProps = {
  races: RaceCalendar[];
};

function raceStatus(race: RaceCalendar): 'OPEN' | 'FINISHED' {
  const raceDate = new Date(race.raceDate);
  if (Number.isNaN(raceDate.getTime())) {
    return 'OPEN';
  }

  const today = new Date();
  const raceDay = new Date(
    raceDate.getFullYear(),
    raceDate.getMonth(),
    raceDate.getDate()
  ).getTime();
  const todayDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  ).getTime();

  return raceDay < todayDay ? 'FINISHED' : 'OPEN';
}

function statusClass(status: ReturnType<typeof raceStatus>) {
  if (status === 'OPEN') {
    return 'border-[color:var(--success)]/40 bg-[color:var(--success)]/15 text-[color:var(--text-primary-dark)]';
  }

  return 'border-[color:var(--border-dark)] bg-[color:var(--surface-soft)] text-[color:var(--text-secondary-dark)]';
}

function formatRaceDate(date: string): string {
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) {
    return date;
  }

  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(parsed);
}

function parseCity(location: string): string {
  const city = location.split(',')[0]?.trim();
  return city || location;
}

function formatRaceType(type: string): string {
  return type
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map(part => part[0]!.toUpperCase() + part.slice(1).toLowerCase())
    .join(' ');
}

export function RaceTable({ races }: RaceTableProps) {
  if (races.length === 0) {
    return (
      <div className="surface-panel p-6 text-sm text-(--text-secondary-dark) sm:p-8">
        No race data available yet.
      </div>
    );
  }

  return (
    <div className="surface-panel overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[56rem] border-collapse">
          <thead>
            <tr className="border-b border-[color:var(--border-dark)] text-left text-[0.68rem] uppercase tracking-[0.24em] text-(--text-secondary-dark)">
              <th className="px-6 py-4 font-semibold">Race</th>
              <th className="px-6 py-4 font-semibold">Date</th>
              <th className="px-6 py-4 font-semibold">City</th>
              <th className="px-6 py-4 font-semibold">Registration Status</th>
              <th className="px-6 py-4 font-semibold">Details</th>
            </tr>
          </thead>
          <tbody>
            {races.map(race => {
              const status = raceStatus(race);
              const city = parseCity(race.location);

              return (
                <tr
                  key={race.id}
                  className="border-b border-[color:var(--border-dark)] text-sm text-(--text-secondary-dark)"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        aria-hidden="true"
                        className="race-table-thumb"
                        style={{
                          background:
                            'linear-gradient(140deg, rgba(124,58,237,0.52), rgba(11,15,20,0.78)), radial-gradient(circle at 82% 16%, rgba(0,212,255,0.36), transparent 38%)',
                        }}
                      />
                      <div>
                        <Link
                          className="font-heading text-lg font-semibold text-(--text-primary-dark)"
                          to={`/calendar/${race.id}`}
                        >
                          {race.name || `${city} ${formatRaceType(race.type)}`}
                        </Link>
                        {/* <p className="text-xs uppercase tracking-[0.16em] text-(--text-secondary-dark)">
                          {race.subRaces?.length ?? 0} categories
                        </p> */}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-(--text-primary-dark)">
                    {formatRaceDate(race.raceDate)}
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-xs text-(--text-secondary-dark)">
                      {race.location}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex rounded-full border px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.16em] ${statusClass(status)}`}
                    >
                      {status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {race.externalRegistrationUrl ? (
                      <Link
                        className="race-card-link"
                        to={`/calendar/${race.id}`}
                      >
                        Register
                      </Link>
                    ) : (
                      <span className="race-card-link cursor-not-allowed opacity-40">
                        Register
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
