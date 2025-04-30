import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { generateFriendCode } from "./utils";

// Get active friend code for a user
export const getActiveCode = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const activeCode = await ctx.db
      .query("friendCodes")
      .filter((q) => 
        q.and(
          q.eq(q.field("userId"), args.userId),
          q.eq(q.field("isActive"), true)
        )
      )
      .first();

    return activeCode;
  },
});

// Generate a new friend code
export const generateNewCode = mutation({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    // Deactivate any existing active codes
    const existingCodes = await ctx.db
      .query("friendCodes")
      .filter((q) => 
        q.and(
          q.eq(q.field("userId"), args.userId),
          q.eq(q.field("isActive"), true)
        )
      )
      .collect();

    for (const code of existingCodes) {
      await ctx.db.patch(code._id, { isActive: false });
    }

    // Generate new code
    const code = await generateFriendCode({ db: ctx.db });
    
    // Create new friend code
    const newCode = await ctx.db.insert("friendCodes", {
      userId: args.userId,
      code,
      isActive: true,
      usedBy: [],
      createdAt: new Date().toISOString(),
    });

    return await ctx.db.get(newCode);
  },
});

// Use a friend code to send a friend request
export const useFriendCode = mutation({
  args: { code: v.string() },
  handler: async (ctx, { code }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const firebaseUserId = identity.subject;

    // Check if user exists
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("firebaseUserId"), firebaseUserId))
      .first();
    if (!user) throw new Error("User not found");

    // Find the friend code
    const friendCode = await ctx.db
      .query("friendCodes")
      .filter((q) => 
        q.and(
          q.eq(q.field("code"), code),
          q.eq(q.field("isActive"), true)
        )
      )
      .first();
    if (!friendCode) throw new Error("Invalid or expired friend code");

    // Check if code owner is not the same as requester
    if (friendCode.userId === user._id) {
      throw new Error("Cannot use your own friend code");
    }

    // Check if already used
    if (friendCode.usedBy.includes(user._id)) {
      throw new Error("You have already used this friend code");
    }

    // Check if already friends or have pending request
    const existingRequest = await ctx.db
      .query("friendRequests")
      .filter((q) =>
        q.or(
          q.and(
            q.eq(q.field("senderId"), user._id),
            q.eq(q.field("receiverId"), friendCode.userId)
          ),
          q.and(
            q.eq(q.field("senderId"), friendCode.userId),
            q.eq(q.field("receiverId"), user._id)
          )
        )
      )
      .first();

    if (existingRequest) {
      throw new Error("Friend request already exists");
    }

    // Create friend request
    const friendRequest = await ctx.db.insert("friendRequests", {
      senderId: user._id,
      receiverId: friendCode.userId,
      status: "pending",
      friendCodeUsed: friendCode._id,
      createdAt: new Date().toISOString(),
    });

    // Update friend code usage
    await ctx.db.patch(friendCode._id, {
      usedBy: [...friendCode.usedBy, user._id],
    });

    return friendRequest;
  },
}); 