import { useState, type FormEvent } from "react";
import { useNavigate, useSearchParams } from 'react-router-dom'
import { authApi } from "../../services/authApi";
import { ApiError } from "../../../../shared/http/ApiClient";
import { isPasswordValid } from "../../../../shared/utils/passwordRules";
import { PasswordField } from "../shared/PasswordField";
import { PasswordChecklist } from "../shared/PasswordChecklist";
import { AuthErrorBanner } from "../shared/AuthErrorBanner";
import { LockKeyIcon } from "@phosphor-icons/react";
import { Icon } from "../../../../shared/icons/Icon";
import styles from './ResetPasswordForm.module.css'


const REDIRECT_DELAY_MS = 2500

export function ResetPasswordForm() {

    const [SearchParams] = useSearchParams()
    const navigate = useNavigate()
    const token = SearchParams.get('token') ?? ''

    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)

    const passwordsMatch = confirmPassword.length === 0 || password === confirmPassword
    const canSubmit = isPasswordValid(password) && password === confirmPassword && token.length > 0

    const handleSubmit = async (event: FormEvent) => {

        event.preventDefault()
        setError(null)

        if (!token) {

            setError('El enlace no es válido o ha expirado')
            return 
        }

        if (!isPasswordValid(password)) {

            setError('La contraseña no cumple con los requisitos')
            return 
        }

        if (password !== confirmPassword) {

            setError('Las contraseñas no coinciden')
            return 
        }

        try {

            await authApi.resetPassword(token, password)
            setIsSuccess(true)
            setTimeout(() => navigate('/login', { replace: true }), REDIRECT_DELAY_MS)

        } catch (err) {

            if (err instanceof ApiError) {
                setError(err.message)
            } else {
                setError('No pudimos actualizar tu contraseña. Intenta de nuevo.')
            }
        } finally {

            setIsSubmitting(false)
        }
    }

    return (

        <form className={styles.form} onSubmit={handleSubmit}>
            
            <div className={styles.header}>
                <Icon icon={LockKeyIcon} className={styles.headerIcon} weight="bold"/>
                <h1 className={styles.title}>Crea una nueva contraseña</h1>
            </div>

            <AuthErrorBanner message={error} />

            <div className={styles.field}>
                <label className={styles.label}>Nueva contraseña</label>
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
                <label className={styles.label}>Confirmar nueva contraseña</label>
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
                {!passwordsMatch && (
                    <span className={styles.mismatch}>Las contraseñas no coinciden</span>
                )}
            </div>

            {isSuccess ? (
                <p className={styles.success}>
                    Contraseña actualizada correctamente. Ya puedes iniciar sesión con tu nueva contraseña.
                </p>
            ) : (
                <button type="submit" className={styles.submit} disabled={!canSubmit || isSubmitting}>
                    {isSubmitting ? 'Guardando...' : 'Confirmar'}
                </button>
            )}
        </form>
    )
}