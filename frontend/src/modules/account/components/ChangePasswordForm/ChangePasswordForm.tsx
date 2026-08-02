import { useState, type FormEvent } from "react";
import { accountApi } from "../../services/accountApi";
import { ApiError } from "../../../../shared/http/ApiClient";
import { isPasswordValid } from "../../../../shared/utils/passwordRules";
import { ModalOverlay } from "../../../../shared/components/ModalOverlay";
import { PasswordField } from "../../../auth/components/shared/PasswordField";
import { PasswordChecklist } from "../../../auth/components/shared/PasswordChecklist";
import { AuthErrorBanner } from "../../../auth/components/shared/AuthErrorBanner";
import { LockKeyIcon } from '@phosphor-icons/react'
import { Icon } from "../../../../shared/icons/Icon";
import styles from './ChangePasswordForm.module.css'


interface ChangePasswordFormProps {

    onClose: () => void
}

export function ChangePasswordForm({ onClose }: ChangePasswordFormProps) {

    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)

    const canSubmit = isPasswordValid(newPassword) && newPassword === confirmPassword && currentPassword.length > 0

    const handleSubmit = async (event: FormEvent) => {

        event.preventDefault()
        setError(null)

        if (newPassword !== confirmPassword) {
            setError('Las contraseñas no coinciden')
            return
        }

        setIsSubmitting(true)

        try {

            await accountApi.changePassword({ currentPassword, newPassword })
            setIsSuccess(true)
            setTimeout(onClose, 1800)

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

        <ModalOverlay onClose={onClose}>

            <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.header}>
                    <Icon icon={LockKeyIcon} className={styles.headerIcon} weight="bold"/>
                    <h2 className={styles.title}>Cambiar contraseña</h2>
                </div>

                <p className={styles.subtitle}>Usa una contraseña segura que no hayas usado antes</p>

                <AuthErrorBanner message={error} />

                <div className={styles.field}>

                    <label className={styles.label}>Contraseña actual</label>

                    <PasswordField

                        name="currentPassword"
                        autoComplete="current-password"
                        required
                        disabled={isSuccess}
                        value={currentPassword}
                        onChange={(event) => {

                            setCurrentPassword(event.target.value)
                            if (error) setError(null)
                        }}
                    />
                </div>

                <div className={styles.field}>

                    <label className={styles.label}>Nueva contraseña</label>

                    <PasswordField

                        name="newPassword"
                        autoComplete="new-password"
                        required
                        disabled={isSuccess}
                        value={newPassword}
                        onChange={(event) => {

                            setNewPassword(event.target.value)
                            if (error) setError(null)
                        }}
                    />
                </div>

                <PasswordChecklist password={newPassword} />

                <div className={styles.field}>

                    <label className={styles.label}>Confirmar nueva contraseña</label>

                    <PasswordField

                        name="confirmPassword"
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
                    <p className={styles.success}>Contraseña actualizada correctamente</p>
                ) : (

                    <div className={styles.actions}>

                        <button type="button" className={styles.cancel} onClick={onClose} disabled={isSubmitting}>
                            Cancelar
                        </button>

                        <button type="submit" className={styles.save} disabled={!canSubmit || isSubmitting}>
                            {isSubmitting ? 'Guardando...' : 'Guardar'}
                        </button>
                    </div>
                )}
            </form>
        </ModalOverlay>
    )
}