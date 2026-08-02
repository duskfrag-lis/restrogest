import { Link, NavLink } from 'react-router-dom'
import { CalendarDotsIcon, ShoppingCartIcon } from '@phosphor-icons/react'
import { useAuth } from '../../../modules/auth/hooks/useAuth'
import { useAccount } from '../../../modules/account/hooks/useAccount'
import { useRestaurantInfo } from '../../../modules/restaurant-info/hooks/useRestaurantInfo'
import { useCart } from '../../../modules/cart/hooks/useCart'
import { Avatar } from '../../../modules/account/components/shared/Avatar'
import { Icon } from '../../../shared/icons/Icon'
import styles from './PublicHeader.module.css'

const NAV_ITEMS = [

    { label: 'Inicio', to: '/', end: true },
    { label: 'Menú', to: '/menu', end: false },
    { label: 'Nosotros', to: '/nosotros', end: false },
    { label: 'Reseñas', to: '/resenas', end: false },
    { label: 'Noticias', to: '/noticias', end: false },
    { label: 'Contacto', to: '/contacto', end: false },
]

export function PublicHeader() {

    const { user } = useAuth()
    const { profile } = useAccount()
    const { info } = useRestaurantInfo()
    const { itemCount } = useCart()

    const brandName = info?.name ?? 'RestroGest'

    return (

        <header className={styles.header}>
            <div className={styles.inner}>
                
                <div className={styles.zoneLeft}>
                    <Link to="/" className={styles.brand}>{brandName}</Link>
                </div>

                <div className={styles.zoneCenter}>

                    <nav className={styles.nav}>
                        {NAV_ITEMS.map((item) => (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                end={item.end}
                                className={({ isActive }) =>
                                    isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink
                                }
                            >
                                {item.label}
                            </NavLink>
                        ))}
                    </nav>

                    <div className={styles.iconGroup}>

                        <Link to="/reservations" className={styles.iconButton} aria-label="Reservas">
                            <Icon icon={CalendarDotsIcon} className={styles.icon} weight="bold"/>
                        </Link>

                        <Link to="/cart" className={styles.iconButton} aria-label="Carrito">
                            <Icon icon={ShoppingCartIcon} className={styles.icon} weight="bold" />
                            {itemCount > 0 && <span className={styles.badge}>{itemCount}</span>}
                        </Link>

                    </div>
                </div>

                <div className={styles.zoneRight}>

                    {user && profile ? (
                        <Link to="/account" className={styles.userButton}>
                            <Avatar
                                photoUrl={profile.photo_url}
                                firstName={profile.first_name}
                                lastName={profile.last_name}
                                size="sm"
                            />
                            <span className={styles.userName}>{profile.first_name}</span>
                        </Link>
                    ) : (
                        <>
                            <Link to="/login" className={styles.loginButton}>Iniciar Sesión</Link>
                            <Link to="/login?mode=register" className={styles.registerButton}>Registrarse</Link>
                        </>
                    )}

                </div>
            </div>
        </header>
    )
}