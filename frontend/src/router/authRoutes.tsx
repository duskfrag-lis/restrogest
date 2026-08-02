import { Route } from 'react-router-dom'
import { AuthPage } from '../modules/auth/components/AuthPage'
import { ForgotPasswordPage } from '../modules/auth/components/ForgotPasswordPage'
import { ResetPasswordPage } from '../modules/auth/components/ResetPasswordPage'
import { VerifyEmailPage } from '../modules/auth/components/VerifyEmail/VerifyEmailPage'
import { AuthSuccessPage } from '../modules/auth/components/AuthSuccess/AuthSuccessPage'
import { ActivateAccountPage } from '../modules/auth/components/ActivateAccount/ActivateAccountPage'
import { GuestRouter } from '../core/guards/GuestRouter'

export const authRoutes = (

    <>
    
        <Route element={<GuestRouter /> }>
            <Route path="/login" element={<AuthPage />} />
        </Route>
        
        <Route path="/login" element={<AuthPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/auth/success" element={<AuthSuccessPage />} />
        <Route path="/activate-account" element={<ActivateAccountPage />} />
        
    </>
)