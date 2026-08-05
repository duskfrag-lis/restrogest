import { useState } from "react"
import { StarIcon } from "@phosphor-icons/react"
import { reviewApi } from "../../services/reviewsApi"
import styles from './ReviewForm.module.css'

interface ReviewFormProps {

    onPublished: () => void
    onClose: () => void
}

export function ReviewForm({ onPublished, onClose }: ReviewFormProps) {

    const [rating, setRating] = useState(0)
    const [hoverRating, setHoverRating] = useState(0)
    const [comment, setComment] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isPublished, setIsPublished] = useState(false)
    const [error, setError] = useState<string | null>(null)

    async function handleSubmit() {

        if (rating === 0) {

            setError('Selecciona una calificación')
            return
        }

        setError(null)
        setIsSubmitting(true)

        try {

            await reviewApi.create({ rating, comment: comment.trim() || undefined })
            setIsPublished(true)
            onPublished()

            setTimeout(() => onClose(), 1800)

        } catch {

            setError('No pudimos publicar tu reseña. Intenta de nuevo.')

        } finally {

            setIsSubmitting(false)
        }
    }

    if (isPublished) {

        return (

            <div className={styles.thanks}>
                
                <p className={styles.thanksTitle}>¡Gracias por tu reseña!</p>
                <p className={styles.thanksMessage}>Tu opinión ayuda a otros clientes.</p>
            </div>
        )
    }

    return (

        <div className={styles.content}>

            <h3 className={styles.title}>Cuéntanos tu experiencia</h3>

            <p className={styles.label}>Calificación</p>

            <div className={styles.stars}>

                {Array.from({ length: 5 }).map((_, index) => {

                    const value = index + 1
                    const isFilled = value <= (hoverRating || rating)

                    return (

                        <button
                            key={value}
                            type="button"
                            className={styles.starButton}
                            onMouseEnter={() => setHoverRating(value)}
                            onMouseLeave={() => setHoverRating(0)}
                            onClick={() => setRating(value)}
                            aria-label={`Calificar con ${value} estrellas`}
                        >
                            <StarIcon
                                size={28}
                                weight="fill"
                                color={isFilled ? 'var(--color-rating-star)' : 'var(--color-border-input)'}
                            />
                        </button>
                    )
                })}
            </div>

            <p className={styles.label}>Comentario (opcional)</p>

            <textarea
                className={styles.textarea}
                placeholder="Cuéntanos qué te pareció..."
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                rows={3}
            />

            {error && <p className={styles.error}>{error}</p>}

            <button type="button" className={styles.button} onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? 'Publicando...' : 'Publicar reseña'}
            </button>
        </div>
    )
}