import { LoginCredentials, RegisterData } from '../types';

interface ValidationErrors {
  username?: string;
  displayName?: string;
  dateOfBirth?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
}

export function useFormValidation() {
  // Validate email format
  const validateEmail = (email: string): string => {
    if (!email) {
      return 'Email is required';
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return 'Please enter a valid email address';
    }
    
    return '';
  };
  
  // Validate password
  const validatePassword = (password: string): string => {
    if (!password) {
      return 'Password is required';
    }
    
    if (password.length < 6) {
      return 'Password must be at least 6 characters';
    }
    
    return '';
  };
  
  // Validate login form
  const validateLoginForm = (credentials: LoginCredentials): ValidationErrors => {
    const errors: ValidationErrors = {};
    
    const emailError = validateEmail(credentials.email);
    if (emailError) {
      errors.email = emailError;
    }
    
    const passwordError = validatePassword(credentials.password);
    if (passwordError) {
      errors.password = passwordError;
    }
    
    return errors;
  };
  
  // Validate registration form
  const validateRegisterForm = (data: RegisterData): ValidationErrors => {
    const errors: ValidationErrors = {};
    
    // Username validation
    if (!data.username) {
      errors.username = 'Username is required';
    } else if (data.username.length < 3) {
      errors.username = 'Username must be at least 3 characters';
    }
    
    // Display name validation
    if (!data.displayName) {
      errors.displayName = 'Display name is required';
    }
    
    // Date of birth validation
    if (!data.dateOfBirth) {
      errors.dateOfBirth = 'Date of birth is required';
    } else {
      const birthDate = new Date(data.dateOfBirth);
      const today = new Date();
      const minAgeDate = new Date();
      minAgeDate.setFullYear(today.getFullYear() - 13); // 13 years min age
      
      if (birthDate > today) {
        errors.dateOfBirth = 'Date of birth cannot be in the future';
      } else if (birthDate > minAgeDate) {
        errors.dateOfBirth = 'You must be at least 13 years old';
      }
    }
    
    // Email validation
    const emailError = validateEmail(data.email);
    if (emailError) {
      errors.email = emailError;
    }
    
    // Password validation
    const passwordError = validatePassword(data.password);
    if (passwordError) {
      errors.password = passwordError;
    }
    
    // Confirm password validation
    if (!data.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (data.password !== data.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    return errors;
  };
  
  return {
    validateEmail,
    validatePassword,
    validateLoginForm,
    validateRegisterForm,
  };
} 