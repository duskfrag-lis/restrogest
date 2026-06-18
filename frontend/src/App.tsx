import { AuthProvider } from './features/auth/presentation/AuthProvider'
import { AuthExperience } from './features/auth/presentation/AuthExperience'
import './App.css'

function App() {
  return (
    <AuthProvider>
      <AuthExperience />
    </AuthProvider>
  )
}

export default App
