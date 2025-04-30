import React, { useState, useEffect } from 'react';
import { DEFAULT_AVATARS, ImageOption, DEFAULT_AVATAR_URL } from '../constants/defaultImages';
import { useTheme } from '../../theme/components/ThemeProvider';
import '../styles/AvatarPicker.css';

interface AvatarPickerProps {
  isOpen: boolean;
  currentAvatar?: string;
  onClose: () => void;
  onSelect: (avatarUrl: string) => void;
}

const AvatarPicker: React.FC<AvatarPickerProps> = ({
  isOpen,
  currentAvatar = '',
  onClose,
  onSelect
}) => {
  // Get current theme
  const { currentTheme } = useTheme();
  
  // State
  const [avatars, setAvatars] = useState<ImageOption[]>([]);
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(currentAvatar || null);
  const [loading, setLoading] = useState(true);
  const [loadedAvatars, setLoadedAvatars] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Initialize loading state
    setLoading(true);
    
    // Initialize all avatars as not loaded yet
    const initialLoadedState: Record<string, boolean> = {};
    DEFAULT_AVATARS.forEach(avatar => {
      initialLoadedState[avatar.url] = false;
    });
    setLoadedAvatars(initialLoadedState);
    
    // Set avatars
    setAvatars(DEFAULT_AVATARS);
    
    // Set loading to false after a short delay to allow UI to render
    const timer = setTimeout(() => {
      setLoading(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  // Event handlers
  const handleClose = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleSelectAvatar = (avatar: ImageOption) => {
    setSelectedAvatar(avatar.url);
    onSelect(avatar.url);
    onClose();
  };

  // Mark avatar as loaded
  const markAvatarLoaded = (url: string) => {
    setLoadedAvatars(prev => ({
      ...prev,
      [url]: true
    }));
  };

  // Check if an avatar is loaded
  const isAvatarLoaded = (url: string): boolean => {
    return loadedAvatars[url] || false;
  };

  // Handle image loading errors
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>, avatar: ImageOption) => {
    const imgElement = e.currentTarget;
    console.error(`Failed to load avatar image: ${avatar.url}`, {
      avatar,
      element: imgElement,
      currentSrc: imgElement.currentSrc,
      naturalWidth: imgElement.naturalWidth
    });
    
    // Add error class to parent button for visual indication
    const button = imgElement.closest('.avatar-option');
    if (button) {
      button.classList.add('error');
      button.setAttribute('title', `Failed to load: ${avatar.url}`);
    }
    
    // First try falling back to the default avatar
    if (imgElement.src !== DEFAULT_AVATAR_URL && avatar.url !== DEFAULT_AVATAR_URL) {
      console.log(`Falling back to DEFAULT_AVATAR_URL: ${DEFAULT_AVATAR_URL}`);
      imgElement.src = DEFAULT_AVATAR_URL;
    }
  };

  // Log successful image loads
  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>, avatar: ImageOption) => {
    const imgElement = e.currentTarget;
    console.log(`Successfully loaded avatar image: ${avatar.url}`, {
      width: imgElement.naturalWidth,
      height: imgElement.naturalHeight,
      src: imgElement.currentSrc
    });
    
    // Remove loading class from parent button
    const button = imgElement.closest('.avatar-option');
    if (button) {
      button.classList.remove('loading');
    }
    
    // Mark as loaded successfully
    markAvatarLoaded(avatar.url);
  };

  if (!isOpen) return null;

  return (
    <div 
      className="avatar-picker-backdrop" 
      onClick={handleClose}
      style={{
        backgroundColor: `${currentTheme.colors.backgroundDark}E6`, // E6 for 90% opacity
        backdropFilter: 'blur(4px)'
      }}
    >
      <div className="avatar-picker-container">
        <div 
          className="avatar-picker-content"
          style={{
            backgroundColor: currentTheme.colors.backgroundDark,
            boxShadow: `0 8px 16px ${currentTheme.colors.shadow}`
          }}
        >
          <div 
            className="avatar-picker-header"
            style={{
              borderBottomColor: `${currentTheme.colors.borderLight}`
            }}
          >
            <h3 
              className="avatar-picker-title"
              style={{ color: currentTheme.colors.textLight }}
            >
              Choose an Avatar
            </h3>
            <button 
              onClick={onClose} 
              className="avatar-picker-close"
              style={{ color: currentTheme.colors.textMuted }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div 
            className="avatar-picker-grid"
            style={{
              backgroundColor: currentTheme.colors.backgroundDark
            }}
          >
            {avatars.length > 0 ? (
              avatars.map((avatar) => (
                <button
                  key={avatar.name}
                  className={`avatar-option ${selectedAvatar === avatar.url ? 'selected' : ''} ${
                    loading || !isAvatarLoaded(avatar.url) ? 'loading' : ''
                  }`}
                  onClick={() => handleSelectAvatar(avatar)}
                  style={{
                    borderColor: selectedAvatar === avatar.url ? currentTheme.colors.primary : 'transparent',
                    backgroundColor: selectedAvatar === avatar.url ? `${currentTheme.colors.primary}1A` : 'transparent' // 1A for 10% opacity
                  }}
                >
                  <img
                    src={avatar.url}
                    alt={avatar.name}
                    className="avatar-image"
                    crossOrigin="anonymous"
                    onError={(e) => handleImageError(e, avatar)}
                    onLoad={(e) => handleImageLoad(e, avatar)}
                    style={{
                      backgroundColor: `${currentTheme.colors.backgroundDark}80`, // 80 for 50% opacity
                      borderColor: `${currentTheme.colors.borderLight}`
                    }}
                  />
                </button>
              ))
            ) : (
              <div 
                className="empty-state"
                style={{ color: currentTheme.colors.textMuted }}
              >
                {loading ? 'Loading avatars...' : 'No avatars available'}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvatarPicker; 