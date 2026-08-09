import { apiClient } from "../../../shared/http/ApiClient"
import type { DeliveryOrderSummary, DeliveryOrderDetail } from "../types/delivery.types"

export const deliveryApi = {

    getMy(): Promise<{ deliveries: DeliveryOrderSummary[] }> {

        return apiClient.get('/delivery/my')
    },

    getById(id: string): Promise<{ delivery: DeliveryOrderDetail }> {

        return apiClient.get(`/delivery/${id}`)
    },
}