import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { useTheme } from '../../theme';
import { Friend, FriendFilterType } from '../types';

interface FriendsListProps {
  friends: Friend[];
  currentFilter: FriendFilterType;
  isLoading: boolean;
  isLoadingMore: boolean;
  hasMore: boolean;
  onMessage: (friend: Friend) => void;
  onViewProfileCard: (friend: Friend) => void;
  onMoreActions: (friend: Friend) => void;
  onLoadMore: () => void;
  onAcceptRequest: (friend: Friend) => void;
  onRejectRequest: (friend: Friend) => void;
  onFriendUpdated: (friend: Friend) => void;
}

// Define the methods that parent components can call on this component
export interface FriendsListRef {
  updateFriend: (updatedFriend: Friend) => void;
}

const dummyFriends: Friend[] = [
  { id: '1', userId: 'u1', friendId: 'f1', username: 'alice', displayName: 'Alice Smith', avatarUrl: null, status: 'active', dateAdded: '2023-01-01', isMuted: false, isFavorite: false, createdAt: '2023-01-01', updatedAt: '2023-01-01' },
  { id: '2', userId: 'u2', friendId: 'f2', username: 'bob', displayName: 'Bob Johnson', avatarUrl: null, status: 'active', dateAdded: '2023-02-15', isMuted: false, isFavorite: true, createdAt: '2023-02-15', updatedAt: '2023-02-15' },
  { id: '3', userId: 'u3', friendId: 'f3', username: 'carol', displayName: 'Carol Williams', avatarUrl: null, status: 'active', dateAdded: '2023-03-10', isMuted: true, isFavorite: false, createdAt: '2023-03-10', updatedAt: '2023-03-10' },
  { id: '4', userId: 'u4', friendId: 'f4', username: 'david', displayName: 'David Brown', avatarUrl: null, status: 'active', dateAdded: '2023-04-05', isMuted: false, isFavorite: false, createdAt: '2023-04-05', updatedAt: '2023-04-05' },
  { id: '5', userId: 'u5', friendId: 'f5', username: 'eva', displayName: 'Eva Davis', avatarUrl: null, status: 'active', dateAdded: '2023-05-20', isMuted: false, isFavorite: true, createdAt: '2023-05-20', updatedAt: '2023-05-20' },
  { id: '6', userId: 'u6', friendId: 'f6', username: 'frank', displayName: 'Frank Miller', avatarUrl: null, status: 'active', dateAdded: '2023-06-25', isMuted: false, isFavorite: false, createdAt: '2023-06-25', updatedAt: '2023-06-25' },
  { id: '7', userId: 'u7', friendId: 'f7', username: 'gary', displayName: 'Gary Wilson', avatarUrl: null, status: 'active', dateAdded: '2023-07-30', isMuted: true, isFavorite: false, createdAt: '2023-07-30', updatedAt: '2023-07-30' },
  { id: '8', userId: 'u8', friendId: 'f8', username: 'hannah', displayName: 'Hannah Moore', avatarUrl: null, status: 'active', dateAdded: '2023-08-12', isMuted: false, isFavorite: false, createdAt: '2023-08-12', updatedAt: '2023-08-12' },
  { id: '9', userId: 'u9', friendId: 'f9', username: 'ivan', displayName: 'Ivan Taylor', avatarUrl: null, status: 'active', dateAdded: '2023-09-01', isMuted: false, isFavorite: false, createdAt: '2023-09-01', updatedAt: '2023-09-01' },
  { id: '10', userId: 'u10', friendId: 'f10', username: 'judy', displayName: 'Judy Anderson', avatarUrl: null, status: 'active', dateAdded: '2023-10-10', isMuted: false, isFavorite: false, createdAt: '2023-10-10', updatedAt: '2023-10-10' },
];

const FriendsList = forwardRef<FriendsListRef, FriendsListProps>((props, ref) => {
  const { 
    friends,
    currentFilter,
    isLoading,
    isLoadingMore,
    hasMore,
    onMessage,
    onViewProfileCard,
    onMoreActions,
    onLoadMore,
    onAcceptRequest,
    onRejectRequest
  } = props;
  
  const { currentTheme } = useTheme();
  
  // Local state for optimistic UI updates
  const [localFriends, setLocalFriends] = useState<Friend[]>([]);
  
  // Update local state when props.friends changes
  useEffect(() => {
    if (friends.length === 0) {
      setLocalFriends([...dummyFriends]);
    } else {
      setLocalFriends([...friends]);
    }
  }, [friends]);
  
  // Expose updateFriend method to parent component
  useImperativeHandle(ref, () => ({
    updateFriend: (updatedFriend: Friend) => {
      const index = localFriends.findIndex(f => f.id === updatedFriend.id);
      
      if (index !== -1) {
        // If in favorites view and the friend is unfavorited, remove it immediately
        if (currentFilter === 'favorite' && !updatedFriend.isFavorite) {
          setLocalFriends(localFriends.filter(f => f.id !== updatedFriend.id));
        } else {
          // Otherwise update the friend
          const updatedFriends = [...localFriends];
          updatedFriends[index] = updatedFriend;
          setLocalFriends(updatedFriends);
        }
      }
    }
  }));
  
  // Compute displayed friends based on current filter
  const displayedFriends = currentFilter === 'favorite'
    ? localFriends.filter(friend => friend.isFavorite)
    : localFriends;
  
  // Handle accept request with optimistic UI update
  const handleAcceptRequest = (friend: Friend) => {
    // Remove from pending list immediately
    if (currentFilter === 'pending') {
      setLocalFriends(localFriends.filter(f => f.id !== friend.id));
    }
    onAcceptRequest(friend);
  };
  
  // Handle reject request with optimistic UI update
  const handleRejectRequest = (friend: Friend) => {
    // Remove from pending list immediately
    if (currentFilter === 'pending') {
      setLocalFriends(localFriends.filter(f => f.id !== friend.id));
    }
    onRejectRequest(friend);
  };
  
  return (
    <div
      className="friends-list"
      style={{
        backgroundColor: currentTheme.colors.background,
        flex: 1,
        overflowY: 'auto',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Loading State */}
      {isLoading && (
        <div 
          className="friends-list__loading"
          style={{ 
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1,
            textAlign: 'center',
            color: currentTheme.colors.textMuted
          }}
        >
          <i className="fas fa-circle-notch fa-spin" style={{ marginBottom: '16px' }}></i>
          <p style={{ fontSize: '1rem', marginBottom: '24px' }}>Loading friends...</p>
        </div>
      )}
      
      {/* Empty State */}
      {!isLoading && displayedFriends.length === 0 && (
        <div 
          className="friends-list__empty" 
          style={{ 
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1,
            textAlign: 'center',
            color: currentTheme.colors.textMuted
          }}
        >
          {currentFilter === 'all' && (
            <div>
              <i className="fas fa-user-friends fa-3x" style={{ marginBottom: '16px' }}></i>
              <p style={{ fontSize: '1rem', marginBottom: '24px' }}>You haven't added any friends yet</p>
            </div>
          )}
          
          {currentFilter === 'pending' && (
            <div>
              <i className="fas fa-user-clock fa-3x" style={{ marginBottom: '16px' }}></i>
              <p style={{ fontSize: '1rem', marginBottom: '24px' }}>No pending friend requests</p>
            </div>
          )}
          
          {currentFilter === 'blocked' && (
            <div>
              <i className="fas fa-user-slash fa-3x" style={{ marginBottom: '16px' }}></i>
              <p style={{ fontSize: '1rem', marginBottom: '24px' }}>You haven't blocked any users</p>
            </div>
          )}
          
          {currentFilter === 'favorite' && (
            <div>
              <i className="fas fa-star fa-3x" style={{ marginBottom: '16px' }}></i>
              <p style={{ fontSize: '1rem', marginBottom: '24px' }}>You haven't favorited any friends yet</p>
            </div>
          )}
        </div>
      )}
      
      {/* Friends List Content */}
      {!isLoading && displayedFriends.length > 0 && (
        <div 
          className="friends-list__content"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}
        >
          {/* Regular friends list (All & Favorites view) */}
          {(currentFilter === 'all' || currentFilter === 'favorite') && displayedFriends.map(friend => (
            <div 
              key={friend.id} 
              className="friend-card"
              style={{
                backgroundColor: currentTheme.colors.card,
                borderLeft: friend.isFavorite ? `4px solid ${currentTheme.colors.warning}` : 'none',
                display: 'flex',
                alignItems: 'center',
                padding: '12px 16px',
                borderRadius: '12px',
                transition: 'all 0.2s ease'
              }}
            >
              <div 
                className="friend-card__avatar"
                style={{
                  backgroundColor: currentTheme.colors.backgroundLight,
                  color: currentTheme.colors.textPrimary,
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden'
                }}
              >
                {friend.avatarUrl ? (
                  <img 
                    src={friend.avatarUrl} 
                    alt="Avatar" 
                    className="friend-card__avatar-img"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                ) : (
                  <i className="mdi--account-card-outline"></i>
                )}
              </div>
              
              <div 
                className="friend-card__info"
                style={{
                  marginLeft: '16px',
                  flex: 1
                }}
              >
                <div 
                  className="friend-card__name"
                  style={{ 
                    color: currentTheme.colors.textPrimary,
                    fontSize: '1rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  {friend.displayName}
                  {friend.isMuted && (
                    <i 
                      className="fas fa-volume-mute" 
                      style={{ color: currentTheme.colors.textMuted }}
                    ></i>
                  )}
                </div>
              </div>
              
              <div 
                className="friend-card__actions"
                style={{
                  display: 'flex',
                  gap: '8px'
                }}
              >
                <button 
                  className="friend-card__action-btn"
                  style={{
                    backgroundColor: currentTheme.colors.primary,
                    color: currentTheme.colors.textLight,
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onClick={() => onMessage(friend)}
                >
                  <i className="fas fa-comment"></i>
                </button>
                
                <button 
                  className="friend-card__action-btn"
                  style={{
                    backgroundColor: currentTheme.colors.secondary,
                    color: currentTheme.colors.textLight,
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onClick={() => onViewProfileCard(friend)}
                  title="View Profile Card"
                >
                  <i className="fas fa-id-card"></i>
                </button>
                
                <button 
                  className="friend-card__action-btn"
                  style={{
                    backgroundColor: currentTheme.colors.backgroundLight,
                    color: currentTheme.colors.textPrimary,
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onClick={() => onMoreActions(friend)}
                >
                  <i className="fas fa-ellipsis-h"></i>
                </button>
              </div>
            </div>
          ))}
          
          {/* Pending requests view */}
          {currentFilter === 'pending' && displayedFriends.map(friend => (
            <div 
              key={friend.id} 
              className="friend-request"
              style={{
                backgroundColor: currentTheme.colors.card,
                display: 'flex',
                alignItems: 'center',
                padding: '12px 16px',
                borderRadius: '12px',
                transition: 'all 0.2s ease'
              }}
            >
              <div 
                className="friend-request__avatar"
                style={{
                  backgroundColor: currentTheme.colors.backgroundLight,
                  color: currentTheme.colors.textPrimary,
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden'
                }}
              >
                {friend.avatarUrl ? (
                  <img 
                    src={friend.avatarUrl} 
                    alt="Avatar" 
                    className="friend-request__avatar-img"
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
                className="friend-request__info"
                style={{
                  marginLeft: '16px',
                  flex: 1
                }}
              >
                <div 
                  className="friend-request__name"
                  style={{ 
                    color: currentTheme.colors.textPrimary,
                    fontSize: '1rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  {friend.displayName}
                </div>
              </div>
              
              <div 
                className="friend-request__actions"
                style={{
                  display: 'flex',
                  gap: '8px'
                }}
              >
                <button 
                  className="friend-request__action-btn"
                  style={{
                    backgroundColor: currentTheme.colors.info,
                    color: currentTheme.colors.textLight,
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    marginRight: '8px'
                  }}
                  title="View Profile Card"
                  onClick={() => onViewProfileCard(friend)}
                >
                  <i className="fas fa-id-card"></i>
                </button>
                
                <button 
                  className="friend-request__accept-btn"
                  style={{
                    backgroundColor: currentTheme.colors.success,
                    color: currentTheme.colors.textLight,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 16px',
                    borderRadius: '20px',
                    border: 'none',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onClick={() => handleAcceptRequest(friend)}
                >
                  <i className="fas fa-check"></i>
                  Accept
                </button>
                
                <button 
                  className="friend-request__reject-btn"
                  style={{
                    backgroundColor: currentTheme.colors.danger,
                    color: currentTheme.colors.textLight,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 16px',
                    borderRadius: '20px',
                    border: 'none',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onClick={() => handleRejectRequest(friend)}
                >
                  <i className="fas fa-times"></i>
                  Reject
                </button>
              </div>
            </div>
          ))}
          
          {/* Blocked users view */}
          {currentFilter === 'blocked' && displayedFriends.map(friend => (
            <div 
              key={friend.id} 
              className="blocked-user"
              style={{
                backgroundColor: currentTheme.colors.card,
                display: 'flex',
                alignItems: 'center',
                padding: '12px 16px',
                borderRadius: '12px',
                transition: 'all 0.2s ease'
              }}
            >
              <div 
                className="blocked-user__avatar"
                style={{
                  backgroundColor: currentTheme.colors.backgroundLight,
                  color: currentTheme.colors.textPrimary,
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden'
                }}
              >
                <i className="fas fa-user-slash"></i>
              </div>
              
              <div 
                className="blocked-user__info"
                style={{
                  marginLeft: '16px',
                  flex: 1
                }}
              >
                <div 
                  className="blocked-user__name"
                  style={{ 
                    color: currentTheme.colors.textPrimary,
                    fontSize: '1rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  {friend.displayName}
                </div>
              </div>
              
              <div 
                className="blocked-user__actions"
                style={{
                  display: 'flex',
                  gap: '8px'
                }}
              >
                <button 
                  className="blocked-user__unblock-btn"
                  style={{
                    backgroundColor: currentTheme.colors.warning,
                    color: currentTheme.colors.textLight,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 16px',
                    borderRadius: '20px',
                    border: 'none',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onClick={() => onMoreActions(friend)}
                >
                  <i className="fas fa-unlock"></i>
                  Unblock
                </button>
              </div>
            </div>
          ))}
          
          {/* Load more button */}
          {hasMore && (
            <div 
              className="friends-list__load-more"
              style={{
                display: 'flex',
                justifyContent: 'center',
                marginTop: '20px'
              }}
            >
              <button 
                className="friends-list__load-more-btn"
                disabled={isLoadingMore}
                style={{
                  backgroundColor: isLoadingMore ? currentTheme.colors.disabled : currentTheme.colors.secondary,
                  color: currentTheme.colors.textLight,
                  padding: '8px 24px',
                  borderRadius: '20px',
                  border: 'none',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  cursor: isLoadingMore ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onClick={onLoadMore}
              >
                {isLoadingMore ? (
                  <i className="fas fa-circle-notch fa-spin"></i>
                ) : (
                  <span>Load More</span>
                )}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
});

export default FriendsList; 