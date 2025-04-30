import React, { useRef, useState } from 'react';
import { useTheme } from '../../theme/components/ThemeProvider';

interface UserActionsProps {
  isCurrentUser: boolean;
  isFollowing?: boolean;
  isFriend?: boolean;
  isPendingFriend?: boolean;
  onEdit?: () => void;
  onFollow?: () => void;
  onUnfollow?: () => void;
  onAddFriend?: () => void;
  onCancelFriendRequest?: () => void;
  onRemoveFriend?: () => void;
}

const UserActions: React.FC<UserActionsProps> = ({
  isCurrentUser,
  isFollowing = false,
  isFriend = false,
  isPendingFriend = false,
  onEdit,
  onFollow,
  onUnfollow,
  onAddFriend,
  onCancelFriendRequest,
  onRemoveFriend
}) => {
  const { currentTheme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);

  // For development purposes - always show all buttons
  const devMode = true; // Set to true for development

  // Base button styles
  const buttonBaseStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0.4375rem 0.9375rem',
    borderRadius: '0.625rem',
    fontWeight: 500,
    fontSize: '0.8125rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.06)',
    border: 'none',
    position: 'relative',
    overflow: 'hidden',
    marginLeft: '0.625rem'
  };

  const primaryButtonStyle: React.CSSProperties = {
    ...buttonBaseStyle,
    backgroundColor: currentTheme.colors.buttonPrimary,
    color: currentTheme.colors.textLight,
    boxShadow: `0 2px 4px ${currentTheme.colors.primary}40`
  };

  const secondaryButtonStyle: React.CSSProperties = {
    ...buttonBaseStyle,
    backgroundColor: currentTheme.colors.card,
    color: currentTheme.colors.textPrimary,
    border: `1px solid ${currentTheme.colors.border}`
  };

  const outlineButtonStyle: React.CSSProperties = {
    ...buttonBaseStyle,
    backgroundColor: 'transparent',
    color: currentTheme.colors.textSecondary,
    border: `1px solid ${currentTheme.colors.border}`
  };

  const friendsButtonStyle: React.CSSProperties = {
    ...outlineButtonStyle,
    borderColor: '#28a745',
    color: '#28a745'
  };

  const pendingButtonStyle: React.CSSProperties = {
    ...outlineButtonStyle,
    borderColor: '#ffc107',
    color: '#ffc107'
  };

  const moreOptionsButtonStyle: React.CSSProperties = {
    ...buttonBaseStyle,
    width: '2rem',
    height: '2rem',
    padding: '0.25rem',
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: currentTheme.colors.card,
    color: currentTheme.colors.textSecondary
  };

  const textStyle: React.CSSProperties = {
    position: 'relative',
    zIndex: 2
  };

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: '0.625rem',
    marginTop: '2.5rem'
  };

  const optionsMenuStyle: React.CSSProperties = {
    position: 'absolute',
    top: '2.5rem',
    right: '0',
    backgroundColor: currentTheme.colors.backgroundAlt,
    border: `1px solid ${currentTheme.colors.border}`,
    borderRadius: '0.5rem',
    boxShadow: `0 4px 12px ${currentTheme.colors.shadow}`,
    padding: '0.5rem 0',
    zIndex: 10,
    minWidth: '160px',
    display: showOptionsMenu ? 'block' : 'none'
  };

  const optionItemStyle: React.CSSProperties = {
    padding: '0.5rem 1rem',
    fontSize: '0.875rem',
    color: currentTheme.colors.textPrimary,
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    gap: '0.5rem'
  };

  const dangerOptionStyle: React.CSSProperties = {
    ...optionItemStyle,
    color: currentTheme.colors.danger
  };

  // Add themed scrollbar style
  const scrollbarStyle = `
    /* Custom scrollbar for themed scrolling */
    * {
      scrollbar-width: thin;
      scrollbar-color: ${currentTheme.colors.primaryLight} ${currentTheme.colors.backgroundAlt};
    }

    *::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }
    
    *::-webkit-scrollbar-track {
      background: ${currentTheme.colors.backgroundAlt};
      border-radius: 10px;
    }
    
    *::-webkit-scrollbar-thumb {
      background-color: ${currentTheme.colors.primaryLight};
      border-radius: 10px;
      border: 2px solid ${currentTheme.colors.backgroundAlt};
    }
    
    *::-webkit-scrollbar-thumb:hover {
      background-color: ${currentTheme.colors.primary};
    }
  `;
  
  // Simple button hover style (better performance)
  const buttonHoverStyle = `
    button:hover {
      transform: translateY(-2px);
      box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
      filter: brightness(1.05);
    }
    
    button:active {
      transform: translateY(0);
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
      filter: brightness(0.95);
    }

    .option-item:hover {
      background-color: ${currentTheme.colors.primary}20;
    }
  `;
  
  // Options menu handlers
  const handleMoreOptions = () => {
    setShowOptionsMenu(!showOptionsMenu);
  };

  const handleReportUser = () => {
    console.log('Report user clicked');
    setShowOptionsMenu(false);
    // Implementation for reporting user
  };

  const handleBlockUser = () => {
    console.log('Block user clicked');
    setShowOptionsMenu(false);
    // Implementation for blocking user
  };

  const handleShareProfile = () => {
    console.log('Share profile clicked');
    setShowOptionsMenu(false);
    // Implementation for sharing profile
  };

  // Close dropdown when clicking outside
  const handleClickOutside = (e: MouseEvent) => {
    if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
      setShowOptionsMenu(false);
    }
  };

  // Add click outside listener
  React.useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      <style>{buttonHoverStyle}</style>
      <style>{scrollbarStyle}</style>
      <div style={containerStyle} ref={containerRef}>
        {/* Show edit button for current user or in dev mode */}
        {(isCurrentUser || devMode) && (
          <button 
            onClick={onEdit} 
            style={primaryButtonStyle}
            title="Edit your profile"
          >
            <span style={textStyle}>Edit</span>
          </button>
        )}
        
        {/* Show other user actions if not current user or in dev mode */}
        {(!isCurrentUser || devMode) && (
          <>
            {/* Follow Button */}
            <button 
              onClick={isFollowing ? onUnfollow : onFollow} 
              style={isFollowing ? outlineButtonStyle : secondaryButtonStyle}
            >
              <span style={textStyle}>{isFollowing ? 'Unfollow' : 'Follow'}</span>
            </button>

            {/* Friend Button - Multiple states */}
            {isFriend ? (
              <button 
                onClick={onRemoveFriend} 
                style={friendsButtonStyle}
              >
                <span style={textStyle}>Friends</span>
              </button>
            ) : isPendingFriend ? (
              <button 
                onClick={onCancelFriendRequest} 
                style={pendingButtonStyle}
              >
                <span style={textStyle}>Pending</span>
              </button>
            ) : (
              <button 
                onClick={onAddFriend} 
                style={primaryButtonStyle}
              >
                <span style={textStyle}>Add Friend</span>
              </button>
            )}
          </>
        )}
        
        {/* More options button */}
        <div style={{ position: 'relative' }}>
          <button 
            onClick={handleMoreOptions} 
            style={moreOptionsButtonStyle}
            title="More options"
          >
            <span style={textStyle}>⋮</span>
          </button>
          
          {/* Options dropdown menu */}
          <div style={optionsMenuStyle}>
            <div 
              className="option-item" 
              style={optionItemStyle}
              onClick={handleShareProfile}
            >
              <span>🔗</span> Share Profile
            </div>
            <div 
              className="option-item" 
              style={optionItemStyle}
              onClick={handleReportUser}
            >
              <span>🚩</span> Report User
            </div>
            <div 
              className="option-item" 
              style={dangerOptionStyle}
              onClick={handleBlockUser}
            >
              <span>🚫</span> Block User
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserActions; 