import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../modules/auth/hooks/useAuth'

export function PrivateRoute() {

    const { user, isBootstrapping } = useAuth()

    if (isBootstrapping) {

        return null
    }

    if (!user) {

        return <Navigate to="/login" replace />
    }

    return <Outlet />
}