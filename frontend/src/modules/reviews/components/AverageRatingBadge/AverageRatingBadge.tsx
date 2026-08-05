import { StarIcon } from "@phosphor-icons/react"
import styles from './AverageRatingBadge.module.css'

interface AverageRatingBadgeProps {

    averageRating: number
    totalReviews: number
    onLeaveReviewClick: () => void
    isCheckingEligibility: boolean
}

export function AverageRatingBadge({ averageRating, totalReviews, onLeaveReviewClick, isCheckingEligibility}: AverageRatingBadgeProps) {

    return (

        <div className={styles.wrapper}>

            <p className={styles.average}>{averageRating.toFixed(1)}</p>

            <div className={styles.stars}>

                {Array.from({ length: 5 }).map((_, index) => (

                    <StarIcon
                        key={index}
                        size={24}
                        weight="fill"
                        color={index < Math.round(averageRating) ? 'var(--color-rating-star)' : 'var(--color-border-input)'}
                    />
                ))}
            </div>

            <p className={styles.total}>
                {totalReviews > 0 ? `Basado en ${totalReviews} reseñas` : 'Aún no hay reseñas'}
            </p>

            <button type="button" className={styles.button} onClick={onLeaveReviewClick} disabled={isCheckingEligibility}>
                {isCheckingEligibility ? 'Verificando...' : 'Dejar reseña'}
            </button>
        </div>
    )
}