import React, { useState, useEffect, useRef } from "react";
import {
  Package, Gauge, HeartPulse, FlaskConical, Bot, Milk, AlertTriangle,
  Timer, IndianRupee, Lightbulb, Thermometer, Fan, Droplets, Snowflake,
  TrendingUp, TrendingDown, Sparkles, MessageCircle, Send, X, CheckCircle2,
  Bell, FileText, Leaf, Recycle, Factory, Wind, Zap, ShieldAlert, Wrench,
  ClipboardCheck,
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

/* ---------------------------------- TOKENS ---------------------------------- */
const C = {
  bg: "#050810",
  panel: "#0C121D",
  panel2: "#0F1826",
  border: "#1B2536",
  borderSoft: "#141D2C",
  text: "#E7EDF6",
  muted: "#7C8AA0",
  faint: "#4B5768",
  blue: "#3B82F6",
  blueDim: "#1D4ED8",
  green: "#22C55E",
  amber: "#F0A020",
  red: "#EF4444",
};

const FONTS = `
@import url('https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@400;500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');
`;

/* ---------------------------------- HELPERS ---------------------------------- */
function useCountUp(target, duration = 900, decimals = 0) {
  const [val, setVal] = useState(0);
  const startRef = useRef(null);
  useEffect(() => {
    let raf;
    const step = (ts) => {
      if (!startRef.current) startRef.current = ts;
      const p = Math.min(1, (ts - startRef.current) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(target * eased);
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return decimals > 0 ? val.toFixed(decimals) : Math.round(val);
}

const statusColor = (s) => {
  switch (s) {
    case "green": return C.green;
    case "amber": return C.amber;
    case "red": return C.red;
    default: return C.blue;
  }
};

function StatusDot({ status, pulse }) {
  const col = statusColor(status);
  return (
    <span className="relative inline-flex h-2 w-2">
      {pulse && (
        <span
          className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60"
          style={{ backgroundColor: col }}
        />
      )}
      <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: col }} />
    </span>
  );
}

function Panel({ title, eyebrow, icon: Icon, right, children, accent = C.blue, className = "" }) {
  return (
    <div
      className={`rounded-xl flex flex-col ${className}`}
      style={{ background: C.panel, border: `1px solid ${C.border}` }}
    >
      <div
        className="flex items-center justify-between px-3.5 py-2.5 shrink-0"
        style={{ borderBottom: `1px solid ${C.borderSoft}` }}
      >
        <div className="flex items-center gap-2">
          {Icon && (
            <div
              className="w-6 h-6 rounded-md flex items-center justify-center shrink-0"
              style={{ background: `${accent}1A`, color: accent }}
            >
              <Icon size={13} strokeWidth={2.2} />
            </div>
          )}
          <div>
            <div
              className="text-[10px] tracking-[0.12em] uppercase font-medium"
              style={{ color: C.muted, fontFamily: "Inter" }}
            >
              {eyebrow}
            </div>
            <div className="text-[13px] font-semibold -mt-0.5" style={{ color: C.text, fontFamily: "Chakra Petch" }}>
              {title}
            </div>
          </div>
        </div>
        {right}
      </div>
      <div className="px-3.5 py-3 flex-1 min-h-0">{children}</div>
    </div>
  );
}

/* ---------------------------------- KPI CARD ---------------------------------- */
function KpiCard({ icon: Icon, label, value, suffix, status, trend, trendVal, accent, decimals }) {
  const n = useCountUp(value, 1000, decimals || 0);
  const up = trend === "up";
  return (
    <div
      className="group rounded-xl px-3.5 py-3 relative overflow-hidden transition-transform duration-300 hover:-translate-y-0.5"
      style={{ background: C.panel, border: `1px solid ${C.border}` }}
    >
      <div
        className="absolute inset-x-0 top-0 h-[2px] opacity-70 group-hover:opacity-100 transition-opacity"
        style={{ background: accent }}
      />
      <div className="flex items-start justify-between">
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center"
          style={{ background: `${accent}1A`, color: accent }}
        >
          <Icon size={14} strokeWidth={2.2} />
        </div>
        <StatusDot status={status} pulse={status === "red"} />
      </div>
      <div className="mt-2.5 flex items-baseline gap-1">
        <span
          className="text-2xl font-semibold tabular-nums"
          style={{ color: C.text, fontFamily: "JetBrains Mono" }}
        >
          {n}
        </span>
        <span className="text-xs font-medium" style={{ color: C.muted }}>{suffix}</span>
      </div>
      <div className="flex items-center justify-between mt-1">
        <span className="text-[11px]" style={{ color: C.muted, fontFamily: "Inter" }}>{label}</span>
        {trendVal && (
          <span
            className="flex items-center gap-0.5 text-[10px] font-medium"
            style={{ color: up ? C.green : C.red }}
          >
            {up ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
            {trendVal}
          </span>
        )}
      </div>
    </div>
  );
}

/* ---------------------------------- METRIC CARD (Executive) ---------------------------------- */
function MetricCard({ icon: Icon, label, value, sub, accent }) {
  return (
    <div
      className="rounded-lg px-3 py-2.5 flex items-center gap-2.5"
      style={{ background: C.panel2, border: `1px solid ${C.borderSoft}` }}
    >
      <div
        className="w-8 h-8 rounded-md flex items-center justify-center shrink-0"
        style={{ background: `${accent}1A`, color: accent }}
      >
        <Icon size={15} strokeWidth={2.2} />
      </div>
      <div className="min-w-0">
        <div className="text-[10px] uppercase tracking-wide truncate" style={{ color: C.muted }}>{label}</div>
        <div className="text-[14px] font-semibold truncate" style={{ color: C.text, fontFamily: "JetBrains Mono" }}>{value}</div>
        {sub && <div className="text-[9.5px] mt-0.5" style={{ color: C.faint }}>{sub}</div>}
      </div>
    </div>
  );
}

/* ---------------------------------- CIRCULAR GAUGE ---------------------------------- */
function Gauge2({ value, max = 100, label, sub, status, size = 68 }) {
  const r = (size - 10) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.min(1, value / max);
  const col = statusColor(status);
  const n = useCountUp(value, 900, Number.isInteger(value) ? 0 : 1);
  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={C.borderSoft} strokeWidth="6" />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none" stroke={col} strokeWidth="6"
          strokeDasharray={c} strokeDashoffset={c - pct * c} strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: "stroke-dashoffset 1s ease" }}
        />
        <text x="50%" y="47%" textAnchor="middle" dominantBaseline="middle" fill={C.text} fontSize="13" fontFamily="JetBrains Mono" fontWeight="600">
          {n}{max === 100 ? "%" : ""}
        </text>
      </svg>
      <div className="text-[11px] font-medium mt-1" style={{ color: C.text }}>{label}</div>
      <div className="text-[9.5px] flex items-center gap-1" style={{ color: col }}>
        <StatusDot status={status} /> {sub}
      </div>
    </div>
  );
}

/* ---------------------------------- BADGE ---------------------------------- */
function Badge({ status, children }) {
  const col = statusColor(status);
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-medium"
      style={{ background: `${col}1A`, color: col, border: `1px solid ${col}33` }}
    >
      <StatusDot status={status} pulse={status === "red"} /> {children}
    </span>
  );
}

/* ---------------------------------- MACHINE CARD ---------------------------------- */
function MachineCard({ icon: Icon, name, status, statusLabel, metricLabel, metricValue }) {
  return (
    <div
      className="rounded-lg px-3 py-2.5 flex items-center gap-3"
      style={{ background: C.panel2, border: `1px solid ${statusColor(status)}2E` }}
    >
      <div
        className="w-8 h-8 rounded-md flex items-center justify-center shrink-0"
        style={{ background: `${statusColor(status)}1A`, color: statusColor(status) }}
      >
        <Icon size={15} strokeWidth={2.2} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <span className="text-[12px] font-semibold" style={{ color: C.text }}>{name}</span>
          <Badge status={status}>{statusLabel}</Badge>
        </div>
        <div className="text-[10.5px] mt-0.5" style={{ color: C.muted }}>{metricLabel}: <span style={{ color: C.text, fontFamily: "JetBrains Mono" }}>{metricValue}</span></div>
      </div>
    </div>
  );
}

/* ---------------------------------- PROGRESS BAR ---------------------------------- */
function ProgressRow({ icon: Icon, label, value, accent }) {
  const [w, setW] = useState(0);
  useEffect(() => { const t = setTimeout(() => setW(value), 150); return () => clearTimeout(t); }, [value]);
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-1.5">
          <Icon size={12} style={{ color: accent }} />
          <span className="text-[11px]" style={{ color: C.text }}>{label}</span>
        </div>
        <span className="text-[11.5px] font-semibold tabular-nums" style={{ color: accent, fontFamily: "JetBrains Mono" }}>{value}%</span>
      </div>
      <div className="h-1.5 rounded-full w-full overflow-hidden" style={{ background: C.borderSoft }}>
        <div
          className="h-full rounded-full"
          style={{ width: `${w}%`, background: accent, transition: "width 1.1s cubic-bezier(.22,1,.36,1)" }}
        />
      </div>
    </div>
  );
}

/* ---------------------------------- DATA ---------------------------------- */
const batches = [
  { id: "B001", product: "Milk", stage: "Packaging", status: "green", statusLabel: "Completed", pred: "On Time" },
  { id: "B002", product: "Milk", stage: "Cooling", status: "amber", statusLabel: "Delayed", pred: "Cooling Issue" },
  { id: "B003", product: "Milk", stage: "Pasteurization", status: "green", statusLabel: "Running", pred: "Normal" },
  { id: "B004", product: "Milk", stage: "Filling", status: "red", statusLabel: "Risk", pred: "Machine Vibration High" },
];

const feedbackData = [
  { name: "Positive", value: 86, color: C.green },
  { name: "Complaints", value: 14, color: C.red },
];

const reports = [
  { icon: FileText, label: "Daily Production Report", val: "Generated", status: "green", tag: "✔" },
  { icon: ClipboardCheck, label: "Quality Compliance Report", val: "Generated", status: "green", tag: "✔" },
  { icon: Wrench, label: "Maintenance Alert", val: "Compressor Issue", status: "amber", tag: "⚠" },
  { icon: ShieldAlert, label: "AI Risk Alert", val: "Low Risk", status: "green", tag: "🟢" },
];

/* ---------------------------------- CHAT WIDGET ---------------------------------- */
function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState([
    { from: "user", text: "Why production slowed today?" },
    { from: "ai", text: "Packaging machine speed reduced by 12%. Maintenance suggested." },
  ]);
  const [input, setInput] = useState("");

  const send = () => {
    if (!input.trim()) return;
    const userMsg = { from: "user", text: input.trim() };
    setMsgs((m) => [...m, userMsg]);
    setInput("");
    setTimeout(() => {
      setMsgs((m) => [...m, { from: "ai", text: "Analyzing plant telemetry… all other lines are within normal parameters." }]);
    }, 700);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50" style={{ fontFamily: "Inter" }}>
      {open && (
        <div
          className="mb-3 w-72 rounded-xl overflow-hidden flex flex-col shadow-2xl"
          style={{ background: C.panel, border: `1px solid ${C.border}`, height: 340 }}
        >
          <div className="flex items-center justify-between px-3 py-2.5" style={{ borderBottom: `1px solid ${C.borderSoft}`, background: C.panel2 }}>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background: `${C.blue}22`, color: C.blue }}>
                <Bot size={13} />
              </div>
              <div>
                <div className="text-[11.5px] font-semibold" style={{ color: C.text, fontFamily: "Chakra Petch" }}>Plant AI Assistant</div>
                <div className="text-[9px] flex items-center gap-1" style={{ color: C.green }}><StatusDot status="green" pulse /> Online</div>
              </div>
            </div>
            <button onClick={() => setOpen(false)} style={{ color: C.muted }}><X size={15} /></button>
          </div>
          <div className="flex-1 overflow-y-auto px-3 py-2.5 space-y-2">
            {msgs.map((m, i) => (
              <div key={i} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className="max-w-[85%] px-2.5 py-1.5 rounded-lg text-[11.5px] leading-snug"
                  style={
                    m.from === "user"
                      ? { background: C.blueDim, color: "#fff", borderTopRightRadius: 2 }
                      : { background: C.panel2, color: C.text, border: `1px solid ${C.borderSoft}`, borderTopLeftRadius: 2 }
                  }
                >
                  {m.text}
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-2" style={{ borderTop: `1px solid ${C.borderSoft}` }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Ask about the plant…"
              className="flex-1 text-[11.5px] px-2.5 py-1.5 rounded-md outline-none"
              style={{ background: C.panel2, color: C.text, border: `1px solid ${C.borderSoft}` }}
            />
            <button
              onClick={send}
              className="w-7 h-7 rounded-md flex items-center justify-center shrink-0"
              style={{ background: C.blue, color: "#fff" }}
            >
              <Send size={12} />
            </button>
          </div>
        </div>
      )}
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-12 h-12 rounded-full flex items-center justify-center shadow-2xl relative"
        style={{ background: C.blue, color: "#fff" }}
      >
        {open ? <X size={18} /> : <MessageCircle size={18} />}
        {!open && (
          <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full" style={{ background: C.green, border: `2px solid ${C.bg}` }} />
        )}
      </button>
    </div>
  );
}

/* ---------------------------------- MAIN ---------------------------------- */
export default function FlowgenieAI() {
  const [now] = useState("24 July 2026");

  return (
    <div
      className="min-h-screen w-full"
      style={{
        background: `${C.bg}`,
        backgroundImage: `linear-gradient(${C.borderSoft} 1px, transparent 1px), linear-gradient(90deg, ${C.borderSoft} 1px, transparent 1px)`,
        backgroundSize: "34px 34px",
        fontFamily: "Inter",
      }}
    >
      <style>{FONTS}</style>
      <div className="max-w-[1440px] mx-auto p-3 md:p-4 space-y-3">

        {/* HEADER */}
        <div className="rounded-xl px-4 py-3 relative overflow-hidden" style={{ background: C.panel, border: `1px solid ${C.border}` }}>
          <div className="absolute inset-x-0 top-0 h-[2px]" style={{ background: `linear-gradient(90deg, ${C.blue}, ${C.green}, ${C.amber}, ${C.red})` }} />
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: `${C.blue}1A`, color: C.blue }}>
                <Milk size={20} strokeWidth={2.2} />
              </div>
              <div>
                <h1 className="text-[17px] md:text-[19px] font-bold tracking-tight leading-none" style={{ color: C.text, fontFamily: "Chakra Petch" }}>
                  Flowgenie MANUFACTURING CONTROL CENTER
                </h1>
                <p className="text-[11px] mt-1" style={{ color: C.muted }}>Live overview &middot; Real-time SCADA / MES telemetry</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {[
                { label: "Plant", value: "Mumbai Dairy Unit" },
                { label: "Date", value: now },
                { label: "Shift", value: "Morning" },
              ].map((it) => (
                <div key={it.label} className="px-2.5 py-1.5 rounded-md text-right" style={{ background: C.panel2, border: `1px solid ${C.borderSoft}` }}>
                  <div className="text-[8.5px] uppercase tracking-wide" style={{ color: C.faint }}>{it.label}</div>
                  <div className="text-[11px] font-medium" style={{ color: C.text }}>{it.value}</div>
                </div>
              ))}
              <div className="px-2.5 py-1.5 rounded-md flex items-center gap-1.5" style={{ background: `${C.green}14`, border: `1px solid ${C.green}33` }}>
                <StatusDot status="green" pulse /><span className="text-[11px] font-medium" style={{ color: C.green }}>Monitoring Active</span>
              </div>
              <div className="px-2.5 py-1.5 rounded-md" style={{ background: `${C.blue}14`, border: `1px solid ${C.blue}33` }}>
                <span className="text-[10px]" style={{ color: C.muted }}>Model Accuracy </span>
                <span className="text-[11.5px] font-semibold" style={{ color: C.blue, fontFamily: "JetBrains Mono" }}>96.8%</span>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 1: KPI CARDS */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <KpiCard icon={Package} label="Batches Today" value={128} suffix="" status="blue" accent={C.blue} trend="up" trendVal="+6" />
          <KpiCard icon={Gauge} label="Production Efficiency" value={94} suffix="%" status="green" accent={C.green} trend="up" trendVal="+2.1%" />
          <KpiCard icon={HeartPulse} label="Plant Health" value={96} suffix="%" status="green" accent={C.green} trend="up" trendVal="+0.4%" />
          <KpiCard icon={FlaskConical} label="Quality Score" value={98} suffix="%" status="green" accent={C.green} trend="up" trendVal="+1%" />
          <KpiCard icon={Bot} label="AI Risk Score" value={12} suffix="% · Low" status="green" accent={C.blue} trend="down" trendVal="-3%" />
        </div>

        {/* SECTION 2: EXECUTIVE PRODUCTION DASHBOARD */}
        <Panel title="Executive Production Dashboard" eyebrow="Section 02" icon={Factory} accent={C.blue}>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2.5">
            <MetricCard icon={Milk} label="Daily Output" value="52,000 L" accent={C.blue} />
            <MetricCard icon={AlertTriangle} label="Waste Generated" value="680 L" sub="1.3% of output" accent={C.amber} />
            <MetricCard icon={Timer} label="Machine Downtime" value="45 min" accent={C.red} />
            <MetricCard icon={IndianRupee} label="Cost Impact" value="₹82,000" accent={C.amber} />
            <MetricCard icon={Lightbulb} label="AI Recommended Savings" value="₹3.5 L / mo" accent={C.green} />
          </div>
        </Panel>

        {/* SECTION 3 + 4: BATCH TABLE + MACHINE HEALTH */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-3">
          <Panel title="Batch Monitoring" eyebrow="Section 03" icon={ClipboardCheck} accent={C.blue} className="lg:col-span-3">
            <table className="w-full text-[11.5px] border-separate" style={{ borderSpacing: "0 6px" }}>
              <thead>
                <tr style={{ color: C.muted }}>
                  <th className="text-left font-medium pl-2 pb-1">Batch ID</th>
                  <th className="text-left font-medium pb-1">Product</th>
                  <th className="text-left font-medium pb-1">Stage</th>
                  <th className="text-left font-medium pb-1">Status</th>
                  <th className="text-left font-medium pb-1">AI Prediction</th>
                </tr>
              </thead>
              <tbody>
                {batches.map((b) => (
                  <tr key={b.id} className="transition-colors hover:brightness-125" style={{ background: C.panel2 }}>
                    <td className="pl-2 py-2 rounded-l-lg font-medium" style={{ color: C.text, fontFamily: "JetBrains Mono" }}>{b.id}</td>
                    <td className="py-2" style={{ color: C.text }}>{b.product}</td>
                    <td className="py-2" style={{ color: C.muted }}>{b.stage}</td>
                    <td className="py-2"><Badge status={b.status}>{b.statusLabel}</Badge></td>
                    <td className="py-2 pr-2 rounded-r-lg" style={{ color: C.muted }}>{b.pred}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Panel>

          <Panel title="Machine Health" eyebrow="Section 04" icon={Fan} accent={C.blue} className="lg:col-span-2">
            <div className="grid grid-cols-1 gap-2">
              <MachineCard icon={Thermometer} name="Pasteurizer" status="green" statusLabel="Healthy" metricLabel="Temperature" metricValue="72°C" />
              <MachineCard icon={Droplets} name="Separator" status="green" statusLabel="Healthy" metricLabel="Efficiency" metricValue="97%" />
              <MachineCard icon={Wind} name="Packaging Unit" status="amber" statusLabel="Warning" metricLabel="Issue" metricValue="Speed Reduction" />
              <MachineCard icon={Zap} name="Compressor" status="red" statusLabel="Critical" metricLabel="Issue" metricValue="Maintenance Req." />
            </div>
          </Panel>
        </div>

        {/* SECTION 5: RAW MILK QUALITY */}
        <Panel title="Raw Milk Quality Analytics" eyebrow="Section 05" icon={Droplets} accent={C.blue}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 place-items-center py-1">
            <Gauge2 value={4.2} max={10} label="Fat Content" sub="Good" status="green" />
            <Gauge2 value={3.5} max={10} label="Protein" sub="Good" status="green" />
            <Gauge2 value={0.14} max={1} label="Acidity" sub="Normal" status="green" />
            <Gauge2 value={2} max={100} label="Contamination Risk" sub="Safe" status="green" />
          </div>
        </Panel>

        {/* SECTION 6: AI BOTTLENECK DETECTION */}
        <div
          className="rounded-xl px-4 py-3 relative overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${C.amber}14, ${C.panel})`, border: `1px solid ${C.amber}44` }}
        >
          <div className="absolute inset-x-0 top-0 h-[2px]" style={{ background: C.amber }} />
          <div className="flex items-center gap-2 mb-2.5">
            <div className="w-7 h-7 rounded-md flex items-center justify-center animate-pulse" style={{ background: `${C.amber}26`, color: C.amber }}>
              <AlertTriangle size={15} />
            </div>
            <div className="text-[13.5px] font-bold tracking-wide" style={{ color: C.amber, fontFamily: "Chakra Petch" }}>
              AI BOTTLENECK DETECTION
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {[
              { label: "Issue Detected", value: "Packaging Line Delay" },
              { label: "Root Cause", value: "Machine Speed Reduction" },
              { label: "Delay Impact", value: "18 min / batch" },
              { label: "AI Recommendation", value: "Replace conveyor belt component" },
              { label: "Expected Improvement", value: "+8% Efficiency" },
            ].map((it) => (
              <div key={it.label} className="rounded-lg px-3 py-2" style={{ background: "rgba(0,0,0,0.25)", border: `1px solid ${C.amber}22` }}>
                <div className="text-[9.5px] uppercase tracking-wide" style={{ color: C.muted }}>{it.label}</div>
                <div className="text-[11.5px] font-semibold mt-0.5" style={{ color: C.text }}>{it.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 7 + 8: CONSUMER FEEDBACK + AI INSIGHTS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <Panel title="Consumer Feedback Analytics" eyebrow="Section 07" icon={HeartPulse} accent={C.blue}>
            <div className="flex items-center gap-4">
              <div style={{ width: 110, height: 110 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={feedbackData} dataKey="value" innerRadius={32} outerRadius={50} paddingAngle={3} stroke="none">
                      {feedbackData.map((e, i) => <Cell key={i} fill={e.color} />)}
                    </Pie>
                    <Tooltip contentStyle={{ background: C.panel2, border: `1px solid ${C.borderSoft}`, borderRadius: 8, fontSize: 11 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px]" style={{ color: C.muted }}>Satisfaction Score</span>
                  <span className="text-[13px] font-semibold" style={{ color: C.green, fontFamily: "JetBrains Mono" }}>94%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] flex items-center gap-1.5" style={{ color: C.muted }}><span className="w-2 h-2 rounded-full inline-block" style={{ background: C.green }} />Positive Reviews</span>
                  <span className="text-[12px] font-medium" style={{ color: C.text }}>86%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] flex items-center gap-1.5" style={{ color: C.muted }}><span className="w-2 h-2 rounded-full inline-block" style={{ background: C.red }} />Complaints</span>
                  <span className="text-[12px] font-medium" style={{ color: C.text }}>14</span>
                </div>
                <div className="text-[10.5px] pt-1" style={{ color: C.faint }}>Main issue: <span style={{ color: C.text }}>Packaging Leakage</span></div>
              </div>
            </div>
          </Panel>

          <Panel title="AI Insights & Recommendations" eyebrow="Section 08" icon={Sparkles} accent={C.blue}>
            <div className="space-y-1.5">
              {[
                "Optimize cooling cycle by 5 minutes",
                "Schedule compressor maintenance before next shift",
                "Reduce milk wastage during transfer",
              ].map((t) => (
                <div key={t} className="flex items-center gap-2 rounded-md px-2.5 py-1.5" style={{ background: C.panel2, border: `1px solid ${C.borderSoft}` }}>
                  <CheckCircle2 size={13} style={{ color: C.green }} className="shrink-0" />
                  <span className="text-[11.5px]" style={{ color: C.text }}>{t}</span>
                </div>
              ))}
              <div className="flex items-center gap-2 rounded-md px-2.5 py-2 mt-1" style={{ background: `${C.green}14`, border: `1px solid ${C.green}33` }}>
                <Sparkles size={14} style={{ color: C.green }} className="shrink-0" />
                <span className="text-[11.5px]" style={{ color: C.text }}>Estimated monthly saving: <span className="font-semibold" style={{ color: C.green, fontFamily: "JetBrains Mono" }}>₹3.5 Lakhs</span></span>
              </div>
            </div>
          </Panel>
        </div>

        {/* SECTION 9 + 11: SUSTAINABILITY + REPORTS */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-3">
          <Panel title="Sustainability Dashboard" eyebrow="Section 09" icon={Leaf} accent={C.green} className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
              <ProgressRow icon={Droplets} label="Water Consumption Reduction" value={18} accent={C.blue} />
              <ProgressRow icon={Zap} label="Energy Efficiency Improvement" value={12} accent={C.amber} />
              <ProgressRow icon={Wind} label="Carbon Emission Reduction" value={9} accent={C.green} />
              <ProgressRow icon={Recycle} label="Waste Recycling Rate" value={92} accent={C.green} />
            </div>
          </Panel>

          <Panel title="Reports & Alerts" eyebrow="Section 11" icon={Bell} accent={C.blue} className="lg:col-span-2">
            <div className="grid grid-cols-1 gap-2">
              {reports.map((r) => (
                <div key={r.label} className="flex items-center gap-2.5 rounded-md px-2.5 py-2" style={{ background: C.panel2, border: `1px solid ${C.borderSoft}` }}>
                  <div className="w-7 h-7 rounded-md flex items-center justify-center shrink-0" style={{ background: `${statusColor(r.status)}1A`, color: statusColor(r.status) }}>
                    <r.icon size={13} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[10.5px]" style={{ color: C.muted }}>{r.label}</div>
                    <div className="text-[11.5px] font-medium" style={{ color: C.text }}>{r.val}</div>
                  </div>
                  <span className="text-[13px]">{r.tag}</span>
                </div>
              ))}
            </div>
          </Panel>
        </div>

        <div className="text-center text-[10px] pb-1" style={{ color: C.faint }}>
          Smart Dairy Industry 4.0 &middot; Mumbai Dairy Unit &middot; Telemetry refreshed continuously
        </div>
      </div>

      <ChatWidget />
    </div>
  );
}
