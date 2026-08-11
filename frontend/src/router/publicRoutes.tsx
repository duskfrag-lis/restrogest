import { Route } from "react-router-dom"
import { PublicLayout } from "../layouts/PublicLayout/PublicLayout"
import { PrivateRoute } from "../core/guards/PrivateRoute"
import { LandingPage } from "../modules/landing/components/LandingPage"
import { PlaceholderPage } from "../shared/components/PlaceholderPage"
import { AccountPage } from "../modules/account/components/AccountPage"
import { MenuPage } from "../modules/menu/components/MenuPage"
import { ReviewsPage } from "../modules/reviews/components/ReviewsPage"
import { ReservationsPage } from "../modules/reservations/components/ReservationsPage"
import { MyDeliveriesPage } from "../modules/delivery/components/MyDeliveriesPage"
import { MyReservationsPage } from "../modules/reservations/components/MyReservationsPage/MyReservationsPage"
import { NewsPage } from "../modules/news/components/NewsPage"
import { NewsDetailPage } from "../modules/news/components/NewsDetailPage/NewsDetailPage"
import { ContactPage } from "../modules/restaurant-info/components/ContactPage/ContactPage"


export const publicRoutes = (

    <Route element={<PublicLayout />}>

        <Route path="/" element={<LandingPage />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/nosotros" element={<PlaceholderPage title="Nosotros" />} />
        <Route path="/resenas" element={<ReviewsPage />} />
        <Route path="/noticias" element={<NewsPage />} />
        <Route path="/noticias/:id" element={<NewsDetailPage /> } />
        <Route path="/contacto" element={<ContactPage />} />
        <Route path="/cart" element={<PlaceholderPage title="Carrito" />} />
        <Route path="/reservations" element={<ReservationsPage/>} />

        <Route element={<PrivateRoute />}>
            <Route path="/account" element={<AccountPage />} />
            <Route path="/account/orders" element={<MyDeliveriesPage />} />
            <Route path="/account/reservations" element={<MyReservationsPage />} />
        </Route>
    </Route>
)