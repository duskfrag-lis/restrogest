import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../modules/auth/hooks/useAuth'
import { saveRedirectPath } from '../../shared/utils/redirectStorage'

export function PrivateRoute() {

    const { user, isBootstrapping } = useAuth()
    const location = useLocation()

    if (isBootstrapping) {

        return null
    }

    if (!user) {

        saveRedirectPath(location.pathname)
        return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />
    }

    return <Outlet />
}