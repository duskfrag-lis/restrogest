import { useMemo, useState } from 'react'
import type { MenuItem } from '../types/menu.types'

export const ALL_CATEGORIES = 'all'

export function useMenuFilters(items: MenuItem[]) {

    const [activeCategoryId, setActiveCategoryId] = useState<string>(ALL_CATEGORIES)

    const filteredItems = useMemo(() => {

        if (activeCategoryId === ALL_CATEGORIES) return items

        return items.filter((item) => item.category_id === activeCategoryId)

    }, [items, activeCategoryId])

    return { activeCategoryId, setActiveCategoryId, filteredItems }
}