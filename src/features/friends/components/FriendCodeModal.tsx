import React, { useState, useEffect } from 'react';
import { useTheme } from '../../theme';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { useAuth } from '../../auth/hooks/useAuth';

interface FriendCodeModalProps {
  show: boolean;
  onClose: () => void;
}

const FriendCodeModal: React.FC<FriendCodeModalProps> = ({ 
  show, 
  onClose
}) => {
  const { currentTheme } = useTheme();
  const { user } = useAuth();
  
  // Component state
  const [showActualCode, setShowActualCode] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Get the Firebase user ID
  const firebaseUserId = user?.id || "";

  // Convex queries and mutations
  const activeCode = useQuery(api.friendCodes.getActiveCode, { userId: firebaseUserId });
  const generateNewCode = useMutation(api.friendCodes.generateNewCode).withOptimisticUpdate(
    (localStore, args: { userId: string }) => {
      localStore.setQuery(
        api.friendCodes.getActiveCode,
        { userId: args.userId },
        null
      );
    }
  );

  // Helper to convert hex to rgb for background opacity
  const hexToRgb = (hex: string) => {
    hex = hex.replace(/^#/, '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `${r}, ${g}, ${b}`;
  };

  // Computed styles
  const successBackgroundColor = `rgba(${hexToRgb(currentTheme.colors.success)}, 0.1)`;
  const errorBackgroundColor = `rgba(${hexToRgb(currentTheme.colors.danger)}, 0.1)`;

  // Methods
  const handleToggleCodeVisibility = () => {
    if (!activeCode) return;
    setShowActualCode(!showActualCode);
  };

  const handleCopyCode = async () => {
    if (!activeCode) return;

    try {
      await navigator.clipboard.writeText(activeCode.code);
      showSuccessMessage('Friend code copied to clipboard');
    } catch (error) {
      console.error('Error copying friend code:', error);
      setShowActualCode(true);
      showErrorMessage('Please copy the code manually');
    }
  };

  const handleGenerateCode = async () => {
    if (!firebaseUserId) {
      showErrorMessage('You must be logged in to generate a friend code');
      return;
    }

    try {
      const newCode = await generateNewCode({ userId: firebaseUserId });
      setShowActualCode(false);

      try {
        if (newCode) {
          await navigator.clipboard.writeText(newCode.code);
          showSuccessMessage('New friend code generated and copied to clipboard');
        } else {
          showSuccessMessage('New friend code generated');
        }
      } catch (clipboardError) {
        console.debug('Clipboard error:', clipboardError);
        showSuccessMessage('New friend code generated');
      }
    } catch (error) {
      console.error('Error generating friend code:', error);
      showErrorMessage('Failed to generate friend code. Please try again later.');
    }
  };

  // Helper to show success message
  const showSuccessMessage = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 5000);
  };

  // Helper to show error message
  const showErrorMessage = (message: string) => {
    setErrorMessage(message);
    setTimeout(() => setErrorMessage(''), 5000);
  };

  // Generate initial friend code if none exists
  useEffect(() => {
    if (show && firebaseUserId && activeCode === null) {
      handleGenerateCode();
    }
  }, [show, firebaseUserId, activeCode]);

  if (!show) return null;

  const isLoading = activeCode === undefined;

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
        className="friend-code-modal" 
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '480px',
          borderRadius: '8px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
          display: 'flex',
          flexDirection: 'column',
          border: `1px solid ${currentTheme.colors.border}`,
          backgroundColor: currentTheme.colors.card,
          color: currentTheme.colors.textPrimary
        }}
      >
        <div 
          className="friend-code-modal__header"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 20px',
            borderBottom: `1px solid ${currentTheme.colors.border}`
          }}
        >
          <h2 
            className="friend-code-modal__title"
            style={{
              fontSize: '1.25rem',
              fontWeight: 600,
              margin: 0
            }}
          >
            My Friend Code
          </h2>
          <button 
            className="friend-code-modal__close-btn"
            onClick={onClose}
            style={{
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: 'none',
              background: 'transparent',
              borderRadius: '50%',
              cursor: 'pointer',
              color: currentTheme.colors.textSecondary
            }}
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div 
          className="friend-code-modal__content"
          style={{
            padding: '16px 20px'
          }}
        >
          <p 
            className="friend-code-modal__info"
            style={{
              fontSize: '0.875rem',
              marginBottom: '20px',
              color: currentTheme.colors.textSecondary
            }}
          >
            Share your friend code to let others add you as a friend. You can generate a new code at any time.
            Each code can only be used once.
          </p>

          <div className="friend-code-section">
            <div className="friend-code-display">
              <span 
                className="friend-code-label"
                style={{ 
                  fontSize: '0.75rem',
                  color: currentTheme.colors.textSecondary
                }}
              >
                My Friend Code:
              </span>
              <div 
                className="friend-code-value"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 12px',
                  marginTop: '6px',
                  borderRadius: '6px',
                  border: `1px solid ${currentTheme.colors.border}`,
                  backgroundColor: currentTheme.colors.backgroundLight
                }}
              >
                <span
                  style={{ 
                    fontFamily: 'monospace',
                    fontSize: '1rem',
                    fontWeight: 600,
                    letterSpacing: '0.5px',
                    minWidth: '120px',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    transition: 'all 0.2s ease',
                    userSelect: 'all',
                    color: currentTheme.colors.textPrimary,
                    cursor: activeCode ? 'pointer' : 'default',
                    opacity: isLoading ? 0.7 : 1
                  }}
                >
                  {isLoading ? 'Loading...' : 
                   showActualCode ? activeCode?.code : 
                   activeCode?.code ? '••••••••' : 'No code generated'}
                </span>
                <div 
                  className="friend-code-actions"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <button
                    onClick={handleToggleCodeVisibility}
                    className="action-btn"
                    title={showActualCode ? 'Hide code' : 'Show code'}
                    disabled={!activeCode || isLoading}
                    style={{
                      width: '30px',
                      height: '30px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: 'none',
                      background: 'transparent',
                      cursor: !activeCode || isLoading ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s ease',
                      color: currentTheme.colors.textSecondary,
                      opacity: !activeCode || isLoading ? 0.5 : 1
                    }}
                  >
                    <i className={showActualCode ? 'fas fa-eye-slash' : 'fas fa-eye'}></i>
                  </button>
                  {activeCode && (
                    <button
                      onClick={handleCopyCode}
                      className="action-btn"
                      title="Copy code"
                      disabled={isLoading}
                      style={{
                        width: '30px',
                        height: '30px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: 'none',
                        background: 'transparent',
                        cursor: isLoading ? 'not-allowed' : 'pointer',
                        transition: 'all 0.2s ease',
                        color: currentTheme.colors.textSecondary,
                        opacity: isLoading ? 0.5 : 1
                      }}
                    >
                      <i className="fas fa-copy"></i>
                    </button>
                  )}
                  <button
                    onClick={handleGenerateCode}
                    className="action-btn"
                    disabled={isLoading}
                    title={isLoading ? 'Loading...' : (activeCode ? 'Generate new code' : 'Generate code')}
                    style={{
                      width: '30px',
                      height: '30px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: 'none',
                      background: 'transparent',
                      cursor: isLoading ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s ease',
                      color: currentTheme.colors.textSecondary,
                      opacity: isLoading ? 0.5 : 1
                    }}
                  >
                    <i className="fas fa-sync-alt"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {successMessage && (
            <div 
              className="friend-code-modal__success"
              style={{
                marginTop: '16px',
                fontSize: '0.875rem',
                padding: '8px 12px',
                borderRadius: '6px',
                backgroundColor: successBackgroundColor,
                color: currentTheme.colors.success
              }}
            >
              {successMessage}
            </div>
          )}

          {errorMessage && (
            <div 
              className="friend-code-modal__error"
              style={{
                marginTop: '16px',
                fontSize: '0.875rem',
                padding: '8px 12px',
                borderRadius: '6px',
                backgroundColor: errorBackgroundColor,
                color: currentTheme.colors.danger
              }}
            >
              {errorMessage}
            </div>
          )}
        </div>

        <div 
          className="friend-code-modal__footer"
          style={{
            padding: '16px 20px',
            display: 'flex',
            justifyContent: 'flex-end',
            borderTop: `1px solid ${currentTheme.colors.border}`
          }}
        >
          <button 
            className="friend-code-modal__done-btn"
            onClick={onClose}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              fontSize: '0.875rem',
              fontWeight: 500,
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              backgroundColor: currentTheme.colors.primary,
              color: currentTheme.colors.textLight
            }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default FriendCodeModal; 