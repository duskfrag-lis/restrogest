import { ApiClient } from '../../../shared/infrastructure/http/ApiClient'
import { HttpAuthRepository } from '../infrastructure/HttpAuthRepository'
import { AuthSessionService } from './AuthSessionService'

const apiBaseUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api'

export const authSession = new AuthSessionService(
  new HttpAuthRepository(new ApiClient(apiBaseUrl)),
)
