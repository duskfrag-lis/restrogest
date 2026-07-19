import { useState, type FormEvent } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { authApi } from '../../services/authApi'
import { ApiError } from '../../../../shared/http/ApiClient'
import { isPasswordValid } from '../../../../shared/utils/passwordRules'
import { PasswordField } from '../shared/PasswordField'
import { PasswordChecklist } from '../shared/PasswordChecklist'
import { AuthErrorBanner } from '../shared/AuthErrorBanner'
import { LockIcon } from '../../../../shared/icons/LockIcon'
import styles from './ActivateAccountForm.module.css'

const REDIRECT_DELAY_MS = 2500

export function ActivateAccountForm() {

    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const token = searchParams.get('token') ?? ''

    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)

    const canSubmit = isPasswordValid(password) && password === confirmPassword && token.length > 0

    const handleSubmit = async (event: FormEvent) => {

        event.preventDefault()
        setError(null)

        if (!token) {

            setError('El enlace de activación no es válido o ha expirado')
            return
        }

        if (password !== confirmPassword) {

            setError('Las contraseñas no coinciden')
            return
        }

        setIsSubmitting(true)

        try {

            await authApi.activateAccount(token, password)
            setIsSuccess(true)
            setTimeout(() => navigate('/login', { replace: true }), REDIRECT_DELAY_MS)

        } catch (err) {

            if (err instanceof ApiError) {

                setError(err.message)

            } else {

                setError('No pudimos activar tu cuenta. Intenta de nuevo.')
            }

        } finally {

            setIsSubmitting(false)
        }
    }

    return (

        <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.header}>
                <LockIcon className={styles.headerIcon} />
                <h1 className={styles.title}>Activa tu cuenta</h1>
            </div>

            <p className={styles.subtitle}>Crea una contraseña para comenzar</p>

            <AuthErrorBanner message={error} />

            <div className={styles.field}>
                <label className={styles.label}>Contraseña</label>
                <PasswordField
                    autoComplete="new-password"
                    required
                    disabled={isSuccess}
                    value={password}
                    onChange={(event) => {

                        setPassword(event.target.value)
                        if (error) setError(null)
                    }}
                />
            </div>

            <PasswordChecklist password={password} />

            <div className={styles.field}>
                <label className={styles.label}>Confirmar contraseña</label>
                <PasswordField
                    autoComplete="new-password"
                    required
                    disabled={isSuccess}
                    value={confirmPassword}
                    onChange={(event) => {

                        setConfirmPassword(event.target.value)
                        if (error) setError(null)
                    }}
                />
            </div>

            {isSuccess ? (
                <p className={styles.success}>
                    Cuenta activada correctamente. Ya puedes iniciar sesión.
                </p>
            ) : (
                <button type="submit" className={styles.submit} disabled={!canSubmit || isSubmitting}>
                    {isSubmitting ? 'Activando...' : 'Activar cuenta'}
                </button>
            )}
            
        </form>
    )
}
