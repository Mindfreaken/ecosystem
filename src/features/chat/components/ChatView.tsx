import React, { useState } from 'react';
import { useTheme } from '../../theme';
import ChatSidebar from './ChatSidebar';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import ChatInputBar from './ChatInputBar';
import Thread from './Thread';
import { 
  mockMessages, 
  mockChatList, 
  chatMessages, 
  getAllThreads, 
  currentUser 
} from '../mockData';
import '../styles';

const ChatView: React.FC = () => {
  const { currentTheme } = useTheme();
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [activeThread, setActiveThread] = useState<string | null>(null);
  
  // Get messages for active chat
  const activeMessages = activeChatId ? 
    (chatMessages[activeChatId] || mockMessages) : 
    [];
  
  // Get active chat item
  const activeChat = activeChatId ?
    mockChatList.find(chat => chat.id === activeChatId) || null :
    null;

  const handleSendMessage = (content: string) => {
    if (!content.trim() || !activeChatId) return;
    
    const newMsg = {
      id: `msg-${Date.now()}`,
      content,
      sender: currentUser,
      timestamp: Date.now(),
      isMine: true,
      reactions: []
    };
    
    console.log('New message sent:', newMsg);
    // In a real app, we would send this to the server
  };

  const handleReplyClick = (messageId: string) => {
    setActiveThread(messageId);
  };

  const handleReactionClick = (messageId: string, emoji: string) => {
    console.log('Reaction clicked:', emoji, 'for message:', messageId);
    // In a real app, we would update the reaction in the server
  };

  const handleSendReply = (content: string, parentId: string) => {
    if (!content.trim()) return;
    
    const newReply = {
      id: `reply-${Date.now()}`,
      content,
      sender: currentUser,
      timestamp: Date.now(),
      isMine: true,
      reactions: []
    };
    
    console.log('New reply added:', newReply, 'to parent:', parentId);
    // In a real app, we would send this to the server
  };

  const getActiveThreadMessages = () => {
    if (!activeThread) return [];
    return getAllThreads(activeThread);
  };

  const getActiveThreadParent = () => {
    if (!activeThread) return null;
    return [...mockMessages, ...activeMessages].find(msg => msg.id === activeThread) || null;
  };

  return (
    <div 
      className="chat-container" 
      style={{ 
        backgroundColor: currentTheme.colors.background,
        height: '100%',
      }}
    >
      <div className="chat-main">
        <ChatSidebar 
          chats={mockChatList}
          activeChat={activeChatId}
          onChatSelect={setActiveChatId}
        />
        
        <div className="chat-content">
          <ChatHeader activeChat={activeChat} />
          
          <div className="message-container">
            <MessageList 
              messages={activeMessages}
              onReplyClick={handleReplyClick}
              onReactionClick={handleReactionClick}
            />
            
            <ChatInputBar 
              onSendMessage={handleSendMessage}
              disabled={!activeChatId}
              placeholder={activeChatId ? "Type a message..." : "Select a chat to start messaging"}
            />
          </div>
        </div>
        
        {activeThread && getActiveThreadParent() && (
          <Thread
            parentMessage={getActiveThreadParent()!}
            messages={getActiveThreadMessages()}
            onClose={() => setActiveThread(null)}
            onSendReply={handleSendReply}
          />
        )}
      </div>
    </div>
  );
};

export default ChatView; 