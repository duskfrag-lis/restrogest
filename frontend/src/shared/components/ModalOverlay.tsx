import type { ReactNode } from "react";
import styles from './ModalOverlay.module.css'

interface ModalOverlayProps {

    children: ReactNode
    onClose?: () => void
}

export function ModalOverlay({ children, onClose }: ModalOverlayProps) {

    return (

        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.card} role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
                {children}
            </div>
        </div>
    )
}