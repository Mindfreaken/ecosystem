import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// Define the rarity type
const rarityValidator = v.union(
  v.literal("common"),
  v.literal("uncommon"),
  v.literal("rare"),
  v.literal("epic"),
  v.literal("legendary")
);

// Define the activity type
const activityTypeValidator = v.union(
  v.literal("post"),
  v.literal("achievement"),
  v.literal("friend"),
  v.literal("event")
);

export default defineSchema({
  users: defineTable({
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
    updatedAt: v.string(),
    name: v.optional(v.string()),
    isAdmin: v.optional(v.boolean()),
    publicKey: v.optional(v.string()), // Make publicKey optional until Signal setup
  }).index("by_firebase_id", ["firebaseUserId"]),

  achievements: defineTable({
    name: v.string(),
    description: v.string(),
    imageUrl: v.string(),
    category: v.string(),
    rarity: rarityValidator,
    limitedEdition: v.optional(v.boolean()),
    maxUsers: v.optional(v.number())
  }),

  userAchievements: defineTable({
    userId: v.id("users"),
    achievementId: v.id("achievements"),
    earnedDate: v.string()
  }).index("by_user", ["userId"]),

  activities: defineTable({
    userId: v.id("users"),
    type: activityTypeValidator,
    title: v.string(),
    description: v.optional(v.string()),
    timestamp: v.string(),
    imageUrl: v.optional(v.string()),
    content: v.optional(v.string()),
    targetType: v.optional(v.string()),
    targetName: v.optional(v.string())
  }).index("by_user", ["userId"]),

  follows: defineTable({
    followerId: v.id("users"),
    followingId: v.id("users"),
    createdAt: v.string()
  }).index("by_follower", ["followerId"])
    .index("by_following", ["followingId"])
    .index("by_follower_following", ["followerId", "followingId"]),

  socialScores: defineTable({
    userId: v.id("users"),
    score: v.number(),
    lastUpdated: v.string()
  }).index("by_user", ["userId"]),

  // Add a new table for tracking user punishments
  userPunishments: defineTable({
    userId: v.id("users"),
    punishmentTypeId: v.id("punishmentTypes"),
    targetUserId: v.optional(v.id("users")),
    appliedAt: v.string(),
    active: v.boolean()
  }).index("by_user", ["userId"])
    .index("by_type_and_user", ["punishmentTypeId", "userId"]),

  // Add a table for punishment types and their point values
  punishmentTypes: defineTable({
    name: v.string(),
    description: v.string(),
    pointValue: v.number(),
    createdAt: v.string(),
    updatedAt: v.string()
  }).index("by_name", ["name"]),

  // Friend codes table with proper validators
  friendCodes: defineTable({
    userId: v.string(), // Firebase user ID
    code: v.string(),
    isActive: v.boolean(),
    usedBy: v.array(v.string()), // Array of Firebase user IDs
    createdAt: v.string(),
  })
    .index("by_user", ["userId"])
    .index("by_code", ["code"])
    .index("by_active_code", ["code", "isActive"]),

  // Friend requests table
  friendRequests: defineTable({
    senderId: v.string(), // Firebase user ID
    receiverId: v.string(), // Firebase user ID
    status: v.union(
      v.literal("pending"),
      v.literal("accepted"),
      v.literal("rejected")
    ),
    friendCodeUsed: v.optional(v.id("friendCodes")),
    createdAt: v.string(),
  })
    .index("by_senderId", ["senderId"])
    .index("by_receiverId", ["receiverId"])
    .index("by_senderId_and_status", ["senderId", "status"])
    .index("by_receiverId_and_status", ["receiverId", "status"]),

  // Friends table
  friends: defineTable({
    userId: v.string(), // Firebase user ID
    friendId: v.string(), // Firebase user ID
    isFavorite: v.boolean(),
    isMuted: v.boolean(),
    isBanned: v.optional(v.boolean()),
    status: v.union(
      v.literal("active"),
      v.literal("blocked"),
      v.literal("removed")
    ),
    createdAt: v.optional(v.string()),
  })
    .index("by_user", ["userId"])
    .index("by_friend", ["friendId"])
    .index("by_user_and_status", ["userId", "status"])
    .index("by_user_and_friend", ["userId", "friendId"]),

  profiles: defineTable(
    v.object({
      userId: v.string(), // Reference to users.firebaseUserId
      bio: v.optional(v.string()),
      customStatus: v.optional(v.string()),
      avatarUrl: v.optional(v.string()),
      glitterSeed: v.number(), // For visual effects
      updatedAt: v.number(),
      profileTypeId: v.optional(v.string()), // Reference to profileTypes.id
    })
  ),

  profileTypes: defineTable(
    v.object({
      name: v.string(), // e.g. "Gamer", "Artist", "Developer"
      description: v.string(),
      iconUrl: v.optional(v.string()),
      createdAt: v.number(),
    })
  ),

  achievementsDefs: defineTable(
    v.object({
      key: v.string(), // Unique identifier for achievement type
      name: v.string(),
      description: v.string(),
      category: v.string(), // e.g. "Profile", "Social", "Community" 
      requirements: v.string(), // JSON string of requirements for achieving
      rewardType: v.optional(v.string()), // e.g. "Badge", "Title"
      rewardValue: v.optional(v.string()), // Specific value of reward
      iconUrl: v.optional(v.string()),
      createdAt: v.number(),
    })
  ),

  settings: defineTable(
    v.object({
      firebaseUserId: v.string(),
      theme: v.string(),
      updatedAt: v.number(),
    })
  ).index("by_firebase_id_unique", ["firebaseUserId"]),

  counters: defineTable(
    v.object({
      name: v.string(), // e.g. "joinCounter"
      value: v.number(),
    })
  ),

  messages: defineTable({
    content: v.string(), // Encrypted content
    senderId: v.id("users"),
    threadId: v.optional(v.id("messages")), // Points to parent message if this is a reply
    rootThreadId: v.optional(v.id("messages")), // Points to the root message of the thread
    isPinned: v.optional(v.boolean()),
    pinnedBy: v.optional(v.id("users")),
    pinnedAt: v.optional(v.number()),
    hasTask: v.optional(v.boolean()),
    encryptionMetadata: v.object({
      iv: v.string(),
      ephemeralPublicKey: v.string(),
    }),
    attachments: v.optional(v.array(v.object({
      type: v.string(), // "image" | "file"
      fileName: v.string(),
      fileUrl: v.string(),
      encryptionKey: v.string(),
      iv: v.string(),
      mimeType: v.string(),
      size: v.number(),
    }))),
  }).index("by_thread", ["threadId"])
    .index("by_root_thread", ["rootThreadId"])
    .index("by_pinned", ["isPinned"]),

  messageReactions: defineTable({
    messageId: v.id("messages"),
    userId: v.id("users"),
    reaction: v.string(), // emoji or reaction type
    createdAt: v.number(),
  }).index("by_message", ["messageId"])
    .index("by_user_and_message", ["userId", "messageId"]),

  messageTasks: defineTable({
    messageId: v.id("messages"),
    title: v.string(),
    description: v.optional(v.string()),
    status: v.union(
      v.literal("pending"),
      v.literal("in_progress"),
      v.literal("completed"),
      v.literal("cancelled")
    ),
    assignedTo: v.array(v.id("users")),
    dueDate: v.optional(v.number()),
    completedAt: v.optional(v.number()),
    completedBy: v.optional(v.id("users")),
    createdBy: v.id("users"),
    createdAt: v.number(),
  }).index("by_message", ["messageId"])
    .index("by_assigned_user", ["assignedTo"])
    .index("by_status", ["status"]),

  messageReadReceipts: defineTable({
    messageId: v.id("messages"),
    userId: v.id("users"),
    readAt: v.number(), // UTC timestamp in milliseconds
    deviceInfo: v.optional(v.string()), // Optional device information
  }).index("by_message", ["messageId"])
    .index("by_user_and_message", ["userId", "messageId"])
    .index("by_user_recent", ["userId", "readAt"]),

  reports: defineTable({
    messageId: v.id("messages"),
    reporterId: v.id("users"),
    reason: v.string(),
    status: v.string(), // "pending", "reviewed", "dismissed"
    decryptedContent: v.string(), // Stored encrypted with admin public key
    timestamp: v.number(),
  }).index("by_status", ["status"])
    .index("by_message", ["messageId"]),

  adminKeys: defineTable({
    publicKey: v.string(),
    encryptedPrivateKey: v.string(), // Encrypted with admin's personal key
    userId: v.id("users"),
  }).index("by_user", ["userId"]),
}); 