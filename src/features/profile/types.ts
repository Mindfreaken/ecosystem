export type ProfileRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  earnedDate: string;
  category: string;
  rarity: ProfileRarity;
  limitedEdition?: boolean;
  maxUsers?: number;
}

export interface ProfileStats {
  followers: number;
  following: number;
  posts: number;
  socialScore: number;
}

export interface ActivityItem {
  id: string;
  type: 'post' | 'achievement' | 'friend' | 'event';
  title: string;
  description?: string;
  timestamp: string;
  imageUrl?: string;
  content?: string;
  targetType?: string;
  targetName?: string;
}

export interface ProfileData {
  id: string;
  username: string;
  displayName: string;
  email: string;
  dateOfBirth: string;
  role: string;
  avatarUrl: string | null;
  coverUrl: string | null;
  bio?: string;
  customStatus?: string;
  glitterSeed: number;
  achievements: Achievement[];
  recentActivity: ActivityItem[];
  stats: ProfileStats;
  createdAt: string;
  updatedAt: string;
  joinNumber?: number;
  isFollowing?: boolean;
  isFriend?: boolean;
  isPendingFriend?: boolean;
}

export type ProfileViewMode = 'card' | 'full'; 