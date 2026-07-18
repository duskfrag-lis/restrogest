import styles from './AuthErrorBanner.module.css'

interface AuthErrorBannerProps {

    message: string | null
}

export function AuthErrorBanner({ message }: AuthErrorBannerProps) {

    if (!message) return null

    return <p className={styles.banner}>{message}</p>
}