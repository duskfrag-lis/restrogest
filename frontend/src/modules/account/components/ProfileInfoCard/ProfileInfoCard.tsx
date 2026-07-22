import { UserIcon } from "../../../../shared/icons/UserIcon";
import { PhoneIcon } from "../../../../shared/icons/PhoneIcon";
import { EnvelopeIcon } from "../../../../shared/icons/EnvelopeIcon";
import styles from './ProfileInfoCard.module.css'


interface ProfileInfoCardProps {

    firstName: string
    lastName: string
    phone: string | null
    email: string
}

export function ProfileInfoCard({ firstName, lastName, phone, email }: ProfileInfoCardProps) {

    return (

        <div className={styles.card}>

            <div className={styles.row}>

                <UserIcon className={styles.icon} />

                <div>
                    <p className={styles.label}>Nombre completo</p>
                    <p className={styles.value}>{firstName} {lastName}</p>
                </div>
            </div>

            <div className={styles.row}>

                <PhoneIcon className={styles.icon} />

                <div>
                    <p className={styles.label}>Teléfono</p>
                    <p className={styles.value}>{phone ?? 'No registrado'}</p>
                </div>
            </div>

            <div className={styles.row}>

                <EnvelopeIcon className={styles.icon} />

                <div>
                    <p className={styles.label}>Correo</p>
                    <p className={styles.value}>{email}</p>
                </div>
            </div>
        </div>
    )
}