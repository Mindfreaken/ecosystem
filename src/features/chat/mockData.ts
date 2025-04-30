import { MessageProps } from './components/Message';
import { ChatItem } from './components/ChatSidebar';

export interface User {
  id: string;
  name: string;
  avatarUrl?: string;
}

export const currentUser: User = {
  id: 'user1',
  name: 'You',
  avatarUrl: 'https://i.pravatar.cc/150?img=1'
};

export const otherUsers: User[] = [
  {
    id: 'user2',
    name: 'Alice',
    avatarUrl: 'https://i.pravatar.cc/150?img=5'
  },
  {
    id: 'user3',
    name: 'Bob',
    avatarUrl: 'https://i.pravatar.cc/150?img=8'
  },
  {
    id: 'user4',
    name: 'Charlie',
    avatarUrl: 'https://i.pravatar.cc/150?img=3'
  }
];

// Chat list with direct messages and group chats
export const mockChatList: ChatItem[] = [
  {
    id: 'chat1',
    name: 'Alice',
    type: 'direct',
    avatarUrl: 'https://i.pravatar.cc/150?img=5',
    lastMessage: 'Can we discuss the proposal?',
    timestamp: Date.now() - 3600000, // 1 hour ago
    unreadCount: 2
  },
  {
    id: 'chat2',
    name: 'Bob',
    type: 'direct',
    avatarUrl: 'https://i.pravatar.cc/150?img=8',
    lastMessage: 'Looking forward to the meeting tomorrow',
    timestamp: Date.now() - 7200000, // 2 hours ago
    unreadCount: 0
  },
  {
    id: 'chat3',
    name: 'Charlie',
    type: 'direct',
    avatarUrl: 'https://i.pravatar.cc/150?img=3',
    lastMessage: 'I updated the docs with the new changes',
    timestamp: Date.now() - 86400000, // 1 day ago
    unreadCount: 0
  },
  {
    id: 'group1',
    name: 'Project Alpha',
    type: 'group',
    lastMessage: 'Charlie: Can someone review my PR?',
    timestamp: Date.now() - 10800000, // 3 hours ago
    unreadCount: 5,
    participants: [
      currentUser,
      otherUsers[0],
      otherUsers[1],
      otherUsers[2]
    ]
  },
  {
    id: 'group2',
    name: 'Marketing Team',
    type: 'group',
    lastMessage: 'Alice: The new campaign looks great!',
    timestamp: Date.now() - 172800000, // 2 days ago
    unreadCount: 0,
    participants: [
      currentUser,
      otherUsers[0],
      otherUsers[2]
    ]
  },
  {
    id: 'group3',
    name: 'Weekend Hangout',
    type: 'group',
    lastMessage: 'You: Who\'s joining on Saturday?',
    timestamp: Date.now() - 259200000, // 3 days ago
    unreadCount: 0,
    participants: [
      currentUser,
      otherUsers[0],
      otherUsers[1]
    ]
  }
];

// Map chats to their messages
export const chatMessages: Record<string, MessageProps[]> = {
  'chat1': [
    {
      id: 'chat1-msg1',
      content: 'Hey, how\'s the project going?',
      sender: otherUsers[0],
      timestamp: Date.now() - 5400000, // 1.5 hours ago
      isMine: false,
      reactions: []
    },
    {
      id: 'chat1-msg2',
      content: 'Can we discuss the proposal?',
      sender: otherUsers[0],
      timestamp: Date.now() - 3600000, // 1 hour ago
      isMine: false,
      reactions: []
    }
  ],
  'chat2': [
    {
      id: 'chat2-msg1',
      content: 'Do you have the meeting agenda?',
      sender: otherUsers[1],
      timestamp: Date.now() - 14400000, // 4 hours ago
      isMine: false,
      reactions: []
    },
    {
      id: 'chat2-msg2',
      content: 'Yes, I\'ll send it over in a minute',
      sender: currentUser,
      timestamp: Date.now() - 10800000, // 3 hours ago
      isMine: true,
      reactions: [
        { emoji: '👍', count: 1, reacted: false }
      ]
    },
    {
      id: 'chat2-msg3',
      content: 'Looking forward to the meeting tomorrow',
      sender: otherUsers[1],
      timestamp: Date.now() - 7200000, // 2 hours ago
      isMine: false,
      reactions: []
    }
  ],
  'group1': [
    {
      id: 'group1-msg1',
      content: 'I just pushed the latest changes to the repo',
      sender: otherUsers[1],
      timestamp: Date.now() - 18000000, // 5 hours ago
      isMine: false,
      reactions: [
        { emoji: '🚀', count: 2, reacted: true }
      ]
    },
    {
      id: 'group1-msg2',
      content: 'Great work! The new features look amazing',
      sender: otherUsers[0],
      timestamp: Date.now() - 14400000, // 4 hours ago
      isMine: false,
      reactions: [
        { emoji: '❤️', count: 3, reacted: true }
      ]
    },
    {
      id: 'group1-msg3',
      content: 'Can someone review my PR?',
      sender: otherUsers[2],
      timestamp: Date.now() - 10800000, // 3 hours ago
      isMine: false,
      reactions: []
    }
  ]
};

// Main chat messages (no threads)
export const mockMessages: MessageProps[] = [
  {
    id: 'msg1',
    content: 'Hey everyone! Welcome to our new encrypted chat platform.',
    sender: currentUser,
    timestamp: Date.now() - 3600000 * 24 * 3, // 3 days ago
    isMine: true,
    hasThread: true,
    threadCount: 2,
    threadPreview: 'Alice: Really excited about this!',
    reactions: [
      { emoji: '👍', count: 3, reacted: true },
      { emoji: '🎉', count: 2, reacted: false }
    ]
  },
  {
    id: 'msg2',
    content: 'This is looking really good! Love the encrypted messaging feature.',
    sender: otherUsers[0],
    timestamp: Date.now() - 3600000 * 24 * 2, // 2 days ago
    isMine: false,
    reactions: [
      { emoji: '❤️', count: 1, reacted: true }
    ]
  },
  {
    id: 'msg3',
    content: 'Can we discuss the new project requirements here?',
    sender: otherUsers[1],
    timestamp: Date.now() - 3600000 * 24, // 1 day ago
    isMine: false,
    hasThread: true,
    threadCount: 3,
    threadPreview: 'You: Sure, let me share the details.',
    reactions: [
      { emoji: '👀', count: 2, reacted: false }
    ]
  },
  {
    id: 'msg4',
    content: 'I just pushed the latest changes to the repository. Feel free to review and share your thoughts!',
    sender: currentUser,
    timestamp: Date.now() - 3600000 * 5, // 5 hours ago
    isMine: true,
    reactions: [
      { emoji: '👍', count: 1, reacted: false },
      { emoji: '🚀', count: 2, reacted: true }
    ]
  },
  {
    id: 'msg5',
    content: 'Has anyone tested the new encryption system? It should be much more secure now.',
    sender: otherUsers[2],
    timestamp: Date.now() - 3600000 * 2, // 2 hours ago
    isMine: false,
    reactions: []
  },
  {
    id: 'msg6',
    content: 'I checked it and it works great! The end-to-end encryption is functioning perfectly.',
    sender: otherUsers[0],
    timestamp: Date.now() - 3600000, // 1 hour ago
    isMine: false,
    reactions: [
      { emoji: '🔒', count: 4, reacted: true }
    ]
  },
  {
    id: 'msg7',
    content: 'Great work everyone! Let\'s schedule a call tomorrow to discuss our next steps.',
    sender: currentUser,
    timestamp: Date.now() - 1800000, // 30 minutes ago
    isMine: true,
    reactions: [
      { emoji: '👍', count: 2, reacted: false },
      { emoji: '📅', count: 3, reacted: true }
    ]
  }
];

// Thread for message 1
export const mockThread1: MessageProps[] = [
  {
    id: 'thread1-reply1',
    content: 'Really excited about this!',
    sender: otherUsers[0],
    timestamp: Date.now() - 3600000 * 24 * 3 + 1800000, // 30 mins after parent message
    isMine: false,
    reactions: [
      { emoji: '👍', count: 1, reacted: true }
    ]
  },
  {
    id: 'thread1-reply2',
    content: 'This is going to be a game-changer for our team communication.',
    sender: otherUsers[1],
    timestamp: Date.now() - 3600000 * 24 * 3 + 3600000, // 1 hour after parent message
    isMine: false,
    reactions: []
  }
];

// Thread for message 3
export const mockThread3: MessageProps[] = [
  {
    id: 'thread3-reply1',
    content: 'Sure, let me share the details.',
    sender: currentUser,
    timestamp: Date.now() - 3600000 * 23, // 23 hours ago
    isMine: true,
    reactions: []
  },
  {
    id: 'thread3-reply2',
    content: 'We need to implement the new authentication flow and update the database schema.',
    sender: currentUser,
    timestamp: Date.now() - 3600000 * 22.5, // 22.5 hours ago
    isMine: true,
    reactions: [
      { emoji: '👌', count: 1, reacted: false }
    ]
  },
  {
    id: 'thread3-reply3',
    content: 'I can work on the authentication part. When do we need to have this ready?',
    sender: otherUsers[2],
    timestamp: Date.now() - 3600000 * 22, // 22 hours ago
    isMine: false,
    reactions: []
  }
];

export const mockThreadsMap = {
  'msg1': mockThread1,
  'msg3': mockThread3
};

export const getAllThreads = (messageId: string): MessageProps[] => {
  return mockThreadsMap[messageId as keyof typeof mockThreadsMap] || [];
}; 