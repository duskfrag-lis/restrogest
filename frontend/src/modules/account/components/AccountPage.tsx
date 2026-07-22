import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../auth/hooks/useAuth'
import { useAccount } from '../hooks/useAccount'
import { accountApi } from '../services/accountApi'
import { ApiError } from '../../../shared/http/ApiClient'
import { formatLongDate, formatRoleLabel } from '../../../shared/utils/formatDate' 
import { getDisclaimerMessage, isBackofficeRole } from '../../../shared/utils/roles'
import { AvatarUploader } from './AvatarUploader/AvatarUploader'
import { ProfileInfoCard } from './ProfileInfoCard/ProfileInfoCard'
import { StatCard } from './shared/StatCard'
import { EditProfileModal } from './ProfileForm/EditProfileModal'
import { ChangePasswordForm } from './ChangePasswordForm/ChangePasswordForm'
import { ConfirmDialog } from './shared/ConfirmDialog'
import { AccountDisclaimer } from './shared/AccountDisclaimer'
import { PencilIcon } from '../../../shared/icons/PencilIcon'
import { LockIcon } from '../../../shared/icons/LockIcon'
import { LogoutIcon } from '../../../shared/icons/LogoutIcon'
import { TrashIcon } from '../../../shared/icons/TrashIcon'
import { ArrowRightIcon } from '../../../shared/icons/ArrowRightIcon'
import { ReceiptIcon } from '../../../shared/icons/ReceiptIcon'
import { CalendarIcon } from '../../../shared/icons/CalendarIcon'
import styles from './AccountPage.module.css'


export function AccountPage() {

    const { logout } = useAuth()
    const { profile, isLoading, refresh } = useAccount()
    const navigate = useNavigate()

    const [isEditOpen, setIsEditOpen] = useState(false)
    const [isPasswordOpen, setIsPasswordOpen] = useState(false)
    const [isDeleteOpen, setIsDeleteOpen] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [isUploadingPhoto, setIsUploadingPhoto] = useState(false)
    const [deleteError, setDeleteError] = useState<string | null>(null)

    const handleLogout = async () => {

        await logout()
        navigate('/login', { replace: true })
    }

    const handleAvatarSelect = async (file: File) => {

        setIsUploadingPhoto(true)

        try {

            await accountApi.updateProfile({ image: file })
            await refresh()

        } finally {

            setIsUploadingPhoto(false)
        }
    }

    const handleDeleteAccount = async () => {

        setIsDeleting(true)
        setDeleteError(null)

        try {

            await accountApi.deleteAccount()
            navigate('/login', { replace: true })

        } catch (err) {

            setDeleteError(err instanceof ApiError ? err.message : 'No pudimos eliminar tu cuenta')
            setIsDeleting(false)
        }
    }

    if (isLoading || !profile) {

        return <div className={styles.loading}>Cargando tu cuenta...</div>
    }

    const showDeleteOption = !isBackofficeRole(profile.role)

    const profilePanel = (
        <>
            <div className={styles.profileHeader}>

                <AvatarUploader
                    photoUrl={profile.photo_url}
                    firstName={profile.first_name}
                    lastName={profile.last_name}
                    onSelectFile={handleAvatarSelect}
                    isUploading={isUploadingPhoto}
                />

                <div>
                    <h1 className={styles.greeting}>Hola, {profile.first_name}</h1>
                    <p className={styles.role}>{formatRoleLabel(profile.role)}</p>
                    <p className={styles.since}>desde {formatLongDate(profile.created_at)}</p>
                </div>
            </div>

            <ProfileInfoCard

                firstName={profile.first_name}
                lastName={profile.last_name}
                phone={profile.phone}
                email={profile.email}
            />

            <button type="button" className={styles.editButton} onClick={() => setIsEditOpen(true)}>
                <PencilIcon className={styles.buttonIcon} />
                Editar información
            </button>

            <button type="button" className={styles.passwordButton} onClick={() => setIsPasswordOpen(true)}>
                <span className={styles.passwordLeft}>
                    <LockIcon className={styles.buttonIcon} />
                    Cambiar contraseña
                </span>
                <ArrowRightIcon className={styles.passwordArrow} />
            </button>
        </>
    )

    return (

        <div className={styles.page}>

            {showDeleteOption ? (

                <div className={styles.grid}>
                    <div className={styles.column}>{profilePanel}</div>

                    <div className={styles.column}>

                        <StatCard
                            icon={<ReceiptIcon />}
                            value={0}
                            label="Pedidos realizados"
                            linkLabel="Ver historial"
                            to="/orders/history"
                        />

                        <StatCard
                            icon={<CalendarIcon />}
                            value={0}
                            label="Reservas activas"
                            linkLabel="Ver reservas"
                            to="/reservations"
                        />

                        <button type="button" className={styles.logoutButton} onClick={handleLogout}>
                            <LogoutIcon className={styles.buttonIcon} />
                            Cerrar sesión
                        </button>

                        <button type="button" className={styles.deleteButton} onClick={() => setIsDeleteOpen(true)}>
                            <TrashIcon className={styles.buttonIcon} />
                            Eliminar cuenta
                        </button>
                    </div>
                </div>

            ) : (

                <div className={styles.singleColumn}>
                    {profilePanel}

                    <button type="button" className={styles.logoutButton} onClick={handleLogout}>
                        <LogoutIcon className={styles.buttonIcon} />
                        Cerrar sesión
                    </button>

                    <AccountDisclaimer message={getDisclaimerMessage(profile.role)} />
                </div>
            )}

            {isEditOpen && (
                <EditProfileModal
                
                    profile={profile}
                    onClose={() => setIsEditOpen(false)}
                    onSaved={() => refresh()}
                />
            )}

            {isPasswordOpen && (
                <ChangePasswordForm onClose={() => setIsPasswordOpen(false)} />
            )}

            {isDeleteOpen && (
                
                <ConfirmDialog
                    title="¿Seguro que quieres eliminar tu cuenta?"
                    description={deleteError ?? 'Se eliminará toda tu información. Esta acción no se puede deshacer'}
                    confirmLabel="Eliminar"
                    isConfirming={isDeleting}
                    onConfirm={handleDeleteAccount}
                    onCancel={() => setIsDeleteOpen(false)}
                />
            )}
        </div>
    )
}