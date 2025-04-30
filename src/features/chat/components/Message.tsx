import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';

export interface MessageProps {
  id: string;
  content: string;
  sender: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
  timestamp: number;
  isMine: boolean;
  hasThread?: boolean;
  threadCount?: number;
  threadPreview?: string;
  reactions?: Array<{
    emoji: string;
    count: number;
    reacted: boolean;
  }>;
  onReplyClick?: (messageId: string) => void;
  onReactionClick?: (messageId: string, emoji: string) => void;
}

const Message: React.FC<MessageProps> = ({
  id,
  content,
  sender,
  timestamp,
  isMine,
  hasThread,
  threadCount = 0,
  threadPreview,
  reactions = [],
  onReplyClick,
  onReactionClick,
}) => {
  const [showThreadPreview, setShowThreadPreview] = useState(false);
  
  const toggleThreadPreview = () => {
    setShowThreadPreview(!showThreadPreview);
  };

  const handleReplyClick = () => {
    if (onReplyClick) {
      onReplyClick(id);
    }
  };

  const handleReactionClick = (emoji: string) => {
    if (onReactionClick) {
      onReactionClick(id, emoji);
    }
  };

  return (
    <div className={`message-item ${isMine ? 'sent' : 'received'}`}>
      <div className="message-bubble">
        {content}
      </div>
      
      <div className="message-metadata">
        <span>{sender.name}</span>
        <span>{formatDistanceToNow(timestamp, { addSuffix: true })}</span>
      </div>
      
      {hasThread && (
        <div className="thread-indicator" onClick={toggleThreadPreview}>
          {threadCount} replies {showThreadPreview ? '▲' : '▼'}
        </div>
      )}
      
      {showThreadPreview && threadPreview && (
        <div className="thread-preview">
          {threadPreview}
        </div>
      )}
      
      <div className="reaction-bar">
        {reactions.map((reaction, index) => (
          <span 
            key={index} 
            className={`reaction-button ${reaction.reacted ? 'active' : ''}`}
            onClick={() => handleReactionClick(reaction.emoji)}
          >
            {reaction.emoji} {reaction.count > 0 && reaction.count}
          </span>
        ))}
        <span className="reaction-button" onClick={() => handleReactionClick('👍')}>
          + Add
        </span>
        <span className="reaction-button" onClick={handleReplyClick}>
          Reply
        </span>
      </div>
    </div>
  );
};

export default Message; 