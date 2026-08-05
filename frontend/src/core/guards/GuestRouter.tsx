import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../modules/auth/hooks/useAuth'
import { getAndClearRedirectPath } from '../../shared/utils/redirectStorage'
import { useRef } from 'react'

export function GuestRouter() {

    const { user, isBootstrapping } = useAuth()
    const redirectTargetRef = useRef<string | null>(null)

    if (redirectTargetRef.current === null) {

        redirectTargetRef.current = getAndClearRedirectPath('/')
    }

    if (isBootstrapping) {

        return null
    }

    if (user) {

        return <Navigate to={redirectTargetRef.current} replace />
    }

    return <Outlet />
}