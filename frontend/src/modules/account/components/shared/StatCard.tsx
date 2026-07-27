import { Link } from "react-router-dom";
import { ArrowLeftIcon } from "@phosphor-icons/react";
import { Icon } from "../../../../shared/icons/Icon";
import styles from './StatCard.module.css'

interface StatCardProps {

    icon: React.ReactNode
    value: number
    label: string
    linkLabel: string
    to: string
}

export function StatCard({ icon, value, label, linkLabel, to }: StatCardProps) {
    
    return (

        <div className={styles.card}>

            <div className={styles.icon}>{icon}</div>
            <p className={styles.value}>{value}</p>
            <p className={styles.label}>{label}</p>
            <Link to={to} className={styles.link}>
            
                {linkLabel}
                <Icon icon={ArrowLeftIcon} className={styles.linkIcon} weight="bold" />
            </Link>
        </div>
    )
}