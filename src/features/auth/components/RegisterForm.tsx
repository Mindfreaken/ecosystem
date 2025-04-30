import { useState, FormEvent } from 'react';
import { RegisterData } from '../types';
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

interface RegisterFormProps {
  onSwitchMode: (mode: 'signin' | 'signup') => void;
  onRegisterSuccess?: () => void;
}

export const RegisterForm = ({ onSwitchMode, onRegisterSuccess }: RegisterFormProps) => {
  const { validateRegisterForm } = useFormValidation();
  const auth = useAuth();
  const { currentTheme } = useTheme();
  const colors = currentTheme.colors;

  // Registration status
  const [registrationStatus, setRegistrationStatus] = useState({
    success: false,
    isSubmitting: false,
    error: null as string | null,
    requiresEmailConfirmation: false
  });

  // Form state
  const [formData, setFormData] = useState<RegisterData>({
    email: '',
    password: '',
    confirmPassword: '',
    username: '',
    displayName: '',
    dateOfBirth: ''
  });

  const [errors, setErrors] = useState<ValidationErrors>({});

  // Check if form is valid for submission
  const formIsValid = (): boolean => {
    // Basic form validation (no empty fields)
    const allFieldsFilled = 
      formData.email && 
      formData.username && 
      formData.displayName && 
      formData.dateOfBirth && 
      formData.password &&
      formData.confirmPassword;
    
    return !!allFieldsFilled && Object.keys(errors).length === 0;
  };

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
    const validationErrors = validateRegisterForm(formData);
    
    // If there are any errors, don't submit
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setRegistrationStatus(prev => ({ ...prev, isSubmitting: true, error: null }));
    
    try {
      // Attempt to register
      const result = await auth.register(formData);

      setRegistrationStatus({
        success: result.success || false,
        isSubmitting: false,
        error: result.success ? null : (result.error || null),
        requiresEmailConfirmation: result.requiresEmailConfirmation || false
      });

      // Handle success
      if (result.success) {
        onRegisterSuccess?.();
      }
    } catch (error) {
      console.error('Registration error:', error);
      setRegistrationStatus(prev => ({
        ...prev,
        isSubmitting: false,
        error: error instanceof Error ? error.message : 'An error occurred during registration'
      }));
    }
  };

  // If registration was successful but doesn't require email confirmation
  if (registrationStatus.success && !registrationStatus.requiresEmailConfirmation) {
    return (
      <div className="redirect-placeholder">
        <p className="text-center">Registration successful! Redirecting to dashboard...</p>
      </div>
    );
  }

  return (
    <div className="register-form">
      <form onSubmit={handleSubmit} className="max-w-md mx-auto" autoComplete="off">
        <div className="mb-4">
          <label 
            htmlFor="email" 
            className="block text-sm font-medium mb-1"
            style={{ color: colors.textSecondary }}
          >
            Email Address
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
            autoComplete="email"
            required
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-500">{errors.email}</p>
          )}
        </div>

        <div className="mb-4">
          <label 
            htmlFor="username" 
            className="block text-sm font-medium mb-1"
            style={{ color: colors.textSecondary }}
          >
            Username
          </label>
          <input
            id="username"
            name="username"
            type="text"
            value={formData.username}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none transition-colors duration-200 ${errors.username ? 'border-red-500' : ''}`}
            style={{ 
              backgroundColor: colors.backgroundLight,
              borderColor: errors.username ? 'rgb(239, 68, 68)' : colors.border,
              color: colors.text,
              caretColor: colors.primary
            }}
            placeholder="Choose a username"
            autoComplete="off"
            required
          />
          {errors.username && (
            <p className="mt-1 text-sm text-red-500">{errors.username}</p>
          )}
        </div>

        <div className="mb-4">
          <label 
            htmlFor="displayName" 
            className="block text-sm font-medium mb-1"
            style={{ color: colors.textSecondary }}
          >
            Display Name
          </label>
          <input
            id="displayName"
            name="displayName"
            type="text"
            value={formData.displayName}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none transition-colors duration-200 ${errors.displayName ? 'border-red-500' : ''}`}
            style={{ 
              backgroundColor: colors.backgroundLight,
              borderColor: errors.displayName ? 'rgb(239, 68, 68)' : colors.border,
              color: colors.text,
              caretColor: colors.primary
            }}
            placeholder="Enter your display name"
            autoComplete="name"
            required
          />
          {errors.displayName && (
            <p className="mt-1 text-sm text-red-500">{errors.displayName}</p>
          )}
        </div>

        <div className="mb-4">
          <label 
            htmlFor="dateOfBirth" 
            className="block text-sm font-medium mb-1"
            style={{ color: colors.textSecondary }}
          >
            Date of Birth
          </label>
          <input
            id="dateOfBirth"
            name="dateOfBirth"
            type="date"
            value={formData.dateOfBirth}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none transition-colors duration-200 ${errors.dateOfBirth ? 'border-red-500' : ''}`}
            style={{ 
              backgroundColor: colors.backgroundLight,
              borderColor: errors.dateOfBirth ? 'rgb(239, 68, 68)' : colors.border,
              color: colors.text
            }}
            autoComplete="bday"
            required
          />
          {errors.dateOfBirth && (
            <p className="mt-1 text-sm text-red-500">{errors.dateOfBirth}</p>
          )}
        </div>

        <div className="mb-4">
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
            autoComplete="new-password"
            required
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-500">{errors.password}</p>
          )}
        </div>

        <div className="mb-6">
          <label 
            htmlFor="confirmPassword" 
            className="block text-sm font-medium mb-1"
            style={{ color: colors.textSecondary }}
          >
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none transition-colors duration-200 ${errors.confirmPassword ? 'border-red-500' : ''}`}
            style={{ 
              backgroundColor: colors.backgroundLight,
              borderColor: errors.confirmPassword ? 'rgb(239, 68, 68)' : colors.border,
              color: colors.text,
              caretColor: colors.primary
            }}
            placeholder="Confirm your password"
            autoComplete="new-password"
            required
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>
          )}
        </div>

        {(auth.error || registrationStatus.error) && (
          <p className="text-center p-3 bg-red-50 text-red-500 rounded-md mb-4">
            {auth.error || registrationStatus.error}
          </p>
        )}

        <button
          type="submit"
          disabled={auth.loading || registrationStatus.isSubmitting || !formIsValid()}
          className="w-full py-2 px-4 rounded-md shadow-sm text-white font-medium focus:outline-none hover:scale-105 transition-all disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
          style={{
            backgroundColor: colors.buttonPrimary || colors.primary,
          }}
        >
          {auth.loading || registrationStatus.isSubmitting ? (
            <>
              <svg className="animate-spin h-5 w-5 mr-2 inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating Account...
            </>
          ) : (
            'Create Account'
          )}
        </button>

        <div className="mt-4 text-center">
          <p 
            className="text-sm"
            style={{ color: colors.textSecondary }}
          >
            Already have an account?{' '}
            <a 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                onSwitchMode('signin');
              }} 
              className="text-sm font-medium hover:underline"
              style={{ 
                color: colors.link || colors.primary,
              }}
            >
              Sign In
            </a>
          </p>
        </div>
      </form>
    </div>
  );
}; 