import React, { useState } from 'react';
import Message, { MessageProps } from './Message';
import { useTheme } from '../../theme';

interface ThreadProps {
  parentMessage: MessageProps;
  messages: MessageProps[];
  onClose: () => void;
  onSendReply: (content: string, parentId: string) => void;
}

const Thread: React.FC<ThreadProps> = ({
  parentMessage,
  messages,
  onClose,
  onSendReply,
}) => {
  const { currentTheme } = useTheme();
  const [replyText, setReplyText] = useState('');

  const handleSendReply = () => {
    if (replyText.trim()) {
      onSendReply(replyText, parentMessage.id);
      setReplyText('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendReply();
    }
  };

  return (
    <div 
      className="thread-container"
      style={{
        backgroundColor: currentTheme.colors.backgroundAlt,
        borderLeft: `1px solid ${currentTheme.colors.border}`,
      }}
    >
      <div 
        className="thread-header"
        style={{
          borderBottom: `1px solid ${currentTheme.colors.border}`,
        }}
      >
        <h3 style={{ margin: 0, fontSize: '1rem', color: currentTheme.colors.textPrimary }}>Thread</h3>
        <span 
          className="thread-close" 
          onClick={onClose}
          style={{ color: currentTheme.colors.textMuted }}
        >
          ×
        </span>
      </div>
      
      <div className="message-list">
        {messages.map((message) => (
          <Message
            key={message.id}
            {...message}
          />
        ))}
        
        <Message
          {...parentMessage}
          hasThread={false}
        />
      </div>
      
      <div 
        className="chat-input-bar"
        style={{
          borderTop: `1px solid ${currentTheme.colors.border}`,
          backgroundColor: currentTheme.colors.backgroundAlt,
        }}
      >
        <textarea
          className="message-input"
          placeholder="Reply to thread..."
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          onKeyDown={handleKeyDown}
          style={{
            backgroundColor: currentTheme.colors.card,
            color: currentTheme.colors.text,
            borderColor: currentTheme.colors.border,
          }}
        />
        <button 
          className="send-button" 
          onClick={handleSendReply}
          style={{
            backgroundColor: currentTheme.colors.primary,
            color: 'white',
          }}
        >
          Reply
        </button>
      </div>
    </div>
  );
};

export default Thread; 