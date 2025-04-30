import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";
import { MutationCtx } from "./_generated/server";

// Default punishment types
const DEFAULT_PUNISHMENT_TYPES = [
  {
    name: "ban",
    description: "User has been banned",
    pointValue: 50,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    name: "mute",
    description: "User has been muted",
    pointValue: 10,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Threshold settings to prevent abuse
const PUNISHMENT_THRESHOLDS = {
  ban: {
    daily: 2,     // Max 2 bans per day count against score
    weekly: 5,    // Max 5 bans per week count against score
  },
  mute: {
    daily: 3,     // Max 3 mutes per day count against score
    weekly: 7,    // Max 7 mutes per week count against score
  },
  default: {
    daily: 3,     // Default threshold for new punishment types
    weekly: 7,
  }
};

// Initialize default punishment types
export const initializePunishmentTypes = mutation({
  args: {},
  returns: v.null(),
  handler: async (ctx) => {
    // Check if punishment types are already initialized
    const existingBan = await ctx.db
      .query("punishmentTypes")
      .withIndex("by_name", (q) => q.eq("name", "ban"))
      .first();
    
    // If not already initialized, add the default punishment types
    if (!existingBan) {
      for (const punishmentType of DEFAULT_PUNISHMENT_TYPES) {
        await ctx.db.insert("punishmentTypes", punishmentType);
      }
    }
    
    return null;
  },
});

// Get all punishment types
export const getPunishmentTypes = query({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id("punishmentTypes"),
      name: v.string(),
      description: v.string(),
      pointValue: v.number(),
      createdAt: v.string(),
      updatedAt: v.string()
    })
  ),
  handler: async (ctx) => {
    return await ctx.db.query("punishmentTypes").collect();
  },
});

// Update a punishment type's point value
export const updatePunishmentTypeValue = mutation({
  args: {
    punishmentTypeId: v.id("punishmentTypes"),
    newPointValue: v.number(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const punishmentType = await ctx.db.get(args.punishmentTypeId);
    
    if (!punishmentType) {
      throw new Error("Punishment type not found");
    }

    // Update the punishment type
    await ctx.db.patch(args.punishmentTypeId, {
      pointValue: args.newPointValue,
      updatedAt: new Date().toISOString(),
    });

    // Update all affected user social scores
    await updateSocialScoresForPunishmentType(ctx, args.punishmentTypeId);
    
    return null;
  },
});

// Add a new punishment type
export const addPunishmentType = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    pointValue: v.number(),
  },
  returns: v.id("punishmentTypes"),
  handler: async (ctx, args) => {
    // Check if punishment type already exists
    const existing = await ctx.db
      .query("punishmentTypes")
      .withIndex("by_name", (q) => q.eq("name", args.name))
      .first();
    
    if (existing) {
      throw new Error(`Punishment type '${args.name}' already exists`);
    }
    
    // Add the new punishment type
    return await ctx.db.insert("punishmentTypes", {
      name: args.name,
      description: args.description,
      pointValue: args.pointValue,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  },
});

// Apply a punishment to a user
export const applyPunishment = mutation({
  args: {
    userId: v.id("users"),
    punishmentTypeId: v.id("punishmentTypes"),
    targetUserId: v.optional(v.id("users")),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const punishmentType = await ctx.db.get(args.punishmentTypeId);
    if (!punishmentType) {
      throw new Error("Punishment type not found");
    }
    
    const user = await ctx.db.get(args.userId);
    if (!user) {
      throw new Error("User not found");
    }
    
    // If targetUserId is provided, verify it exists
    if (args.targetUserId) {
      const targetUser = await ctx.db.get(args.targetUserId);
      if (!targetUser) {
        throw new Error("Target user not found");
      }
    }

    // Add the punishment record
    await ctx.db.insert("userPunishments", {
      userId: args.userId,
      punishmentTypeId: args.punishmentTypeId,
      targetUserId: args.targetUserId,
      appliedAt: new Date().toISOString(),
      active: true,
    });

    // Update the user's social score
    await updateUserSocialScore(ctx, args.userId);
    
    return null;
  },
});

// Remove a punishment from a user
export const removePunishment = mutation({
  args: {
    punishmentId: v.id("userPunishments"),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const punishment = await ctx.db.get(args.punishmentId);
    if (!punishment) {
      throw new Error("Punishment not found");
    }
    
    // Mark the punishment as inactive
    await ctx.db.patch(args.punishmentId, {
      active: false
    });

    // Update the user's social score
    await updateUserSocialScore(ctx, punishment.userId);
    
    return null;
  },
});

// Get a user's punishments
export const getUserPunishments = query({
  args: {
    userId: v.id("users"),
  },
  returns: v.array(
    v.object({
      _id: v.id("userPunishments"),
      userId: v.id("users"),
      punishmentTypeId: v.id("punishmentTypes"),
      punishmentName: v.string(),
      punishmentDescription: v.string(),
      pointValue: v.number(),
      targetUserId: v.optional(v.id("users")),
      appliedAt: v.string(),
      active: v.boolean()
    })
  ),
  handler: async (ctx, args) => {
    const punishments = await ctx.db
      .query("userPunishments")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();
    
    // Enhance punishments with type information
    const enhancedPunishments = [];
    
    for (const punishment of punishments) {
      const punishmentType = await ctx.db.get(punishment.punishmentTypeId);
      if (punishmentType) {
        enhancedPunishments.push({
          ...punishment,
          punishmentName: punishmentType.name,
          punishmentDescription: punishmentType.description,
          pointValue: punishmentType.pointValue
        });
      }
    }
    
    return enhancedPunishments;
  },
});

// Get the threshold configuration
export const getPunishmentThresholds = query({
  args: {},
  returns: v.any(),
  handler: async () => {
    return PUNISHMENT_THRESHOLDS;
  },
});

// Helper function to update a user's social score based on active punishments
async function updateUserSocialScore(
  ctx: MutationCtx,
  userId: Id<"users">
) {
  // Get all the user's active punishments
  const activePunishments = await ctx.db
    .query("userPunishments")
    .withIndex("by_user", (q) => q.eq("userId", userId))
    .filter((q) => q.eq(q.field("active"), true))
    .collect();
  
  // Group punishments by type
  const punishmentsByType: Record<string, Array<{ id: Id<"userPunishments">, appliedAt: string, pointValue: number }>> = {};
  
  for (const punishment of activePunishments) {
    const punishmentType = await ctx.db.get(punishment.punishmentTypeId);
    if (!punishmentType) continue;
    
    // Initialize array for this punishment type if it doesn't exist
    if (!punishmentsByType[punishmentType.name]) {
      punishmentsByType[punishmentType.name] = [];
    }
    
    // Add punishment details to the appropriate group
    punishmentsByType[punishmentType.name].push({
      id: punishment._id,
      appliedAt: punishment.appliedAt,
      pointValue: punishmentType.pointValue
    });
  }
  
  // Calculate total point deduction with thresholds applied
  let totalDeduction = 0;
  const now = new Date();
  const oneDayAgo = new Date(now);
  oneDayAgo.setDate(now.getDate() - 1);
  const oneWeekAgo = new Date(now);
  oneWeekAgo.setDate(now.getDate() - 7);
  
  // Process each punishment type
  for (const [typeName, punishments] of Object.entries(punishmentsByType)) {
    // Sort punishments by date (newest first) so we can count most recent
    const sortedPunishments = punishments.sort((a, b) => 
      new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime()
    );
    
    // Get thresholds for this punishment type
    const thresholds = PUNISHMENT_THRESHOLDS[typeName as keyof typeof PUNISHMENT_THRESHOLDS] || 
                       PUNISHMENT_THRESHOLDS.default;
    
    // Filter punishments from last day and last week
    const lastDayPunishments = sortedPunishments.filter(p => 
      new Date(p.appliedAt) >= oneDayAgo
    );
    
    const lastWeekPunishments = sortedPunishments.filter(p => 
      new Date(p.appliedAt) >= oneWeekAgo
    );
    
    // Apply daily threshold
    const dailyCountedPunishments = lastDayPunishments.slice(0, thresholds.daily);
    
    // Apply weekly threshold (excluding punishments already counted in daily)
    const dailyPunishmentIds = new Set(dailyCountedPunishments.map(p => p.id.toString()));
    const weeklyPunishmentsExcludingDaily = lastWeekPunishments.filter(p => 
      !dailyPunishmentIds.has(p.id.toString())
    ).slice(0, thresholds.weekly);
    
    // Add all other punishments outside time window
    const olderPunishments = sortedPunishments.filter(p => 
      new Date(p.appliedAt) < oneWeekAgo
    );
    
    // Calculate deduction for this punishment type
    const deduction = [...dailyCountedPunishments, ...weeklyPunishmentsExcludingDaily, ...olderPunishments]
      .reduce((total, p) => total + p.pointValue, 0);
    
    totalDeduction += deduction;
  }
  
  // Get the user's current social score
  const socialScore = await ctx.db
    .query("socialScores")
    .withIndex("by_user", (q) => q.eq("userId", userId))
    .first();
  
  const baseScore = 10000; // Maximum social score
  const newScore = Math.max(0, baseScore - totalDeduction); // Ensure score doesn't go below 0
  
  if (socialScore) {
    // Update existing social score
    await ctx.db.patch(socialScore._id, {
      score: newScore,
      lastUpdated: new Date().toISOString()
    });
  } else {
    // Create a new social score
    await ctx.db.insert("socialScores", {
      userId,
      score: newScore,
      lastUpdated: new Date().toISOString()
    });
  }
}

// Helper function to update all users with a specific punishment type when the point value changes
async function updateSocialScoresForPunishmentType(
  ctx: MutationCtx,
  punishmentTypeId: Id<"punishmentTypes">
) {
  // Get all active punishments of this type
  const activePunishments = await ctx.db
    .query("userPunishments")
    .withIndex("by_type_and_user", (q) => q.eq("punishmentTypeId", punishmentTypeId))
    .filter((q) => q.eq(q.field("active"), true))
    .collect();
  
  // Get unique user IDs from the punishments
  const userIds = new Set<Id<"users">>();
  
  for (const punishment of activePunishments) {
    userIds.add(punishment.userId);
  }
  
  // Update each user's social score
  for (const userId of userIds) {
    await updateUserSocialScore(ctx, userId);
  }
} 