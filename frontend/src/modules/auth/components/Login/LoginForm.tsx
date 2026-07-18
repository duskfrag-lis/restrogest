import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { ApiError } from '../../../../shared/http/ApiClient'
import { AuthTextInput } from '../shared/AuthTextInput'
import { PasswordField } from '../shared/PasswordField'
import { AuthErrorBanner } from '../shared/AuthErrorBanner'
import { GoogleAuthButton } from '../GoogleAuthButton/GoogleAuthButton'
import styles from './LoginForm.module.css'

export function LoginForm() {

    const { login } = useAuth()
    const navigate = useNavigate()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (event: FormEvent) => {

        event.preventDefault()
        setError(null)
        setIsSubmitting(true)

        try {

            await login({ email, password })
            navigate('/', { replace: true })

        } catch (err) {

            if (err instanceof ApiError) {

                setError(err.message)

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

            <Link to="/forgot-password" className={styles.forgotLink}>
                ¿Olvidaste tu contraseña?
            </Link>

            <PasswordField

                placeholder="Contraseña"
                autoComplete="current-password"
                required
                value={password}
                onChange={(event) => {
                    
                    setPassword(event.target.value)
                    if (error) setError(null)
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