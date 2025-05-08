import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getUser = query({
  args: { tokenIdentifier: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", args.tokenIdentifier))
      .first();

    return user;
  },
});

export const createUser = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    password:v.string(),
    tokenIdentifier: v.string(),
  },
  handler: async (ctx, args) => {
    // Default role is user, only manually assign admin role
    const user = await ctx.db.insert("users", {
      name: args.name,
      email: args.email,
      password:args.password,
      tokenIdentifier: args.tokenIdentifier,
      role: "user",
    });

    return user;
  },
});

export const getUserRole = query({
  args: { tokenIdentifier: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", args.tokenIdentifier))
      .first();

    return user?.role || null;
  },
});


export const login = mutation({
  args: { email: v.string(), password: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .filter(q=>q.eq(q.field('email'),args.email))
      .first();

    if (!user || user.password !== args.password) {
      throw new Error("Invalid email or password");
    }

    return {
      tokenIdentifier: user.tokenIdentifier,
      role: user.role,
    };
  },
});