import { useEffect, useState } from "react"
import { reservationsApi } from "../services/reservationsApi"
import { isWithinSchedule } from "../../../shared/utils/schedule"
import type { RestaurantSchedule } from "../../restaurant-info/types/restaurantInfo.types"
import type { Table } from "../types/reservations.types"

const RESERVATION_DURATION_MINUTES = 120

export function useAvailability(date: string, time: string, partySize: number, schedule: RestaurantSchedule | null) {

    const [availableTables, setAvailableTables] = useState<Table[]>([])
    const [isChecking, setIsChecking] = useState(false)
    const [hasChecked, setHasChecked] = useState(false)
    const [scheduleError, setScheduleError] = useState<string | null>(null)

    useEffect(() => {

        if (!date || !time || partySize < 1) {

            setAvailableTables([])
            setHasChecked(false)
            setScheduleError(null)
            return
        }

        if (schedule) {

            const result = isWithinSchedule(schedule, date, time, RESERVATION_DURATION_MINUTES)

            if (!result.isValid) {

                setScheduleError(result.reason ?? 'Horario no disponible')
                setAvailableTables([])
                setHasChecked(true)
                return
            }
        }

        setScheduleError(null)
        setHasChecked(false)
        const reservedAt = `${date}T${time}:00`

        const timeoutId = setTimeout(() => {

            setIsChecking(true)

            reservationsApi.checkAvailability(reservedAt, partySize)
                .then((result) => setAvailableTables(result.tables))
                .catch(() => setAvailableTables([]))
                .finally(() => {

                    setIsChecking(false)
                    setHasChecked(true)
                })

        }, 500)

        return () => clearTimeout(timeoutId)

    }, [date, time, partySize, schedule])

    return {
        availableTables,
        isChecking,
        hasChecked,
        scheduleError,
        isAvailable: !scheduleError && availableTables.length > 0,
    }
}