import type { FeaturedMenuItem } from "../../hooks/useFeaturedMenu"
import styles from './MenuItemCard.module.css'

interface MenuItemCardProps {

    item: FeaturedMenuItem
}

function formatPrice(value: number): string {

    return `${value.toLocaleString('es-CO')}`
}

export function MenuItemCard({ item }: MenuItemCardProps) {

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

                <div className={styles.footerRow}>
                    <span className={styles.price}>{formatPrice(item.price)}</span>
                    {item.categoryName && <span className={styles.badge}>{item.categoryName}</span>}
                </div>
                
            </div>
        </div>
    )
}