import { useCart } from "../../hooks/useCart"
import styles from './CartSummary.module.css'

interface CartSummaryProps {

    onContinue: () => void
    isDisabled?: boolean
}

export function CartSummary({ onContinue, isDisabled }: CartSummaryProps) {

    const { subtotal } = useCart()

    return (

        <div className={styles.summary}>

            <div className={styles.row}>
                <span>Total</span>
                <span className={styles.total}>${subtotal.toLocaleString('es-CO')}</span>
            </div>

            <button type="button" className={styles.button} disabled={isDisabled} onClick={onContinue}>
                Continuar al pago
            </button>
        </div>
    )
}