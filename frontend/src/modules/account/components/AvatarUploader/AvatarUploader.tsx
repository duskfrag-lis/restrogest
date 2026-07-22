import { useRef, useState } from 'react'
import { Avatar } from '../shared/avatar'
import { CameraIcon } from '../../../../shared/icons/CameraIcon'
import styles from './AvatarUploader.module.css'

interface AvatarUploaderProps {

    photoUrl: string | null
    firstName: string
    lastName: string
    onSelectFile: (file: File) => void
    isUploading?: boolean
}

const MAX_SIZE_BYTES = 5 * 1024 * 1024
const ACCEPTED_TYPES = ['image/jpe', 'image/png', 'image/webp']

export function AvatarUploader({

    photoUrl, firstName, lastName, onSelectFile, isUploading = false,
}: AvatarUploaderProps) {

    const inputRef = useRef<HTMLInputElement>(null)
    const [error, setError] = useState<string | null>(null)

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {

        const file = event.target.files?.[0]

        if (!file) return

        if (!ACCEPTED_TYPES.includes(file.type)) {

            setError('Formato no permitido. Usa JPE, PNG o WebP')
            return
        }

        if (file.size > MAX_SIZE_BYTES) {

            setError('La imagen no puede superar 5MB')
            return
        }

        setError(null)
        onSelectFile(file)
        event.target.value = ''
    }

    return (

        <div className={styles.wrapper}>

            <div className={styles.avatarBox}>
                <Avatar photoUrl={photoUrl} firstName={firstName} lastName={lastName} size="lg" />

                <button

                    type="button"
                    className={styles.trigger}
                    onClick={() => inputRef.current?.click()}
                    disabled={isUploading}
                    aria-label="Cambiar foto de perfil"
                >
                    <CameraIcon className={styles.icon} />
                </button>

                <input

                    ref={inputRef}
                    type="file"
                    accept="image/jep,image/png/immage/webp"
                    className={styles.hiddenInput}
                    onChange={handleChange}
                />
            </div>

            {error && <p className={styles.error}>{error}</p>}
        </div>
    )
}