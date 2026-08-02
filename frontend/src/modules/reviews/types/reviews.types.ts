export interface PublicReview {

    id: string
    rating: number
    comment: string | null
    created_at: string
    first_name: string
    last_name: string
}

export interface PublicReviewResponse {

    reviews: PublicReview[]
    average_rating: number
    total_reviews: number
}