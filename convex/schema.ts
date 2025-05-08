import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    password:v.string(),
    role: v.union(v.literal("admin"), v.literal("user")),
    tokenIdentifier: v.string(),
  }).index("by_token", ["tokenIdentifier"]),

  projects: defineTable({
    title: v.string(),
    description: v.string(),
    price: v.number(),
    status: v.union(
      v.literal("planning"),
      v.literal("in_progress"),
      v.literal("completed"),
      v.literal("delayed")
    ),
    clientImageId: v.optional(v.string()),
    clientEmail: v.string(), // Email of the client
    clientImage: v.optional(v.string()), // URL of the client's image
    createdAt: v.number(),
    updatedAt: v.number(),
  }),

  // Tasks table (linked to projects)
  tasks: defineTable({
    projectId: v.id("projects"), // Reference to the project
    title: v.string(),
    description: v.string(),
    price: v.number(),
    status: v.union(
      v.literal("pending"),
      v.literal("in_progress"),
      v.literal("completed"),
      v.literal("delayed")
    ),
    completionDate: v.optional(v.string()),
    delayReason: v.optional(v.string()),
    materials: v.optional(v.array(v.string())),
    taskImageUrl: v.optional(v.string()), // URL of the task image
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_project", ["projectId"])
});