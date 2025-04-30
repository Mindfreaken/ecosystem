import { useState, useEffect } from 'react'
import { useAuth } from './features/auth/hooks/useAuth'
import { HomeView } from './features/landing'
import { useTheme } from './features/theme'
import { ShellHomeView } from './features/shell'
import { useInitializeSocialSystem } from './features/profile/services/initializeSocialSystem'
import './App.css'
import './features/auth/styles/Auth.css'
import './features/landing/styles/Home.css'
import './features/shell/styles/Shell.css'
import './features/shell/styles/mobile/Shell.css'

function App() {
  const [isInitializing, setIsInitializing] = useState(true)
  const [bypassAuth, setBypassAuth] = useState(false)
  const auth = useAuth()
  const { currentTheme } = useTheme()
  const { initializeSocialSystem } = useInitializeSocialSystem()
  
  // Extract colors from the current theme
  const colors = currentTheme.colors

  // Check for initial auth state
  useEffect(() => {
    // Check stored auth data on component mount
    const initAuth = async () => {
      try {
        // We already have auth initialization in our useAuth hook
        // Just wait a moment to simulate the initialization process
        await new Promise(resolve => setTimeout(resolve, 500))
        
        // Initialize the social score system
        await initializeSocialSystem()
        
        setIsInitializing(false)
      } catch (error) {
        console.error('Error initializing app:', error)
        setIsInitializing(false)
      }
    }

    initAuth()
  }, [])

  if (isInitializing) {
    return (
      <div className="app-loading flex flex-col justify-center items-center h-screen w-screen">
        <div className="spinner w-10 h-10 mb-4 border-4 border-gray-200 border-l-blue-500 rounded-full animate-spin"></div>
        <p style={{ color: colors.textSecondary }}>Loading application...</p>
      </div>
    )
  }

  // If bypassAuth is true or user is authenticated, show the shell
  if (bypassAuth || auth.isAuthenticated) {
    return <ShellHomeView />
  }

  // Otherwise show the landing page with skip option
  return <HomeView onSkipSignIn={() => setBypassAuth(true)} />
}

export default App
