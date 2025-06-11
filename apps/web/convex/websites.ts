import { v } from "convex/values";
import { slugify } from "@/lib/utils";
import { mutation, query } from "./_generated/server";

export const createWebsite = mutation({
  args: {
    title: v.string(),
    slug: v.string(),
    sanityConfig: v.object({
      projectId: v.string(),
      dataset: v.string(),
      apiVersion: v.string(),
      token: v.string(),
    })
  },
  handler: async (ctx,args) => {
    const { title, sanityConfig } = args;

    const website = await ctx.db.insert("websites", {
      title: title,
      slug: slugify(title),
      sanityConfig: sanityConfig,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return website;
  }
})

export const listWebsites = query({
  handler: async (ctx) => {
    
    const websites = await ctx.db.query("websites")
      .order("desc")
      .collect();

    return websites;
  }
})

export const getWebsite = query({
  args: { id: v.id("websites") },
  handler: async (ctx, args) => {
    const website = await ctx.db.get(args.id);
    if (!website) return null;
    return website;
  }
})

export const updateWebsite = mutation({
  args: { 
    id: v.id("websites"), 
    title: v.string(), 
    sanityConfig: v.object({
      projectId: v.string(),
      dataset: v.string(),
      apiVersion: v.string(),
      token: v.string(),
    }) 
  },
  handler: async (ctx, args) => {
    const { id, title, sanityConfig } = args;

    const website = await ctx.db.patch(id, {
      title: title,
      slug: slugify(title),
      sanityConfig: sanityConfig,
      updatedAt: Date.now(),
    });

    return website;
  }
})

export const deleteWebsite = mutation({
  args: { id: v.id("websites") },
  handler: async (ctx, args) => {
    const { id } = args;
    await ctx.db.delete(id);
  }
})