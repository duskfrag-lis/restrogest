import { Navigate, Route, Routes } from "react-router-dom"
import { authRoutes } from "./authRoutes"
import { publicRoutes } from "./publicRoutes"
import { backofficeRoutes } from "./backofficeRoutes"

export function AppRouter() {

    return (

        <Routes>

            {authRoutes}
            {publicRoutes}
            {backofficeRoutes}

            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    )
}