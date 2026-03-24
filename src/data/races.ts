export type RaceRegistrationStatus = 'Entries open' | 'Waitlist' | 'Coming soon' | 'Closed';

export type RaceItem = {
  id: string;
  round: string;
  title: string;
  date: string;
  city: string;
  venue: string;
  description: string;
  categories: string[];
  format: string;
  registrationStatus: RaceRegistrationStatus;
  cover: string;
};

export const raceCalendar: RaceItem[] = [
  {
    id: 'berlin-night-circuit',
    round: 'Round 01',
    title: 'Berlin Night Circuit',
    date: '18 May 2026',
    city: 'Berlin',
    venue: 'Tempelhof Track District',
    description: 'Floodlit city-block laps, stacked support races, and a fast central paddock designed for riders and spectators.',
    categories: ['Elite', 'Women', 'Masters'],
    format: '45 min + 3 laps',
    registrationStatus: 'Entries open',
    cover:
      'linear-gradient(140deg, rgba(124,58,237,0.58), rgba(11,15,20,0.72)), radial-gradient(circle at 82% 16%, rgba(0,212,255,0.48), transparent 38%)',
  },
  {
    id: 'harbor-sprint-weekend',
    round: 'Round 02',
    title: 'Harbor Sprint Weekend',
    date: '07 June 2026',
    city: 'Hamburg',
    venue: 'HafenCity Circuit',
    description: 'Technical corners, quick accelerations, and category blocks built for clean event orientation before race day.',
    categories: ['U19', 'Amateur', 'Fixed Gear'],
    format: 'Heats + final',
    registrationStatus: 'Entries open',
    cover:
      'linear-gradient(140deg, rgba(11,15,20,0.82), rgba(18,25,35,0.9)), radial-gradient(circle at 14% 20%, rgba(255,90,54,0.46), transparent 34%)',
  },
  {
    id: 'riverside-floodlights',
    round: 'Round 03',
    title: 'Riverside Floodlights',
    date: '28 June 2026',
    city: 'Cologne',
    venue: 'Rheinauhafen Riverside Loop',
    description: 'A late-evening circuit built around clean start windows, visible standings, and high-energy racing under lights.',
    categories: ['Open', 'Women', 'Masters'],
    format: '60 min points race',
    registrationStatus: 'Waitlist',
    cover:
      'linear-gradient(135deg, rgba(18,25,35,0.84), rgba(11,15,20,0.96)), radial-gradient(circle at 78% 90%, rgba(0,212,255,0.36), transparent 42%)',
  },
  {
    id: 'old-town-knockout',
    round: 'Round 04',
    title: 'Old Town Knockout',
    date: '19 July 2026',
    city: 'Leipzig',
    venue: 'Altmarkt Sprint Ring',
    description: 'Short knockout blocks with high rider turnover and spectator-facing elimination rounds around the old market district.',
    categories: ['Elite', 'Open', 'U19'],
    format: 'Knockout brackets',
    registrationStatus: 'Coming soon',
    cover:
      'linear-gradient(155deg, rgba(124,58,237,0.5), rgba(18,25,35,0.92)), radial-gradient(circle at 22% 16%, rgba(255,90,54,0.3), transparent 34%)',
  },
  {
    id: 'docklands-final-laps',
    round: 'Round 05',
    title: 'Docklands Final Laps',
    date: '23 August 2026',
    city: 'Bremen',
    venue: 'Docklands Harbor Blocks',
    description: 'Season-closing speed circuit with full-series tension, direct category duels, and podium-heavy fan zones.',
    categories: ['Elite', 'Women', 'Masters', 'Open'],
    format: 'Final + points bonus',
    registrationStatus: 'Closed',
    cover:
      'linear-gradient(125deg, rgba(11,15,20,0.88), rgba(18,25,35,0.98)), radial-gradient(circle at 84% 24%, rgba(0,212,255,0.28), transparent 40%)',
  },
];
