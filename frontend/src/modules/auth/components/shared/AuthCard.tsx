import type { ReactNode } from "react";
import styles from './AuthCard.module.css'

interface AuthCardProps {

    children: ReactNode
}

export function AuthCard({ children }: AuthCardProps) {

    return (

        <div className={styles.page}>
            <div className={styles.card}>{children}</div>
        </div>
    )
}