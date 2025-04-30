import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { Theme, defaultTheme, applyTheme, getThemeById } from '../themes';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { useAuth } from '../../auth/hooks/useAuth';

// Create context for theme management
interface ThemeContextType {
  currentTheme: Theme;
  setTheme: (themeId: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  // Initialize with default theme, then override from DB
  const { user } = useAuth();
  const firebaseUserId = user?.id ?? '';
  const settings = useQuery(api.settings.getSettings, { firebaseUserId });
  const persistTheme = useMutation(api.settings.setTheme);
  const [currentTheme, setCurrentTheme] = useState<Theme>(defaultTheme);

  // When DB settings load, apply persisted theme
  useEffect(() => {
    if (settings !== undefined && settings) {
      setCurrentTheme(getThemeById(settings.theme));
    }
  }, [settings]);

  // Set theme when it changes
  useEffect(() => {
    applyTheme(currentTheme);
  }, [currentTheme]);

  // Function to change the theme
  const setTheme = (themeId: string) => {
    const theme = getThemeById(themeId);
    setCurrentTheme(theme);
    if (user) {
      persistTheme({ firebaseUserId: user.id, theme: themeId, updatedAt: Date.now() });
    }
  };

  const value = {
    currentTheme,
    setTheme
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use the theme context
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}; 