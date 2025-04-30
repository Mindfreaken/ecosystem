import React from 'react';
import { useTheme } from '../../theme';

type ShellMainContainerProps = {
  children: React.ReactNode;
};

const ShellMainContainer: React.FC<ShellMainContainerProps> = ({ children }) => {
  const { currentTheme } = useTheme();

  return (
    <div 
      className="shell-main-container"
      style={{
        backgroundColor: currentTheme.colors.background,
      }}
    >
      {children}
    </div>
  );
};

export default ShellMainContainer; 