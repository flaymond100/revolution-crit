import type {
  Participant,
  ParticipantRow,
  RaceCalendar,
  RaceCalendarWithRelations,
  RaceEntry,
  RaceSubRace,
} from '../types';
import { supabase } from './supabase';

export function mapParticipant(row: ParticipantRow): Participant {
  return {
    id: row.id,
    fullName: row.full_name,
    dateOfBirth: row.date_of_birth,
    gender: row.gender,
    teamName: row.team_name,
    nationality: row.nationality,
    email: row.email,
    phone: row.phone,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapRaceEntry(
  row: RaceCalendarWithRelations['race_sub_races'][number]['race_entries'][number],
): RaceEntry {
  return {
    id: row.id,
    subRaceId: row.sub_race_id,
    participantId: row.participant_id,
    isPaid: row.is_paid,
    paymentAmount: row.payment_amount,
    paymentCurrency: row.payment_currency,
    paymentDate: row.payment_date,
    bibNumber: row.bib_number,
    position: row.position,
    timeText: row.time_text,
    status: row.status,
    notes: row.notes,
    participant: row.participants ? mapParticipant(row.participants) : undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapRaceSubRace(row: RaceCalendarWithRelations['race_sub_races'][number]): RaceSubRace {
  return {
    id: row.id,
    raceCalendarId: row.race_calendar_id,
    name: row.name,
    sortOrder: row.sort_order,
    entries: row.race_entries?.map(mapRaceEntry) ?? [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapRaceCalendar(row: RaceCalendarWithRelations): RaceCalendar {
  return {
    id: row.id,
    name: row.name,
    raceDate: row.race_date,
    type: row.type,
    location: row.location,
    externalResultsUrl: row.external_results_url,
    externalRegistrationUrl: row.external_registration_url,
    subRaces: row.race_sub_races?.map(mapRaceSubRace) ?? [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

const raceCalendarSelect = `
  id,
  name,
  race_date,
  type,
  location,
  external_results_url,
  external_registration_url,
  created_at,
  updated_at,
  race_sub_races (
    id,
    race_calendar_id,
    name,
    sort_order,
    created_at,
    updated_at,
    race_entries (
      id,
      sub_race_id,
      participant_id,
      is_paid,
      payment_amount,
      payment_currency,
      payment_date,
      bib_number,
      position,
      time_text,
      status,
      notes,
      created_at,
      updated_at,
      participants (
        id,
        full_name,
        date_of_birth,
        gender,
        team_name,
        nationality,
        email,
        phone,
        created_at,
        updated_at
      )
    )
  )
`;

export async function fetchRaceCalendars(): Promise<RaceCalendar[]> {
  const { data, error } = await supabase
    .from('race_calendar')
    .select(raceCalendarSelect)
    .order('race_date', { ascending: true });

  if (error) {
    throw error;
  }

  const rows = (data ?? []) as RaceCalendarWithRelations[];
  return rows.map(mapRaceCalendar);
}

export async function fetchRaceCalendarById(id: string): Promise<RaceCalendar | null> {
  const { data, error } = await supabase
    .from('race_calendar')
    .select(raceCalendarSelect)
    .eq('id', id)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    return null;
  }

  return mapRaceCalendar(data as RaceCalendarWithRelations);
}
