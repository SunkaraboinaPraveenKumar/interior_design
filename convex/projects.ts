import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export const getProjects = query({
  handler: async (ctx) => {
    const projects = await ctx.db.query("projects").collect();
    
    // For each project, get its images
    const projectsWithImages = await Promise.all(
      projects.map(async (project) => {
        const images = await ctx.db
          .query("projectImages")
          .withIndex("by_project", (q) => q.eq("projectId", project._id))
          .collect();
          
        return {
          ...project,
          images,
        };
      })
    );
    
    return projectsWithImages;
  },
});

export const getFeaturedProjects = query({
  handler: async (ctx) => {
    const projects = await ctx.db
      .query("projects")
      .withIndex("by_featured", (q) => q.eq("featured", true))
      .collect();
    
    // For each project, get its images
    const projectsWithImages = await Promise.all(
      projects.map(async (project) => {
        const images = await ctx.db
          .query("projectImages")
          .withIndex("by_project", (q) => q.eq("projectId", project._id))
          .collect();
          
        return {
          ...project,
          images,
        };
      })
    );
    
    return projectsWithImages;
  },
});

export const getProjectById = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    const project = await ctx.db.get(args.projectId);
    
    if (!project) {
      return null;
    }
    
    const images = await ctx.db
      .query("projectImages")
      .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
      .collect();
      
    return {
      ...project,
      images,
    };
  },
});

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
    completionDate: v.optional(v.string()),
    delayReason: v.optional(v.string()),
    materials: v.optional(v.array(v.string())),
    featured: v.optional(v.boolean()),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    
    const projectId = await ctx.db.insert("projects", {
      title: args.title,
      description: args.description,
      price: args.price,
      status: args.status,
      completionDate: args.completionDate,
      delayReason: args.delayReason,
      materials: args.materials,
      featured: args.featured || false,
      createdBy: args.userId,
      createdAt: now,
      updatedAt: now,
    });
    
    return projectId;
  },
});

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
    completionDate: v.optional(v.string()),
    delayReason: v.optional(v.string()),
    materials: v.optional(v.array(v.string())),
    featured: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { projectId, ...fields } = args;
    
    const existing = await ctx.db.get(projectId);
    if (!existing) {
      throw new Error("Project not found");
    }
    
    await ctx.db.patch(projectId, {
      ...fields,
      updatedAt: Date.now(),
    });
    
    return projectId;
  },
});

export const deleteProject = mutation({
  args: {
    projectId: v.id("projects"),
  },
  handler: async (ctx, args) => {
    // First delete all related images
    const images = await ctx.db
      .query("projectImages")
      .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
      .collect();
      
    for (const image of images) {
      await ctx.db.delete(image._id);
    }
    
    // Then delete the project
    await ctx.db.delete(args.projectId);
    
    return true;
  },
});

export const addProjectImage = mutation({
  args: {
    projectId: v.id("projects"),
    storageId: v.string(),
    url: v.string(),
    order: v.number(),
  },
  handler: async (ctx, args) => {
    const imageId = await ctx.db.insert("projectImages", {
      projectId: args.projectId,
      storageId: args.storageId,
      url: args.url,
      order: args.order,
    });
    
    return imageId;
  },
});

export const removeProjectImage = mutation({
  args: {
    imageId: v.id("projectImages"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.imageId);
    return true;
  },
});

export const getProjectStatsByStatus = query({
  handler: async (ctx) => {
    const projects = await ctx.db.query("projects").collect();
    
    const stats = {
      planning: 0,
      in_progress: 0,
      completed: 0,
      delayed: 0,
      total: projects.length,
    };
    
    projects.forEach((project) => {
      stats[project.status as keyof typeof stats] += 1;
    });
    
    return stats;
  },
});

export const getRecentProjects = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = args.limit || 5;
    
    const projects = await ctx.db
      .query("projects")
      .order("desc")
      .take(limit);
    
    const projectsWithImages = await Promise.all(
      projects.map(async (project) => {
        const images = await ctx.db
          .query("projectImages")
          .withIndex("by_project", (q) => q.eq("projectId", project._id))
          .collect();
          
        return {
          ...project,
          images,
        };
      })
    );
    
    return projectsWithImages;
  },
});