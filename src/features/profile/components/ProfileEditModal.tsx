import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../../theme/components/ThemeProvider';
import AvatarPicker from './AvatarPicker';
import CoverPicker from './CoverPicker';
import { DEFAULT_AVATAR_URL, DEFAULT_COVER_URL } from '../constants/defaultImages';
import { Id } from '../../../../convex/_generated/dataModel';

// Define ProfileData interface locally since we can't import it
export interface ProfileData {
  id: Id<"users">;
  displayName: string;
  username: string;
  email: string;
  bio?: string;
  avatarUrl: string | null | undefined;
  coverUrl: string | null | undefined;
  customStatus?: string;
  // Add other fields as needed
}

// Form validation errors
interface FormErrors {
  username: string;
  displayName: string;
}

interface ProfileEditModalProps {
  profile: ProfileData;
  isOpen: boolean;
  onClose: () => void;
  onUpdated: (updatedProfile: ProfileData) => void;
}

const ProfileEditModal: React.FC<ProfileEditModalProps> = ({
  profile,
  isOpen,
  onClose,
  onUpdated
}) => {
  // Get current theme
  const { currentTheme } = useTheme();
  
  // State
  const [formData, setFormData] = useState<ProfileData>({...profile});
  
  const [formErrors, setFormErrors] = useState<FormErrors>({
    username: '',
    displayName: ''
  });
  
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [showCoverPicker, setShowCoverPicker] = useState(false);
  
  const [updateStatus, setUpdateStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  
  const isMounted = useRef(true);
  
  // Initialize form with current profile data
  useEffect(() => {
    if (profile) {
      setFormData({...profile});
    }
  }, [profile]);
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);
  
  // Form validation
  const validateForm = () => {
    const errors: FormErrors = {
      username: '',
      displayName: ''
    };
    
    // Username validation
    if (!formData.username) {
      errors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      errors.username = 'Username must be at least 3 characters';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      errors.username = 'Username can only contain letters, numbers, and underscores';
    }
    
    // Display name validation
    if (!formData.displayName) {
      errors.displayName = 'Display name is required';
    } else if (formData.displayName.length < 2) {
      errors.displayName = 'Display name must be at least 2 characters';
    }
    
    setFormErrors(errors);
    return !errors.username && !errors.displayName;
  };
  
  // Check if form is valid
  const isFormValid = !formErrors.username && !formErrors.displayName && 
    formData.username && formData.displayName;
  
  // Event handlers
  const handleClose = () => {
    // Reset form and errors
    setErrorMessage('');
    setUpdateStatus('idle');
    onClose();
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Validate on change
    validateForm();
  };
  
  const handleAvatarSelected = (url: string) => {
    setFormData(prev => ({
      ...prev,
      avatarUrl: url
    }));
  };
  
  const handleCoverSelected = (url: string) => {
    setFormData(prev => ({
      ...prev,
      coverUrl: url
    }));
  };
  
  const saveChanges = async () => {
    if (!isFormValid) return;
    
    setUpdateStatus('loading');
    setErrorMessage('');
    
    try {
      // In a real app, this would be an API call
      // For now, we'll just simulate a delay and return the updated data
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Simulate updated user
      const updatedUser: ProfileData = {
        ...formData
      };
      
      // Check if component is still mounted
      if (isMounted.current) {
        setUpdateStatus('success');
        
        // Emit event with updated user
        onUpdated(updatedUser);
        
        // Close modal
        handleClose();
      }
    } catch (error: unknown) {
      // Check if component is still mounted
      if (isMounted.current) {
        setUpdateStatus('error');
        setErrorMessage(error instanceof Error 
          ? error.message 
          : 'An error occurred while updating your profile');
        console.error('Profile update error:', error);
      }
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div 
      className="profile-edit-modal-backdrop" 
      onClick={handleClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: `${currentTheme.colors.backgroundDark}D9`, // D9 = 85% opacity
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 55,
        backdropFilter: 'blur(4px)'
      }}
    >
      <div 
        className="profile-edit-modal-container"
        onClick={e => e.stopPropagation()}
        style={{
          maxWidth: '95%',
          maxHeight: '90vh',
          width: '400px'
        }}
      >
        <div 
          className="profile-edit-modal-content"
          style={{
            backgroundColor: currentTheme.colors.backgroundDark,
            borderRadius: '12px',
            boxShadow: `0 8px 16px ${currentTheme.colors.shadow}`,
            border: `1px solid ${currentTheme.colors.borderLight}40`, // Added border with 25% opacity
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            maxHeight: '90vh',
            color: currentTheme.colors.textLight
          }}
        >
          <div 
            className="profile-edit-modal-header"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '10px 16px',
              borderBottom: `1px solid ${currentTheme.colors.borderLight}20`, // 20 = 12% opacity
              flexShrink: 0
            }}
          >
            <h3 
              className="profile-edit-modal-title"
              style={{
                fontSize: '17px',
                fontWeight: 600,
                color: currentTheme.colors.textLight,
                margin: 0
              }}
            >
              Edit Profile
            </h3>
            <button 
              onClick={handleClose}
              className="profile-edit-modal-close"
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: '4px',
                color: `${currentTheme.colors.textLight}99`, // 99 = 60% opacity
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%',
                transition: 'all 0.2s ease'
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div 
            className="profile-edit-form"
            style={{
              padding: 0,
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              flexGrow: 1,
              position: 'relative'
            }}
          >
            {/* Cover image section */}
            <div 
              className="cover-image-section"
              style={{
                width: '100%',
                flexShrink: 0,
                position: 'relative'
              }}
            >
              <div 
                className="cover-image-preview"
                style={{
                  height: '120px',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundImage: `url(${formData.coverUrl || DEFAULT_COVER_URL})`
                }}
              >
                <button 
                  onClick={() => setShowCoverPicker(true)} 
                  className="change-cover-btn"
                  style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.6)',
                    color: 'white',
                    border: 'none',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.2s ease',
                    fontWeight: 500,
                    fontSize: '13px',
                    zIndex: 2
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 16V4a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v12" />
                    <polyline points="3 16 8 13 13 16 18 13 22 16" />
                  </svg>
                  Change Cover
                </button>
              </div>
            </div>
            
            {/* Avatar section */}
            <div 
              className="avatar-section"
              style={{
                position: 'absolute',
                top: '75px',
                left: '20px',
                zIndex: 2,
                display: 'flex',
                alignItems: 'flex-end',
                gap: '10px'
              }}
            >
              <div 
                className="avatar-preview-container"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center'
                }}
              >
                <img 
                  src={formData.avatarUrl || DEFAULT_AVATAR_URL} 
                  alt="Profile avatar"
                  className="avatar-preview"
                  style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: `3px solid ${currentTheme.colors.backgroundDark}`,
                    boxShadow: `0 2px 8px ${currentTheme.colors.shadow}`,
                    backgroundColor: currentTheme.colors.backgroundLight
                  }}
                />
              </div>
              <button 
                onClick={() => setShowAvatarPicker(true)} 
                className="change-avatar-btn"
                style={{
                  backgroundColor: `${currentTheme.colors.backgroundAlt}B3`, // B3 = 70% opacity
                  color: currentTheme.colors.textLight,
                  border: 'none',
                  padding: '6px 10px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  transition: 'all 0.2s ease',
                  fontWeight: 500,
                  whiteSpace: 'nowrap',
                  justifyContent: 'center'
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                Change Avatar
              </button>
            </div>
            
            {/* Profile info section */}
            <div 
              className="profile-info-section"
              style={{
                padding: '14px 20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
                overflowY: 'auto',
                flexGrow: 1,
                marginTop: '55px',
                minHeight: '300px'
              }}
            >
              <div 
                className="form-field"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px'
                }}
              >
                <label 
                  htmlFor="displayName" 
                  className="form-label"
                  style={{
                    fontSize: '13px',
                    fontWeight: 600,
                    color: `${currentTheme.colors.textLight}CC` // CC = 80% opacity
                  }}
                >
                  Display Name
                </label>
                <input
                  id="displayName"
                  name="displayName"
                  value={formData.displayName}
                  onChange={handleInputChange}
                  type="text"
                  className="form-input"
                  maxLength={30}
                  placeholder="Your display name"
                  style={{
                    padding: '8px 12px',
                    backgroundColor: currentTheme.colors.backgroundAlt,
                    border: `1px solid ${currentTheme.colors.borderLight}`,
                    borderRadius: '6px',
                    color: currentTheme.colors.textLight,
                    fontSize: '14px',
                    transition: 'all 0.2s ease',
                    outline: 'none'
                  }}
                />
                <div 
                  className="character-count"
                  style={{
                    textAlign: 'right',
                    fontSize: '11px',
                    color: `${currentTheme.colors.textLight}80` // 80 = 50% opacity
                  }}
                >
                  {formData.displayName?.length || 0}/30
                </div>
                {formErrors.displayName && (
                  <div 
                    className="form-error"
                    style={{
                      fontSize: '11px',
                      color: currentTheme.colors.danger
                    }}
                  >
                    {formErrors.displayName}
                  </div>
                )}
              </div>
              
              <div 
                className="form-field"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px'
                }}
              >
                <label 
                  htmlFor="username" 
                  className="form-label"
                  style={{
                    fontSize: '13px',
                    fontWeight: 600,
                    color: `${currentTheme.colors.textLight}CC` // CC = 80% opacity
                  }}
                >
                  Username
                </label>
                <div 
                  className="username-input"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: currentTheme.colors.backgroundAlt,
                    border: `1px solid ${currentTheme.colors.borderLight}`,
                    borderRadius: '6px',
                    overflow: 'hidden'
                  }}
                >
                  <span 
                    className="username-prefix"
                    style={{
                      padding: '0 0 0 14px',
                      color: `${currentTheme.colors.textLight}99`, // 99 = 60% opacity
                      fontSize: '15px'
                    }}
                  >
                    @
                  </span>
                  <input
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    type="text"
                    className="username-field"
                    maxLength={20}
                    placeholder="username"
                    style={{
                      border: 'none',
                      borderRadius: 0,
                      paddingLeft: '4px',
                      flexGrow: 1,
                      backgroundColor: 'transparent',
                      padding: '10px 14px 10px 4px',
                      color: currentTheme.colors.textLight,
                      fontSize: '15px',
                      outline: 'none'
                    }}
                  />
                </div>
                <div 
                  className="character-count"
                  style={{
                    textAlign: 'right',
                    fontSize: '11px',
                    color: `${currentTheme.colors.textLight}80` // 80 = 50% opacity
                  }}
                >
                  {formData.username?.length || 0}/20
                </div>
                {formErrors.username && (
                  <div 
                    className="form-error"
                    style={{
                      fontSize: '11px',
                      color: currentTheme.colors.danger
                    }}
                  >
                    {formErrors.username}
                  </div>
                )}
              </div>
              
              <div 
                className="form-field"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px'
                }}
              >
                <label 
                  htmlFor="bio" 
                  className="form-label"
                  style={{
                    fontSize: '13px',
                    fontWeight: 600,
                    color: `${currentTheme.colors.textLight}CC` // CC = 80% opacity
                  }}
                >
                  Bio
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  className="form-textarea"
                  rows={3}
                  maxLength={160}
                  placeholder="Tell us about yourself"
                  style={{
                    padding: '8px 12px',
                    backgroundColor: currentTheme.colors.backgroundAlt,
                    border: `1px solid ${currentTheme.colors.borderLight}`,
                    borderRadius: '6px',
                    color: currentTheme.colors.textLight,
                    fontSize: '14px',
                    transition: 'all 0.2s ease',
                    resize: 'vertical',
                    minHeight: '80px',
                    maxHeight: '120px',
                    outline: 'none'
                  }}
                ></textarea>
                <div 
                  className="character-count"
                  style={{
                    textAlign: 'right',
                    fontSize: '11px',
                    color: `${currentTheme.colors.textLight}80`, // 80 = 50% opacity
                    marginTop: '-4px'
                  }}
                >
                  {formData.bio?.length || 0}/160
                </div>
              </div>
              
              <div 
                className="form-field"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px'
                }}
              >
                <label 
                  htmlFor="customStatus" 
                  className="form-label"
                  style={{
                    fontSize: '13px',
                    fontWeight: 600,
                    color: `${currentTheme.colors.textLight}CC` // CC = 80% opacity
                  }}
                >
                  Status Message
                </label>
                <input
                  id="customStatus"
                  name="customStatus"
                  value={formData.customStatus}
                  onChange={handleInputChange}
                  type="text"
                  className="form-input"
                  maxLength={50}
                  placeholder="What are you up to?"
                  style={{
                    padding: '8px 12px',
                    backgroundColor: currentTheme.colors.backgroundAlt,
                    border: `1px solid ${currentTheme.colors.borderLight}`,
                    borderRadius: '6px',
                    color: currentTheme.colors.textLight,
                    fontSize: '14px',
                    transition: 'all 0.2s ease',
                    outline: 'none'
                  }}
                />
                <div 
                  className="character-count"
                  style={{
                    textAlign: 'right',
                    fontSize: '11px',
                    color: `${currentTheme.colors.textLight}80` // 80 = 50% opacity
                  }}
                >
                  {formData.customStatus?.length || 0}/50
                </div>
              </div>
            </div>
            
            {/* Form actions */}
            <div 
              className="form-actions"
              style={{
                padding: '10px 14px',
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '8px',
                borderTop: `1px solid ${currentTheme.colors.borderLight}20`, // 20 = 12% opacity
                marginTop: 'auto',
                flexShrink: 0
              }}
            >
              {updateStatus === 'error' && (
                <div 
                  className="update-error"
                  style={{
                    color: currentTheme.colors.danger,
                    fontSize: '13px',
                    marginRight: 'auto'
                  }}
                >
                  {errorMessage}
                </div>
              )}
              <button 
                onClick={handleClose}
                className="cancel-btn"
                style={{
                  padding: '8px 16px',
                  backgroundColor: currentTheme.colors.backgroundAlt,
                  color: currentTheme.colors.textLight,
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: 500,
                  transition: 'all 0.2s ease',
                  fontSize: '14px'
                }}
              >
                Cancel
              </button>
              <button 
                onClick={saveChanges}
                className="save-btn"
                disabled={!isFormValid || updateStatus === 'loading'}
                style={{
                  padding: '8px 16px',
                  backgroundColor: currentTheme.colors.primary,
                  color: currentTheme.colors.textLight,
                  border: 'none',
                  borderRadius: '6px',
                  cursor: isFormValid && updateStatus !== 'loading' ? 'pointer' : 'not-allowed',
                  fontWeight: 500,
                  transition: 'all 0.2s ease',
                  fontSize: '14px',
                  opacity: isFormValid && updateStatus !== 'loading' ? 1 : 0.6
                }}
              >
                {updateStatus === 'loading' ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Avatar picker component */}
      <AvatarPicker 
        isOpen={showAvatarPicker}
        currentAvatar={formData.avatarUrl || ''}
        onClose={() => setShowAvatarPicker(false)}
        onSelect={handleAvatarSelected}
      />
      
      {/* Cover picker component */}
      <CoverPicker 
        isOpen={showCoverPicker}
        currentCover={formData.coverUrl || ''}
        onClose={() => setShowCoverPicker(false)}
        onSelect={handleCoverSelected}
      />
    </div>
  );
};

export default ProfileEditModal; 