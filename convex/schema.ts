import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  portfolioCompanies: defineTable({
    ticker: v.string(),
    name: v.string(),
    sector: v.string(),
    status: v.union(v.literal("watchlist"), v.literal("owned"), v.literal("archived")),
    thesis: v.optional(v.string()),
    notes: v.optional(v.string()),
    conviction: v.optional(v.union(v.literal("Low"), v.literal("Medium"), v.literal("High"))),
    shares: v.optional(v.number()),
    averageCost: v.optional(v.number()),
    targetAllocation: v.optional(v.number()),
    tags: v.optional(v.array(v.string())),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_ticker", ["ticker"]),
});
