import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { AuthCard } from "../shared/AuthCard";
import styles from './AuthSuccessPage.module.css'

export function AuthSuccessPage() {

    const { checkSession } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {

        checkSession().then(() => navigate('/', { replace: true }))
    }, [checkSession, navigate])

    return (

        <AuthCard>
            <p className={styles.text}>Iniciando sesión...</p>
        </AuthCard>
    )
}