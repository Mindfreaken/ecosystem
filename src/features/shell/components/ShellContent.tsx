import React from 'react';
import { useTheme } from '../../theme';
import '../styles/Shell.css';

type ShellContentProps = {
  children?: React.ReactNode;
  className?: string;
};

const ShellContent: React.FC<ShellContentProps> = ({ children, className = '' }) => {
  const { currentTheme } = useTheme();

  return (
    <main 
      className={`shell-content ${className}`}
      style={{
        backgroundColor: currentTheme.colors.background,
        color: currentTheme.colors.textPrimary
      }}
    >
      <div 
        className="shell-content-inner"
        style={{
          backgroundColor: currentTheme.colors.background
        }}
      >
        {children}
      </div>
    </main>
  );
};

export default ShellContent; 