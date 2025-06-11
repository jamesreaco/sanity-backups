import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createBackup = mutation({
  args: {
    websiteId: v.id("websites"),
    s3Location: v.optional(v.string()),
    status: v.union(
      v.literal("pending"), 
      v.literal("success"), 
      v.literal("error")
    ),
  },
  handler: async (ctx,args) => {
    const { websiteId, s3Location, status } = args;

    const backup = await ctx.db.insert("backups", {
      websiteId: websiteId,
      s3Location: s3Location || "",
      status: status,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return backup;
  }
})

export const updateBackup = mutation({
  args: { 
    id: v.id("backups"), 
    websiteId: v.id("websites"),
    s3Location: v.optional(v.string()), 
    status: v.union(
      v.literal("pending"), 
      v.literal("success"), 
      v.literal("error")
    ) 
  },
  handler: async (ctx, args) => {
    const { id, websiteId, s3Location, status } = args;
    await ctx.db.patch(id, { 
      websiteId: websiteId, 
      s3Location: s3Location || "", 
      status: status,
      updatedAt: Date.now(), 
    });
  }
})

export const listBackups = query({
  args: { websiteId: v.id("websites") },
  handler: async (ctx, args) => {
    const { websiteId } = args;

    const backups = await ctx.db.query("backups")
      .withIndex("by_website", (q) => q.eq("websiteId", websiteId))
      .order("desc")
      .collect();
    
    return backups;
  }
})

export const deleteBackup = mutation({
  args: { id: v.id("backups") },
  handler: async (ctx, args) => {
    const { id } = args;
    await ctx.db.delete(id);
  }
})