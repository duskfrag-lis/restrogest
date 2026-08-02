export interface MenuCategory {

    id: string
    name: string
    description: string | null
    sort_order: number
    is_active: boolean
}

export interface MenuItem {

    id: string
    category_id: string
    name: string
    description: string | null
    price: number
    image_url: string | null
    is_active: boolean
    created_at: string
    updated_at: string
}