import { createContext } from 'react'

import type {
    AuthRole,
    LoginCredentials,
    RegisterData,
    RegisterResult,
} from '../types/auth.types'

export interface SessionIdentity {

    id: string
    email: string
    role: AuthRole
}
export interface AuthContextValue {

    user: SessionIdentity | null
    isBootstrapping: boolean
    login(credentials: LoginCredentials): Promise<void>
    register(data: RegisterData): Promise<RegisterResult>
    logout(): Promise<void>
    checkSession(): Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)