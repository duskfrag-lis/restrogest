import { useEffect, useState } from 'react'
import { menuApi } from '../../menu/services/menuApi'
import type { MenuItem } from '../../menu/types/menu.types'

export interface FeaturedMenuItem extends MenuItem {

    categoryName: string
}

const FEATURED_LIMIT = 10

export function useFeaturedMenu() {

    const [items, setItems] = useState<FeaturedMenuItem[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {

        let isMounted = true

        Promise.all([menuApi.getItems(true), menuApi.getCategories(true)])
            .then(([itemsResult, categoriesResult]) => {

                if (!isMounted) return

                const categoryMap = new Map(

                    categoriesResult.categories.map((category) => [category.id, category.name])
                )

                const sorted = [...itemsResult.items].sort(

                    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
                )

                const featured = sorted.slice(0, FEATURED_LIMIT).map((item) => ({
                    ...item,
                    categoryName: categoryMap.get(item.category_id) ?? '',
                }))

                setItems(featured)
            })

            .catch(() => { if (isMounted) setItems([]) })
            .finally(() => { if (isMounted) setIsLoading(false) })

        return () => { isMounted = false }

    }, [])

    return { items, isLoading }
}