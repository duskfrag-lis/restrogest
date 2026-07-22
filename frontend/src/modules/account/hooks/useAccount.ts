import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../../auth/hooks/useAuth";
import { accountApi } from "../services/accountApi";
import type { ProfileUser } from "../types/account.types";

export function useAccount() {

    const { user: sessionUser } = useAuth()

    const [profile, setProfile] = useState<ProfileUser | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    const refresh = useCallback(async () => {

        setIsLoading(true)

        try {

            const result = await accountApi.getProfile()
            setProfile(result.user)

        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {

        if (sessionUser) {

            refresh()
        } else {

            setProfile(null)
            setIsLoading(false)
        }
    }, [sessionUser, refresh])

    return { profile, isLoading, refresh}
}