import { apiClient } from "../../../shared/http/ApiClient"
import type { Table, Reservation, CreateReservationPayload } from "../types/reservations.types"

export const reservationsApi = {

    checkAvailability(reservedAt: string, partySize: number): Promise<{ tables: Table[] }> {

        const params = new URLSearchParams({ reserved_at: reservedAt, party_size: String(partySize) })
        return apiClient.get(`/reservations/available?${params.toString()}`)
    },

    create(payload: CreateReservationPayload): Promise<{ reservation: Reservation }> {

        return apiClient.post('/reservations', payload)
    },

    getMy(): Promise<{ reservations: Reservation[] }> {

        return apiClient.get('/reservations/my')
    },

    cancel(id: string): Promise<{ reservation: Reservation }> {

        return apiClient.patch(`/reservations/${id}/cancel`)
    },
}