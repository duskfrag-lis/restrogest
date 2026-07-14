import { createContext } from 'react'

import type {
    AuthenticateUser,
    LoginCredentials,
    RegisterData,
    RegisterResult,
    SessionUser,
} from '../types/auth.types'

export type CurrentUser = AuthenticateUser | SessionUser

export interface AuthContextValue {

    user: CurrentUser | null
    isBootstrapping: boolean
    login(credentials: LoginCredentials): Promise<void>
    register(data: RegisterData): Promise<RegisterResult>
    logout(): Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)