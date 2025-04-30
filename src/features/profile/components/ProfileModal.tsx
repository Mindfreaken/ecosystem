import React, { useState } from 'react';
import { useTheme } from '../../theme/components/ThemeProvider';
import { Id } from '../../../../convex/_generated/dataModel';
import ProfileFullView from './ProfileFullView';
import ProfileCardView from './ProfileCardView';
import { useAuth } from '../../auth/hooks/useAuth';

interface ProfileModalProps {
  userId: Id<"users">;
  isOpen: boolean;
  initialViewMode?: 'card' | 'full';
  onClose: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({
  userId,
  isOpen,
  initialViewMode = 'full',
  onClose
}) => {
  const { currentTheme } = useTheme();
  const { user } = useAuth();
  const [viewMode] = useState<'card' | 'full'>(initialViewMode);
  
  // Determine if the profile belongs to the current user
  const isCurrentUser = user?.id === userId;

  if (!isOpen) return null;

  return (
    <div 
      className="profile-modal-overlay"
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: `${currentTheme.colors.backgroundDark}D9`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 50,
        backdropFilter: 'blur(4px)',
        transition: 'all 0.3s ease'
      }}
    >
      <div 
        className="profile-modal"
        onClick={e => e.stopPropagation()}
        style={{
          position: 'relative',
          maxWidth: '95%',
          maxHeight: '95vh',
          transition: 'all 0.3s ease',
          overflow: 'hidden',
          boxShadow: `0 10px 25px ${currentTheme.colors.shadow}`,
          borderRadius: '12px',
          width: viewMode === 'card' ? '320px' : '800px',
          height: viewMode === 'card' ? '550px' : '80vh',
          animation: 'scaleIn 0.3s ease forwards'
        }}
      >
        {viewMode === 'card' ? (
          <ProfileCardView userId={userId} isCurrentUser={isCurrentUser} />
        ) : (
          <ProfileFullView userId={userId} isCurrentUser={isCurrentUser} />
        )}
      </div>
    </div>
  );
};

export default ProfileModal; 