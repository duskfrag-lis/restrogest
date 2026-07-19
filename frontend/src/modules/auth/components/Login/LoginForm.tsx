import { useState, type FormEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { ApiError } from '../../../../shared/http/ApiClient'
import { AuthTextInput } from '../shared/AuthTextInput'
import { PasswordField } from '../shared/PasswordField'
import { AuthErrorBanner } from '../shared/AuthErrorBanner'
import { AccountLockedNotice } from '../shared/AccountLockedNotice'
import { GoogleAuthButton } from '../GoogleAuthButton/GoogleAuthButton'
import styles from './LoginForm.module.css'

export function LoginForm() {

    const { login } = useAuth()
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const googleErrorParam = searchParams.get('error')

    const [error, setError] = useState<string | null>(
        googleErrorParam === 'google_auth_failed'
            ? 'Este correo ya está registrado con contraseña. Inicia sesión normalmente.'
            : null
    )

    const [lockReason, setLockReason] = useState<'disabled' | 'rate_limited' | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const clearFeedback = () => {

        if (error) setError(null)
        if (lockReason) setLockReason(null)
    }

    const handleSubmit = async (event: FormEvent) => {

        event.preventDefault()
        setError(null)
        setLockReason(null)
        setIsSubmitting(true)

        try {

            await login({ email, password })
            navigate('/', { replace: true })

        } catch (err) {

            if (err instanceof ApiError && err.status === 403) {

                setLockReason('disabled')

            } else if (err instanceof ApiError && err.status === 429){

                setLockReason('rate_limited')

            } else {

                setError('No pudimos iniciar sesión. Intenta de nuevo.')
            }

        } finally {

            setIsSubmitting(false)
        }
    }

    return (

        <form className={styles.form} onSubmit={handleSubmit}>

            <h1 className={styles.title}>Iniciar sesión</h1>
            <p className={styles.sutitle}>Ingresa tus datos para continuar</p>

            {lockReason ? (
                <AccountLockedNotice reason={lockReason} />
            ) : (
                <AuthErrorBanner message={error} />
            )}

            <AuthTextInput

                type="email"
                name="email"
                placeholder="Correo electrónico"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => {
                    
                    setEmail(event.target.value)
                    clearFeedback()
                }}
            />

            <Link to="/forgot-password" className={styles.forgotLink}>
                ¿Olvidaste tu contraseña?
            </Link>

            <PasswordField

                name="password"
                placeholder="Contraseña"
                autoComplete="current-password"
                required
                value={password}
                onChange={(event) => {
                    
                    setPassword(event.target.value)
                    clearFeedback()
                }}
            />

            <button type="submit" className={styles.submit} disabled={isSubmitting}>
                {isSubmitting ? 'Ingresando...' : 'Iniciar sesión'}
            </button>

            <div className={styles.divider}>

                <span />
                <span className={styles.dividerText}> O </span>
                <span />

            </div>

            <GoogleAuthButton />

        </form>
    )
}