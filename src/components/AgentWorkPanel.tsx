import { forwardRef, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Monitor, FolderTree, Globe, TerminalSquare, FileCode2, X, Minimize2,
  CheckCircle2, Circle, Loader2, Brain, Search, Wrench, ShieldCheck, ChevronLeft, ChevronRight, Play, Pause
} from "lucide-react";

export type AgentTodo = {
  id: string;
  title: string;
  status: "pending" | "running" | "done" | "failed";
};

export type AgentRole = "planner" | "researcher" | "executor" | "verifier";

export type AgentEvent =
  | { type: "terminal"; line: string; ts: number }
  | { type: "file"; path: string; action: "create" | "edit" | "read"; ts: number }
  | { type: "browser"; url: string; title?: string; ts: number }
  | { type: "code"; path: string; preview: string; ts: number };

type Tab = "computer" | "files" | "browser" | "terminal" | "editor";

interface Props {
  open: boolean;
  onClose: () => void;
  taskTitle: string;
  elapsedSec: number;
  todos: AgentTodo[];
  events: AgentEvent[];
  activeAgent: AgentRole;
  isRunning: boolean;
}

const agentMeta: Record<AgentRole, { label: string; icon: any; color: string }> = {
  planner:    { label: "المخطِّط",   icon: Brain,       color: "text-amber-400" },
  researcher: { label: "الباحث",     icon: Search,      color: "text-sky-400" },
  executor:   { label: "المنفِّذ",   icon: Wrench,      color: "text-emerald-400" },
  verifier:   { label: "المُدقِّق",  icon: ShieldCheck, color: "text-fuchsia-400" },
};

export default function AgentWorkPanel({
  open, onClose, taskTitle, elapsedSec, todos, events, activeAgent, isRunning,
}: Props) {
  const [tab, setTab] = useState<Tab>("computer");
  const [collapsed, setCollapsed] = useState(false);
  const [paused, setPaused] = useState(false);
  const [cursor, setCursor] = useState(0); // playback cursor for events
  const termRef = useRef<HTMLDivElement>(null);

  const visibleEvents = useMemo(
    () => events.slice(0, paused ? cursor : events.length),
    [events, paused, cursor]
  );

  useEffect(() => {
    if (!paused) setCursor(events.length);
  }, [events.length, paused]);

  useEffect(() => {
    if (termRef.current) termRef.current.scrollTop = termRef.current.scrollHeight;
  }, [visibleEvents.length]);

  const terminalLines = visibleEvents.filter(e => e.type === "terminal") as Extract<AgentEvent,{type:"terminal"}>[];
  const fileEvents    = visibleEvents.filter(e => e.type === "file")     as Extract<AgentEvent,{type:"file"}>[];
  const browserEvents = visibleEvents.filter(e => e.type === "browser")  as Extract<AgentEvent,{type:"browser"}>[];
  const codeEvents    = visibleEvents.filter(e => e.type === "code")     as Extract<AgentEvent,{type:"code"}>[];

  const lastBrowser = browserEvents[browserEvents.length - 1];
  const lastCode    = codeEvents[codeEvents.length - 1];

  const completed = todos.filter(t => t.status === "done").length;
  const progress  = todos.length ? Math.round((completed / todos.length) * 100) : 0;

  const fmt = (s: number) => {
    const m = Math.floor(s / 60).toString().padStart(2, "0");
    const ss = (s % 60).toString().padStart(2, "0");
    return `${m}:${ss}`;
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.aside
          initial={{ x: -480, opacity: 0 }}
          animate={{ x: 0, opacity: 1, width: collapsed ? 56 : 460 }}
          exit={{ x: -480, opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 28 }}
          dir="rtl"
          className="fixed top-3 bottom-3 left-3 z-40 rounded-2xl border border-border/60 bg-card/80 backdrop-blur-xl shadow-2xl shadow-black/40 overflow-hidden flex flex-col"
        >
          {/* Collapse rail */}
          {collapsed ? (
            <button
              onClick={() => setCollapsed(false)}
              className="w-full h-full flex flex-col items-center justify-start gap-3 py-4 text-muted-foreground hover:text-foreground"
              title="توسيع لوحة الحاسوب"
            >
              <ChevronRight className="h-4 w-4" />
              <Monitor className="h-5 w-5 text-emerald-400" />
              <div className="text-[10px] writing-vertical">حاسوب الوكيل</div>
            </button>
          ) : (
            <>
              {/* Header */}
              <div className="flex items-center justify-between px-3 py-2.5 border-b border-border/60 bg-gradient-to-l from-emerald-500/5 to-transparent">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="relative">
                    <Monitor className="h-4 w-4 text-emerald-400" />
                    {isRunning && (
                      <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-semibold truncate">حاسوب عرفان</div>
                    <div className="text-[10px] text-muted-foreground truncate">{taskTitle || "في انتظار مهمة..."}</div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-[10px] tabular-nums text-muted-foreground px-1.5 py-0.5 rounded bg-muted/40">{fmt(elapsedSec)}</span>
                  <button onClick={() => setCollapsed(true)} className="p-1 rounded hover:bg-muted/40" title="طيّ">
                    <ChevronLeft className="h-3.5 w-3.5" />
                  </button>
                  <button onClick={onClose} className="p-1 rounded hover:bg-muted/40" title="إغلاق">
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Agent strip */}
              <div className="flex items-center gap-1 px-2 py-1.5 border-b border-border/60 bg-background/30">
                {(Object.keys(agentMeta) as AgentRole[]).map(a => {
                  const M = agentMeta[a];
                  const Icon = M.icon;
                  const active = a === activeAgent;
                  return (
                    <div key={a}
                      className={`flex items-center gap-1 px-2 py-1 rounded-md text-[10px] transition-all ${
                        active ? "bg-muted/60 ring-1 ring-emerald-400/40" : "opacity-60"
                      }`}
                      title={M.label}
                    >
                      <Icon className={`h-3 w-3 ${active ? M.color : "text-muted-foreground"} ${active && isRunning ? "animate-pulse" : ""}`} />
                      <span className={active ? "text-foreground" : "text-muted-foreground"}>{M.label}</span>
                    </div>
                  );
                })}
              </div>

              {/* Tabs */}
              <div className="flex items-center border-b border-border/60 px-1 bg-background/40">
                {([
                  ["computer", "الحاسوب",  Monitor],
                  ["files",    "الملفات",  FolderTree],
                  ["browser",  "المتصفح",  Globe],
                  ["terminal", "الطرفية",  TerminalSquare],
                  ["editor",   "المحرر",   FileCode2],
                ] as [Tab,string,any][]).map(([k, label, Icon]) => (
                  <button
                    key={k}
                    onClick={() => setTab(k)}
                    className={`flex items-center gap-1.5 px-2.5 py-2 text-[11px] border-b-2 transition-colors ${
                      tab === k
                        ? "border-emerald-400 text-foreground"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {label}
                  </button>
                ))}
              </div>

              {/* Body */}
              <div className="flex-1 overflow-hidden flex flex-col">
                {tab === "computer" && (
                  <ComputerView terminalLines={terminalLines} todos={todos} progress={progress} />
                )}
                {tab === "files" && <FilesView events={fileEvents} />}
                {tab === "browser" && <BrowserView event={lastBrowser} history={browserEvents} />}
                {tab === "terminal" && <TerminalView ref={termRef} lines={terminalLines} isRunning={isRunning && !paused} />}
                {tab === "editor" && <EditorView event={lastCode} history={codeEvents} />}
              </div>

              {/* Footer playback */}
              <div className="flex items-center justify-between gap-2 px-3 py-2 border-t border-border/60 bg-background/40">
                <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                  <span>{completed}/{todos.length} مهمة</span>
                  <div className="w-24 h-1 rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-gradient-to-l from-emerald-400 to-amber-400" style={{ width: `${progress}%` }} />
                  </div>
                  <span className="tabular-nums">{progress}%</span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setPaused(p => !p)}
                    className="p-1.5 rounded hover:bg-muted/40"
                    title={paused ? "متابعة العرض المباشر" : "إيقاف مؤقت للعرض"}
                  >
                    {paused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
                  </button>
                  <input
                    type="range"
                    min={0}
                    max={events.length}
                    value={paused ? cursor : events.length}
                    onChange={(e) => { setPaused(true); setCursor(Number(e.target.value)); }}
                    className="w-28 accent-emerald-400"
                  />
                </div>
              </div>
            </>
          )}
        </motion.aside>
      )}
    </AnimatePresence>
  );
}

/* ───────── Sub Views ───────── */

function ComputerView({ terminalLines, todos, progress }:{
  terminalLines: Extract<AgentEvent,{type:"terminal"}>[];
  todos: AgentTodo[]; progress: number;
}) {
  return (
    <div className="flex-1 overflow-y-auto p-3 space-y-3">
      {/* Mock desktop */}
      <div className="rounded-xl border border-border/60 overflow-hidden bg-black/70">
        <div className="flex items-center gap-1.5 px-2 py-1 bg-black/80 border-b border-white/5">
          <span className="h-2 w-2 rounded-full bg-red-500/80" />
          <span className="h-2 w-2 rounded-full bg-amber-400/80" />
          <span className="h-2 w-2 rounded-full bg-emerald-500/80" />
          <span className="ml-2 text-[10px] text-white/50 font-mono">erfan@sandbox:~</span>
        </div>
        <div className="p-2.5 font-mono text-[10.5px] text-emerald-300/90 max-h-44 overflow-y-auto">
          {terminalLines.length === 0 && (
            <div className="text-white/30">$ في انتظار بدء التنفيذ…</div>
          )}
          {terminalLines.slice(-12).map((l, i) => (
            <div key={i} className="whitespace-pre-wrap break-all">
              <span className="text-emerald-500">$</span> {l.line}
            </div>
          ))}
          {terminalLines.length > 0 && (
            <div className="inline-block w-1.5 h-3 bg-emerald-400 animate-pulse align-middle" />
          )}
        </div>
      </div>

      {/* Todo list */}
      <div className="rounded-xl border border-border/60 bg-background/40">
        <div className="flex items-center justify-between px-3 py-2 border-b border-border/60">
          <div className="text-[11px] font-semibold">قائمة المهام الحية</div>
          <div className="text-[10px] text-muted-foreground">{progress}%</div>
        </div>
        <div className="p-2 space-y-1 max-h-64 overflow-y-auto">
          {todos.length === 0 && (
            <div className="text-[11px] text-muted-foreground p-3 text-center">لا توجد مهام بعد</div>
          )}
          {todos.map(t => (
            <div key={t.id} className="flex items-start gap-2 px-2 py-1.5 rounded-md hover:bg-muted/30">
              {t.status === "done" && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 mt-0.5" />}
              {t.status === "running" && <Loader2 className="h-3.5 w-3.5 text-amber-400 animate-spin mt-0.5" />}
              {t.status === "pending" && <Circle className="h-3.5 w-3.5 text-muted-foreground mt-0.5" />}
              {t.status === "failed" && <X className="h-3.5 w-3.5 text-red-400 mt-0.5" />}
              <span className={`text-[11px] leading-relaxed ${t.status === "done" ? "line-through text-muted-foreground" : ""}`}>
                {t.title}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function FilesView({ events }:{ events: Extract<AgentEvent,{type:"file"}>[] }) {
  return (
    <div className="flex-1 overflow-y-auto p-3">
      <div className="text-[11px] text-muted-foreground mb-2">العمليات على الملفات</div>
      <div className="space-y-1">
        {events.length === 0 && <div className="text-[11px] text-muted-foreground text-center py-6">لا ملفات بعد</div>}
        {events.slice(-50).reverse().map((e, i) => (
          <div key={i} className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-muted/30 text-[11px]">
            <FileCode2 className="h-3.5 w-3.5 text-sky-400" />
            <span className="font-mono truncate flex-1">{e.path}</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded ${
              e.action === "create" ? "bg-emerald-500/15 text-emerald-300" :
              e.action === "edit" ? "bg-amber-500/15 text-amber-300" :
              "bg-sky-500/15 text-sky-300"
            }`}>
              {e.action === "create" ? "إنشاء" : e.action === "edit" ? "تعديل" : "قراءة"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function BrowserView({ event, history }:{
  event?: Extract<AgentEvent,{type:"browser"}>;
  history: Extract<AgentEvent,{type:"browser"}>[];
}) {
  return (
    <div className="flex-1 overflow-hidden flex flex-col">
      <div className="flex items-center gap-2 px-2 py-1.5 border-b border-border/60 bg-background/40">
        <span className="h-2 w-2 rounded-full bg-red-500/70" />
        <span className="h-2 w-2 rounded-full bg-amber-400/70" />
        <span className="h-2 w-2 rounded-full bg-emerald-500/70" />
        <div className="flex-1 mx-1 px-2 py-1 rounded-md bg-muted/40 text-[10.5px] font-mono truncate" dir="ltr">
          {event?.url || "about:blank"}
        </div>
      </div>
      <div className="flex-1 grid place-items-center bg-gradient-to-br from-background to-muted/30 p-4">
        {event ? (
          <div className="text-center max-w-xs">
            <Globe className="h-10 w-10 text-emerald-400 mx-auto mb-2" />
            <div className="text-xs font-semibold mb-1">{event.title || "صفحة الويب"}</div>
            <div className="text-[10px] text-muted-foreground font-mono break-all" dir="ltr">{event.url}</div>
          </div>
        ) : (
          <div className="text-[11px] text-muted-foreground">لم يفتح الوكيل أي صفحة بعد</div>
        )}
      </div>
      {history.length > 1 && (
        <div className="border-t border-border/60 p-2 max-h-24 overflow-y-auto">
          {history.slice(-6).reverse().map((h, i) => (
            <div key={i} className="text-[10px] text-muted-foreground font-mono truncate" dir="ltr">↳ {h.url}</div>
          ))}
        </div>
      )}
    </div>
  );
}

const TerminalView = forwardRef<HTMLDivElement, { lines: Extract<AgentEvent,{type:"terminal"}>[]; isRunning: boolean }>(
  ({ lines, isRunning }, ref) => (
    <div ref={ref} className="flex-1 overflow-y-auto bg-black/80 p-3 font-mono text-[11px] text-emerald-300">
      {lines.length === 0 && <div className="text-white/30">$ الطرفية فارغة…</div>}
      {lines.map((l, i) => (
        <div key={i} className="whitespace-pre-wrap break-all">
          <span className="text-emerald-500/80">erfan@sandbox</span>
          <span className="text-white/40">:~$ </span>
          <span>{l.line}</span>
        </div>
      ))}
      {isRunning && <span className="inline-block w-2 h-3.5 bg-emerald-400 animate-pulse align-middle" />}
    </div>
  )
);
TerminalView.displayName = "TerminalView";

function EditorView({ event, history }:{
  event?: Extract<AgentEvent,{type:"code"}>;
  history: Extract<AgentEvent,{type:"code"}>[];
}) {
  return (
    <div className="flex-1 overflow-hidden flex">
      <div className="w-32 border-l border-border/60 overflow-y-auto bg-background/40 p-1">
        {history.length === 0 && <div className="text-[10px] text-muted-foreground p-2">لا ملفات</div>}
        {history.slice(-30).reverse().map((h, i) => (
          <div key={i} className={`px-2 py-1 rounded text-[10px] truncate font-mono ${
            event && h.path === event.path ? "bg-emerald-500/15 text-emerald-300" : "text-muted-foreground hover:bg-muted/30"
          }`}>
            {h.path.split("/").pop()}
          </div>
        ))}
      </div>
      <div className="flex-1 overflow-auto bg-black/70 p-3 font-mono text-[11px] text-sky-200">
        {event ? (
          <>
            <div className="text-[10px] text-muted-foreground mb-2 font-mono" dir="ltr">{event.path}</div>
            <pre className="whitespace-pre-wrap break-words">{event.preview}</pre>
          </>
        ) : (
          <div className="text-white/40">لا يوجد كود معروض بعد</div>
        )}
      </div>
    </div>
  );
}
