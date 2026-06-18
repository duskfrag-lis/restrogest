export type AuthRole =
  | 'cliente'
  | 'mesero'
  | 'cocinero'
  | 'jefe_cocina'
  | 'domiciliario'
  | 'administrador'

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  first_name: string
  last_name: string
  phone?: string
  email: string
  password: string
}

export interface AuthenticatedUser {
  id: string
  first_name?: string
  last_name?: string
  email: string
  role: AuthRole
  is_active?: boolean
  email_verified?: boolean
  provider?: 'local' | 'google'
}

export interface SessionUser {
  id: string
  email: string
  role: AuthRole
  iat?: number
  exp?: number
}

export interface AuthResult {
  message: string
  user: AuthenticatedUser
}

export interface RegisterResult {
  message: string
  user: Pick<AuthenticatedUser, 'id' | 'first_name' | 'last_name' | 'email'>
}

export interface SessionResult {
  user: SessionUser
}

export interface LogoutResult {
  message: string
}
