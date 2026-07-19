import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { ApiError } from '../../../shared/http/ApiClient'
import { authApi } from '../services/authApi'
import type { LoginCredentials, RegisterData } from '../types/auth.types'
import { AuthContext, type AuthContextValue, type SessionIdentity } from './AuthContext'

interface AuthProviderProps {

    children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {

    const [user, setUser] = useState<SessionIdentity | null>(null)
    const [isBootstrapping, setIsBootstrapping] = useState(true)

    const checkSession = useCallback(async () => {

        try {

            const result = await authApi.me()
            setUser({ id: result.user.id, email: result.user.email, role: result.user.role })

        } catch {

            setUser(null)
        }
    }, [])

    useEffect(() => {

        checkSession().finally(() => setIsBootstrapping(false))

    }, [checkSession])

    const login = useCallback(async (credentials: LoginCredentials) => {

        const result = await authApi.login(credentials)
        setUser({ id: result.user.id, email: result.user.email, role: result.user.role })
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
        () => ({ user, isBootstrapping, login, register, logout, checkSession}),
        [checkSession, isBootstrapping, login, logout, register, user],
    )

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
