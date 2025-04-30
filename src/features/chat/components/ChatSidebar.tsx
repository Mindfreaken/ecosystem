import React, { useState } from 'react';
import { useTheme } from '../../theme';
import '../styles/ChatSidebar.css';

export interface ChatItem {
  id: string;
  name: string;
  type: 'direct' | 'group';
  avatarUrl?: string;
  lastMessage?: string;
  timestamp?: number;
  unreadCount?: number;
  participants?: { id: string; name: string; avatarUrl?: string }[];
}

interface ChatSidebarProps {
  chats: ChatItem[];
  activeChat: string | null;
  onChatSelect: (chatId: string) => void;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({
  chats,
  activeChat,
  onChatSelect
}) => {
  const { currentTheme } = useTheme();
  const [filter, setFilter] = useState<'all' | 'direct' | 'group'>('all');
  const [searchQuery] = useState('');
  const [collapsed, setCollapsed] = useState(false);
  const [hoveredChatId, setHoveredChatId] = useState<string | null>(null);

  const filteredChats = chats
    .filter(chat => {
      if (filter === 'all') return true;
      return chat.type === filter;
    })
    .filter(chat => {
      if (!searchQuery.trim()) return true;
      return chat.name.toLowerCase().includes(searchQuery.toLowerCase());
    })
    // Sort by unread messages first, then by timestamp (most recent first)
    .sort((a, b) => {
      // First sort by unread count (descending)
      if ((a.unreadCount || 0) !== (b.unreadCount || 0)) {
        return (b.unreadCount || 0) - (a.unreadCount || 0);
      }
      // Then sort by timestamp (most recent first)
      return (b.timestamp || 0) - (a.timestamp || 0);
    });

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div 
      className={`chat-sidebar ${collapsed ? 'chat-sidebar--collapsed' : ''}`}
      style={{
        backgroundColor: currentTheme.colors.backgroundAlt,
        borderRightColor: currentTheme.colors.border,
        color: currentTheme.colors.textSecondary,
      }}
    >
      <div 
        className="chat-sidebar-toggle"
        onClick={toggleCollapse}
        style={{
          color: currentTheme.colors.textSecondary,
          borderBottomColor: currentTheme.colors.border,
        }}
      >
        <span>{collapsed ? '◀' : '▶'}</span>
      </div>
      
      {!collapsed && (
        <div 
          className="chat-type-filter"
          style={{
            borderBottomColor: currentTheme.colors.border,
          }}
        >
          <button 
            className={`chat-filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
            style={{
              color: filter === 'all' ? currentTheme.colors.primary : currentTheme.colors.textMuted,
              backgroundColor: filter === 'all' ? `${currentTheme.colors.primaryLight}` : 'transparent',
            }}
          >
            All
          </button>
          <button 
            className={`chat-filter-btn ${filter === 'direct' ? 'active' : ''}`}
            onClick={() => setFilter('direct')}
            style={{
              color: filter === 'direct' ? currentTheme.colors.primary : currentTheme.colors.textMuted,
              backgroundColor: filter === 'direct' ? `${currentTheme.colors.primaryLight}` : 'transparent',
            }}
          >
            Direct
          </button>
          <button 
            className={`chat-filter-btn ${filter === 'group' ? 'active' : ''}`}
            onClick={() => setFilter('group')}
            style={{
              color: filter === 'group' ? currentTheme.colors.primary : currentTheme.colors.textMuted,
              backgroundColor: filter === 'group' ? `${currentTheme.colors.primaryLight}` : 'transparent',
            }}
          >
            Groups
          </button>
        </div>
      )}
      
      <div className="chat-list">
        {filteredChats.map(chat => (
          <div 
            key={chat.id}
            className={`chat-item ${activeChat === chat.id ? 'active' : ''}`}
            onClick={() => onChatSelect(chat.id)}
            onMouseEnter={() => setHoveredChatId(chat.id)}
            onMouseLeave={() => setHoveredChatId(null)}
            style={{
              backgroundColor: activeChat === chat.id ? currentTheme.colors.primaryLight : hoveredChatId === chat.id ? `${currentTheme.colors.backgroundDark}11` : 'transparent',
              borderBottomColor: currentTheme.colors.borderLight,
              borderLeftColor: hoveredChatId === chat.id || activeChat === chat.id ? currentTheme.colors.primary : 'transparent',
            }}
          >
            <div className="chat-avatar">
              {chat.type === 'direct' ? (
                <img 
                  src={chat.avatarUrl} 
                  alt={chat.name} 
                  style={{ 
                    width: '36px', 
                    height: '36px', 
                    borderRadius: '50%',
                    display: 'block',
                    border: hoveredChatId === chat.id ? `1px solid ${currentTheme.colors.primary}` : '1px solid transparent',
                    transition: 'border 0.2s ease',
                  }} 
                />
              ) : (
                <div 
                  className="group-avatar"
                  style={{ 
                    backgroundColor: currentTheme.colors.primary,
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    transform: hoveredChatId === chat.id ? 'scale(1.05)' : 'scale(1)',
                    transition: 'transform 0.2s ease',
                  }}
                >
                  {chat.name.substring(0, 2).toUpperCase()}
                </div>
              )}
            </div>
            
            {!collapsed && (
              <>
                <div className="chat-info">
                  <div 
                    className="chat-name" 
                    style={{ 
                      color: hoveredChatId === chat.id ? currentTheme.colors.primary : currentTheme.colors.textPrimary, 
                    }}
                  >
                    <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{chat.name}</span>
                    {chat.unreadCount ? (
                      <span 
                        className={`unread-badge ${chat.unreadCount > 5 ? 'pulse' : ''}`}
                        style={{ 
                          backgroundColor: currentTheme.colors.primary,
                          color: '#fff',
                        }}
                      >
                        {chat.unreadCount}
                      </span>
                    ) : null}
                  </div>
                  {chat.lastMessage && (
                    <div 
                      className="chat-last-message"
                      style={{ 
                        color: currentTheme.colors.textMuted,
                        fontSize: '0.85rem',
                        textOverflow: 'ellipsis',
                        overflow: 'hidden',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {chat.lastMessage}
                    </div>
                  )}
                </div>
                
                {chat.timestamp && (
                  <div 
                    className="chat-time"
                    style={{ 
                      color: hoveredChatId === chat.id ? currentTheme.colors.primary : currentTheme.colors.textMuted,
                      fontSize: '0.75rem',
                      whiteSpace: 'nowrap',
                      transition: 'color 0.2s ease',
                    }}
                  >
                    {new Date(chat.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                )}
              </>
            )}
            
            {collapsed && chat.unreadCount ? (
              <div 
                className="collapsed-unread-badge"
                style={{
                  position: 'absolute',
                  top: '4px',
                  right: '4px',
                  backgroundColor: currentTheme.colors.primary,
                  color: '#fff',
                  borderRadius: '50%',
                  width: '18px',
                  height: '18px',
                  fontSize: '0.7rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {chat.unreadCount}
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatSidebar; 