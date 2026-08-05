export interface Table {

    id: string
    number: number
    capacity: number
    status: string
}

export interface Reservation {

    id: string
    table_id: string
    table_number: number
    capacity: number
    reserved_at: string
    party_size: number
    notes: string | null
    status: string
    created_at: string
}

export interface CreateReservationPayload {

    table_id: string
    reserved_at: string
    party_size: number
    notes?: string
}

export interface ReservationDraftValues {

    date: string
    time: string
    partySize: number
}