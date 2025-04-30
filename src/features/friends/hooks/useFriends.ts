import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { FriendFilterType } from "../types";

export function useFriends(userId: string) {
  // Queries
  const activeFriends = useQuery(api.friends.getFriends, { 
    userId, 
    status: "active" 
  });

  const pendingFriends = useQuery(api.friends.getFriends, { 
    userId, 
    status: "pending" 
  });

  const blockedFriends = useQuery(api.friends.getFriends, { 
    userId, 
    status: "blocked" 
  });

  const favoriteFriends = useQuery(api.friends.getFriends, { 
    userId, 
    isFavorite: true 
  });

  const receivedRequests = useQuery(api.friends.getFriendRequests, {
    userId,
    type: "received",
    status: "pending"
  });

  // Mutations
  const sendRequest = useMutation(api.friends.sendFriendRequest);
  const respondToRequest = useMutation(api.friends.respondToFriendRequest);
  const updateStatus = useMutation(api.friends.updateFriendStatus);
  const toggleFavorite = useMutation(api.friends.toggleFriendFavorite);
  const toggleMute = useMutation(api.friends.toggleFriendMute);

  // Helper functions
  const getFriendsByFilter = (filter: FriendFilterType) => {
    switch (filter) {
      case "all":
        return activeFriends || [];
      case "pending":
        return pendingFriends || [];
      case "blocked":
        return blockedFriends || [];
      case "favorite":
        return favoriteFriends || [];
      default:
        return [];
    }
  };

  const getFilterCounts = () => ({
    all: activeFriends?.length || 0,
    pending: (pendingFriends?.length || 0) + (receivedRequests?.length || 0),
    blocked: blockedFriends?.length || 0,
    favorite: favoriteFriends?.length || 0,
  });

  // Actions
  const sendFriendRequest = async (receiverId: string) => {
    await sendRequest({ senderId: userId, receiverId });
  };

  const acceptFriendRequest = async (requestId: Id<"friendRequests">) => {
    await respondToRequest({ requestId, response: "accepted" });
  };

  const rejectFriendRequest = async (requestId: Id<"friendRequests">) => {
    await respondToRequest({ requestId, response: "rejected" });
  };

  const blockFriend = async (friendshipId: Id<"friends">) => {
    await updateStatus({ friendshipId, status: "blocked" });
  };

  const unblockFriend = async (friendshipId: Id<"friends">) => {
    await updateStatus({ friendshipId, status: "active" });
  };

  const removeFriend = async (friendshipId: Id<"friends">) => {
    await updateStatus({ friendshipId, status: "removed" });
  };

  const toggleFavoriteFriend = async (friendshipId: Id<"friends">) => {
    await toggleFavorite({ friendshipId });
  };

  const toggleMuteFriend = async (friendshipId: Id<"friends">) => {
    await toggleMute({ friendshipId });
  };

  return {
    // Lists
    friends: activeFriends || [],
    pendingFriends: pendingFriends || [],
    blockedFriends: blockedFriends || [],
    favoriteFriends: favoriteFriends || [],
    receivedRequests: receivedRequests || [],
    
    // Helper functions
    getFriendsByFilter,
    getFilterCounts,
    
    // Actions
    sendFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
    blockFriend,
    unblockFriend,
    removeFriend,
    toggleFavoriteFriend,
    toggleMuteFriend,
  };
} 