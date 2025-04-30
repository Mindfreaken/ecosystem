import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { paginationOptsValidator } from "convex/server";

// Send a new message
export const sendMessage = mutation({
  args: {
    content: v.string(), // Encrypted content
    senderId: v.id("users"),
    encryptionMetadata: v.object({
      iv: v.string(),
      ephemeralPublicKey: v.string(),
    }),
    attachments: v.optional(v.array(v.object({
      type: v.string(),
      fileName: v.string(),
      fileUrl: v.string(),
      encryptionKey: v.string(),
      iv: v.string(),
      mimeType: v.string(),
      size: v.number(),
    }))),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("messages", {
      content: args.content,
      senderId: args.senderId,
      encryptionMetadata: args.encryptionMetadata,
      attachments: args.attachments || [],
    });
  },
});

// Reply to a message (create thread)
export const replyToMessage = mutation({
  args: {
    content: v.string(),
    senderId: v.id("users"),
    parentMessageId: v.id("messages"),
    encryptionMetadata: v.object({
      iv: v.string(),
      ephemeralPublicKey: v.string(),
    }),
  },
  handler: async (ctx, args) => {
    const parentMessage = await ctx.db.get(args.parentMessageId);
    if (!parentMessage) {
      throw new Error("Parent message not found");
    }

    // If parent is already part of a thread, use its rootThreadId
    const rootThreadId = parentMessage.rootThreadId || args.parentMessageId;

    return await ctx.db.insert("messages", {
      content: args.content,
      senderId: args.senderId,
      threadId: args.parentMessageId,
      rootThreadId,
      encryptionMetadata: args.encryptionMetadata,
    });
  },
});

// Get thread messages
export const getThreadMessages = query({
  args: {
    rootThreadId: v.id("messages"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("messages")
      .withIndex("by_root_thread", (q) => q.eq("rootThreadId", args.rootThreadId))
      .collect();
  },
});

// Get thread messages with pagination
export const getThreadMessagesPaginated = query({
  args: {
    rootThreadId: v.id("messages"),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("messages")
      .withIndex("by_root_thread", (q) => q.eq("rootThreadId", args.rootThreadId))
      .order("desc")
      .paginate(args.paginationOpts);
  },
});

// Report a message
export const reportMessage = mutation({
  args: {
    messageId: v.id("messages"),
    reporterId: v.id("users"),
    reason: v.string(),
    decryptedContent: v.string(), // Will be encrypted with admin public key
  },
  handler: async (ctx, args) => {
    // Verify the message exists
    const message = await ctx.db.get(args.messageId);
    if (!message) {
      throw new Error("Message not found");
    }

    return await ctx.db.insert("reports", {
      messageId: args.messageId,
      reporterId: args.reporterId,
      reason: args.reason,
      decryptedContent: args.decryptedContent,
      status: "pending",
      timestamp: Date.now(),
    });
  },
});

// Get reported messages (admin only)
export const getReportedMessages = query({
  args: {
    adminId: v.id("users"),
  },
  handler: async (ctx, args) => {
    // Verify admin status
    const admin = await ctx.db.get(args.adminId);
    if (!admin?.isAdmin) {
      throw new Error("Unauthorized");
    }

    return await ctx.db
      .query("reports")
      .withIndex("by_status", (q) => q.eq("status", "pending"))
      .collect();
  },
});

// Update report status (admin only)
export const updateReportStatus = mutation({
  args: {
    reportId: v.id("reports"),
    adminId: v.id("users"),
    status: v.union(v.literal("reviewed"), v.literal("dismissed")),
  },
  handler: async (ctx, args) => {
    // Verify admin status
    const admin = await ctx.db.get(args.adminId);
    if (!admin?.isAdmin) {
      throw new Error("Unauthorized");
    }

    return await ctx.db.patch(args.reportId, {
      status: args.status,
    });
  },
});

// Pin/unpin message
export const toggleMessagePin = mutation({
  args: {
    messageId: v.id("messages"),
    userId: v.id("users"),
  },
  returns: v.boolean(),
  handler: async (ctx, args) => {
    const message = await ctx.db.get(args.messageId);
    if (!message) {
      throw new Error("Message not found");
    }

    const isPinned = !message.isPinned;
    await ctx.db.patch(args.messageId, {
      isPinned,
      pinnedBy: isPinned ? args.userId : undefined,
      pinnedAt: isPinned ? Date.now() : undefined,
    });

    return isPinned;
  },
});

// Add/remove reaction
export const toggleReaction = mutation({
  args: {
    messageId: v.id("messages"),
    userId: v.id("users"),
    reaction: v.string(),
  },
  returns: v.boolean(),
  handler: async (ctx, args) => {
    // First find if the reaction exists
    const existing = await ctx.db
      .query("messageReactions")
      .withIndex("by_user_and_message", (q) => 
        q.eq("userId", args.userId)
         .eq("messageId", args.messageId)
      )
      .filter(q => q.eq(q.field("reaction"), args.reaction))
      .unique();

    if (existing) {
      await ctx.db.delete(existing._id);
      return false;
    }

    await ctx.db.insert("messageReactions", {
      messageId: args.messageId,
      userId: args.userId,
      reaction: args.reaction,
      createdAt: Date.now(),
    });
    return true;
  },
});

// Create task from message
export const createMessageTask = mutation({
  args: {
    messageId: v.id("messages"),
    title: v.string(),
    description: v.optional(v.string()),
    assignedTo: v.array(v.id("users")),
    dueDate: v.optional(v.number()),
    createdBy: v.id("users"),
  },
  handler: async (ctx, args) => {
    const message = await ctx.db.get(args.messageId);
    if (!message) {
      throw new Error("Message not found");
    }

    // Update message to indicate it has a task
    await ctx.db.patch(args.messageId, {
      hasTask: true,
    });

    // Create the task
    return await ctx.db.insert("messageTasks", {
      messageId: args.messageId,
      title: args.title,
      description: args.description,
      status: "pending",
      assignedTo: args.assignedTo,
      dueDate: args.dueDate,
      createdBy: args.createdBy,
      createdAt: Date.now(),
    });
  },
});

// Update task status
export const updateTaskStatus = mutation({
  args: {
    taskId: v.id("messageTasks"),
    userId: v.id("users"),
    status: v.union(
      v.literal("pending"),
      v.literal("in_progress"),
      v.literal("completed"),
      v.literal("cancelled")
    ),
  },
  handler: async (ctx, args) => {
    const task = await ctx.db.get(args.taskId);
    if (!task) {
      throw new Error("Task not found");
    }

    interface TaskUpdate {
      status: typeof args.status;
      completedAt?: number;
      completedBy?: typeof args.userId;
    }

    const updates: TaskUpdate = {
      status: args.status,
    };

    if (args.status === "completed") {
      updates.completedAt = Date.now();
      updates.completedBy = args.userId;
    }

    return await ctx.db.patch(args.taskId, updates);
  },
});

// Mark message as read
export const markMessageRead = mutation({
  args: {
    messageId: v.id("messages"),
    userId: v.id("users"),
    deviceInfo: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const message = await ctx.db.get(args.messageId);
    if (!message) {
      throw new Error("Message not found");
    }

    // Check if read receipt already exists
    const existing = await ctx.db
      .query("messageReadReceipts")
      .withIndex("by_user_and_message", (q) => 
        q.eq("userId", args.userId)
         .eq("messageId", args.messageId)
      )
      .unique();

    if (existing) {
      // Update existing read receipt
      return await ctx.db.patch(existing._id, {
        readAt: Date.now(), // UTC timestamp
        deviceInfo: args.deviceInfo,
      });
    }

    // Create new read receipt
    return await ctx.db.insert("messageReadReceipts", {
      messageId: args.messageId,
      userId: args.userId,
      readAt: Date.now(), // UTC timestamp
      deviceInfo: args.deviceInfo,
    });
  },
});

// Get message read status
export const getMessageReadReceipts = query({
  args: {
    messageId: v.id("messages"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("messageReadReceipts")
      .withIndex("by_message", (q) => q.eq("messageId", args.messageId))
      .collect();
  },
});

// Get message read receipts with pagination
export const getMessageReadReceiptsPaginated = query({
  args: {
    messageId: v.id("messages"),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("messageReadReceipts")
      .withIndex("by_message", (q) => q.eq("messageId", args.messageId))
      .order("desc")
      .paginate(args.paginationOpts);
  },
});

// Get user's recent read messages with pagination
export const getUserRecentReadMessagesPaginated = query({
  args: {
    userId: v.id("users"),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("messageReadReceipts")
      .withIndex("by_user_recent", (q) => q.eq("userId", args.userId))
      .order("desc")
      .paginate(args.paginationOpts);
  },
});

// Get reactions for a message
export const getMessageReactions = query({
  args: {
    messageId: v.id("messages"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("messageReactions")
      .withIndex("by_message", (q) => q.eq("messageId", args.messageId))
      .collect();
  },
});

// Get message reactions with pagination
export const getMessageReactionsPaginated = query({
  args: {
    messageId: v.id("messages"),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("messageReactions")
      .withIndex("by_message", (q) => q.eq("messageId", args.messageId))
      .order("desc")
      .paginate(args.paginationOpts);
  },
});

// Get tasks for a message
export const getMessageTasks = query({
  args: {
    messageId: v.id("messages"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("messageTasks")
      .withIndex("by_message", (q) => q.eq("messageId", args.messageId))
      .collect();
  },
}); 