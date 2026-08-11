import { Link } from "react-router-dom"
import { formatLongDate } from "../../../../shared/utils/formatDate"
import type { NewsSummary } from "../../types/news.types"
import styles from './NewsCard.module.css'

interface NewsCardProps {

    news: NewsSummary
}

function getExcerpt(body: string, maxLength = 85): string {

    if (body.length <= maxLength) return body

    return body.slice(0, maxLength).trimEnd() + '...'
}

export function NewsCard({ news }: NewsCardProps) {

    return (

        <Link to={`/noticias/${news.id}`} className={styles.card}>

            <div className={styles.body}>

                <p className={styles.date}>{formatLongDate(news.published_at)}</p>
                <h3 className={styles.title}>{news.title}</h3>
                <p className={styles.body}>{getExcerpt(news.body)}</p>
                
            </div>
        </Link>
    )
}