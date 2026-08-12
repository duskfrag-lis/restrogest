import { BrowserRouter } from "react-router-dom"
import { AuthProvider } from "./modules/auth/context/AuthProvider"
import { AppRouter } from "./router/AppRouter"
import { CartProvider } from "./modules/cart/context/CartProvider"


function App() {
  return (
    
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <AppRouter />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
