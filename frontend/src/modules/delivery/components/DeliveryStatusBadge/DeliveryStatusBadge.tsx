import styles from './DeliveryStatusBadge.module.css'

const STATUS_LABELS: Record<string, string> = {

    recibido: 'Recibido',
    en_preparacion: 'En preparación',
    en_camino: 'En camino',
    entregado: 'Entregado',
}

interface DeliveryStatusBadgeProps {

    status: string
}

export function DeliveryStatusBadge({ status }: DeliveryStatusBadgeProps) {

    return (

        <span className={`${styles.badge} ${styles[status] ?? ''}`}>
            {STATUS_LABELS[status] ?? status}
        </span>
    )
}