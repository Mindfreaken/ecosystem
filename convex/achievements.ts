import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Doc, Id } from "./_generated/dataModel";

// Base achievement fields without system fields
export interface AchievementFields {
  name: string;
  description: string;
  category: string;
  imageUrl: string;
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
  maxUsers?: number;
  limitedEdition?: boolean;
}

// Achievement type from the database
export type Achievement = Doc<"achievements"> & AchievementFields;

// Extended achievement type that includes earned date
export type UserAchievement = Achievement & {
  earnedDate: string;
  userId: Id<"users">;
};

// Achievement creation type without system fields
export type AchievementInput = Omit<Achievement, "_id" | "_creationTime">;

// Define the system achievements
export const SYSTEM_ACHIEVEMENTS: AchievementFields[] = [
  {
    name: "Early Adopter",
    description: "One of the first users to join the platform",
    category: "System",
    imageUrl: "/achievements/early-adopter.png",
    rarity: "common",
  },
  {
    name: "Pioneer",
    description: "Among the first 1000 users",
    category: "System",
    imageUrl: "/achievements/pioneer.png",
    rarity: "rare",
    maxUsers: 1000,
  },
  {
    name: "Join Community",
    description: "Welcome to the community!",
    category: "System",
    imageUrl: "/achievements/join-community.png",
    rarity: "common",
  }
];

// Query to get all achievements
export const getAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("achievements").collect();
  },
});

// Get all achievements for a user
export const getUserAchievements = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, { userId }) => {
    const userAchievements = await ctx.db
      .query("userAchievements")
      .filter((q) => q.eq(q.field("userId"), userId))
      .collect();
    
    return userAchievements;
  },
});

// Mutation to award an achievement to a user
export const awardAchievement = mutation({
  args: {
    userId: v.id("users"),
    achievementId: v.id("achievements"),
  },
  handler: async (ctx, { userId, achievementId }) => {
    // Check if user already has this achievement
    const existing = await ctx.db
      .query("userAchievements")
      .filter((q) => 
        q.and(
          q.eq(q.field("userId"), userId),
          q.eq(q.field("achievementId"), achievementId)
        )
      )
      .first();

    if (existing) {
      return null;
    }

    // Award the achievement
    return await ctx.db.insert("userAchievements", {
      userId,
      achievementId,
      earnedDate: new Date().getTime().toString(), // Store as string timestamp
    });
  },
});

// Check if a user qualifies for early adopter achievement
export const checkEarlyAdopter = mutation({
  args: {
    userId: v.id("users"),
    joinNumber: v.number(),
  },
  returns: v.boolean(),
  handler: async (ctx, { userId, joinNumber }) => {
    // Early adopter = first 2000 users
    const isEarlyAdopter = joinNumber <= 2000;
    
    if (isEarlyAdopter) {
      // Get the early adopter achievement
      const earlyAdopterAchievement = await ctx.db
        .query("achievements")
        .filter((q) => q.eq(q.field("name"), "Early Adopter"))
        .first();

      if (earlyAdopterAchievement) {
        // Award the achievement
        await ctx.db.insert("userAchievements", {
          userId,
          achievementId: earlyAdopterAchievement._id,
          earnedDate: new Date().getTime().toString(),
        });
      }
    }
    
    return isEarlyAdopter;
  },
});

// Create a new achievement
export const createAchievement = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    category: v.string(),
    imageUrl: v.string(),
    rarity: v.union(
      v.literal("common"),
      v.literal("uncommon"),
      v.literal("rare"),
      v.literal("epic"),
      v.literal("legendary")
    ),
    maxUsers: v.optional(v.number()),
    limitedEdition: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const achievement: AchievementFields = {
      name: args.name,
      description: args.description,
      category: args.category,
      imageUrl: args.imageUrl,
      rarity: args.rarity,
      maxUsers: args.maxUsers,
      limitedEdition: args.limitedEdition,
    };
    return await ctx.db.insert("achievements", achievement);
  },
});

// Initialize system achievements for a new user
export const initializeAchievements = mutation({
  args: {
    firebaseUserId: v.string(),
  },
  handler: async (ctx, { firebaseUserId }) => {
    // Get the user's Convex ID from their Firebase ID
    const user = await ctx.db
      .query("users")
      .withIndex("by_firebase_id", (q) => q.eq("firebaseUserId", firebaseUserId))
      .first();
    
    if (!user) {
      throw new Error("User not found");
    }

    // Get all system achievements
    const systemAchievements = await ctx.db
      .query("achievements")
      .filter((q) => q.eq(q.field("category"), "System"))
      .collect();

    // If no system achievements exist yet, create them
    if (systemAchievements.length === 0) {
      for (const achievement of SYSTEM_ACHIEVEMENTS) {
        await ctx.db.insert("achievements", achievement);
      }
    }

    return null;
  },
}); 