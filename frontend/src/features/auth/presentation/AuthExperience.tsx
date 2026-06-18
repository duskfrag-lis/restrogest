import { ArrowRight, CheckCircle2, Eye, EyeOff, LogOut, Moon, ShieldCheck, Sun } from 'lucide-react'
import { type ChangeEvent, type FormEvent, useMemo, useState } from 'react'
import { ApiError } from '../../../shared/infrastructure/http/ApiClient'
import type { RegisterData } from '../domain/auth.types'
import { useAuth } from './useAuth'

type AuthMode = 'login' | 'register'
type ThemeMode = 'light' | 'dark'

interface LoginFormState {
  email: string
  password: string
}

const emptyRegisterForm: RegisterData = {
  first_name: '',
  last_name: '',
  phone: '',
  email: '',
  password: '',
}

const initialTheme = (): ThemeMode => {
  const storedTheme = window.localStorage.getItem('restrogest-theme')

  if (storedTheme === 'dark' || storedTheme === 'light') {
    return storedTheme
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function AuthExperience() {
  const auth = useAuth()
  const [theme, setTheme] = useState<ThemeMode>(() => initialTheme())
  const [mode, setMode] = useState<AuthMode>('login')
  const [loginForm, setLoginForm] = useState<LoginFormState>({ email: '', password: '' })
  const [registerForm, setRegisterForm] = useState<RegisterData>(emptyRegisterForm)
  const [showLoginPassword, setShowLoginPassword] = useState(false)
  const [showRegisterPassword, setShowRegisterPassword] = useState(false)
  const [feedback, setFeedback] = useState<string>('')
  const [successMessage, setSuccessMessage] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const userLabel = useMemo(() => {
    if (!auth.user) {
      return ''
    }

    if ('first_name' in auth.user && auth.user.first_name) {
      return `${auth.user.first_name} ${auth.user.last_name ?? ''}`.trim()
    }

    return auth.user.email
  }, [auth.user])

  function toggleTheme() {
    const nextTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(nextTheme)
    window.localStorage.setItem('restrogest-theme', nextTheme)
  }

  function selectMode(nextMode: AuthMode) {
    setMode(nextMode)
    setFeedback('')
    setSuccessMessage('')
  }

  function updateLoginForm(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target
    setLoginForm((current) => ({ ...current, [name]: value }))
  }

  function updateRegisterForm(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target
    setRegisterForm((current) => ({ ...current, [name]: value }))
  }

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFeedback('')
    setSuccessMessage('')
    setIsSubmitting(true)

    try {
      await auth.login({
        email: loginForm.email.trim(),
        password: loginForm.password,
      })
    } catch (error) {
      setFeedback(resolveErrorMessage(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFeedback('')
    setSuccessMessage('')

    if (registerForm.password.length < 8) {
      setFeedback('La contraseña debe tener al menos 8 caracteres')
      return
    }

    setIsSubmitting(true)

    try {
      const result = await auth.register({
        ...registerForm,
        first_name: registerForm.first_name.trim(),
        last_name: registerForm.last_name.trim(),
        phone: registerForm.phone?.trim() || undefined,
        email: registerForm.email.trim(),
      })

      setSuccessMessage(result.message)
      setMode('login')
      setLoginForm({ email: registerForm.email.trim(), password: '' })
      setRegisterForm(emptyRegisterForm)
    } catch (error) {
      setFeedback(resolveErrorMessage(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleLogout() {
    setFeedback('')
    setIsSubmitting(true)

    try {
      await auth.logout()
      setLoginForm({ email: '', password: '' })
    } catch (error) {
      setFeedback(resolveErrorMessage(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="auth-page" data-theme={theme}>
      <section className="auth-visual" aria-label="RestroGest autenticacion">
        <div className="brand-lockup">
          <span className="brand-mark">R</span>
          <div>
            <p className="eyebrow">RestroGest</p>
            <h1>Acceso seguro para tu restaurante</h1>
          </div>
        </div>

        <div className="visual-panel" aria-hidden="true">
          <div className="service-grid">
            <span>Mesa 04</span>
            <strong>En preparacion</strong>
            <span>Pedido</span>
            <strong>#RG-218</strong>
            <span>Equipo</span>
            <strong>Activo</strong>
          </div>
          <div className="status-strip">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>

        <ul className="trust-list" aria-label="Beneficios de seguridad">
          <li>
            <ShieldCheck size={20} aria-hidden="true" />
            Sesion protegida con cookie HttpOnly
          </li>
          <li>
            <CheckCircle2 size={20} aria-hidden="true" />
            Roles listos para cliente, equipo y administracion
          </li>
        </ul>
      </section>

      <section className="auth-workspace" aria-label="Formulario de autenticacion">
        <button className="theme-toggle" type="button" onClick={toggleTheme}>
          {theme === 'light' ? <Moon size={18} aria-hidden="true" /> : <Sun size={18} aria-hidden="true" />}
          <span>{theme === 'light' ? 'Modo oscuro' : 'Modo claro'}</span>
        </button>

        <div className="auth-card">
          {auth.isBootstrapping ? (
            <div className="loading-state" role="status">
              <span className="loader"></span>
              Validando sesion
            </div>
          ) : auth.user ? (
            <AuthenticatedPanel
              email={auth.user.email}
              isSubmitting={isSubmitting}
              role={auth.user.role}
              userLabel={userLabel}
              onLogout={handleLogout}
            />
          ) : (
            <>
              <div className="auth-card-header">
                <p className="eyebrow">Bienvenido</p>
                <h2>{mode === 'login' ? 'Inicia sesion' : 'Crea tu cuenta'}</h2>
                <p>
                  {mode === 'login'
                    ? 'Entra con tus credenciales para continuar con la gestion del restaurante.'
                    : 'Registra un usuario cliente y deja la cuenta lista para iniciar sesion.'}
                </p>
              </div>

              <div className="mode-switch" role="tablist" aria-label="Modo de autenticacion">
                <button
                  aria-selected={mode === 'login'}
                  className={mode === 'login' ? 'active' : ''}
                  role="tab"
                  type="button"
                  onClick={() => selectMode('login')}
                >
                  Iniciar sesion
                </button>
                <button
                  aria-selected={mode === 'register'}
                  className={mode === 'register' ? 'active' : ''}
                  role="tab"
                  type="button"
                  onClick={() => selectMode('register')}
                >
                  Registrarse
                </button>
              </div>

              {successMessage ? <p className="alert success">{successMessage}</p> : null}
              {feedback ? <p className="alert error">{feedback}</p> : null}

              {mode === 'login' ? (
                <LoginForm
                  form={loginForm}
                  isSubmitting={isSubmitting}
                  showPassword={showLoginPassword}
                  onChange={updateLoginForm}
                  onSubmit={handleLogin}
                  onTogglePassword={() => setShowLoginPassword((current) => !current)}
                />
              ) : (
                <RegisterForm
                  form={registerForm}
                  isSubmitting={isSubmitting}
                  showPassword={showRegisterPassword}
                  onChange={updateRegisterForm}
                  onSubmit={handleRegister}
                  onTogglePassword={() => setShowRegisterPassword((current) => !current)}
                />
              )}
            </>
          )}
        </div>
      </section>
    </main>
  )
}

interface LoginFormProps {
  form: LoginFormState
  isSubmitting: boolean
  showPassword: boolean
  onChange(event: ChangeEvent<HTMLInputElement>): void
  onSubmit(event: FormEvent<HTMLFormElement>): void
  onTogglePassword(): void
}

function LoginForm({
  form,
  isSubmitting,
  showPassword,
  onChange,
  onSubmit,
  onTogglePassword,
}: LoginFormProps) {
  return (
    <form className="auth-form" onSubmit={onSubmit}>
      <label>
        Correo electronico
        <input
          autoComplete="email"
          name="email"
          placeholder="correo@restrogest.com"
          required
          type="email"
          value={form.email}
          onChange={onChange}
        />
      </label>

      <PasswordField
        autoComplete="current-password"
        label="Contraseña"
        name="password"
        showPassword={showPassword}
        value={form.password}
        onChange={onChange}
        onTogglePassword={onTogglePassword}
      />

      <button className="primary-action" disabled={isSubmitting} type="submit">
        {isSubmitting ? 'Entrando...' : 'Entrar'}
        <ArrowRight size={18} aria-hidden="true" />
      </button>
    </form>
  )
}

interface RegisterFormProps {
  form: RegisterData
  isSubmitting: boolean
  showPassword: boolean
  onChange(event: ChangeEvent<HTMLInputElement>): void
  onSubmit(event: FormEvent<HTMLFormElement>): void
  onTogglePassword(): void
}

function RegisterForm({
  form,
  isSubmitting,
  showPassword,
  onChange,
  onSubmit,
  onTogglePassword,
}: RegisterFormProps) {
  return (
    <form className="auth-form" onSubmit={onSubmit}>
      <div className="field-grid">
        <label>
          Nombre
          <input
            autoComplete="given-name"
            name="first_name"
            placeholder="Laura"
            required
            type="text"
            value={form.first_name}
            onChange={onChange}
          />
        </label>
        <label>
          Apellido
          <input
            autoComplete="family-name"
            name="last_name"
            placeholder="Gomez"
            required
            type="text"
            value={form.last_name}
            onChange={onChange}
          />
        </label>
      </div>

      <label>
        Telefono
        <input
          autoComplete="tel"
          name="phone"
          placeholder="300 000 0000"
          type="tel"
          value={form.phone}
          onChange={onChange}
        />
      </label>

      <label>
        Correo electronico
        <input
          autoComplete="email"
          name="email"
          placeholder="cliente@correo.com"
          required
          type="email"
          value={form.email}
          onChange={onChange}
        />
      </label>

      <PasswordField
        autoComplete="new-password"
        helpText="Minimo 8 caracteres"
        label="Contraseña"
        name="password"
        showPassword={showPassword}
        value={form.password}
        onChange={onChange}
        onTogglePassword={onTogglePassword}
      />

      <button className="primary-action" disabled={isSubmitting} type="submit">
        {isSubmitting ? 'Creando cuenta...' : 'Crear cuenta'}
        <ArrowRight size={18} aria-hidden="true" />
      </button>
    </form>
  )
}

interface PasswordFieldProps {
  autoComplete: string
  label: string
  name: string
  showPassword: boolean
  value: string
  helpText?: string
  onChange(event: ChangeEvent<HTMLInputElement>): void
  onTogglePassword(): void
}

function PasswordField({
  autoComplete,
  helpText,
  label,
  name,
  showPassword,
  value,
  onChange,
  onTogglePassword,
}: PasswordFieldProps) {
  return (
    <label>
      <span className="label-row">
        {label}
        {helpText ? <small>{helpText}</small> : null}
      </span>
      <span className="password-control">
        <input
          autoComplete={autoComplete}
          minLength={8}
          name={name}
          placeholder="Tu contraseña"
          required
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={onChange}
        />
        <button
          aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          className="icon-button"
          type="button"
          onClick={onTogglePassword}
        >
          {showPassword ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
        </button>
      </span>
    </label>
  )
}

interface AuthenticatedPanelProps {
  email: string
  isSubmitting: boolean
  role: string
  userLabel: string
  onLogout(): void
}

function AuthenticatedPanel({ email, isSubmitting, role, userLabel, onLogout }: AuthenticatedPanelProps) {
  return (
    <div className="session-panel">
      <span className="session-icon">
        <ShieldCheck size={26} aria-hidden="true" />
      </span>
      <p className="eyebrow">Sesion activa</p>
      <h2>{userLabel}</h2>
      <p>{email}</p>
      <dl>
        <div>
          <dt>Rol</dt>
          <dd>{role}</dd>
        </div>
        <div>
          <dt>Estado</dt>
          <dd>Autenticado</dd>
        </div>
      </dl>
      <button className="secondary-action" disabled={isSubmitting} type="button" onClick={onLogout}>
        <LogOut size={18} aria-hidden="true" />
        {isSubmitting ? 'Cerrando...' : 'Cerrar sesion'}
      </button>
    </div>
  )
}

function resolveErrorMessage(error: unknown) {
  if (error instanceof ApiError) {
    return error.message
  }

  return 'Ocurrio un error inesperado. Intenta nuevamente.'
}
