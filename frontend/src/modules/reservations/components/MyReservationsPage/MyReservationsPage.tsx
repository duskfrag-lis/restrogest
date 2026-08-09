import { useEffect, useState } from "react"
import type { Reservation } from "../../types/reservations.types"
import { useNavigate } from "react-router-dom"
import { reservationsApi } from "../../services/reservationsApi"
import { EmptySection } from "../../../../shared/components/EmptySection"
import { formatLongDate } from "../../../../shared/utils/formatDate"
import styles from './MyReservationsPage.module.css'

const STATUS_LABELS: Record<string, string> = {

    confirmada: 'Confirmada',
    cancelada: 'Cancelada',
    no_presentado: 'No presentado',
}

export function MyReservationsPage() {

    const [reservations, setReservations] = useState<Reservation[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {

        reservationsApi.getMy()
            .then((result) => setReservations(result.reservations))
            .catch(() => setReservations([]))
            .finally(() => setIsLoading(false))

    }, [])

    if (isLoading) return null

    const activeReservations = reservations.filter((r) => r.status === 'confirmada')

    return (

        <div className={styles.page}>

            <h1 className={styles.title}>Mis reservas</h1>

            {activeReservations.length === 0 ? (

                <div className={styles.emptyWrapper}>

                    <EmptySection message="Aún no tienes reservas activas." />

                    <button type="button" className={styles.ctaButton} onClick={() => navigate('/reservations')}>
                        Reserva una mesa
                    </button>

                </div>

            ) : (

                <div className={styles.list}>

                    {activeReservations.map((reservation) => {

                        const time = reservation.reserved_at.slice(11, 16)

                        return (

                            <div key={reservation.id} className={styles.row}>

                                <div className={styles.info}>
                                    <p className={styles.date}>{formatLongDate(reservation.reserved_at)} - {time}</p>
                                    <p className={styles.details}>Mesa {reservation.table_number}   {reservation.party_size} personas</p>
                                </div>

                                <span className={styles.badge}>{STATUS_LABELS[reservation.status] ?? reservation.status}</span>

                            </div>
                        )
                    })}

                </div>
            )}
        </div>
    )
}