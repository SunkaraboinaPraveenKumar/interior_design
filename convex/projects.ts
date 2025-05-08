import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createProject = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    price: v.number(),
    status: v.union(
      v.literal("planning"),
      v.literal("in_progress"),
      v.literal("completed"),
      v.literal("delayed")
    ),
    clientEmail: v.string(),
    clientImageId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    // Generate the URL for the client image if provided
    const clientImageUrl =  await ctx.storage.getUrl(args.clientImageId??'')

    const projectId = await ctx.db.insert("projects", {
      ...args,
      clientImage: clientImageUrl??'',
      createdAt: now,
      updatedAt: now,
    });

    return projectId;
  },
});

export const getProjects = query(async (ctx) => {
  return await ctx.db.query("projects").collect();
});

export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});

export const updateProjectStatus = mutation({
  args: { projectId: v.id("projects") },
  handler: async (ctx, { projectId }) => {
    const tasks = await ctx.db
      .query("tasks") 
      .withIndex("by_project", (q) => q.eq("projectId", projectId))
      .collect();

    const allTasksCompleted = tasks.every((task) => task.status === "completed");

    if (allTasksCompleted) {
      await ctx.db.patch(projectId, {
        status: "completed",
        updatedAt: Date.now(),
      });
    }
  },
});

export const getProjectsStats = query(async (ctx) => {
  const projects = await ctx.db.query("projects").collect();

  const stats = {
    total: projects.length,
    planning: projects.filter((project) => project.status === "planning").length,
    in_progress: projects.filter((project) => project.status === "in_progress").length,
    completed: projects.filter((project) => project.status === "completed").length,
    delayed: projects.filter((project) => project.status === "delayed").length,
  };

  return stats;
});

export const getRecentProjects = query(async (ctx) => {
  const recentProjects = await ctx.db
    .query("projects")
    .order("desc") // Sort by descending order of creation
    .take(5); // Limit to the 5 most recent projects

  return recentProjects;
});

// Add this function to your projects.ts file in the convex folder

export const getProjectsByEmail = query({
  args: {
    clientEmail: v.string(),
  },
  handler: async (ctx, { clientEmail }) => {
    const projects = await ctx.db
      .query("projects")
      .filter((q) => q.eq(q.field("clientEmail"), clientEmail))
      .collect();
    
    return projects;
  },
});

export const getProjectByIdOrEmail = query({
  args: {
    id: v.optional(v.id("projects")), // Optional project ID
    clientEmail: v.optional(v.string()), // Optional client email
  },
  handler: async (ctx, { id, clientEmail }) => {
    if (!id && !clientEmail) {
      throw new Error("Either 'id' or 'clientEmail' must be provided.");
    }

    const project = await ctx.db
      .query("projects")
      .filter((q) => {
        if (id) return q.eq(q.field("_id"), id);
        if (clientEmail) return q.eq("clientEmail", clientEmail);
        return false;
      })
      .first();

    if (!project) {
      throw new Error("Project not found.");
    }

    return project;
  },
});

export const getAllProjectIds = query({
  args: {},
  handler: async (ctx) => {
    const projects = await ctx.db.query("projects").collect();
    return projects.map((p) => p._id);
  },
});

// Add these functions to your Convex backend file

export const updateProject = mutation({
  args: {
    projectId: v.id("projects"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    price: v.optional(v.number()),
    status: v.optional(
      v.union(
        v.literal("planning"),
        v.literal("in_progress"),
        v.literal("completed"),
        v.literal("delayed")
      )
    ),
    clientEmail: v.optional(v.string()),
    clientImageId: v.optional(v.optional(v.string())),
  },
  handler: async (ctx, args) => {
    const { projectId, ...updates } = args;
    
    // Check if project exists
    const existingProject = await ctx.db.get(projectId);
    if (!existingProject) {
      throw new Error("Project not found");
    }

    // Prepare the update object
    const updateObj: {
      updatedAt: number;
      title?: string;
      description?: string;
      price?: number;
      status?: "planning" | "in_progress" | "completed" | "delayed";
      clientEmail?: string;
      clientImageId?: string;
      clientImage?: string;
    } = {
      ...updates,
      updatedAt: Date.now(),
    };

    // Handle the clientImage URL if a new clientImageId is provided
    if (updates.clientImageId) {
      updateObj.clientImage = await ctx.storage.getUrl(updates.clientImageId) || '';
    }

    // Update the project with new values
    await ctx.db.patch(projectId, updateObj);

    return projectId;
  },
});

export const updateProjectStatusOnly = mutation({
  args: {
    projectId: v.id("projects"),
    status: v.union(
      v.literal("planning"),
      v.literal("in_progress"),
      v.literal("completed"),
      v.literal("delayed")
    ),
  },
  handler: async (ctx, args) => {
    const { projectId, status } = args;
    
    await ctx.db.patch(projectId, {
      status,
      updatedAt: Date.now(),
    });

    return projectId;
  },
});