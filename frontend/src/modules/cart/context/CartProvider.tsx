import { useEffect, useState, type ReactNode } from 'react'
import { CartContext } from './CartContext'
import type { CartItem } from '../types/cart.types'

const STORAGE_KEY = 'restrogest_cart'

function loadStoredItems(): CartItem[] {

    try {

        const stored = localStorage.getItem(STORAGE_KEY)
        return stored ? JSON.parse(stored) : []

    } catch {

        return []
    }
}

export function CartProvider({ children }: { children: ReactNode }) {

   const [items, setItems] = useState<CartItem[]>(loadStoredItems)

    useEffect(() => {

        localStorage.setItem(STORAGE_KEY, JSON.stringify(items))

    }, [items])

    function addItem(newItem: Omit<CartItem, 'quantity'>, quantity = 1) {

        setItems((prev) => {

            const existing = prev.find((item) => item.menuItemId === newItem.menuItemId)

            if (existing) {

                return prev.map((item) =>
                    item.menuItemId === newItem.menuItemId
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                )
            }

            return [...prev, { ...newItem, quantity }]
        })
    }

    function increment(menuItemId: string) {

        setItems((prev) => prev.map((item) =>
            item.menuItemId === menuItemId ? { ...item, quantity: item.quantity + 1 } : item
        ))
    }

    function decrement(menuItemId: string) {

        setItems((prev) => prev
            .map((item) => item.menuItemId === menuItemId ? { ...item, quantity: item.quantity - 1 } : item)
            .filter((item) => item.quantity > 0)
        )
    }

    function removeItem(menuItemId: string) {

        setItems((prev) => prev.filter((item) => item.menuItemId !== menuItemId))
    }

    function clearCart() {

        setItems([])
    }

    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

    return (

        <CartContext.Provider value={{ items, itemCount, subtotal, addItem, increment, decrement, removeItem, clearCart }}>
            {children}
        </CartContext.Provider>
    )
}