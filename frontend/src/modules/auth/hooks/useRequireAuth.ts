import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "./useAuth";
import { saveRedirectPath } from "../../../shared/utils/redirectStorage";

export function useRequireAuth() {

    const { user } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()

    function requireAuth(action: () => void) {

        if (user) {

            action()
            return
        }

        saveRedirectPath(location.pathname)
        navigate(`/login?redirect=${encodeURIComponent(location.pathname)}`)
    }

    return { requireAuth, isAuthenticated: !!user }
}