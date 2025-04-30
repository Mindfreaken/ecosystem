import React from 'react';
import { useTheme } from '../../theme';
import '../styles/UnderConstruction.css';

interface UnderConstructionProps {
  pageName?: string;
}

const UnderConstruction: React.FC<UnderConstructionProps> = ({ pageName = 'Page' }) => {
  const { currentTheme } = useTheme();
  
  return (
    <div className="under-construction" style={{
      backgroundColor: currentTheme.colors.background,
      color: currentTheme.colors.textPrimary
    }}>
      <div className="under-construction-content" style={{
        borderColor: currentTheme.colors.border,
        backgroundColor: `${currentTheme.colors.backgroundLight}10`
      }}>
        <div className="under-construction-icon">
          <i className="fas fa-hard-hat"></i>
          <div className="under-construction-cogs">
            <i className="fas fa-cog under-construction-cog under-construction-cog-small"></i>
            <i className="fas fa-cog under-construction-cog under-construction-cog-large"></i>
          </div>
        </div>
        
        <h1 className="under-construction-title" style={{ color: currentTheme.colors.primary }}>
          {pageName} - Under Construction
        </h1>
        
        <p className="under-construction-message">
          We're actively building this feature to provide the best experience possible.
        </p>
        
        <div className="under-construction-discord">
          <i className="fab fa-discord"></i>
          <p>Please share your wants and needs for this page in our 
            <a href="https://discord.gg/yourserver" 
               target="_blank" 
               rel="noopener noreferrer" 
               style={{ color: currentTheme.colors.primary }}>
              {" Discord server"}
            </a>
          </p>
        </div>
        
        <div className="under-construction-progress">
          <div 
            className="under-construction-progress-bar" 
            style={{ 
              backgroundColor: currentTheme.colors.primary
            }}
          ></div>
          <span className="under-construction-progress-text">Development in progress...</span>
        </div>
      </div>
    </div>
  );
};

export default UnderConstruction; 