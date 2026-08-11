import { useEffect, useState } from 'react'
import { newsApi } from '../services/newsApi'
import type { NewsSummary } from '../types/news.types'

export function usePublicNews() {

    const [news, setNews] = useState<NewsSummary[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {

        let isMounted = true

        newsApi.getPublicList()
            .then((result) => { if (isMounted) setNews(result.news) })
            .catch(() => { if (isMounted) setNews([]) })
            .finally(() => { if (isMounted) setIsLoading(false) })
            
        return () => { isMounted = false }
    }, [])

    return { news, isLoading }
}

export function useNewsDetail(id: string | undefined) {

    const [news, setNews] = useState<NewsSummary | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [notFound, setNotFound] = useState(false)

    useEffect(() => {

        if (!id) return 

        let isMounted = true
        setIsLoading(true)
        setNotFound(false)

        newsApi.getPublicById(id)
            .then((result) => { if (isMounted) setNews(result.news) })
            .catch(() => { if (isMounted) setNotFound(true) })
            .finally(() => { if (isMounted) setIsLoading(false) })

        return () => { isMounted = false }
    }, [id])

    return { news, isLoading, notFound }

}