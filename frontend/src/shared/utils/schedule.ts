import type { RestaurantSchedule } from "../../modules/restaurant-info/types/restaurantInfo.types";

const DAY_LABELS: Record<string, string> = {

    lunes: 'Lunes',
    martes: 'Martes',
    miercoles: 'Miércoles',
    jueves: 'Jueves',
    viernes: 'Viernes',
    sabado: 'Sábado',
    domingo: 'Domingo',
}

const DAY_ORDER = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo']

export interface ScheduleRow {

    label: string
    hours: string
}

export function buildSheduleRows(schedule: RestaurantSchedule): ScheduleRow[] {

    return DAY_ORDER.map((day) => ({

        label: DAY_LABELS[day],
        hours: formatDayHours(schedule[day]),
    }))
}

function formatDayHours(value: string | undefined): string {

    if (!value || value.toLowerCase() === 'cerrado') return 'Cerrado'

    const [open, close] = value.split('-')

    if (!open || !close) return value

    return `${formatTime(open)} - ${formatTime(close)}`
}

function formatTime(time: string): string {

    const [hoursStr, minutes] = time.split(':')
    const hours = Number(hoursStr)

    if (Number.isNaN(hours) || minutes === undefined) return time

    const period = hours >= 12 ? 'p.m.' : 'a.m.'
    const displayHours = hours % 12 === 0 ? 12 : hours % 12

    return `${displayHours}:${minutes} ${period}`
}