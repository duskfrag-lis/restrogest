import { useState } from "react"
import { useMyDeliveries } from "../hook/useDelivery"
import { useNavigate } from "react-router-dom"
import { EmptySection } from "../../../shared/components/EmptySection"
import { formatLongDate } from "../../../shared/utils/formatDate"
import { DeliveryStatusBadge } from "./DeliveryStatusBadge/DeliveryStatusBadge"
import { ModalOverlay } from "../../../shared/components/ModalOverlay"
import { DeliveryDetailModal } from "./DeliveryDetailModal/DeliveryDetailModal"
import styles from './MyDeliveriesPage.module.css'


export function MyDeliveriesPage() {

    const { deliveries, isLoading } = useMyDeliveries()
    const [selectedId, setSelectedId] = useState<string | null>(null)
    const navigate = useNavigate()

    if (isLoading) return null

    return (

        <div className={styles.page}>

            <h1 className={styles.title}>Historial de pedidos</h1>

            {deliveries.length === 0 ? (

                <div className={styles.emptyWrapper}>

                    <EmptySection message="Aún no has hecho ningún pedido a domicilio." />

                    <button type="button" className={styles.ctaButton} onClick={() => navigate('/menu')}>
                        Ver el menú
                    </button>

                </div>

            ) : (

                <div className={styles.list}>

                    {deliveries.map((delivery) => {

                        const shortId = delivery.order_id.slice(0, 4)

                        return (

                            <button 
                                key={delivery.id}
                                type="button"
                                className={styles.row}
                                onClick={() => setSelectedId(delivery.id)}
                            >

                                <div className={styles.info}>
                                    <p className={styles.orderNumber}>Pedido #{shortId}</p>
                                    <p className={styles.date}>{formatLongDate(delivery.created_at)}</p>
                                </div>

                                <div className={styles.right}>
                                    <DeliveryStatusBadge status={delivery.status} />
                                    <p className={styles.total}>${delivery.total.toLocaleString('es-CO')}</p>
                                </div>

                            </button>
                        )
                    })}
                </div>
            )}

            { selectedId && (

                <ModalOverlay onClose={() => setSelectedId(null)}>

                    <DeliveryDetailModal deliveryId={selectedId} onClose={() => setSelectedId(null)} />
                </ModalOverlay>
            )}

        </div>
    )
}