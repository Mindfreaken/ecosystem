import React from 'react';
import { ChatItem } from './ChatSidebar';
import { useTheme } from '../../theme';

interface ChatHeaderProps {
  activeChat: ChatItem | null;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ activeChat }) => {
  const { currentTheme } = useTheme();

  if (!activeChat) {
    return (
      <div 
        className="chat-header"
        style={{
          backgroundColor: currentTheme.colors.backgroundAlt,
          borderBottom: `1px solid ${currentTheme.colors.border}`,
        }}
      >
        <h2 style={{ color: currentTheme.colors.textPrimary }}>Select a conversation</h2>
      </div>
    );
  }

  return (
    <div 
      className="chat-header"
      style={{
        backgroundColor: currentTheme.colors.backgroundAlt,
        borderBottom: `1px solid ${currentTheme.colors.border}`,
      }}
    >
      <div className="chat-header-avatar">
        {activeChat.type === 'direct' ? (
          <img src={activeChat.avatarUrl} alt={activeChat.name} />
        ) : (
          <div 
            className="group-avatar-header"
            style={{ backgroundColor: currentTheme.colors.primary }}
          >
            {activeChat.name.substring(0, 2).toUpperCase()}
          </div>
        )}
      </div>
      
      <div className="chat-header-info">
        <h2 style={{ color: currentTheme.colors.textPrimary }}>{activeChat.name}</h2>
        {activeChat.type === 'group' && activeChat.participants && (
          <div className="chat-header-participants">
            {activeChat.participants.length} members
          </div>
        )}
      </div>
      
      <div className="chat-header-actions">
        <button 
          className="icon-button" 
          title="Call"
          style={{ color: currentTheme.colors.textSecondary }}
        >
          <span>📞</span>
        </button>
        <button 
          className="icon-button" 
          title="Video"
          style={{ color: currentTheme.colors.textSecondary }}
        >
          <span>🎥</span>
        </button>
        <button 
          className="icon-button" 
          title="More options"
          style={{ color: currentTheme.colors.textSecondary }}
        >
          <span>⋮</span>
        </button>
      </div>
    </div>
  );
};

export default ChatHeader; 