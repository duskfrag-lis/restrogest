import { usePublicNews } from "../hooks/useNews"
import { useRestaurantInfo } from "../../restaurant-info/hooks/useRestaurantInfo"
import { EmptySection } from "../../../shared/components/EmptySection"
import { NewsCard } from "./NewsCard/NewsCard"
import styles from './NewsPage.module.css'

export function NewsPage() {

    const { news, isLoading } = usePublicNews()
    const { info } = useRestaurantInfo()

    const brandName = info?.name ?? 'RestroGest'

    if (isLoading) return null

    return (

        <div className={styles.page}>

            <div className={styles.header}>
                <h1 className={styles.title}>Noticias y novedades</h1>
                <p className={styles.subtitle}>Entérate de lo último en {brandName}</p>
            </div>

            {news.length === 0 ? (

                <EmptySection message="Aún no hay noticias publicadas." />

            ) : (

                <div className={styles.grid}>

                    {news.map((item) => (
                        <NewsCard key={item.id} news={item} />
                    ))}
                </div>
            )}
        </div>
    )
}