import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createTask = mutation({
  args: {
    projectId: v.id("projects"),
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
    taskImageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    
    // Generate the URL for the task image if provided
    let taskImageUrl = undefined;
    if (args.taskImageUrl) {
      taskImageUrl = await ctx.storage.getUrl(args.taskImageUrl);
    }
    
    const taskId = await ctx.db.insert("tasks", {
      projectId: args.projectId,
      title: args.title,
      description: args.description,
      price: args.price,
      status: args.status,
      completionDate: args.completionDate,
      delayReason: args.delayReason,
      materials: args.materials,
      taskImageUrl: taskImageUrl??'',
      createdAt: now,
      updatedAt: now,
    });
    
    return taskId;
  },
});

export const getTasksByProjectId = query({
  args: {
    projectId: v.id("projects"),
  },
  handler: async (ctx, args) => {
    const tasks = await ctx.db
      .query("tasks")
      .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
      .order("desc")
      .collect();
    
    return tasks;
  },
});

export const updateTaskStatus = mutation({
  args: {
    taskId: v.id("tasks"),
    status: v.union(
      v.literal("pending"),
      v.literal("in_progress"),
      v.literal("completed"),
      v.literal("delayed")
    ),
    delayReason: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const task = await ctx.db.get(args.taskId);
    if (!task) {
      throw new Error("Task not found");
    }
    
    await ctx.db.patch(args.taskId, { 
      status: args.status,
      delayReason: args.status === "delayed" ? args.delayReason : task.delayReason,
      updatedAt: Date.now(),
    });
    
    return args.taskId;
  },
});


export const deleteTask = mutation({
  args: {
    taskId: v.id("tasks"),
  },
  handler: async (ctx, args) => {
    const task = await ctx.db.get(args.taskId);
    if (!task) {
      throw new Error("Task not found");
    }

    await ctx.db.delete(args.taskId);
    return args.taskId;
  },
});

// Update task function
export const updateTask = mutation({
  args: {
    taskId: v.id("tasks"),
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
    taskImageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if the task exists
    const task = await ctx.db.get(args.taskId);
    if (!task) {
      throw new Error("Task not found");
    }

    // Prepare update data
    const updateData: any = {
      title: args.title,
      description: args.description,
      price: args.price,
      status: args.status,
    };

    // Add optional fields if they are provided
    if (args.completionDate !== undefined) {
      updateData.completionDate = args.completionDate;
    }

    if (args.delayReason !== undefined) {
      updateData.delayReason = args.delayReason;
    }

    if (args.materials !== undefined) {
      updateData.materials = args.materials;
    }

    if (args.taskImageUrl !== undefined) {
      updateData.taskImageUrl = args.taskImageUrl;
    }

    // Update the task in the database
    return await ctx.db.patch(args.taskId, updateData);
  },
});