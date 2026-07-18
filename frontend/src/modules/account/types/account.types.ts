import type { AuthRole } from "../../auth/types/auth.types";

export interface ProfileUser {

    id: string
    first_name: string
    last_name: string
    email: string
    phone: string | null
    photo_url: string | null
    provider: 'local' | 'google'
    email_verified: boolean
    is_active: boolean
    created_at: string
    role: AuthRole
}