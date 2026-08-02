import { useEffect, useState } from "react"
import { reviewApi } from "../services/reviewsApi"
import type { PublicReview } from "../types/reviews.types"

export function usePublicReviews() {

    const [reviews, setReviews] = useState<PublicReview[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {

        let isMounted = true

        reviewApi.getPublic()
            .then((result) => { if (isMounted) setReviews(result.reviews) })
            .catch(() => { if (isMounted) setReviews([]) })
            .finally(() => { if (isMounted) setIsLoading(false) })
        
        return () => { isMounted = false }

    }, [])

    return { reviews, isLoading }
}