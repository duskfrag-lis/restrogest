import type {
  AuthResult,
  LoginCredentials,
  LogoutResult,
  RegisterData,
  RegisterResult,
  SessionResult,
} from './auth.types'

export interface AuthRepository {
  login(credentials: LoginCredentials): Promise<AuthResult>
  register(data: RegisterData): Promise<RegisterResult>
  logout(): Promise<LogoutResult>
  me(): Promise<SessionResult>
}
