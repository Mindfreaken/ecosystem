import React, { ReactNode } from 'react';
import { useTheme } from '../../theme';

interface FriendsPageLayoutProps {
  children: ReactNode;
}

const FriendsPageLayout: React.FC<FriendsPageLayoutProps> = ({ children }) => {
  const { currentTheme } = useTheme();

  return (
    <div 
      className="friends-page" 
      style={{
        backgroundColor: currentTheme.colors.backgroundAlt,
        color: currentTheme.colors.textPrimary,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%',
        overflow: 'hidden',
        transition: 'all 0.3s ease'
      }}
    >
      {children}
    </div>
  );
};

export default FriendsPageLayout; 