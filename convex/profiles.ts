import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Create an initial profile for a new user
export const createProfile = mutation({
  args: {
    userId: v.string(),  // Reference to users.firebaseUserId
  },
  returns: v.null(),
  handler: async (ctx, { userId }) => {
    // Generate a random glitter seed for visual effects
    const glitterSeed = Math.floor(Math.random() * 1000000);
    
    // Get random default avatar URL if not already set
    const defaultAvatarUrl = `/avatars/default/default_${String(Math.floor(Math.random() * 15) + 1).padStart(3, '0')}.jpg`;
    
    await ctx.db.insert("profiles", {
      userId,
      glitterSeed,
      avatarUrl: defaultAvatarUrl,
      updatedAt: Date.now(),
    });
    
    return null;
  },
});

// Get a user's profile
export const getProfile = query({
  args: {
    userId: v.string(),
  },
  returns: v.union(
    v.null(),
    v.object({
      bio: v.optional(v.string()),
      customStatus: v.optional(v.string()),
      avatarUrl: v.optional(v.string()),
      glitterSeed: v.number(),
      updatedAt: v.number(),
    })
  ),
  handler: async (ctx, { userId }) => {
    const profile = await ctx.db
      .query("profiles")
      .filter((q) => q.eq(q.field("userId"), userId))
      .first();
    
    if (!profile) return null;
    
    return {
      bio: profile.bio,
      customStatus: profile.customStatus,
      avatarUrl: profile.avatarUrl,
      glitterSeed: profile.glitterSeed,
      updatedAt: profile.updatedAt,
    };
  },
});

// Get just the glitter seed for a user
export const getGlitterSeed = query({
  args: {
    userId: v.string(),
  },
  returns: v.number(),
  handler: async (ctx, { userId }) => {
    const profile = await ctx.db
      .query("profiles")
      .filter((q) => q.eq(q.field("userId"), userId))
      .first();
    
    // Return the glitter seed if found, or a fallback based on the userId
    if (profile && profile.glitterSeed !== undefined) {
      return profile.glitterSeed;
    }
    
    // Fallback: generate a deterministic seed from the userId
    // Convert userId to a simple numeric value
    const fallbackSeed = parseInt(userId.replace(/\D/g, '').slice(-6)) || Math.floor(Math.random() * 1000000);
    return fallbackSeed;
  },
}); 