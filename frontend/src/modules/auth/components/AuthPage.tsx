import { useState } from 'react'
import { AuthLayout, type AuthMode } from './AuthLayout/AuthLayout'
import { LoginForm } from './Login/LoginForm'
import { RegisterForm } from './Register/RegisterForm'
import { VerifyEmailModal } from './VerifyEmailModal/VerifyEmailModal'
import styles from './AuthPage.module.css'

export function AuthPage() {

    const [mode, setMode] = useState<AuthMode>('login')
    const [pendingVerificationEmail, setPendingVerificationEmail] = useState<string | null>(null)

    const switchToLogin = () => {

        setMode('login')
        setPendingVerificationEmail(null)
    }

    const switchToRegister = () => setMode('register')

    return (
        <div className={styles.page}>

            <div className={pendingVerificationEmail ? styles.blurred : undefined}>

                {mode === 'login' ? (

                    <AuthLayout
                        mode="login"
                        promoTitle="¡Bienvenido de vuelta!"
                        promoSubtitle={
                            <>
                                ¿Aún no tienes cuenta?
                                <br />
                                Regístrate y podrás disfrutar de nuestros servicios.
                            </>
                        }

                        promoActionLabel="Registrarse"
                        onPromoAction={switchToRegister}
                    >
                        <LoginForm />
                    </AuthLayout>

                ) : (

                    <AuthLayout

                        mode="register"
                        promoTitle="¡Únete a nosotros!"
                        promoSubtitle={
                            <>
                                ¿Ya tienes cuenta? Inicia sesión
                                <br />
                                para continuar.
                            </>
                        }

                        promoActionLabel="Iniciar sesión"
                        onPromoAction={switchToLogin}
                    >
                        <RegisterForm onSuccess={setPendingVerificationEmail} />
                    </AuthLayout>
                )}

            </div>

            {pendingVerificationEmail && (
                <VerifyEmailModal email={pendingVerificationEmail} onBackToLogin={switchToLogin} />
            )}
            
        </div>
    )
}