import { LockKeyIcon } from "@phosphor-icons/react"
import { Icon } from "../../icons/Icon"
import { useLocation, useNavigate } from "react-router-dom"
import styles from './LoginRequiredNotice.module.css'
import { saveRedirectPath } from "../../utils/redirectStorage"

interface LoginRequiredNoticeProps {

    onClose: () => void
}

export function LoginRequiredNotice({ onClose }: LoginRequiredNoticeProps) {

    const navigate = useNavigate()
    const location = useLocation()

    function goTo(path: string) {

        saveRedirectPath(location.pathname)
        onClose()
        navigate(path)
    }

    return (

        <div className={styles.content}>

            <div className={styles.iconWrapper}>

                <Icon icon={LockKeyIcon} size={28} weight="fill" color="var(--color-text-on-accent)" />
            </div>

            <h3 className={styles.title}>Inicia sesión para continuar</h3>

            <p className={styles.message}>Necesitas una cuenta para dejar tu reseña.</p>

            <button type="button" className={styles.primaryButton} onClick={() => goTo('/login')}>
                Iniciar sesión
            </button>

            <button type="button" className={styles.secondaryButton} onClick={() => goTo('/login?mode=register')}>
                Crear cuenta
            </button>
        </div>
    )
}