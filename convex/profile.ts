import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

interface User {
  _id: Id<"users">;
  _creationTime: number;
  firebaseUserId: string;
  username: string;
  displayName: string;
  email: string;
  dateOfBirth: string;
  role: string;
  avatarUrl: string | null;
  coverUrl: string | null;
  bio?: string;
  customStatus?: string;
  joinNumber?: number;
  createdAt: string;
  updatedAt: string;
}

// Get a user's complete profile data
export const getProfile = query({
  args: { userId: v.union(v.id("users"), v.string()) },
  handler: async (ctx, args) => {
    // Get user data - try Convex ID first, then Firebase ID
    let user: User | null = null;
    try {
      user = await ctx.db.get(args.userId as Id<"users">) as User | null;
      console.log("Found user by Convex ID:", args.userId);
    } catch {
      console.log("Invalid Convex ID, will try as Firebase ID:", args.userId);
      user = null;
    }
    if (!user) {
      // If not found by Convex ID, try by Firebase ID
      console.log("Looking up user by Firebase ID:", args.userId);
      user = await ctx.db
        .query("users")
        .withIndex("by_firebase_id", q => q.eq("firebaseUserId", args.userId as string))
        .first() as User | null;
      if (!user) {
        console.log("User not found by Firebase ID");
        return null;
      }
      console.log("Found user by Firebase ID:", {
        id: user._id,
        firebaseId: user.firebaseUserId,
        username: user.username
      });
    }

    // Get achievements
    const userAchievements = await ctx.db
      .query("userAchievements")
      .withIndex("by_user", q => q.eq("userId", user._id))
      .collect();

    const achievements = await Promise.all(
      userAchievements.map(async ua => {
        const achievement = await ctx.db.get(ua.achievementId);
        return {
          id: ua.achievementId,
          name: achievement?.name || "",
          description: achievement?.description || "",
          imageUrl: achievement?.imageUrl || "",
          earnedDate: ua.earnedDate,
          category: achievement?.category || "",
          rarity: achievement?.rarity || "common",
          limitedEdition: achievement?.limitedEdition,
          maxUsers: achievement?.maxUsers
        };
      })
    );

    // Get recent activity
    const activities = await ctx.db
      .query("activities")
      .withIndex("by_user", q => q.eq("userId", user._id))
      .order("desc")
      .take(10);

    // Transform activities to match frontend type
    const recentActivity = activities.map(activity => ({
      id: activity._id,
      type: activity.type,
      title: activity.title,
      description: activity.description,
      timestamp: activity.timestamp,
      imageUrl: activity.imageUrl,
      content: activity.content,
      targetType: activity.targetType,
      targetName: activity.targetName
    }));

    // Get follow counts
    const followers = await ctx.db
      .query("follows")
      .withIndex("by_following", q => q.eq("followingId", user._id))
      .collect();

    const following = await ctx.db
      .query("follows")
      .withIndex("by_follower", q => q.eq("followerId", user._id))
      .collect();

    // Get social score
    const socialScore = await ctx.db
      .query("socialScores")
      .withIndex("by_user", q => q.eq("userId", user._id))
      .first();
    
    const currentScore = socialScore?.score || 10000;
    const isMaxScore = currentScore === 10000;

    // Get friend status if viewing user is provided
    const identity = await ctx.auth.getUserIdentity();
    const viewingUserId = identity?.subject;
    let isFollowing = false;
    let isFriend = false;
    let isPendingFriend = false;

    if (viewingUserId) {
      // Get viewing user's Convex ID
      const viewingUser = await ctx.db
        .query("users")
        .withIndex("by_firebase_id", q => q.eq("firebaseUserId", viewingUserId))
        .first() as User | null;

      if (viewingUser) {
        // Check if viewing user is following this profile
        const followRecord = await ctx.db
          .query("follows")
          .withIndex("by_follower_following", q => 
            q.eq("followerId", viewingUser._id)
             .eq("followingId", user._id)
          )
          .first();
        isFollowing = !!followRecord;

        // Check friend status
        const friendRecord = await ctx.db
          .query("friends")
          .filter(q => 
            q.or(
              q.and(
                q.eq(q.field("userId1"), viewingUser._id),
                q.eq(q.field("userId2"), user._id)
              ),
              q.and(
                q.eq(q.field("userId1"), user._id),
                q.eq(q.field("userId2"), viewingUser._id)
              )
            )
          )
          .first();

        if (friendRecord) {
          isFriend = friendRecord.status === "accepted";
          isPendingFriend = friendRecord.status === "pending";
        }
      }
    }

    return {
      id: user._id,
      username: user.username,
      displayName: user.displayName,
      email: user.email,
      dateOfBirth: user.dateOfBirth,
      role: user.role,
      avatarUrl: user.avatarUrl,
      coverUrl: user.coverUrl,
      bio: user.bio,
      customStatus: user.customStatus,
      joinNumber: user.joinNumber,
      achievements,
      recentActivity,
      stats: {
        followers: followers.length,
        following: following.length,
        posts: activities.filter(a => a.type === "post").length,
        socialScore: currentScore,
        isMaxScore
      },
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      isFollowing,
      isFriend,
      isPendingFriend
    };
  },
});

// Follow a user
export const followUser = mutation({
  args: { targetUserId: v.union(v.id("users"), v.string()) },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    // Get the current user's ID from users table
    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_firebase_id", q => q.eq("firebaseUserId", identity.subject))
      .first() as User | null;
    if (!currentUser) throw new Error("User not found");

    // Get target user if Firebase ID was provided
    let targetUser: User | null = null;
    if (typeof args.targetUserId === 'string') {
      targetUser = await ctx.db
        .query("users")
        .withIndex("by_firebase_id", q => q.eq("firebaseUserId", args.targetUserId))
        .first() as User | null;
    } else {
      targetUser = await ctx.db.get(args.targetUserId) as User | null;
    }
    if (!targetUser) throw new Error("Target user not found");

    if (currentUser._id === targetUser._id) throw new Error("Cannot follow yourself");

    // Check if already following
    const existingFollow = await ctx.db
      .query("follows")
      .withIndex("by_follower_following", q => 
        q.eq("followerId", currentUser._id)
         .eq("followingId", targetUser._id)
      )
      .first();

    if (existingFollow) throw new Error("Already following this user");

    // Create follow record
    await ctx.db.insert("follows", {
      followerId: currentUser._id,
      followingId: targetUser._id,
      createdAt: new Date().toISOString()
    });

    // Update social score
    const socialScore = await ctx.db
      .query("socialScores")
      .withIndex("by_user", q => q.eq("userId", targetUser._id))
      .first();

    if (socialScore) {
      await ctx.db.patch(socialScore._id, {
        score: socialScore.score + 1,
        lastUpdated: new Date().toISOString()
      });
    } else {
      await ctx.db.insert("socialScores", {
        userId: targetUser._id,
        score: 10000,
        lastUpdated: new Date().toISOString()
      });
    }
  },
});

// Unfollow a user
export const unfollowUser = mutation({
  args: { targetUserId: v.union(v.id("users"), v.string()) },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    // Get the current user's ID from users table
    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_firebase_id", q => q.eq("firebaseUserId", identity.subject))
      .first() as User | null;
    if (!currentUser) throw new Error("User not found");

    // Get target user if Firebase ID was provided
    let targetUser: User | null = null;
    if (typeof args.targetUserId === 'string') {
      targetUser = await ctx.db
        .query("users")
        .withIndex("by_firebase_id", q => q.eq("firebaseUserId", args.targetUserId))
        .first() as User | null;
    } else {
      targetUser = await ctx.db.get(args.targetUserId) as User | null;
    }
    if (!targetUser) throw new Error("Target user not found");

    // Find and delete follow record
    const follow = await ctx.db
      .query("follows")
      .withIndex("by_follower_following", q => 
        q.eq("followerId", currentUser._id)
         .eq("followingId", targetUser._id)
      )
      .first();

    if (follow) {
      await ctx.db.delete(follow._id);

      // Update social score
      const socialScore = await ctx.db
        .query("socialScores")
        .withIndex("by_user", q => q.eq("userId", targetUser._id))
        .first();

      if (socialScore && socialScore.score > 0) {
        await ctx.db.patch(socialScore._id, {
          score: socialScore.score - 1,
          lastUpdated: new Date().toISOString()
        });
      }
    }
  },
});

export const getFollowStatus = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    // Get the current user's ID from users table
    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_firebase_id", q => q.eq("firebaseUserId", identity.subject))
      .first();
    if (!currentUser) return null;

    // Check if current user is following the target user
    const follow = await ctx.db
      .query("follows")
      .withIndex("by_follower_following", (q) => 
        q.eq("followerId", currentUser._id)
         .eq("followingId", args.userId)
      )
      .first();

    return follow !== null;
  },
});

export const getFollowersCount = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const followers = await ctx.db
      .query("follows")
      .withIndex("by_following", (q) => q.eq("followingId", args.userId))
      .collect();
    return followers.length;
  },
});

export const getFollowingCount = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const following = await ctx.db
      .query("follows")
      .withIndex("by_follower", (q) => q.eq("followerId", args.userId))
      .collect();
    return following.length;
  },
});

// Initialize social scores for all users
export const initializeSocialScores = mutation({
  args: {},
  handler: async (ctx) => {
    // Get all users
    const users = await ctx.db.query("users").collect();
    
    // Count of initialized scores
    let initializedCount = 0;
    
    // Initialize social scores for each user
    for (const user of users) {
      // Check if user already has a social score
      const existingSocialScore = await ctx.db
        .query("socialScores")
        .withIndex("by_user", q => q.eq("userId", user._id))
        .first();
      
      // If no social score exists, create one with default value
      if (!existingSocialScore) {
        await ctx.db.insert("socialScores", {
          userId: user._id,
          score: 10000,
          lastUpdated: new Date().toISOString()
        });
        initializedCount++;
      }
    }
    
    return { success: true, initializedCount };
  },
});

// Get a user's social score
export const getSocialScore = query({
  args: {
    userId: v.id("users"),
  },
  returns: v.object({
    score: v.number(),
    lastUpdated: v.string(),
  }),
  handler: async (ctx, args) => {
    // Check if user exists
    const user = await ctx.db.get(args.userId);
    if (!user) throw new Error("User not found");

    // Get the user's social score
    const socialScore = await ctx.db
      .query("socialScores")
      .withIndex("by_user", q => q.eq("userId", args.userId))
      .first();
    
    if (socialScore) {
      return {
        score: socialScore.score,
        lastUpdated: socialScore.lastUpdated
      };
    } else {
      // Return default max score if no record exists
      return {
        score: 10000,
        lastUpdated: new Date().toISOString()
      };
    }
  },
}); 