import { apiClient } from '../../../shared/http/ApiClient'

import type {
    AuthResult,
    LoginCredentials,
    LogoutResult,
    RegisterData,
    RegisterResult,
    SessionResult,
} from '../types/auth.types'

export const authApi = {

    login(credentials: LoginCredentials): Promise<AuthResult> {

        return apiClient.request<AuthResult>('/auth/login', { method: 'POST', body: credentials })
    },

    register(data: RegisterData): Promise<RegisterResult> {

        return apiClient.request<RegisterResult>('/auth/register', { method: 'POST', body: data })
    },

    logout(): Promise<LogoutResult> {

        return apiClient.request<LogoutResult>('/auth/logout', { method: 'POST' })
    },

    me(): Promise<SessionResult> {

        return apiClient.request<SessionResult>('/auth/me')
    },

    verifyEmail(token: string): Promise<{ message: string }> {

        return apiClient.request('/auth/verify-email', { method: 'POST', body: { token }})
    },

    resendVerification(email: string): Promise<{ message: string }> {

        return apiClient.request('/auth/resend-verification', { method: 'POST', body: { email }, })
    },

    forgotPassword(email: string): Promise<{ message: string }> {

        return apiClient.request('/auth/forgot-password', { method: 'POST', body: { email }})
    },

    resetPassword(token: string, password: string): Promise<{ message: string }> {

        return apiClient.request('/auth/reset-password', { method: 'POST', body: { token, password }})
    },
}