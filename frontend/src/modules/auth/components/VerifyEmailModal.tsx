import { Mail } from 'lucide-react'
import { useState } from 'react'
import { authApi } from '../services/authApi'
import styles from './VerifyEmailModal.module.css'

interface VerifyEmailModalProps {

    email: string
    onClose(): void
}

export function VerifyEmailModal({ email, onClose }: VerifyEmailModalProps) {

    const [isResending, setIsResending] = useState(false)
    const [resendMessage, setResendMessage] = useState('')

    async function handleResend() {
        setIsResending(true)
        setResendMessage('')

        try {

            await new Promise((resolve) => setTimeout(resolve, 600))
            setResendMessage('Correo reenviado. Revisa tu bandeja de entrada.')

        } finally {
            setIsResending(false)
        }
    }

    return (

        <div className={styles.backdrop}>
            <div className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="verify-email-title">

                <span className={styles.iconCircle}>
                    <Mail size={22} aria-hidden="true"/>
                </span>

                <h3 id="verify-email-title">Verifica tu correo</h3>

                <p>Te enviamos un enlace a <strong>{email}</strong>. Haz clic en él para activar tu cuenta.</p>

                {resendMessage ? <p className={styles.resendMessage}>{resendMessage}</p> : null}

                <button type="button" className={styles.primaryButton} disabled={isResending} onClick={handleResend}>
                    {isResending ? 'Reenviando...' : 'Reenviar correo'}
                </button>

                <button type="button" className={styles.secondaryButton} onClick={onClose}>
                    Volver a inicio de sesión
                </button>
            </div>
        </div>
    )
}
