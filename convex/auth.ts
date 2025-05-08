import { v } from "convex/values";
import { internalMutation, query } from "./_generated/server";

export const getSession = query({
  args: { tokenIdentifier: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", args.tokenIdentifier))
      .first();

    if (!identity) {
      return null;
    }

    return {
      user: {
        id: identity._id,
        name: identity.name,
        email: identity.email,
        role: identity.role,
      },
    };
  },
});

export const updateUserRole = internalMutation({
  args: { id: v.id("users"), role: v.union(v.literal("admin"), v.literal("user")) },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { role: args.role });
  },
});