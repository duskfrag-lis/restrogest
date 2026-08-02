import { Link } from 'react-router-dom'
import { BicycleIcon, ArmchairIcon } from '@phosphor-icons/react'
import { Icon } from '../../../shared/icons/Icon'
import { useRestaurantInfo } from '../../restaurant-info/hooks/useRestaurantInfo'
import { useFeaturedMenu } from '../hooks/useFeaturedMenu'
import { usePublicReviews } from '../../reviews/hooks/useReviews'
import { ZoomCarousel } from '../../../shared/components/ZoomCarousel/ZoomCarousel'
import { EmptySection } from '../../../shared/components/EmptySection'
import { MenuItemCard } from './MenuItemCard/MenuItemCard'
import { ReviewCard } from '../../reviews/components/ReviewCard/ReviewCard'
import { ScheduleList } from '../../restaurant-info/components/ScheduleList/ScheduleList'
import styles from './LandingPage.module.css'

const HOW_IT_WORKS_DELIVERY = [
    'Elige tus platos',
    'Paga y confirma tu dirección',
    'Recíbelo caliente en tu puerta',
]

const HOW_IT_WORKS_DINE_IN = [
    'Elige fecha y número de personas',
    'Confirma tu mesa',
    'Llega y disfruta',
]

export function LandingPage() {

    const { info } = useRestaurantInfo()
    const { items: featuredItems, isLoading: isLoadingMenu } = useFeaturedMenu()
    const { reviews, isLoading: isLoadingReviews } = usePublicReviews()

    const brandName = info?.name ?? 'RestroGest'
    const heroHeadline = info?.description ?? 'Tu restaurante favorito, ahora en línea'
    const hasContactInfo = !!(info?.address || info?.schedule)

    return (

        <div className={styles.page}>

            <section className={styles.hero}>

                <p className={styles.eyebrow}>Bienvenido a {brandName}</p>
                <h1 className={styles.headline}>{heroHeadline}</h1>
                <p className={styles.subtitle}>Pide en línea, reserva tu mesa o recibe a domicilio en minutos.</p>

                <div className={styles.heroActions}>

                    <Link to="/menu" className={styles.primaryAction}>Ver menú</Link>
                    <a href="#como-funciona" className={styles.secondaryAction}>Cómo funciona</a>
                </div>

            </section>

            <section id="como-funciona" className={styles.howItWorks}>

                <h2 className={styles.sectionTitleDark}>Elige cómo quieres disfrutar</h2>

                <div className={styles.howItWorksGrid}>

                    <div className={styles.howItWorksColumn}>

                        <p className={styles.howItWorksLabel}>
                            <Icon icon={BicycleIcon} size={20} weight="bold" /> A domicilio
                        </p>

                        {HOW_IT_WORKS_DELIVERY.map((step, index) => (

                            <div key={step} className={styles.stepRow}>
                                {index + 1}. {step}
                            </div>
                        ))}
                    </div>

                    <div className={styles.howItWorksColumn}>

                        <p className={styles.howItWorksLabel}>
                            <Icon icon={ArmchairIcon} size={20} weight="bold" /> En el restaurante
                        </p>

                        {HOW_IT_WORKS_DINE_IN.map((step, index) => (

                            <div key={step} className={styles.stepRow}>
                                {index + 1}. {step}
                            </div>
                        ))}
                    </div>

                </div>

            </section>

            <section className={styles.section}>

                <h2 className={styles.sectionTitle}>Menú destacado</h2>

                {isLoadingMenu ? null : featuredItems.length === 0 ? (

                    <EmptySection message="Aún no hay platos destacados configurados" />
                ) : (

                    <ZoomCarousel
                        items={featuredItems}
                        renderItem={(item) => <MenuItemCard item={item} />}
                    />
                )}

            </section>

            <section className={styles.sectionDark}>

                <h2 className={styles.sectionTitleDark}>Lo que dicen nuestros clientes</h2>

                {isLoadingReviews ? null : reviews.length === 0 ? (

                    <EmptySection message="Aún no hay reseñas publicadas" />

                ) : (

                    <ZoomCarousel
                        items={reviews}
                        renderItem={(review) => <ReviewCard review={review} />}
                    />
                )}

            </section>

            <section className={styles.section}>

                <h2 className={styles.sectionTitle}>Visítanos</h2>

                {!hasContactInfo ? (

                    <EmptySection message="La información de contacto, horario y ubicación aún no ha sido configurada." />

                ) : (

                    <div className={styles.visitInfo}>
                        {info?.address && <p className={styles.address}>{info.address}</p>}
                        {info?.schedule && <ScheduleList schedule={info.schedule} />}
                    </div>
                )}

            </section>

        </div>
    )
}