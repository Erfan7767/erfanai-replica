import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Menu,
  ChevronDown,
  Sparkles,
  Share2,
  BarChart3,
  MoreHorizontal,
  Code2,
  Plus,
  Plug,
  Monitor,
  Mic,
  ArrowUp,
  ChevronUp,
  Pencil,
} from "lucide-react";

/**
 * ErfanAI Responsive Workspace
 * - Mobile (< md): Single column. Left panel (chat/execution) full-screen. Code panel hidden.
 * - Desktop (md+): Split pane. Left 45%, Right (code editor) flex-1.
 * - 100% solid dark colors. No glassmorphism. No transparency tricks.
 */

const COLORS = {
  bg: "#111111",
  surface: "#1A1A1E",
  surface2: "#161616",
  border: "#2A2A30",
  text: "#EEEEEE",
  mute: "#A0A0AB",
};

type Pill = { id: string; text: string };
type Block =
  | { kind: "pill"; pill: Pill }
  | { kind: "para"; text: string };

const TIMELINE: Block[] = [
  { kind: "pill", pill: { id: "p1", text: "Handling text editor issue" } },
  {
    kind: "para",
    text:
      "I added database query helpers for songs, likes, and plays, enabling efficient data access. Updated TRPC routers to include endpoints for song management, liking, and recording plays. Also modified CSS for dark theme and Arabic RTL support. Next, I will finalize UI adjustments and test integrations.",
  },
  { kind: "pill", pill: { id: "p2", text: "Read the current CSS file to understand it…" } },
  { kind: "pill", pill: { id: "p3", text: "Continue reading CSS file to find the the…" } },
  { kind: "pill", pill: { id: "p4", text: "Update CSS theme colors for dark music …" } },
  {
    kind: "para",
    text:
      "I've updated the CSS to incorporate a purple-based dark theme and added RTL support with Arabic font styling for better aesthetics and language compatibility. Next, I'll finalize UI adjustments.",
  },
  { kind: "pill", pill: { id: "p5", text: "Create language context for Arabic/Engli…" } },
  { kind: "pill", pill: { id: "p6", text: "Create sidebar navigation component wit…" } },
];

const CODE_SNIPPET = `// Sidebar.tsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/_core/hooks/useAuth';
import { useLanguage } from '@/_core/hooks/useLanguage';

export function Sidebar() {
  const { user } = useAuth();
  const { lang, t } = useLanguage();
  const [open, setOpen] = useState(true);

  return (
    <aside className="h-full w-64 bg-[#1A1A1E] border-r border-[#2A2A30]">
      <div className="p-4 text-[#EEEEEE]">
        <h2 className="text-sm font-bold">{t('nav.title')}</h2>
      </div>
    </aside>
  );
}
`;

export default function Workspace() {
  const navigate = useNavigate();
  const [showCode, setShowCode] = useState(false); // mobile toggle for code panel
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate("/");
  };

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, []);

  return (
    <div
      className="flex h-screen w-full font-cairo"
      style={{ background: COLORS.bg, color: COLORS.text }}
      dir="rtl"
    >
      {/* ============ LEFT PANEL (Chat / Execution) ============ */}
      <section
        className={`${
          showCode ? "hidden" : "flex"
        } md:flex h-full w-full md:w-[45%] flex-col border-l`}
        style={{ borderColor: COLORS.border, background: COLORS.bg }}
      >
        {/* Header */}
        <header
          className="flex items-center justify-between px-3 py-3 border-b"
          style={{ borderColor: COLORS.border }}
        >
          <div className="flex items-center gap-2">
            <button
              className="p-2 rounded-lg hover:bg-[#1A1A1E] transition-colors"
              aria-label="Menu"
            >
              <Menu className="h-5 w-5" style={{ color: COLORS.text }} />
            </button>
            <button className="flex items-center gap-1.5 px-2 py-1 rounded-lg hover:bg-[#1A1A1E] transition-colors">
              <span className="text-sm font-semibold">ErfanAI 1.6 Lite</span>
              <ChevronDown className="h-4 w-4" style={{ color: COLORS.mute }} />
            </button>
          </div>
          <div className="flex items-center gap-1">
            <IconBtn label="Sparkles" active>
              <Sparkles className="h-[18px] w-[18px] text-blue-400" />
            </IconBtn>
            <IconBtn label="Share">
              <Share2 className="h-[18px] w-[18px]" />
            </IconBtn>
            <IconBtn label="Stats">
              <BarChart3 className="h-[18px] w-[18px]" />
            </IconBtn>
            <IconBtn label="More">
              <MoreHorizontal className="h-[18px] w-[18px]" />
            </IconBtn>
            <div className="hidden xs:block w-px h-5 mx-1" style={{ background: COLORS.border }} />
            <IconBtn
              label="Toggle Code"
              onClick={() => setShowCode((v) => !v)}
              className="md:hidden"
            >
              <Code2 className="h-[18px] w-[18px]" />
            </IconBtn>
          </div>
        </header>

        {/* Scrollable execution body */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 py-4 space-y-3">
          {TIMELINE.map((b, i) =>
            b.kind === "pill" ? (
              <div key={i} className="flex">
                <span
                  className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[13px]"
                  style={{
                    background: COLORS.surface,
                    border: `1px solid ${COLORS.border}`,
                    color: COLORS.text,
                  }}
                >
                  <Pencil className="h-3.5 w-3.5" style={{ color: COLORS.mute }} />
                  <span className="truncate max-w-[70vw] md:max-w-none">{b.pill.text}</span>
                </span>
              </div>
            ) : (
              <p
                key={i}
                className="text-[15px] leading-relaxed"
                style={{ color: COLORS.text }}
              >
                {b.text}
              </p>
            )
          )}

          {/* Active Thinking Card */}
          <div
            className="rounded-2xl p-3 flex items-center gap-3"
            style={{
              background: COLORS.surface,
              border: `1px solid ${COLORS.border}`,
            }}
          >
            <div
              className="h-12 w-12 rounded-lg shrink-0 overflow-hidden flex items-center justify-center"
              style={{ background: COLORS.surface2, border: `1px solid ${COLORS.border}` }}
            >
              <pre className="text-[6px] leading-[8px] p-1 text-blue-300/80 overflow-hidden">{`Sidebar.tsx
import {useState}
import {Link} from
import {useAuth}
import {useLang}`}</pre>
            </div>
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate" style={{ color: COLORS.text }}>
                Set up database schema an...
              </div>
              <div className="text-xs mt-0.5" style={{ color: COLORS.mute }}>
                3:05 · Thinking
              </div>
            </div>
            <button
              className="p-1.5 rounded-lg hover:bg-[#222226] transition-colors shrink-0"
              aria-label="Collapse"
            >
              <ChevronUp className="h-4 w-4" style={{ color: COLORS.mute }} />
            </button>
          </div>
        </div>

        {/* Sticky Input */}
        <div className="sticky bottom-0 p-3" style={{ background: COLORS.bg }}>
          <div
            className="rounded-[1.5rem] p-3"
            style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}` }}
          >
            <input
              type="text"
              placeholder="Message ErfanAI"
              className="w-full bg-transparent outline-none text-[15px] px-1 py-1.5"
              style={{ color: COLORS.text }}
            />
            <div className="mt-2 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <RoundBtn label="Add"><Plus className="h-[18px] w-[18px]" /></RoundBtn>
                <RoundBtn label="Plugins"><Plug className="h-[18px] w-[18px]" /></RoundBtn>
                <RoundBtn label="Screen"><Monitor className="h-[18px] w-[18px]" /></RoundBtn>
              </div>
              <div className="flex items-center gap-1.5">
                <RoundBtn label="Mic"><Mic className="h-[18px] w-[18px]" /></RoundBtn>
                <button
                  aria-label="Send"
                  className="h-9 w-9 rounded-full flex items-center justify-center transition-transform active:scale-95"
                  style={{ background: "#3A3A42", color: COLORS.text }}
                >
                  <ArrowUp className="h-[18px] w-[18px]" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ RIGHT PANEL (Code Editor) ============ */}
      <section
        className={`${
          showCode ? "flex" : "hidden"
        } md:flex flex-1 h-full flex-col`}
        style={{ background: COLORS.surface2 }}
      >
        <header
          className="flex items-center justify-between px-4 py-3 border-b"
          style={{ borderColor: COLORS.border }}
        >
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowCode(false)}
              className="md:hidden p-2 rounded-lg hover:bg-[#1A1A1E] transition-colors"
              aria-label="Back to chat"
            >
              <ChevronDown className="h-5 w-5 rotate-90" style={{ color: COLORS.text }} />
            </button>
            <span className="text-sm font-medium" style={{ color: COLORS.text }}>
              Sidebar.tsx
            </span>
          </div>
          <div className="text-xs" style={{ color: COLORS.mute }}>
            TypeScript · React
          </div>
        </header>
        <div className="flex-1 overflow-auto">
          <pre
            className="p-4 text-[13px] leading-relaxed font-mono"
            style={{ color: "#C7D2FE", background: COLORS.surface2 }}
          >
            {CODE_SNIPPET}
          </pre>
        </div>
      </section>
    </div>
  );
}

/* ---------- Small UI atoms ---------- */
function IconBtn({
  children,
  label,
  onClick,
  active,
  className = "",
}: {
  children: React.ReactNode;
  label: string;
  onClick?: () => void;
  active?: boolean;
  className?: string;
}) {
  return (
    <button
      aria-label={label}
      onClick={onClick}
      className={`h-9 w-9 flex items-center justify-center rounded-lg transition-colors ${className}`}
      style={{
        background: active ? "#1E2A44" : "transparent",
        color: active ? "#60A5FA" : COLORS.mute,
      }}
      onMouseEnter={(e) => {
        if (!active) (e.currentTarget.style.background = COLORS.surface);
      }}
      onMouseLeave={(e) => {
        if (!active) (e.currentTarget.style.background = "transparent");
      }}
    >
      {children}
    </button>
  );
}

function RoundBtn({
  children,
  label,
  onClick,
}: {
  children: React.ReactNode;
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      aria-label={label}
      onClick={onClick}
      className="h-9 w-9 rounded-full flex items-center justify-center transition-colors"
      style={{
        background: "transparent",
        border: `1px solid ${COLORS.border}`,
        color: COLORS.mute,
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = COLORS.surface2)}
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
    >
      {children}
    </button>
  );
}
