import type { ReactNode } from 'react'
import { ForkKnifeIcon } from '@phosphor-icons/react'
import { Icon } from '../../../../shared/icons/Icon'
import styles from './AuthLayout.module.css'

export type AuthMode = 'login' | 'register'

interface AuthLayoutProps{

    mode: AuthMode
    promoTitle: string
    promoSubtitle: ReactNode
    promoActionLabel: string
    onPromoAction: () => void
    children: ReactNode
    wide?: boolean
}

export function AuthLayout({

    mode, promoTitle, promoSubtitle, promoActionLabel, onPromoAction, children, wide = false,
}: AuthLayoutProps) {

    const isRegister = mode === 'register'

    return (

        <div className={`${styles.stage} ${wide ? styles.stageWide: ''}`}>

            <aside className={`${styles.promoPanel} ${isRegister ? styles.promoLeft : styles.promoRight}`}>

                <Icon icon={ForkKnifeIcon} className={styles.promoIcon} weight="bold" />
                <h2 className={styles.promoTitle}>{promoTitle}</h2>
                <p className={styles.promoSubtitle}>{promoSubtitle}</p>
                <button type="button" className={styles.promoAction} onClick={onPromoAction}>{promoActionLabel}</button>
            </aside>

            <section className={`${styles.formPanel} ${isRegister ? styles.formRight : styles.formLeft}`}>
                <div className={wide ? styles.formInnerWide : styles.formInner}>{children}</div>
            </section>

        </div>
    )

}
