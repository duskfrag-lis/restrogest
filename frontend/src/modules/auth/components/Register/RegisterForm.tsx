import { useState, type FormEvent } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { ApiError } from '../../../../shared/http/ApiClient'
import { sanitizeNameInput, sanitizePhoneInput, isValidEmail } from '../../../../shared/utils/validators'
import { AuthTextInput } from '../shared/AuthTextInput'
import { PasswordField } from '../shared/PasswordField'
import { AuthErrorBanner } from '../shared/AuthErrorBanner'
import { GoogleAuthButton } from '../GoogleAuthButton/GoogleAuthButton'
import styles from './RegisterForm.module.css'

interface RegisterFormProps {

    onSuccess: (email: string) => void
}

export function RegisterForm({ onSuccess }: RegisterFormProps) {

    const { register } = useAuth()

    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [phone, setPhone] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const clearError = () => { if (error) setError(null) }

    const handleSubmit = async (event: FormEvent) => {

        event.preventDefault()
        setError(null)

        if (!isValidEmail(email)) {
            setError('Ingresa un correo electrónico válido')
            return
        }

        if (password.length < 8) {
            setError('La contraseña debe tener al menos 8 caracteres')
            return 
        }

        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden')
            return
        }

        setIsSubmitting(true)

        try {

            await register({

                first_name: firstName,
                last_name: lastName,
                phone: phone || undefined,
                email,
                password,
            })

            onSuccess(email)
        } catch (err) {

            if (err instanceof ApiError) {

                setError(err.message)
            } else {

                setError('No pudimos crear tu cuenta. Intenta de nuevo.')
            }
        } finally {

            setIsSubmitting(false)
        }
    }

    return (

        <form className={styles.form} onSubmit={handleSubmit}>

            <h1 className={styles.title}>Registrarse</h1>
            <p className={styles.subtitle}>¡Empieza con tu primer pedido!</p>

            <AuthErrorBanner message={error} />

            <div className={styles.row}>

                <AuthTextInput

                    name="first_name"
                    placeholder="Nombre"
                    autoComplete="give-name"
                    required
                    value={firstName}
                    onChange={(event) => {

                        setFirstName(sanitizeNameInput(event.target.value))
                        clearError()
                    }}
                />

                <AuthTextInput

                    name="last_name"
                    placeholder="Apellido"
                    autoComplete="family-name"
                    required
                    value={lastName}
                    onChange={(event) => {

                        setLastName(sanitizeNameInput(event.target.value))
                        clearError()
                    }}
                />
            </div>

            <div className={styles.row}>

                <AuthTextInput

                    type="tel"
                    name="phone"
                    placeholder="Teléfono (opcional)"
                    autoComplete="tel"
                    value={phone}
                    onChange={(event) => {

                        setPhone(sanitizePhoneInput(event.target.value))
                        clearError()
                    }}
                />

                <AuthTextInput

                    type="email"
                    name="email"
                    placeholder="Correo electrónico"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(event) => {

                        setEmail(event.target.value)
                        clearError()
                    }}
                />
            </div>
            
            <div className={styles.row}>

                <PasswordField

                    name="password"
                    placeholder="Contraseña"
                    autoComplete="new-password"
                    required
                    value={password}
                    onChange={(event) => {

                        setPassword(event.target.value)
                        clearError()
                    }}
                />

                <PasswordField

                    name="confirmPassword"
                    placeholder="Confirmar contraseña"
                    autoComplete="new-password"
                    required
                    value={confirmPassword}
                    onChange={(event) => {
                        
                        setConfirmPassword(event.target.value)
                        clearError()
                    }}
                />
            </div>

            <button type="submit" className={styles.submit} disabled={isSubmitting}>
                {isSubmitting ? 'Creando cuenta...' : 'Crear cuenta'}
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