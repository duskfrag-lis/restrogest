import type { ReactNode } from 'react'
import { CartContext } from './CartContext'

export function CartProvider({ children }: { children: ReactNode }) {

    //Placecholder: reemplazar por estado real cuando se construya el modulo de carrito

    return <CartContext.Provider value={{ itemCount: 0 }}>{children}</CartContext.Provider>
}