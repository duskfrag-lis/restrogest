import { UserCircleIcon } from "@phosphor-icons/react";
import { PhoneIcon } from "@phosphor-icons/react";
import { EnvelopeIcon } from "@phosphor-icons/react";
import { Icon } from "../../../../shared/icons/Icon";
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

                <Icon icon={UserCircleIcon} className={styles.icon} weight="bold"/>

                <div>
                    <p className={styles.label}>Nombre completo</p>
                    <p className={styles.value}>{firstName} {lastName}</p>
                </div>
            </div>

            <div className={styles.row}>

                <Icon icon={PhoneIcon} className={styles.icon} weight="bold"/>

                <div>
                    <p className={styles.label}>Teléfono</p>
                    <p className={styles.value}>{phone ?? 'No registrado'}</p>
                </div>
            </div>

            <div className={styles.row}>

                <Icon icon={EnvelopeIcon} className={styles.icon} weight="bold"/>

                <div>
                    <p className={styles.label}>Correo</p>
                    <p className={styles.value}>{email}</p>
                </div>
            </div>
        </div>
    )
}