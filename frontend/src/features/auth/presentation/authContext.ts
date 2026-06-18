import { createContext } from 'react'
import type {
  AuthenticatedUser,
  LoginCredentials,
  RegisterData,
  RegisterResult,
  SessionUser,
} from '../domain/auth.types'

export type CurrentUser = AuthenticatedUser | SessionUser

export interface AuthContextValue {
  user: CurrentUser | null
  isBootstrapping: boolean
  login(credentials: LoginCredentials): Promise<void>
  register(data: RegisterData): Promise<RegisterResult>
  logout(): Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)
