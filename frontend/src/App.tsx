import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import { AuthProvider } from "./modules/auth/context/AuthProvider"
import { AuthPage } from "./modules/auth/components/AuthPage"
import { ForgotPasswordPage } from "./modules/auth/components/ForgotPasswordPage"
import { ResetPasswordPage } from "./modules/auth/components/ResetPasswordPage"
import { VerifyEmailPage } from "./modules/auth/components/VerifyEmail/VerifyEmailPage"
import { AuthSuccessPage } from "./modules/auth/components/AuthSuccess/AuthSuccessPage"
import { ActivateAccountPage } from "./modules/auth/components/ActivateAccount/ActivateAccountPage"


function App() {
  return (
    
    <BrowserRouter>
      <AuthProvider>
        <Routes>

          <Route path="/login" element={<AuthPage/>} />
          <Route path="/forgot-password" element={<ForgotPasswordPage/>} />
          <Route path="/reset-password" element={<ResetPasswordPage/>} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route path="/auth/success" element={<AuthSuccessPage />} />
          <Route path="/activate-account" element={<ActivateAccountPage />} />

          <Route path="/" element={<Navigate to="/login" replace />} />

          <Route path="*" element={<Navigate to="/login" replace/>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
