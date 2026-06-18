import type { ApiClient } from '../../../shared/infrastructure/http/ApiClient'
import type { AuthRepository } from '../domain/AuthRepository'
import type {
  AuthResult,
  LoginCredentials,
  LogoutResult,
  RegisterData,
  RegisterResult,
  SessionResult,
} from '../domain/auth.types'

export class HttpAuthRepository implements AuthRepository {
  private readonly apiClient: ApiClient

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient
  }

  login(credentials: LoginCredentials): Promise<AuthResult> {
    return this.apiClient.request<AuthResult>('/auth/login', {
      method: 'POST',
      body: credentials,
    })
  }

  register(data: RegisterData): Promise<RegisterResult> {
    return this.apiClient.request<RegisterResult>('/auth/register', {
      method: 'POST',
      body: data,
    })
  }

  logout(): Promise<LogoutResult> {
    return this.apiClient.request<LogoutResult>('/auth/logout', {
      method: 'POST',
    })
  }

  me(): Promise<SessionResult> {
    return this.apiClient.request<SessionResult>('/auth/me')
  }
}
