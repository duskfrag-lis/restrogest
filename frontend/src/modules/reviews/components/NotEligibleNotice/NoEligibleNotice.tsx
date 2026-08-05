import { InfoIcon } from "@phosphor-icons/react"
import { Icon } from "../../../../shared/icons/Icon"
import { useNavigate } from "react-router-dom"
import styles from './NotEligibleNotice.module.css'

interface NotEligibleNoticeProps {

    onClose: () => void
}

export function NotEligibleNotice({ onClose }: NotEligibleNoticeProps) {

    const navigate = useNavigate()

    function handleGoToMenu() {

        onClose()
        navigate('/menu')
    }

    return (

        <div className={styles.content}>

            <div className={styles.iconWrapper}>
                <Icon icon={InfoIcon} size={28} weight="fill" color="var(--color-accent)" />
            </div>

            <h3 className={styles.title}>Aún no puedes dejar una reseña</h3>

            <p className={styles.message}>
                Para compartir tu opinión, primero necesitas haber completado al menos un pedido con nosotros.
            </p>

            <button type="button" className={styles.button} onClick={handleGoToMenu}>
                Ver el menú
            </button>
        </div>
    )
}