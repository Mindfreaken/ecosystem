export interface User {
  id: string;
  email: string;
  username: string;
  displayName: string;
  dateOfBirth: string;
  role: 'admin' | 'user';
  joinNumber?: number | null;
  avatarUrl?: string | null;
  coverUrl?: string | null;
  bio?: string | null;
  customStatus?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  username: string;
  displayName: string;
  dateOfBirth: string;
  confirmPassword: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
  loading: boolean;
  error: string | null;
} 