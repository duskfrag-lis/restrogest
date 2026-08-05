import { apiClient } from "../../../shared/http/ApiClient"
import type { CreateReviewPayload, PublicReview, PublicReviewResponse, EligibilityResponse } from "../types/reviews.types"

export const reviewApi = {

    getPublic(): Promise<PublicReviewResponse> {

        return apiClient.request('/reviews/public')
    },

    checkEligibility(): Promise<EligibilityResponse> {

        return apiClient.get('/reviews/eligibility')
    },

    create(payload: CreateReviewPayload): Promise<PublicReview> {

        return apiClient.post('/reviews', payload)
    },
}