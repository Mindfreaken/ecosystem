import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Default profile types
export const DEFAULT_PROFILE_TYPES = [
  {
    name: "Gamer",
    description: "Video game enthusiast",
    createdAt: Date.now(),
  },
  {
    name: "Developer",
    description: "Software developer",
    createdAt: Date.now(),
  },
  {
    name: "Artist",
    description: "Creative artist",
    createdAt: Date.now(),
  },
  {
    name: "Musician",
    description: "Music creator or enthusiast",
    createdAt: Date.now(),
  },
  {
    name: "Streamer",
    description: "Content creator or streamer",
    createdAt: Date.now(),
  },
];

// Initialize default profile types
export const initializeProfileTypes = mutation({
  args: {},
  returns: v.null(),
  handler: async (ctx) => {
    // Check if profile types are already initialized
    const existing = await ctx.db
      .query("profileTypes")
      .first();
    
    // If not already initialized, add the default profile types
    if (!existing) {
      for (const profileType of DEFAULT_PROFILE_TYPES) {
        await ctx.db.insert("profileTypes", profileType);
      }
    }
    
    return null;
  },
});

// Get all profile types
export const getAllProfileTypes = query({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id("profileTypes"),
      name: v.string(),
      description: v.string(),
      iconUrl: v.optional(v.string()),
      createdAt: v.number(),
    })
  ),
  handler: async (ctx) => {
    return await ctx.db.query("profileTypes").collect();
  },
});

// Set profile type for a user
export const setProfileType = mutation({
  args: {
    userId: v.string(),
    profileTypeId: v.id("profileTypes"),
  },
  returns: v.null(),
  handler: async (ctx, { userId, profileTypeId }) => {
    // Find the user's profile
    const profile = await ctx.db
      .query("profiles")
      .filter((q) => q.eq(q.field("userId"), userId))
      .first();
    
    if (profile) {
      // Update the profile type
      await ctx.db.patch(profile._id, {
        profileTypeId: profileTypeId,
        updatedAt: Date.now(),
      });
    }
    
    return null;
  },
}); 