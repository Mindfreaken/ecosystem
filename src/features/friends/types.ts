export type FriendFilterType = 'all' | 'pending' | 'blocked' | 'favorite';

export interface FriendFilter {
  id: FriendFilterType;
  label: string;
  icon: string;
  count: number;
}

export interface Friend {
  id: string;
  userId: string;
  friendId: string;
  username: string;
  displayName: string;
  avatarUrl?: string | null;
  status: 'active' | 'pending' | 'blocked' | 'removed';
  dateAdded: string;
  isMuted: boolean;
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FriendRequest {
  id: string;
  senderId: string;
  receiverId: string;
  senderUsername: string;
  senderDisplayName: string;
  senderAvatarUrl?: string | null;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

export interface FriendPagination {
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
} 