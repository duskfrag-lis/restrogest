import { useCart } from "../../hooks/useCart"
import type { CartItem as CartItemType } from "../../types/cart.types"
import styles from './CartItem.module.css'

interface CartItemProps {

    item: CartItemType
}

export function CartItem({ item }: CartItemProps) {

    const { increment, decrement } = useCart()

    return (

        <div className={styles.row}>

            <div className={styles.thumbnail}>
                {item.imageUrl && <img src={item.imageUrl} alt={item.name} className={styles.image} />}
            </div>

            <div className={styles.info}>
                <p className={styles.name}>{item.name}</p>
                <p className={styles.price}>${item.price.toLocaleString('es-CO')} c/u</p>
            </div>

            <div className={styles.quantity}>

                <button type="button" className={styles.stepButton} onClick={() => decrement(item.menuItemId)}>-</button>
                <span className={styles.quantityValue}>{item.quantity}</span>
                <button type="button" className={styles.stepButton} onClick={() => increment(item.menuItemId)}>+</button>
            </div>
        </div>
    )
}