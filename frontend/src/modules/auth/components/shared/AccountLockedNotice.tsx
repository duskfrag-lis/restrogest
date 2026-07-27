import { LockKeyIcon } from '@phosphor-icons/react'
import { Icon } from '../../../../shared/icons/Icon'
import styles from './AccountLockedNotice.module.css'

type LockReason = 'disabled' | 'rate_limited'

interface AccountLockedNoticeProps {

    reason: LockReason
}

const MESSAGES: Record<LockReason, { title: string; text: string }> = {

    disabled: {

        title: 'Cuenta desactivada',
        text: 'Tu cuenta fue desactivada. Contacta al administrador del restaurante para más información.',
    },

    rate_limited: {

        title: 'Cuenta bloqueada temporalmente',
        text: 'Detectamos varios intentos fallidos. Por seguridad, tu cuenta quedó bloqueada por 15 minutos. Intenta de nuevo más tarde.',
    },
}

export function AccountLockedNotice({ reason }: AccountLockedNoticeProps) {

    const { title, text } = MESSAGES[reason]

    return (

        <div className={styles.notice}>
            <Icon icon={LockKeyIcon} className={styles.icon} weight="bold"/>

            <div>
                <p className={styles.title}>{title}</p>
                <p className={styles.text}>{text}</p>
            </div>
        </div>
    )
}

