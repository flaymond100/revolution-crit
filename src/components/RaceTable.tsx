import { Link } from 'react-router-dom';
import type { RaceItem } from '../data/races';

type RaceTableProps = {
  races: RaceItem[];
};

function statusClass(status: RaceItem['registrationStatus']) {
  if (status === 'Entries open') {
    return 'border-[color:var(--success)]/40 bg-[color:var(--success)]/15 text-[color:var(--text-primary-dark)]';
  }

  if (status === 'Waitlist') {
    return 'border-[color:var(--warning)]/40 bg-[color:var(--warning)]/16 text-[color:var(--text-primary-dark)]';
  }

  if (status === 'Closed') {
    return 'border-white/10 bg-white/8 text-[color:var(--text-secondary-dark)]';
  }

  return 'border-[color:var(--accent-secondary)]/28 bg-[color:var(--accent-secondary)]/12 text-[color:var(--text-primary-dark)]';
}

export function RaceTable({ races }: RaceTableProps) {
  return (
    <div className="surface-panel overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[56rem] border-collapse">
          <thead>
            <tr className="border-b border-white/10 text-left text-[0.68rem] uppercase tracking-[0.24em] text-(--text-secondary-dark)">
              <th className="px-6 py-4 font-semibold">Race</th>
              <th className="px-6 py-4 font-semibold">Date</th>
              <th className="px-6 py-4 font-semibold">City</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold">Details</th>
            </tr>
          </thead>
          <tbody>
            {races.map((race) => (
              <tr key={race.id} className="border-b border-white/8 text-sm text-(--text-secondary-dark)">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div aria-hidden="true" className="race-table-thumb" style={{ background: race.cover }} />
                    <div>
                      <p className="font-heading text-lg font-semibold text-(--text-primary-dark)">{race.title}</p>
                      <p className="text-xs uppercase tracking-[0.16em] text-(--text-secondary-dark)">{race.round}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-(--text-primary-dark)">{race.date}</td>
                <td className="px-6 py-4">
                  <p className="text-(--text-primary-dark)">{race.city}</p>
                  <p className="text-xs text-(--text-secondary-dark)">{race.venue}</p>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex rounded-full border px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.16em] ${statusClass(race.registrationStatus)}`}>
                    {race.registrationStatus}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <Link className="race-card-link" to={`/races/${race.id}`}>
                    Open Race
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
