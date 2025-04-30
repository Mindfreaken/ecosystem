import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";
import { generateFriendCode } from "./utils";

// Create a new user with complete onboarding
export const createUser = mutation({
  args: {
    firebaseUserId: v.string(),
    email: v.string(),
    displayName: v.string(),
    username: v.string(),
    createdAt: v.number(),
  },
  returns: v.null(),
  handler: async (ctx, { firebaseUserId, email, displayName, username, createdAt }) => {
    // 1. Initialize master data (do this first)
    await ctx.runMutation(api.achievementDefs.initializeAchievementDefs);
    await ctx.runMutation(api.profileTypes.initializeProfileTypes);

    // 2. Get a join number for this user by incrementing counter
    const joinNumber = await ctx.runMutation(api.counters.incrementJoinCounter);
    
    // 3. Get random default avatar and cover URLs
    const defaultAvatarUrl = `/avatars/default/default_${String(Math.floor(Math.random() * 15) + 1).padStart(3, '0')}.jpg`;
    const defaultCoverUrl = `/covers/default/default_${String(Math.floor(Math.random() * 18) + 1).padStart(3, '0')}.png`;
    
    // 4. Create the user record with all required fields
    const timestamp = new Date(createdAt).toISOString();
    const userId = await ctx.db.insert("users", { 
      firebaseUserId,
      username,
      displayName,
      email,
      dateOfBirth: timestamp, // Default value, should be updated later
      role: 'user',
      avatarUrl: defaultAvatarUrl,
      coverUrl: defaultCoverUrl,
      bio: '',
      customStatus: '',
      joinNumber,
      createdAt: timestamp,
      updatedAt: timestamp
    });

    // 5. Create default settings
    await ctx.db.insert("settings", {
      firebaseUserId,
      theme: "nightCityDark", // Default theme
      updatedAt: createdAt,
    });
    
    // 6. Create the user's profile
    await ctx.runMutation(api.profiles.createProfile, {
      userId: firebaseUserId,
    });
    
    // 7. Make sure achievements are initialized
    await ctx.runMutation(api.achievements.initializeAchievements, {
      firebaseUserId,
    });
    
    // 8. Award "join_community" achievement
    const joinAchievement = await ctx.db
      .query("achievements")
      .filter((q) => q.eq(q.field("name"), "Join Community"))
      .first();

    if (joinAchievement) {
      await ctx.runMutation(api.achievements.awardAchievement, {
        userId,
        achievementId: joinAchievement._id,
      });
    }
    
    // 9. Check if user qualifies for early adopter achievement
    await ctx.runMutation(api.achievements.checkEarlyAdopter, {
      userId,
      joinNumber,
    });
    
    // Generate initial friend code in the proper table
    const code = await generateFriendCode(ctx);
    await ctx.db.insert("friendCodes", {
      userId,
      code,
      isActive: true,
      usedBy: [],
      createdAt: new Date().toISOString(),
    });
    
    return null;
  },
});

// Ensure a user exists, creating them if necessary
export const ensureUser = mutation({
  args: {
    firebaseUserId: v.string(),
    email: v.string(),
    displayName: v.string(),
    username: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if user already exists
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_firebase_id", (q) => q.eq("firebaseUserId", args.firebaseUserId))
      .first();

    if (existingUser === null) {
      // User doesn't exist.
      // IMPORTANT: Only create the user if the username was explicitly provided
      // This prevents the onAuthStateChanged listener (which lacks username) from creating the user prematurely.
      if (args.username) {
        // Username was provided (call originates from register function)
        console.log(`Creating new user via ensureUser (registration path) for Firebase ID: ${args.firebaseUserId}`);
        await ctx.runMutation(api.users.createUser, {
          firebaseUserId: args.firebaseUserId,
          email: args.email,
          displayName: args.displayName,
          username: args.username, // Use the provided username
          createdAt: Date.now(), 
        });
      } else {
        // Username was NOT provided (call likely originates from onAuthStateChanged during registration race)
        // Do NOT create the user here. Log the situation.
        console.log(`ensureUser: User not found for ${args.firebaseUserId}, and username not provided. Assuming registration in progress or user genuinely doesn't exist.`);
        // Optionally, you could throw an error or handle this case differently if a user 
        // *should* always exist when onAuthStateChanged fires after initial registration.
        // For now, simply not creating the user here is the goal.
      }
    } else {
      // User exists, potentially update fields if needed (optional)
      console.log(`User already exists for Firebase ID: ${args.firebaseUserId}`);
      // Consider if updates are needed here, e.g., if displayName from Firebase changed.
      // if (args.displayName !== existingUser.displayName) {
      //   await ctx.db.patch(existingUser._id, { displayName: args.displayName });
      // }
    }
  },
});

// Get a user by Firebase ID
export const getUserByFirebaseId = query({
  args: {
    firebaseUserId: v.string(),
  },
  returns: v.union(
    v.null(),
    v.object({
      _id: v.id("users"),
      _creationTime: v.number(),
      firebaseUserId: v.string(),
      username: v.string(),
      displayName: v.string(),
      email: v.string(),
      dateOfBirth: v.string(),
      role: v.string(),
      avatarUrl: v.union(v.string(), v.null()),
      coverUrl: v.union(v.string(), v.null()),
      bio: v.optional(v.string()),
      customStatus: v.optional(v.string()),
      joinNumber: v.optional(v.number()),
      createdAt: v.string(),
      updatedAt: v.string()
    })
  ),
  handler: async (ctx, { firebaseUserId }) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_firebase_id", q => q.eq("firebaseUserId", firebaseUserId))
      .first();
    
    return user;
  },
}); 