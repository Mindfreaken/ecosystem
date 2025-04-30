import { useState } from 'react';
import { useTheme } from './ThemeProvider';
import { availableThemes, Theme } from '../themes';

export const ThemeToggle = () => {
  const { currentTheme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  // Convert themes object to array for easier mapping
  const themeList = Object.values(availableThemes);

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 bg-gray-200 dark:bg-gray-800 rounded-md flex items-center gap-2"
        style={{ 
          backgroundColor: currentTheme.colors.card,
          color: currentTheme.colors.text,
          border: `1px solid ${currentTheme.colors.border}`
        }}
      >
        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: currentTheme.colors.primary }}></span>
        {currentTheme.name}
      </button>

      {isOpen && (
        <div 
          className="absolute top-full mt-2 w-56 rounded-md shadow-lg z-10"
          style={{ 
            backgroundColor: currentTheme.colors.card,
            border: `1px solid ${currentTheme.colors.border}`
          }}
        >
          <div className="py-1">
            {themeList.map((theme: Theme) => (
              <button
                key={theme.id}
                onClick={() => {
                  setTheme(theme.id);
                  setIsOpen(false);
                }}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                style={{ 
                  backgroundColor: theme.id === currentTheme.id ? currentTheme.colors.backgroundAlt : 'transparent',
                  color: currentTheme.colors.text
                }}
              >
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: theme.colors.primary }}></span>
                  {theme.name}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}; 