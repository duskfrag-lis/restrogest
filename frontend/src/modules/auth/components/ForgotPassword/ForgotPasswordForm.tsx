import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { authApi } from '../../services/authApi'
import { ApiError } from '../../../../shared/http/ApiClient'
import { isValidEmail } from '../../../../shared/utils/validators'
import { AuthTextInput } from '../shared/AuthTextInput'
import { AuthErrorBanner } from '../shared/AuthErrorBanner'
import { AuthInfoBox } from '../shared/AuthInfoBox'
import { LockIcon } from '../../../../shared/icons/LockIcon'
import styles from './ForgotPasswordForm.module.css'
import { ArrowLeftIcon } from '../../../../shared/icons/ArrowLeftIcon'

export function ForgotPasswordForm() {

    const [email, setEmail] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSent, setIsSent] = useState(false)

    const handleSubmit = async (event: FormEvent) => {

        event.preventDefault()
        setError(null)

        if (!isValidEmail(email)) {

            setError('Ingresa un correo electrónico válido')
            return
        }

        setIsSubmitting(true)

        try {

            await authApi.forgotPassword(email)
            setIsSent(true)

        } catch (err) {

            if (err instanceof ApiError) {

                setError(err.message)
            } else {

                setError('No pudimos procesar tu solicitud. Intenta de nuevo.')
            }
        } finally {

            setIsSubmitting(false)
        }
    }

    return (

        <form className={styles.form} onSubmit={handleSubmit}>

            <div className={styles.header}>

                <Link to="/login" className={styles.backLink} aria-label="Volver">
                    <ArrowLeftIcon className={styles.backIcon} />
                </Link>

                <LockIcon className = {styles.headerIcon} />
                <h1 className={styles.title}>Recuperar contraseña</h1>

            </div>

            <p className={styles.subtitle}>Verifiquemos que eres tú</p>

            <AuthErrorBanner message={error} />

            <AuthTextInput 

                type="email"
                placeholder="Correo electrónico"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => {

                    setEmail(event.target.value)
                    if (error) setError(null)

                }}

            />

            <AuthInfoBox>
                Si el correo está registrado, recibirás un enlace de recuperación con las instrucciones.
                El enlace expira en 30 minutos.
            </AuthInfoBox>

            <button type="submit" className={styles.submit} disabled={isSubmitting || isSent}>
                {isSent ? 'Enlace enviado' : isSubmitting ? 'Enviando...' : 'Enviar enlace'}
            </button>
            
        </form>
    )
}