import React, { useState } from 'react';
import { useTheme } from '../../theme';
import { useAuth } from '../../auth/hooks/useAuth';
import { useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';

interface AddFriendModalProps {
  show: boolean;
  onClose: () => void;
  onFriendAdded: () => void;
}

const AddFriendModal: React.FC<AddFriendModalProps> = ({ 
  show, 
  onClose,
  onFriendAdded
}) => {
  const { currentTheme } = useTheme();
  const { user } = useAuth();
  
  // Component state
  const [codeInput, setCodeInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  // Convex mutations
  const addFriend = useMutation(api.friends.addFriendByCode);
  
  // Handle sending friend request
  const handleSendRequest = async () => {
    if (isSubmitting || !codeInput.trim() || !user?.id) return;
    
    setErrorMessage('');
    setSuccessMessage('');
    setIsSubmitting(true);
    
    try {
      await addFriend({
        userId: user.id,
        code: codeInput.trim().toUpperCase()
      });
      
      setSuccessMessage('Friend request sent successfully');
      setCodeInput('');
      onFriendAdded();
      
      // Auto-close after success
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('Unable to send friend request. Please try again later.');
      }
    } finally {
      setIsSubmitting(false);
    }
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
        className="add-friend-modal" 
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
          className="add-friend-modal__header"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 24px',
            borderBottom: `1px solid ${currentTheme.colors.border}`
          }}
        >
          <h2 
            className="add-friend-modal__title"
            style={{
              fontSize: '1.25rem',
              fontWeight: 600,
              margin: 0
            }}
          >
            Add Friend
          </h2>
          <button 
            className="add-friend-modal__close-btn"
            onClick={onClose}
            style={{
              width: '32px',
              height: '32px',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px',
              borderRadius: '50%',
              color: currentTheme.colors.textMuted
            }}
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        <div 
          className="add-friend-modal__content"
          style={{
            padding: '24px'
          }}
        >
          <div className="add-friend-modal__tab-content">
            <p 
              className="add-friend-modal__info-text" 
              style={{ 
                color: currentTheme.colors.textMuted,
                fontSize: '0.875rem',
                marginBottom: '16px'
              }}
            >
              Enter a friend code to send a request
            </p>
            
            <div 
              className="add-friend-modal__input-group"
              style={{
                display: 'flex',
                gap: '12px'
              }}
            >
              <input 
                value={codeInput}
                onChange={e => setCodeInput(e.target.value)}
                type="text"
                className="add-friend-modal__input"
                placeholder="Enter friend code"
                onKeyUp={e => e.key === 'Enter' && handleSendRequest()}
                style={{
                  flex: 1,
                  padding: '10px 16px',
                  borderRadius: '8px',
                  backgroundColor: currentTheme.colors.backgroundLight,
                  color: currentTheme.colors.textPrimary,
                  borderColor: currentTheme.colors.border,
                  fontSize: '0.875rem',
                  outline: 'none',
                  border: `1px solid ${currentTheme.colors.border}`
                }}
              />
              
              <button 
                className="add-friend-modal__submit-btn"
                disabled={isSubmitting || !codeInput.trim()}
                onClick={handleSendRequest}
                style={{
                  padding: '10px 20px',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  cursor: isSubmitting || !codeInput.trim() ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap',
                  backgroundColor: (isSubmitting || !codeInput.trim()) 
                    ? currentTheme.colors.disabled 
                    : currentTheme.colors.primary,
                  color: currentTheme.colors.textLight
                }}
              >
                {isSubmitting ? (
                  <i className="fas fa-circle-notch fa-spin"></i>
                ) : (
                  <span>Send Request</span>
                )}
              </button>
            </div>
          </div>
          
          {/* Error message */}
          {errorMessage && (
            <div 
              className="add-friend-modal__error"
              style={{ 
                marginTop: '16px',
                fontSize: '0.875rem',
                padding: '8px 12px',
                borderRadius: '6px',
                color: currentTheme.colors.danger,
                backgroundColor: `rgba(${currentTheme.colors.danger}, 0.1)`
              }}
            >
              {errorMessage}
            </div>
          )}
          
          {/* Success message */}
          {successMessage && (
            <div 
              className="add-friend-modal__success"
              style={{ 
                marginTop: '16px',
                fontSize: '0.875rem',
                padding: '8px 12px',
                borderRadius: '6px',
                color: currentTheme.colors.success,
                backgroundColor: `rgba(${currentTheme.colors.success}, 0.1)`
              }}
            >
              {successMessage}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddFriendModal; 