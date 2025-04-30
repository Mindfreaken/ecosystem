// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from './useAuth';
import { createUserWithEmailAndPassword, updateProfile, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../../lib/firebase';

// Create unsubscribe mock
const unsubscribeMock = vi.fn();

// Mock Firebase auth functions
vi.mock('firebase/auth', () => ({
  createUserWithEmailAndPassword: vi.fn(),
  updateProfile: vi.fn(),
  signInWithEmailAndPassword: vi.fn(),
  signOut: vi.fn(),
  onAuthStateChanged: vi.fn(() => unsubscribeMock),
}));

// Mock firebase auth instance
vi.mock('../../../lib/firebase', () => ({
  auth: {},
}));

// Mock Convex mutation for createUser
const mockCreateUserConvex = vi.fn().mockResolvedValue(null);
vi.mock('convex/react', () => ({
  useMutation: () => mockCreateUserConvex,
  useQuery: () => undefined,
}));

// Create a test component that uses the useAuth hook
function TestComponent() {
  const { register } = useAuth();
  
  const handleRegister = async () => {
    await register({
      email: 'test@example.com',
      password: 'password123',
      displayName: 'TestUser',
      username: 'test_user',
      dateOfBirth: '1990-01-01',
      confirmPassword: 'password123'
    });
  };
  
  return (
    <button data-testid="register-btn" onClick={handleRegister}>
      Register
    </button>
  );
}

describe('useAuth register flow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls Firebase and Convex with correct arguments', async () => {
    // Arrange: stub Firebase functions
    (createUserWithEmailAndPassword as vi.Mock).mockResolvedValue({ user: { uid: 'uid123' } });
    (updateProfile as vi.Mock).mockResolvedValue(undefined);

    // Render component with AuthProvider
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Act: click register button
    const button = screen.getByTestId('register-btn');
    button.click();

    // Assert: Firebase sign-up called
    await waitFor(() => {
      expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(auth, 'test@example.com', 'password123');
      expect(updateProfile).toHaveBeenCalledWith({ uid: 'uid123' }, { displayName: 'TestUser' });
      // Assert: Convex createUser mutation called
      expect(mockCreateUserConvex).toHaveBeenCalledWith({
        firebaseUserId: 'uid123',
        email: 'test@example.com',
        displayName: 'TestUser',
        createdAt: expect.any(Number),
      });
    });
  });
}); 