import React, { useState, useRef } from 'react';
import { useTheme } from '../../theme';
import { useAuth } from '../../auth/hooks/useAuth';
import { ProfileModal, ProfileCardView } from '../../profile/components';
import { NotesModal } from '../../notes';
import { useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import '../styles/ShellQuickAccess.css';

const ShellQuickAccess: React.FC = () => {
  const { currentTheme } = useTheme();
  const auth = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showEcoCard, setShowEcoCard] = useState(false);
  const [showNotesModal, setShowNotesModal] = useState(false);
  
  // Get Convex user ID from Firebase user ID
  const convexUser = useQuery(api.users.getUserByFirebaseId, { 
    firebaseUserId: auth.user?.id ?? '' 
  });
  
  // Refs for the buttons to track mouse position
  const profileBtnRef = useRef<HTMLButtonElement>(null);
  const ecoCardBtnRef = useRef<HTMLButtonElement>(null);
  const notesBtnRef = useRef<HTMLButtonElement>(null);
  const settingsBtnRef = useRef<HTMLButtonElement>(null);
  
  // Handle logout functionality
  const handleLogout = async () => {
    if (isLoggingOut) return; // Prevent multiple clicks
    
    setIsLoggingOut(true);
    try {
      await auth.logout();
      // The redirect will be handled by the auth context
    } catch (error) {
      console.error('Logout failed:', error);
      setIsLoggingOut(false);
    }
  };
  
  // Profile modal handlers
  const openProfileModal = () => {
    if (!auth.user || !convexUser) {
      console.warn('Cannot open profile modal: User not logged in or Convex user not found');
      return;
    }
    setShowProfileModal(true);
  };
  
  const closeProfileModal = () => {
    setShowProfileModal(false);
  };
  
  // EcoCard handlers
  const toggleEcoCard = () => {
    if (!auth.user || !convexUser) {
      console.warn('Cannot open ecoCard: User not logged in or Convex user not found');
      return;
    }
    setShowEcoCard(!showEcoCard);
  };
  
  // Notes modal handlers
  const openNotesModal = () => {
    setShowNotesModal(true);
  };
  
  const closeNotesModal = () => {
    setShowNotesModal(false);
  };
  
  // Glow effect handler
  const handleGlowEffect = (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    
    // Calculate mouse position relative to button (0-100%)
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);
    
    // Update the CSS variables for the glow position
    button.style.setProperty('--glow-pos-x', `${x}%`);
    button.style.setProperty('--glow-pos-y', `${y}%`);
    
    // Set the glow color from the button's data attribute if present
    const glowColor = button.getAttribute('data-glow-color');
    if (glowColor) {
      button.style.setProperty('--glow-color', glowColor);
    }
  };
  
  // Special handling for support button
  const handleSupportGlow = (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);
    
    // Special handling for support button
    button.style.setProperty('--kofi-highlight-x', `${x}%`);
    button.style.setProperty('--kofi-highlight-y', `${y}%`);
    
    // Add a subtle dynamic shadow based on mouse position
    const shadowX = (x - 50) / 10;
    const shadowY = (y - 50) / 10;
    button.style.setProperty('--kofi-shadow-x', `${shadowX}px`);
    button.style.setProperty('--kofi-shadow-y', `${shadowY}px`);
  };
  
  const resetGlowEffect = (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = e.currentTarget;
    
    // Reset to default values
    button.style.setProperty('--glow-pos-x', '50%');
    button.style.setProperty('--glow-pos-y', '50%');
    button.style.setProperty('--kofi-highlight-x', '50%');
    button.style.setProperty('--kofi-highlight-y', '50%');
    button.style.setProperty('--kofi-shadow-x', '0px');
    button.style.setProperty('--kofi-shadow-y', '0px');
  };

  return (
    <>
      <div 
        className="shell-quick-access"
        style={{
          backgroundColor: currentTheme.colors.backgroundAlt,
          borderTopColor: currentTheme.colors.border,
          color: currentTheme.colors.textPrimary,
          boxShadow: '0 -2px 8px rgba(0, 0, 0, 0.1)'
        }}
      >
        {/* Left Section - Personal Controls */}
        <div className="shell-quick-access__section shell-quick-access__personal">
          <button 
            ref={profileBtnRef}
            className="shell-quick-access__button shell-quick-access__button--glow"
            style={{
              color: currentTheme.colors.textSecondary,
              backgroundColor: `${currentTheme.colors.backgroundDark}cc`,
              boxShadow: `0 0 0 1px ${currentTheme.colors.borderLight}`,
              '--glow-color': currentTheme.colors.primary
            } as React.CSSProperties}
            data-glow-color={currentTheme.colors.primary}
            onMouseMove={handleGlowEffect}
            onMouseLeave={resetGlowEffect}
            onClick={openProfileModal}
            disabled={!auth.isAuthenticated}
          >
            <span className="shell-quick-access__icon">
              {auth.isAuthenticated ? '👤' : '🔒'}
            </span>
            <span className="shell-quick-access__label">Profile</span>
          </button>
          
          {/* EcoCard Button */}
          <button 
            ref={ecoCardBtnRef}
            className="shell-quick-access__button shell-quick-access__button--glow"
            style={{
              color: currentTheme.colors.textSecondary,
              backgroundColor: `${currentTheme.colors.backgroundDark}cc`,
              boxShadow: `0 0 0 1px ${currentTheme.colors.borderLight}`,
              '--glow-color': currentTheme.colors.success
            } as React.CSSProperties}
            data-glow-color={currentTheme.colors.success}
            onMouseMove={handleGlowEffect}
            onMouseLeave={resetGlowEffect}
            onClick={toggleEcoCard}
            disabled={!auth.isAuthenticated}
          >
            <span className="shell-quick-access__icon">🌱</span>
            <span className="shell-quick-access__label">ecoCard</span>
          </button>
          
          {/* Notes Button */}
          <button 
            ref={notesBtnRef}
            className="shell-quick-access__button shell-quick-access__button--glow"
            style={{
              color: currentTheme.colors.textSecondary,
              backgroundColor: `${currentTheme.colors.backgroundDark}cc`,
              boxShadow: `0 0 0 1px ${currentTheme.colors.borderLight}`,
              '--glow-color': currentTheme.colors.success
            } as React.CSSProperties}
            data-glow-color={currentTheme.colors.success}
            onMouseMove={handleGlowEffect}
            onMouseLeave={resetGlowEffect}
            onClick={openNotesModal}
          >
            <span className="shell-quick-access__icon">📝</span>
            <span className="shell-quick-access__label">Notes</span>
            <div 
              className="coming-soon-badge"
              style={{
                backgroundColor: currentTheme.colors.warning,
                color: currentTheme.colors.textLight
              }}
            >
              Coming Soon
            </div>
          </button>
          
          <button 
            ref={settingsBtnRef}
            className="shell-quick-access__button shell-quick-access__button--glow"
            style={{
              color: currentTheme.colors.textSecondary,
              backgroundColor: `${currentTheme.colors.backgroundDark}cc`,
              boxShadow: `0 0 0 1px ${currentTheme.colors.borderLight}`,
              '--glow-color': currentTheme.colors.secondary
            } as React.CSSProperties}
            data-glow-color={currentTheme.colors.secondary}
            onMouseMove={handleGlowEffect}
            onMouseLeave={resetGlowEffect}
          >
            <span className="shell-quick-access__icon">⚙️</span>
            <span className="shell-quick-access__label">Settings</span>
          </button>
        </div>
        
        {/* Center Section - Support/Information */}
        <div className="shell-quick-access__section shell-quick-access__support">
          <button 
            className="shell-quick-access__button shell-quick-access__button--support"
            style={{ 
              backgroundColor: '#13C3FF', 
              color: '#FFFFFF',
              boxShadow: `0 0 0 1px rgba(19, 195, 255, 0.3), 0 0 8px rgba(19, 195, 255, 0.4)`
            }}
            onMouseMove={handleSupportGlow}
            onMouseLeave={resetGlowEffect}
          >
            <span className="shell-quick-access__icon">☕</span>
            <span className="shell-quick-access__label">Support Project</span>
          </button>
        </div>
        
        {/* Right Section - Session Control */}
        <div className="shell-quick-access__section shell-quick-access__session">
          <button 
            className="shell-quick-access__button shell-quick-access__button--glow"
            style={{
              color: currentTheme.colors.textSecondary,
              backgroundColor: `${currentTheme.colors.backgroundDark}cc`,
              boxShadow: `0 0 0 1px ${currentTheme.colors.borderLight}`,
              '--glow-color': currentTheme.colors.danger
            } as React.CSSProperties}
            data-glow-color={currentTheme.colors.danger}
            onMouseMove={handleGlowEffect}
            onMouseLeave={resetGlowEffect}
            onClick={handleLogout}
            disabled={isLoggingOut || !auth.isAuthenticated}
          >
            <span className="shell-quick-access__icon">
              {isLoggingOut ? '⏳' : '🚪'}
            </span>
            <span className="shell-quick-access__label">
              {isLoggingOut ? 'Logging out...' : 'Logout'}
            </span>
          </button>
        </div>
      </div>
      
      {/* Render profile modal */}
      {showProfileModal && auth.user && convexUser && (
        <ProfileModal
          userId={convexUser._id}
          isOpen={showProfileModal}
          initialViewMode="full"
          onClose={closeProfileModal}
        />
      )}
      
      {/* Render eco card */}
      {showEcoCard && auth.user && convexUser && (
        <div className="eco-card-overlay" onClick={toggleEcoCard} style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 50
        }}>
          <div onClick={e => e.stopPropagation()} style={{ padding: '20px' }}>
            <ProfileCardView 
              userId={convexUser._id}
              isCurrentUser={true}
            />
          </div>
        </div>
      )}
      
      {/* Notes Modal */}
      <NotesModal 
        isOpen={showNotesModal}
        modalType="note"
        onClose={closeNotesModal}
      />
    </>
  );
};

export default ShellQuickAccess; 