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

/* ═══════════════════════ NOTIFICATIONS PANEL ═══════════════════════ */
const NotificationsPanel = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const { lang } = useLang();
  const dir = isRTL(lang) ? "rtl" : "ltr";
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 z-40" />
          <motion.div initial={{ opacity: 0, y: -10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -10, scale: 0.95 }} transition={{ duration: 0.2 }} className="absolute left-14 top-[60px] z-50 w-72 rounded-2xl border border-border bg-card shadow-2xl overflow-hidden" dir={dir}>
            <div className="flex items-center justify-between p-4 border-b border-border">
              <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X className="h-4 w-4" /></button>
              <h3 className="text-sm font-bold text-foreground">{t(lang, "notif.title")}</h3>
            </div>
            <div className="p-6 text-center">
              <Bell className="mx-auto h-8 w-8 text-muted-foreground/40 mb-2" />
              <p className="text-sm text-muted-foreground">{t(lang, "notif.empty")}</p>
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
                      <button onClick={() => toast(t(lang, "upgrade_page"))} className="rounded-full bg-accent px-4 py-1.5 text-xs font-semibold text-accent-foreground hover:brightness-110 transition-all">{t(lang, "profile.upgrade")}</button>
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
const ProfileDropdown = ({ isOpen, onClose, onLogout, onOpenSettings, onOpenProfile }: { isOpen: boolean; onClose: () => void; onLogout: () => void; onOpenSettings: () => void; onOpenProfile: () => void }) => {
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
                <button onClick={() => { toast(t(lang, "upgrade_page")); onClose(); }} className="rounded-full border border-border bg-foreground px-4 py-1 text-xs font-semibold text-background hover:opacity-90 transition-opacity">{t(lang, "profile.upgrade")}</button>
                <span className="text-sm font-bold text-foreground">{t(lang, "profile.free")}</span>
              </div>
              <div className="border-t border-dashed border-border" />
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

            <div className="px-2">
              <button onClick={() => { toast(t(lang, "coming_soon")); onClose(); }} className={`flex w-full items-center ${isRTL(lang) ? "justify-end" : "justify-start"} gap-3 rounded-lg px-3 py-3 text-sm text-foreground hover:bg-secondary transition-colors`}>
                {!isRTL(lang) && <BookOpen className="h-5 w-5 text-muted-foreground" />}
                <span>{t(lang, "profile.knowledge")}</span>
                {isRTL(lang) && <BookOpen className="h-5 w-5 text-muted-foreground" />}
              </button>
              <div className="mx-3 border-t border-border" />
              <button onClick={() => { toast(t(lang, "coming_soon")); onClose(); }} className={`flex w-full items-center ${isRTL(lang) ? "justify-end" : "justify-start"} gap-3 rounded-lg px-3 py-3 text-sm text-foreground hover:bg-secondary transition-colors`}>
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
              <button onClick={() => { toast(t(lang, "coming_soon")); onClose(); }} className="flex w-full items-center justify-between rounded-lg px-3 py-3 text-sm text-foreground hover:bg-secondary transition-colors">
                <ExternalLink className="h-4 w-4 text-muted-foreground" />
                <div className="flex items-center gap-3">
                  <span>{t(lang, "profile.home")}</span>
                  <Home className="h-5 w-5 text-muted-foreground" />
                </div>
              </button>
              <button onClick={() => { toast(t(lang, "coming_soon")); onClose(); }} className="flex w-full items-center justify-between rounded-lg px-3 py-3 text-sm text-foreground hover:bg-secondary transition-colors">
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

/* ═══════════════════════ APP SCREEN ═══════════════════════ */
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
  const [currentModel, setCurrentModel] = useState(() => loadSettings().defaultModel || "ErfanAI Lite");
  const [inputValue, setInputValue] = useState("");
  const [activeChips, setActiveChips] = useState<string[]>([]);
  const [isPlusMenuOpen, setIsPlusMenuOpen] = useState(false);
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

  useState(() => {
    const s = loadSettings();
    applyTheme(s.theme);
    applyFontSize(s.fontSize);
  });

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

  const handleMic = () => {
    if (isRecording) {
      setIsRecording(false);
      toast(t(lang, "app.recording_stopped"));
    } else {
      setIsRecording(true);
      toast(t(lang, "app.recording"), { duration: 2000 });
      setTimeout(() => setIsRecording(false), 3000);
    }
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
          <button onClick={() => setIsNotificationsOpen(true)} className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"><Bell className="h-5 w-5" /></button>
          <button onClick={() => toast(`✨ ${t(lang, "coming_soon")}`)} className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"><Sparkles className="h-5 w-5" /></button>
          <button onClick={() => setIsProfileOpen(true)} className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground transition-transform hover:scale-105">E</button>
        </div>
      </motion.header>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-4 pb-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mt-4 flex items-center justify-center">
          <div className="flex items-center gap-4 rounded-full border border-border bg-card px-5 py-2.5">
            <span className="text-sm text-muted-foreground">{t(lang, "app.free_plan")}</span>
            <button onClick={() => toast(t(lang, "coming_soon"))} className="rounded-full bg-accent px-4 py-1.5 text-xs font-semibold text-accent-foreground transition-all hover:brightness-110 active:scale-95">{t(lang, "app.start_trial")}</button>
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
              <button onClick={() => toast(t(lang, "coming_soon"))} className="rounded-lg p-2 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"><SlidersHorizontal className="h-[18px] w-[18px]" /></button>
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
            <button onClick={() => toast(t(lang, "coming_soon"))} className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary hover:border-accent active:scale-95">
              <MoreHorizontal className="h-4 w-4 text-accent" />
              {t(lang, "chip.more")}
            </button>
          </motion.div>
        )}

        {/* Bottom Customize Card */}
        {messages.length === 0 && (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="mt-6 card-gold-border overflow-hidden rounded-2xl bg-card cursor-pointer hover:bg-secondary transition-colors active:scale-[0.98]" onClick={() => toast(t(lang, "coming_soon"))}>
            <div className="flex items-center gap-4 p-5">
              <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-xl bg-secondary gap-1">
                <LayoutGrid className="h-6 w-6 text-accent" />
                <div className="flex flex-col gap-0.5">
                  <div className="h-[2px] w-8 rounded-full bg-muted-foreground/40" />
                  <div className="h-[2px] w-6 rounded-full bg-muted-foreground/30" />
                </div>
              </div>
              <p className="text-sm font-semibold text-foreground leading-relaxed">
                {t(lang, "app.customize")} <span className="text-accent">ErfanAI</span> {t(lang, "app.your")}
              </p>
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
      <ProfileDropdown isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} onLogout={onLogout} onOpenSettings={() => setIsSettingsOpen(true)} />
      <NotificationsPanel isOpen={isNotificationsOpen} onClose={() => setIsNotificationsOpen(false)} />
      <ModelSelector isOpen={isModelSelectorOpen} onClose={() => setIsModelSelectorOpen(false)} currentModel={currentModel} onSelect={(m) => { setCurrentModel(m); toast(`${t(lang, "model.switched_to")} ${m}`); }} />
      <SettingsPanel isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} onChangeModel={(m) => setCurrentModel(m)} onClearHistory={() => { setMessages([]); setActiveChips([]); }} onLogout={onLogout} currentModel={currentModel} />
      <SearchConversationsPanel isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} messages={messages} onSelectMessage={(msg) => { setInputValue(msg); }} />
      <DiscoverPanel isOpen={isDiscoverOpen} onClose={() => setIsDiscoverOpen(false)} onUseTemplate={(prompt) => { setInputValue(prompt); }} />
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
