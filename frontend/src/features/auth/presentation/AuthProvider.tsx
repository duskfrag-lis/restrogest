import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { ApiError } from '../../../shared/infrastructure/http/ApiClient'
import { authSession } from '../application/authSession'
import type { LoginCredentials, RegisterData } from '../domain/auth.types'
import { AuthContext, type AuthContextValue, type CurrentUser } from './authContext'

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<CurrentUser | null>(null)
  const [isBootstrapping, setIsBootstrapping] = useState(true)

  useEffect(() => {
    let isMounted = true

    authSession.restoreSession().then((sessionUser) => {
      if (isMounted) {
        setUser(sessionUser)
        setIsBootstrapping(false)
      }
    })

    return () => {
      isMounted = false
    }
  }, [])

  const login = useCallback(async (credentials: LoginCredentials) => {
    const authenticatedUser = await authSession.login(credentials)
    setUser(authenticatedUser)
  }, [])

  const register = useCallback(async (data: RegisterData) => {
    return authSession.register(data)
  }, [])

  const logout = useCallback(async () => {
    try {
      await authSession.logout()
    } catch (error) {
      if (!(error instanceof ApiError && error.status === 401)) {
        throw error
      }
    } finally {
      setUser(null)
    }
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isBootstrapping,
      login,
      register,
      logout,
    }),
    [isBootstrapping, login, logout, register, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
