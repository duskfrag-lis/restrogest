import { CopyrightIcon } from "@phosphor-icons/react"
import { Icon } from "../../../shared/icons/Icon"
import { useRestaurantInfo } from "../../../modules/restaurant-info/hooks/useRestaurantInfo"
import styles from './Footer.module.css'

export function Footer() {

    const { info } = useRestaurantInfo()
    const brandName = info?.name ?? 'RestroGest'

    return (

        <footer className={styles.footer}>

            <div className={styles.inner}>

                <span className={styles.copy}>
                    <Icon icon={CopyrightIcon} size={16} weight="bold" /> {new Date().getFullYear()} {brandName}. Todos los derechos reservados.
                </span>

                <div className={styles.links}>

                    <a href="/terminos" className={styles.link}>Términos y condiciones</a>
                    <a href="/privacidad" className={styles.link}>Política de privacidad</a>
                    <a href="/ayuda" className={styles.link}>Ayuda</a>
                    
                </div>
            </div>
        </footer>
    )
}