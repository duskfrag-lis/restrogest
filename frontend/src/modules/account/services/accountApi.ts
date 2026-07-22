import { apiClient } from "../../../shared/http/ApiClient";
import type { ProfileUser } from "../types/account.types";

export interface UpdateProfilePayload {

    first_name?: string
    last_name?: string
    phone?: string
    image?: File
}

export interface ChangePasswordPayload {

    currentPassword: string
    newPassword: string
}

export const accountApi = {

    getProfile(): Promise<{ user: ProfileUser }> {

        return apiClient.request('/profile')
    },

    updateProfile(payload: UpdateProfilePayload): Promise<{ user: ProfileUser }> {

        const formData = new FormData()

        if (payload.first_name !== undefined) formData.append('first_name', payload.first_name)
        if (payload.last_name !== undefined) formData.append('last_name', payload.last_name)
        if (payload.phone !== undefined) formData.append('phone', payload.phone)
        if (payload.image) formData.append('image', payload.image)

        return apiClient.request('/profile', { method: 'PUT', body: formData, isFormData: true })

    },

    changePassword(payload: ChangePasswordPayload): Promise<{ message: string }> {

        return apiClient.request('/profile/change-password', { method: 'PATCH', body: payload })
    },

    deleteAccount(): Promise<{ message: string }> {

        return apiClient.request('/profile', { method: 'DELETE' })
    },
}