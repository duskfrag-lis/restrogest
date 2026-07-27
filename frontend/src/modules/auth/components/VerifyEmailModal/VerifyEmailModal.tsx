import { useState } from 'react'
import { authApi } from '../../services/authApi'
import { ApiError } from '../../../../shared/http/ApiClient'
import { EnvelopeIcon } from '@phosphor-icons/react'
import { Icon } from '../../../../shared/icons/Icon'
import styles from './VerifyEmailModal.module.css'

interface VerifyEmailModalProps {

    email: string
    onBackToLogin: () => void 
}

const RESEND_COOLDOWN_SECONDS = 30

export function VerifyEmailModal({ email, onBackToLogin }: VerifyEmailModalProps) {

    const [isSending, setIsSending] = useState(false)
    const [feedback, setFeedback] = useState<string | null>(null)
    const [cooldown, setCooldown] = useState(0)

    const startCooldown = () => {

        setCooldown(RESEND_COOLDOWN_SECONDS)

        const interval = setInterval(() => {

            setCooldown((current) => {

                if (current <= 1) {

                    clearInterval(interval)
                    return 0
                }

                return current - 1
            })
        }, 1000)
    }

    const handleResend = async () => {

        setIsSending(true)
        setFeedback(null)

        try {

            const result = await authApi.resendVerification(email)
            setFeedback(result.message)
            startCooldown()

        } catch (err) {

            if (err instanceof ApiError) {

                setFeedback(err.message)

            } else {

                setFeedback('No pudimos reenviar el correo. Intenta de nuevo.')
            }
        } finally {

            setIsSending(false)
        }
    }

    return (

        <div className={styles.overlay}>

            <div className={styles.card} role="dialog" aria-modal="true">

                <div className={styles.iconBadge}>
                    <Icon icon={EnvelopeIcon} className={styles.icon} weight='bold'/>
                </div>

                <h2 className={styles.title}>Verifica tu correo</h2>
                <p className={styles.text}>
                    Te enviamos un enlace a <strong>{email}</strong>.
                    <br />
                    Haz click en él para activar tu cuenta.
                </p>

                {feedback && <p className={styles.feedback}>{feedback}</p>}

                <button

                    type="button"
                    className={styles.primaryAction}
                    onClick={handleResend}
                    disabled={isSending || cooldown > 0}
                >
                    {cooldown > 0 
                        ? `Reenviar correo (${cooldown}s)`
                        : isSending
                            ? 'Enviando...' : 'Reenviar correo'
                    }
                </button>

                <button type="button" className={styles.secondaryAction} onClick={onBackToLogin}>
                    Volver a inicio de sesión
                </button>
            </div>
        </div>
    )
}