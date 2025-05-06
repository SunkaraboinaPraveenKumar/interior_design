import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    role: v.union(v.literal("admin"), v.literal("user")),
    image: v.optional(v.string()),
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
    completionDate: v.optional(v.string()),
    delayReason: v.optional(v.string()),
    materials: v.optional(v.array(v.string())),
    createdBy: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
    featured: v.optional(v.boolean()),
  })
    .index("by_createdBy", ["createdBy"])
    .index("by_status", ["status"])
    .index("by_featured", ["featured"]),

  projectImages: defineTable({
    projectId: v.id("projects"),
    storageId: v.string(),
    url: v.string(),
    order: v.number(),
  }).index("by_project", ["projectId"]),
});