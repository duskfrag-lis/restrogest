import { useState } from "react"
import { Icon } from "../../../../shared/icons/Icon"
import { CalendarDotsIcon, CheckIcon } from "@phosphor-icons/react"
import { useAvailability } from "../../hooks/useReservations"
import type { Table } from "../../types/reservations.types"
import type { RestaurantSchedule } from "../../../restaurant-info/types/restaurantInfo.types"
import styles from './ReservationForm.module.css'

export interface ReservationDraft {

    date: string
    time: string
    partySize: number
    table: Table
}

interface ReservationFormProps {

    initialValues: { date: string; time: string; partySize: number } | null
    schedule: RestaurantSchedule | null
    onContinue: (draft: ReservationDraft) => void
}

export function ReservationForm({ initialValues, schedule, onContinue }: ReservationFormProps) {

    const [date, setDate] = useState(initialValues?.date ?? '')
    const [time, setTime] = useState(initialValues?.time ?? '')
    const [partySize, setPartySize] = useState(initialValues?.partySize ?? 2)

    const { availableTables, isChecking, hasChecked, scheduleError, isAvailable } = useAvailability(date, time, partySize, schedule)

    function handleContinue() {

        if (!isAvailable) return

        onContinue({ date, time, partySize, table: availableTables[0] })
    }

    return (

        <div className={styles.card}>

            <div className={styles.header}>

                <Icon icon={CalendarDotsIcon} size={22} weight="regular" color="var(--color-text-muted)" />
                <h1 className={styles.title}>Reserva tu mesa</h1>
                <p className={styles.subtitle}>Elige fecha, hora y número de personas.</p>
            </div>

            <label className={styles.label}>Fecha</label>
            <input
                type="date"
                className={styles.input}
                value={date}
                min={new Date().toISOString().split('T')[0]}
                onChange={(event) => setDate(event.target.value)}
            />

            <label className={styles.label}>Hora</label>
            <input
                type="time"
                className={styles.input}
                value={time}
                onChange={(event) => setTime(event.target.value)}
            />

            {hasChecked && !isChecking && (

                <div className={isAvailable ? styles.availableBadge : styles.unavailableBadge}>
                    {isAvailable ? (
                        <><Icon icon={CheckIcon} size={14} weight="bold" /> Horario disponible</>
                    ) : (
                        scheduleError ?? 'No hay mesas disponibles para ese horario'
                    )}
                </div>
            )}

            <label className={styles.label}>Número de personas</label>
            <input
                type="number"
                className={styles.input}
                value={partySize}
                min={1}
                onChange={(event) => setPartySize(Number(event.target.value))}
            />

            <button
                type="button"
                className={styles.button}
                disabled={!isAvailable || isChecking}
                onClick={handleContinue}
            >
                Continuar
            </button>

            <p className={styles.disclaimer}>
                Reservas con mínimo 2 horas de anticipación. Cada mesa se reserva por 2 horas.
            </p>
        </div>
    )
}