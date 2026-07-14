import { useState, type ChangeEvent, type FormEvent } from 'react'
import { Eye, EyeOff, UtensilsCrossed } from 'lucide-react'
import { ApiError } from '../../../shared/http/ApiClient'
import { useAuth } from '../hooks/useAuth'
import type { RegisterData } from '../types/auth.types'
import { VerifyEmailModal } from './VerifyEmailModal'
import styles from './AuthPage.module.css'


interface LoginFormState {

    email: string
    password: string
}

const emptyRegisterForm: RegisterData = {

    first_name: '',
    last_name: '',
    phone: '',
    email: '',
    password: '',
}

export function AuthPage() {

    const auth = useAuth()
    const [showRegisterPanel, setShowRegisterPanel] = useState(false)
    const [loginForm, setLoginForm] = useState<LoginFormState>({ email: '', password: '' })
    const [registerForm, setRegisterForm] = useState<RegisterData>(emptyRegisterForm)
    const [showLoginPassword, setShowLoginPassword] = useState(false)
    const [showRegisterPassword, setShowRegisterPassword] = useState(false)
    const [feedback, setFeedback] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [verifyModalEmail, setVerifyModalEmail] = useState<string | null>(null)

    function updateLoginForm(event: ChangeEvent<HTMLInputElement>) {

        const { name, value } = event.target
        setLoginForm((current) => ({ ...current, [name]: value }))
    }

    function updateRegisterForm(event: ChangeEvent<HTMLInputElement>) {
        
        const { name, value } = event.target
        setRegisterForm((current) => ({ ...current, [name]: value }))
    }

    async function handleLogin(event: FormEvent<HTMLElement>) {
        
        event.preventDefault()
        setFeedback('')
        setIsSubmitting(true)

        try {
            await auth.login({ email: loginForm.email.trim(), password: loginForm.password })

        } catch (error) {
            setFeedback(resolveErrorMessage(error))

        } finally {
            setIsSubmitting(false)
        }
    }

    async function handleRegister(event: FormEvent<HTMLFormElement>) {

        event.preventDefault()
        setFeedback('')

        if (registerForm.password.length < 8) {
            setFeedback('La contraseña debe tener al menos 8 caracteres')

            return
        }

        setIsSubmitting(true)

        try {

            await auth.register({
                ...registerForm,
                first_name: registerForm.first_name.trim(),
                last_name: registerForm.last_name.trim(),
                phone: registerForm.phone?.trim() || undefined,
                email: registerForm.email.trim(),
            })

            setVerifyModalEmail(registerForm.email.trim())

        } catch (error) {
            setFeedback(resolveErrorMessage(error))

        } finally {
            setIsSubmitting(false)
        }
    }

    function closeVerifyModal() {

        setVerifyModalEmail(null)
        setShowRegisterPanel(false)
        setLoginForm({ email: registerForm.email.trim(), password: '' })
        setRegisterForm(emptyRegisterForm)
    }

    return (

        <div className={styles.authWrapper}>
            <div className={styles.authCard}>

                <div className={styles.formPanel}>

                    <h2 className={styles.title}>Iniciar sesión</h2>
                    <p className={styles.subtitle}>Ingresa tus datos para continuar</p>

                    {feedback && !showRegisterPanel ? <p className={styles.feedback}>{feedback}</p> : null}

                    <form className={styles.form} onSubmit={handleLogin}>
                        <input

                            type="email"
                            name="email"
                            placeholder="Correo electrónico"
                            autoComplete="email"
                            required
                            value={loginForm.email}
                            onChange={updateLoginForm}
                        />

                        <button

                            type="button"
                            className={styles.forgotLink}
                            onClick={() => { window.location.href = '/forgot-password' }}
                        >
                            ¿Olvidaste tu contraseña?
                        </button>

                        <div className={styles.passwordField}>
                            <input

                                type={showLoginPassword ? 'text' : 'password'}
                                name="password"
                                placeholder="Contraseña"
                                autoComplete="current-password"
                                required
                                value={loginForm.password}
                                onChange={updateLoginForm}
                            />

                            <button
                                type="button"
                                aria-label={showLoginPassword ? 'Ocultar contraseña' : 'Mostrar contraseña' }
                                onClick={() => setShowLoginPassword((current) => !current)}
                            >
                                {showLoginPassword ? <EyeOff size={18} aria-hidden="true"/> : <Eye size={18} aria-hidden="true"/>}

                            </button>
                        </div>

                        <button className={styles.primaryButton} type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Entrando...' : 'Iniciar sesion'}
                        </button>

                    </form>

                    <div className={styles.divider}><span>o</span></div>

                    <button
                        type="button"
                        className={styles.googleButton}
                        onClick={() => {window.location.href = `${import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api'}/auth/google`}}
                    >
                        Continuar con Google
                    </button>
                </div>

                <div className={styles.formPanel}>

                    <h2 className={styles.title}>Registrarse</h2>
                    <p className={styles.subtitle}>¡Empieza con tu primer pedido!</p>

                    {feedback && showRegisterPanel ? <p className={styles.feedback}>{feedback}</p> : null}

                    <form className={styles.form} onSubmit={handleRegister}>

                        <div className={styles.fieldRow}>
                            <input
                                type="text"
                                name="first_name"
                                placeholder="Nombre"
                                autoComplete="given-name"
                                value={registerForm.first_name}
                                onChange={updateRegisterForm}
                            />

                            <input
                                type="text"
                                name="last_name"
                                placeholder="Apellido"
                                autoComplete="family-name"
                                required
                                value={registerForm.last_name}
                                onChange={updateRegisterForm}
                            />
                        </div>

                        <div className={styles.fieldRow}>
                            <input
                                type="tel"
                                name="phone"
                                placeholder="Teléfono (opcional)"
                                autoComplete="tel"
                                value={registerForm.phone}
                                onChange={updateRegisterForm}
                            />

                            <input
                                type="email"
                                name="email"
                                placeholder="Correo electrónico"
                                autoComplete="email"
                                required
                                value={registerForm.email}
                                onChange={updateRegisterForm}
                            />
                        </div>

                        <div className={styles.passwordField}>
                            <input
                                type={showRegisterPassword ? 'text' : 'password'}
                                name="password"
                                placeholder="Contraseña"
                                autoComplete="new-password"
                                minLength={8}
                                value={registerForm.password}
                                onChange={updateRegisterForm}
                            />
                            
                            <button
                                type="button"
                                aria-label={showRegisterPassword ? 'Ocultar contraseña' : 'Mostrar contraseña' }
                                onClick={() => setShowRegisterPassword((current) => !current)}
                            >
                                {showRegisterPassword ? <EyeOff size={18} aria-hidden="true"/> : <Eye size={18} aria-hidden="true"/>}
                            </button>
                        </div>

                        <button className={styles.primaryButton} type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Creando cuenta...' : 'Crear cuenta'}
                        </button>
                    </form>

                    <div className={styles.divider}><span>o</span></div>

                    <button
                        type="button"
                        className={styles.googleButton}
                        onClick={() => {window.location.href = `${import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api'}/auth/google`}}
                    >
                        Continuar con Google
                    </button>
                </div>

                <div className={styles.overlayPanel} style={{ transform: showRegisterPanel ? 'translateX(-100%)' : 'translateX(0)'}}>

                    <UtensilsCrossed size={28} aria-hidden="true"/>
                    {showRegisterPanel ? (
                        <>
                            <h3>¡Únete a nosotros!</h3>
                            <p>¿Ya tienes cuenta? Inicia sesión para continuar.</p>
                            <button type="button" onClick={() => { setShowRegisterPanel(false); setFeedback('') }}>
                                Iniciar sesión
                            </button>
                        </>
                    ): (
                        <>
                            <h3>¡Bienvenido de vuelta!</h3>
                            <p>¿Aún no tienes cuenta? Regístrate y podrás disfrutar de nuestros servicios.</p>
                            <button type="button" onClick={() => {setShowRegisterPanel(true); setFeedback('') }}>
                                Registrarse
                            </button>
                        </>
                    )}
                </div>
            </div>

            {verifyModalEmail ? (
                <VerifyEmailModal email={verifyModalEmail} onClose={closeVerifyModal} />
            ) : null}
        </div>
    )
}

function resolveErrorMessage(error: unknown): string {

    if (error instanceof ApiError) {
        return error.message
    }

    return 'Ocurrió un error inesperado. Intenta nuevamente.'
}


