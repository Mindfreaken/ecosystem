import React, { useState, useEffect, useCallback, createContext, useContext, ReactNode } from 'react';
import { useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { User, LoginCredentials, RegisterData, AuthState } from '../types';
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { auth } from '../../../lib/firebase';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; error?: string }>;
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string; requiresEmailConfirmation?: boolean }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    token: null,
    loading: true,
    error: null,
  });

  // Convex mutation to ensure user exists (creates if not)
  const ensureUserConvex = useMutation(api.users.ensureUser);

  // Listen for auth state changes when the component mounts
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // User is signed in
          const token = await firebaseUser.getIdToken();
          
          // Create our user object from Firebase user
          const user: User = {
            id: firebaseUser.uid,
            email: firebaseUser.email || '',
            username: firebaseUser.displayName || '',
            displayName: firebaseUser.displayName || '',
            dateOfBirth: '', // Firebase doesn't store this by default
            role: 'user', // You might want to store this in a custom claim or in your database
            avatarUrl: firebaseUser.photoURL || null,
            createdAt: firebaseUser.metadata.creationTime || new Date().toISOString(),
            updatedAt: firebaseUser.metadata.lastSignInTime || new Date().toISOString(),
          };

          // Update state immediately with Firebase user info
          setState({
            user,
            isAuthenticated: true,
            token,
            loading: false, // Initially set loading to false
            error: null,
          });

          // Call Convex mutation to ensure the user exists in the DB
          try {
            await ensureUserConvex({
              firebaseUserId: user.id,
              email: user.email,
              displayName: user.displayName,
            });
            console.log('Ensured Convex user exists for:', user.id);
          } catch (error) {
            console.error('Error ensuring Convex user:', error);
            // Optionally handle specific errors here if needed
          }
          
        } catch (error) {
          console.error('Error during auth state change:', error);
          setState({
            user: null,
            isAuthenticated: false,
            token: null,
            loading: false,
            error: 'Failed to authenticate user',
          });
        }
      } else {
        // User is signed out
        setState({
          user: null,
          isAuthenticated: false,
          token: null,
          loading: false,
          error: null,
        });
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [ensureUserConvex]); // Dependency: ensureUserConvex mutation hook

  const login = useCallback(async (credentials: LoginCredentials) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const { email, password } = credentials;
      await signInWithEmailAndPassword(auth, email, password);
      
      // The auth state change listener will update the state
      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      
      return { success: false, error: errorMessage };
    }
  }, []);

  const register = useCallback(async (data: RegisterData) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const { email, password, displayName, username } = data;
      // Create user with email and password in Firebase
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      // Update profile with displayName in Firebase
      await updateProfile(userCred.user, { displayName });

      // Explicitly call ensureUserConvex here after Firebase user creation
      // and profile update are complete.
      try {
        await ensureUserConvex({
          firebaseUserId: userCred.user.uid,
          email: email,
          displayName: displayName,
          username: username,
        });
        console.log('Ensured Convex user exists via register:', userCred.user.uid);
      } catch (convexError) {
        console.error('Error ensuring Convex user during registration:', convexError);
        // Decide how to handle this - maybe revert Firebase creation or just log?
        // For now, we'll let the registration seem successful to the user but log the error.
        // You might want more robust error handling here.
      }

      // The onAuthStateChanged listener will still run, but the user should already exist.
      // It might call ensureUserConvex again, but that function should handle existing users gracefully.

      // The auth state change listener will update React state
      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      
      return { success: false, error: errorMessage };
    }
  }, [ensureUserConvex]);

  const logout = useCallback(async () => {
    try {
      await signOut(auth);
      // The auth state change listener will update the state
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      setState(prev => ({
        ...prev,
        error: errorMessage,
      }));
    }
  }, []);

  const value = {
    ...state,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};