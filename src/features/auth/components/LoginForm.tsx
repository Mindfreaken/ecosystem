import { useState, FormEvent } from 'react';
import { LoginCredentials } from '../types';
import { useFormValidation } from '../hooks/useFormValidation';
import { useAuth } from '../hooks/useAuth.tsx';
import { useTheme } from '../../../features/theme';

interface ValidationErrors {
  username?: string;
  displayName?: string;
  dateOfBirth?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
}

interface LoginFormProps {
  onSwitchMode: (mode: 'signin' | 'signup') => void;
  onLoginSuccess?: () => void;
  onSkipSignIn?: () => void;
}

export const LoginForm = ({ onSwitchMode, onLoginSuccess, onSkipSignIn }: LoginFormProps) => {
  const { validateLoginForm } = useFormValidation();
  const auth = useAuth();
  const { currentTheme } = useTheme();
  const colors = currentTheme.colors;

  // Form state
  const [formData, setFormData] = useState<LoginCredentials>({
    email: '',
    password: '',
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear the error for this field when user starts typing
    if (errors[name as keyof ValidationErrors]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Reset errors
    setErrors({});
    
    // Validate the form
    const validationErrors = validateLoginForm(formData);
    
    // If there are any errors, don't submit
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Attempt to login
      const result = await auth.login(formData);

      // Handle success
      if (result.success) {
        onLoginSuccess?.();
      } else if (result.error) {
        setErrors({ general: result.error });
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrors({ 
        general: error instanceof Error ? error.message : 'An error occurred during login' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkip = (e: React.MouseEvent) => {
    e.preventDefault();
    onSkipSignIn?.();
  };

  return (
    <div className="login-form">
      <form onSubmit={handleSubmit} className="max-w-md mx-auto">
        <div className="mb-6">
          <label 
            htmlFor="email" 
            className="block text-sm font-medium mb-1"
            style={{ color: colors.textSecondary }}
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none transition-colors duration-200 ${errors.email ? 'border-red-500' : ''}`}
            style={{ 
              backgroundColor: colors.backgroundLight,
              borderColor: errors.email ? 'rgb(239, 68, 68)' : colors.border,
              color: colors.text,
              caretColor: colors.primary
            }}
            placeholder="Enter your email"
            required
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-500">{errors.email}</p>
          )}
        </div>

        <div className="mb-6">
          <label 
            htmlFor="password" 
            className="block text-sm font-medium mb-1"
            style={{ color: colors.textSecondary }}
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none transition-colors duration-200 ${errors.password ? 'border-red-500' : ''}`}
            style={{ 
              backgroundColor: colors.backgroundLight,
              borderColor: errors.password ? 'rgb(239, 68, 68)' : colors.border,
              color: colors.text,
              caretColor: colors.primary
            }}
            placeholder="Enter your password"
            required
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-500">{errors.password}</p>
          )}
        </div>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <input 
              id="remember" 
              type="checkbox" 
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 rounded"
              style={{ 
                color: colors.primary,
                borderColor: colors.border
              }}
            />
            <label 
              htmlFor="remember" 
              className="ml-2 text-sm"
              style={{ color: colors.textSecondary }}
            >
              Remember me
            </label>
          </div>
          <a 
            href="#" 
            className="text-sm font-medium hover:underline"
            style={{ 
              color: colors.link || colors.primary,
            }}
          >
            Forgot password?
          </a>
        </div>

        {(auth.error || errors.general) && (
          <p 
            className="text-center p-3 bg-red-50 text-red-500 rounded-md mb-4"
          >
            {auth.error || errors.general}
          </p>
        )}

        <button
          type="submit"
          disabled={auth.loading || isSubmitting}
          className="w-full py-2 px-4 rounded-md shadow-sm text-white font-medium focus:outline-none hover:scale-105 transition-all disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
          style={{
            backgroundColor: colors.buttonPrimary || colors.primary,
          }}
        >
          {auth.loading || isSubmitting ? (
            <>
              <svg className="animate-spin h-5 w-5 mr-2 inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Signing In...
            </>
          ) : (
            'Sign In'
          )}
        </button>

        <button
          type="button"
          onClick={handleSkip}
          className="w-full mt-3 py-2 px-4 border rounded-md shadow-sm font-medium focus:outline-none hover:bg-opacity-10 transition-all"
          style={{
            borderColor: colors.border,
            color: colors.textSecondary,
            backgroundColor: 'transparent',
          }}
        >
          Skip Sign In
        </button>

        <div className="mt-4 text-center">
          <p 
            className="text-sm"
            style={{ color: colors.textSecondary }}
          >
            Don't have an account?{' '}
            <a 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                onSwitchMode('signup');
              }} 
              className="text-sm font-medium hover:underline"
              style={{ 
                color: colors.link || colors.primary,
              }}
            >
              Sign up
            </a>
          </p>
        </div>
      </form>
    </div>
  );
}; 