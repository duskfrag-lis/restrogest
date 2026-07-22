import styles from './AccountDisclaimer.module.css'

interface AccountDisclaimerProps {

    message: string
}

export function AccountDisclaimer({ message }: AccountDisclaimerProps) {

    return <p className={styles.text}>{message}</p>
}