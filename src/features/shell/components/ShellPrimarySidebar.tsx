import React, { useState } from 'react';
import { useTheme } from '../../theme';
import '../styles/ShellPrimarySidebar.css';

const ShellPrimarySidebar: React.FC = () => {
  const { currentTheme } = useTheme();
  const [collapsed, setCollapsed] = useState(false);
  
  // Navigation items with FontAwesome icons and routes
  const navItems = [
    { icon: 'fas fa-home', label: 'Home', to: '/ecc/home' },
    { icon: 'fas fa-users', label: 'Spaces', to: '/ecc/spaces' },
    { icon: 'fas fa-briefcase', label: 'Hire', to: '/ecc/hire' },
    { icon: 'fas fa-play-circle', label: 'View', to: '/ecc/view' },
    { icon: 'fas fa-broadcast-tower', label: 'Live', to: '/ecc/live' },
    { icon: 'fas fa-bullhorn', label: 'Campaigns', to: '/ecc/campaigns' },
    { icon: 'fas fa-money-bill', label: 'Reserve', to: '/ecc/reserve' },
    { icon: 'fas fa-music', label: 'Music', to: '/ecc/music' },
    { icon: 'fas fa-gamepad', label: 'Esports', to: '/ecc/esports' },
  ];
  
  // Featured destination at the bottom
  const featuredDestination = {
    label: 'Ecosystem Hub', 
    icon: 'fas fa-leaf',
    to: '/ecc/ecosystem'
  };

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  return (
    <aside 
      className={`shell-primary-sidebar ${collapsed ? 'shell-primary-sidebar--collapsed' : ''}`}
      style={{
        backgroundColor: currentTheme.colors.backgroundAlt,
        borderRightColor: currentTheme.colors.border,
        color: currentTheme.colors.textSecondary,
        width: collapsed ? '60px' : '240px'
      }}
    >
      <div 
        className="shell-primary-sidebar__toggle"
        onClick={toggleCollapse}
        style={{
          color: currentTheme.colors.textSecondary,
          borderBottomColor: currentTheme.colors.border
        }}
      >
        <span>{collapsed ? '▶' : '◀'}</span>
      </div>

      <nav className="shell-navigation">
        <ul className="shell-nav-list">
          {navItems.map(item => (
            <li key={item.to} className="shell-nav-item">
              <a 
                href={item.to} 
                className="shell-nav-link"
                style={{
                  color: currentTheme.colors.textSecondary,
                  borderLeftColor: 'transparent',
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  padding: collapsed ? '14px 0' : '14px 16px'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.color = currentTheme.colors.primary;
                  e.currentTarget.style.borderLeftColor = currentTheme.colors.primary;
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.color = currentTheme.colors.textSecondary;
                  e.currentTarget.style.borderLeftColor = 'transparent';
                }}
              >
                <span className="shell-nav-icon">
                  <i className={item.icon}></i>
                </span>
                <span className="shell-nav-label" style={{ display: collapsed ? 'none' : 'inline' }}>
                  {item.label}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div 
        className="shell-divider"
        style={{ backgroundColor: currentTheme.colors.border }}
      />

      <div className="shell-featured">
        <a 
          href={featuredDestination.to} 
          className="shell-featured-link"
          style={{
            color: currentTheme.colors.textSecondary,
            borderLeftColor: 'transparent',
            backgroundColor: `${currentTheme.colors.backgroundDark}11`,
            justifyContent: collapsed ? 'center' : 'flex-start',
            padding: collapsed ? '14px 0' : '14px 16px'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.color = currentTheme.colors.primary;
            e.currentTarget.style.borderLeftColor = currentTheme.colors.primary;
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.color = currentTheme.colors.textSecondary;
            e.currentTarget.style.borderLeftColor = 'transparent';
          }}
        >
          <span className="shell-featured-icon">
            <i className={featuredDestination.icon}></i>
          </span>
          <span className="shell-featured-label" style={{ display: collapsed ? 'none' : 'inline' }}>
            {featuredDestination.label}
          </span>
        </a>
      </div>
    </aside>
  );
};

export default ShellPrimarySidebar; 