import { useEffect, useState } from "react"
import { XIcon } from "@phosphor-icons/react"
import { Icon } from "../../../../shared/icons/Icon"
import { deliveryApi } from "../../services/deliveryApi"
import { formatLongDate } from "../../../../shared/utils/formatDate"
import { DeliveryStatusBadge } from "../DeliveryStatusBadge/DeliveryStatusBadge"
import type { DeliveryOrderDetail } from "../../types/delivery.types"
import styles from './DeliveryDetailModal.module.css'

interface DeliveryDetailModalProps {

    deliveryId: string
    onClose: () => void
}

const PAYMENT_LABELS: Record<string, string> = {

    efectivo: 'efectivo',
    tarjeta: 'tarjeta',
    pse: 'PSE',
    contra_entrega: 'contra entrega',
}

export function DeliveryDetailModal({ deliveryId, onClose }: DeliveryDetailModalProps) {

    const [detail, setDetail] = useState<DeliveryOrderDetail | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {

        let isMounted = true

        deliveryApi.getById(deliveryId)
            .then((result) => { if (isMounted) setDetail(result.delivery) })
            .finally(() => { if (isMounted) setIsLoading(false) })

        return () => { isMounted = false }

    }, [deliveryId])

    if (isLoading || !detail) {

        return <div className={styles.loading}>Cargando pedido...</div>
    }

    const shortId = detail.order_id.slice(0, 4)
    const time = detail.created_at.slice(11, 16)

    return (

        <div className={styles.content}>

            <button type="button" className={styles.closeButton} onClick={onClose} aria-label="Cerrar">
                <Icon icon={XIcon} size={18} weight="bold" />
            </button>

            <div className={styles.header}>

                <div>
                    <h3 className={styles.title}>Pedido #{shortId}</h3>
                    <p className={styles.subtitle}>{formatLongDate(detail.created_at)} - {time} - Domicilio</p>
                </div>

                <DeliveryStatusBadge status={detail.status} />
            </div>

            <div className={styles.items}>

                {detail.items.map((item) => (

                    <div key={item.id} className={styles.itemRow}>
                        <span>{item.quantity}X {item.item_name}</span>
                        <span>${(item.quantity * item.unit_price).toLocaleString('es-CO')}</span>
                    </div>
                ))}
            </div>

            <div className={styles.totalRow}>
                <span>Total</span>
                <span>${detail.total.toLocaleString('es-CO')}</span>
            </div>

            <p className={styles.meta}>Dirección: {detail.address}</p>
            <p className={styles.meta}>Pago: {PAYMENT_LABELS[detail.payment_method] ?? detail.payment_method}</p>
        </div>
    )
}