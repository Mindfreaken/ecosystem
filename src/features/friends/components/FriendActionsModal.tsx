import React, { useState } from 'react';
import { useTheme } from '../../theme';
import { Friend } from '../types';
import { 
  useApplyPunishment, 
  useRemovePunishment, 
  usePunishmentTypes,
  useUserPunishments
} from '../../profile/services/SocialScoreService';
import { Id } from '../../../../convex/_generated/dataModel';

interface FriendActionsModalProps {
  show: boolean;
  friend: Friend;
  onClose: () => void;
  onFriendUpdated: (friend: Friend) => void;
  onViewProfile: (friend: Friend) => void;
  onSendMessage: (friend: Friend) => void;
  currentUserId: Id<"users">;
}

const FriendActionsModal: React.FC<FriendActionsModalProps> = ({ 
  show, 
  friend,
  onClose,
  onFriendUpdated,
  onViewProfile,
  onSendMessage,
  currentUserId
}) => {
  const { currentTheme } = useTheme();
  
  // Component state
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [confirmRemoveFriend, setConfirmRemoveFriend] = useState(false);
  const [confirmBlockUser, setConfirmBlockUser] = useState(false);
  const [isRemoveHovered, setIsRemoveHovered] = useState(false);
  const [isBlockHovered, setIsBlockHovered] = useState(false);

  // Hooks for punishment system
  const punishmentTypes = usePunishmentTypes();
  const userPunishments = useUserPunishments(currentUserId);
  const applyPunishment = useApplyPunishment();
  const removePunishment = useRemovePunishment();

  // Computed styles
  const dangerBackgroundColor = `rgba(${currentTheme.colors.danger}, 0.1)`;
  const dangerHoverBackgroundColor = `rgba(${currentTheme.colors.danger}, 0.2)`;

  // Handle mute/unmute
  const handleToggleMute = async () => {
    if (isActionLoading) return;
    
    setIsActionLoading(true);
    setErrorMessage('');
    
    try {
      // Clone and update the friend object
      const updatedFriend = { ...friend, isMuted: !friend.isMuted };
      
      // Emit the updated friend immediately for responsive UI
      onFriendUpdated(updatedFriend);
      
      // Apply or remove the mute punishment
      const muteType = punishmentTypes?.find(type => type.name === "mute");
      
      if (updatedFriend.isMuted && muteType) {
        // Apply mute punishment
        await applyPunishment({
          userId: currentUserId,
          punishmentTypeId: muteType._id,
          targetUserId: friend.friendId as unknown as Id<"users">
        });
      } else if (!updatedFriend.isMuted) {
        // Find and remove mute punishment
        const mutePunishment = userPunishments?.find(p => 
          p.punishmentName === "mute" && 
          p.targetUserId === friend.friendId && 
          p.active
        );
        
        if (mutePunishment) {
          await removePunishment({
            punishmentId: mutePunishment._id
          });
        }
      }
      
      // Close modal after successful update
      onClose();
    } catch (error) {
      // If there was an error, revert the optimistic update
      onFriendUpdated(friend);
      setErrorMessage(error instanceof Error ? error.message : 'Failed to update friend');
    } finally {
      setIsActionLoading(false);
    }
  };

  // Handle favorite/unfavorite
  const handleToggleFavorite = async () => {
    if (isActionLoading) return;
    
    setIsActionLoading(true);
    setErrorMessage('');
    
    try {
      // Clone and update the friend object
      const updatedFriend = { ...friend, isFavorite: !friend.isFavorite };
      
      // Emit the updated friend immediately for responsive UI
      onFriendUpdated(updatedFriend);
      
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Close modal after successful update
      onClose();
    } catch (error) {
      // If there was an error, revert the optimistic update
      onFriendUpdated(friend);
      setErrorMessage(error instanceof Error ? error.message : 'Failed to update friend');
    } finally {
      setIsActionLoading(false);
    }
  };

  // Handle remove friend
  const handleRemoveFriend = async () => {
    if (isActionLoading) return;
    
    setIsActionLoading(true);
    setErrorMessage('');
    
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // On success, emit the updated friend and close
      onFriendUpdated({ ...friend, status: 'removed' });
      onClose();
    } catch (error) {
      console.error('Friend removal error:', error);
      
      // Display a user-friendly error message
      if (error instanceof Error) {
        setErrorMessage(error.message.includes('no transaction is active') 
          ? 'Database error: Please try again in a moment.' 
          : error.message);
      } else {
        setErrorMessage('Failed to remove friend. Please try again.');
      }
      
      // Keep the confirm dialog open but in a non-loading state so user can try again
      setConfirmRemoveFriend(true);
    } finally {
      setIsActionLoading(false);
    }
  };

  // Handle block user
  const handleBlockUser = async () => {
    if (isActionLoading) return;
    
    setIsActionLoading(true);
    setErrorMessage('');
    
    try {
      // Update UI optimistically
      onFriendUpdated({ ...friend, status: 'blocked' });
      
      // Apply the ban punishment
      const banType = punishmentTypes?.find(type => type.name === "ban");
      
      if (banType) {
        await applyPunishment({
          userId: currentUserId,
          punishmentTypeId: banType._id,
          targetUserId: friend.friendId as unknown as Id<"users">
        });
      }
      
      onClose();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Failed to block user');
      setConfirmBlockUser(false);
    } finally {
      setIsActionLoading(false);
    }
  };

  // Handle unblock user
  const handleUnblockUser = async () => {
    if (isActionLoading) return;
    
    setIsActionLoading(true);
    setErrorMessage('');
    
    try {
      // Update UI optimistically
      onFriendUpdated({ ...friend, status: 'active' });
      
      // Remove the ban punishment
      const banType = punishmentTypes?.find(type => type.name === "ban");
      
      if (banType) {
        const banPunishment = userPunishments?.find(p => 
          p.punishmentName === "ban" && 
          p.targetUserId === friend.friendId && 
          p.active
        );
        
        if (banPunishment) {
          await removePunishment({
            punishmentId: banPunishment._id
          });
        }
      }
      
      onClose();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Failed to unblock user');
    } finally {
      setIsActionLoading(false);
    }
  };

  // Handle view profile
  const handleViewProfile = () => {
    onViewProfile(friend);
    onClose();
  };

  // Handle send message
  const handleSendMessage = () => {
    onSendMessage(friend);
    onClose();
  };

  if (!show) return null;

  return (
    <div 
      className="modal-overlay" 
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
      }}
    >
      <div 
        className="friend-actions-modal" 
        onClick={e => e.stopPropagation()}
        style={{
          width: '90%',
          maxWidth: '500px',
          borderRadius: '12px',
          backgroundColor: currentTheme.colors.card,
          color: currentTheme.colors.textPrimary,
          boxShadow: `0 4px 16px ${currentTheme.colors.shadow}`
        }}
      >
        <div 
          className="friend-actions-modal__header"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 24px',
            borderBottom: `1px solid ${currentTheme.colors.border}`
          }}
        >
          <h2 
            className="friend-actions-modal__title"
            style={{
              fontSize: '1.25rem',
              fontWeight: 600,
              margin: 0
            }}
          >
            Friend Actions
          </h2>
          <button 
            className="friend-actions-modal__close-btn"
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '4px',
              color: currentTheme.colors.textMuted
            }}
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        <div 
          className="friend-actions-modal__friend-info"
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '16px 24px',
            borderBottom: `1px solid ${currentTheme.colors.border}`
          }}
        >
          <div 
            className="friend-actions-modal__avatar"
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              backgroundColor: currentTheme.colors.backgroundLight,
              color: currentTheme.colors.textPrimary
            }}
          >
            {friend.avatarUrl ? (
              <img 
                src={friend.avatarUrl} 
                alt="Avatar" 
                className="friend-actions-modal__avatar-img"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            ) : (
              <i className="fas fa-user"></i>
            )}
          </div>
          
          <div 
            className="friend-actions-modal__user-details"
            style={{
              marginLeft: '16px'
            }}
          >
            <div 
              className="friend-actions-modal__name" 
              style={{ 
                color: currentTheme.colors.textPrimary,
                fontSize: '1rem',
                fontWeight: 600
              }}
            >
              {friend.displayName}
            </div>
            <div 
              className="friend-actions-modal__username" 
              style={{ 
                color: currentTheme.colors.textMuted,
                fontSize: '0.875rem',
                marginTop: '4px'
              }}
            >
              @{friend.username || 'username'}
            </div>
          </div>
        </div>
        
        <div 
          className="friend-actions-modal__content"
          style={{
            padding: '24px'
          }}
        >
          {confirmRemoveFriend ? (
            /* Confirm remove friend dialog */
            <div 
              className="friend-actions-modal__confirm"
              style={{
                backgroundColor: currentTheme.colors.backgroundLight,
                borderRadius: '8px',
                padding: '16px',
                marginTop: '20px'
              }}
            >
              <p 
                className="friend-actions-modal__confirm-text"
                style={{
                  fontSize: '0.875rem',
                  marginBottom: '16px',
                  color: currentTheme.colors.textPrimary
                }}
              >
                Are you sure you want to remove {friend.displayName} from your friends list?
              </p>
              
              <div 
                className="friend-actions-modal__confirm-buttons"
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '12px'
                }}
              >
                <button 
                  className="friend-actions-modal__confirm-btn"
                  onClick={() => setConfirmRemoveFriend(false)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '6px',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    backgroundColor: currentTheme.colors.backgroundLight,
                    color: currentTheme.colors.textPrimary,
                    borderColor: currentTheme.colors.border,
                    border: `1px solid ${currentTheme.colors.border}`
                  }}
                >
                  Cancel
                </button>
                
                <button 
                  className="friend-actions-modal__confirm-btn"
                  onClick={handleRemoveFriend}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '6px',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    backgroundColor: currentTheme.colors.danger,
                    color: currentTheme.colors.textLight,
                    border: 'none'
                  }}
                >
                  {isActionLoading ? (
                    <i className="fas fa-circle-notch fa-spin"></i>
                  ) : (
                    <span>Remove</span>
                  )}
                </button>
              </div>
            </div>
          ) : confirmBlockUser ? (
            /* Confirm block user dialog */
            <div 
              className="friend-actions-modal__confirm"
              style={{
                backgroundColor: currentTheme.colors.backgroundLight,
                borderRadius: '8px',
                padding: '16px',
                marginTop: '20px'
              }}
            >
              <p 
                className="friend-actions-modal__confirm-text"
                style={{
                  fontSize: '0.875rem',
                  marginBottom: '16px',
                  color: currentTheme.colors.textPrimary
                }}
              >
                Are you sure you want to block {friend.displayName}? They will no longer be able to contact you.
              </p>
              
              <div 
                className="friend-actions-modal__confirm-buttons"
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '12px'
                }}
              >
                <button 
                  className="friend-actions-modal__confirm-btn"
                  onClick={() => setConfirmBlockUser(false)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '6px',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    backgroundColor: currentTheme.colors.backgroundLight,
                    color: currentTheme.colors.textPrimary,
                    borderColor: currentTheme.colors.border,
                    border: `1px solid ${currentTheme.colors.border}`
                  }}
                >
                  Cancel
                </button>
                
                <button 
                  className="friend-actions-modal__confirm-btn"
                  onClick={handleBlockUser}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '6px',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    backgroundColor: currentTheme.colors.danger,
                    color: currentTheme.colors.textLight,
                    border: 'none'
                  }}
                >
                  {isActionLoading ? (
                    <i className="fas fa-circle-notch fa-spin"></i>
                  ) : (
                    <span>Block</span>
                  )}
                </button>
              </div>
            </div>
          ) : (
            /* Regular actions list */
            <div 
              className="friend-actions-modal__actions"
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}
            >
              {/* Mute/Unmute action */}
              <button 
                className="friend-actions-modal__action-btn"
                onClick={handleToggleMute}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: `1px solid ${currentTheme.colors.border}`,
                  backgroundColor: currentTheme.colors.backgroundLight,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  textAlign: 'left'
                }}
              >
                <i 
                  className={friend.isMuted ? 'fas fa-volume-up' : 'fas fa-volume-mute'}
                  style={{ 
                    color: friend.isMuted ? currentTheme.colors.success : currentTheme.colors.warning,
                    fontSize: '1.25rem',
                    width: '24px',
                    textAlign: 'center'
                  }}
                ></i>
                <span 
                  className="friend-actions-modal__action-text"
                  style={{
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: currentTheme.colors.textPrimary
                  }}
                >
                  {friend.isMuted ? 'Unmute Friend' : 'Mute Friend'}
                </span>
              </button>
              
              {/* Favorite/Unfavorite action */}
              <button 
                className="friend-actions-modal__action-btn"
                onClick={handleToggleFavorite}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: `1px solid ${currentTheme.colors.border}`,
                  backgroundColor: currentTheme.colors.backgroundLight,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  textAlign: 'left'
                }}
              >
                <i 
                  className={friend.isFavorite ? 'far fa-star' : 'fas fa-star'}
                  style={{ 
                    color: friend.isFavorite ? currentTheme.colors.textMuted : currentTheme.colors.warning,
                    fontSize: '1.25rem',
                    width: '24px',
                    textAlign: 'center'
                  }}
                ></i>
                <span 
                  className="friend-actions-modal__action-text"
                  style={{
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: currentTheme.colors.textPrimary
                  }}
                >
                  {friend.isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                </span>
              </button>
              
              {/* View Profile action */}
              <button 
                className="friend-actions-modal__action-btn"
                onClick={handleViewProfile}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: `1px solid ${currentTheme.colors.border}`,
                  backgroundColor: currentTheme.colors.backgroundLight,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  textAlign: 'left'
                }}
              >
                <i 
                  className="fas fa-user" 
                  style={{ 
                    color: currentTheme.colors.info,
                    fontSize: '1.25rem',
                    width: '24px',
                    textAlign: 'center'
                  }}
                ></i>
                <span 
                  className="friend-actions-modal__action-text"
                  style={{
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: currentTheme.colors.textPrimary
                  }}
                >
                  View Profile
                </span>
              </button>
              
              {/* Send Message action */}
              <button 
                className="friend-actions-modal__action-btn"
                onClick={handleSendMessage}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: `1px solid ${currentTheme.colors.border}`,
                  backgroundColor: currentTheme.colors.backgroundLight,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  textAlign: 'left'
                }}
              >
                <i 
                  className="fas fa-comment" 
                  style={{ 
                    color: currentTheme.colors.primary,
                    fontSize: '1.25rem',
                    width: '24px',
                    textAlign: 'center'
                  }}
                ></i>
                <span 
                  className="friend-actions-modal__action-text"
                  style={{
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: currentTheme.colors.textPrimary
                  }}
                >
                  Send Message
                </span>
              </button>
              
              {/* Remove Friend action */}
              <button 
                className="friend-actions-modal__action-btn"
                onClick={() => setConfirmRemoveFriend(true)}
                onMouseEnter={() => setIsRemoveHovered(true)}
                onMouseLeave={() => setIsRemoveHovered(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: `1px solid ${currentTheme.colors.danger}`,
                  backgroundColor: isRemoveHovered ? dangerHoverBackgroundColor : dangerBackgroundColor,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  textAlign: 'left'
                }}
              >
                <i 
                  className="fas fa-user-times" 
                  style={{ 
                    color: currentTheme.colors.danger,
                    fontSize: '1.25rem',
                    width: '24px',
                    textAlign: 'center'
                  }}
                ></i>
                <span 
                  className="friend-actions-modal__action-text"
                  style={{
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: currentTheme.colors.textPrimary
                  }}
                >
                  Remove Friend
                </span>
              </button>
              
              {/* Block/Unblock User action */}
              {friend.status !== 'blocked' ? (
                <button 
                  className="friend-actions-modal__action-btn"
                  onClick={() => setConfirmBlockUser(true)}
                  onMouseEnter={() => setIsBlockHovered(true)}
                  onMouseLeave={() => setIsBlockHovered(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: `1px solid ${currentTheme.colors.danger}`,
                    backgroundColor: isBlockHovered ? dangerHoverBackgroundColor : dangerBackgroundColor,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    textAlign: 'left'
                  }}
                >
                  <i 
                    className="fas fa-ban" 
                    style={{ 
                      color: currentTheme.colors.danger,
                      fontSize: '1.25rem',
                      width: '24px',
                      textAlign: 'center'
                    }}
                  ></i>
                  <span 
                    className="friend-actions-modal__action-text"
                    style={{
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      color: currentTheme.colors.textPrimary
                    }}
                  >
                    Block User
                  </span>
                </button>
              ) : (
                <button 
                  className="friend-actions-modal__action-btn"
                  onClick={handleUnblockUser}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: `1px solid ${currentTheme.colors.warning}`,
                    backgroundColor: currentTheme.colors.backgroundLight,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    textAlign: 'left'
                  }}
                >
                  <i 
                    className="fas fa-unlock" 
                    style={{ 
                      color: currentTheme.colors.warning,
                      fontSize: '1.25rem',
                      width: '24px',
                      textAlign: 'center'
                    }}
                  ></i>
                  <span 
                    className="friend-actions-modal__action-text"
                    style={{
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      color: currentTheme.colors.textPrimary
                    }}
                  >
                    Unblock User
                  </span>
                </button>
              )}
            </div>
          )}
          
          {/* Error message */}
          {errorMessage && (
            <div 
              className="friend-actions-modal__error"
              style={{
                marginTop: '16px',
                fontSize: '0.875rem',
                color: currentTheme.colors.danger,
                padding: '8px 12px',
                borderRadius: '6px',
                backgroundColor: `rgba(${currentTheme.colors.danger}, 0.1)`
              }}
            >
              {errorMessage}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FriendActionsModal; 