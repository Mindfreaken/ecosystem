import React from 'react';
import Message, { MessageProps } from './Message';

interface MessageListProps {
  messages: MessageProps[];
  onReplyClick: (messageId: string) => void;
  onReactionClick: (messageId: string, emoji: string) => void;
}

const MessageList: React.FC<MessageListProps> = ({
  messages,
  onReplyClick,
  onReactionClick,
}) => {
  return (
    <div className="message-list">
      {messages.map((message) => (
        <Message
          key={message.id}
          {...message}
          onReplyClick={onReplyClick}
          onReactionClick={onReactionClick}
        />
      ))}
    </div>
  );
};

export default MessageList; 