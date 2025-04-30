import React, { useState, useEffect } from 'react';
import { DEFAULT_COVERS, ImageOption, DEFAULT_COVER_URL } from '../constants/defaultImages';
import { useTheme } from '../../theme/components/ThemeProvider';
import '../styles/CoverPicker.css';

interface CoverPickerProps {
  isOpen: boolean;
  currentCover?: string;
  onClose: () => void;
  onSelect: (coverUrl: string) => void;
}

const CoverPicker: React.FC<CoverPickerProps> = ({
  isOpen,
  currentCover = '',
  onClose,
  onSelect
}) => {
  // Get current theme
  const { currentTheme } = useTheme();
  
  // State
  const [covers, setCovers] = useState<ImageOption[]>([]);
  const [selectedCover, setSelectedCover] = useState<string | null>(currentCover || null);
  const [loading, setLoading] = useState(true);
  const [loadedCovers, setLoadedCovers] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Initialize loading state
    setLoading(true);
    
    // Initialize all covers as not loaded yet
    const initialLoadedState: Record<string, boolean> = {};
    DEFAULT_COVERS.forEach(cover => {
      initialLoadedState[cover.url] = false;
    });
    setLoadedCovers(initialLoadedState);
    
    // Set covers
    setCovers(DEFAULT_COVERS);
    
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

  const handleSelectCover = (cover: ImageOption) => {
    setSelectedCover(cover.url);
    onSelect(cover.url);
    onClose();
  };

  // Mark cover as loaded
  const markCoverLoaded = (url: string) => {
    setLoadedCovers(prev => ({
      ...prev,
      [url]: true
    }));
  };

  // Check if a cover is loaded
  const isCoverLoaded = (url: string): boolean => {
    return loadedCovers[url] || false;
  };

  // Handle image loading errors
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>, cover: ImageOption) => {
    const imgElement = e.currentTarget;
    console.error(`Failed to load cover image: ${cover.url}`, {
      cover,
      element: imgElement,
      currentSrc: imgElement.currentSrc,
      naturalWidth: imgElement.naturalWidth
    });
    
    // Add error class to parent button for visual indication
    const button = imgElement.closest('.cover-option');
    if (button) {
      button.classList.add('error');
      button.setAttribute('title', `Failed to load: ${cover.url}`);
    }
    
    // First try falling back to the default cover
    if (imgElement.src !== DEFAULT_COVER_URL && cover.url !== DEFAULT_COVER_URL) {
      console.log(`Falling back to DEFAULT_COVER_URL: ${DEFAULT_COVER_URL}`);
      imgElement.src = DEFAULT_COVER_URL;
    }
  };

  // Log successful image loads
  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>, cover: ImageOption) => {
    const imgElement = e.currentTarget;
    console.log(`Successfully loaded cover image: ${cover.url}`, {
      width: imgElement.naturalWidth,
      height: imgElement.naturalHeight,
      src: imgElement.currentSrc
    });
    
    // Remove loading class from parent button
    const button = imgElement.closest('.cover-option');
    if (button) {
      button.classList.remove('loading');
    }
    
    // Mark as loaded successfully
    markCoverLoaded(cover.url);
  };

  if (!isOpen) return null;

  return (
    <div 
      className="cover-picker-backdrop" 
      onClick={handleClose}
      style={{
        backgroundColor: `${currentTheme.colors.backgroundDark}E6`, // E6 for 90% opacity
        backdropFilter: 'blur(8px)'
      }}
    >
      <div className="cover-picker-container">
        <div 
          className="cover-picker-content"
          style={{
            backgroundColor: currentTheme.colors.backgroundDark,
            boxShadow: `0 8px 16px ${currentTheme.colors.shadow}`
          }}
        >
          <div 
            className="cover-picker-header"
            style={{
              borderBottomColor: currentTheme.colors.borderLight
            }}
          >
            <h3 
              className="cover-picker-title"
              style={{ color: currentTheme.colors.textLight }}
            >
              Choose a Cover Image
            </h3>
            <button 
              onClick={onClose} 
              className="cover-picker-close"
              style={{ color: currentTheme.colors.textMuted }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div 
            className="cover-picker-grid"
            style={{
              backgroundColor: currentTheme.colors.backgroundDark
            }}
          >
            {covers.length > 0 ? (
              covers.map((cover) => (
                <button
                  key={cover.name}
                  className={`cover-option ${selectedCover === cover.url ? 'selected' : ''} ${
                    loading || !isCoverLoaded(cover.url) ? 'loading' : ''
                  }`}
                  title={cover.name}
                  onClick={() => handleSelectCover(cover)}
                  style={{
                    backgroundColor: `${currentTheme.colors.backgroundDark}80`, // 80 for 50% opacity
                    boxShadow: `0 4px 12px ${currentTheme.colors.shadow}`,
                    borderColor: selectedCover === cover.url ? currentTheme.colors.primary : 'transparent',
                  }}
                >
                  <img
                    src={cover.url}
                    alt={cover.name}
                    className="cover-image"
                    crossOrigin="anonymous"
                    onError={(e) => handleImageError(e, cover)}
                    onLoad={(e) => handleImageLoad(e, cover)}
                    style={{
                      borderColor: `${currentTheme.colors.borderLight}33`, // 33 for 20% opacity
                      backgroundColor: `${currentTheme.colors.backgroundDark}80` // 80 for 50% opacity
                    }}
                  />
                  {selectedCover === cover.url && 
                    <div 
                      className="selected-indicator"
                      style={{
                        backgroundColor: currentTheme.colors.primary,
                        color: currentTheme.colors.textLight,
                        boxShadow: `0 2px 4px ${currentTheme.colors.shadow}`
                      }}
                    >
                      ✓
                    </div>
                  }
                  <div 
                    className="image-caption"
                    style={{
                      background: `linear-gradient(transparent, ${currentTheme.colors.backgroundDark}E6)`,
                      color: currentTheme.colors.textLight
                    }}
                  >
                    {cover.name}
                  </div>
                </button>
              ))
            ) : (
              <div 
                className="empty-state"
                style={{ color: currentTheme.colors.textMuted }}
              >
                {loading ? 'Loading cover images...' : 'No cover images available'}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoverPicker; 