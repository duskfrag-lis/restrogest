import { useState } from "react"
import { useAuth } from "../../auth/hooks/useAuth"
import { ModalOverlay } from "../../../shared/components/ModalOverlay"
import { EmptySection } from "../../../shared/components/EmptySection"
import { AverageRatingBadge } from "./AverageRatingBadge/AverageRatingBadge"
import { LoginRequiredNotice } from "./LoginRequiredNotice/LoginRequiredNotice"
import { NotEligibleNotice } from "./NotEligibleNotice/NoEligibleNotice" 
import { ReviewForm } from "./ReviewForm/ReviewForm"
import { ReviewCard } from "./ReviewCard/ReviewCard"
import { usePublicReviews } from "../hooks/useReviews"
import { reviewApi } from "../services/reviewsApi"
import styles from './ReviewsPage.module.css'

type ModalStep = 'closed' | 'login' | 'not-eligible' | 'form'

export function ReviewsPage() {

    const { user } = useAuth()
    const { reviews, averageRating, totalReviews, isLoading, refetch } = usePublicReviews()
    const [modalStep, setModalStep] = useState<ModalStep>('closed')
    const [isCheckingEligibility, setIsCheckingEligibility] = useState(false)

    async function handleLeaveReviewClick() {

        if (!user) {

            setModalStep('login')
            return
        }

        setIsCheckingEligibility(true)

        try {

            const { hasCompletedOrder } = await reviewApi.checkEligibility()
            setModalStep(hasCompletedOrder ? 'form' : 'not-eligible')

        } catch {

            setModalStep('not-eligible')

        } finally {

            setIsCheckingEligibility(false)
        }
    }

    function closeModal() {

        setModalStep('closed')
    }

    return (

        <section className={styles.section}>

            <AverageRatingBadge
                averageRating={averageRating}
                totalReviews={totalReviews}
                onLeaveReviewClick={handleLeaveReviewClick}
                isCheckingEligibility={isCheckingEligibility}
            />

            {!isLoading && reviews.length === 0 && (
                <EmptySection message="Aún no hay reseñas publicadas." />
            )}

            <div className={styles.grid}>

                {reviews.map((review) => (
                    <ReviewCard key={review.id} review={review} />
                ))}
            </div>

            {modalStep === 'login' && (

                <ModalOverlay onClose={closeModal}>
                    <LoginRequiredNotice onClose={closeModal} />
                </ModalOverlay>
            )}

            {modalStep === 'not-eligible' && (

                <ModalOverlay onClose={closeModal}>
                    <NotEligibleNotice onClose={closeModal} />
                </ModalOverlay>
            )}

            {modalStep === 'form' && (

                <ModalOverlay onClose={closeModal}>
                    <ReviewForm onPublished={refetch} onClose={closeModal} />
                </ModalOverlay>
            )}
        </section>
    )
}