import { Route } from "react-router-dom"
import { PublicLayout } from "../layouts/PublicLayout/PublicLayout"
import { PrivateRoute } from "../core/guards/PrivateRoute"
import { LandingPage } from "../modules/landing/components/LandingPage"
import { PlaceholderPage } from "../shared/components/PlaceholderPage"
import { AccountPage } from "../modules/account/components/AccountPage"
import { MenuPage } from "../modules/menu/components/MenuPage"
import { ReviewsPage } from "../modules/reviews/components/ReviewsPage"
import { ReservationsPage } from "../modules/reservations/components/ReservationsPage"


export const publicRoutes = (

    <Route element={<PublicLayout />}>

        <Route path="/" element={<LandingPage />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/nosotros" element={<PlaceholderPage title="Nosotros" />} />
        <Route path="/resenas" element={<ReviewsPage />} />
        <Route path="/noticias" element={<PlaceholderPage title="Noticias" />} />
        <Route path="/contacto" element={<PlaceholderPage title="Contacto" />} />
        <Route path="/cart" element={<PlaceholderPage title="Carrito" />} />
        <Route path="/reservations" element={<ReservationsPage/>} />

        <Route element={<PrivateRoute />}>
            <Route path="/account" element={<AccountPage />} />
        </Route>
    </Route>
)