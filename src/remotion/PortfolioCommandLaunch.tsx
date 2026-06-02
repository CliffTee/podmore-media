import type { CSSProperties, ReactNode } from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { evolvePath } from "@remotion/paths";
import {
  Bell,
  BookmarkPlus,
  BriefcaseBusiness,
  CheckCircle2,
  Newspaper,
  Search,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { companies, metrics, news } from "../mockData";

type LaunchProps = {
  productName: string;
  tagline: string;
};

const colors = {
  ink: "#13201b",
  muted: "#65756e",
  panel: "rgba(255, 255, 255, 0.82)",
  line: "#2aa876",
  lineDark: "#197656",
  red: "#b64b4b",
  rail: "#10201b",
};

const ease = Easing.bezier(0.16, 1, 0.3, 1);
const seconds = (value: number, fps: number) => value * fps;

const easeClamp = (frame: number, input: [number, number], output: [number, number]) =>
  interpolate(frame, input, output, {
    easing: ease,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

const chartPath = (values: number[], width: number, height: number) => {
  const min = Math.min(...values);
  const max = Math.max(...values);

  return values
    .map((value, index) => {
      const x = (index / (values.length - 1)) * width;
      const y = height - ((value - min) / (max - min || 1)) * height;
      return `${index === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");
};

const chartPoints = (values: number[], width: number, height: number) => {
  const min = Math.min(...values);
  const max = Math.max(...values);

  return values.map((value, index) => ({
    x: (index / (values.length - 1)) * width,
    y: height - ((value - min) / (max - min || 1)) * height,
  }));
};

const Panel = ({ children, style }: { children: ReactNode; style?: CSSProperties }) => (
  <div
    style={{
      border: "1px solid rgba(16,32,27,0.1)",
      borderRadius: 16,
      background: colors.panel,
      boxShadow: "0 26px 70px rgba(16, 32, 27, 0.12)",
      ...style,
    }}
  >
    {children}
  </div>
);

const Heading = ({
  eyebrow,
  title,
  icon,
}: {
  eyebrow: string;
  title: string;
  icon?: ReactNode;
}) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 20,
      marginBottom: 24,
    }}
  >
    <div>
      <div style={{ color: colors.muted, fontSize: 17, fontWeight: 900, textTransform: "uppercase" }}>
        {eyebrow}
      </div>
      <div style={{ color: colors.ink, fontSize: 30, lineHeight: 1.05, fontWeight: 900 }}>{title}</div>
    </div>
    <div style={{ color: colors.lineDark }}>{icon}</div>
  </div>
);

const StockChart = ({
  values,
  width,
  height,
  progress,
  strokeWidth = 8,
}: {
  values: number[];
  width: number;
  height: number;
  progress: number;
  strokeWidth?: number;
}) => {
  const path = chartPath(values, width, height);
  const area = `${path} L ${width} ${height} L 0 ${height} Z`;
  const evolved = evolvePath(progress, path);
  const points = chartPoints(values, width, height);
  const marker = points[Math.min(points.length - 1, Math.floor(progress * (points.length - 1)))];

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id="launchChartFill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={colors.line} stopOpacity="0.28" />
          <stop offset="100%" stopColor={colors.line} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#launchChartFill)" opacity={progress} />
      <path
        d={path}
        fill="none"
        stroke={colors.line}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
        strokeDasharray={evolved.strokeDasharray}
        strokeDashoffset={evolved.strokeDashoffset}
      />
      <circle
        cx={marker.x}
        cy={marker.y}
        r={12}
        fill="#ffffff"
        stroke={colors.line}
        strokeWidth={5}
        opacity={progress > 0.06 ? 1 : 0}
      />
    </svg>
  );
};

const Scene = ({
  start,
  end,
  children,
}: {
  start: number;
  end: number;
  children: (localFrame: number) => ReactNode;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const startFrame = seconds(start, fps);
  const endFrame = seconds(end, fps);
  const fadeIn = easeClamp(frame, [startFrame, startFrame + 18], [0, 1]);
  const fadeOut = easeClamp(frame, [endFrame - 18, endFrame], [1, 0]);
  const opacity = Math.min(fadeIn, fadeOut);

  return (
    <AbsoluteFill style={{ opacity, transform: `translateY(${interpolate(opacity, [0, 1], [24, 0])}px)` }}>
      {children(frame - startFrame)}
    </AbsoluteFill>
  );
};

const Background = () => {
  const frame = useCurrentFrame();
  const glow = interpolate(Math.sin(frame / 38), [-1, 1], [0.08, 0.22]);

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #f6f8f5 0%, #e7eeea 54%, #dce6e1 100%)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: -180,
          opacity: 0.32,
          background:
            "linear-gradient(120deg, rgba(42,168,118,0.18), transparent 38%, rgba(229,185,95,0.14) 64%, transparent)",
          transform: `translateX(${interpolate(frame, [0, 1260], [-80, 80])}px)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 118,
          top: 98,
          width: 720,
          height: 720,
          opacity: glow,
          background: "radial-gradient(circle, #2aa876 0%, transparent 68%)",
          filter: "blur(80px)",
        }}
      />
    </AbsoluteFill>
  );
};

const Rail = () => {
  const icons = [BriefcaseBusiness, TrendingUp, Newspaper, Bell];

  return (
    <div
      style={{
        width: 94,
        height: 884,
        borderRadius: 18,
        background: colors.rail,
        padding: "24px 18px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 22,
        boxShadow: "0 34px 88px rgba(16, 32, 27, 0.2)",
      }}
    >
      <div
        style={{
          width: 54,
          height: 54,
          display: "grid",
          placeItems: "center",
          borderRadius: 12,
          background: colors.line,
          color: "white",
          fontSize: 20,
          fontWeight: 900,
        }}
      >
        PC
      </div>
      {icons.map((Icon, index) => (
        <div
          key={index}
          style={{
            width: 54,
            height: 54,
            display: "grid",
            placeItems: "center",
            borderRadius: 12,
            color: index === 0 ? "white" : "#b7c7c0",
            background: index === 0 ? "rgba(255,255,255,0.12)" : "transparent",
          }}
        >
          <Icon size={25} />
        </div>
      ))}
    </div>
  );
};

const MetricCard = ({
  label,
  value,
  delta,
  delay,
}: {
  label: string;
  value: string;
  delta: string;
  delay: number;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const entrance = spring({ frame: frame - delay, fps, config: { damping: 24, stiffness: 120 } });

  return (
    <Panel
      style={{
        width: 314,
        height: 132,
        padding: 24,
        opacity: entrance,
        transform: `translateY(${(1 - entrance) * 22}px)`,
      }}
    >
      <div style={{ color: colors.muted, fontSize: 18, fontWeight: 800 }}>{label}</div>
      <div style={{ marginTop: 10, color: colors.ink, fontSize: 42, fontWeight: 900 }}>{value}</div>
      <div style={{ marginTop: 4, color: colors.lineDark, fontSize: 19, fontWeight: 800 }}>{delta}</div>
    </Panel>
  );
};

const Watchlist = ({ activeIndex, localFrame }: { activeIndex: number; localFrame: number }) => (
  <Panel style={{ width: 430, height: 582, padding: 26 }}>
    <Heading eyebrow="Portfolio" title="Core Watchlist" icon={<ShieldCheck size={27} />} />
    <div style={{ display: "grid", gap: 14 }}>
      {companies.map((company, index) => {
        const selected = activeIndex === index;
        const rowIn = easeClamp(localFrame, [18 + index * 7, 42 + index * 7], [0, 1]);

        return (
          <div
            key={company.ticker}
            style={{
              display: "grid",
              gridTemplateColumns: "112px 1fr 72px",
              alignItems: "center",
              gap: 18,
              minHeight: 86,
              padding: "16px 18px",
              borderRadius: 14,
              border: `2px solid ${selected ? "rgba(42,168,118,0.45)" : "transparent"}`,
              background: selected ? "#edf8f2" : "#f5f8f6",
              opacity: rowIn,
              transform: `translateX(${(1 - rowIn) * -28}px)`,
            }}
          >
            <div>
              <div style={{ color: colors.ink, fontSize: 25, fontWeight: 900 }}>{company.ticker}</div>
              <div style={{ color: colors.muted, fontSize: 16 }}>{company.name}</div>
            </div>
            <StockChart
              values={company.spark}
              width={112}
              height={36}
              progress={easeClamp(localFrame, [36 + index * 8, 86 + index * 8], [0, 1])}
              strokeWidth={4}
            />
            <div
              style={{
                color: company.change >= 0 ? colors.lineDark : colors.red,
                fontSize: 19,
                fontWeight: 900,
                textAlign: "right",
              }}
            >
              {company.change >= 0 ? "+" : ""}
              {company.change}%
            </div>
          </div>
        );
      })}
    </div>
  </Panel>
);

const ResearchPanel = ({ companyIndex, localFrame }: { companyIndex: number; localFrame: number }) => {
  const selected = companies[companyIndex] ?? companies[0];

  return (
    <Panel style={{ height: 582, padding: 26 }}>
      <Heading eyebrow="Research" title="Investment Thesis" icon={<Sparkles size={27} />} />
      <div style={{ color: colors.ink, fontSize: 25, lineHeight: 1.34, fontWeight: 650 }}>
        {selected.thesis}
      </div>
      {[
        ["Risk", selected.risk],
        ["Target allocation", `${selected.allocation}%`],
      ].map(([label, value]) => (
        <div
          key={label}
          style={{
            display: "flex",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(16,32,27,0.09)",
            padding: "18px 0",
            marginTop: label === "Risk" ? 20 : 0,
            fontSize: 21,
          }}
        >
          <span style={{ color: colors.muted }}>{label}</span>
          <strong style={{ color: colors.ink }}>{value}</strong>
        </div>
      ))}
      <div style={{ marginTop: 10 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ color: colors.muted, fontSize: 17, fontWeight: 900, textTransform: "uppercase" }}>
            Latest News
          </div>
          <Newspaper size={22} color={colors.lineDark} />
        </div>
        {news.slice(0, 3).map((item, index) => {
          const inValue = easeClamp(localFrame, [70 + index * 14, 100 + index * 14], [0, 1]);
          return (
            <div
              key={item}
              style={{
                marginTop: 14,
                paddingTop: 14,
                borderTop: "1px solid rgba(16,32,27,0.09)",
                color: colors.ink,
                fontSize: 19,
                lineHeight: 1.28,
                opacity: inValue,
                transform: `translateY(${(1 - inValue) * 14}px)`,
              }}
            >
              {item}
            </div>
          );
        })}
      </div>
    </Panel>
  );
};

const Dashboard = ({ localFrame }: { localFrame: number }) => {
  const activeIndex = Math.min(3, Math.floor(localFrame / 65));
  const selected = companies[activeIndex] ?? companies[0];
  const chartProgress = easeClamp(localFrame, [34, 126], [0, 1]);

  return (
    <div style={{ position: "absolute", left: 132, top: 98, display: "flex", gap: 28 }}>
      <Rail />
      <div style={{ width: 1438 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ color: colors.muted, fontSize: 20, fontWeight: 900, textTransform: "uppercase" }}>
              Portfolio Command
            </div>
            <div style={{ marginTop: 8, color: colors.ink, fontSize: 70, lineHeight: 0.96, fontWeight: 950 }}>
              Holdings, research, and market signals in one view.
            </div>
          </div>
          <div
            style={{
              width: 430,
              height: 66,
              padding: "0 22px",
              display: "flex",
              alignItems: "center",
              gap: 14,
              borderRadius: 14,
              border: "1px solid rgba(16,32,27,0.1)",
              background: "rgba(255,255,255,0.86)",
              color: colors.muted,
              fontSize: 21,
              boxShadow: "0 18px 46px rgba(16,32,27,0.1)",
            }}
          >
            <Search size={23} />
            Search ticker or company
          </div>
        </div>

        <div style={{ display: "flex", gap: 16, marginTop: 26 }}>
          {metrics.map((metric, index) => (
            <MetricCard key={metric.label} {...metric} delay={index * 6} />
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "430px 1fr 390px", gap: 20, marginTop: 20 }}>
          <Watchlist activeIndex={activeIndex} localFrame={localFrame} />
          <Panel style={{ height: 582, padding: 28 }}>
            <Heading
              eyebrow={selected.sector}
              title={selected.name}
              icon={
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "11px 15px",
                    borderRadius: 12,
                    background: colors.rail,
                    color: "white",
                    fontSize: 18,
                    fontWeight: 900,
                  }}
                >
                  <BookmarkPlus size={20} />
                  Save
                </div>
              }
            />
            <div
              style={{
                height: 408,
                borderRadius: 14,
                border: "1px solid rgba(16,32,27,0.08)",
                background:
                  "linear-gradient(rgba(16,32,27,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(16,32,27,0.04) 1px, transparent 1px), #fbfcfb",
                backgroundSize: "100% 72px, 112px 100%",
                padding: 28,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div>
                  <div style={{ color: colors.muted, fontSize: 21, fontWeight: 900 }}>{selected.ticker}</div>
                  <div style={{ color: colors.ink, fontSize: 54, fontWeight: 950 }}>
                    ${selected.price.toFixed(2)}
                  </div>
                </div>
                <div
                  style={{
                    color: selected.change >= 0 ? colors.lineDark : colors.red,
                    fontSize: 34,
                    fontWeight: 950,
                  }}
                >
                  {selected.change >= 0 ? "+" : ""}
                  {selected.change}%
                </div>
              </div>
              <div style={{ marginTop: 28 }}>
                <StockChart values={selected.spark} width={708} height={214} progress={chartProgress} />
              </div>
            </div>
          </Panel>
          <ResearchPanel companyIndex={activeIndex} localFrame={localFrame} />
        </div>
      </div>
    </div>
  );
};

const Opening = ({ productName, tagline, localFrame }: LaunchProps & { localFrame: number }) => {
  const { fps } = useVideoConfig();
  const titleIn = spring({ frame: localFrame - 8, fps, config: { damping: 26, stiffness: 90 } });
  const lineProgress = easeClamp(localFrame, [36, 112], [0, 1]);

  return (
    <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}>
      <div style={{ textAlign: "center", width: 1280 }}>
        <div
          style={{
            display: "inline-grid",
            placeItems: "center",
            width: 116,
            height: 116,
            borderRadius: 22,
            background: colors.line,
            color: "white",
            fontSize: 42,
            fontWeight: 950,
            boxShadow: "0 28px 70px rgba(42,168,118,0.35)",
            transform: `scale(${0.8 + titleIn * 0.2})`,
          }}
        >
          PC
        </div>
        <div
          style={{
            marginTop: 36,
            color: colors.ink,
            fontSize: 122,
            lineHeight: 0.92,
            fontWeight: 950,
            opacity: titleIn,
            transform: `translateY(${(1 - titleIn) * 34}px)`,
          }}
        >
          {productName}
        </div>
        <div
          style={{
            margin: "30px auto 0",
            maxWidth: 830,
            color: colors.muted,
            fontSize: 38,
            lineHeight: 1.2,
            fontWeight: 650,
            opacity: easeClamp(localFrame, [28, 62], [0, 1]),
          }}
        >
          {tagline}
        </div>
        <div style={{ margin: "54px auto 0", width: 820, height: 218 }}>
          <StockChart
            values={[42, 48, 46, 55, 61, 58, 72, 78, 74, 86, 92, 101]}
            width={820}
            height={218}
            progress={lineProgress}
            strokeWidth={10}
          />
        </div>
      </div>
    </div>
  );
};

const ResearchScene = ({ localFrame }: { localFrame: number }) => {
  const typed = ["N", "NV", "NVD", "NVDA"][Math.min(3, Math.floor(localFrame / 18))] ?? "NVDA";
  const scan = easeClamp(localFrame, [42, 128], [0, 1]);

  return (
    <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}>
      <div style={{ width: 1510 }}>
        <div style={{ color: colors.muted, fontSize: 22, fontWeight: 900, textTransform: "uppercase" }}>
          Research in seconds
        </div>
        <div style={{ marginTop: 10, color: colors.ink, fontSize: 86, lineHeight: 0.98, fontWeight: 950 }}>
          Go from ticker to thesis without changing tabs.
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "520px 1fr", gap: 28, marginTop: 46 }}>
          <Panel style={{ padding: 30, height: 604 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                height: 74,
                padding: "0 22px",
                borderRadius: 14,
                background: "#fff",
                border: "1px solid rgba(16,32,27,0.1)",
                fontSize: 31,
                fontWeight: 900,
                color: colors.ink,
              }}
            >
              <Search size={30} color={colors.lineDark} />
              {typed}
              <span style={{ color: colors.line }}>|</span>
            </div>
            <div style={{ marginTop: 26, display: "grid", gap: 16 }}>
              {companies.map((company, index) => (
                <div
                  key={company.ticker}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "90px 1fr 72px",
                    alignItems: "center",
                    gap: 16,
                    padding: 18,
                    borderRadius: 14,
                    background: index === 0 ? "#edf8f2" : "#f5f8f6",
                    border: index === 0 ? "2px solid rgba(42,168,118,0.45)" : "2px solid transparent",
                    opacity: easeClamp(localFrame, [20 + index * 8, 44 + index * 8], [0, 1]),
                  }}
                >
                  <strong style={{ color: colors.ink, fontSize: 26 }}>{company.ticker}</strong>
                  <span style={{ color: colors.muted, fontSize: 20 }}>{company.name}</span>
                  <span
                    style={{
                      color: company.change >= 0 ? colors.lineDark : colors.red,
                      fontSize: 20,
                      fontWeight: 900,
                      textAlign: "right",
                    }}
                  >
                    {company.change >= 0 ? "+" : ""}
                    {company.change}%
                  </span>
                </div>
              ))}
            </div>
          </Panel>
          <Panel style={{ padding: 34, height: 604 }}>
            <Heading eyebrow="NVIDIA Corp." title="Research Brief" icon={<Sparkles size={30} />} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 28 }}>
              <div>
                <div style={{ color: colors.ink, fontSize: 36, lineHeight: 1.22, fontWeight: 800 }}>
                  AI infrastructure demand remains the core growth engine.
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginTop: 28 }}>
                  {[
                    ["Revenue trend", "+28%"],
                    ["Risk", "Medium"],
                    ["Allocation", "24%"],
                  ].map(([label, value], index) => (
                    <div
                      key={label}
                      style={{
                        padding: 18,
                        borderRadius: 14,
                        background: "#f5f8f6",
                        opacity: easeClamp(localFrame, [72 + index * 10, 96 + index * 10], [0, 1]),
                      }}
                    >
                      <div style={{ color: colors.muted, fontSize: 17, fontWeight: 800 }}>{label}</div>
                      <div style={{ marginTop: 8, color: colors.ink, fontSize: 32, fontWeight: 950 }}>
                        {value}
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 28, display: "grid", gap: 15 }}>
                  {[
                    "Chip demand lifts AI infrastructure outlook.",
                    "Cloud customers extend accelerator purchase plans.",
                    "Margin estimates improve after supply checks.",
                  ].map((item, index) => (
                    <div
                      key={item}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        color: colors.ink,
                        fontSize: 22,
                        opacity: easeClamp(localFrame, [104 + index * 11, 128 + index * 11], [0, 1]),
                      }}
                    >
                      <CheckCircle2 size={24} color={colors.lineDark} />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
              <div
                style={{
                  borderRadius: 16,
                  background: "#fbfcfb",
                  border: "1px solid rgba(16,32,27,0.08)",
                  padding: 18,
                }}
              >
                <StockChart values={companies[0].spark} width={264} height={210} progress={scan} />
                <div style={{ marginTop: 28, color: colors.muted, fontSize: 18, fontWeight: 800 }}>
                  Signal strength
                </div>
                <div style={{ marginTop: 10, height: 18, borderRadius: 999, background: "#e2e9e5" }}>
                  <div
                    style={{
                      width: `${Math.round(scan * 82)}%`,
                      height: "100%",
                      borderRadius: 999,
                      background: colors.line,
                    }}
                  />
                </div>
              </div>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
};

const AlertsScene = ({ localFrame }: { localFrame: number }) => {
  const portfolio = [
    ["NVDA", "24%", "+2.8%", colors.lineDark],
    ["MSFT", "21%", "+0.9%", colors.lineDark],
    ["AAPL", "18%", "-0.7%", colors.red],
    ["TSLA", "10%", "-1.9%", colors.red],
  ];

  return (
    <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}>
      <div style={{ width: 1500 }}>
        <div style={{ color: colors.muted, fontSize: 22, fontWeight: 900, textTransform: "uppercase" }}>
          Track what changes
        </div>
        <div style={{ marginTop: 10, color: colors.ink, fontSize: 84, lineHeight: 0.98, fontWeight: 950 }}>
          Watchlist moves, allocations, and news signals stay connected.
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 430px", gap: 28, marginTop: 48 }}>
          <Panel style={{ padding: 34, height: 540 }}>
            <Heading eyebrow="Portfolio Mix" title="Target allocations" icon={<BriefcaseBusiness size={30} />} />
            <div style={{ display: "grid", gap: 17 }}>
              {portfolio.map(([ticker, allocation, change, color], index) => {
                const fill = easeClamp(localFrame, [22 + index * 12, 64 + index * 12], [0, 1]);
                return (
                  <div key={ticker} style={{ display: "grid", gridTemplateColumns: "100px 1fr 92px", gap: 20 }}>
                    <strong style={{ color: colors.ink, fontSize: 28 }}>{ticker}</strong>
                    <div style={{ height: 28, borderRadius: 999, background: "#e3eae6", overflow: "hidden" }}>
                      <div
                        style={{
                          width: `${fill * Number.parseInt(allocation, 10) * 3.2}%`,
                          height: "100%",
                          borderRadius: 999,
                          background: color,
                        }}
                      />
                    </div>
                    <span style={{ color, fontSize: 24, fontWeight: 950, textAlign: "right" }}>{change}</span>
                  </div>
                );
              })}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginTop: 48 }}>
              {["Saved thesis", "Price alerts", "News pulse"].map((label, index) => (
                <div
                  key={label}
                  style={{
                    padding: 20,
                    borderRadius: 14,
                    background: "#f5f8f6",
                    color: colors.ink,
                    fontSize: 23,
                    fontWeight: 850,
                    opacity: easeClamp(localFrame, [92 + index * 10, 118 + index * 10], [0, 1]),
                  }}
                >
                  <CheckCircle2 size={28} color={colors.lineDark} />
                  <div style={{ marginTop: 14 }}>{label}</div>
                </div>
              ))}
            </div>
          </Panel>
          <Panel style={{ padding: 30, height: 540 }}>
            <Heading eyebrow="Market Signals" title="Live alerts" icon={<Bell size={30} />} />
            {[
              ["NVDA crossed target weight", "Review allocation before close"],
              ["Cloud margin estimates raised", "MSFT thesis updated"],
              ["Consumer devices mixed", "AAPL risk note saved"],
            ].map(([title, detail], index) => {
              const inValue = easeClamp(localFrame, [44 + index * 26, 76 + index * 26], [0, 1]);
              return (
                <div
                  key={title}
                  style={{
                    padding: "20px 0",
                    borderTop: "1px solid rgba(16,32,27,0.09)",
                    opacity: inValue,
                    transform: `translateX(${(1 - inValue) * 24}px)`,
                  }}
                >
                  <div style={{ color: colors.ink, fontSize: 25, fontWeight: 900 }}>{title}</div>
                  <div style={{ marginTop: 6, color: colors.muted, fontSize: 19 }}>{detail}</div>
                </div>
              );
            })}
          </Panel>
        </div>
      </div>
    </div>
  );
};

const Closing = ({ productName, tagline, localFrame }: LaunchProps & { localFrame: number }) => {
  const { fps } = useVideoConfig();
  const logo = spring({ frame: localFrame - 5, fps, config: { damping: 25, stiffness: 100 } });

  return (
    <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}>
      <div style={{ textAlign: "center", width: 1200 }}>
        <div
          style={{
            display: "inline-grid",
            placeItems: "center",
            width: 132,
            height: 132,
            borderRadius: 24,
            background: colors.line,
            color: "white",
            fontSize: 48,
            fontWeight: 950,
            boxShadow: "0 28px 76px rgba(42,168,118,0.34)",
            transform: `scale(${logo}) rotate(${(1 - logo) * -5}deg)`,
          }}
        >
          PC
        </div>
        <div style={{ marginTop: 38, color: colors.ink, fontSize: 112, lineHeight: 0.92, fontWeight: 950 }}>
          {productName}
        </div>
        <div style={{ margin: "30px auto 0", width: 820, color: colors.muted, fontSize: 39, lineHeight: 1.18 }}>
          {tagline}
        </div>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 14,
            marginTop: 54,
            padding: "22px 30px",
            borderRadius: 16,
            background: colors.rail,
            color: "white",
            fontSize: 30,
            fontWeight: 900,
          }}
        >
          <TrendingUp size={34} />
          Build a smarter watchlist
        </div>
      </div>
    </div>
  );
};

export const PortfolioCommandLaunch = ({ productName, tagline }: LaunchProps) => {
  return (
    <AbsoluteFill style={{ fontFamily: "Inter, Arial, sans-serif", color: colors.ink }}>
      <Background />
      <Scene start={0} end={6}>
        {(localFrame) => <Opening productName={productName} tagline={tagline} localFrame={localFrame} />}
      </Scene>
      <Scene start={5.3} end={19}>
        {(localFrame) => <Dashboard localFrame={localFrame} />}
      </Scene>
      <Scene start={18.1} end={31}>
        {(localFrame) => <ResearchScene localFrame={localFrame} />}
      </Scene>
      <Scene start={30.2} end={38.5}>
        {(localFrame) => <AlertsScene localFrame={localFrame} />}
      </Scene>
      <Scene start={37.6} end={42}>
        {(localFrame) => <Closing productName={productName} tagline={tagline} localFrame={localFrame} />}
      </Scene>
    </AbsoluteFill>
  );
};
