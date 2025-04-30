import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../../theme';
import { ThemePicker } from '../../theme';
import '../styles/ShellHeader.css';

const ShellHeader: React.FC = () => {
  const { currentTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isThemePickerOpen, setIsThemePickerOpen] = useState(false);
  const [currentTitle, setCurrentTitle] = useState("Ecosystem");
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  // Update title based on current route
  useEffect(() => {
    // Set title based on current path
    const path = location.pathname;
    if (path.includes('/friends')) {
      setCurrentTitle('Friends');
    } else if (path.includes('/messages') || path.includes('/chat')) {
      setCurrentTitle('Messages');
    } else if (path.includes('/tasks')) {
      setCurrentTitle('Tasks');
    } else if (path.includes('/projects')) {
      setCurrentTitle('Projects');
    } else if (path.includes('/dashboard')) {
      setCurrentTitle('Dashboard');
    } else {
      setCurrentTitle('Ecosystem');
    }
  }, [location.pathname]);
  
  // Check if mobile on mount and on resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);
  
  const toggleSearchBar = () => {
    setShowSearchBar(!showSearchBar);
    if (!showSearchBar) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  };

  const openThemePicker = () => {
    setIsThemePickerOpen(true);
  };

  const closeThemePicker = () => {
    setIsThemePickerOpen(false);
  };

  const handleThemeApplied = (themeId: string) => {
    console.log(`Theme applied: ${themeId}`);
    // Additional handling if needed
  };
  
  // Navigate to Friends page
  const navigateToFriends = () => {
    navigate('/friends');
  };
  
  // Dynamic glow effect handlers
  const handleGlowEffect = (event: React.MouseEvent<HTMLButtonElement>) => {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    
    // Calculate mouse position relative to button (0-100%)
    const x = Math.round(((event.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((event.clientY - rect.top) / rect.height) * 100);
    
    // Update the CSS variables for the glow position
    button.style.setProperty('--glow-pos-x', `${x}%`);
    button.style.setProperty('--glow-pos-y', `${y}%`);
    
    // Set the glow color from the button's data attribute if present
    const glowColor = button.getAttribute('data-glow-color');
    if (glowColor) {
      button.style.setProperty('--glow-color', glowColor);
    }
  };
  
  const resetGlowEffect = (event: React.MouseEvent<HTMLButtonElement>) => {
    const button = event.currentTarget;
    
    // Reset to default values with a transition
    button.style.setProperty('--glow-pos-x', '50%');
    button.style.setProperty('--glow-pos-y', '50%');
  };

  // For notification badges (can be connected to real data later)
  const friendsNotificationCount = 2;
  const messagesCount = 3;

  return (
    <header 
      className="shell-header"
      style={{
        backgroundColor: currentTheme.colors.backgroundAlt,
        borderBottom: `1px solid ${currentTheme.colors.border}`,
        color: currentTheme.colors.textPrimary,
      }}
    >
      {/* Left Section - Branding */}
      <div className="shell-header-left">
        <div 
          className="shell-logo"
          style={{ color: currentTheme.colors.primary }}
        >
          <span className="shell-logo-icon">🌱</span>
        </div>
      </div>

      {/* Center Section - Dynamic Title */}
      <h1 
        className="shell-title"
        style={{ color: currentTheme.colors.primary }}
      >
        {currentTitle}
      </h1>

      {/* Right Section - Action Controls */}
      <div className="shell-header-right">
        {!isMobile && (
          // Theme Button - Hide on mobile
          <button 
            className="shell-action-button"
            onClick={openThemePicker}
            style={{
              backgroundColor: `${currentTheme.colors.backgroundDark}cc`,
              color: currentTheme.colors.textSecondary,
              boxShadow: `0 0 0 1px ${currentTheme.colors.borderLight}`,
            }}
            data-glow-color={currentTheme.colors.primary}
            onMouseMove={handleGlowEffect}
            onMouseLeave={resetGlowEffect}
          >
            🎨
          </button>
        )}

        {/* Friends Button with Notification */}
        <button 
          className="shell-action-button"
          onClick={navigateToFriends}
          style={{
            backgroundColor: `${currentTheme.colors.backgroundDark}cc`,
            color: currentTheme.colors.textSecondary,
            boxShadow: `0 0 0 1px ${currentTheme.colors.borderLight}`,
          }}
          data-glow-color={currentTheme.colors.secondary}
          onMouseMove={handleGlowEffect}
          onMouseLeave={resetGlowEffect}
        >
          👥
          {friendsNotificationCount > 0 && (
            <span 
              className="shell-notification-badge"
              style={{
                backgroundColor: currentTheme.colors.primary,
              }}
            >
              {friendsNotificationCount}
            </span>
          )}
        </button>

        {/* Messages Button with Count */}
        <button 
          className="shell-action-button"
          onClick={() => navigate('/chat')}
          style={{
            backgroundColor: `${currentTheme.colors.backgroundDark}cc`,
            color: currentTheme.colors.textSecondary,
            boxShadow: `0 0 0 1px ${currentTheme.colors.borderLight}`,
          }}
          data-glow-color={currentTheme.colors.info}
          onMouseMove={handleGlowEffect}
          onMouseLeave={resetGlowEffect}
        >
          ✉️
          {messagesCount > 0 && (
            <span 
              className="shell-notification-badge"
              style={{
                backgroundColor: currentTheme.colors.primary,
              }}
            >
              {messagesCount}
            </span>
          )}
        </button>

        {/* Search Button */}
        <button 
          className="shell-action-button"
          onClick={toggleSearchBar}
          style={{
            backgroundColor: `${currentTheme.colors.backgroundDark}cc`,
            color: currentTheme.colors.textSecondary,
            boxShadow: `0 0 0 1px ${currentTheme.colors.borderLight}`,
          }}
          data-glow-color={currentTheme.colors.link}
          onMouseMove={handleGlowEffect}
          onMouseLeave={resetGlowEffect}
        >
          🔍
        </button>
      </div>

      {/* Search Overlay */}
      {showSearchBar && (
        <div 
          className="shell-search-overlay"
          style={{
            backgroundColor: `${currentTheme.colors.backgroundLight}f0`,
          }}
        >
          <div 
            className="shell-search-container"
            style={{
              border: `1px solid ${currentTheme.colors.borderLight}`,
              backgroundColor: currentTheme.colors.backgroundAlt,
            }}
          >
            <span style={{ marginRight: '12px', color: currentTheme.colors.textMuted }}>🔍</span>
            <input 
              ref={searchInputRef}
              type="text" 
              placeholder="Search across the platform..." 
              style={{
                color: currentTheme.colors.textPrimary,
              }}
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  toggleSearchBar();
                }
              }}
            />
            <button 
              className="shell-search-close"
              onClick={() => setShowSearchBar(false)}
              style={{
                color: currentTheme.colors.textMuted,
              }}
            >
              ✖️
            </button>
          </div>
        </div>
      )}

      {/* Theme Picker Modal */}
      <ThemePicker 
        isOpen={isThemePickerOpen}
        onClose={closeThemePicker}
        onThemeApplied={handleThemeApplied}
      />
    </header>
  );
};

export default ShellHeader; 