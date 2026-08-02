import { buildSheduleRows } from "../../../../shared/utils/schedule"
import type { RestaurantSchedule } from "../../types/restaurantInfo.types"
import styles from './ScheduleList.module.css'

interface ScheduleListProps {

    schedule: RestaurantSchedule
}

export function ScheduleList({ schedule }: ScheduleListProps) {

    const rows = buildSheduleRows(schedule)

    return (

        <ul className={styles.list}>

            {rows.map((row) => (

                <li key={row.label} className={styles.row}>
                    <span className={styles.day}>{row.label}</span>
                    <span className={styles.hours}>{row.hours}</span>
                </li>
            ))}
        </ul>
    )
}