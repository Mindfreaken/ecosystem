import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getSettings = query({
  args: { firebaseUserId: v.string() },
  returns: v.union(v.null(), v.object({
    theme: v.string(),
    updatedAt: v.number(),
  })),
  handler: async (ctx, { firebaseUserId }) => {
    const result = await ctx.db
      .query("settings")
      .withIndex("by_firebase_id_unique", (q) => q.eq("firebaseUserId", firebaseUserId))
      .first();
    if (!result) return null;
    return { theme: result.theme, updatedAt: result.updatedAt };
  },
});

export const setTheme = mutation({
  args: {
    firebaseUserId: v.string(),
    theme: v.string(),
    updatedAt: v.number(),
  },
  returns: v.null(),
  handler: async (ctx, { firebaseUserId, theme, updatedAt }) => {
    const row = await ctx.db
      .query("settings")
      .withIndex("by_firebase_id_unique", (q) => q.eq("firebaseUserId", firebaseUserId))
      .first();
    if (row) {
      await ctx.db.patch(row._id, { theme, updatedAt });
    } else {
      await ctx.db.insert("settings", { firebaseUserId, theme, updatedAt });
    }
    return null;
  },
}); 