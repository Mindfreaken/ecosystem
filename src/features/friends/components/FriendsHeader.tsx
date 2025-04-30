import React, { useState } from 'react';
import { useTheme } from '../../theme';
import { FriendFilterType, FriendFilter } from '../types';
import { FriendCodeModal } from '../index';
import { AddFriendModal } from '../index';

interface FriendsHeaderProps {
  currentFilter: FriendFilterType;
  setCurrentFilter: (filter: FriendFilterType) => void;
  pendingRequestsCount: number;
  unreadRequestsCount: number;
  filters: FriendFilter[];
}

const FriendsHeader: React.FC<FriendsHeaderProps> = ({
  currentFilter,
  setCurrentFilter,
  unreadRequestsCount,
  filters,
}) => {
  const { currentTheme } = useTheme();
  
  // Modal states
  const [showFriendCodeModal, setShowFriendCodeModal] = useState(false);
  const [showAddFriendModal, setShowAddFriendModal] = useState(false);
  
  // Handle friend added from the modal
  const handleFriendAdded = () => {
    // Any additional logic needed when a friend is added
    // This could refresh friend lists or update counters
  };

  return (
    <div 
      className="friends-header"
      style={{
        backgroundColor: currentTheme.colors.card,
        borderBottom: `1px solid ${currentTheme.colors.border}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '6.75px 24px'
      }}
    >
      {/* Left section - Friend Code button */}
      <div className="friends-header__left-section">
        <button 
          className="friends-header__friend-code-btn"
          style={{
            backgroundColor: 'transparent',
            color: currentTheme.colors.textPrimary,
            borderColor: currentTheme.colors.border,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            borderRadius: '16px',
            border: '1px solid',
            fontSize: '0.8125rem',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onClick={() => setShowFriendCodeModal(true)}
        >
          <i className="fas fa-id-card"></i>
          Friend Code
        </button>
      </div>

      {/* Center Section - Filters */}
      <div 
        className="friends-header__filters"
        style={{
          display: 'flex',
          gap: '8px'
        }}
      >
        {filters.map(filter => (
          <button
            key={filter.id}
            className={`friends-header__filter-btn ${
              filter.id === currentFilter ? 'friends-header__filter-btn--active' : ''
            } ${
              filter.id === 'pending' && unreadRequestsCount > 0 ? 'friends-header__filter-btn--has-unread' : ''
            }`}
            data-pending-filter={filter.id === 'pending' ? 'true' : 'false'}
            style={{
              backgroundColor: filter.id === currentFilter ? currentTheme.colors.primary : 'transparent',
              color: filter.id === currentFilter ? currentTheme.colors.textLight : currentTheme.colors.textPrimary,
              borderColor: filter.id === currentFilter ? currentTheme.colors.primary : currentTheme.colors.border,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '16px',
              border: '1px solid',
              fontSize: '0.8125rem',
              fontWeight: filter.id === currentFilter ? 600 : 500,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              position: 'relative'
            }}
            onClick={() => setCurrentFilter(filter.id)}
          >
            <i className={filter.icon}></i>
            {filter.label}
            {filter.count > 0 && (
              <span 
                className="friends-header__filter-count"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginLeft: '4px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  minWidth: '14px'
                }}
              >
                {filter.count}
              </span>
            )}
            {filter.id === 'pending' && unreadRequestsCount > 0 && (
              <span 
                className="friends-header__unread-indicator"
                data-notification-type="friend-requests-filter"
                style={{
                  position: 'absolute',
                  top: '-6px',
                  right: '-6px',
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  fontSize: '0.625rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  backgroundColor: currentTheme.colors.danger
                }}
              >
                {unreadRequestsCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Right Section - Add Friend button */}
      <div 
        className="friends-header__actions"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}
      >
        <button 
          className="friends-header__add-btn"
          style={{
            backgroundColor: currentTheme.colors.primary,
            color: currentTheme.colors.textLight,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            borderRadius: '16px',
            border: 'none',
            fontSize: '0.8125rem',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onClick={() => setShowAddFriendModal(true)}
        >
          <i className="fas fa-user-plus"></i>
          Add Friend
        </button>
      </div>
      
      {/* Friend Code Modal */}
      {showFriendCodeModal && (
        <FriendCodeModal 
          show={showFriendCodeModal} 
          onClose={() => setShowFriendCodeModal(false)} 
        />
      )}
      
      {/* Add Friend Modal */}
      {showAddFriendModal && (
        <AddFriendModal 
          show={showAddFriendModal} 
          onClose={() => setShowAddFriendModal(false)} 
          onFriendAdded={handleFriendAdded}
        />
      )}
    </div>
  );
};

export default FriendsHeader; 