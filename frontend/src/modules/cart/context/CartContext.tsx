import { createContext } from "react";

export interface CartContextValue {

    itemCount: number
}

export const CartContext = createContext<CartContextValue>({ itemCount: 0 })