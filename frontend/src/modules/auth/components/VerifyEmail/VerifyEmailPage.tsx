import { useEffect, useState } from "react";
import { Link, useSearchParams } from 'react-router-dom'
import { authApi } from "../../services/authApi";
import { ApiError } from "../../../../shared/http/ApiClient";
import { AuthCard } from "../shared/AuthCard";
import { LockKeyIcon } from "@phosphor-icons/react";
import { Icon } from "../../../../shared/icons/Icon";
import styles from './VerifyEmailPage.module.css'

type VerificationState= 'loading' | 'success' | 'error'

export function VerifyEmailPage() {

    const [SearchParams] = useSearchParams()
    const token = SearchParams.get('token') ?? ''

    const [state, setState] = useState<VerificationState>('loading')
    const [message, setMessage] = useState('')

    useEffect(() => {

        if (!token) {

            setState('error')
            setMessage('El enlace no es válido o está incompleto')
            return 
        }

        authApi.verifyEmail(token)
            .then((result) => {

                setState('success')
                setMessage(result.message)
            })
            .catch((err) => {

                setState('error')
                setMessage(err instanceof ApiError ? err.message : 'El enlace es inválido o ha expirado')
            })
    }, [token])

    return (

        <AuthCard>
            <div className={styles.content}>
                <Icon icon={LockKeyIcon} className={styles.icon} weight="bold" />

                {state === 'loading' && <p className={styles.text}>Verificando tu correo...</p>}

                {state === 'success' && (
                    <>
                        <h1 className={styles.title}>Correo verificado</h1>
                        <p className={styles.text}>{message}</p>
                        <Link to="/login" className={styles.action}>Iniciar sesión</Link>
                    </>
                )}

                {state === 'error' && (
                    <>
                        <h1 className={styles.title}>No pudimos verificar tu correo</h1>
                        <p className={styles.text}>{message}</p>
                        <Link to="/login" className={styles.action}>Volver a inicio de sesión</Link>
                    </>
                )}
            </div>
        </AuthCard>
    )
}