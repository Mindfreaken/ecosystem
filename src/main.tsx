import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ConvexProvider } from 'convex/react'
import { convex } from './convex'
import { ThemeProvider } from './features/theme'
import { AuthProvider } from './features/auth/hooks/useAuth'
import './features/theme/themes/theme.css'
import './index.css'
import App from './App.tsx'
import '@fortawesome/fontawesome-free/css/all.min.css'
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConvexProvider client={convex}>
      <AuthProvider>
        <ThemeProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </ThemeProvider>
      </AuthProvider>
    </ConvexProvider>
  </StrictMode>,
)
