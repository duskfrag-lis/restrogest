import { MapPinIcon, ClockIcon, PhoneIcon, ShareNetworkIcon, InstagramLogoIcon, FacebookLogoIcon, TiktokLogoIcon } from "@phosphor-icons/react"
import { Icon } from "../../../../shared/icons/Icon"
import { useRestaurantInfo } from "../../hooks/useRestaurantInfo"
import { ScheduleList } from "../ScheduleList/ScheduleList"
import styles from './ContactPage.module.css'

const SOCIAL_ICONS: Record<string, typeof InstagramLogoIcon> = {

    instagram: InstagramLogoIcon,
    facebook: FacebookLogoIcon,
    tiktok: TiktokLogoIcon,
}

export function ContactPage() {

    const { info, isLoading } = useRestaurantInfo()

    if (isLoading) return null

    const hasSchedule = !!info?.schedule && Object.keys(info.schedule).length > 0
    const socialEntries = info?.social_links ? Object.entries(info.social_links).filter(([, url]) => !!url): []

    return (

        <div className={styles.page}>

            <div className={styles.header}>
                <h1 className={styles.title}>Visítanos</h1>
                <p className={styles.subtitle}>Estamos aquí para atenderte en persona o desde la app</p>
            </div>

            <div className={styles.grid}>

                <div className={styles.info}>

                    <div className={styles.item}>

                        <Icon icon={MapPinIcon} size={24} weight="bold" color="var(--color-text-primary)" />

                        <div>
                            <p className={styles.label}>Dirección</p>
                            <p className={styles.value}>{info?.address || 'No configurado'}</p>
                        </div>

                    </div>

                    <div className={styles.item}>

                        <Icon icon={ClockIcon} size={24} weight="bold" color="var(--color-text-primary)" />

                        <div>
                            <p className={styles.label}>Horario</p>

                            {hasSchedule ? (

                                <ScheduleList schedule={info!.schedule!} />

                            ) : (

                                <p className={styles.value}>No configurado</p>
                            )}
                        </div>
                    </div>

                    <div className={styles.item}>

                        <Icon icon={PhoneIcon} size={24} weight="bold" color="var(--color-text-primary)" />

                        <div>
                            <p className={styles.label}>Teléfono</p>
                            <p className={styles.value}>{info?.phone || 'No configurado'}</p>
                        </div>

                    </div>

                    <div className={styles.item}>

                        <Icon icon={ShareNetworkIcon} size={24} weight="bold" color="var(--color-text-primary)" />

                        <div>

                            <p className={styles.label}>Síguenos</p>

                            {socialEntries.length > 0 ? (

                                <div className={styles.socialIcons}>

                                    {socialEntries.map(([platform, url]) => {

                                        const IconComponent = SOCIAL_ICONS[platform]

                                        if (!IconComponent) return null

                                        return (

                                            <a
                                                key={platform}
                                                href={url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={styles.socialLink}
                                                aria-label={platform}
                                            >

                                                <Icon icon={IconComponent} size={20} weight="fill" color="var(--color-text-on-accent)" />

                                            </a>
                                        )

                                    })}

                                </div>
                            ) : (

                                <p className={styles.value}>No configurado</p>
                            )}

                        </div>
                    </div>
                </div>

                <div className={styles.mapWrapper}>

                    {info?.address ? (

                        <iframe
                            title="Ubicación del restaurante"
                            className={styles.map}
                            src={`https://www.google.com/maps?q=${encodeURIComponent(info.address)}&output=embed`}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        />

                    ) : (

                        <div className={styles.mapPlaceholder}>No configurado</div>
                    )}

                </div>
            </div>
        </div>
    )
}