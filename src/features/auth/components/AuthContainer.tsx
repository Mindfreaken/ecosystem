import { useState } from 'react';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import { useTheme } from '../../../features/theme';

type AuthMode = 'signin' | 'signup';

interface AuthContainerProps {
  initialMode?: AuthMode;
  onAuthSuccess?: () => void;
}

export const AuthContainer = ({ 
  initialMode = 'signin',
  onAuthSuccess
}: AuthContainerProps) => {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const { currentTheme } = useTheme();
  const colors = currentTheme.colors;

  const handleSwitchMode = (newMode: AuthMode) => {
    setMode(newMode);
  };

  return (
    <div
      className="rounded-lg shadow-lg p-8 max-w-md mx-auto"
      style={{ 
        backgroundColor: colors.card,
        boxShadow: `0 4px 6px ${colors.shadow}`
      }}
    >
      <h2 
        className="text-2xl font-bold text-center mb-6"
        style={{ color: colors.textPrimary }}
      >
        {mode === 'signin' ? 'Sign In' : 'Create an Account'}
      </h2>

      {mode === 'signin' ? (
        <LoginForm 
          onSwitchMode={handleSwitchMode} 
          onLoginSuccess={onAuthSuccess} 
        />
      ) : (
        <RegisterForm 
          onSwitchMode={handleSwitchMode} 
          onRegisterSuccess={onAuthSuccess} 
        />
      )}
    </div>
  );
}; 