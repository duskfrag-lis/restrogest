import { useState } from "react"
import { ArrowLeftIcon } from "@phosphor-icons/react"
import { Icon } from "../../../../shared/icons/Icon"
import { reservationsApi } from "../../services/reservationsApi"
import { formatLongDate } from "../../../../shared/utils/formatDate"
import type { ReservationDraft } from "../ReservationForm/ReservationForm"
import type { Reservation } from "../../types/reservations.types"
import styles from './ConfirmReservation.module.css'

interface ConfirmReservationProps {

    draft: ReservationDraft
    onConfirmed: (reservation: Reservation) => void
    onBack: () => void
}

export function ConfirmReservation({ draft, onConfirmed, onBack }: ConfirmReservationProps) {

    const [notes, setNotes] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    async function handleConfirm() {

        setIsSubmitting(true)
        setError(null)

        try {

            const reservedAt = `${draft.date}T${draft.time}:00`

            const { reservation } = await reservationsApi.create({

                table_id: draft.table.id,
                reserved_at: reservedAt,
                party_size: draft.partySize,
                notes: notes.trim() || undefined,
            })

            onConfirmed(reservation)

        } catch {

            setError('No pudimos confirmar tu reserva. Puede que el horario ya no esté disponible, intenta de nuevo.')

        } finally {

            setIsSubmitting(false)
        }
    }

    return (

        <div className={styles.card}>

            <button type="button" className={styles.backButton} onClick={onBack} aria-label="Volver">
                <Icon icon={ArrowLeftIcon} size={16} weight="bold" />
            </button>

            <h3 className={styles.title}>Confirmar reserva</h3>

            <div className={styles.summary}>

                <div className={styles.row}><span>Fecha</span><span>{formatLongDate(draft.date)}</span></div>
                <div className={styles.row}><span>Hora</span><span>{draft.time}</span></div>
                <div className={styles.row}><span>Personas</span><span>{draft.partySize}</span></div>
            </div>

            <label className={styles.label}>Nota adicional (opcional)</label>
            <textarea
                className={styles.textarea}
                placeholder="Ej. celebración, silla para bebé..."
                rows={2}
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
            />

            <div className={styles.notice}>
                Puedes cancelar tu reserva hasta 1 hora antes de la hora asignada.
            </div>

            {error && <p className={styles.error}>{error}</p>}

            <button type="button" className={styles.button} disabled={isSubmitting} onClick={handleConfirm}>
                {isSubmitting ? 'Confirmando...' : 'Confirmar reserva'}
            </button>
        </div>
    )
}