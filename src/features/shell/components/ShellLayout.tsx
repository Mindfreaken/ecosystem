import React, { useState } from 'react';
import { useTheme } from '../../theme';
import ShellHeader from './ShellHeader.tsx';
import ShellPrimarySidebar from './ShellPrimarySidebar.tsx';
import ShellContextSidebar from './ShellContextSidebar.tsx';
import ShellContent from './ShellContent.tsx';
import ShellQuickAccess from './ShellQuickAccess.tsx';
import '../styles/Shell.css';

type ShellLayoutProps = {
  children?: React.ReactNode;
};

const ShellLayout: React.FC<ShellLayoutProps> = ({ children }) => {
  const { currentTheme } = useTheme();
  
  // Reactive state to control visibility of components
  const [showPrimarySidebar] = useState(true);
  const [showContextSidebar] = useState(true);
  const [showQuickAccess] = useState(true);
  const [isContextSidebarCollapsed, setIsContextSidebarCollapsed] = useState(false);

  // Handle the context sidebar collapse state
  const handleContextSidebarCollapseChange = (collapsed: boolean) => {
    setIsContextSidebarCollapsed(collapsed);
  };

  return (
    <div 
      className="shell-layout"
      style={{
        backgroundColor: currentTheme.colors.background,
        color: currentTheme.colors.textPrimary
      }}
    >
      <ShellHeader />
      
      <div className="shell-main-container">
        {showPrimarySidebar && <ShellPrimarySidebar />}
        
        <ShellContent 
          className={`
            ${showContextSidebar && !isContextSidebarCollapsed ? 'shell-content--with-context' : ''}
            ${showContextSidebar && isContextSidebarCollapsed ? 'shell-content--with-collapsed-context' : ''}
          `}
        >
          {children}
        </ShellContent>
        
        {showContextSidebar && (
          <ShellContextSidebar 
            onCollapseChanged={handleContextSidebarCollapseChange}
          />
        )}
      </div>
      
      {showQuickAccess && <ShellQuickAccess />}
    </div>
  );
};

export default ShellLayout; 