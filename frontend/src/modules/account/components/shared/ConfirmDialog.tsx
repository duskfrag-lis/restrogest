import { ModalOverlay } from "../../../../shared/components/ModalOverlay";
import { WarningIcon } from "../../../../shared/icons/WarningIcon";
import styles from './ConfirmDialog.module.css'

interface ConfirmDialogProps {

    title: string
    description: string
    confirmLabel: string
    isConfirming?: boolean
    onConfirm: () => void
    onCancel: () => void
}

export function ConfirmDialog({

    title, description, confirmLabel, isConfirming = false, onConfirm, onCancel,
}: ConfirmDialogProps) {

    return (

        <ModalOverlay onClose={onCancel}>

            <div className={styles.content}>

                <WarningIcon className={styles.icon} />
                <h2 className={styles.title}>{title}</h2>
                <p className={styles.description}>{description}</p>

                <div className={styles.actions}>
                    <button type="button" className={styles.danger} onClick={onConfirm} disabled={isConfirming}>
                        {isConfirming ? 'Eliminando...' : confirmLabel}
                    </button>

                    <button type="button" className={styles.cancel} onClick={onCancel} disabled={isConfirming}>
                        Cancelar
                    </button>
                </div>
            </div>
        </ModalOverlay>

    )
}