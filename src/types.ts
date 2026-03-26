export type ClassificationTableResponse = {
    data: {
        count: number;
        standings: {
            tag_id: string;
            laps: number;
            last_pass_time: string;
            finish_time: string | null;
            finished: boolean;
            total_time_ms: number;
            gap_ms: number;
            laps_behind: number;
        }[];
    };
};

export type UUID = string;

export type RaceType = 'criterium' | 'road' | 'gravel' | 'cyclocross' | 'track' | 'mtb' | string;

export type Gender = 'male' | 'female' | 'other' | null;

export type RaceEntryStatus = 'finished' | 'dns' | 'dnf' | 'dsq' | null;

export interface RaceCalendarRow {
    id: UUID;
    name: string
    race_date: string;
    type: RaceType;
    location: string;
    external_results_url: string | null;
    external_registration_url: string | null;
    created_at: string;
    updated_at: string;
}

export interface RaceSubRaceRow {
    id: UUID;
    race_calendar_id: UUID;
    name: string;
    sort_order: number | null;
    created_at: string;
    updated_at: string;
}

export interface ParticipantRow {
    id: UUID;
    full_name: string;
    date_of_birth: string | null;
    gender: Gender;
    team_name: string | null;
    nationality: string | null;
    email: string | null;
    phone: string | null;
    created_at: string;
    updated_at: string;
}

export interface RaceEntryRow {
    id: UUID;
    sub_race_id: UUID;
    participant_id: UUID;
    is_paid: boolean;
    payment_amount: number | null;
    payment_currency: string | null;
    payment_date: string | null;
    bib_number: string | null;
    position: number | null;
    time_text: string | null;
    status: RaceEntryStatus;
    notes: string | null;
    created_at: string;
    updated_at: string;
}

export interface Participant {
    id: UUID;
    fullName: string;
    dateOfBirth: string | null;
    gender: Gender;
    teamName: string | null;
    nationality: string | null;
    email: string | null;
    phone: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface RaceEntry {
    id: UUID;
    subRaceId: UUID;
    participantId: UUID;
    isPaid: boolean;
    paymentAmount: number | null;
    paymentCurrency: string | null;
    paymentDate: string | null;
    bibNumber: string | null;
    position: number | null;
    timeText: string | null;
    status: RaceEntryStatus;
    notes: string | null;
    participant?: Participant;
    createdAt: string;
    updatedAt: string;
}

export interface RaceSubRace {
    id: UUID;
    raceCalendarId: UUID;
    name: string;
    sortOrder: number | null;
    entries?: RaceEntry[];
    createdAt: string;
    updatedAt: string;
}

export interface RaceCalendar {
    id: UUID;
    name: string;
    raceDate: string;
    type: RaceType;
    location: string;
    externalResultsUrl: string | null;
    externalRegistrationUrl: string | null;
    subRaces?: RaceSubRace[];
    createdAt: string;
    updatedAt: string;
}

export interface RaceCalendarWithRelations {
    id: UUID;
    name: string;
    race_date: string;
    type: string;
    location: string;
    external_results_url: string | null;
    external_registration_url: string | null;
    created_at: string;
    updated_at: string;
    race_sub_races: Array<{
        id: UUID;
        race_calendar_id: UUID;
        name: string;
        sort_order: number | null;
        created_at: string;
        updated_at: string;
        race_entries: Array<{
            id: UUID;
            sub_race_id: UUID;
            participant_id: UUID;
            is_paid: boolean;
            payment_amount: number | null;
            payment_currency: string | null;
            payment_date: string | null;
            bib_number: string | null;
            position: number | null;
            time_text: string | null;
            status: RaceEntryStatus;
            notes: string | null;
            created_at: string;
            updated_at: string;
            participants: {
                id: UUID;
                full_name: string;
                date_of_birth: string | null;
                gender: Gender;
                team_name: string | null;
                nationality: string | null;
                email: string | null;
                phone: string | null;
                created_at: string;
                updated_at: string;
            } | null;
        }>;
    }>;
}