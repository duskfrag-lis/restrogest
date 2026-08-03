import { useEffect, useState } from 'react'
import { menuApi } from '../services/menuApi'
import type { MenuCategory, MenuItem } from '../types/menu.types'

export function useMenu() {

    const [categories, setCategories] = useState<MenuCategory[]>([])
    const [items, setItems] = useState<MenuItem[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {

        let isMounted = true

        Promise.all([menuApi.getCategories(true), menuApi.getItems(true)])
            .then(([categoriesResult, itemsResult]) => {

                if (!isMounted) return 

                setCategories(categoriesResult?.categories ?? [])
                setItems(itemsResult?.items ?? [])
            })
            .catch(() => {

                if (isMounted) {

                    setCategories([])
                    setItems([])
                }
            })
            .finally(() => { if (isMounted) setIsLoading(false) })
            
        return () => { isMounted = false }

    }, [])

    return { categories, items, isLoading }
}