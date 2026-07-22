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