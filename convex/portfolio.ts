import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx: any) => {
    return await ctx.db.query("portfolioCompanies").order("desc").collect();
  },
});

export const save = mutation({
  args: {
    ticker: v.string(),
    name: v.string(),
    sector: v.string(),
    status: v.optional(v.union(v.literal("watchlist"), v.literal("owned"), v.literal("archived"))),
    thesis: v.optional(v.string()),
    notes: v.optional(v.string()),
    conviction: v.optional(v.union(v.literal("Low"), v.literal("Medium"), v.literal("High"))),
    shares: v.optional(v.number()),
    averageCost: v.optional(v.number()),
    targetAllocation: v.optional(v.number()),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx: any, args: any) => {
    const ticker = args.ticker.toUpperCase();
    const now = Date.now();
    const existing = await ctx.db
      .query("portfolioCompanies")
      .withIndex("by_ticker", (q: any) => q.eq("ticker", ticker))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        name: args.name,
        sector: args.sector,
        status: args.status ?? existing.status ?? "watchlist",
        thesis: args.thesis,
        notes: args.notes,
        conviction: args.conviction,
        shares: args.shares,
        averageCost: args.averageCost,
        targetAllocation: args.targetAllocation,
        tags: args.tags,
        updatedAt: now,
      });
      return existing._id;
    }

    return await ctx.db.insert("portfolioCompanies", {
      ticker,
      name: args.name,
      sector: args.sector,
      status: args.status ?? "watchlist",
      thesis: args.thesis,
      notes: args.notes,
      conviction: args.conviction,
      shares: args.shares,
      averageCost: args.averageCost,
      targetAllocation: args.targetAllocation,
      tags: args.tags,
      createdAt: now,
      updatedAt: now,
    });
  },
});
