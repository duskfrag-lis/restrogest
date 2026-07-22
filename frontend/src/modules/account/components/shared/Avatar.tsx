import { getInitials } from "../../../../shared/utils/initials";
import styles from './Avatar.module.css'

interface AvatarProps {

    photoUrl: string | null
    firstName: string
    lastName: string
    size?: 'sm' | 'lg'
}

export function Avatar({ photoUrl, firstName, lastName, size = 'lg' }: AvatarProps) {

    const sizeClass = size === 'lg' ? styles.large : styles.small

    if (photoUrl) {

        return <img src={photoUrl} alt={`${firstName} ${lastName}`} className={`${styles.avatar} ${sizeClass}`} />
    }

    return (

        <div className={`${styles.avatar} ${styles.fallback} ${sizeClass}`}>
            {getInitials(firstName, lastName)}
        </div>
    )
}