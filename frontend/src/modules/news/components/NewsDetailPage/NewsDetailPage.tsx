import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeftIcon } from '@phosphor-icons/react'
import { Icon } from '../../../../shared/icons/Icon'
import { useNewsDetail } from '../../hooks/useNews'
import { formatLongDate } from '../../../../shared/utils/formatDate'
import styles from './NewsDetailPage.module.css'

export function NewsDetailPage() {

    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const { news, isLoading, notFound } = useNewsDetail(id)

    if (isLoading) return null

    if (notFound || !news) {

        return (

            <div className={styles.page}>

                <p className={styles.notFound}>No encontramos esta noticia.</p>
                <button type="button" className={styles.backLink} onClick={() => navigate('/noticias')}>

                    <Icon icon={ArrowLeftIcon} size={16} weight='bold' /> Volver a noticias
                </button>
            </div>
        )
    }

    return (

        <div className={styles.page}>

            <button type="button" className={styles.backLink} onClick={() => navigate('/noticias')}>

                <Icon icon={ArrowLeftIcon} size={16} weight='bold' /> Volver a noticias
            </button>

            <div className={styles.card}>

                <div className={styles.body}>

                    <p className={styles.date}>{formatLongDate(news.published_at)}</p>
                    <h1 className={styles.title}>{news.title}</h1>
                    <p className={styles.body}>{news.body}</p>
                </div>
            </div>
        </div>
    )
}