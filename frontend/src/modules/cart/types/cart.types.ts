export interface CartItem {

    menuItemId: string
    name: string
    price: number
    quantity: number
    imageUrl: string | null
    notes?: string
}