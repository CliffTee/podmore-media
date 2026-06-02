export type Company = {
  ticker: string;
  name: string;
  price: number;
  change: number;
  allocation: number;
  sector: string;
  thesis: string;
  overview: string;
  bullCase: string[];
  bearCase: string[];
  fundamentals: Array<{ label: string; value: string; tone?: "positive" | "negative" }>;
  researchNotes: string[];
  risk: "Low" | "Medium" | "High";
  spark: number[];
};

export const companies: Company[] = [
  {
    ticker: "NVDA",
    name: "NVIDIA Corp.",
    price: 887.12,
    change: 2.8,
    allocation: 24,
    sector: "Semiconductors",
    thesis: "AI infrastructure demand remains the core growth engine.",
    overview:
      "NVIDIA is the portfolio's highest-conviction AI infrastructure name, with demand tied to accelerated computing, data center buildouts, and enterprise AI adoption.",
    bullCase: [
      "Data center revenue keeps compounding as hyperscalers expand AI capacity.",
      "CUDA and the software ecosystem reinforce pricing power.",
      "Networking and systems sales broaden the revenue base beyond chips.",
    ],
    bearCase: [
      "Customer concentration could pressure growth if capex pauses.",
      "Export controls and supply constraints remain headline risks.",
      "Valuation leaves limited room for an execution miss.",
    ],
    fundamentals: [
      { label: "Market Cap", value: "$2.2T" },
      { label: "Revenue Growth", value: "+126%", tone: "positive" },
      { label: "Gross Margin", value: "73%" },
      { label: "Forward P/E", value: "35x" },
    ],
    researchNotes: [
      "Watch management commentary on data center order visibility.",
      "Track competition from custom ASICs at hyperscalers.",
      "Revisit target allocation if valuation expands faster than earnings.",
    ],
    risk: "Medium",
    spark: [35, 42, 40, 49, 52, 61, 57, 68, 75, 73, 82, 88],
  },
  {
    ticker: "MSFT",
    name: "Microsoft",
    price: 421.44,
    change: 0.9,
    allocation: 21,
    sector: "Software",
    thesis: "Cloud margins and enterprise AI adoption support durable compounding.",
    overview:
      "Microsoft anchors the portfolio with resilient enterprise software, Azure growth, and a broad AI distribution advantage through Office, GitHub, and cloud services.",
    bullCase: [
      "Azure gains share as AI workloads increase cloud consumption.",
      "Copilot packaging can lift average revenue per user across Microsoft 365.",
      "Enterprise relationships create durable renewal and upsell paths.",
    ],
    bearCase: [
      "AI monetization may take longer than investor expectations.",
      "Cloud growth could decelerate if enterprise budgets tighten.",
      "Regulatory pressure can slow strategic acquisitions and bundling.",
    ],
    fundamentals: [
      { label: "Market Cap", value: "$3.1T" },
      { label: "Cloud Growth", value: "+24%", tone: "positive" },
      { label: "Operating Margin", value: "45%" },
      { label: "Forward P/E", value: "31x" },
    ],
    researchNotes: [
      "Compare Azure growth against AWS and Google Cloud each quarter.",
      "Watch Copilot attach rates and enterprise renewal language.",
      "Keep as a core compounder unless cloud margins weaken materially.",
    ],
    risk: "Low",
    spark: [48, 50, 54, 52, 57, 58, 62, 64, 63, 68, 71, 74],
  },
  {
    ticker: "AAPL",
    name: "Apple Inc.",
    price: 189.98,
    change: -0.7,
    allocation: 18,
    sector: "Consumer Devices",
    thesis: "Services resilience offsets slower hardware cycles.",
    overview:
      "Apple remains a quality cash-flow holding, but the investment case depends on services growth, buybacks, and signs of a stronger device replacement cycle.",
    bullCase: [
      "Services revenue keeps expanding with attractive margins.",
      "Installed base supports long-term ecosystem pricing power.",
      "Buybacks provide downside support when growth is muted.",
    ],
    bearCase: [
      "Hardware upgrade cycles remain soft in key regions.",
      "AI product differentiation is still developing.",
      "App Store and platform rules face regulatory scrutiny.",
    ],
    fundamentals: [
      { label: "Market Cap", value: "$2.9T" },
      { label: "Services Margin", value: "71%", tone: "positive" },
      { label: "Revenue Growth", value: "-2%", tone: "negative" },
      { label: "Forward P/E", value: "28x" },
    ],
    researchNotes: [
      "Look for evidence that services can offset hardware softness.",
      "Track China demand and product-cycle commentary.",
      "Add only if growth expectations reset or new AI features drive upgrades.",
    ],
    risk: "Medium",
    spark: [58, 56, 54, 55, 53, 51, 52, 50, 49, 51, 48, 47],
  },
  {
    ticker: "TSLA",
    name: "Tesla",
    price: 176.02,
    change: -1.9,
    allocation: 10,
    sector: "Autos",
    thesis: "Execution risk is elevated while autonomy remains an upside option.",
    overview:
      "Tesla is a higher-volatility position where the thesis depends on margins stabilizing, delivery growth recovering, and optionality from autonomy and energy storage.",
    bullCase: [
      "Autonomy progress could change the long-term earnings model.",
      "Energy storage growth adds a second scaled business line.",
      "Manufacturing efficiency can support margins after price cuts.",
    ],
    bearCase: [
      "EV competition keeps pressuring pricing and gross margins.",
      "Delivery growth may not justify the current valuation.",
      "Execution risk is high across autonomy, new models, and factories.",
    ],
    fundamentals: [
      { label: "Market Cap", value: "$560B" },
      { label: "Auto Margin", value: "18%" },
      { label: "Delivery Growth", value: "-9%", tone: "negative" },
      { label: "Forward P/E", value: "57x" },
    ],
    researchNotes: [
      "Require evidence of margin stabilization before increasing allocation.",
      "Separate core auto thesis from autonomy optionality.",
      "Review position sizing after each delivery report.",
    ],
    risk: "High",
    spark: [70, 68, 62, 64, 59, 57, 60, 54, 51, 55, 49, 46],
  },
];

export const news = [
  "Chip demand lifts AI infrastructure outlook across mega-cap tech.",
  "Analysts raise cloud margin estimates after enterprise software checks.",
  "Consumer hardware names trade mixed ahead of product-cycle updates.",
  "Market breadth improves as rates volatility cools.",
];

export const metrics = [
  { label: "Portfolio Value", value: "$128,420", delta: "+1.8%" },
  { label: "Daily P/L", value: "$2,241", delta: "+$418" },
  { label: "Saved Names", value: "18", delta: "+3 this week" },
  { label: "Risk Score", value: "72", delta: "Balanced" },
];
