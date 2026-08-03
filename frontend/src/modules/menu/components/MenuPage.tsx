import { useMenu } from "../hooks/useMenu"
import { useMenuFilters, ALL_CATEGORIES } from "../hooks/useMenuFilters"
import { CategoryTabs } from "./CategoryTabs/CategoryTabs"
import { MenuItemCard } from "./MenuItemCard/MenuItemCard"
import { EmptySection } from "../../../shared/components/EmptySection"
import styles from './MenuPage.module.css'

export function MenuPage() {

    const { categories, items, isLoading } = useMenu()
    const { activeCategoryId, setActiveCategoryId, filteredItems } = useMenuFilters(items)

    if (isLoading) {

        return <div className={styles.loading}>Cargando menú...</div>
    }

    const hasNothingConfigured = categories.length === 0 && items.length === 0

    return (

        <div className={styles.page}>

            <div className={styles.header}>

                <h1 className={styles.title}>Nuestro menú</h1>
                <p className={styles.subtitle}>Explora nuestros platos, ¡Pide cuando quieras!</p>
            </div>

            {hasNothingConfigured ? (

                <EmptySection message="Aún no hay un menú configurado. Vuelve pronto." />

            ) : (

                <>

                    <CategoryTabs
                        categories={categories}
                        activeCategoryId={activeCategoryId}
                        onSelect={setActiveCategoryId}
                    />

                    {filteredItems.length === 0 ? (

                        <EmptySection
                            message={
                                activeCategoryId === ALL_CATEGORIES
                                ? 'Aún no hay platos disponibles en el menú.'
                                : 'Esta categoría no tiene platos disponibles por ahora.'
                            }
                        />

                    ) : (

                        <div className={styles.grid}>

                            {filteredItems.map((item) => (

                                <MenuItemCard key={item.id} item={item} />
                            ))}
                        </div>
                    )}

                </>
            )}

        </div>
    )

}