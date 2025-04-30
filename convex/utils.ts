import { DatabaseReader } from "./_generated/server";

// Generate a unique friend code
export async function generateFriendCode(ctx: { db: DatabaseReader }): Promise<string> {
  const length = 8;
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let friendCode: string;
  let isUnique = false;

  while (!isUnique) {
    // Generate a random code
    friendCode = Array.from(
      { length },
      () => chars[Math.floor(Math.random() * chars.length)]
    ).join('');

    // Check if code is unique in friendCodes table
    const existing = await ctx.db
      .query("friendCodes")
      .filter((q) => q.eq(q.field("code"), friendCode))
      .first();

    if (!existing) {
      isUnique = true;
      return friendCode;
    }
  }

  // TypeScript requires a return statement here, but this will never be reached
  throw new Error("Failed to generate unique friend code");
} 