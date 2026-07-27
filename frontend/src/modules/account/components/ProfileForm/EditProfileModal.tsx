import { useState, type FormEvent } from "react";
import { accountApi } from "../../services/accountApi";
import { ApiError } from "../../../../shared/http/ApiClient";
import { sanitizeNameInput, sanitizePhoneInput } from "../../../../shared/utils/validators";
import { ModalOverlay } from "../../../../shared/components/ModalOverlay";
import { AuthTextInput } from "../../../auth/components/shared/AuthTextInput";
import { AuthErrorBanner } from "../../../auth/components/shared/AuthErrorBanner";
import { PencilLineIcon } from "@phosphor-icons/react";
import { Icon } from "../../../../shared/icons/Icon";
import type { ProfileUser } from "../../types/account.types";
import styles from './EditProfileModal.module.css'

interface EditProfileModalProps {

    profile: ProfileUser
    onClose: () => void
    onSaved: (updated: ProfileUser) => void
}

export function EditProfileModal({ profile, onClose, onSaved }: EditProfileModalProps) {

    const [firstName, setFirstName] = useState(profile.first_name)
    const [lastName, setLastName] = useState(profile.last_name)
    const [phone, setPhone] = useState(profile.phone ?? '')
    const [error, setError] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (event: FormEvent) => {

        event.preventDefault()
        setError(null)
        setIsSubmitting(true)

        try {

            const result = await accountApi.updateProfile({
                first_name: firstName,
                last_name: lastName,
                phone,
            })

            onSaved(result.user)
            onClose()

        } catch (err) {

            if (err instanceof ApiError) {

                setError(err.message)
            } else (

                setError('No pudimos guardar los cambios. Intenta de nuevo.')
            )
        } finally {

            setIsSubmitting(false)
        }
    }

    return (

        <ModalOverlay onClose={onClose}>

            <form className={styles.form} onSubmit={handleSubmit}>

                <div className={styles.header}>
                    <Icon icon={PencilLineIcon} className={styles.headerIcon} weight="bold" />
                    <h2 className={styles.title}>Editar información</h2>
                </div>

                <AuthErrorBanner message={error} />

                <div className={styles.field}>

                    <label className={styles.label}>Nombre</label>

                    <AuthTextInput 

                        name="first_name"
                        required
                        value={firstName}
                        onChange={(event) => setFirstName(sanitizeNameInput(event.target.value))}
                    />
                </div>

                <div className={styles.field}>

                    <label className={styles.label}>Apellido</label>

                    <AuthTextInput

                        name="last_name"
                        required
                        value={lastName}
                        onChange={(event) => setLastName(sanitizeNameInput(event.target.value))}
                    />
                </div>

                <div className={styles.field}>

                    <label className={styles.label}>Teléfono</label>

                    <AuthTextInput

                        name="phone"
                        type="tel"
                        inputMode="numeric"
                        value={phone}
                        onChange={(event) => setPhone(sanitizePhoneInput(event.target.value))}

                    />
                </div>

                <div className={styles.actions}>

                    <button type="button" className={styles.cancel} onClick={onClose} disabled={isSubmitting}>
                        Cancelar
                    </button> 

                    <button type="submit" className={styles.save} disabled={isSubmitting}>
                        {isSubmitting ? 'Guardando...' : 'Guardar'}
                    </button>
                </div>
            </form>
        </ModalOverlay>
    )
}