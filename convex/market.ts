import { action } from "./_generated/server";
import { v } from "convex/values";

type AlphaQuote = {
  "01. symbol"?: string;
  "05. price"?: string;
  "10. change percent"?: string;
};

type AlphaDailySeries = Record<string, { "4. close"?: string }>;

function toNumber(value: string | undefined) {
  if (!value) return undefined;
  const parsed = Number(value.replace("%", ""));
  return Number.isFinite(parsed) ? parsed : undefined;
}

function sanitizeProviderMessage(message: string, apiKey: string) {
  return message.split(apiKey).join("[hidden]");
}

export const getSnapshot = action({
  args: {
    ticker: v.string(),
  },
  handler: async (_ctx, args) => {
    const apiKey = process.env.ALPHA_VANTAGE_API_KEY;
    const ticker = args.ticker.toUpperCase();

    if (!apiKey) {
      return {
        configured: false,
        source: "mock",
        message: "Add ALPHA_VANTAGE_API_KEY in Convex to enable live Alpha Vantage data.",
      };
    }

    const quoteUrl = new URL("https://www.alphavantage.co/query");
    quoteUrl.searchParams.set("function", "GLOBAL_QUOTE");
    quoteUrl.searchParams.set("symbol", ticker);
    quoteUrl.searchParams.set("apikey", apiKey);

    const dailyUrl = new URL("https://www.alphavantage.co/query");
    dailyUrl.searchParams.set("function", "TIME_SERIES_DAILY");
    dailyUrl.searchParams.set("symbol", ticker);
    dailyUrl.searchParams.set("outputsize", "compact");
    dailyUrl.searchParams.set("apikey", apiKey);

    let quoteJson;
    let dailyJson;

    try {
      const [quoteResponse, dailyResponse] = await Promise.all([fetch(quoteUrl), fetch(dailyUrl)]);
      quoteJson = await quoteResponse.json();
      dailyJson = await dailyResponse.json();
    } catch {
      return {
        configured: true,
        source: "alpha-vantage",
        message: "Could not reach Alpha Vantage. Showing starter data for now.",
      };
    }

    const providerMessage = quoteJson.Note ?? dailyJson.Note ?? quoteJson.Information ?? dailyJson.Information;

    if (providerMessage) {
      return {
        configured: true,
        source: "alpha-vantage",
        message: `Alpha Vantage says: ${sanitizeProviderMessage(providerMessage, apiKey)}`,
      };
    }

    if (quoteJson["Error Message"] || dailyJson["Error Message"]) {
      return {
        configured: true,
        source: "alpha-vantage",
        message: "Alpha Vantage did not recognize that ticker.",
      };
    }

    const quote = quoteJson["Global Quote"] as AlphaQuote | undefined;
    const series = dailyJson["Time Series (Daily)"] as AlphaDailySeries | undefined;
    const chart = series
      ? Object.entries(series)
          .slice(0, 40)
          .reverse()
          .map(([date, point]) => ({
            date,
            close: toNumber(point["4. close"]) ?? 0,
          }))
          .filter((point) => point.close > 0)
      : [];

    return {
      configured: true,
      source: "alpha-vantage",
      ticker,
      price: toNumber(quote?.["05. price"]),
      changePercent: toNumber(quote?.["10. change percent"]),
      chart,
      lastUpdated: chart.length ? chart[chart.length - 1].date : undefined,
      message: chart.length
        ? "Live market data loaded."
        : `No time-series data returned. Alpha Vantage response fields: ${Object.keys(dailyJson).join(", ") || "none"}.`,
    };
  },
});
