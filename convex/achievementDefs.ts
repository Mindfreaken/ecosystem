import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Default achievement definitions
export const DEFAULT_ACHIEVEMENT_DEFS = [
  {
    key: "join_community",
    name: "Community Member",
    description: "Joined the community",
    category: "Community",
    requirements: JSON.stringify({ type: "automatic" }),
    rewardType: "Badge",
    rewardValue: "community_badge",
    createdAt: Date.now(),
  },
  {
    key: "early_adopter",
    name: "Early Adopter",
    description: "One of the first 2,000 members to join",
    category: "Community",
    requirements: JSON.stringify({ 
      type: "join_position", 
      maxPosition: 2000 
    }),
    rewardType: "Badge",
    rewardValue: "early_adopter_badge",
    createdAt: Date.now(),
  },
  {
    key: "profile_complete",
    name: "Identity Established",
    description: "Completed all profile sections",
    category: "Profile",
    requirements: JSON.stringify({ 
      type: "profile_fields",
      fields: ["bio", "avatarUrl", "customStatus", "profileTypeId"]
    }),
    rewardType: "Badge",
    rewardValue: "profile_badge",
    createdAt: Date.now(),
  },
  {
    key: "first_friend",
    name: "Friendly",
    description: "Made your first friend connection",
    category: "Social",
    requirements: JSON.stringify({ 
      type: "friend_count",
      min: 1
    }),
    rewardType: "Badge",
    rewardValue: "friendly_badge",
    createdAt: Date.now(),
  },
];

// Initialize default achievement definitions
export const initializeAchievementDefs = mutation({
  args: {},
  returns: v.null(),
  handler: async (ctx) => {
    // Check if achievement defs are already initialized
    const existing = await ctx.db
      .query("achievementsDefs")
      .filter((q) => q.eq(q.field("key"), "join_community"))
      .first();
    
    // If not already initialized, add the default achievement defs
    if (!existing) {
      for (const achievementDef of DEFAULT_ACHIEVEMENT_DEFS) {
        await ctx.db.insert("achievementsDefs", achievementDef);
      }
    }
    
    return null;
  },
});

// Get all achievement definitions
export const getAllAchievementDefs = query({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id("achievementsDefs"),
      key: v.string(),
      name: v.string(),
      description: v.string(),
      category: v.string(),
      requirements: v.string(),
      rewardType: v.optional(v.string()),
      rewardValue: v.optional(v.string()),
      iconUrl: v.optional(v.string()),
      createdAt: v.number(),
    })
  ),
  handler: async (ctx) => {
    return await ctx.db.query("achievementsDefs").collect();
  },
});

// Get achievement definitions by category
export const getAchievementDefsByCategory = query({
  args: {
    category: v.string(),
  },
  returns: v.array(
    v.object({
      _id: v.id("achievementsDefs"),
      key: v.string(),
      name: v.string(),
      description: v.string(),
      category: v.string(),
      requirements: v.string(),
      rewardType: v.optional(v.string()),
      rewardValue: v.optional(v.string()),
      iconUrl: v.optional(v.string()),
      createdAt: v.number(),
    })
  ),
  handler: async (ctx, { category }) => {
    return await ctx.db
      .query("achievementsDefs")
      .filter((q) => q.eq(q.field("category"), category))
      .collect();
  },
}); 