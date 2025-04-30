import React, { useState, useEffect } from 'react';
import { useTheme } from './ThemeProvider';
import { availableThemes, Theme } from '../themes';
import '../styles/mobile/ThemePicker.css';
import '../styles/ThemePicker.css';

interface ThemePickerProps {
  isOpen: boolean;
  onClose: () => void;
  onThemeApplied: (themeId: string) => void;
}

// Extended theme interface for UI-specific properties
interface UITheme extends Theme {
  isDark: boolean;
  isNew: boolean;
}

const ThemePicker: React.FC<ThemePickerProps> = ({ isOpen, onClose, onThemeApplied }) => {
  // Get current theme from context
  const { currentTheme, setTheme } = useTheme();
  
  // Tabs for filtering themes
  const tabs = [
    { id: 'all', label: 'All' },
    { id: 'dark', label: 'Dark' },
    { id: 'light', label: 'Light' },
  ];
  
  // Component state
  const [activeTab, setActiveTab] = useState('all');
  const [selectedThemeId, setSelectedThemeId] = useState<string>(currentTheme.id);
  
  // Enhance themes with UI-specific properties
  const enhancedThemes = React.useMemo(() => {
    const result: Record<string, UITheme> = {};
    
    Object.entries(availableThemes).forEach(([id, theme]) => {
      // Determine if theme is dark based on background color luminance
      const bgColor = theme.colors.backgroundDark || '#000000';
      const r = parseInt(bgColor.slice(1, 3), 16);
      const g = parseInt(bgColor.slice(3, 5), 16);
      const b = parseInt(bgColor.slice(5, 7), 16);
      const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      const isDark = luminance < 0.5;
      
      // For demonstration, we'll mark themes with "new" in their name as new
      const isNew = theme.name.toLowerCase().includes('new') || false;
      
      result[id] = {
        ...theme,
        isDark,
        isNew
      };
    });
    
    return result;
  }, []);
  
  // Selected theme object
  const selectedTheme = selectedThemeId ? enhancedThemes[selectedThemeId] : null;
  
  // Filter themes based on active tab
  const filteredThemes = React.useMemo(() => {
    const result: Record<string, UITheme> = {};
    
    Object.entries(enhancedThemes).forEach(([id, theme]) => {
      switch (activeTab) {
        case 'dark':
          if (theme.isDark) result[id] = theme;
          break;
        case 'light':
          if (!theme.isDark) result[id] = theme;
          break;
        default:
          result[id] = theme;
      }
    });
    
    return result;
  }, [enhancedThemes, activeTab]);
  
  // Select a theme
  const selectTheme = (id: string) => {
    setSelectedThemeId(id);
  };
  
  // Apply the selected theme
  const applySelectedTheme = () => {
    if (selectedThemeId) {
      setTheme(selectedThemeId);
      onThemeApplied(selectedThemeId);
      onClose();
    }
  };
  
  // Handle backdrop click to close
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  
  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);
  
  // Reset selection when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedThemeId(currentTheme.id);
    }
  }, [isOpen, currentTheme.id]);
  
  if (!isOpen) return null;
  
  return (
    <div 
      className="theme-picker__backdrop"
      onClick={handleBackdropClick}
      style={{
        backgroundColor: `${currentTheme.colors.backgroundDark}99`
      }}
    >
      <div 
        className="theme-picker__modal"
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: currentTheme.colors.backgroundLight,
          borderColor: currentTheme.colors.border,
          color: currentTheme.colors.textPrimary
        }}
      >
        {/* Header Section */}
        <div className="theme-picker__header" style={{ borderBottomColor: currentTheme.colors.borderLight }}>
          <div className="theme-picker__title-group">
            <i className="fas fa-palette" style={{ color: currentTheme.colors.primary }}></i>
            <h2 className="theme-picker__title">Theme Studio</h2>
            <span 
              className="theme-picker__beta-badge"
              style={{
                color: currentTheme.colors.primary,
                borderColor: currentTheme.colors.primary
              }}
            >BETA</span>
          </div>
          <button 
            className="theme-picker__close-btn"
            onClick={onClose}
            style={{ color: currentTheme.colors.textSecondary }}
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        {/* Theme Selection Area */}
        <div className="theme-picker__content">
          {/* Tab Navigation */}
          <div 
            className="theme-picker__tabs"
            style={{ backgroundColor: currentTheme.colors.backgroundLight }}
          >
            {tabs.map(tab => (
              <button 
                key={tab.id}
                className={`theme-picker__tab ${activeTab === tab.id ? 'theme-picker__tab--active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
                style={activeTab !== tab.id ? { 
                  color: currentTheme.colors.textSecondary
                } : {}}
              >
                {tab.label}
              </button>
            ))}
          </div>
          
          {/* Theme Grid */}
          <div className="theme-picker__themes">
            {Object.entries(filteredThemes).map(([id, theme]) => (
              <div 
                key={id}
                className={`theme-picker__theme-card ${selectedThemeId === id ? 'theme-picker__theme-card--selected' : ''}`}
                onClick={() => selectTheme(id)}
                style={{
                  borderColor: selectedThemeId === id 
                    ? theme.colors.primary
                    : 'transparent',
                  boxShadow: selectedThemeId === id
                    ? `0 0 0 2px ${theme.colors.primary}`
                    : '0 2px 8px rgba(0, 0, 0, 0.15)'
                }}
              >
                <div 
                  className="theme-picker__theme-card-header"
                  style={{
                    background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary})`
                  }}
                ></div>
                <div 
                  className="theme-picker__theme-name"
                  style={{ 
                    backgroundColor: theme.colors.backgroundDark || '#111',
                    color: '#fff'
                  }}
                >
                  {theme.name}
                  {theme.isNew && (
                    <span 
                      className="theme-picker__new-indicator"
                      style={{ backgroundColor: theme.colors.primary }}
                    ></span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Preview Section */}
        <div 
          className="theme-picker__preview-section"
          style={{ borderTopColor: currentTheme.colors.borderLight }}
        >
          <div className="theme-picker__preview-header">
            <h3 style={{ color: currentTheme.colors.textPrimary }}>Preview</h3>
            <span 
              className="theme-picker__current-theme"
              style={{
                backgroundColor: `${currentTheme.colors.primary}20`,
                color: currentTheme.colors.primary
              }}
            >
              {selectedTheme?.name || 'No theme selected'}
            </span>
          </div>
          
          {/* Theme Preview Mockup */}
          <div 
            className="theme-picker__preview-mockup"
            style={{
              backgroundColor: selectedTheme?.colors.backgroundLight || currentTheme.colors.backgroundLight,
              borderColor: selectedTheme?.colors.borderLight || currentTheme.colors.borderLight
            }}
          >
            {/* Mockup Header */}
            <div 
              className="theme-picker__mockup-header"
              style={{
                backgroundColor: selectedTheme?.colors.backgroundAlt || currentTheme.colors.backgroundAlt,
                borderBottomColor: selectedTheme?.colors.borderLight || currentTheme.colors.borderLight
              }}
            >
              <div 
                className="theme-picker__mockup-logo"
                style={{ color: selectedTheme?.colors.primary || currentTheme.colors.primary }}
              >
                <i className="fas fa-leaf"></i>
              </div>
              <div 
                className="theme-picker__mockup-title"
                style={{ color: selectedTheme?.colors.textPrimary || currentTheme.colors.textPrimary }}
              >
                Example App
              </div>
            </div>
            
            {/* Mockup Content */}
            <div className="theme-picker__mockup-content">
              {/* Mockup Sidebar */}
              <div 
                className="theme-picker__mockup-sidebar"
                style={{
                  backgroundColor: selectedTheme?.colors.backgroundDark || currentTheme.colors.backgroundDark,
                  borderRightColor: selectedTheme?.colors.borderLight || currentTheme.colors.borderLight
                }}
              >
                <div 
                  className="theme-picker__mockup-nav-item theme-picker__mockup-nav-item--active"
                  style={{
                    backgroundColor: selectedTheme?.colors.primary || currentTheme.colors.primary,
                    color: '#ffffff'
                  }}
                >
                  <i className="fas fa-home"></i>
                </div>
                <div 
                  className="theme-picker__mockup-nav-item"
                  style={{ color: selectedTheme?.colors.textSecondary || currentTheme.colors.textSecondary }}
                >
                  <i className="fas fa-chart-line"></i>
                </div>
                <div 
                  className="theme-picker__mockup-nav-item"
                  style={{ color: selectedTheme?.colors.textSecondary || currentTheme.colors.textSecondary }}
                >
                  <i className="fas fa-cog"></i>
                </div>
              </div>
              
              {/* Mockup Main Content */}
              <div className="theme-picker__mockup-main">
                <div 
                  className="theme-picker__mockup-card"
                  style={{
                    backgroundColor: selectedTheme?.colors.backgroundAlt || currentTheme.colors.backgroundAlt,
                    borderColor: selectedTheme?.colors.borderLight || currentTheme.colors.borderLight
                  }}
                >
                  <div 
                    className="theme-picker__mockup-card-title"
                    style={{ color: selectedTheme?.colors.textPrimary || currentTheme.colors.textPrimary }}
                  >
                    Card Title
                  </div>
                  <div 
                    className="theme-picker__mockup-card-content"
                    style={{ color: selectedTheme?.colors.textSecondary || currentTheme.colors.textSecondary }}
                  >
                  </div>
                  <div className="theme-picker__mockup-buttons">
                    <button 
                      className="theme-picker__mockup-button theme-picker__mockup-button--primary"
                      style={{
                        backgroundColor: selectedTheme?.colors.primary || currentTheme.colors.primary,
                        color: '#ffffff'
                      }}
                    >
                      Primary
                    </button>
                    <button 
                      className="theme-picker__mockup-button theme-picker__mockup-button--secondary"
                      style={{
                        backgroundColor: selectedTheme?.colors.secondary || currentTheme.colors.secondary,
                        color: '#ffffff'
                      }}
                    >
                      Secondary
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer Section with Action Buttons */}
        <div 
          className="theme-picker__footer"
          style={{ borderTopColor: currentTheme.colors.borderLight }}
        >
          <button 
            className="theme-picker__action-btn theme-picker__action-btn--apply"
            onClick={applySelectedTheme}
            disabled={!selectedThemeId}
            style={{
              backgroundColor: currentTheme.colors.primary,
              color: '#ffffff',
              opacity: selectedThemeId ? 1 : 0.5
            }}
          >
            <i className="fas fa-check"></i>
            Apply Theme
          </button>
        </div>
      </div>
    </div>
  );
};

export default ThemePicker; 