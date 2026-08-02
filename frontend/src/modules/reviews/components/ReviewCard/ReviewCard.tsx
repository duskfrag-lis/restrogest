import { StarIcon } from "@phosphor-icons/react"
import type { PublicReview } from "../../types/reviews.types"
import styles from './ReviewCard.module.css'

interface ReviewCardProps {

    review: PublicReview
}

export function ReviewCard({ review }: ReviewCardProps) {

    return (

        <div className={styles.card}>

            <div className={styles.stars}>

                {Array.from({ length: 5 }).map((_, index) => (

                    <StarIcon
                        key={index}
                        size={18}
                        weight="fill"
                        color={index < review.rating ? 'var(--color-rating-star)' : 'var(--color-border-input)'}
                    />
                ))}
            </div>

            {review.comment && <p className={styles.comment}>"{review.comment}"</p>}

            <p className={styles.author}>{review.first_name} {review.last_name}</p>
        </div>
    )
}