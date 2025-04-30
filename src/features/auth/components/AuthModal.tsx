import React, { useState, useEffect, useMemo } from 'react';
import { useTheme } from '../../../features/theme';
import { LoginForm, RegisterForm } from './';
import '../styles/Auth.css';

interface AuthModalProps {
  type: 'signin' | 'signup';
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ type, onClose }) => {
  // Initialize state
  const [currentMode, setCurrentMode] = useState<'signin' | 'signup'>(type);
  const [showRipple, setShowRipple] = useState(false);
  const [isCloseHovered, setIsCloseHovered] = useState(false);
  
  // Get theme
  const { currentTheme } = useTheme();
  const colors = currentTheme.colors;

  // Watch for prop changes
  useEffect(() => {
    setCurrentMode(type);
  }, [type]);

  // Toggle between signin and signup
  const toggleMode = (mode: 'signin' | 'signup') => {
    setCurrentMode(mode);
  };

  // Close button ripple effect
  const triggerRipple = () => {
    setShowRipple(true);
    setTimeout(() => {
      setShowRipple(false);
    }, 500);
    onClose();
  };

  // Get primary color with reduced opacity for glow effect
  const primaryColorGlow = useMemo(() => {
    // Convert hex to rgba
    const hexToRgba = (hex: string, opacity: number) => {
      const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
      const fullHex = hex.replace(shorthandRegex, (_, r, g, b) => r + r + g + g + b + b);
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fullHex);
      
      if (!result) return `rgba(79, 70, 229, ${opacity})`;
      
      const r = parseInt(result[1], 16);
      const g = parseInt(result[2], 16);
      const b = parseInt(result[3], 16);
      
      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    };
    
    return hexToRgba(colors.primary, 0.3);
  }, [colors.primary]);

  // Handle successful authentication
  const handleAuthSuccess = () => {
    onClose();
  };

  // Handle skip sign in
  const handleSkipSignIn = () => {
    onClose();
  };

  return (
    // Modal Backdrop
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-2 sm:p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Modal Content */}
      <div 
        className="w-full max-w-md rounded-lg shadow-xl overflow-hidden transition-all transform max-h-[90vh] flex flex-col"
        style={{ 
          backgroundColor: colors.card,
          borderColor: colors.border,
          boxShadow: `0 10px 25px ${colors.shadow}`
        }}
      >
        {/* Modal Header */}
        <div 
          className="p-4 sm:p-6 border-b flex-shrink-0"
          style={{ borderColor: colors.border }}
        >
          <div className="flex justify-between items-center">
            <h2 
              className="text-xl sm:text-2xl font-bold"
              style={{ color: colors.primary }}
            >
              {currentMode === 'signin' ? 'Sign In' : 'Create Account'}
            </h2>
            
            <button 
              onClick={triggerRipple}
              onMouseEnter={() => setIsCloseHovered(true)}
              onMouseLeave={() => setIsCloseHovered(false)}
              className={`close-button ${isCloseHovered ? 'close-button--hovered' : ''}`}
              style={{ 
                backgroundColor: colors.backgroundLight,
                borderColor: isCloseHovered ? colors.primary : colors.border,
                '--primary-color': colors.primary,
                '--primary-glow': primaryColorGlow
              } as React.CSSProperties}
              aria-label="Close"
            >
              <div className="close-icon-wrapper">
                <span className="close-icon" style={{ backgroundColor: isCloseHovered ? colors.primary : colors.textSecondary }}></span>
                <span className="close-icon" style={{ backgroundColor: isCloseHovered ? colors.primary : colors.textSecondary }}></span>
              </div>
              {showRipple && <span className="ripple" style={{ backgroundColor: colors.primary + '20' }}></span>}
            </button>
          </div>
        </div>
        
        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto">
          {/* Render LoginForm or RegisterForm based on currentMode */}
          {currentMode === 'signin' ? (
            <LoginForm 
              onSwitchMode={() => toggleMode('signup')}
              onLoginSuccess={handleAuthSuccess}
              onSkipSignIn={handleSkipSignIn}
            />
          ) : (
            <RegisterForm 
              onSwitchMode={() => toggleMode('signin')}
              onRegisterSuccess={handleAuthSuccess}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal; 