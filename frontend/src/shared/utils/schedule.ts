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

export interface ScheduleValidationResult {

    isValid: boolean
    reason?: string
}

const JS_DAY_TO_KEY = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado']

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

export function isWithinSchedule(

    schedule: RestaurantSchedule,
    dateStr: string,
    timeStr: string,
    durationMinutes: number,

): ScheduleValidationResult {

    const date = new Date(`${dateStr}T${timeStr}:00`)
    const dayKey = JS_DAY_TO_KEY[date.getDay()]
    const daySchedule = schedule[dayKey]

    if (!daySchedule || daySchedule.toLowerCase() === 'cerrado') {

        return { isValid: false, reason: 'El restaurante está cerrado ese día' }
    }

    const [openStr, closeStr] = daySchedule.split('-')

    if (!openStr || !closeStr) {

        return { isValid: false, reason: 'Horario configurado incorrectamente' }
    }

    const reservationStart = toMinutes(timeStr)
    const reservationEnd = reservationStart + durationMinutes
    const openMinutes = toMinutes(openStr)
    const closeMinutes = toMinutes(closeStr)

    if (reservationStart < openMinutes || reservationEnd > closeMinutes) {

        return { isValid: false, reason: `El restaurante atiende de ${formatTime(openStr)} a ${formatTime(closeStr)} ese día`}
    }

    return { isValid: true }
    
}

function toMinutes(time: string): number {

    const [hours, minutes] = time.split(':').map(Number)
    return hours * 60 + minutes
}


