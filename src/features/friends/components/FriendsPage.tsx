import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../theme';
// Import types
import { Friend, FriendRequest, FriendFilter, FriendFilterType, FriendPagination } from '../types';

// Components
import FriendsPageLayout from './FriendsPageLayout';
import FriendsHeader from './FriendsHeader';
import FriendsList, { FriendsListRef } from './FriendsList';
// import AddFriendModal from './AddFriendModal';
// import FriendActionsModal from './FriendActionsModal';
// import ProfileModal from '../../profile/components/ProfileModal';
// import FriendsRealtimeListener from './FriendsRealtimeListener';

// Mock service for now - will need to be implemented with Convex
const friendsService = {
  getFriends: async (userId: string, filter: FriendFilterType, page: number, limit: number) => {
    // Mock implementation
    return {
      friends: [] as Friend[],
      pagination: {
        page,
        limit,
        total: 0,
        hasMore: false
      } as FriendPagination
    };
  },
  getFriendshipStats: async (userId: string) => {
    // Mock implementation
    return {
      friendsCount: 0,
      pendingRequestsCount: 0,
      blockedUsersCount: 0,
      favoriteCount: 0
    };
  },
  getPendingRequests: async (userId: string) => {
    // Mock implementation
    return [] as FriendRequest[];
  },
  getUnreadRequestsCount: async (userId: string) => {
    // Mock implementation
    return 0;
  },
  markAllRequestsAsRead: async (userId: string) => {
    // Mock implementation
    return true;
  },
  acceptRequest: async (requestId: string, userId: string) => {
    // Mock implementation
    return true;
  },
  rejectRequest: async (requestId: string, userId: string) => {
    // Mock implementation
    return true;
  }
};

// Mock user auth store for now
const useAuthStore = () => {
  return {
    user: { id: '123' }
  };
};

// Mock type for ProfileData
interface ProfileData {
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
  achievements: Array<any>;
  recentActivity: Array<any>;
  stats: {
    followers: number;
    following: number;
    posts: number;
    socialScore: number;
  };
  createdAt: string;
  updatedAt: string;
}

const FriendsPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentTheme } = useTheme();
  const authStore = useAuthStore();
  
  // Component state
  const [currentFilter, setCurrentFilter] = useState<FriendFilterType>('all');
  const [friends, setFriends] = useState<Friend[]>([]);
  const [pendingRequests, setPendingRequests] = useState<FriendRequest[]>([]);
  const [unreadRequestsCount, setUnreadRequestsCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [pagination, setPagination] = useState<FriendPagination>({
    page: 1,
    limit: 10,
    total: 0,
    hasMore: false
  });
  const [showAddFriendModal, setShowAddFriendModal] = useState(false);
  const [showActionsModal, setShowActionsModal] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
  const [showProfileCardModal, setShowProfileCardModal] = useState(false);
  const [showProfileFullModal, setShowProfileFullModal] = useState(false);
  const [selectedFriendProfile, setSelectedFriendProfile] = useState<ProfileData | null>(null);
  const [stats, setStats] = useState({
    friendsCount: 0,
    pendingRequestsCount: 0,
    blockedUsersCount: 0,
    favoriteCount: 0
  });
  
  const friendsListRef = useRef<FriendsListRef>(null);
  
  // Computed properties
  const filters = useMemo<FriendFilter[]>(() => [
    {
      id: 'all',
      label: 'All Friends',
      icon: 'fas fa-user-friends',
      count: stats.friendsCount
    },
    {
      id: 'pending',
      label: 'Pending',
      icon: 'fas fa-user-clock',
      count: stats.pendingRequestsCount
    },
    {
      id: 'blocked',
      label: 'Blocked',
      icon: 'fas fa-user-slash',
      count: stats.blockedUsersCount
    },
    {
      id: 'favorite',
      label: 'Favorites',
      icon: 'fas fa-star',
      count: stats.favoriteCount
    }
  ], [stats]);
  
  const filteredFriends = useMemo(() => {
    console.log(`Computing filteredFriends for filter: ${currentFilter}`);
    
    if (currentFilter === 'pending') {
      // Convert pending requests to friend format for display
      const pendingAsFriends = pendingRequests.map((request): Friend => ({
        id: request.id,
        userId: request.receiverId,
        friendId: request.senderId,
        username: request.senderUsername,
        displayName: request.senderDisplayName,
        avatarUrl: request.senderAvatarUrl,
        status: 'pending',
        dateAdded: request.createdAt,
        isMuted: false,
        isFavorite: false,
        createdAt: request.createdAt,
        updatedAt: request.updatedAt
      }));
      
      console.log(`Showing ${pendingAsFriends.length} pending requests`);
      return pendingAsFriends;
    }
    
    console.log(`Showing ${friends.length} friends for filter: ${currentFilter}`);
    return friends;
  }, [currentFilter, friends, pendingRequests]);
  
  // Friend actions
  const friendActions = {
    handleViewProfile: (friend: Friend) => {
      // Show the friend's full profile
      console.log('View profile:', friend);
      createFriendProfileData(friend);
      setShowProfileFullModal(true);
    },
    handleMessage: (friend: Friend) => {
      console.log('Message friend:', friend);
      // Implement message handling logic here
    }
  };
  
  // Load friends data for a given page
  const loadFriends = async (page = 1) => {
    const userId = authStore.user?.id;
    if (!userId) return;
    
    try {
      setIsLoading(true);
      
      // Reset pagination when changing filters
      if (page === 1) {
        setPagination({
          ...pagination,
          page: 1
        });
      }
      
      // Try to load friends with pagination
      try {
        const result = await friendsService.getFriends(
          userId, 
          currentFilter,
          page,
          pagination.limit
        );
        
        // If loading the first page, replace the list
        if (page === 1) {
          setFriends(result.friends);
        } else {
          // Otherwise append to the existing list
          setFriends([...friends, ...result.friends]);
        }
        
        // Update pagination
        setPagination(result.pagination);
        setHasMore(result.pagination.hasMore);
      } catch (friendsError) {
        console.error('Error loading friends list:', friendsError);
        
        // If we're on page 1, set empty friends
        if (page === 1) {
          setFriends([]);
        }
      }
      
      // Try to load stats
      try {
        const friendStats = await friendsService.getFriendshipStats(userId);
        setStats(friendStats);
      } catch (statsError) {
        console.error('Error loading friendship stats:', statsError);
        // Use default stats if we couldn't load them
        setStats({
          friendsCount: friends.length,
          pendingRequestsCount: 0,
          blockedUsersCount: 0,
          favoriteCount: 0
        });
      }
      
      // Try to load pending requests
      try {
        // Load pending requests separately if needed
        if (currentFilter === 'pending') {
          const requests = await friendsService.getPendingRequests(userId);
          setPendingRequests(requests);
          
          // No need to update unreadRequestsCount here as we've already set it to 0
          // for better UX. Still mark as read in database if not already done.
          if (unreadRequestsCount !== 0) {
            try {
              await friendsService.markAllRequestsAsRead(userId);
            } catch (markError) {
              console.error('Error marking requests as read:', markError);
            }
            setUnreadRequestsCount(0);
          }
        } else {
          // Load pending requests in the background to get counts
          const requests = await friendsService.getPendingRequests(userId);
          setPendingRequests(requests);
          // Get unread requests count
          const unreadCount = await friendsService.getUnreadRequestsCount(userId);
          setUnreadRequestsCount(unreadCount);
        }
      } catch (requestsError) {
        console.error('Error loading pending requests:', requestsError);
        // Fallback to empty array for pending requests
        setPendingRequests([]);
        // Don't update unread count, keep current value
      }
      
      console.log(`Loaded friends for filter: ${currentFilter}`, { 
        count: friends.length,
        pendingCount: pendingRequests.length,
        unreadCount: unreadRequestsCount,
        filter: currentFilter,
        stats: stats
      });
    } catch (error) {
      console.error('Error in main loadFriends function:', error);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };
  
  // Load more friends
  const loadMoreFriends = async () => {
    if (isLoadingMore || !hasMore) return;
    
    setIsLoadingMore(true);
    const nextPage = pagination.page + 1;
    await loadFriends(nextPage);
  };
  
  // Handle opening the actions modal for a friend
  const handleMoreActions = (friend: Friend) => {
    setSelectedFriend(friend);
    setShowActionsModal(true);
  };
  
  // Handle closing the actions modal
  const handleCloseActionsModal = () => {
    setShowActionsModal(false);
    setSelectedFriend(null);
  };
  
  // Handle accepting a friend request
  const handleAcceptRequest = async (friend: Friend) => {
    const userId = authStore.user?.id;
    if (!userId) return;
    
    try {
      // Immediately remove from UI for better UX
      setPendingRequests(pendingRequests.filter(request => request.id !== friend.id));
      
      // Immediately update stats in UI for better UX
      setStats({
        ...stats,
        pendingRequestsCount: Math.max(0, stats.pendingRequestsCount - 1),
        friendsCount: stats.friendsCount + 1
      });
      
      // If we're on the pending requests filter, update the filtered view
      if (currentFilter === 'pending') {
        // No need to set isLoading to true as we've already updated the UI
        await friendsService.acceptRequest(friend.id, userId);
        
        // Silently update stats and friends list in the background
        loadFriends();
      } else {
        // For other filters, use the loading indicator
        setIsLoading(true);
        await friendsService.acceptRequest(friend.id, userId);
        
        // Reload friends and pending requests
        await loadFriends();
      }
    } catch (error) {
      console.error('Error accepting friend request:', error);
      // If there was an error, reload the data to restore the correct state
      await loadFriends();
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle rejecting a friend request
  const handleRejectRequest = async (friend: Friend) => {
    const userId = authStore.user?.id;
    if (!userId) return;
    
    try {
      // Immediately remove from UI for better UX
      setPendingRequests(pendingRequests.filter(request => request.id !== friend.id));
      
      // Immediately update stats in UI for better UX
      setStats({
        ...stats,
        pendingRequestsCount: Math.max(0, stats.pendingRequestsCount - 1)
      });
      
      // If we're on the pending requests filter, update the filtered view
      if (currentFilter === 'pending') {
        // No need to set isLoading to true as we've already updated the UI
        await friendsService.rejectRequest(friend.id, userId);
        
        // Silently update stats and friends list in the background
        loadFriends();
      } else {
        // For other filters, use the loading indicator
        setIsLoading(true);
        await friendsService.rejectRequest(friend.id, userId);
        
        // Reload friends and pending requests
        await loadFriends();
      }
    } catch (error) {
      console.error('Error rejecting friend request:', error);
      // If there was an error, reload the data to restore the correct state
      await loadFriends();
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle when a friend is added
  const handleFriendAdded = async () => {
    // Reload data
    await loadFriends();
  };
  
  // Handle when a friend is updated
  const handleFriendUpdated = async (updatedFriend: Friend) => {
    try {
      // First update the UI immediately using the ref to friendsList
      if (friendsListRef.current) {
        friendsListRef.current.updateFriend(updatedFriend);
      }
      
      // If the friend was removed, reload the list
      if (updatedFriend.status === 'removed') {
        // Optimistically update UI first by removing from local list
        setFriends(friends.filter(f => f.id !== updatedFriend.id));
        // Then refresh from server to ensure everything is in sync
        await loadFriends();
        return;
      }
      
      // Update the friend in the main list
      const updatedFriends = [...friends];
      const index = updatedFriends.findIndex(f => f.id === updatedFriend.id);
      if (index !== -1) {
        updatedFriends[index] = updatedFriend;
        setFriends(updatedFriends);
      }
      
      // Also reload stats
      const userId = authStore.user?.id;
      if (userId) {
        try {
          const friendStats = await friendsService.getFriendshipStats(userId);
          setStats(friendStats);
        } catch (statsError) {
          console.error('Error loading friendship stats:', statsError);
          // Continue execution even if stats fail to load
        }
      }
    } catch (error) {
      console.error('Error handling friend update:', error);
      // Fallback to full reload on error to ensure UI is consistent
      loadFriends();
    }
  };
  
  // Create ProfileData from Friend object
  const createFriendProfileData = (friend: Friend) => {
    console.log('Creating profile data for friend:', friend);
    
    // Create some mock achievements to show in the profile
    const mockAchievements = [
      {
        id: 'early-adopter',
        name: 'Early Adopter',
        description: 'One of the first users to join the platform',
        imageUrl: 'https://thsmvskkrntyfxyzqtmt.supabase.co/storage/v1/object/public/achievements//early%20adoptor%20sticker.png',
        earnedDate: friend.createdAt,
        category: 'platform',
        rarity: 'legendary',
        limitedEdition: true
      },
      {
        id: 'friendly',
        name: 'Friendly',
        description: 'Connected with 5+ users',
        imageUrl: '/images/achievements/friendly.svg',
        earnedDate: new Date().toISOString(),
        category: 'social',
        rarity: 'uncommon'
      },
      {
        id: 'active',
        name: 'Active Participant',
        description: 'Regularly active on the platform',
        imageUrl: '/images/achievements/active.svg',
        earnedDate: new Date().toISOString(),
        category: 'engagement',
        rarity: 'common'
      }
    ];
    
    // Convert Friend to ProfileData format
    setSelectedFriendProfile({
      id: friend.friendId,
      username: friend.username,
      displayName: friend.displayName,
      avatarUrl: friend.avatarUrl || null,
      email: '', // Required by User interface
      dateOfBirth: '', // Required by User interface
      role: 'user', // Required by User interface
      coverUrl: null, // Friend type doesn't have coverUrl property
      bio: undefined, // Using undefined instead of null for optional string
      customStatus: undefined, // Using undefined instead of null for optional string
      // Add the mock achievements instead of empty array
      achievements: mockAchievements,
      recentActivity: [], // Required by ProfileData interface
      createdAt: friend.createdAt,
      updatedAt: friend.updatedAt,
      stats: {
        followers: Math.floor(Math.random() * 50) + 5, // Random followers count between 5-55
        following: Math.floor(Math.random() * 30) + 3, // Random following count between 3-33
        posts: Math.floor(Math.random() * 20),         // Random posts count between 0-20
        socialScore: Math.floor(Math.random() * 500) + 100 // Random social score between 100-600
      }
    });
  };
  
  // Handle viewing profile in full view
  const handleViewProfile = async (friend: Friend) => {
    console.log('View full profile:', friend);
    createFriendProfileData(friend);
    setShowProfileFullModal(true);
  };
  
  // Handle viewing the profile card
  const handleViewProfileCard = async (friend: Friend) => {
    console.log('View profile card:', friend);
    createFriendProfileData(friend);
    setShowProfileCardModal(true);
  };
  
  // Handle closing the profile card modal
  const handleCloseProfileCardModal = () => {
    setShowProfileCardModal(false);
    setSelectedFriendProfile(null);
  };
  
  // Handle closing the profile full modal
  const handleCloseProfileFullModal = () => {
    setShowProfileFullModal(false);
    setSelectedFriendProfile(null);
  };
  
  // Handle sending a message to a friend
  const handleSendMessage = (friend: Friend) => {
    console.log('Send message to friend:', friend);
    // Implement message sending logic
    
    // Close the actions modal if it's open
    if (showActionsModal) {
      handleCloseActionsModal();
    }
  };
  
  // Watch for filter changes
  useEffect(() => {
    const loadData = async () => {
      console.log(`Filter changed to: ${currentFilter}`);
      setPagination({
        ...pagination,
        page: 1
      });
      
      // When switching to pending, clear unread count immediately for better UX
      if (currentFilter === 'pending') {
        setUnreadRequestsCount(0);
        
        // Mark all as read in the database asynchronously
        const userId = authStore.user?.id;
        if (userId) {
          friendsService.markAllRequestsAsRead(userId).catch((error: Error) => {
            console.error('Error marking requests as read:', error);
          });
        }
      }
      
      // Load the data
      await loadFriends(1);
    };
    
    loadData();
  }, [currentFilter]);
  
  // Initialize and check for friend requests
  useEffect(() => {
    // Load initial data
    console.log('Friends page mounted, loading initial data');
    loadFriends();
    
    // Set up interval to check for new requests
    const requestsCheckInterval = setInterval(async () => {
      const userId = authStore.user?.id;
      if (!userId) return;
      
      try {
        // Only check if we're not already on the pending tab
        if (currentFilter !== 'pending') {
          // Get fresh pending requests
          const newPendingRequests = await friendsService.getPendingRequests(userId);
          
          // Update the component's pendingRequests state
          setPendingRequests(newPendingRequests);
          
          // Get unread count
          const unreadCount = await friendsService.getUnreadRequestsCount(userId);
          setUnreadRequestsCount(unreadCount);
        }
      } catch (error) {
        console.error('Error checking for new friend requests:', error);
      }
    }, 30000);
    
    // Clean up interval when component is unmounted
    return () => {
      clearInterval(requestsCheckInterval);
    };
  }, []);
  
  return (
    <FriendsPageLayout>
      {/* Header */}
      <FriendsHeader 
        currentFilter={currentFilter}
        setCurrentFilter={setCurrentFilter}
        pendingRequestsCount={pendingRequests.length}
        unreadRequestsCount={unreadRequestsCount}
        filters={filters}
        onAddFriend={() => setShowAddFriendModal(true)}
      />
      
      {/* Friends List */}
      <FriendsList
        ref={friendsListRef}
        friends={filteredFriends}
        currentFilter={currentFilter}
        isLoading={isLoading}
        isLoadingMore={isLoadingMore}
        hasMore={hasMore}
        onMessage={friendActions.handleMessage}
        onViewProfile={friendActions.handleViewProfile}
        onViewProfileCard={handleViewProfileCard}
        onMoreActions={handleMoreActions}
        onLoadMore={loadMoreFriends}
        onAddFriend={() => setShowAddFriendModal(true)}
        onAcceptRequest={handleAcceptRequest}
        onRejectRequest={handleRejectRequest}
        onFriendUpdated={handleFriendUpdated}
      />
      
      {/* Add Friend Modal */}
      {/* {showAddFriendModal && (
        <AddFriendModal
          show={showAddFriendModal}
          onClose={() => setShowAddFriendModal(false)}
          onFriendAdded={handleFriendAdded}
        />
      )} */}
      
      {/* Friend Actions Modal */}
      {/* {showActionsModal && selectedFriend && (
        <FriendActionsModal
          show={showActionsModal}
          friend={selectedFriend}
          onClose={handleCloseActionsModal}
          onFriendUpdated={handleFriendUpdated}
          onViewProfile={handleViewProfile}
          onSendMessage={handleSendMessage}
        />
      )} */}
      
      {/* Profile Card Modal */}
      {/* {showProfileCardModal && selectedFriendProfile && (
        <ProfileModal
          profile={selectedFriendProfile}
          isOpen={showProfileCardModal}
          initialViewMode="card"
          onClose={handleCloseProfileCardModal}
        />
      )} */}
      
      {/* Profile Full Modal */}
      {/* {showProfileFullModal && selectedFriendProfile && (
        <ProfileModal
          profile={selectedFriendProfile}
          isOpen={showProfileFullModal}
          initialViewMode="full"
          onClose={handleCloseProfileFullModal}
        />
      )} */}
      
      {/* Real-time updates listener (non-visual component) */}
      {/* <FriendsRealtimeListener /> */}
    </FriendsPageLayout>
  );
};

export default FriendsPage; 