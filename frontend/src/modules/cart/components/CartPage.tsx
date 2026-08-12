import { useNavigate } from "react-router-dom"
import { useCart } from "./../hooks/useCart"
import { EmptySection } from "./../../../shared/components/EmptySection"
import { CartItem } from "./CartItem/CartItem"
import { CartSummary } from "./CartSummary/CartSummary"
import styles from './CartPage.module.css'

export function CartPage() {

    const { items } = useCart()
    const navigate = useNavigate()

    return (

        <div className={styles.page}>

            <h1 className={styles.title}>Tu pedido</h1>

            {items.length === 0 ? (

                <div className={styles.emptyWrapper}>

                    <EmptySection message="Tu carrito está vacío." />

                    <button type="button" className={styles.ctaButton} onClick={() => navigate('/menu')}>
                        Ver el menú
                    </button>
                </div>

            ) : (

                <>
                    <div className={styles.items}>

                        {items.map((item) => (
                            <CartItem key={item.menuItemId} item={item} />
                        ))}
                    </div>

                    <CartSummary onContinue={() => navigate('/checkout')} />
                </>
            )}
        </div>
    )
}