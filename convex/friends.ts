import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { api } from "./_generated/api";

// Get friend list with filters
export const getFriends = query({
  args: {
    userId: v.string(),
    status: v.optional(v.union(
      v.literal("active"),
      v.literal("pending"),
      v.literal("blocked"),
      v.literal("removed")
    )),
    isFavorite: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    let friendsQuery = ctx.db
      .query("friends")
      .filter((q) => q.eq(q.field("userId"), args.userId));

    if (args.status) {
      friendsQuery = friendsQuery.filter((q) => q.eq(q.field("status"), args.status));
    }

    if (args.isFavorite !== undefined) {
      friendsQuery = friendsQuery.filter((q) => q.eq(q.field("isFavorite"), args.isFavorite));
    }

    const friends = await friendsQuery.collect();
    return friends;
  },
});

// Get friend requests
export const getFriendRequests = query({
  args: {
    userId: v.string(),
    type: v.union(v.literal("sent"), v.literal("received")),
    status: v.optional(v.union(
      v.literal("pending"),
      v.literal("accepted"),
      v.literal("rejected")
    )),
  },
  handler: async (ctx, args) => {
    const field = args.type === "sent" ? "senderId" : "receiverId";
    let requestsQuery = ctx.db
      .query("friendRequests")
      .filter((q) => q.eq(q.field(field), args.userId));

    if (args.status) {
      requestsQuery = requestsQuery.filter((q) => q.eq(q.field("status"), args.status));
    }

    const requests = await requestsQuery.collect();
    return requests;
  },
});

// Accept/Reject friend request
export const respondToFriendRequest = mutation({
  args: {
    requestId: v.id("friendRequests"),
    response: v.union(v.literal("accepted"), v.literal("rejected")),
  },
  handler: async (ctx, args) => {
    const request = await ctx.db.get(args.requestId);
    if (!request) {
      throw new Error("Friend request not found");
    }

    await ctx.db.patch(args.requestId, {
      status: args.response,
    });

    if (args.response === "accepted") {
      // Create friend entries for both users
      await ctx.db.insert("friends", {
        userId: request.senderId,
        friendId: request.receiverId,
        status: "active",
        isMuted: false,
        isFavorite: false,
        createdAt: new Date().toISOString(),
      });

      await ctx.db.insert("friends", {
        userId: request.receiverId,
        friendId: request.senderId,
        status: "active",
        isMuted: false,
        isFavorite: false,
        createdAt: new Date().toISOString(),
      });
    }
  },
});

// Add friend by friend code
export const addFriendByCode = mutation({
  args: {
    userId: v.string(),
    code: v.string(),
  },
  handler: async (ctx, args) => {
    // Find the friend code
    const friendCode = await ctx.db
      .query("friendCodes")
      .filter((q) => 
        q.and(
          q.eq(q.field("code"), args.code),
          q.eq(q.field("isActive"), true)
        )
      )
      .first();

    if (!friendCode) {
      throw new Error("Invalid or expired friend code");
    }

    if (friendCode.userId === args.userId) {
      throw new Error("Cannot add yourself as a friend");
    }

    // Check if already used
    if (friendCode.usedBy.includes(args.userId)) {
      throw new Error("You have already used this friend code");
    }

    // Check if already friends or request pending
    const existingRequest = await ctx.db
      .query("friendRequests")
      .filter((q) =>
        q.or(
          q.and(
            q.eq(q.field("senderId"), args.userId),
            q.eq(q.field("receiverId"), friendCode.userId),
            q.eq(q.field("status"), "pending")
          ),
          q.and(
            q.eq(q.field("senderId"), friendCode.userId),
            q.eq(q.field("receiverId"), args.userId),
            q.eq(q.field("status"), "pending")
          )
        )
      )
      .first();

    if (existingRequest) {
      throw new Error("Friend request already exists");
    }

    // Create friend request
    await ctx.db.insert("friendRequests", {
      senderId: args.userId,
      receiverId: friendCode.userId,
      status: "pending",
      friendCodeUsed: friendCode._id,
      createdAt: new Date().toISOString(),
    });

    // Update friend code usage
    await ctx.db.patch(friendCode._id, {
      usedBy: [...friendCode.usedBy, args.userId],
    });

    return { success: true };
  },
});

// Update friend status (block/unblock/remove)
export const updateFriendStatus = mutation({
  args: {
    friendshipId: v.id("friends"),
    status: v.union(
      v.literal("active"),
      v.literal("blocked"),
      v.literal("removed")
    ),
  },
  handler: async (ctx, args) => {
    const friendship = await ctx.db.get(args.friendshipId);
    if (!friendship) {
      throw new Error("Friendship not found");
    }

    await ctx.db.patch(args.friendshipId, {
      status: args.status,
    });
  },
});

// Toggle friend favorite status
export const toggleFriendFavorite = mutation({
  args: {
    friendshipId: v.id("friends"),
  },
  handler: async (ctx, args) => {
    const friendship = await ctx.db.get(args.friendshipId);
    if (!friendship) {
      throw new Error("Friendship not found");
    }

    await ctx.db.patch(args.friendshipId, {
      isFavorite: !friendship.isFavorite,
    });
  },
});

// Toggle friend mute status
export const toggleFriendMute = mutation({
  args: {
    friendshipId: v.id("friends"),
  },
  handler: async (ctx, args) => {
    const friendship = await ctx.db.get(args.friendshipId);
    if (!friendship) {
      throw new Error("Friendship not found");
    }

    await ctx.db.patch(args.friendshipId, {
      isMuted: !friendship.isMuted,
    });
  },
}); 