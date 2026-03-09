import { useState, useEffect, useRef, createContext, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ErfanAILogo from "@/components/ErfanAILogo";
import { toast } from "sonner";
import { type Lang, t, isRTL } from "@/lib/translations";
import {
  Hand, Mail, Menu, X, Plus, Search, Bot, Upload, Mic, Globe,
  ArrowLeft, Settings, LogOut, Sparkles, Zap, MessageSquare, Bell,
  ChevronDown, SlidersHorizontal, Code, Presentation, Smartphone,
  Palette, MoreHorizontal, LayoutGrid, Send, ArrowRightLeft,
  HelpCircle, Home, ExternalLink, User, BookOpen, ChevronLeft,
  ArrowRight, Upload as UploadIcon, Camera, Image, FileText, Copy,
  Share2, Trash2, Volume2, VolumeX,
  CalendarCheck, Target, Table, BarChart3, Play, AudioLines, MessageCircle, BookCopy, Clock, Pause, RotateCcw, Save, Download,
} from "lucide-react";

/* ═══════════════════════ LANGUAGE CONTEXT ═══════════════════════ */
const LangContext = createContext<{ lang: Lang; setLang: (l: Lang) => void }>({ lang: "العربية", setLang: () => {} });
const useLang = () => useContext(LangContext);

/* ═══════════════════════ LANDING MENU ═══════════════════════ */
const LandingMenu = ({ isOpen, onClose, onLogin }: { isOpen: boolean; onClose: () => void; onLogin: () => void }) => {
  const { lang } = useLang();
  const dir = isRTL(lang) ? "rtl" : "ltr";
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 z-40" style={{ background: "rgba(0,0,0,0.5)" }} />
          <motion.div initial={{ opacity: 0, y: -10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -10, scale: 0.95 }} transition={{ duration: 0.2 }} className="absolute left-4 top-14 z-50 w-56 rounded-xl border bg-white p-2 shadow-xl" style={{ borderColor: "#e5e5e5" }} dir={dir}>
            <button onClick={() => { onLogin(); onClose(); }} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors">
              <User className="h-4 w-4" />
              <span>{t(lang, "landing.login")}</span>
            </button>
            <button onClick={() => { onLogin(); onClose(); }} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors">
              <Mail className="h-4 w-4" />
              <span>{t(lang, "landing.new_account")}</span>
            </button>
            <div className="my-1 h-px bg-gray-200" />
            <button onClick={() => { toast(t(lang, "coming_soon")); onClose(); }} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors">
              <HelpCircle className="h-4 w-4" />
              <span>{t(lang, "landing.help")}</span>
            </button>
            <button onClick={() => { toast(t(lang, "coming_soon")); onClose(); }} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors">
              <Settings className="h-4 w-4" />
              <span>{t(lang, "landing.settings")}</span>
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

/* ═══════════════════════ LANDING PAGE (Light) ═══════════════════════ */
const LandingPage = ({ onLogin, onRegister }: { onLogin: () => void; onRegister: () => void }) => {
  const { lang } = useLang();
  const dir = isRTL(lang) ? "rtl" : "ltr";
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [landingInput, setLandingInput] = useState("");
  const landingFileRef = useRef<HTMLInputElement>(null);
  const [landingFiles, setLandingFiles] = useState<File[]>([]);

  const handleLandingFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setLandingFiles(prev => [...prev, ...files]);
      toast.success(`${t(lang, "app.files_attached")} ${files.length} ${t(lang, "app.file")}`);
    }
  };

  const handleLandingSend = () => {
    if (landingInput.trim() || landingFiles.length > 0) {
      toast(t(lang, "landing.login_first"), { action: { label: t(lang, "landing.login"), onClick: onLogin } });
      setLandingInput("");
      setLandingFiles([]);
    }
  };

  const handleChipClick = (label: string) => {
    toast(`${label} - ${t(lang, "landing.sign_in_to_start")}`, { action: { label: t(lang, "landing.login"), onClick: onLogin } });
  };

  const chipItems = [
    { icon: Code, key: "chip.create_website" },
    { icon: Presentation, key: "chip.presentations" },
    { icon: Smartphone, key: "chip.app_dev" },
    { icon: Palette, key: "chip.design" },
    { icon: MoreHorizontal, key: "chip.more" },
  ];

  return (
    <div className="relative flex min-h-screen flex-col font-cairo" dir={dir} style={{ background: "#f5f5f4" }}>
      <header className="relative flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <ErfanAILogo className="h-12 w-12" color="#1a1a1a" />
          <span className="text-xl font-bold" style={{ color: "#1a1a1a" }}>ErfanAI</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={onLogin} className="rounded-lg px-4 py-2 text-sm font-semibold transition-colors hover:opacity-90" style={{ background: "#1a1a1a", color: "#fff" }}>{t(lang, "landing.login")}</button>
          <button onClick={onRegister} className="rounded-lg border px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100" style={{ borderColor: "#d4d4d4", color: "#525252" }}>{t(lang, "landing.register")}</button>
          <button className="p-2 transition-colors hover:bg-gray-200 rounded-lg" style={{ color: "#525252" }} onClick={() => setIsMenuOpen(true)}><Menu className="h-5 w-5" /></button>
        </div>
        <LandingMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} onLogin={onLogin} />
      </header>

      <div className="flex flex-1 flex-col items-center justify-center px-4 pb-10">
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="mb-8 text-center text-2xl font-bold leading-relaxed" style={{ color: "#1a1a1a" }}>{t(lang, "landing.how_can_i_help")}</motion.h1>

        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="w-full max-w-lg rounded-2xl border p-4 shadow-sm" style={{ background: "#fff", borderColor: "#e5e5e5" }}>
          <textarea value={landingInput} onChange={(e) => setLandingInput(e.target.value)} placeholder={t(lang, "landing.input_placeholder")} rows={3} className="w-full resize-none bg-transparent text-sm outline-none leading-relaxed" style={{ color: "#1a1a1a" }} dir={dir} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleLandingSend(); } }} />
          {landingFiles.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {landingFiles.map((file, i) => (
                <div key={i} className="flex items-center gap-1.5 rounded-lg border px-2 py-1 text-xs" style={{ borderColor: "#d4d4d4", color: "#525252" }}>
                  {file.type.startsWith("image/") ? <Image className="h-3.5 w-3.5" /> : <FileText className="h-3.5 w-3.5" />}
                  <span className="max-w-[100px] truncate">{file.name}</span>
                  <button onClick={() => setLandingFiles(prev => prev.filter((_, idx) => idx !== i))} className="hover:text-red-500"><X className="h-3 w-3" /></button>
                </div>
              ))}
            </div>
          )}
          <div className="mt-2 flex items-center justify-between">
            <button onClick={handleLandingSend} disabled={!landingInput.trim() && landingFiles.length === 0} className="flex h-9 w-9 items-center justify-center rounded-full transition-colors disabled:opacity-30" style={{ background: "#1a1a1a", color: "#fff" }}><Send className="h-4 w-4" /></button>
            <div className="flex items-center gap-2">
              <button onClick={() => landingFileRef.current?.click()} className="flex h-9 w-9 items-center justify-center rounded-full border transition-colors hover:bg-gray-100" style={{ borderColor: "#d4d4d4", color: "#a3a3a3" }}><UploadIcon className="h-4 w-4" /></button>
              <button onClick={() => landingFileRef.current?.click()} className="flex h-9 w-9 items-center justify-center rounded-full border transition-colors hover:bg-gray-100" style={{ borderColor: "#d4d4d4", color: "#a3a3a3" }}><Plus className="h-4 w-4" /></button>
            </div>
          </div>
          <input ref={landingFileRef} type="file" className="hidden" multiple onChange={handleLandingFileSelect} />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="mt-5 flex flex-wrap justify-center gap-2.5">
          {chipItems.map((chip) => (
            <button key={chip.key} onClick={() => handleChipClick(t(lang, chip.key))} className="flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium transition-colors hover:bg-white active:scale-95" style={{ borderColor: "#d4d4d4", color: "#525252", background: "transparent" }}>
              <chip.icon className="h-4 w-4" />
              {t(lang, chip.key)}
            </button>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

/* ═══════════════════════ LOGIN SCREEN ═══════════════════════ */
const LoginScreen = ({ onLogin }: { onLogin: () => void }) => {
  const { lang } = useLang();
  const dir = isRTL(lang) ? "rtl" : "ltr";
  const [email, setEmail] = useState("");

  const handleEmailLogin = () => {
    if (email.trim()) {
      toast.success(t(lang, "login.logging_in"));
      setTimeout(onLogin, 800);
    } else {
      toast.error(t(lang, "login.enter_email"));
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden font-cairo" dir={dir} style={{ background: "#0a0a0a" }}>
      <div className="dot-pattern absolute inset-0 opacity-10" />
      <header className="relative z-10 flex items-center justify-end px-5 py-4">
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold" style={{ color: "#e5e5e5" }}>ErfanAI</span>
          <ErfanAILogo className="h-11 w-11" color="#e5e5e5" />
        </div>
      </header>

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="flex w-full max-w-md flex-col items-center">
          <div className="mb-6 flex h-32 w-32 items-center justify-center">
            <ErfanAILogo className="h-32 w-32" color="#f5f5f5" />
          </div>

          <h1 className="mb-2 text-2xl font-bold" style={{ color: "#f5f5f5" }}>{t(lang, "login.title")}</h1>
          <p className="mb-10 text-sm" style={{ color: "#737373" }}>
            {t(lang, "login.subtitle")} <span style={{ color: "#a3a3a3" }}>ErfanAI</span>
          </p>

          <div className="flex w-full flex-col gap-3">
            <button onClick={() => { toast.success(t(lang, "login.logging_in")); setTimeout(onLogin, 800); }} className="flex w-full items-center justify-center gap-3 rounded-xl py-4 text-sm font-medium transition-colors hover:bg-[#333]" style={{ background: "#262626", color: "#e5e5e5" }}>
              <span>{t(lang, "login.continue_google")}</span>
              <svg className="h-5 w-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
            </button>
            <button onClick={() => { toast.success(t(lang, "login.logging_in")); setTimeout(onLogin, 800); }} className="flex w-full items-center justify-center gap-3 rounded-xl py-4 text-sm font-medium transition-colors hover:bg-[#333]" style={{ background: "#262626", color: "#e5e5e5" }}>
              <span>{t(lang, "login.continue_microsoft")}</span>
              <svg className="h-5 w-5" viewBox="0 0 24 24"><rect x="1" y="1" width="10" height="10" fill="#F25022" /><rect x="13" y="1" width="10" height="10" fill="#7FBA00" /><rect x="1" y="13" width="10" height="10" fill="#00A4EF" /><rect x="13" y="13" width="10" height="10" fill="#FFB900" /></svg>
            </button>
            <button onClick={() => { toast.success(t(lang, "login.logging_in")); setTimeout(onLogin, 800); }} className="flex w-full items-center justify-center gap-3 rounded-xl py-4 text-sm font-medium transition-colors hover:bg-[#333]" style={{ background: "#262626", color: "#e5e5e5" }}>
              <span>{t(lang, "login.continue_apple")}</span>
              <svg className="h-5 w-5" fill="#e5e5e5" viewBox="0 0 24 24"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" /></svg>
            </button>
          </div>

          <div className="my-6 flex w-full items-center gap-3">
            <div className="h-px flex-1" style={{ background: "#333" }} />
            <span className="text-sm" style={{ color: "#737373" }}>{t(lang, "login.or")}</span>
            <div className="h-px flex-1" style={{ background: "#333" }} />
          </div>

          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t(lang, "login.email_placeholder")} className="w-full rounded-xl px-4 py-4 text-sm outline-none" style={{ background: "#1a1a1a", border: "1px solid #333", color: "#e5e5e5" }} dir={dir} onKeyDown={(e) => { if (e.key === "Enter") handleEmailLogin(); }} />
          <button onClick={handleEmailLogin} className="mt-4 w-full rounded-xl py-4 text-sm font-semibold transition-all hover:bg-[#4a4a4a]" style={{ background: "#404040", color: "#d4d4d4" }}>{t(lang, "login.continue")}</button>
        </motion.div>
      </div>
    </div>
  );
};

/* ═══════════════════════ SIDEBAR ═══════════════════════ */
const Sidebar = ({ isOpen, onClose, onNewTask, onNavigate }: { isOpen: boolean; onClose: () => void; onNewTask: () => void; onNavigate: (page: string) => void }) => {
  const { lang } = useLang();
  const dir = isRTL(lang) ? "rtl" : "ltr";
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 z-40" style={{ background: "hsl(0 0% 0% / 0.7)" }} />
          <motion.div initial={{ x: isRTL(lang) ? "100%" : "-100%" }} animate={{ x: 0 }} exit={{ x: isRTL(lang) ? "100%" : "-100%" }} transition={{ type: "spring", damping: 25, stiffness: 300 }} className={`fixed ${isRTL(lang) ? "right-0" : "left-0"} top-0 z-50 flex h-full w-72 flex-col bg-background ${isRTL(lang) ? "border-l" : "border-r"} border-border`} dir={dir}>
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="text-lg font-bold text-accent">ErfanAI</h2>
              <button onClick={onClose} className="rounded-lg p-2 text-muted-foreground hover:bg-secondary transition-colors"><X className="h-5 w-5" /></button>
            </div>
            <nav className="flex-1 p-3 space-y-1">
              {[
                { icon: Plus, labelKey: "sidebar.new_task", isAccent: true, action: "new_task" },
                { icon: Bot, labelKey: "sidebar.agents", isAccent: false, action: "agents" },
                { icon: Search, labelKey: "sidebar.search", isAccent: false, action: "search" },
                { icon: MessageSquare, labelKey: "sidebar.chats", isAccent: false, action: "chats" },
                { icon: Sparkles, labelKey: "sidebar.discover", isAccent: false, action: "discover" },
              ].map((item) => (
                <button key={item.labelKey} onClick={() => { if (item.action === "new_task") { onNewTask(); onClose(); } else { onNavigate(item.action); onClose(); } }} className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${item.isAccent ? "bg-accent text-accent-foreground" : "text-foreground hover:bg-secondary"}`}>
                  <item.icon className="h-5 w-5" />
                  {t(lang, item.labelKey)}
                </button>
              ))}
            </nav>
            <div className="border-t border-border p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">E</div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Erfan Moharam</p>
                  <p className="text-xs text-muted-foreground">{t(lang, "sidebar.free_plan")}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

/* ═══════════════════════ SEARCH CONVERSATIONS PANEL ═══════════════════════ */
const SearchConversationsPanel = ({ isOpen, onClose, messages, onSelectMessage }: { isOpen: boolean; onClose: () => void; messages: { text: string; isUser: boolean; files?: File[] }[]; onSelectMessage: (msg: string) => void }) => {
  const { lang } = useLang();
  const dir = isRTL(lang) ? "rtl" : "ltr";
  const [searchQuery, setSearchQuery] = useState("");

  const filteredMessages = searchQuery.trim()
    ? messages.filter(m => m.text.toLowerCase().includes(searchQuery.toLowerCase()))
    : messages;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 z-40" style={{ background: "hsl(0 0% 0% / 0.7)" }} />
          <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} transition={{ type: "spring", damping: 25, stiffness: 300 }} className="fixed inset-x-3 top-10 bottom-10 z-50 flex flex-col rounded-2xl border border-border bg-card shadow-2xl overflow-hidden" dir={dir}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <button onClick={onClose} className="rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"><X className="h-5 w-5" /></button>
              <h3 className="text-lg font-bold text-foreground">{t(lang, "search.title")}</h3>
              <div className="w-8" />
            </div>
            <div className="px-4 py-3 border-b border-border">
              <div className="flex items-center gap-2 rounded-xl bg-secondary px-3 py-2.5">
                <Search className="h-4 w-4 text-muted-foreground shrink-0" />
                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder={t(lang, "search.placeholder")} className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground" autoFocus dir={dir} />
                {searchQuery && <button onClick={() => setSearchQuery("")} className="text-muted-foreground hover:text-foreground"><X className="h-3.5 w-3.5" /></button>}
              </div>
              {searchQuery && <p className="mt-2 text-xs text-muted-foreground">{filteredMessages.length} {t(lang, "search.results_count")}</p>}
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center gap-3">
                  <MessageSquare className="h-12 w-12 text-muted-foreground/30" />
                  <p className="text-sm text-muted-foreground">{t(lang, "search.no_conversations")}</p>
                  <p className="text-xs text-muted-foreground/60">{t(lang, "search.start_chatting")}</p>
                </div>
              ) : filteredMessages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center gap-3">
                  <Search className="h-12 w-12 text-muted-foreground/30" />
                  <p className="text-sm text-muted-foreground">{t(lang, "search.no_results")}</p>
                </div>
              ) : (
                filteredMessages.map((msg, i) => {
                  const highlightText = (text: string) => {
                    if (!searchQuery.trim()) return text;
                    const parts = text.split(new RegExp(`(${searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));
                    return parts.map((part, j) => part.toLowerCase() === searchQuery.toLowerCase() ? <span key={j} className="bg-accent/40 rounded px-0.5">{part}</span> : part);
                  };
                  return (
                    <button key={i} onClick={() => { onSelectMessage(msg.text); onClose(); }} className={`flex w-full items-start gap-3 rounded-xl px-4 py-3 text-sm transition-colors hover:bg-secondary ${msg.isUser ? "border-l-2 border-accent" : "border-l-2 border-muted-foreground/20"}`}>
                      <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${msg.isUser ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"}`}>{msg.isUser ? "أ" : "E"}</div>
                      <div className={`flex-1 ${isRTL(lang) ? "text-right" : "text-left"}`}>
                        <p className="text-foreground leading-relaxed line-clamp-2">{highlightText(msg.text)}</p>
                        {msg.files && msg.files.length > 0 && (
                          <div className="mt-1 flex flex-wrap gap-1">
                            {msg.files.map((f, fi) => <span key={fi} className="text-xs text-muted-foreground bg-secondary rounded px-1.5 py-0.5">{f.name}</span>)}
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

/* ═══════════════════════ DISCOVER PANEL ═══════════════════════ */
const discoverTemplates = [
  { category: "discover.cat_coding", icon: Code, items: [
    { titleAr: "أنشئ لي موقع ويب بسيط", titleEn: "Create a simple website", prompt: "أنشئ لي موقع ويب بسيط باستخدام HTML و CSS" },
    { titleAr: "اكتب كود Python", titleEn: "Write Python code", prompt: "اكتب لي كود Python لحساب الأعداد الأولية" },
    { titleAr: "صحح الأخطاء البرمجية", titleEn: "Debug my code", prompt: "ساعدني في تصحيح الأخطاء في الكود التالي" },
  ]},
  { category: "discover.cat_writing", icon: FileText, items: [
    { titleAr: "اكتب مقال احترافي", titleEn: "Write a professional article", prompt: "اكتب لي مقال احترافي عن الذكاء الاصطناعي" },
    { titleAr: "صياغة بريد إلكتروني", titleEn: "Draft an email", prompt: "ساعدني في كتابة بريد إلكتروني رسمي" },
    { titleAr: "تلخيص نص طويل", titleEn: "Summarize a text", prompt: "لخص لي النص التالي في نقاط رئيسية" },
  ]},
  { category: "discover.cat_design", icon: Palette, items: [
    { titleAr: "اقترح تصميم واجهة", titleEn: "Suggest UI design", prompt: "اقترح لي تصميم واجهة مستخدم لتطبيق متجر إلكتروني" },
    { titleAr: "اختيار ألوان متناسقة", titleEn: "Choose color palette", prompt: "ساعدني في اختيار مجموعة ألوان متناسقة لعلامتي التجارية" },
    { titleAr: "تصميم شعار", titleEn: "Design a logo", prompt: "أعطني أفكار لتصميم شعار لشركة تقنية" },
  ]},
  { category: "discover.cat_learning", icon: BookOpen, items: [
    { titleAr: "اشرح مفهوم برمجي", titleEn: "Explain a concept", prompt: "اشرح لي مفهوم الـ API بطريقة مبسطة" },
    { titleAr: "خطة تعلم برمجة", titleEn: "Learning plan", prompt: "ضع لي خطة لتعلم البرمجة من الصفر في 3 أشهر" },
    { titleAr: "اختبار معلوماتي", titleEn: "Quiz me", prompt: "اختبرني في أساسيات JavaScript" },
  ]},
  { category: "discover.cat_business", icon: Presentation, items: [
    { titleAr: "كتابة خطة عمل", titleEn: "Write business plan", prompt: "ساعدني في كتابة خطة عمل لمشروع تقني ناشئ" },
    { titleAr: "تحليل السوق", titleEn: "Market analysis", prompt: "قم بتحليل سوق التطبيقات في المنطقة العربية" },
    { titleAr: "استراتيجية تسويقية", titleEn: "Marketing strategy", prompt: "اقترح استراتيجية تسويقية لإطلاق منتج جديد" },
  ]},
  { category: "discover.cat_fun", icon: Sparkles, items: [
    { titleAr: "اكتب قصة قصيرة", titleEn: "Write a short story", prompt: "اكتب لي قصة قصيرة خيالية مشوقة" },
    { titleAr: "ألغاز ذكاء", titleEn: "Brain teasers", prompt: "أعطني 5 ألغاز ذكاء صعبة مع حلولها" },
    { titleAr: "نكت ذكية", titleEn: "Smart jokes", prompt: "أخبرني بنكت ذكية عن البرمجة" },
  ]},
];

const DiscoverPanel = ({ isOpen, onClose, onUseTemplate }: { isOpen: boolean; onClose: () => void; onUseTemplate: (prompt: string) => void }) => {
  const { lang } = useLang();
  const dir = isRTL(lang) ? "rtl" : "ltr";
  const [activeCategory, setActiveCategory] = useState(0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 z-40" style={{ background: "hsl(0 0% 0% / 0.7)" }} />
          <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} transition={{ type: "spring", damping: 25, stiffness: 300 }} className="fixed inset-x-3 top-10 bottom-10 z-50 flex flex-col rounded-2xl border border-border bg-card shadow-2xl overflow-hidden" dir={dir}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <button onClick={onClose} className="rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"><X className="h-5 w-5" /></button>
              <div className="text-center">
                <h3 className="text-lg font-bold text-foreground">{t(lang, "discover.title")}</h3>
                <p className="text-xs text-muted-foreground">{t(lang, "discover.subtitle")}</p>
              </div>
              <div className="w-8" />
            </div>
            <div className="flex gap-1.5 px-4 py-3 overflow-x-auto scrollbar-hide border-b border-border">
              {discoverTemplates.map((cat, i) => (
                <button key={i} onClick={() => setActiveCategory(i)} className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors ${activeCategory === i ? "bg-accent text-accent-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"}`}>
                  <cat.icon className="h-3.5 w-3.5" />
                  {t(lang, cat.category)}
                </button>
              ))}
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {discoverTemplates[activeCategory].items.map((item, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="rounded-xl border border-border bg-secondary/50 p-4 hover:bg-secondary transition-colors">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-foreground">{isRTL(lang) ? item.titleAr : item.titleEn}</h4>
                      <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{item.prompt}</p>
                    </div>
                    <button onClick={() => { onUseTemplate(item.prompt); onClose(); toast.success(t(lang, "discover.template_used")); }} className="shrink-0 rounded-lg bg-accent px-3 py-1.5 text-xs font-semibold text-accent-foreground hover:brightness-110 transition-all active:scale-95">
                      {t(lang, "discover.try_it")}
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

/* ═══════════════════════ NOTIFICATIONS SYSTEM ═══════════════════════ */
const NOTIF_KEY = "erfanai_notifications";

interface Notification {
  id: string;
  type: "welcome" | "update" | "tip" | "promo" | "security";
  titleKey: string;
  bodyKey: string;
  icon: "sparkles" | "zap" | "mic" | "star" | "shield";
  read: boolean;
  timestamp: number;
}

const defaultNotifications: Notification[] = [
  { id: "welcome-1", type: "welcome", titleKey: "notif.welcome_title", bodyKey: "notif.welcome_body", icon: "sparkles", read: false, timestamp: Date.now() - 1000 },
  { id: "security-1", type: "security", titleKey: "notif.security_title", bodyKey: "notif.security_body", icon: "shield", read: false, timestamp: Date.now() - 60000 },
  { id: "update-1", type: "update", titleKey: "notif.update_title", bodyKey: "notif.update_body", icon: "zap", read: false, timestamp: Date.now() - 3600000 },
  { id: "tip-1", type: "tip", titleKey: "notif.tip_title", bodyKey: "notif.tip_body", icon: "mic", read: false, timestamp: Date.now() - 7200000 },
  { id: "promo-1", type: "promo", titleKey: "notif.promo_title", bodyKey: "notif.promo_body", icon: "star", read: false, timestamp: Date.now() - 86400000 },
];

const loadNotifications = (): Notification[] => {
  try {
    const stored = localStorage.getItem(NOTIF_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  const defaults = [...defaultNotifications];
  localStorage.setItem(NOTIF_KEY, JSON.stringify(defaults));
  return defaults;
};

const saveNotifications = (notifs: Notification[]) => {
  localStorage.setItem(NOTIF_KEY, JSON.stringify(notifs));
};

const notifIconMap: Record<string, typeof Sparkles> = {
  sparkles: Sparkles,
  zap: Zap,
  mic: Mic,
  star: Sparkles,
  shield: User,
};

const notifColorMap: Record<string, string> = {
  welcome: "bg-accent/15 text-accent",
  update: "bg-primary/15 text-primary",
  tip: "bg-yellow-500/15 text-yellow-500",
  promo: "bg-purple-500/15 text-purple-500",
  security: "bg-green-500/15 text-green-500",
};

const formatTimeAgo = (timestamp: number, lang: Lang): string => {
  const diff = Date.now() - timestamp;
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1) return t(lang, "notif.just_now");
  if (mins < 60) return `${mins} ${t(lang, "notif.minutes_ago")}`;
  if (hours < 24) return `${hours} ${t(lang, "notif.hours_ago")}`;
  return `${days} ${t(lang, "notif.days_ago")}`;
};

const NotificationsPanel = ({ isOpen, onClose, onUpgrade }: { isOpen: boolean; onClose: () => void; onUpgrade: () => void }) => {
  const { lang } = useLang();
  const dir = isRTL(lang) ? "rtl" : "ltr";
  const [notifications, setNotifications] = useState<Notification[]>(() => loadNotifications());

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updated);
    saveNotifications(updated);
    toast.success(t(lang, "notif.marked_read"));
  };

  const markRead = (id: string) => {
    const updated = notifications.map(n => n.id === id ? { ...n, read: true } : n);
    setNotifications(updated);
    saveNotifications(updated);
  };

  const clearAll = () => {
    setNotifications([]);
    saveNotifications([]);
    toast.success(t(lang, "notif.cleared"));
  };

  const deleteOne = (id: string) => {
    const updated = notifications.filter(n => n.id !== id);
    setNotifications(updated);
    saveNotifications(updated);
  };

  const handleNotifClick = (notif: Notification) => {
    markRead(notif.id);
    if (notif.type === "promo") { onUpgrade(); onClose(); }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 z-40" />
          <motion.div initial={{ opacity: 0, y: -10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -10, scale: 0.95 }} transition={{ duration: 0.2 }} className="absolute left-3 right-3 top-[60px] z-50 max-h-[75vh] rounded-2xl border border-border bg-card shadow-2xl overflow-hidden flex flex-col" dir={dir}>
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
              <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors"><X className="h-4 w-4" /></button>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-foreground">{t(lang, "notif.title")}</h3>
                {unreadCount > 0 && (
                  <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-accent px-1.5 text-[10px] font-bold text-accent-foreground">{unreadCount}</span>
                )}
              </div>
            </div>

            {/* Actions */}
            {notifications.length > 0 && (
              <div className="flex items-center justify-between px-4 py-2 border-b border-border/50 shrink-0">
                <button onClick={clearAll} className="text-xs text-destructive hover:underline transition-colors">{t(lang, "notif.clear_all")}</button>
                {unreadCount > 0 && (
                  <button onClick={markAllRead} className="text-xs text-accent hover:underline transition-colors">{t(lang, "notif.mark_all_read")}</button>
                )}
              </div>
            )}

            {/* List */}
            <div className="flex-1 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell className="mx-auto h-10 w-10 text-muted-foreground/20 mb-3" />
                  <p className="text-sm text-muted-foreground">{t(lang, "notif.empty")}</p>
                </div>
              ) : (
                <div className="divide-y divide-border/50">
                  {notifications.map((notif, i) => {
                    const IconComp = notifIconMap[notif.icon] || Bell;
                    const colorClass = notifColorMap[notif.type] || "bg-secondary text-muted-foreground";
                    return (
                      <motion.div
                        key={notif.id}
                        initial={{ opacity: 0, x: isRTL(lang) ? 20 : -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        onClick={() => handleNotifClick(notif)}
                        className={`flex gap-3 px-4 py-3.5 cursor-pointer transition-colors hover:bg-secondary/50 ${!notif.read ? "bg-accent/5" : ""}`}
                      >
                        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${colorClass}`}>
                          <IconComp className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p className={`text-xs font-semibold leading-snug ${!notif.read ? "text-foreground" : "text-muted-foreground"}`}>{t(lang, notif.titleKey)}</p>
                            <button onClick={(e) => { e.stopPropagation(); deleteOne(notif.id); }} className="shrink-0 text-muted-foreground/40 hover:text-destructive transition-colors mt-0.5">
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                          <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2 leading-relaxed">{t(lang, notif.bodyKey)}</p>
                          <div className="flex items-center gap-2 mt-1.5">
                            <span className="text-[10px] text-muted-foreground/60">{formatTimeAgo(notif.timestamp, lang)}</span>
                            {!notif.read && <div className="h-1.5 w-1.5 rounded-full bg-accent" />}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

/* ═══════════════════════ MODEL SELECTOR ═══════════════════════ */
const modelData = [
  { id: "ErfanAI Max", label: "ErfanAI 1.6 Max", badge: "Pro", descKey: "model.max_desc", badgeColor: "bg-primary text-primary-foreground" },
  { id: "ErfanAI Pro", label: "ErfanAI 1.6", badge: "Pro", descKey: "model.pro_desc", badgeColor: "bg-primary text-primary-foreground" },
  { id: "ErfanAI Lite", label: "ErfanAI 1.6 Lite", badge: null, descKey: "model.lite_desc", badgeColor: "" },
];

const ModelSelector = ({ isOpen, onClose, currentModel, onSelect }: { isOpen: boolean; onClose: () => void; currentModel: string; onSelect: (m: string) => void }) => {
  const { lang } = useLang();
  const dir = isRTL(lang) ? "rtl" : "ltr";
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 z-40" />
          <motion.div initial={{ opacity: 0, y: -10, scaleY: 0.95 }} animate={{ opacity: 1, y: 0, scaleY: 1 }} exit={{ opacity: 0, y: -10, scaleY: 0.95 }} transition={{ duration: 0.2 }} style={{ transformOrigin: "top center" }} className="absolute right-4 left-4 top-[56px] z-50 rounded-2xl border border-border bg-card shadow-2xl overflow-hidden" dir={dir}>
            <div className="py-2">
              {modelData.map((model) => (
                <button key={model.id} onClick={() => { onSelect(model.id); onClose(); }} className={`flex w-full items-center justify-between px-5 py-3.5 transition-colors ${currentModel === model.id ? "bg-secondary/60" : "hover:bg-secondary/40"}`}>
                  <div className="w-6 flex items-center justify-center">
                    {currentModel === model.id && (
                      <svg className="h-5 w-5 text-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                    )}
                  </div>
                  <div className={`flex-1 ${isRTL(lang) ? "text-right mr-0 ml-3" : "text-left ml-0 mr-3"}`}>
                    <div className={`flex items-center gap-2 ${isRTL(lang) ? "justify-end" : "justify-start"}`}>
                      {model.badge && <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${model.badgeColor}`}>{model.badge}</span>}
                      <span className="text-sm font-semibold text-foreground">{model.label}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{t(lang, model.descKey)}</p>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

/* ═══════════════════════ SETTINGS HELPERS ═══════════════════════ */
const SETTINGS_KEY = "erfanai_settings";

interface AppSettings {
  language: Lang;
  theme: string;
  fontSize: string;
  chatBubbleStyle: string;
  defaultModel: string;
  notifMessages: boolean;
  notifUpdates: boolean;
  notifSound: boolean;
  notifVibration: boolean;
  notifEmail: boolean;
}

const defaultSettings: AppSettings = {
  language: "العربية",
  theme: "dark",
  fontSize: "medium",
  chatBubbleStyle: "modern",
  defaultModel: "ErfanAI Lite",
  notifMessages: true,
  notifUpdates: true,
  notifSound: true,
  notifVibration: false,
  notifEmail: false,
};

const loadSettings = (): AppSettings => {
  try {
    const stored = localStorage.getItem(SETTINGS_KEY);
    if (stored) return { ...defaultSettings, ...JSON.parse(stored) };
  } catch {}
  return { ...defaultSettings };
};

const saveSettings = (settings: AppSettings) => {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
};

const applyTheme = (themeId: string) => {
  if (themeId === "light") {
    document.documentElement.classList.add("light");
  } else if (themeId === "dark") {
    document.documentElement.classList.remove("light");
  } else {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (prefersDark) document.documentElement.classList.remove("light");
    else document.documentElement.classList.add("light");
  }
  localStorage.setItem("erfanai_theme", themeId);
};

const applyFontSize = (fsId: string) => {
  const sizeMap: Record<string, string> = { small: "14px", medium: "16px", large: "18px" };
  document.documentElement.style.fontSize = sizeMap[fsId] || "16px";
};

/* ═══════════════════════ SETTINGS PANEL ═══════════════════════ */
interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onChangeModel: (model: string) => void;
  onClearHistory: () => void;
  onLogout: () => void;
  currentModel: string;
}

const SettingsPanel = ({ isOpen, onClose, onChangeModel, onClearHistory, onLogout, currentModel }: SettingsPanelProps) => {
  const { lang, setLang } = useLang();
  const dir = isRTL(lang) ? "rtl" : "ltr";
  const [activeTab, setActiveTab] = useState<"general" | "appearance" | "notifications" | "account">("general");
  const [settings, setSettingsState] = useState<AppSettings>(loadSettings);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const updateSetting = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    setSettingsState(prev => {
      const next = { ...prev, [key]: value };
      saveSettings(next);
      return next;
    });
  };

  const tabs = [
    { id: "general" as const, labelKey: "settings.tab_general", icon: Settings },
    { id: "appearance" as const, labelKey: "settings.tab_appearance", icon: Palette },
    { id: "notifications" as const, labelKey: "settings.tab_notifications", icon: Bell },
    { id: "account" as const, labelKey: "settings.tab_account", icon: User },
  ];

  const languages: Lang[] = ["العربية", "English", "Français", "Español", "Deutsch", "Türkçe"];
  const themeOptions = [
    { id: "dark", labelKey: "theme.dark" },
    { id: "light", labelKey: "theme.light" },
    { id: "auto", labelKey: "theme.auto" },
  ];
  const fontSizeOptions = [
    { id: "small", labelKey: "font.small" },
    { id: "medium", labelKey: "font.medium" },
    { id: "large", labelKey: "font.large" },
  ];
  const bubbleOptions = [
    { id: "modern", labelKey: "bubble.modern" },
    { id: "classic", labelKey: "bubble.classic" },
    { id: "bubbles", labelKey: "bubble.bubbles" },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 z-40" style={{ background: "hsl(0 0% 0% / 0.7)" }} />
          <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} transition={{ type: "spring", damping: 25, stiffness: 300 }} className="fixed inset-x-3 top-10 bottom-10 z-50 flex flex-col rounded-2xl border border-border bg-card shadow-2xl overflow-hidden" dir={dir}>
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <button onClick={onClose} className="rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"><X className="h-5 w-5" /></button>
              <h3 className="text-lg font-bold text-foreground">{t(lang, "settings.title")}</h3>
              <div className="w-8" />
            </div>

            {/* Tabs */}
            <div className="flex border-b border-border px-2 overflow-x-auto scrollbar-hide">
              {tabs.map((tab) => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap border-b-2 ${activeTab === tab.id ? "border-accent text-accent" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
                  <tab.icon className="h-4 w-4" />
                  {t(lang, tab.labelKey)}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              {/* ── General Tab ── */}
              {activeTab === "general" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
                  {/* Language */}
                  <div>
                    <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                      <Globe className="h-4 w-4 text-accent" />
                      {t(lang, "settings.language")}
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {languages.map((l) => (
                        <button key={l} onClick={() => {
                          updateSetting("language", l);
                          setLang(l);
                          document.documentElement.dir = isRTL(l) ? "rtl" : "ltr";
                          toast(`${t(l, "settings.language_changed")} ${l}`);
                        }} className={`rounded-xl px-4 py-3 text-sm font-medium transition-all ${settings.language === l ? "bg-accent text-accent-foreground shadow-md" : "bg-secondary text-foreground hover:bg-secondary/80"}`}>
                          {l}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Default Model */}
                  <div>
                    <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                      <Zap className="h-4 w-4 text-accent" />
                      {t(lang, "settings.default_model")}
                    </h4>
                    <div className="space-y-2">
                      {modelData.map((model) => (
                        <button key={model.id} onClick={() => { updateSetting("defaultModel", model.id); onChangeModel(model.id); toast(`${t(lang, "settings.model_set")}: ${model.label}`); }} className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm transition-colors ${settings.defaultModel === model.id ? "bg-accent text-accent-foreground" : "bg-secondary text-foreground hover:bg-secondary/80"}`}>
                          {settings.defaultModel === model.id ? (
                            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                          ) : (
                            <Sparkles className="h-4 w-4 text-muted-foreground" />
                          )}
                          <span>{model.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Clear History */}
                  <div>
                    <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                      <Trash2 className="h-4 w-4 text-accent" />
                      {t(lang, "settings.data")}
                    </h4>
                    <button onClick={() => { onClearHistory(); toast.success(t(lang, "settings.history_cleared")); }} className="w-full rounded-xl bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive hover:bg-destructive/20 transition-colors">
                      {t(lang, "settings.clear_history")}
                    </button>
                  </div>
                </motion.div>
              )}

              {/* ── Appearance Tab ── */}
              {activeTab === "appearance" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
                  <div>
                    <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                      <Palette className="h-4 w-4 text-accent" />
                      {t(lang, "settings.theme")}
                    </h4>
                    <div className="grid grid-cols-3 gap-2">
                      {themeOptions.map((th) => (
                        <button key={th.id} onClick={() => { updateSetting("theme", th.id); applyTheme(th.id); toast(`${t(lang, "settings.theme_changed")} ${t(lang, th.labelKey)}`); }} className={`rounded-xl px-3 py-3 text-sm font-medium transition-all ${settings.theme === th.id ? "bg-accent text-accent-foreground shadow-md" : "bg-secondary text-foreground hover:bg-secondary/80"}`}>
                          {t(lang, th.labelKey)}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                      <AlignJustify className="h-4 w-4 text-accent" />
                      {t(lang, "settings.font_size")}
                    </h4>
                    <div className="grid grid-cols-3 gap-2">
                      {fontSizeOptions.map((fs) => (
                        <button key={fs.id} onClick={() => { updateSetting("fontSize", fs.id); applyFontSize(fs.id); toast(`${t(lang, "settings.font_changed")} ${t(lang, fs.labelKey)}`); }} className={`rounded-xl px-3 py-3 text-sm font-medium transition-all ${settings.fontSize === fs.id ? "bg-accent text-accent-foreground shadow-md" : "bg-secondary text-foreground hover:bg-secondary/80"}`}>
                          {t(lang, fs.labelKey)}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-accent" />
                      {t(lang, "settings.bubble_style")}
                    </h4>
                    <div className="grid grid-cols-3 gap-2">
                      {bubbleOptions.map((bs) => (
                        <button key={bs.id} onClick={() => { updateSetting("chatBubbleStyle", bs.id); toast(`${t(lang, "settings.bubble_changed")} ${t(lang, bs.labelKey)}`); }} className={`rounded-xl px-3 py-3 text-sm font-medium transition-all ${settings.chatBubbleStyle === bs.id ? "bg-accent text-accent-foreground shadow-md" : "bg-secondary text-foreground hover:bg-secondary/80"}`}>
                          {t(lang, bs.labelKey)}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ── Notifications Tab ── */}
              {activeTab === "notifications" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                  {([
                    { key: "notifMessages" as const, labelKey: "settings.notif_messages", descKey: "settings.notif_messages_desc" },
                    { key: "notifUpdates" as const, labelKey: "settings.notif_updates", descKey: "settings.notif_updates_desc" },
                    { key: "notifSound" as const, labelKey: "settings.notif_sound", descKey: "settings.notif_sound_desc" },
                    { key: "notifVibration" as const, labelKey: "settings.notif_vibration", descKey: "settings.notif_vibration_desc" },
                    { key: "notifEmail" as const, labelKey: "settings.notif_email", descKey: "settings.notif_email_desc" },
                  ]).map((item) => (
                    <div key={item.key} className="flex items-center justify-between rounded-xl bg-secondary p-4">
                      <button onClick={() => {
                        const newVal = !settings[item.key];
                        updateSetting(item.key, newVal);
                        toast(`${t(lang, item.labelKey)}: ${newVal ? t(lang, "settings.enabled") : t(lang, "settings.disabled")}`);
                        if (item.key === "notifVibration" && newVal && navigator.vibrate) navigator.vibrate(200);
                      }} className={`relative h-7 w-12 rounded-full transition-colors ${settings[item.key] ? "bg-accent" : "bg-muted-foreground/30"}`}>
                        <div className={`absolute top-0.5 h-6 w-6 rounded-full bg-foreground shadow-md transition-transform ${settings[item.key] ? (isRTL(lang) ? "right-0.5" : "left-[calc(100%-1.625rem)]") : (isRTL(lang) ? "right-[calc(100%-1.625rem)]" : "left-0.5")}`} />
                      </button>
                      <div className={isRTL(lang) ? "text-right" : "text-left"}>
                        <p className="text-sm font-medium text-foreground">{t(lang, item.labelKey)}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{t(lang, item.descKey)}</p>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}

              {/* ── Account Tab ── */}
              {activeTab === "account" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
                  <div className="flex items-center gap-4 rounded-xl bg-secondary p-4">
                    <div className={`${isRTL(lang) ? "text-right" : "text-left"} flex-1`}>
                      <p className="text-sm font-bold text-foreground">Erfan Moharam</p>
                      <p className="text-xs text-muted-foreground mt-1">nmoharam7796@gmail.com</p>
                    </div>
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">E</div>
                  </div>

                  <div className="rounded-xl border border-border overflow-hidden">
                    <div className="flex items-center justify-between p-4">
                      <button onClick={() => { onClose(); window.dispatchEvent(new CustomEvent("open-upgrade")); }} className="rounded-full bg-accent px-4 py-1.5 text-xs font-semibold text-accent-foreground hover:brightness-110 transition-all">{t(lang, "profile.upgrade")}</button>
                      <div className={isRTL(lang) ? "text-right" : "text-left"}>
                        <p className="text-sm font-medium text-foreground">{t(lang, "settings.current_plan")}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{t(lang, "sidebar.free_plan")}</p>
                      </div>
                    </div>
                    <div className="border-t border-border px-4 py-3 flex items-center justify-between">
                      <span className="text-sm font-semibold text-foreground">300</span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                        <Sparkles className="h-3.5 w-3.5" />
                        {t(lang, "settings.remaining_credits")}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <button onClick={() => setShowPasswordDialog(true)} className={`w-full rounded-xl bg-secondary px-4 py-3 text-sm font-medium text-foreground hover:bg-secondary/80 transition-colors ${isRTL(lang) ? "text-right" : "text-left"}`}>{t(lang, "settings.change_password")}</button>
                    <button onClick={() => {
                      const data = { settings: loadSettings(), exportDate: new Date().toISOString(), messages: "exported" };
                      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement("a"); a.href = url; a.download = `erfanai-data-${new Date().toISOString().slice(0, 10)}.json`; a.click(); URL.revokeObjectURL(url);
                      toast.success(t(lang, "settings.export_success"));
                    }} className={`w-full rounded-xl bg-secondary px-4 py-3 text-sm font-medium text-foreground hover:bg-secondary/80 transition-colors ${isRTL(lang) ? "text-right" : "text-left"}`}>{t(lang, "settings.export_data")}</button>
                    <button onClick={() => setShowDeleteConfirm(true)} className={`w-full rounded-xl bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive hover:bg-destructive/20 transition-colors ${isRTL(lang) ? "text-right" : "text-left"}`}>{t(lang, "settings.delete_account")}</button>
                  </div>

                  {/* Password Dialog */}
                  <AnimatePresence>
                    {showPasswordDialog && (
                      <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] bg-background/80" onClick={() => setShowPasswordDialog(false)} />
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed inset-x-6 top-1/2 -translate-y-1/2 z-[70] rounded-2xl border border-border bg-card p-5 shadow-2xl space-y-4" dir={dir}>
                          <h3 className="text-base font-bold text-foreground text-center">{t(lang, "settings.change_password")}</h3>
                          <input type="password" placeholder={t(lang, "settings.current_password")} value={oldPassword} onChange={e => setOldPassword(e.target.value)} className="w-full rounded-xl border border-border bg-secondary px-4 py-3 text-sm text-foreground outline-none" />
                          <input type="password" placeholder={t(lang, "settings.new_password")} value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full rounded-xl border border-border bg-secondary px-4 py-3 text-sm text-foreground outline-none" />
                          <input type="password" placeholder={t(lang, "settings.confirm_password")} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full rounded-xl border border-border bg-secondary px-4 py-3 text-sm text-foreground outline-none" />
                          <div className="flex gap-2">
                            <button onClick={() => setShowPasswordDialog(false)} className="flex-1 rounded-xl bg-secondary py-3 text-sm font-medium text-foreground">{t(lang, "settings.cancel")}</button>
                            <button onClick={() => {
                              if (!oldPassword || !newPassword || !confirmPassword) { toast.error(t(lang, "settings.fill_all_fields")); return; }
                              if (newPassword !== confirmPassword) { toast.error(t(lang, "settings.password_mismatch")); return; }
                              if (newPassword.length < 6) { toast.error(t(lang, "settings.password_min")); return; }
                              toast.success(t(lang, "settings.password_changed")); setOldPassword(""); setNewPassword(""); setConfirmPassword(""); setShowPasswordDialog(false);
                            }} className="flex-1 rounded-xl bg-accent py-3 text-sm font-bold text-accent-foreground">{t(lang, "settings.save")}</button>
                          </div>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>

                  {/* Delete Confirm Dialog */}
                  <AnimatePresence>
                    {showDeleteConfirm && (
                      <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] bg-background/80" onClick={() => setShowDeleteConfirm(false)} />
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed inset-x-6 top-1/2 -translate-y-1/2 z-[70] rounded-2xl border border-border bg-card p-5 shadow-2xl space-y-4" dir={dir}>
                          <h3 className="text-base font-bold text-destructive text-center">{t(lang, "settings.delete_account")}</h3>
                          <p className="text-sm text-muted-foreground text-center leading-relaxed">{t(lang, "settings.delete_confirm")}</p>
                          <div className="flex gap-2">
                            <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 rounded-xl bg-secondary py-3 text-sm font-medium text-foreground">{t(lang, "settings.cancel")}</button>
                            <button onClick={() => { localStorage.clear(); toast.success(t(lang, "settings.delete_success")); setShowDeleteConfirm(false); onClose(); onLogout(); }} className="flex-1 rounded-xl bg-destructive py-3 text-sm font-bold text-destructive-foreground">{t(lang, "settings.delete_permanent")}</button>
                          </div>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

/* ═══════════════════════ PROFILE DROPDOWN ═══════════════════════ */
const ProfileDropdown = ({ isOpen, onClose, onLogout, onOpenSettings, onOpenProfile, onOpenKnowledge, onUpgrade, onHome, onHelp }: { isOpen: boolean; onClose: () => void; onLogout: () => void; onOpenSettings: () => void; onOpenProfile: () => void; onOpenKnowledge: () => void; onUpgrade: () => void; onHome: () => void; onHelp: () => void }) => {
  const { lang } = useLang();
  const dir = isRTL(lang) ? "rtl" : "ltr";
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 z-40" />
          <motion.div initial={{ opacity: 0, y: -10, scaleY: 0.95 }} animate={{ opacity: 1, y: 0, scaleY: 1 }} exit={{ opacity: 0, y: -10, scaleY: 0.95 }} transition={{ duration: 0.2, ease: "easeOut" }} style={{ transformOrigin: "top left" }} className="absolute left-3 top-[60px] z-50 w-[300px] rounded-2xl border border-border bg-card shadow-2xl overflow-hidden" dir={dir}>
            <div className="flex items-center justify-between p-4">
              <button onClick={() => { toast(t(lang, "profile.switch_account")); onClose(); }} className="text-muted-foreground hover:text-foreground transition-colors"><ArrowRightLeft className="h-4 w-4" /></button>
              <div className="flex items-center gap-3">
                <div>
                  <h3 className={`text-sm font-bold text-foreground ${isRTL(lang) ? "text-left" : "text-right"}`}>Erfan Moharam</h3>
                  <p className={`text-xs text-muted-foreground ${isRTL(lang) ? "text-left" : "text-right"}`}>...nmoharam7796@gmail.com</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">E</div>
              </div>
            </div>

            <div className="mx-4 mb-3 rounded-xl border border-border overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3">
                <button onClick={() => { onUpgrade(); onClose(); }} className="rounded-full border border-border bg-foreground px-4 py-1 text-xs font-semibold text-background hover:opacity-90 transition-opacity">{t(lang, "profile.upgrade")}</button>
                <span className="text-sm font-bold text-foreground">{t(lang, "profile.free")}</span>
              </div>
              <button onClick={() => { onClose(); /* credits panel opened via parent */ const evt = new CustomEvent("open-credits"); window.dispatchEvent(evt); }} className="border-t border-dashed border-border" />
              <button onClick={() => { onClose(); window.dispatchEvent(new CustomEvent("open-credits")); }} className="flex w-full items-center justify-between px-4 py-3 hover:bg-secondary/50 transition-colors">
                <div className="flex items-center gap-1">
                  <ChevronLeft className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-semibold text-foreground">300</span>
                </div>
                <div className="flex items-center gap-2">
                  <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{t(lang, "profile.credits")}</span>
                  <Sparkles className="h-4 w-4 text-foreground" />
                </div>
              </button>
            </div>

            <div className="px-2">
              <button onClick={() => { onOpenKnowledge(); onClose(); }} className={`flex w-full items-center ${isRTL(lang) ? "justify-end" : "justify-start"} gap-3 rounded-lg px-3 py-3 text-sm text-foreground hover:bg-secondary transition-colors`}>
                {!isRTL(lang) && <BookOpen className="h-5 w-5 text-muted-foreground" />}
                <span>{t(lang, "profile.knowledge")}</span>
                {isRTL(lang) && <BookOpen className="h-5 w-5 text-muted-foreground" />}
              </button>
              <div className="mx-3 border-t border-border" />
              <button onClick={() => { onOpenProfile(); onClose(); }} className={`flex w-full items-center ${isRTL(lang) ? "justify-end" : "justify-start"} gap-3 rounded-lg px-3 py-3 text-sm text-foreground hover:bg-secondary transition-colors`}>
                {!isRTL(lang) && <User className="h-5 w-5 text-muted-foreground" />}
                <span>{t(lang, "profile.account")}</span>
                {isRTL(lang) && <User className="h-5 w-5 text-muted-foreground" />}
              </button>
              <button onClick={() => { onOpenSettings(); onClose(); }} className={`flex w-full items-center ${isRTL(lang) ? "justify-end" : "justify-start"} gap-3 rounded-lg px-3 py-3 text-sm text-foreground hover:bg-secondary transition-colors`}>
                {!isRTL(lang) && <Settings className="h-5 w-5 text-muted-foreground" />}
                <span>{t(lang, "settings.title")}</span>
                {isRTL(lang) && <Settings className="h-5 w-5 text-muted-foreground" />}
              </button>
              <div className="mx-3 border-t border-border" />
              <button onClick={() => { onHome(); onClose(); }} className="flex w-full items-center justify-between rounded-lg px-3 py-3 text-sm text-foreground hover:bg-secondary transition-colors">
                <ExternalLink className="h-4 w-4 text-muted-foreground" />
                <div className="flex items-center gap-3">
                  <span>{t(lang, "profile.home")}</span>
                  <Home className="h-5 w-5 text-muted-foreground" />
                </div>
              </button>
              <button onClick={() => { onHelp(); onClose(); }} className="flex w-full items-center justify-between rounded-lg px-3 py-3 text-sm text-foreground hover:bg-secondary transition-colors">
                <ExternalLink className="h-4 w-4 text-muted-foreground" />
                <div className="flex items-center gap-3">
                  <span>{t(lang, "profile.get_help")}</span>
                  <HelpCircle className="h-5 w-5 text-muted-foreground" />
                </div>
              </button>
              <div className="mx-3 border-t border-border" />
              <button onClick={onLogout} className={`flex w-full items-center ${isRTL(lang) ? "justify-end" : "justify-start"} gap-3 rounded-lg px-3 py-3 text-sm text-destructive hover:bg-secondary transition-colors`}>
                {!isRTL(lang) && <LogOut className="h-5 w-5" />}
                <span>{t(lang, "profile.logout")}</span>
                {isRTL(lang) && <LogOut className="h-5 w-5" />}
              </button>
            </div>
            <div className="h-2" />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

/* ═══════════════════════ CHAT MESSAGE ═══════════════════════ */
const ChatMessage = ({ message, isUser, files }: { message: string; isUser: boolean; files?: File[] }) => (
  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex ${isUser ? "justify-start" : "justify-end"} mb-3`}>
    <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${isUser ? "bg-accent text-accent-foreground" : "bg-secondary text-foreground"}`}>
      {message && <p className="leading-relaxed">{message}</p>}
      {files && files.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {files.map((f, i) => (
            <span key={i} className="inline-flex items-center gap-1 rounded-lg bg-background/20 px-2 py-1 text-xs">
              {f.type.startsWith("image/") ? <Image className="h-3 w-3" /> : <FileText className="h-3 w-3" />}
              {f.name}
            </span>
          ))}
        </div>
      )}
    </div>
  </motion.div>
);

/* ═══════════════════════ KNOWLEDGE PANEL ═══════════════════════ */
const KNOWLEDGE_KEY = "erfanai_knowledge";
interface KnowledgeItem { id: string; title: string; content: string; enabled: boolean; createdAt: number; updatedAt: number; }

const KnowledgePanel = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const { lang } = useLang();
  const dir = isRTL(lang) ? "rtl" : "ltr";
  const [items, setItems] = useState<KnowledgeItem[]>(() => {
    try { const s = localStorage.getItem(KNOWLEDGE_KEY); if (s) return JSON.parse(s); } catch {} return [];
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formTitle, setFormTitle] = useState("");
  const [formContent, setFormContent] = useState("");

  const saveItems = (newItems: KnowledgeItem[]) => {
    setItems(newItems);
    localStorage.setItem(KNOWLEDGE_KEY, JSON.stringify(newItems));
  };

  const handleAdd = () => {
    if (!formTitle.trim() || !formContent.trim()) return;
    const newItem: KnowledgeItem = { id: Date.now().toString(), title: formTitle.trim(), content: formContent.trim(), enabled: true, createdAt: Date.now(), updatedAt: Date.now() };
    saveItems([newItem, ...items]);
    setFormTitle(""); setFormContent(""); setIsAdding(false);
    toast(t(lang, "knowledge.saved"));
  };

  const handleUpdate = () => {
    if (!editingId || !formTitle.trim() || !formContent.trim()) return;
    saveItems(items.map(i => i.id === editingId ? { ...i, title: formTitle.trim(), content: formContent.trim(), updatedAt: Date.now() } : i));
    setFormTitle(""); setFormContent(""); setEditingId(null);
    toast(t(lang, "knowledge.updated"));
  };

  const handleDelete = (id: string) => {
    saveItems(items.filter(i => i.id !== id));
    toast(t(lang, "knowledge.deleted"));
  };

  const handleToggle = (id: string) => {
    saveItems(items.map(i => i.id === id ? { ...i, enabled: !i.enabled } : i));
  };

  const startEdit = (item: KnowledgeItem) => {
    setEditingId(item.id); setFormTitle(item.title); setFormContent(item.content); setIsAdding(false);
  };

  const cancelForm = () => { setIsAdding(false); setEditingId(null); setFormTitle(""); setFormContent(""); };

  const filtered = items.filter(i => !searchQuery || i.title.toLowerCase().includes(searchQuery.toLowerCase()) || i.content.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 z-50 bg-black/50" />
          <motion.div initial={{ opacity: 0, y: 40, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 40, scale: 0.95 }} transition={{ duration: 0.3 }} className="fixed inset-x-3 top-8 bottom-8 z-50 mx-auto max-w-lg overflow-hidden rounded-2xl border border-border bg-card shadow-2xl flex flex-col" dir={dir}>
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <button onClick={onClose} className="rounded-lg p-1.5 hover:bg-secondary transition-colors">
                {isRTL(lang) ? <ArrowRight className="h-5 w-5 text-foreground" /> : <ArrowLeft className="h-5 w-5 text-foreground" />}
              </button>
              <div className="text-center flex-1">
                <h2 className="text-lg font-bold text-foreground">{t(lang, "knowledge.title")}</h2>
                <p className="text-xs text-muted-foreground">{items.length} {t(lang, "knowledge.items_count")}</p>
              </div>
              <button onClick={() => { setIsAdding(true); setEditingId(null); setFormTitle(""); setFormContent(""); }} className="rounded-lg p-1.5 text-accent hover:bg-secondary transition-colors">
                <Plus className="h-5 w-5" />
              </button>
            </div>

            {/* Subtitle */}
            <div className="px-4 py-3 bg-secondary/30 border-b border-border">
              <p className="text-xs text-muted-foreground text-center">{t(lang, "knowledge.subtitle")}</p>
            </div>

            {/* Search */}
            {items.length > 0 && (
              <div className="px-4 py-3 border-b border-border">
                <div className="flex items-center gap-2 rounded-xl bg-secondary px-3 py-2.5">
                  <Search className="h-4 w-4 text-muted-foreground shrink-0" />
                  <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder={t(lang, "knowledge.search_placeholder")} className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground" />
                  {searchQuery && <button onClick={() => setSearchQuery("")} className="text-muted-foreground hover:text-foreground"><X className="h-3.5 w-3.5" /></button>}
                </div>
              </div>
            )}

            {/* Add/Edit Form */}
            <AnimatePresence>
              {(isAdding || editingId) && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden border-b border-border">
                  <div className="p-4 space-y-3 bg-accent/5">
                    <div>
                      <label className="text-xs font-semibold text-foreground mb-1 block">{t(lang, "knowledge.title_label")}</label>
                      <input value={formTitle} onChange={e => setFormTitle(e.target.value)} placeholder={t(lang, "knowledge.title_placeholder")} className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-accent transition-colors placeholder:text-muted-foreground" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-foreground mb-1 block">{t(lang, "knowledge.content_label")}</label>
                      <textarea value={formContent} onChange={e => setFormContent(e.target.value)} placeholder={t(lang, "knowledge.content_placeholder")} rows={4} className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-accent transition-colors placeholder:text-muted-foreground resize-none" />
                    </div>
                    <div className="flex gap-2">
                      <button onClick={editingId ? handleUpdate : handleAdd} disabled={!formTitle.trim() || !formContent.trim()} className="flex-1 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-accent-foreground hover:opacity-90 transition-opacity disabled:opacity-40">
                        {t(lang, "knowledge.save")}
                      </button>
                      <button onClick={cancelForm} className="flex-1 rounded-xl border border-border bg-secondary px-4 py-2.5 text-sm font-medium text-foreground hover:bg-secondary/80 transition-colors">
                        {t(lang, "profile.cancel")}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Items List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {filtered.length === 0 && !isAdding && !editingId ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary">
                    <BookOpen className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="text-sm font-semibold text-foreground">{t(lang, "knowledge.empty")}</p>
                  <p className="text-xs text-muted-foreground mt-1 max-w-[250px]">{t(lang, "knowledge.empty_desc")}</p>
                  <button onClick={() => { setIsAdding(true); setFormTitle(""); setFormContent(""); }} className="mt-4 flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-accent-foreground hover:opacity-90 transition-opacity">
                    <Plus className="h-4 w-4" />
                    {t(lang, "knowledge.add")}
                  </button>
                </div>
              ) : (
                filtered.map(item => (
                  <motion.div key={item.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className={`rounded-xl border ${item.enabled ? "border-border bg-secondary/30" : "border-border/50 bg-secondary/10 opacity-60"} overflow-hidden transition-all`}>
                    <div className="flex items-start justify-between p-3.5 gap-3">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-foreground truncate">{item.title}</h4>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">{item.content}</p>
                        <p className="text-[10px] text-muted-foreground/60 mt-2">
                          {new Date(item.updatedAt).toLocaleDateString(lang === "العربية" ? "ar-SA" : "en-US", { year: "numeric", month: "short", day: "numeric" })}
                        </p>
                      </div>
                      <button onClick={() => handleToggle(item.id)} className={`mt-1 h-5 w-9 rounded-full transition-colors shrink-0 relative ${item.enabled ? "bg-accent" : "bg-muted-foreground/30"}`}>
                        <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${item.enabled ? (isRTL(lang) ? "left-0.5" : "right-0.5") : (isRTL(lang) ? "right-0.5" : "left-0.5")}`} />
                      </button>
                    </div>
                    <div className="flex border-t border-border/50">
                      <button onClick={() => startEdit(item)} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors">
                        <BookOpen className="h-3.5 w-3.5" />
                        {t(lang, "knowledge.edit")}
                      </button>
                      <div className="w-px bg-border/50" />
                      <button onClick={() => handleDelete(item.id)} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs text-destructive hover:bg-destructive/5 transition-colors">
                        <Trash2 className="h-3.5 w-3.5" />
                        {t(lang, "knowledge.delete")}
                      </button>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

/* ═══════════════════════ PROFILE PANEL ═══════════════════════ */
const PROFILE_KEY = "erfanai_profile";
const defaultProfile = { name: "Erfan Moharam", email: "nmoharam7796@gmail.com", avatar: null as string | null };

const ProfilePanel = ({ isOpen, onClose, onLogout }: { isOpen: boolean; onClose: () => void; onLogout: () => void }) => {
  const { lang } = useLang();
  const dir = isRTL(lang) ? "rtl" : "ltr";
  const [isKnowledgePanelOpen, setIsKnowledgePanelOpen] = useState(false);
  const [profile, setProfile] = useState(() => {
    try {
      const s = localStorage.getItem(PROFILE_KEY);
      if (s) return { ...defaultProfile, ...JSON.parse(s) };
    } catch {}
    return { ...defaultProfile };
  });
  const [editName, setEditName] = useState(profile.name);
  const [isEditing, setIsEditing] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const updated = { ...profile, avatar: reader.result as string };
      setProfile(updated);
      localStorage.setItem(PROFILE_KEY, JSON.stringify(updated));
      toast.success(t(lang, "profile.saved"));
    };
    reader.readAsDataURL(file);
    if (avatarInputRef.current) avatarInputRef.current.value = "";
  };

  const handleSave = () => {
    if (!editName.trim()) return;
    const updated = { ...profile, name: editName.trim() };
    setProfile(updated);
    localStorage.setItem(PROFILE_KEY, JSON.stringify(updated));
    setIsEditing(false);
    toast.success(t(lang, "profile.saved"));
  };

  const handleCancelEdit = () => {
    setEditName(profile.name);
    setIsEditing(false);
  };

  return (
    <>
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 z-40" style={{ background: "hsl(0 0% 0% / 0.7)" }} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-x-3 top-10 bottom-10 z-50 flex flex-col rounded-2xl border border-border bg-card shadow-2xl overflow-hidden"
            dir={dir}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
              <button onClick={onClose} className="rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
                <X className="h-5 w-5" />
              </button>
              <h3 className="text-lg font-bold text-foreground">{t(lang, "profile.page_title")}</h3>
              <div className="w-8" />
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5">

              {/* Avatar */}
              <div className="flex flex-col items-center gap-3 py-2">
                <div className="relative">
                  {profile.avatar ? (
                    <img src={profile.avatar} alt="avatar" className="h-24 w-24 rounded-full object-cover border-4 border-border shadow-lg" />
                  ) : (
                    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary border-4 border-border text-3xl font-bold text-primary-foreground shadow-lg">
                      {profile.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <button
                    onClick={() => avatarInputRef.current?.click()}
                    className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full border-2 border-card bg-accent text-accent-foreground hover:opacity-90 transition-opacity shadow-md"
                  >
                    <Camera className="h-4 w-4" />
                  </button>
                </div>
                <button onClick={() => avatarInputRef.current?.click()} className="text-sm text-accent font-medium hover:underline transition-colors">
                  {t(lang, "profile.change_photo")}
                </button>
                <input ref={avatarInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
              </div>

              {/* Name */}
              <div className="rounded-xl border border-border bg-secondary/50 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                  <h4 className="text-sm font-semibold text-foreground">{t(lang, "profile.name")}</h4>
                  {!isEditing && (
                    <button onClick={() => { setEditName(profile.name); setIsEditing(true); }} className="text-xs font-medium text-accent hover:underline transition-colors">
                      {t(lang, "profile.edit")}
                    </button>
                  )}
                </div>
                <div className="px-4 py-3">
                  {isEditing ? (
                    <div className="space-y-3">
                      <input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-accent/50 transition-shadow"
                        dir={dir}
                        autoFocus
                        onKeyDown={(e) => { if (e.key === "Enter") handleSave(); if (e.key === "Escape") handleCancelEdit(); }}
                      />
                      <div className="flex gap-2">
                        <button onClick={handleSave} className="flex-1 rounded-lg bg-accent px-3 py-2 text-xs font-semibold text-accent-foreground hover:opacity-90 transition-opacity">
                          {t(lang, "profile.save")}
                        </button>
                        <button onClick={handleCancelEdit} className="flex-1 rounded-lg border border-border bg-secondary px-3 py-2 text-xs font-medium text-foreground hover:bg-secondary/80 transition-colors">
                          {t(lang, "profile.cancel")}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-foreground">{profile.name}</p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div className="rounded-xl border border-border bg-secondary/50 overflow-hidden">
                <div className="px-4 py-3 border-b border-border">
                  <h4 className="text-sm font-semibold text-foreground">{t(lang, "profile.email_label")}</h4>
                </div>
                <div className="px-4 py-3">
                  <p className="text-sm text-muted-foreground">{profile.email}</p>
                </div>
              </div>

              {/* Plan & Credits */}
              <div className="rounded-xl border border-border overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-dashed border-border">
                  <button onClick={() => { onClose(); window.dispatchEvent(new CustomEvent("open-upgrade")); }} className="rounded-full border border-border bg-foreground px-4 py-1 text-xs font-semibold text-background hover:opacity-90 transition-opacity">
                    {t(lang, "profile.upgrade")}
                  </button>
                  <span className="text-sm font-bold text-foreground">{t(lang, "profile.free")}</span>
                </div>
                <div className="flex items-center justify-between px-4 py-3">
                  <div className="flex items-center gap-1">
                    <ChevronLeft className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-semibold text-foreground">300</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{t(lang, "profile.credits")}</span>
                    <Sparkles className="h-4 w-4 text-foreground" />
                  </div>
                </div>
              </div>

              {/* Knowledge */}
              <div className="rounded-xl border border-border bg-secondary/50 overflow-hidden">
                <button
                  onClick={() => setIsKnowledgePanelOpen(true)}
                  className={`flex w-full items-center ${isRTL(lang) ? "justify-end" : "justify-start"} gap-3 px-4 py-4 text-sm text-foreground hover:bg-secondary transition-colors`}
                >
                  {!isRTL(lang) && <BookOpen className="h-5 w-5 text-accent shrink-0" />}
                  <div className={`${isRTL(lang) ? "text-right" : "text-left"} flex-1`}>
                    <p className="font-semibold">{t(lang, "profile.knowledge")}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{t(lang, "profile.knowledge_desc")}</p>
                  </div>
                  {isRTL(lang) && <BookOpen className="h-5 w-5 text-accent shrink-0" />}
                </button>
              </div>

              {/* Logout */}
              <button
                onClick={() => { onLogout(); onClose(); }}
                className={`flex w-full items-center ${isRTL(lang) ? "justify-end" : "justify-start"} gap-3 rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-4 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors`}
              >
                {!isRTL(lang) && <LogOut className="h-5 w-5 shrink-0" />}
                <span>{t(lang, "profile.logout")}</span>
                {isRTL(lang) && <LogOut className="h-5 w-5 shrink-0" />}
              </button>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
    <KnowledgePanel isOpen={isKnowledgePanelOpen} onClose={() => setIsKnowledgePanelOpen(false)} />
    </>
  );
};

/* ═══════════════════════ GENERIC MORE PANEL WRAPPER ═══════════════════════ */
const MorePanelWrapper = ({ isOpen, onClose, title, icon: Icon, children }: { isOpen: boolean; onClose: () => void; title: string; icon: any; children: React.ReactNode }) => {
  const { lang } = useLang();
  const dir = isRTL(lang) ? "rtl" : "ltr";
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 z-50 bg-black/50" />
          <motion.div initial={{ opacity: 0, y: 40, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 40, scale: 0.95 }} transition={{ duration: 0.3 }} className="fixed inset-x-3 top-8 bottom-8 z-50 mx-auto max-w-lg overflow-hidden rounded-2xl border border-border bg-card shadow-2xl flex flex-col" dir={dir}>
            <div className="flex items-center justify-between p-4 border-b border-border">
              <button onClick={onClose} className="rounded-lg p-1.5 hover:bg-secondary transition-colors">
                {isRTL(lang) ? <ArrowRight className="h-5 w-5 text-foreground" /> : <ArrowLeft className="h-5 w-5 text-foreground" />}
              </button>
              <h2 className="text-base font-bold text-foreground flex items-center gap-2"><Icon className="h-5 w-5 text-accent" />{title}</h2>
              <div className="w-8" />
            </div>
            <div className="flex-1 overflow-y-auto p-4">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

/* ═══════════════════════ SCHEDULE TASK PANEL ═══════════════════════ */
const ScheduleTaskPanel = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const { lang } = useLang();
  const [tasks, setTasks] = useState<{ id: string; title: string; date: string; time: string; done: boolean }[]>(() => {
    try { const s = localStorage.getItem("erfanai_scheduled_tasks"); if (s) return JSON.parse(s); } catch {} return [];
  });
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const save = (t: typeof tasks) => { setTasks(t); localStorage.setItem("erfanai_scheduled_tasks", JSON.stringify(t)); };

  const addTask = () => {
    if (!title.trim() || !date) return;
    save([{ id: Date.now().toString(), title: title.trim(), date, time, done: false }, ...tasks]);
    setTitle(""); setDate(""); setTime("");
    toast.success(t(lang, "schedule.added"));
  };

  return (
    <MorePanelWrapper isOpen={isOpen} onClose={onClose} title={t(lang, "more.schedule_task")} icon={CalendarCheck}>
      <div className="space-y-3 mb-5">
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder={t(lang, "schedule.task_name")} className="w-full rounded-xl border border-border bg-secondary px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-accent" />
        <div className="flex gap-2">
          <input type="date" value={date} onChange={e => setDate(e.target.value)} className="flex-1 rounded-xl border border-border bg-secondary px-4 py-3 text-sm text-foreground outline-none focus:border-accent" />
          <input type="time" value={time} onChange={e => setTime(e.target.value)} className="flex-1 rounded-xl border border-border bg-secondary px-4 py-3 text-sm text-foreground outline-none focus:border-accent" />
        </div>
        <button onClick={addTask} disabled={!title.trim() || !date} className="w-full rounded-xl bg-accent text-accent-foreground py-3 text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-40">{t(lang, "schedule.add_btn")}</button>
      </div>
      {tasks.length === 0 ? (
        <div className="text-center py-10"><CalendarCheck className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" /><p className="text-sm text-muted-foreground">{t(lang, "schedule.empty")}</p></div>
      ) : (
        <div className="space-y-2">
          {tasks.map(task => (
            <div key={task.id} className={`flex items-center gap-3 rounded-xl border border-border p-3 ${task.done ? "opacity-50" : ""}`}>
              <button onClick={() => save(tasks.map(tt => tt.id === task.id ? { ...tt, done: !tt.done } : tt))} className={`h-5 w-5 rounded-md border-2 flex items-center justify-center transition-colors ${task.done ? "bg-accent border-accent" : "border-muted-foreground"}`}>
                {task.done && <span className="text-accent-foreground text-xs">✓</span>}
              </button>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium text-foreground ${task.done ? "line-through" : ""}`}>{task.title}</p>
                <p className="text-xs text-muted-foreground">{task.date} {task.time && `• ${task.time}`}</p>
              </div>
              <button onClick={() => { save(tasks.filter(tt => tt.id !== task.id)); toast(t(lang, "schedule.deleted")); }} className="text-muted-foreground hover:text-red-500 transition-colors"><Trash2 className="h-4 w-4" /></button>
            </div>
          ))}
        </div>
      )}
    </MorePanelWrapper>
  );
};

/* ═══════════════════════ WIDE RESEARCH PANEL ═══════════════════════ */
const WideResearchPanel = ({ isOpen, onClose, onSubmit }: { isOpen: boolean; onClose: () => void; onSubmit: (q: string) => void }) => {
  const { lang } = useLang();
  const [query, setQuery] = useState("");
  const [depth, setDepth] = useState<"quick" | "deep" | "comprehensive">("deep");

  return (
    <MorePanelWrapper isOpen={isOpen} onClose={onClose} title={t(lang, "more.wide_research")} icon={Target}>
      <div className="space-y-4">
        <textarea value={query} onChange={e => setQuery(e.target.value)} placeholder={t(lang, "research.placeholder")} rows={4} className="w-full rounded-xl border border-border bg-secondary px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-accent resize-none" />
        <div>
          <p className="text-xs font-semibold text-muted-foreground mb-2">{t(lang, "research.depth")}</p>
          <div className="flex gap-2">
            {(["quick", "deep", "comprehensive"] as const).map(d => (
              <button key={d} onClick={() => setDepth(d)} className={`flex-1 rounded-xl py-2.5 text-xs font-semibold transition-colors ${depth === d ? "bg-accent text-accent-foreground" : "bg-secondary text-foreground hover:bg-muted"}`}>
                {t(lang, `research.${d}`)}
              </button>
            ))}
          </div>
        </div>
        <div className="rounded-xl bg-secondary p-3 space-y-2">
          <p className="text-xs font-semibold text-foreground">{t(lang, "research.sources_title")}</p>
          {["web", "academic", "news"].map(s => (
            <label key={s} className="flex items-center gap-2 text-xs text-muted-foreground"><input type="checkbox" defaultChecked className="rounded accent-accent" />{t(lang, `research.source_${s}`)}</label>
          ))}
        </div>
        <button onClick={() => { if (query.trim()) { onSubmit(query.trim()); onClose(); toast.success(t(lang, "research.started")); } }} disabled={!query.trim()} className="w-full rounded-xl bg-accent text-accent-foreground py-3 text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-40">{t(lang, "research.start_btn")}</button>
      </div>
    </MorePanelWrapper>
  );
};

/* ═══════════════════════ SPREADSHEET PANEL ═══════════════════════ */
const SpreadsheetPanel = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const { lang } = useLang();
  const [rows, setRows] = useState<string[][]>(() => {
    try { const s = localStorage.getItem("erfanai_spreadsheet"); if (s) return JSON.parse(s); } catch {} return [["", "", ""], ["", "", ""], ["", "", ""], ["", "", ""], ["", "", ""]];
  });

  const updateCell = (r: number, c: number, v: string) => {
    const newRows = rows.map((row, ri) => ri === r ? row.map((cell, ci) => ci === c ? v : cell) : row);
    setRows(newRows);
    localStorage.setItem("erfanai_spreadsheet", JSON.stringify(newRows));
  };

  const addRow = () => { const newRows = [...rows, Array(rows[0]?.length || 3).fill("")]; setRows(newRows); localStorage.setItem("erfanai_spreadsheet", JSON.stringify(newRows)); };
  const addCol = () => { const newRows = rows.map(r => [...r, ""]); setRows(newRows); localStorage.setItem("erfanai_spreadsheet", JSON.stringify(newRows)); };

  return (
    <MorePanelWrapper isOpen={isOpen} onClose={onClose} title={t(lang, "more.spreadsheet")} icon={Table}>
      <div className="flex gap-2 mb-3">
        <button onClick={addRow} className="flex items-center gap-1 rounded-lg bg-secondary px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted transition-colors"><Plus className="h-3 w-3" />{t(lang, "spreadsheet.add_row")}</button>
        <button onClick={addCol} className="flex items-center gap-1 rounded-lg bg-secondary px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted transition-colors"><Plus className="h-3 w-3" />{t(lang, "spreadsheet.add_col")}</button>
      </div>
      <div className="overflow-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr>{rows[0]?.map((_, ci) => <th key={ci} className="border-b border-r border-border bg-secondary px-2 py-1.5 text-xs font-semibold text-muted-foreground text-center min-w-[80px]">{String.fromCharCode(65 + ci)}</th>)}</tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => (
              <tr key={ri}>
                {row.map((cell, ci) => (
                  <td key={ci} className="border-b border-r border-border p-0">
                    <input value={cell} onChange={e => updateCell(ri, ci, e.target.value)} className="w-full bg-transparent px-2 py-1.5 text-xs text-foreground outline-none focus:bg-accent/10 min-w-[80px]" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </MorePanelWrapper>
  );
};

/* ═══════════════════════ VISUALIZATION PANEL ═══════════════════════ */
const VisualizationPanel = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const { lang } = useLang();
  const [chartType, setChartType] = useState<"bar" | "line" | "pie">("bar");
  const [dataInput, setDataInput] = useState("10, 25, 40, 30, 55, 20");

  const values = dataInput.split(",").map(v => parseFloat(v.trim())).filter(v => !isNaN(v));
  const maxVal = Math.max(...values, 1);

  return (
    <MorePanelWrapper isOpen={isOpen} onClose={onClose} title={t(lang, "more.visualization")} icon={BarChart3}>
      <div className="space-y-4">
        <div>
          <p className="text-xs font-semibold text-muted-foreground mb-2">{t(lang, "viz.chart_type")}</p>
          <div className="flex gap-2">
            {(["bar", "line", "pie"] as const).map(ct => (
              <button key={ct} onClick={() => setChartType(ct)} className={`flex-1 rounded-xl py-2.5 text-xs font-semibold transition-colors ${chartType === ct ? "bg-accent text-accent-foreground" : "bg-secondary text-foreground hover:bg-muted"}`}>{t(lang, `viz.${ct}`)}</button>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold text-muted-foreground mb-2">{t(lang, "viz.data_input")}</p>
          <input value={dataInput} onChange={e => setDataInput(e.target.value)} className="w-full rounded-xl border border-border bg-secondary px-4 py-3 text-sm text-foreground outline-none focus:border-accent" placeholder="10, 25, 40..." />
        </div>
        <div className="rounded-xl border border-border bg-secondary p-4 min-h-[200px] flex items-end justify-center gap-2">
          {chartType === "bar" && values.map((v, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <motion.div initial={{ height: 0 }} animate={{ height: (v / maxVal) * 150 }} transition={{ duration: 0.5, delay: i * 0.05 }} className="w-8 rounded-t-md bg-accent" />
              <span className="text-[10px] text-muted-foreground">{v}</span>
            </div>
          ))}
          {chartType === "line" && (
            <svg viewBox={`0 0 ${values.length * 50} 160`} className="w-full h-[160px]">
              <polyline fill="none" stroke="hsl(var(--accent))" strokeWidth="2" points={values.map((v, i) => `${i * 50 + 25},${150 - (v / maxVal) * 140}`).join(" ")} />
              {values.map((v, i) => <circle key={i} cx={i * 50 + 25} cy={150 - (v / maxVal) * 140} r="4" fill="hsl(var(--accent))" />)}
            </svg>
          )}
          {chartType === "pie" && (
            <div className="flex flex-wrap gap-2 items-center justify-center">
              {values.map((v, i) => {
                const total = values.reduce((a, b) => a + b, 0);
                const pct = total > 0 ? Math.round((v / total) * 100) : 0;
                return <div key={i} className="flex items-center gap-1.5"><div className="h-3 w-3 rounded-full" style={{ background: `hsl(${(i * 60) % 360}, 70%, 50%)` }} /><span className="text-xs text-foreground">{pct}%</span></div>;
              })}
            </div>
          )}
        </div>
      </div>
    </MorePanelWrapper>
  );
};

/* ═══════════════════════ VIDEO PANEL ═══════════════════════ */
const VideoPanel = ({ isOpen, onClose, onSubmit }: { isOpen: boolean; onClose: () => void; onSubmit: (p: string) => void }) => {
  const { lang } = useLang();
  const [prompt, setPrompt] = useState("");
  const [duration, setDuration] = useState<"short" | "medium" | "long">("short");
  const [style, setStyle] = useState<"realistic" | "animated" | "cinematic">("realistic");

  return (
    <MorePanelWrapper isOpen={isOpen} onClose={onClose} title={t(lang, "more.video")} icon={Play}>
      <div className="space-y-4">
        <textarea value={prompt} onChange={e => setPrompt(e.target.value)} placeholder={t(lang, "video.prompt_placeholder")} rows={3} className="w-full rounded-xl border border-border bg-secondary px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-accent resize-none" />
        <div>
          <p className="text-xs font-semibold text-muted-foreground mb-2">{t(lang, "video.duration")}</p>
          <div className="flex gap-2">
            {(["short", "medium", "long"] as const).map(d => (
              <button key={d} onClick={() => setDuration(d)} className={`flex-1 rounded-xl py-2.5 text-xs font-semibold transition-colors ${duration === d ? "bg-accent text-accent-foreground" : "bg-secondary text-foreground hover:bg-muted"}`}>{t(lang, `video.${d}`)}</button>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold text-muted-foreground mb-2">{t(lang, "video.style")}</p>
          <div className="flex gap-2">
            {(["realistic", "animated", "cinematic"] as const).map(s => (
              <button key={s} onClick={() => setStyle(s)} className={`flex-1 rounded-xl py-2.5 text-xs font-semibold transition-colors ${style === s ? "bg-accent text-accent-foreground" : "bg-secondary text-foreground hover:bg-muted"}`}>{t(lang, `video.${s}`)}</button>
            ))}
          </div>
        </div>
        <button onClick={() => { if (prompt.trim()) { onSubmit(prompt.trim()); onClose(); toast.success(t(lang, "video.generating")); } }} disabled={!prompt.trim()} className="w-full rounded-xl bg-accent text-accent-foreground py-3 text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-40">{t(lang, "video.generate_btn")}</button>
      </div>
    </MorePanelWrapper>
  );
};

/* ═══════════════════════ AUDIO PANEL ═══════════════════════ */
const AudioPanel = ({ isOpen, onClose, onSubmit }: { isOpen: boolean; onClose: () => void; onSubmit: (p: string) => void }) => {
  const { lang } = useLang();
  const [prompt, setPrompt] = useState("");
  const [type, setType] = useState<"tts" | "music" | "effects">("tts");

  return (
    <MorePanelWrapper isOpen={isOpen} onClose={onClose} title={t(lang, "more.audio")} icon={AudioLines}>
      <div className="space-y-4">
        <div>
          <p className="text-xs font-semibold text-muted-foreground mb-2">{t(lang, "audio.type")}</p>
          <div className="flex gap-2">
            {(["tts", "music", "effects"] as const).map(at => (
              <button key={at} onClick={() => setType(at)} className={`flex-1 rounded-xl py-2.5 text-xs font-semibold transition-colors ${type === at ? "bg-accent text-accent-foreground" : "bg-secondary text-foreground hover:bg-muted"}`}>{t(lang, `audio.${at}`)}</button>
            ))}
          </div>
        </div>
        <textarea value={prompt} onChange={e => setPrompt(e.target.value)} placeholder={type === "tts" ? t(lang, "audio.tts_placeholder") : t(lang, "audio.music_placeholder")} rows={3} className="w-full rounded-xl border border-border bg-secondary px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-accent resize-none" />
        <button onClick={() => { if (prompt.trim()) { onSubmit(prompt.trim()); onClose(); toast.success(t(lang, "audio.generating")); } }} disabled={!prompt.trim()} className="w-full rounded-xl bg-accent text-accent-foreground py-3 text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-40">{t(lang, "audio.generate_btn")}</button>
      </div>
    </MorePanelWrapper>
  );
};

/* ═══════════════════════ CHAT MODE PANEL ═══════════════════════ */
const ChatModePanel = ({ isOpen, onClose, onSelect }: { isOpen: boolean; onClose: () => void; onSelect: (mode: string) => void }) => {
  const { lang } = useLang();
  const [selected, setSelected] = useState("standard");
  const modes = [
    { id: "standard", icon: MessageCircle, key: "chatmode.standard", descKey: "chatmode.standard_desc" },
    { id: "creative", icon: Sparkles, key: "chatmode.creative", descKey: "chatmode.creative_desc" },
    { id: "precise", icon: Target, key: "chatmode.precise", descKey: "chatmode.precise_desc" },
    { id: "code", icon: Code, key: "chatmode.code", descKey: "chatmode.code_desc" },
  ];

  return (
    <MorePanelWrapper isOpen={isOpen} onClose={onClose} title={t(lang, "more.chat_mode")} icon={MessageCircle}>
      <div className="space-y-2">
        {modes.map(mode => (
          <button key={mode.id} onClick={() => { setSelected(mode.id); onSelect(mode.id); onClose(); toast.success(`${t(lang, mode.key)}`); }} className={`w-full flex items-start gap-3 rounded-xl border p-4 text-start transition-colors ${selected === mode.id ? "border-accent bg-accent/10" : "border-border hover:bg-secondary"}`}>
            <mode.icon className={`h-5 w-5 mt-0.5 ${selected === mode.id ? "text-accent" : "text-muted-foreground"}`} />
            <div>
              <p className="text-sm font-semibold text-foreground">{t(lang, mode.key)}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{t(lang, mode.descKey)}</p>
            </div>
          </button>
        ))}
      </div>
    </MorePanelWrapper>
  );
};

/* ═══════════════════════ PLAYBOOK PANEL ═══════════════════════ */
const PlaybookPanel = ({ isOpen, onClose, onUse }: { isOpen: boolean; onClose: () => void; onUse: (prompt: string) => void }) => {
  const { lang } = useLang();
  const playbooks = [
    { id: "seo", icon: Search, key: "playbook.seo", descKey: "playbook.seo_desc", prompt: "Analyze the SEO of my website and provide recommendations" },
    { id: "content", icon: FileText, key: "playbook.content", descKey: "playbook.content_desc", prompt: "Create a content strategy for my brand" },
    { id: "social", icon: Share2, key: "playbook.social", descKey: "playbook.social_desc", prompt: "Build a social media campaign plan" },
    { id: "competitor", icon: Target, key: "playbook.competitor", descKey: "playbook.competitor_desc", prompt: "Analyze my competitors and identify opportunities" },
    { id: "email", icon: Mail, key: "playbook.email", descKey: "playbook.email_desc", prompt: "Design an email marketing funnel" },
    { id: "launch", icon: Zap, key: "playbook.launch", descKey: "playbook.launch_desc", prompt: "Create a product launch plan" },
  ];

  return (
    <MorePanelWrapper isOpen={isOpen} onClose={onClose} title={t(lang, "more.playbook")} icon={BookCopy}>
      <div className="space-y-2">
        {playbooks.map(pb => (
          <button key={pb.id} onClick={() => { onUse(pb.prompt); onClose(); toast.success(t(lang, "playbook.applied")); }} className="w-full flex items-start gap-3 rounded-xl border border-border p-4 text-start hover:bg-secondary transition-colors">
            <pb.icon className="h-5 w-5 mt-0.5 text-accent" />
            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-foreground">{t(lang, pb.key)}</p>
                <ExternalLink className="h-3 w-3 text-muted-foreground" />
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">{t(lang, pb.descKey)}</p>
            </div>
          </button>
        ))}
      </div>
    </MorePanelWrapper>
  );
};

/* ═══════════════════════ UPGRADE PRO PANEL ═══════════════════════ */
const UpgradeProPanel = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const { lang } = useLang();
  const [billing, setBilling] = useState<"monthly" | "yearly">("yearly");
  const features = ["pro.feature_1", "pro.feature_2", "pro.feature_3", "pro.feature_4", "pro.feature_5", "pro.feature_6"];

  return (
    <MorePanelWrapper isOpen={isOpen} onClose={onClose} title={t(lang, "pro.title")} icon={Zap}>
      <div className="space-y-5">
        {/* Hero */}
        <div className="text-center">
          <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/15">
            <Zap className="h-8 w-8 text-accent" />
          </div>
          <p className="text-sm text-muted-foreground">{t(lang, "pro.subtitle")}</p>
        </div>

        {/* Billing toggle */}
        <div className="flex items-center justify-center gap-1 rounded-xl bg-secondary p-1">
          <button onClick={() => setBilling("monthly")} className={`flex-1 rounded-lg py-2.5 text-xs font-semibold transition-colors ${billing === "monthly" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}>{t(lang, "pro.monthly")}</button>
          <button onClick={() => setBilling("yearly")} className={`flex-1 rounded-lg py-2.5 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 ${billing === "yearly" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}>
            {t(lang, "pro.yearly")}
            <span className="rounded-full bg-accent/15 px-1.5 py-0.5 text-[10px] font-bold text-accent">{t(lang, "pro.save")}</span>
          </button>
        </div>

        {/* Price */}
        <div className="text-center">
          <span className="text-3xl font-bold text-foreground">{t(lang, billing === "monthly" ? "pro.price_monthly" : "pro.price_yearly")}</span>
        </div>

        {/* Features */}
        <div className="space-y-2.5">
          {features.map(f => (
            <div key={f} className="flex items-center gap-3 rounded-xl bg-secondary px-4 py-3">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-accent/20"><Sparkles className="h-3 w-3 text-accent" /></div>
              <span className="text-sm text-foreground">{t(lang, f)}</span>
            </div>
          ))}
        </div>

        {/* Subscribe button */}
        <button onClick={() => { toast.success(t(lang, "pro.subscribe")); onClose(); }} className="w-full rounded-xl bg-accent text-accent-foreground py-3.5 text-sm font-bold hover:opacity-90 transition-opacity active:scale-[0.98]">
          {t(lang, "pro.subscribe")}
        </button>
      </div>
    </MorePanelWrapper>
  );
};

/* ═══════════════════════ HELP PANEL ═══════════════════════ */
const HelpPanel = ({ isOpen, onClose, onUpgrade }: { isOpen: boolean; onClose: () => void; onUpgrade: () => void }) => {
  const { lang } = useLang();
  const dir = isRTL(lang) ? "rtl" : "ltr";
  const [contactMsg, setContactMsg] = useState("");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const faqs = [
    { q: "help.faq1_q", a: "help.faq1_a" },
    { q: "help.faq2_q", a: "help.faq2_a" },
    { q: "help.faq3_q", a: "help.faq3_a" },
    { q: "help.faq4_q", a: "help.faq4_a" },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 z-40" style={{ background: "hsl(0 0% 0% / 0.7)" }} />
          <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} transition={{ type: "spring", damping: 25, stiffness: 300 }} className="fixed inset-x-3 top-10 bottom-10 z-50 flex flex-col rounded-2xl border border-border bg-card shadow-2xl overflow-hidden" dir={dir}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
              <button onClick={onClose} className="rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"><X className="h-5 w-5" /></button>
              <h3 className="text-lg font-bold text-foreground">{t(lang, "help.title")}</h3>
              <div className="w-8" />
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              {/* Subtitle */}
              <div className="text-center">
                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/15">
                  <HelpCircle className="h-7 w-7 text-accent" />
                </div>
                <p className="text-sm text-muted-foreground">{t(lang, "help.subtitle")}</p>
              </div>

              {/* FAQ */}
              <div>
                <h4 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-accent" />
                  {t(lang, "help.faq")}
                </h4>
                <div className="space-y-2">
                  {faqs.map((faq, i) => (
                    <div key={i} className="rounded-xl border border-border overflow-hidden">
                      <button onClick={() => setExpandedFaq(expandedFaq === i ? null : i)} className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium text-foreground hover:bg-secondary/50 transition-colors">
                        <span>{t(lang, faq.q)}</span>
                        <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${expandedFaq === i ? "rotate-180" : ""}`} />
                      </button>
                      <AnimatePresence>
                        {expandedFaq === i && (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                            <p className="px-4 pb-3 text-xs text-muted-foreground leading-relaxed">{t(lang, faq.a)}</p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shortcuts */}
              <div>
                <h4 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                  <Zap className="h-4 w-4 text-accent" />
                  {t(lang, "help.shortcuts")}
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between rounded-xl bg-secondary px-4 py-3">
                    <kbd className="rounded bg-background px-2 py-1 text-xs font-mono text-foreground border border-border">Enter</kbd>
                    <span className="text-xs text-muted-foreground">{t(lang, "help.shortcut_send")}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl bg-secondary px-4 py-3">
                    <kbd className="rounded bg-background px-2 py-1 text-xs font-mono text-foreground border border-border">Shift + Enter</kbd>
                    <span className="text-xs text-muted-foreground">{t(lang, "help.shortcut_newline")}</span>
                  </div>
                </div>
              </div>

              {/* Contact */}
              <div>
                <h4 className="text-sm font-bold text-foreground mb-2 flex items-center gap-2">
                  <Mail className="h-4 w-4 text-accent" />
                  {t(lang, "help.contact")}
                </h4>
                <p className="text-xs text-muted-foreground mb-3">{t(lang, "help.contact_desc")}</p>
                <textarea value={contactMsg} onChange={e => setContactMsg(e.target.value)} placeholder={t(lang, "help.message_placeholder")} rows={3} className="w-full rounded-xl border border-border bg-secondary px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-accent resize-none" />
                <button onClick={() => { if (contactMsg.trim()) { toast.success(t(lang, "help.sent")); setContactMsg(""); } }} disabled={!contactMsg.trim()} className="mt-2 w-full rounded-xl bg-accent text-accent-foreground py-3 text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-40">
                  {t(lang, "help.send")}
                </button>
              </div>

              {/* Version */}
              <div className="text-center pt-2 pb-4">
                <p className="text-xs text-muted-foreground">{t(lang, "help.version")} 1.6.0</p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

/* ═══════════════════════ CREDITS PANEL ═══════════════════════ */
const CreditsPanel = ({ isOpen, onClose, onUpgrade, messagesCount }: { isOpen: boolean; onClose: () => void; onUpgrade: () => void; messagesCount: number }) => {
  const { lang } = useLang();
  const dir = isRTL(lang) ? "rtl" : "ltr";
  const totalCredits = 300;
  const usedCredits = Math.min(messagesCount * 2, totalCredits);
  const remainingCredits = Math.max(totalCredits - usedCredits, 0);
  const percentage = (remainingCredits / totalCredits) * 100;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 z-40" style={{ background: "hsl(0 0% 0% / 0.7)" }} />
          <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} transition={{ type: "spring", damping: 25, stiffness: 300 }} className="fixed inset-x-3 top-16 z-50 flex flex-col rounded-2xl border border-border bg-card shadow-2xl overflow-hidden max-h-[80vh]" dir={dir}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
              <button onClick={onClose} className="rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"><X className="h-5 w-5" /></button>
              <h3 className="text-lg font-bold text-foreground">{t(lang, "credits.title")}</h3>
              <div className="w-8" />
            </div>

            <div className="overflow-y-auto p-5 space-y-5">
              {/* Credits Circle */}
              <div className="flex flex-col items-center gap-3">
                <div className="relative flex h-32 w-32 items-center justify-center">
                  <svg className="h-32 w-32 -rotate-90" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="52" fill="none" stroke="hsl(var(--secondary))" strokeWidth="8" />
                    <motion.circle cx="60" cy="60" r="52" fill="none" stroke="hsl(var(--accent))" strokeWidth="8" strokeLinecap="round" strokeDasharray={`${2 * Math.PI * 52}`} initial={{ strokeDashoffset: 2 * Math.PI * 52 }} animate={{ strokeDashoffset: 2 * Math.PI * 52 * (1 - percentage / 100) }} transition={{ duration: 1, ease: "easeOut" }} />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-2xl font-bold text-foreground">{remainingCredits}</span>
                    <span className="text-[10px] text-muted-foreground">{t(lang, "credits.of")} {totalCredits}</span>
                  </div>
                </div>
                <p className="text-sm font-semibold text-foreground">{t(lang, "credits.remaining")}</p>
              </div>

              {/* Plan info */}
              <div className="rounded-xl border border-border bg-secondary/50 p-4">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-accent/15 px-3 py-1 text-xs font-bold text-accent">{t(lang, "credits.free_plan")}</span>
                  <span className="text-xs text-muted-foreground">{t(lang, "credits.plan")}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">{t(lang, "credits.renews")}</p>
              </div>

              {/* Usage stats */}
              <div>
                <h4 className="text-sm font-bold text-foreground mb-3">{t(lang, "credits.usage")}</h4>
                <div className="space-y-2">
                  {[
                    { icon: MessageSquare, label: "credits.messages_sent", value: messagesCount },
                    { icon: Image, label: "credits.images_generated", value: 0 },
                    { icon: FileText, label: "credits.files_analyzed", value: 0 },
                  ].map((stat, i) => (
                    <div key={i} className="flex items-center justify-between rounded-xl bg-secondary px-4 py-3">
                      <span className="text-sm font-semibold text-foreground">{stat.value}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">{t(lang, stat.label)}</span>
                        <stat.icon className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Get more */}
              <button onClick={() => { onUpgrade(); onClose(); }} className="w-full rounded-xl bg-accent text-accent-foreground py-3.5 text-sm font-bold hover:opacity-90 transition-opacity active:scale-[0.98]">
                {t(lang, "credits.get_more")}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const AlignJustify = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
);

const AppScreen = ({ onLogout }: { onLogout: () => void }) => {
  const { lang } = useLang();
  const dir = isRTL(lang) ? "rtl" : "ltr";
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isModelSelectorOpen, setIsModelSelectorOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isProfilePanelOpen, setIsProfilePanelOpen] = useState(false);
  const [isKnowledgeOpen, setIsKnowledgeOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isCreditsOpen, setIsCreditsOpen] = useState(false);
  const [currentModel, setCurrentModel] = useState(() => loadSettings().defaultModel || "ErfanAI Lite");
  const [inputValue, setInputValue] = useState("");
  const [activeChips, setActiveChips] = useState<string[]>([]);
  const [isPlusMenuOpen, setIsPlusMenuOpen] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [morePanel, setMorePanel] = useState<string | null>(null);
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [messages, setMessages] = useState<{ text: string; isUser: boolean; files?: File[] }[]>(() => {
    try {
      const saved = localStorage.getItem("erfanai_messages");
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });

  useEffect(() => {
    localStorage.setItem("erfanai_messages", JSON.stringify(messages.map(m => ({ text: m.text, isUser: m.isUser }))));
  }, [messages]);
  const [isRecording, setIsRecording] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDiscoverOpen, setIsDiscoverOpen] = useState(false);
  const [isRecordingDialogOpen, setIsRecordingDialogOpen] = useState(false);
  const [isMeetingViewOpen, setIsMeetingViewOpen] = useState(false);
  const [meetingState, setMeetingState] = useState<"idle" | "recording" | "paused" | "stopped">("idle");
  const [meetingSeconds, setMeetingSeconds] = useState(0);
  const meetingTimerRef = useRef<any>(null);
  const [meetingNotes, setMeetingNotes] = useState("");
  const [meetingSummary, setMeetingSummary] = useState("");
  const [meetingWaveform, setMeetingWaveform] = useState<number[]>(Array(30).fill(0));
  const waveformIntervalRef = useRef<any>(null);
  const meetingAudioRef = useRef<MediaStream | null>(null);
  const meetingAnalyserRef = useRef<AnalyserNode | null>(null);
  const [editingMeetingId, setEditingMeetingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [savedMeetings, setSavedMeetings] = useState<{ id: string; duration: number; date: string; title: string; notes?: string; summary?: string }[]>(() => {
    try { const s = localStorage.getItem("erfanai_meetings"); if (s) return JSON.parse(s); } catch {} return [];
  });
  const [playbackMeeting, setPlaybackMeeting] = useState<{ id: string; duration: number; date: string; title: string; notes?: string; summary?: string } | null>(null);
  const [playbackSeconds, setPlaybackSeconds] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const playbackTimerRef = useRef<any>(null);
  const [viewingMeeting, setViewingMeeting] = useState<{ id: string; duration: number; date: string; title: string; notes?: string; summary?: string } | null>(null);
  const recognitionRef = useRef<any>(null);
  const lastTranscriptRef = useRef<string>("");

  useState(() => {
    const s = loadSettings();
    applyTheme(s.theme);
    applyFontSize(s.fontSize);
  });

  const [headerProfile, setHeaderProfile] = useState(() => {
    try {
      const s = localStorage.getItem(PROFILE_KEY);
      if (s) return { ...defaultProfile, ...JSON.parse(s) };
    } catch {}
    return { ...defaultProfile };
  });

  useEffect(() => {
    const sync = () => {
      try {
        const s = localStorage.getItem(PROFILE_KEY);
        if (s) setHeaderProfile({ ...defaultProfile, ...JSON.parse(s) });
      } catch {}
    };
    window.addEventListener("storage", sync);
    // Poll every second to catch same-tab saves
    const id = setInterval(sync, 1000);
    return () => { window.removeEventListener("storage", sync); clearInterval(id); };
  }, []);

  useEffect(() => {
    const creditsHandler = () => setIsCreditsOpen(true);
    const upgradeHandler = () => setMorePanel("upgrade_pro");
    window.addEventListener("open-credits", creditsHandler);
    window.addEventListener("open-upgrade", upgradeHandler);
    return () => { window.removeEventListener("open-credits", creditsHandler); window.removeEventListener("open-upgrade", upgradeHandler); };
  }, []);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setAttachedFiles(prev => [...prev, ...files]);
      toast.success(`${t(lang, "app.files_attached")} ${files.length} ${t(lang, "app.file")}`);
    }
    setIsPlusMenuOpen(false);
  };

  const removeFile = (index: number) => setAttachedFiles(prev => prev.filter((_, i) => i !== index));

  const handleSend = () => {
    if (!inputValue.trim() && attachedFiles.length === 0) return;
    setMessages(prev => [...prev, { text: inputValue, isUser: true, files: attachedFiles.length > 0 ? [...attachedFiles] : undefined }]);
    const userMsg = inputValue;
    setInputValue("");
    setAttachedFiles([]);
    setTimeout(() => {
      setMessages(prev => [...prev, { text: t(lang, "app.ai_response"), isUser: false }]);
    }, 1200);
  };

  const handleMic = async () => {
    if (isRecording) {
      // Stop recording
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsRecording(false);
      toast(t(lang, "app.recording_stopped"));
      return;
    }

    // Check browser support
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error("المتصفح لا يدعم التعرف الصوتي. جرب Chrome أو Edge.");
      return;
    }

    // Request microphone permission
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (error) {
      toast.error("يرجى السماح بالوصول إلى الميكرفون");
      return;
    }

    // Initialize recognition
    const recognition = new SpeechRecognition();
    recognition.lang = lang === "العربية" ? "ar-SA" : "en-US";
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    const baseText = inputValue;
    lastTranscriptRef.current = "";

    recognition.onstart = () => {
      setIsRecording(true);
      toast.success("🎤 بدأ التسجيل الصوتي...");
    };

    recognition.onresult = (event: any) => {
      let interimTranscript = "";
      let finalTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      // Update last transcript
      if (finalTranscript) {
        lastTranscriptRef.current += finalTranscript;
      }

      // Update input with base text + accumulated transcript + interim
      const fullText = baseText + lastTranscriptRef.current + interimTranscript;
      setInputValue(fullText);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      setIsRecording(false);
      
      if (event.error === "no-speech") {
        toast.error("لم يتم اكتشاف صوت. حاول مرة أخرى.");
      } else if (event.error === "not-allowed") {
        toast.error("تم رفض الوصول إلى الميكرفون");
      } else {
        toast.error("حدث خطأ في التعرف الصوتي");
      }
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const chipItems = [
    { icon: Code, key: "chip.create_website" },
    { icon: Presentation, key: "chip.presentations" },
    { icon: Smartphone, key: "chip.app_dev" },
    { icon: Palette, key: "chip.design" },
  ];

  const toggleChip = (label: string) => {
    setActiveChips((prev) => prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]);
  };

  return (
    <div className="relative flex min-h-screen flex-col bg-background font-cairo" dir={dir}>
      {/* Header */}
      <motion.header initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="flex items-center justify-between px-4 py-3">
        <button onClick={() => setIsSidebarOpen(true)} className="rounded-lg p-2 text-muted-foreground hover:bg-secondary transition-colors"><Menu className="h-5 w-5" /></button>
        <button onClick={() => setIsModelSelectorOpen(true)} className="flex items-center gap-1.5 hover:opacity-80 transition-opacity">
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-semibold text-foreground">{modelData.find(m => m.id === currentModel)?.label || currentModel}</span>
        </button>
        <div className="flex items-center gap-3">
          <button onClick={() => setIsNotificationsOpen(true)} className="relative p-1.5 text-muted-foreground hover:text-foreground transition-colors">
            <Bell className="h-5 w-5" />
            {(() => { const notifs = loadNotifications(); const unread = notifs.filter(n => !n.read).length; return unread > 0 ? <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-destructive px-1 text-[9px] font-bold text-destructive-foreground">{unread}</span> : null; })()}
          </button>
          <button onClick={() => toast(`✨ ${t(lang, "coming_soon")}`)} className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"><Sparkles className="h-5 w-5" /></button>
          <button onClick={() => setIsProfileOpen(true)} className="flex h-10 w-10 items-center justify-center rounded-full bg-primary overflow-hidden transition-transform hover:scale-105">
            {headerProfile.avatar ? (
              <img src={headerProfile.avatar} alt={headerProfile.name} className="h-full w-full object-cover" />
            ) : (
              <span className="text-sm font-bold text-primary-foreground">{headerProfile.name.trim().charAt(0).toUpperCase()}</span>
            )}
          </button>
        </div>
      </motion.header>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-4 pb-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mt-4 flex items-center justify-center">
          <div className="flex items-center gap-4 rounded-full border border-border bg-card px-5 py-2.5">
            <span className="text-sm text-muted-foreground">{t(lang, "app.free_plan")}</span>
            <span className="text-muted-foreground/30">|</span>
            <button onClick={() => setMorePanel("upgrade_pro")} className="text-sm font-semibold text-accent transition-all hover:brightness-110 active:scale-95">{t(lang, "app.upgrade_to_pro")}</button>
          </div>
        </motion.div>

        {messages.length > 0 ? (
          <div className="mt-6 space-y-1">
            {messages.map((msg, i) => (
              <ChatMessage key={i} message={msg.text} isUser={msg.isUser} files={msg.files} />
            ))}
          </div>
        ) : (
          <motion.h1 initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-8 text-center text-2xl font-bold text-accent leading-relaxed">{t(lang, "landing.how_can_i_help")}</motion.h1>
        )}

        {/* Input Card */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mt-6 card-gold-border rounded-2xl bg-card p-4">
          {activeChips.length > 0 && (
            <div className="mb-2 flex flex-wrap gap-1.5">
              {activeChips.map((label) => (
                <span key={label} className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium" style={{ background: "hsl(217 91% 50%)", color: "#fff" }}>
                  {label}
                  <button onClick={() => toggleChip(label)} className="hover:opacity-70"><X className="h-3 w-3" /></button>
                </span>
              ))}
            </div>
          )}
          <textarea value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder={activeChips.length > 0 ? `${t(lang, "app.active_tasks")} ${activeChips.join("، ")}` : t(lang, "landing.input_placeholder")} rows={3} className="w-full resize-none bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none leading-relaxed" dir={dir} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }} />
          {attachedFiles.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {attachedFiles.map((file, index) => (
                <div key={index} className="flex items-center gap-1.5 rounded-lg border border-border bg-secondary px-2.5 py-1.5 text-xs text-foreground">
                  {file.type.startsWith("image/") ? <Image className="h-3.5 w-3.5 text-accent" /> : <FileText className="h-3.5 w-3.5 text-accent" />}
                  <span className="max-w-[120px] truncate">{file.name}</span>
                  <button onClick={() => removeFile(index)} className="hover:text-destructive transition-colors"><X className="h-3 w-3" /></button>
                </div>
              ))}
            </div>
          )}
          {/* Bottom toolbar */}
          <div className="mt-3 flex items-center justify-between">
            <div className="relative">
              <button onClick={() => setIsPlusMenuOpen(!isPlusMenuOpen)} className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors ${isPlusMenuOpen ? "bg-accent text-accent-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"}`}>
                <Plus className={`h-5 w-5 transition-transform ${isPlusMenuOpen ? "rotate-45" : ""}`} />
              </button>
              <AnimatePresence>
                {isPlusMenuOpen && (
                  <>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-30" onClick={() => setIsPlusMenuOpen(false)} />
                    <motion.div initial={{ opacity: 0, y: 8, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.95 }} transition={{ duration: 0.15 }} className={`absolute bottom-12 ${isRTL(lang) ? "right-0" : "left-0"} z-40 w-48 rounded-xl border border-border bg-card p-1.5 shadow-xl`} dir={dir}>
                      <button onClick={() => imageInputRef.current?.click()} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-foreground hover:bg-secondary transition-colors">
                        <Image className="h-4 w-4 text-accent" />
                        <span>{t(lang, "plus.upload_image")}</span>
                      </button>
                      <button onClick={() => fileInputRef.current?.click()} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-foreground hover:bg-secondary transition-colors">
                        <FileText className="h-4 w-4 text-accent" />
                        <span>{t(lang, "plus.upload_file")}</span>
                      </button>
                      <button onClick={() => cameraInputRef.current?.click()} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-foreground hover:bg-secondary transition-colors">
                        <Camera className="h-4 w-4 text-accent" />
                        <span>{t(lang, "plus.open_camera")}</span>
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
              <input ref={fileInputRef} type="file" className="hidden" multiple onChange={handleFileSelect} />
              <input ref={imageInputRef} type="file" accept="image/*" className="hidden" multiple onChange={handleFileSelect} />
              <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFileSelect} />
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => setIsRecordingDialogOpen(true)} className="rounded-lg p-2 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"><SlidersHorizontal className="h-[18px] w-[18px]" /></button>
              <button onClick={handleMic} className={`rounded-lg p-2 transition-colors ${isRecording ? "text-red-500 bg-red-500/10 animate-pulse" : "text-muted-foreground hover:text-foreground hover:bg-secondary"}`}><Mic className="h-[18px] w-[18px]" /></button>
              <button onClick={handleSend} className={`${isRTL(lang) ? "mr-1" : "ml-1"} flex h-9 w-9 items-center justify-center rounded-xl bg-secondary text-muted-foreground transition-colors hover:text-foreground hover:bg-accent hover:text-accent-foreground disabled:opacity-30`} disabled={!inputValue.trim() && attachedFiles.length === 0}><Send className="h-[18px] w-[18px]" /></button>
            </div>
          </div>
        </motion.div>

        {/* Quick Action Chips */}
        {messages.length === 0 && (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mt-5 flex flex-wrap justify-center gap-2.5">
            {chipItems.map((chip) => {
              const label = t(lang, chip.key);
              const isActive = activeChips.includes(label);
              return (
                <button key={chip.key} onClick={() => toggleChip(label)} className={`flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium transition-all active:scale-95 ${isActive ? "border-transparent text-white" : "border-border bg-card text-foreground hover:bg-secondary hover:border-accent"}`} style={isActive ? { background: "hsl(217 91% 50%)" } : undefined}>
                  <chip.icon className={`h-4 w-4 ${isActive ? "text-white" : "text-accent"}`} />
                  {label}
                </button>
              );
            })}
            <div className="relative">
              <button onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)} className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary hover:border-accent active:scale-95">
                <MoreHorizontal className="h-4 w-4 text-accent" />
                {t(lang, "chip.more")}
              </button>
              <AnimatePresence>
                {isMoreMenuOpen && (
                  <>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-30" onClick={() => setIsMoreMenuOpen(false)} />
                    <motion.div initial={{ opacity: 0, y: 8, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.95 }} transition={{ duration: 0.15 }} className={`absolute bottom-12 ${isRTL(lang) ? "right-0" : "left-0"} z-40 w-56 rounded-xl border border-border bg-card p-1.5 shadow-xl`} dir={dir}>
                      {[
                        { icon: CalendarCheck, key: "more.schedule_task" },
                        { icon: Target, key: "more.wide_research" },
                        { icon: Table, key: "more.spreadsheet" },
                        { icon: BarChart3, key: "more.visualization" },
                        { icon: Play, key: "more.video" },
                        { icon: AudioLines, key: "more.audio" },
                        { icon: MessageCircle, key: "more.chat_mode" },
                        { icon: BookCopy, key: "more.playbook", hasExternal: true },
                      ].map((item) => (
                        <button key={item.key} onClick={() => { setMorePanel(item.key.replace("more.", "")); setIsMoreMenuOpen(false); }} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-foreground hover:bg-secondary transition-colors">
                          <item.icon className="h-4 w-4 text-muted-foreground" />
                          <span className="flex-1 text-start">{t(lang, item.key)}</span>
                          {item.hasExternal && <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />}
                        </button>
                      ))}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {/* Bottom Customize Card */}
        {messages.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: [30, -5, 0], scale: [0.9, 1.02, 1] }}
            transition={{ delay: 0.5, duration: 0.7, ease: "easeOut" }}
            whileHover={{ scale: 1.03, y: -4, boxShadow: "0 12px 40px -10px hsl(var(--accent) / 0.4)" }}
            whileTap={{ scale: 0.95 }}
            className="mt-6 overflow-hidden rounded-2xl bg-card cursor-pointer border border-border relative"
            onClick={() => toast(t(lang, "coming_soon"))}
          >
            {/* Animated gradient border */}
            <motion.div
              className="absolute inset-0 rounded-2xl pointer-events-none"
              style={{ background: "linear-gradient(90deg, hsl(var(--accent)/0.4), hsl(var(--accent)/0.1), hsl(var(--accent)/0.4))", backgroundSize: "200% 100%" }}
              animate={{ backgroundPosition: ["0% 0%", "200% 0%"] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />
            <div className="relative flex items-center gap-4 p-5 bg-card rounded-2xl m-[1px]">
              <motion.div
                className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-xl bg-secondary gap-1"
                animate={{ rotate: [0, -5, 5, -3, 3, 0], scale: [1, 1.05, 1] }}
                transition={{ duration: 3, repeat: Infinity, repeatDelay: 2, ease: "easeInOut" }}
              >
                <motion.div
                  animate={{ scale: [1, 1.3, 1], rotate: [0, 15, -15, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 2.5, ease: "easeInOut" }}
                >
                  <LayoutGrid className="h-6 w-6 text-accent" />
                </motion.div>
                <div className="flex flex-col gap-0.5">
                  <motion.div
                    animate={{ width: [0, 32, 20, 32], opacity: [0.3, 0.6, 0.3, 0.6] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                    className="h-[2px] rounded-full bg-accent/50"
                  />
                  <motion.div
                    animate={{ width: [0, 24, 16, 24], opacity: [0.2, 0.5, 0.2, 0.5] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
                    className="h-[2px] rounded-full bg-accent/40"
                  />
                </div>
              </motion.div>
              <div className="text-sm font-semibold text-foreground leading-relaxed">
                <motion.span
                  className="inline-block"
                  animate={{ opacity: [0, 1] }}
                  transition={{ delay: 0.6, duration: 0.4 }}
                >
                  {t(lang, "app.customize")}{" "}
                </motion.span>
                <motion.span
                  className="text-accent inline-block font-bold"
                  animate={{
                    scale: [1, 1.12, 1],
                    textShadow: ["0 0 0px hsl(var(--accent)/0)", "0 0 12px hsl(var(--accent)/0.5)", "0 0 0px hsl(var(--accent)/0)"],
                  }}
                  transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1.5, ease: "easeInOut" }}
                >
                  ErfanAI
                </motion.span>{" "}
                <motion.span
                  className="inline-block"
                  animate={{ opacity: [0, 1] }}
                  transition={{ delay: 0.8, duration: 0.4 }}
                >
                  {t(lang, "app.your")}
                </motion.span>
              </div>
            </div>
          </motion.div>
        )}

        {messages.length === 0 && (
          <div className="mt-5 flex items-center justify-center gap-2">
            <div className="h-2 w-2 rounded-full bg-accent" />
            <div className="h-2 w-2 rounded-full bg-muted-foreground/30" />
            <div className="h-2 w-2 rounded-full bg-muted-foreground/30" />
          </div>
        )}
      </div>

      {/* Overlays */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} onNewTask={() => { setInputValue(""); setMessages([]); setActiveChips([]); toast(t(lang, "new_task.created")); }} onNavigate={(page) => { 
        if (page === "search") { setIsSearchOpen(true); }
        else if (page === "discover") { setIsDiscoverOpen(true); }
        else if (page === "chats") { toast(`${t(lang, "sidebar.chats")} - ${t(lang, "coming_soon")}`); }
        else if (page === "agents") { toast(`${t(lang, "sidebar.agents")} - ${t(lang, "coming_soon")}`); }
      }} />
      <ProfileDropdown isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} onLogout={onLogout} onOpenSettings={() => setIsSettingsOpen(true)} onOpenProfile={() => setIsProfilePanelOpen(true)} onOpenKnowledge={() => setIsKnowledgeOpen(true)} onUpgrade={() => setMorePanel("upgrade_pro")} onHome={onLogout} onHelp={() => setIsHelpOpen(true)} />
      <NotificationsPanel isOpen={isNotificationsOpen} onClose={() => setIsNotificationsOpen(false)} onUpgrade={() => { setIsNotificationsOpen(false); setMorePanel("upgrade_pro"); }} />
      <ModelSelector isOpen={isModelSelectorOpen} onClose={() => setIsModelSelectorOpen(false)} currentModel={currentModel} onSelect={(m) => { setCurrentModel(m); toast(`${t(lang, "model.switched_to")} ${m}`); }} />
      <SettingsPanel isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} onChangeModel={(m) => setCurrentModel(m)} onClearHistory={() => { setMessages([]); setActiveChips([]); }} onLogout={onLogout} currentModel={currentModel} />
      <ProfilePanel isOpen={isProfilePanelOpen} onClose={() => setIsProfilePanelOpen(false)} onLogout={onLogout} />
      <KnowledgePanel isOpen={isKnowledgeOpen} onClose={() => setIsKnowledgeOpen(false)} />
      <HelpPanel isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} onUpgrade={() => { setIsHelpOpen(false); setMorePanel("upgrade_pro"); }} />
      <CreditsPanel isOpen={isCreditsOpen} onClose={() => setIsCreditsOpen(false)} onUpgrade={() => { setIsCreditsOpen(false); setMorePanel("upgrade_pro"); }} messagesCount={messages.filter(m => m.isUser).length} />
      <SearchConversationsPanel isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} messages={messages} onSelectMessage={(msg) => { setInputValue(msg); }} />
      <DiscoverPanel isOpen={isDiscoverOpen} onClose={() => setIsDiscoverOpen(false)} onUseTemplate={(prompt) => { setInputValue(prompt); }} />
      <ScheduleTaskPanel isOpen={morePanel === "schedule_task"} onClose={() => setMorePanel(null)} />
      <WideResearchPanel isOpen={morePanel === "wide_research"} onClose={() => setMorePanel(null)} onSubmit={(q) => setInputValue(q)} />
      <SpreadsheetPanel isOpen={morePanel === "spreadsheet"} onClose={() => setMorePanel(null)} />
      <VisualizationPanel isOpen={morePanel === "visualization"} onClose={() => setMorePanel(null)} />
      <VideoPanel isOpen={morePanel === "video"} onClose={() => setMorePanel(null)} onSubmit={(p) => setInputValue(p)} />
      <AudioPanel isOpen={morePanel === "audio"} onClose={() => setMorePanel(null)} onSubmit={(p) => setInputValue(p)} />
      <ChatModePanel isOpen={morePanel === "chat_mode"} onClose={() => setMorePanel(null)} onSelect={(m) => toast(`Mode: ${m}`)} />
      <PlaybookPanel isOpen={morePanel === "playbook"} onClose={() => setMorePanel(null)} onUse={(p) => setInputValue(p)} />
      <UpgradeProPanel isOpen={morePanel === "upgrade_pro"} onClose={() => setMorePanel(null)} />

      {/* Recording in Progress Dialog */}
      <AnimatePresence>
        {isRecordingDialogOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[200] bg-black/60"
              onClick={() => setIsRecordingDialogOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="fixed left-1/2 top-1/2 z-[201] w-[90%] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-card border border-border p-6 shadow-2xl"
              dir={dir}
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-base font-semibold text-foreground">{t(lang, "meeting.recording_in_progress")}</h3>
                <button onClick={() => setIsRecordingDialogOpen(false)} className="rounded-lg p-1 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                {t(lang, "meeting.recording_desc")}
              </p>
              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={() => setIsRecordingDialogOpen(false)}
                  className="rounded-xl px-5 py-2.5 text-sm font-medium text-foreground hover:bg-secondary transition-colors"
                >
                  {t(lang, "meeting.cancel")}
                </button>
                 <button
                  onClick={() => {
                    setIsRecordingDialogOpen(false);
                    setIsMeetingViewOpen(true);
                    setMeetingState("idle");
                    setMeetingSeconds(0);
                  }}
                  className="rounded-xl border border-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-secondary transition-colors"
                >
                  {t(lang, "meeting.view_meeting")}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Meeting View Full Screen */}
      <AnimatePresence>
        {isMeetingViewOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] bg-background flex flex-col"
            dir={dir}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <button onClick={() => {
                setIsMeetingViewOpen(false);
                setMeetingState("idle");
                setMeetingSeconds(0);
                setMeetingNotes("");
                setMeetingSummary("");
                setMeetingWaveform(Array(30).fill(0));
                setViewingMeeting(null);
                if (meetingTimerRef.current) clearInterval(meetingTimerRef.current);
                if (waveformIntervalRef.current) clearInterval(waveformIntervalRef.current);
                if (meetingAudioRef.current) { meetingAudioRef.current.getTracks().forEach(t => t.stop()); meetingAudioRef.current = null; }
              }} className="rounded-lg p-2 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div className="flex items-center gap-2 text-foreground">
                <Mic className="h-4 w-4 text-accent" />
                <span className="text-sm font-semibold">{t(lang, "meeting.title")}</span>
              </div>
              <div className="w-9" />
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">

              {/* Viewing a saved meeting detail */}
              <AnimatePresence>
                {viewingMeeting && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="rounded-2xl border border-accent/20 bg-card p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-foreground">{viewingMeeting.title}</h3>
                      <button onClick={() => setViewingMeeting(null)} className="rounded-lg p-1 text-muted-foreground hover:text-foreground"><X className="h-4 w-4" /></button>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{Math.floor(viewingMeeting.duration / 60)}:{(viewingMeeting.duration % 60).toString().padStart(2, "0")}</span>
                      <span>{viewingMeeting.date}</span>
                    </div>
                    {viewingMeeting.summary && (
                      <div className="rounded-xl bg-accent/5 border border-accent/10 p-3 space-y-1">
                        <p className="text-xs font-semibold text-accent">{t(lang, "meeting.summary_label")}</p>
                        <p className="text-sm text-foreground leading-relaxed">{viewingMeeting.summary}</p>
                      </div>
                    )}
                    {viewingMeeting.notes && (
                      <div className="rounded-xl bg-secondary p-3 space-y-1">
                        <p className="text-xs font-semibold text-muted-foreground">{t(lang, "meeting.notes_label")}</p>
                        <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">{viewingMeeting.notes}</p>
                      </div>
                    )}
                    {!viewingMeeting.summary && !viewingMeeting.notes && (
                      <p className="text-sm text-muted-foreground italic">{t(lang, "meeting.no_content")}</p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Recording Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="rounded-2xl border border-border bg-card p-5 space-y-5"
              >
                {/* Audio Waveform Visualization */}
                <div className="flex items-end justify-center gap-[3px] h-16">
                  {meetingWaveform.map((val, i) => (
                    <motion.div
                      key={i}
                      className={`w-1.5 rounded-full ${meetingState === "recording" ? "bg-accent" : meetingState === "paused" ? "bg-accent/40" : "bg-muted-foreground/20"}`}
                      animate={{ height: Math.max(4, val * 60) }}
                      transition={{ duration: 0.1 }}
                    />
                  ))}
                </div>

                <p className="text-sm text-muted-foreground">
                  {meetingState === "stopped" && meetingSummary ? meetingSummary : t(lang, "meeting.summary_auto")}
                </p>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-sm text-muted-foreground font-mono">
                    {Math.floor(meetingSeconds / 60).toString().padStart(1, "0")}:{(meetingSeconds % 60).toString().padStart(2, "0")} / 2:00:00
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setMeetingState("idle");
                        setMeetingSeconds(0);
                        setMeetingNotes("");
                        setMeetingSummary("");
                        setMeetingWaveform(Array(30).fill(0));
                        if (meetingTimerRef.current) clearInterval(meetingTimerRef.current);
                        if (waveformIntervalRef.current) clearInterval(waveformIntervalRef.current);
                        if (meetingAudioRef.current) { meetingAudioRef.current.getTracks().forEach(t => t.stop()); meetingAudioRef.current = null; }
                        toast(t(lang, "meeting.discarded"));
                      }}
                      className="flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                      {t(lang, "meeting.discard")}
                    </button>

                    {meetingState === "recording" ? (
                      <div className="flex items-center gap-2">
                        {/* Pause button */}
                        <button
                          onClick={() => {
                            setMeetingState("paused");
                            if (meetingTimerRef.current) clearInterval(meetingTimerRef.current);
                            if (waveformIntervalRef.current) clearInterval(waveformIntervalRef.current);
                          }}
                          className="flex items-center gap-2 rounded-xl border border-accent bg-accent/10 px-4 py-2.5 text-sm font-medium text-accent hover:bg-accent/20 transition-colors"
                        >
                          <Pause className="h-4 w-4" />
                          {t(lang, "meeting.pause")}
                        </button>
                        {/* Stop button */}
                        <button
                          onClick={() => {
                            setMeetingState("stopped");
                            if (meetingTimerRef.current) clearInterval(meetingTimerRef.current);
                            if (waveformIntervalRef.current) clearInterval(waveformIntervalRef.current);
                            if (meetingAudioRef.current) { meetingAudioRef.current.getTracks().forEach(t => t.stop()); meetingAudioRef.current = null; }
                            // Generate summary
                            const mins = Math.floor(meetingSeconds / 60);
                            const summaryText = t(lang, "meeting.auto_summary").replace("{mins}", String(mins || 1));
                            setMeetingSummary(summaryText);
                            // Save meeting
                            const newMeeting = { id: Date.now().toString(), duration: meetingSeconds, date: new Date().toLocaleString(), title: `${t(lang, "meeting.meeting_num")} #${savedMeetings.length + 1}`, notes: "", summary: summaryText };
                            const updated = [newMeeting, ...savedMeetings];
                            setSavedMeetings(updated);
                            localStorage.setItem("erfanai_meetings", JSON.stringify(updated));
                            toast.success(t(lang, "meeting.saved"));
                          }}
                          className="flex items-center gap-2 rounded-xl bg-destructive text-destructive-foreground px-4 py-2.5 text-sm font-semibold hover:bg-destructive/90 transition-colors"
                        >
                          <X className="h-4 w-4" />
                          {t(lang, "meeting.stop")}
                        </button>
                      </div>
                    ) : meetingState === "paused" ? (
                      <div className="flex items-center gap-2">
                        {/* Resume button */}
                        <button
                          onClick={() => {
                            setMeetingState("recording");
                            meetingTimerRef.current = setInterval(() => {
                              setMeetingSeconds(prev => {
                                if (prev >= 7200) { clearInterval(meetingTimerRef.current); setMeetingState("stopped"); return prev; }
                                return prev + 1;
                              });
                            }, 1000);
                            // Resume waveform
                            if (meetingAnalyserRef.current) {
                              const analyser = meetingAnalyserRef.current;
                              const dataArray = new Uint8Array(analyser.frequencyBinCount);
                              waveformIntervalRef.current = setInterval(() => {
                                analyser.getByteFrequencyData(dataArray);
                                const newWave = Array.from({ length: 30 }, (_, i) => {
                                  const idx = Math.floor((i / 30) * dataArray.length);
                                  return dataArray[idx] / 255;
                                });
                                setMeetingWaveform(newWave);
                              }, 100);
                            }
                          }}
                          className="flex items-center gap-2 rounded-xl bg-accent text-accent-foreground px-4 py-2.5 text-sm font-semibold hover:bg-accent/90 transition-colors"
                        >
                          <Play className="h-4 w-4" />
                          {t(lang, "meeting.resume")}
                        </button>
                        {/* Stop button */}
                        <button
                          onClick={() => {
                            setMeetingState("stopped");
                            if (meetingTimerRef.current) clearInterval(meetingTimerRef.current);
                            if (waveformIntervalRef.current) clearInterval(waveformIntervalRef.current);
                            if (meetingAudioRef.current) { meetingAudioRef.current.getTracks().forEach(t => t.stop()); meetingAudioRef.current = null; }
                            const mins = Math.floor(meetingSeconds / 60);
                            const summaryText = t(lang, "meeting.auto_summary").replace("{mins}", String(mins || 1));
                            setMeetingSummary(summaryText);
                            const newMeeting = { id: Date.now().toString(), duration: meetingSeconds, date: new Date().toLocaleString(), title: `${t(lang, "meeting.meeting_num")} #${savedMeetings.length + 1}`, notes: "", summary: summaryText };
                            const updated = [newMeeting, ...savedMeetings];
                            setSavedMeetings(updated);
                            localStorage.setItem("erfanai_meetings", JSON.stringify(updated));
                            toast.success(t(lang, "meeting.saved"));
                          }}
                          className="flex items-center gap-2 rounded-xl bg-destructive text-destructive-foreground px-4 py-2.5 text-sm font-semibold hover:bg-destructive/90 transition-colors"
                        >
                          <X className="h-4 w-4" />
                          {t(lang, "meeting.stop")}
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={async () => {
                          try {
                            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                            meetingAudioRef.current = stream;
                            const audioCtx = new AudioContext();
                            const source = audioCtx.createMediaStreamSource(stream);
                            const analyser = audioCtx.createAnalyser();
                            analyser.fftSize = 256;
                            source.connect(analyser);
                            meetingAnalyserRef.current = analyser;
                            const dataArray = new Uint8Array(analyser.frequencyBinCount);
                            waveformIntervalRef.current = setInterval(() => {
                              analyser.getByteFrequencyData(dataArray);
                              const newWave = Array.from({ length: 30 }, (_, i) => {
                                const idx = Math.floor((i / 30) * dataArray.length);
                                return dataArray[idx] / 255;
                              });
                              setMeetingWaveform(newWave);
                            }, 100);
                          } catch {
                            // Fallback: simulate waveform if mic not available
                            waveformIntervalRef.current = setInterval(() => {
                              setMeetingWaveform(Array.from({ length: 30 }, () => Math.random() * 0.7 + 0.1));
                            }, 200);
                          }
                          setMeetingState("recording");
                          setMeetingSeconds(0);
                          setMeetingNotes("");
                          setMeetingSummary("");
                          meetingTimerRef.current = setInterval(() => {
                            setMeetingSeconds(prev => {
                              if (prev >= 7200) { clearInterval(meetingTimerRef.current); setMeetingState("stopped"); return prev; }
                              return prev + 1;
                            });
                          }, 1000);
                        }}
                        className="flex items-center gap-2 rounded-xl bg-foreground text-background px-4 py-2.5 text-sm font-semibold hover:bg-foreground/90 transition-colors"
                      >
                        <Play className="h-4 w-4" />
                        {t(lang, "meeting.start")}
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>

              <p className="text-xs text-muted-foreground text-center">
                {t(lang, "meeting.consent")}
              </p>

              {/* Summary Card - shown after recording */}
              <AnimatePresence>
                {meetingState === "stopped" && meetingSummary && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="rounded-2xl border border-accent/20 bg-accent/5 p-4 space-y-2"
                  >
                    <p className="text-xs font-semibold text-accent flex items-center gap-1.5"><Sparkles className="h-3.5 w-3.5" />{t(lang, "meeting.summary_label")}</p>
                    <p className="text-sm text-foreground leading-relaxed">{meetingSummary}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Download App Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="rounded-2xl border border-border bg-card p-4 flex items-center gap-3"
              >
                <Smartphone className="h-8 w-8 text-accent shrink-0" />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {t(lang, "meeting.download_desc")}
                  </p>
                </div>
                <button
                  onClick={() => toast(t(lang, "meeting.download_sent"))}
                  className="shrink-0 rounded-xl border border-border px-4 py-2 text-xs font-semibold text-foreground hover:bg-secondary transition-colors"
                >
                  {t(lang, "meeting.download_app")}
                </button>
              </motion.div>

              {/* Playback Panel */}
              <AnimatePresence>
                {playbackMeeting && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="rounded-2xl border border-accent/30 bg-card p-5 space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Play className="h-4 w-4 text-accent" />
                        <span className="text-sm font-semibold text-foreground">{playbackMeeting.title}</span>
                      </div>
                      <button onClick={() => { setPlaybackMeeting(null); setIsPlaying(false); setPlaybackSeconds(0); if (playbackTimerRef.current) clearInterval(playbackTimerRef.current); }} className="rounded-lg p-1 text-muted-foreground hover:text-foreground"><X className="h-4 w-4" /></button>
                    </div>
                    
                    {/* Progress bar */}
                    <div className="space-y-2">
                      <div className="h-1.5 w-full rounded-full bg-secondary overflow-hidden">
                        <motion.div 
                          className="h-full rounded-full bg-accent"
                          style={{ width: `${playbackMeeting.duration > 0 ? (playbackSeconds / playbackMeeting.duration) * 100 : 0}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground font-mono">
                        <span>{Math.floor(playbackSeconds / 60)}:{(playbackSeconds % 60).toString().padStart(2, "0")}</span>
                        <span>{Math.floor(playbackMeeting.duration / 60)}:{(playbackMeeting.duration % 60).toString().padStart(2, "0")}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-center gap-4">
                      <button onClick={() => { setPlaybackSeconds(0); }} className="rounded-lg p-2 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
                        <RotateCcw className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (isPlaying) {
                            setIsPlaying(false);
                            if (playbackTimerRef.current) clearInterval(playbackTimerRef.current);
                          } else {
                            setIsPlaying(true);
                            playbackTimerRef.current = setInterval(() => {
                              setPlaybackSeconds(prev => {
                                if (prev >= (playbackMeeting?.duration || 0)) {
                                  clearInterval(playbackTimerRef.current);
                                  setIsPlaying(false);
                                  return prev;
                                }
                                return prev + 1;
                              });
                            }, 1000);
                          }
                        }}
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-accent-foreground hover:bg-accent/90 transition-colors"
                      >
                        {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      </button>
                    </div>

                    {/* Show summary/notes of playback meeting */}
                    {playbackMeeting.summary && (
                      <div className="rounded-xl bg-accent/5 border border-accent/10 p-3">
                        <p className="text-xs font-semibold text-accent mb-1">{t(lang, "meeting.summary_label")}</p>
                        <p className="text-xs text-foreground leading-relaxed">{playbackMeeting.summary}</p>
                      </div>
                    )}
                    {playbackMeeting.notes && (
                      <div className="rounded-xl bg-secondary p-3">
                        <p className="text-xs font-semibold text-muted-foreground mb-1">{t(lang, "meeting.notes_label")}</p>
                        <p className="text-xs text-foreground whitespace-pre-wrap leading-relaxed">{playbackMeeting.notes}</p>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Saved Meetings List */}
              {savedMeetings.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-3"
                >
                  <div className="flex items-center gap-2 px-1">
                    <Clock className="h-4 w-4 text-accent" />
                    <span className="text-sm font-semibold text-foreground">{t(lang, "meeting.previous")}</span>
                    <span className="text-xs text-muted-foreground">({savedMeetings.length})</span>
                  </div>
                  {savedMeetings.map((meeting, idx) => (
                    <motion.div
                      key={meeting.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="rounded-xl border border-border bg-card p-4 hover:bg-secondary/50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1 min-w-0" onClick={() => setViewingMeeting(meeting)}>
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent/10 cursor-pointer">
                            <Mic className="h-4 w-4 text-accent" />
                          </div>
                          <div className="min-w-0 cursor-pointer">
                            {editingMeetingId === meeting.id ? (
                              <input
                                value={editingTitle}
                                onChange={e => setEditingTitle(e.target.value)}
                                onBlur={() => {
                                  const updated = savedMeetings.map(m => m.id === meeting.id ? { ...m, title: editingTitle || m.title } : m);
                                  setSavedMeetings(updated);
                                  localStorage.setItem("erfanai_meetings", JSON.stringify(updated));
                                  setEditingMeetingId(null);
                                }}
                                onKeyDown={e => { if (e.key === "Enter") (e.target as HTMLInputElement).blur(); }}
                                autoFocus
                                className="text-sm font-medium text-foreground bg-transparent border-b border-accent outline-none w-full"
                                onClick={e => e.stopPropagation()}
                              />
                            ) : (
                              <p className="text-sm font-medium text-foreground truncate">{meeting.title}</p>
                            )}
                            <p className="text-xs text-muted-foreground">{meeting.date} • {Math.floor(meeting.duration / 60)}:{(meeting.duration % 60).toString().padStart(2, "0")}</p>
                            {meeting.summary && <p className="text-xs text-accent/70 truncate mt-0.5">{meeting.summary.slice(0, 60)}...</p>}
                          </div>
                        </div>
                        <div className="flex items-center gap-0.5">
                          <button
                            onClick={(e) => { e.stopPropagation(); setEditingMeetingId(meeting.id); setEditingTitle(meeting.title); }}
                            className="rounded-lg p-2 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                            title={t(lang, "meeting.rename")}
                          >
                            <FileText className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); setPlaybackMeeting(meeting); setPlaybackSeconds(0); setIsPlaying(false); if (playbackTimerRef.current) clearInterval(playbackTimerRef.current); }}
                            className="rounded-lg p-2 text-accent hover:bg-accent/10 transition-colors"
                          >
                            <Play className="h-4 w-4" />
                          </button>
                          {/* Export as TXT */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const mins = Math.floor(meeting.duration / 60);
                              const secs = (meeting.duration % 60).toString().padStart(2, "0");
                              let content = `${meeting.title}\n`;
                              content += `${"─".repeat(40)}\n`;
                              content += `${t(lang, "meeting.export_date")}: ${meeting.date}\n`;
                              content += `${t(lang, "meeting.export_duration")}: ${mins}:${secs}\n\n`;
                              if (meeting.summary) { content += `${t(lang, "meeting.summary_label")}\n${meeting.summary}\n\n`; }
                              if (meeting.notes) { content += `${t(lang, "meeting.notes_label")}\n${meeting.notes}\n`; }
                              const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
                              const url = URL.createObjectURL(blob);
                              const a = document.createElement("a");
                              a.href = url; a.download = `${meeting.title.replace(/\s+/g, "_")}.txt`; a.click();
                              URL.revokeObjectURL(url);
                              toast.success(t(lang, "meeting.exported"));
                            }}
                            className="rounded-lg p-2 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                            title={t(lang, "meeting.export_txt")}
                          >
                            <Download className="h-3.5 w-3.5" />
                          </button>
                          {/* Share */}
                          <button
                            onClick={async (e) => {
                              e.stopPropagation();
                              const mins = Math.floor(meeting.duration / 60);
                              const secs = (meeting.duration % 60).toString().padStart(2, "0");
                              let text = `${meeting.title}\n${t(lang, "meeting.export_duration")}: ${mins}:${secs}\n`;
                              if (meeting.summary) text += `\n${meeting.summary}`;
                              if (meeting.notes) text += `\n\n${t(lang, "meeting.notes_label")}:\n${meeting.notes}`;
                              if (navigator.share) {
                                try { await navigator.share({ title: meeting.title, text }); } catch {}
                              } else {
                                await navigator.clipboard.writeText(text);
                                toast.success(t(lang, "meeting.copied"));
                              }
                            }}
                            className="rounded-lg p-2 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                            title={t(lang, "meeting.share")}
                          >
                            <Share2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const updated = savedMeetings.filter(m => m.id !== meeting.id);
                              setSavedMeetings(updated);
                              localStorage.setItem("erfanai_meetings", JSON.stringify(updated));
                              if (playbackMeeting?.id === meeting.id) { setPlaybackMeeting(null); setIsPlaying(false); if (playbackTimerRef.current) clearInterval(playbackTimerRef.current); }
                              if (viewingMeeting?.id === meeting.id) setViewingMeeting(null);
                              toast(t(lang, "meeting.deleted"));
                            }}
                            className="rounded-lg p-2 text-muted-foreground hover:text-destructive transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>

            {/* Bottom input - active after recording stops */}
            <div className="border-t border-border p-4">
              {meetingState === "stopped" ? (
                <div className="rounded-2xl border border-border bg-card p-3 space-y-2">
                  <textarea
                    value={meetingNotes}
                    onChange={e => setMeetingNotes(e.target.value)}
                    placeholder={t(lang, "meeting.notes_placeholder")}
                    rows={2}
                    className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none resize-none"
                  />
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">{t(lang, "meeting.notes_hint")}</p>
                    <button
                      onClick={() => {
                        if (!meetingNotes.trim()) return;
                        // Save notes to latest meeting
                        if (savedMeetings.length > 0) {
                          const updated = savedMeetings.map((m, i) => i === 0 ? { ...m, notes: meetingNotes } : m);
                          setSavedMeetings(updated);
                          localStorage.setItem("erfanai_meetings", JSON.stringify(updated));
                        }
                        toast.success(t(lang, "meeting.notes_saved"));
                      }}
                      className="flex items-center gap-1.5 rounded-xl bg-accent text-accent-foreground px-4 py-2 text-xs font-semibold hover:bg-accent/90 transition-colors"
                    >
                      <Save className="h-3.5 w-3.5" />
                      {t(lang, "meeting.save_notes")}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-border bg-secondary/50 p-4 opacity-60">
                  <p className="text-sm text-muted-foreground mb-3">
                    {meetingState === "recording" || meetingState === "paused" ? t(lang, "meeting.recording_progress_edit") : t(lang, "meeting.start_to_capture")}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="rounded-full border border-border p-2"><Plus className="h-4 w-4 text-muted-foreground" /></div>
                      <div className="rounded-full border border-border p-2"><SlidersHorizontal className="h-4 w-4 text-muted-foreground" /></div>
                      <div className="rounded-full border border-border p-2"><Sparkles className="h-4 w-4 text-muted-foreground" /></div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="rounded-full border border-border p-2"><Mic className="h-4 w-4 text-muted-foreground" /></div>
                      <div className="rounded-full border border-border bg-secondary p-2"><Send className="h-4 w-4 text-muted-foreground" /></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Recording pulse indicator */}
            {meetingState === "recording" && (
              <motion.div
                className="absolute top-14 left-1/2 -translate-x-1/2 flex items-center gap-2 rounded-full bg-destructive/10 border border-destructive/30 px-4 py-1.5"
                animate={{ opacity: [1, 0.6, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <div className="h-2 w-2 rounded-full bg-destructive" />
                <span className="text-xs font-medium text-destructive">{t(lang, "meeting.recording_label")}</span>
              </motion.div>
            )}

            {/* Paused indicator */}
            {meetingState === "paused" && (
              <motion.div
                className="absolute top-14 left-1/2 -translate-x-1/2 flex items-center gap-2 rounded-full bg-accent/10 border border-accent/30 px-4 py-1.5"
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Pause className="h-3 w-3 text-accent" />
                <span className="text-xs font-medium text-accent">{t(lang, "meeting.paused_label")}</span>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ═══════════════════════ MAIN EXPORT ═══════════════════════ */
const ErfanReplica = () => {
  const [screen, setScreen] = useState<"landing" | "login" | "app">("landing");
  const [lang, setLangState] = useState<Lang>(() => {
    try {
      const s = localStorage.getItem(SETTINGS_KEY);
      if (s) return JSON.parse(s).language || "العربية";
    } catch {}
    return "العربية";
  });

  const setLang = (l: Lang) => {
    setLangState(l);
    document.documentElement.dir = isRTL(l) ? "rtl" : "ltr";
  };

  return (
    <LangContext.Provider value={{ lang, setLang }}>
      <AnimatePresence mode="wait">
        {screen === "landing" && (
          <motion.div key="landing" exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
            <LandingPage onLogin={() => setScreen("login")} onRegister={() => setScreen("login")} />
          </motion.div>
        )}
        {screen === "login" && (
          <motion.div key="login" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
            <LoginScreen onLogin={() => setScreen("app")} />
          </motion.div>
        )}
        {screen === "app" && (
          <motion.div key="app" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
            <AppScreen onLogout={() => setScreen("landing")} />
          </motion.div>
        )}
      </AnimatePresence>
    </LangContext.Provider>
  );
};

export default ErfanReplica;
