import type { ReactNode } from "react";
import styles from './AuthInfoBox.module.css'

interface AuthInfoBoxProps {

    children: ReactNode
}

export function AuthInfoBox({ children }: AuthInfoBoxProps) {

    return <p className={styles.box}>{children}</p>
}