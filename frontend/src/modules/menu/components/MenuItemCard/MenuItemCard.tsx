import { useRequireAuth } from "../../../auth/hooks/useRequireAuth"
import type { MenuItem } from "../../types/menu.types"
import styles from './MenuItemCard.module.css'

interface MenuItemCardProps {

    item: MenuItem
}

function formatPrice(value: number): string {

    return `$${value.toLocaleString('es-CO')}`
}

export function MenuItemCard({ item }: MenuItemCardProps) {

    const { requireAuth } = useRequireAuth()

    const handleAddClick = () => {

        requireAuth(() => {

            //TODO: conectar al carrito cuando exista

        })
    }

    return (

        <div className={styles.card}>

            <div className={styles.imageWrapper}>

                {item.image_url ? (

                    <img src={item.image_url} alt={item.name} className={styles.image} />

                ) : (

                    <div className={styles.imagePlaceholder} />
                )}
            </div>

            <div className={styles.body}>

                <p className={styles.name}>{item.name}</p>
                {item.description && <p className={styles.description}>{item.description}</p>}

                <div className={styles.footerRow}>

                    <span className={styles.price}>{formatPrice(item.price)}</span>
                    <button type="button" className={styles.addButton} onClick={handleAddClick}>
                        Agregar
                    </button>
                </div>
            </div>
        </div>
        
    )
}