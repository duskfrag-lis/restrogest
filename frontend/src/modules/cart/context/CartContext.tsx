import { createContext } from "react";
import type { CartItem } from "../types/cart.types";

export interface CartContextValue {

    items: CartItem[]
    itemCount: number
    subtotal: number
    addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void
    increment: (menuItemId: string) => void
    decrement: (menuItemId: string) => void
    removeItem: (menuItemId: string) => void
    clearCart: () => void
}

export const CartContext = createContext<CartContextValue>({

    items: [],
    itemCount: 0,
    subtotal: 0,
    addItem: () => {},
    increment: () => {},
    decrement: () => {},
    removeItem: () => {},
    clearCart: () => {},
})