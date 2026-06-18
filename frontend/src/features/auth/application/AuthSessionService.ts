import type { AuthRepository } from '../domain/AuthRepository'
import type {
  AuthenticatedUser,
  LoginCredentials,
  RegisterData,
  RegisterResult,
  SessionUser,
} from '../domain/auth.types'

export class AuthSessionService {
  private readonly repository: AuthRepository

  constructor(repository: AuthRepository) {
    this.repository = repository
  }

  async login(credentials: LoginCredentials): Promise<AuthenticatedUser> {
    const result = await this.repository.login(credentials)
    return result.user
  }

  async register(data: RegisterData): Promise<RegisterResult> {
    return this.repository.register(data)
  }

  async logout(): Promise<void> {
    await this.repository.logout()
  }

  async restoreSession(): Promise<SessionUser | null> {
    try {
      const result = await this.repository.me()
      return result.user
    } catch {
      return null
    }
  }
}
