import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const schema = defineSchema({
  websites: defineTable({
    title: v.string(),
    slug: v.string(),
    sanityConfig: v.object({
      projectId: v.string(),
      dataset: v.string(),
      apiVersion: v.string(),
      token: v.string(),
    }),
    createdAt: v.number(),
    updatedAt: v.number(),
  }),
  backups: defineTable({
    websiteId: v.id("websites"),
    s3Location: v.string(),
    status: v.union(v.literal("pending"), v.literal("success"), v.literal("error")),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_website", ["websiteId"]),
})

export default schema;