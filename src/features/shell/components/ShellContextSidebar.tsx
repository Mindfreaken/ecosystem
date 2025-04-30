import React, { useState } from 'react';
import { useTheme } from '../../theme';
import '../styles/ShellContextSidebar.css';

interface ShellContextSidebarProps {
  onCollapseChanged: (collapsed: boolean) => void;
}

interface Tab {
  icon: string;
  label: string;
  count?: number;
}

interface Notification {
  icon: string;
  title: string;
  message: string;
  time: string;
  priority: 'high' | 'medium' | 'low';
}

interface Event {
  day: string;
  month: string;
  title: string;
  time: string;
  location: string;
  description: string;
}

interface LiveStream {
  isLive: boolean;
  viewers: number;
  title: string;
  username: string;
  userAvatar: string;
  category: string;
  followingSince: string;
}

const ShellContextSidebar: React.FC<ShellContextSidebarProps> = ({ onCollapseChanged }) => {
  const { currentTheme } = useTheme();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [currentTabIndex, setCurrentTabIndex] = useState(0);
  const [viewsDropdownOpen, setViewsDropdownOpen] = useState(false);
  const [showOnlyLive] = useState(true);

  // Tabs configuration
  const tabs: Tab[] = [
    { icon: '🔔', label: 'Notifications', count: 3 },
    { icon: '📅', label: 'Events', count: 2 },
    { icon: '📹', label: 'Live', count: 5 }
  ];

  // Toggle the collapsed state
  const toggleCollapse = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    onCollapseChanged(newState);
  };

  // Toggle the views dropdown
  const toggleViewsDropdown = () => {
    setViewsDropdownOpen(!viewsDropdownOpen);
  };

  // Select tab
  const selectTab = (index: number) => {
    setCurrentTabIndex(index);
    setViewsDropdownOpen(false);
  };

  // Mock data for notifications
  const notifications: Notification[] = [
    {
      icon: '👤',
      title: 'New Connection Request',
      message: 'Alex Johnson wants to connect with you',
      time: '5 min ago',
      priority: 'medium'
    },
    {
      icon: '💬',
      title: 'New Comment',
      message: 'Maria commented on your recent post',
      time: '2 hours ago',
      priority: 'low'
    },
    {
      icon: '⚠️',
      title: 'Stream Status Alert',
      message: 'Your stream is experiencing technical issues',
      time: '10 min ago',
      priority: 'high'
    },
    {
      icon: '❤️',
      title: 'New Followers',
      message: '5 new users started following your channel',
      time: 'Yesterday',
      priority: 'medium'
    }
  ];

  // Get color based on priority
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return currentTheme.colors.danger;
      case 'medium':
        return currentTheme.colors.warning;
      case 'low':
        return currentTheme.colors.success;
      default:
        return currentTheme.colors.border;
    }
  };

  // Mock data for events
  const events: Event[] = [
    {
      day: '15',
      month: 'MAY',
      title: 'Community Meetup',
      time: '4:00 PM - 6:00 PM',
      location: 'Virtual',
      description: 'Join our monthly community meetup to discuss upcoming features and share ideas.'
    },
    {
      day: '22',
      month: 'MAY',
      title: 'Workshop: Streaming Basics',
      time: '2:00 PM - 3:30 PM',
      location: 'Studio B',
      description: 'Learn the fundamentals of setting up a professional stream.'
    },
    {
      day: '28',
      month: 'MAY',
      title: 'Gaming Tournament',
      time: '7:00 PM - 10:00 PM',
      location: 'Main Arena',
      description: 'Compete in our monthly gaming tournament for prizes and glory.'
    }
  ];

  // Mock data for live streams
  const liveStreams: LiveStream[] = [
    {
      isLive: true,
      viewers: 1245,
      title: 'Exploring New Game Features',
      username: 'GamerPro',
      userAvatar: 'https://placehold.co/40x40',
      category: 'Gaming',
      followingSince: 'March 2022'
    },
    {
      isLive: true,
      viewers: 892,
      title: 'Live Coding Session',
      username: 'CodeMaster',
      userAvatar: 'https://placehold.co/40x40',
      category: 'Development',
      followingSince: 'January 2023'
    },
    {
      isLive: false,
      viewers: 0,
      title: 'Art & Design Workshop',
      username: 'CreativeMind',
      userAvatar: 'https://placehold.co/40x40',
      category: 'Art',
      followingSince: 'August 2021'
    },
    {
      isLive: true,
      viewers: 567,
      title: 'Music Production Masterclass',
      username: 'BeatMaker',
      userAvatar: 'https://placehold.co/40x40',
      category: 'Music',
      followingSince: 'May 2022'
    }
  ];

  // Filter live streams
  const filteredLiveStreams = showOnlyLive 
    ? liveStreams.filter(stream => stream.isLive)
    : liveStreams;

  // Get count of active streams
  const activeLiveStreams = liveStreams.filter(stream => stream.isLive);

  return (
    <aside 
      className={`shell-context-sidebar ${isCollapsed ? 'collapsed' : ''}`}
      style={{
        backgroundColor: currentTheme.colors.backgroundAlt,
        borderLeftColor: currentTheme.colors.border,
        color: currentTheme.colors.textPrimary
      }}
    >
      <div className="shell-context-sidebar__toggle-wrapper">
        <div 
          className="shell-context-sidebar__toggle"
          style={{
            color: currentTheme.colors.textSecondary,
            borderBottomColor: currentTheme.colors.border
          }}
        >
          {/* Left side - Current view (when not collapsed) */}
          {!isCollapsed && (
            <div 
              className="shell-context-sidebar__toggle-label" 
              onClick={toggleViewsDropdown}
            >
              <span>{tabs[currentTabIndex].label || 'Select View'}</span>
              <span style={{ 
                fontSize: '12px', 
                marginLeft: '5px',
                transform: viewsDropdownOpen ? 'rotate(180deg)' : 'none',
                display: 'inline-block',
                transition: 'transform 0.3s ease'
              }}>▼</span>
            </div>
          )}
          
          {/* Right side - Collapse button */}
          <div 
            className="shell-context-sidebar__toggle-collapse" 
            onClick={toggleCollapse}
          >
            <span>{isCollapsed ? '◀' : '▶'}</span>
          </div>
          
          {/* Dropdown menu */}
          {viewsDropdownOpen && !isCollapsed && (
            <div 
              className="shell-context-sidebar__dropdown"
              style={{ 
                backgroundColor: currentTheme.colors.background,
                borderColor: currentTheme.colors.border
              }}
            >
              {tabs.map((tab, index) => (
                <div 
                  key={index}
                  className={`shell-context-sidebar__dropdown-item ${
                    currentTabIndex === index ? 'shell-context-sidebar__dropdown-item--active' : ''
                  }`}
                  onClick={() => selectTab(index)}
                  style={{ 
                    color: currentTabIndex === index ? currentTheme.colors.primary : currentTheme.colors.textSecondary 
                  }}
                >
                  <span style={{ marginRight: '10px', width: '16px', textAlign: 'center', display: 'inline-block' }}>
                    {tab.icon}
                  </span>
                  <span>{tab.label}</span>
                  {tab.count && (
                    <span 
                      className="shell-context-sidebar__dropdown-count"
                      style={{ backgroundColor: currentTheme.colors.danger }}
                    >
                      {tab.count}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

        {!isCollapsed && (
        <div className="shell-context-sidebar__content">
          {/* Notifications Tab */}
          {currentTabIndex === 0 && (
            <div className="shell-context-sidebar__notifications">
              {notifications.map((notification, index) => (
                <div 
                  key={index} 
                  className={`shell-context-sidebar__notification-card shell-context-sidebar__notification-card--${notification.priority}`}
                  style={{ borderLeftColor: getPriorityColor(notification.priority) }}
                >
                  <div 
                    className="shell-context-sidebar__notification-icon"
                    style={{ backgroundColor: `${currentTheme.colors.background}11` }}
                  >
                    <span>{notification.icon}</span>
                  </div>
                  <div className="shell-context-sidebar__notification-content">
                    <div className="shell-context-sidebar__notification-header">
                      <h4>{notification.title}</h4>
                      <span className="shell-context-sidebar__notification-time">{notification.time}</span>
                    </div>
                    <p>{notification.message}</p>
                  </div>
                </div>
              ))}
              <div className="shell-context-sidebar__view-all">
                <button>View All Notifications</button>
              </div>
            </div>
          )}
          
          {/* Events Tab */}
          {currentTabIndex === 1 && (
            <div className="shell-context-sidebar__events">
              {events.map((event, index) => (
                <div 
                  key={index} 
                  className="shell-context-sidebar__event-card"
                >
                  <div 
                    className="shell-context-sidebar__event-date"
                    style={{ 
                      backgroundColor: currentTheme.colors.primary,
                      color: '#ffffff'
                    }}
                  >
                    <span className="shell-context-sidebar__event-day">{event.day}</span>
                    <span className="shell-context-sidebar__event-month">{event.month}</span>
                  </div>
                  <div className="shell-context-sidebar__event-details">
                    <h4>{event.title}</h4>
                    <div className="shell-context-sidebar__event-meta">
                      <div>
                        <span style={{ marginRight: '5px' }}>🕒</span> {event.time}
                      </div>
                      <div>
                        <span style={{ marginRight: '5px' }}>📍</span> {event.location}
                      </div>
                    </div>
                    <p>{event.description}</p>
                  </div>
                </div>
              ))}
              <div className="shell-context-sidebar__view-all">
                <button>View All Events</button>
              </div>
            </div>
          )}
          
          {/* Live Tab */}
          {currentTabIndex === 2 && (
            <div className="shell-context-sidebar__live">
              <div className="shell-context-sidebar__live-header">
                <h3>Channels You Follow</h3>
                <div className="shell-context-sidebar__live-filter">
                  <span 
                    className="shell-context-sidebar__live-count"
                    style={{
                      backgroundColor: `${currentTheme.colors.danger}1a`,
                      color: currentTheme.colors.danger
                    }}
                  >
                    {activeLiveStreams.length} Live
                  </span>
                </div>
              </div>
              
              {filteredLiveStreams.length === 0 ? (
                <div className="shell-context-sidebar__live-empty">
                  <span style={{ fontSize: '2rem', marginBottom: '15px', opacity: 0.6 }}>📡</span>
                  <p>None of your followed channels are live right now</p>
                  <button 
                    style={{
                      border: `1px solid ${currentTheme.colors.border}`
                    }}
                  >
                    Discover Channels
                  </button>
                </div>
              ) : (
                <div className="shell-context-sidebar__channel-list">
                  {filteredLiveStreams.map((stream, index) => (
                    <div 
                      key={index} 
                      className={`shell-context-sidebar__channel-card ${!stream.isLive ? 'shell-context-sidebar__channel-card--offline' : ''}`}
                      style={{
                        border: `1px solid ${currentTheme.colors.border}1a`
                      }}
                    >
                      {stream.isLive && (
                        <div className="shell-context-sidebar__live-indicator">
                          <span 
                            className="shell-context-sidebar__live-pulse"
                            style={{ backgroundColor: currentTheme.colors.danger }}
                          ></span>
                          <span className="shell-context-sidebar__live-text">LIVE</span>
                        </div>
                      )}
                      
                      <div 
                        className="shell-context-sidebar__channel-content"
                        style={{ padding: '12px' }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                          <img 
                            src={stream.userAvatar} 
                            alt={`${stream.username} avatar`} 
                            style={{
                              width: '36px',
                              height: '36px',
                              borderRadius: '50%',
                              marginRight: '10px',
                              border: `2px solid ${currentTheme.colors.background}`,
                              boxShadow: `0 2px 4px ${currentTheme.colors.shadow}1a`
                            }}
                          />
                          <div>
                            <div style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: '2px' }}>
                              {stream.username}
                            </div>
                            <div style={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              flexWrap: 'wrap',
                              gap: '8px',
                              fontSize: '0.7rem',
                              opacity: 0.7
                            }}>
                              {stream.isLive && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                                  <span>👁</span> {stream.viewers}
                                </div>
                              )}
                              <div style={{ fontStyle: 'italic' }}>
                                Following since {stream.followingSince}
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {stream.isLive && (
                          <>
                            <div style={{ marginBottom: '12px' }}>
                              <h4 style={{ margin: '0 0 5px', fontSize: '0.9rem', fontWeight: 500, lineHeight: 1.4 }}>
                                {stream.title}
                              </h4>
                              <div>
                                <span style={{
                                  display: 'inline-block',
                                  fontSize: '0.75rem',
                                  backgroundColor: `${currentTheme.colors.background}0d`,
                                  padding: '2px 8px',
                                  borderRadius: '12px',
                                  fontWeight: 500
                                }}>
                                  {stream.category}
                                </span>
                              </div>
                            </div>
                            
                            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
                              <button style={{
                                flex: 1,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '6px',
                                background: 'none',
                                border: `1px solid ${currentTheme.colors.border}1a`,
                                padding: '8px',
                                borderRadius: '6px',
                                fontSize: '0.8rem',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                backgroundColor: `${currentTheme.colors.danger}1a`,
                                color: currentTheme.colors.danger,
                                fontWeight: 500
                              }}>
                                <span>▶</span> Watch Now
                              </button>
            </div>
          </>
        )}
                        
                        {!stream.isLive && (
                          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', marginTop: '10px' }}>
                            <button style={{
                              flex: 1,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '6px',
                              background: 'none',
                              border: `1px solid ${currentTheme.colors.border}1a`,
                              padding: '8px',
                              borderRadius: '6px',
                              fontSize: '0.8rem',
                              cursor: 'pointer',
                              transition: 'all 0.2s',
                              backgroundColor: `${currentTheme.colors.background}0d`
                            }}>
                              <span>🔔</span> Notify Me
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="shell-context-sidebar__view-all">
                <button>View All Followed Channels</button>
              </div>
            </div>
          )}
        </div>
      )}
      
      {isCollapsed && (
        <div className="shell-context-sidebar__icons-only">
          {tabs.map((tab, index) => (
            <button 
              key={index}
              className={`shell-context-sidebar__icon-button ${
                currentTabIndex === index ? 'shell-context-sidebar__icon-button--active' : ''
              }`}
              onClick={() => selectTab(index)}
              style={{ 
                color: currentTabIndex === index ? currentTheme.colors.primary : currentTheme.colors.textSecondary 
              }}
            >
              <span>{tab.icon}</span>
              {tab.count && (
                <span 
                  className="shell-context-sidebar__icon-count"
                  style={{ backgroundColor: currentTheme.colors.danger }}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
      </div>
      )}
    </aside>
  );
};

export default ShellContextSidebar; 