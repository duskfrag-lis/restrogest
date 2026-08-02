import { apiClient } from "../../../shared/http/ApiClient"
import type { PublicReviewResponse } from "../types/reviews.types"

export const reviewApi = {

    getPublic(): Promise<PublicReviewResponse> {

        return apiClient.request('/reviews/public')
    },
}