import type { ReactNode } from 'react'
import { CutleryIcon } from '../../../../shared/icons/CuthleryIcon'
import styles from './AuthLayout.module.css'

export type AuthMode = 'login' | 'register'

interface AuthLayoutProps{

    mode: AuthMode
    promoTitle: string
    promoSubtitle: ReactNode
    promoActionLabel: string
    onPromoAction: () => void
    children: ReactNode
}

export function AuthLayout({

    mode, promoTitle, promoSubtitle, promoActionLabel, onPromoAction, children,
}: AuthLayoutProps) {

    const isRegister = mode === 'register'

    return (

        <div className={styles.stage}>

            <aside className={`${styles.promoPanel} ${isRegister ? styles.promoLeft : styles.promoRight}`}>

                <CutleryIcon className={styles.promoIcon} />
                <h2 className={styles.promoTitle}>{promoTitle}</h2>
                <p className={styles.promoSubtitle}>{promoSubtitle}</p>
                <button type="button" className={styles.promoAction} onClick={onPromoAction}>{promoActionLabel}</button>
            </aside>

            <section className={`${styles.fomrPanel} ${isRegister ? styles.formRight : styles.formLeft}`}>
                <div className={styles.formInner}>{children}</div>
            </section>

        </div>
    )

}
