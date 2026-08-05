import { useNavigate } from "react-router-dom"
import { CheckCircleIcon } from "@phosphor-icons/react"
import { Icon } from "../../../../shared/icons/Icon"
import { formatLongDate } from "../../../../shared/utils/formatDate"
import type { Reservation } from "../../types/reservations.types"
import styles from './ReservationSuccess.module.css'

interface ReservationSuccessProps {

    reservation: Reservation
    onReset: () => void
}

export function ReservationSuccess({ reservation, onReset }: ReservationSuccessProps) {

    const navigate = useNavigate()
    const time = reservation.reserved_at.slice(11, 16)

    return (

        <div className={styles.card}>

            <Icon icon={CheckCircleIcon} size={40} weight="fill" color="var(--color-accent)" />

            <h3 className={styles.title}>Reserva confirmada</h3>

            <p className={styles.message}>
                Mesa para {reservation.party_size}, {formatLongDate(reservation.reserved_at)}, {time}. Te enviamos los detalles a tu correo.
            </p>

            <button type="button" className={styles.primaryButton} onClick={() => navigate('/account/reservations')}>
                Ver mis reservas
            </button>

            <button type="button" className={styles.secondaryButton} onClick={() => { onReset(); navigate('/') }}>
                Volver al inicio
            </button>
        </div>
    )
}