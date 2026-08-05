const MONTHS = [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
]

export function formatLongDate(isoDate: string): string {

    const date = new Date(isoDate)

    return `${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`
}

export function formatRoleLabel(role: string): string {

    const labels: Record<string, string> = {

        cliente: 'Cliente',
        mesero: 'Mesero',
        cocinero: 'Cocinero',
        jefe_cocina: 'Jefe de cocina',
        domiciliario: 'Domiciliario',
        administrador: 'Administrador',
    }

    return labels[role] ?? role
}

export function formatRelativeDate(isoDate: string): string {

    const date = new Date(isoDate)
    const now = new Date()
    const diffMinutes = Math.floor((now.getTime() - date.getTime()) / 60000)
    const diffHours = Math.floor(diffMinutes / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMinutes < 1) return 'Hace un momento'
    if (diffMinutes < 60) return `Hace ${diffMinutes} min`
    if (diffHours < 24) return `Hace ${diffHours} ${diffHours === 1 ? 'hora' : 'horas'}`
    if (diffDays < 7) return `Hace ${diffDays} ${diffDays === 1 ? 'día' : 'días'}`

    if (diffDays < 30) {

        const weeks = Math.floor(diffDays / 7)
        return `Hace ${weeks} ${weeks === 1 ? 'semana' : 'semanas'}`
    }

    return formatLongDate(isoDate)
}