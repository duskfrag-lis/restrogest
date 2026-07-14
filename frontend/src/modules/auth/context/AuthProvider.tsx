import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { ApiError } from '../../../shared/http/ApiClient'
import { authApi } from '../services/authApi'
import type { LoginCredentials, RegisterData } from '../types/auth.types'
import { AuthContext, type AuthContextValue, type CurrentUser } from './AuthContext'

interface AuthProviderProps {

    children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {

    const [user, setUser] = useState<CurrentUser | null>(null)
    const [isBootstrapping, setIsBootstrapping] = useState(true)

    useEffect(() => {

        let isMounted = true
        authApi.me()
            .then((result) => { if (isMounted) setUser(result.user) })
            .catch(() => { if (isMounted) setUser(null) })
            .finally(() => { if (isMounted) setIsBootstrapping(false) })
        return () => { isMounted = false}
    }, [])

    const login = useCallback(async (credentials: LoginCredentials) => {

        const result = await authApi.login(credentials)
        setUser(result.user)
    }, [])

    const register = useCallback(async (data: RegisterData) => {

        return authApi.register(data)
    }, [])

    const logout = useCallback(async () => {

        try {

            await authApi.logout()

        } catch (error) {

            if (!(error instanceof ApiError && error.status === 401)) throw error

        } finally {
            setUser(null)
        }
    }, [])

    const value = useMemo<AuthContextValue>(
        () => ({ user, isBootstrapping, login, register, logout }),
        [isBootstrapping, login, logout, register, user],
    )

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
