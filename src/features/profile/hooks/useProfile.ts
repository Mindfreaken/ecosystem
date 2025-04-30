import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { ProfileData } from "../types";

export function useProfile(userId: Id<"users"> | string | null | undefined) {
  // Query for profile data
  const profileData = useQuery(api.profile.getProfile, userId ? { userId } : "skip");
  const followUserMutation = useMutation(api.profile.followUser);
  const unfollowUserMutation = useMutation(api.profile.unfollowUser);

  // Return early if no userId is provided
  if (!userId) {
    return {
      profile: null,
      isLoading: false,
      followUser: async () => { throw new Error("No user ID provided"); },
      unfollowUser: async () => { throw new Error("No user ID provided"); },
      error: new Error("No user ID provided")
    };
  }

  // Handle loading state
  if (profileData === undefined) {
    return {
      profile: null,
      isLoading: true,
      followUser: async () => { throw new Error("Loading"); },
      unfollowUser: async () => { throw new Error("Loading"); },
      error: null
    };
  }

  // Handle not found state
  if (profileData === null) {
    return {
      profile: null,
      isLoading: false,
      followUser: async () => { throw new Error("Profile not found"); },
      unfollowUser: async () => { throw new Error("Profile not found"); },
      error: new Error("Profile not found")
    };
  }

  // Handle follow/unfollow
  const handleFollow = async () => {
    try {
      await followUserMutation({ targetUserId: userId });
    } catch (error) {
      console.error('Error following user:', error);
      throw error;
    }
  };

  const handleUnfollow = async () => {
    try {
      await unfollowUserMutation({ targetUserId: userId });
    } catch (error) {
      console.error('Error unfollowing user:', error);
      throw error;
    }
  };

  // The profileData should now match our ProfileData type exactly
  return {
    profile: profileData,
    isLoading: false,
    followUser: handleFollow,
    unfollowUser: handleUnfollow,
    error: null
  };
} 