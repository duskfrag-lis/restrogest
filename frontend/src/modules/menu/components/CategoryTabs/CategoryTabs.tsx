import type { MenuCategory } from '../../types/menu.types'
import { ALL_CATEGORIES } from '../../hooks/useMenuFilters'
import styles from './CategoryTabs.module.css'

interface CategoryTabsProps {

    categories: MenuCategory[]
    activeCategoryId: string
    onSelect: (categoryId: string) => void
}

export function CategoryTabs({ categories, activeCategoryId, onSelect }: CategoryTabsProps) {

    return (

        <div className={styles.tabs}>

            <button
                type="button"
                className={activeCategoryId === ALL_CATEGORIES ? styles.tabActive : styles.tab}
                onClick={() => onSelect(ALL_CATEGORIES)}
            >
                Todos
            </button>

            {categories.map((category) => (
                
                <button
                    key={category.id}
                    type="button"
                    className={activeCategoryId === category.id ? styles.tabActive : styles.tab}
                    onClick={() => onSelect(category.id)}
                >
                    {category.name}
                </button>
            ))}

        </div>
    )
}