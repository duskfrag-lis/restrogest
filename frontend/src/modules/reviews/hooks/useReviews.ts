import { useCallback, useEffect, useState } from "react"
import { reviewApi } from "../services/reviewsApi"
import type { PublicReview } from "../types/reviews.types"

export function usePublicReviews() {

    const [reviews, setReviews] = useState<PublicReview[]>([])
    const [averageRating, setAverageRating] = useState(0)
    const [totalReviews, setTotalReviews] = useState(0)
    const [isLoading, setIsLoading] = useState(true)

    const fetchReviews = useCallback(() => {

        setIsLoading(true)

        return reviewApi.getPublic()
            .then((result) => {

                setReviews(result.reviews)
                setAverageRating(result.average_rating)
                setTotalReviews(result.total_reviews)
            })
            .catch(() => {

                setReviews([])
                setAverageRating(0)
                setTotalReviews(0)
            })
            .finally(() => setIsLoading(false))
    }, [])

    useEffect(() => {

        fetchReviews()

    }, [fetchReviews])

    return { reviews, averageRating, totalReviews, isLoading, refetch: fetchReviews }
}