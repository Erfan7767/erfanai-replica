import { useState, useEffect, useRef, createContext, useContext, useCallback, useMemo } from "react";
import { useConversations, type ChatMessage as DBChatMsg } from "@/hooks/useConversations";
import { useCredits } from "@/hooks/useCredits";
import { usePlan, type PlanTier } from "@/hooks/usePlan";

const PLAN_LABELS: Record<PlanTier, { ar: string; en: string }> = {
  free: { ar: "الخطة المجانية", en: "Free Plan" },
  pro: { ar: "خطة Pro", en: "Pro Plan" },
  plus: { ar: "خطة Plus", en: "Plus Plan" },
  max: { ar: "خطة Max", en: "Max Plan" },
};
const planLabel = (tier: PlanTier, lang: any) =>
  isRTL(lang) ? PLAN_LABELS[tier].ar : PLAN_LABELS[tier].en;
import { useKnowledge } from "@/hooks/useKnowledge";
import { useMeetings } from "@/hooks/useMeetings";
import { useScheduledTasks } from "@/hooks/useScheduledTasks";
import { useSettings, type UserSettings } from "@/hooks/useSettings";
import { useProjects } from "@/hooks/useProjects";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import ErfanAILogo from "@/components/ErfanAILogo";
import AgentWorkPanel, { type AgentTodo, type AgentEvent, type AgentRole } from "@/components/AgentWorkPanel";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { type Lang, t, isRTL } from "@/lib/translations";
import { useAuth } from "@/contexts/AuthContext";
import {
  Hand, Mail, Menu, X, Plus, Search, Bot, Upload, Mic, Globe,
  ArrowLeft, Settings, LogOut, Sparkles, Zap, MessageSquare, Bell,
  ChevronDown, SlidersHorizontal, Code, Presentation, Smartphone,
  Palette, MoreHorizontal, LayoutGrid, Send, ArrowRightLeft,
  HelpCircle, Home, ExternalLink, User, BookOpen, ChevronLeft,
  ArrowRight, Upload as UploadIcon, Camera, Image, FileText, Copy,
  Share2, Trash2, Volume2, VolumeX, Download, Check, Loader2, Terminal, Pencil,
  CalendarCheck, Target, Table, BarChart3, Play, AudioLines, MessageCircle, BookCopy, Clock, Pause, RotateCcw, Save,
  Moon, Sun, Monitor, Plug, ChevronsUpDown, ArrowUpRight,
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
    <div className="relative flex min-h-screen flex-col font-cairo gradient-bg-light noise-overlay" dir={dir}>
      {/* Decorative gradient orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-32 -right-32 h-96 w-96 rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, hsl(43 80% 60%), transparent 70%)" }}
          animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full opacity-15"
          style={{ background: "radial-gradient(circle, hsl(142 71% 50%), transparent 70%)" }}
          animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
      </div>

      <header className="relative z-10 flex items-center justify-between px-5 py-4">
        <div className="flex items-center gap-2.5">
          <motion.div animate={{ rotate: [0, 5, -5, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}>
            <ErfanAILogo className="h-11 w-11" color="#1a1a1a" />
          </motion.div>
          <span className="text-xl font-extrabold tracking-tight" style={{ color: "#1a1a1a" }}>ErfanAI</span>
        </div>
        <div className="flex items-center gap-2.5">
          <button onClick={onLogin} className="rounded-xl px-5 py-2.5 text-sm font-semibold transition-all hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]" style={{ background: "linear-gradient(135deg, #1a1a1a, #333)", color: "#fff" }}>{t(lang, "landing.login")}</button>
          <button onClick={onRegister} className="rounded-xl border px-5 py-2.5 text-sm font-medium transition-all hover:bg-white/80 hover:shadow-md hover:scale-[1.02] active:scale-[0.98] backdrop-blur-sm" style={{ borderColor: "#d4d4d4", color: "#525252", background: "hsl(0 0% 100% / 0.5)" }}>{t(lang, "landing.register")}</button>
          <button className="p-2.5 transition-all hover:bg-white/60 rounded-xl" style={{ color: "#525252" }} onClick={() => setIsMenuOpen(true)}><Menu className="h-5 w-5" /></button>
        </div>
        <LandingMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} onLogin={onLogin} />
      </header>

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 pb-10">
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1, type: "spring", stiffness: 200 }} className="mb-6 animate-float">
          <ErfanAILogo className="h-20 w-20" color="#1a1a1a" />
        </motion.div>
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-2 text-center text-3xl font-extrabold leading-relaxed gradient-hero">{t(lang, "landing.how_can_i_help")}</motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }} className="mb-8 text-center text-sm" style={{ color: "#737373" }}>
          {t(lang, "landing.subtitle") || "ذكاء اصطناعي متقدم لمساعدتك في كل شيء"}
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="w-full max-w-lg rounded-2xl p-4 shadow-xl glass-light animate-border-glow hover-lift" style={{ borderColor: "hsl(43 80% 55% / 0.2)" }}>
          <textarea value={landingInput} onChange={(e) => setLandingInput(e.target.value)} placeholder={t(lang, "landing.input_placeholder")} rows={3} className="w-full resize-none bg-transparent text-sm outline-none leading-relaxed placeholder:text-gray-400" style={{ color: "#1a1a1a" }} dir={dir} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleLandingSend(); } }} />
          {landingFiles.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {landingFiles.map((file, i) => (
                <div key={i} className="flex items-center gap-1.5 rounded-lg border px-2 py-1 text-xs backdrop-blur-sm" style={{ borderColor: "#d4d4d4", color: "#525252", background: "hsl(0 0% 100% / 0.5)" }}>
                  {file.type.startsWith("image/") ? <Image className="h-3.5 w-3.5" /> : <FileText className="h-3.5 w-3.5" />}
                  <span className="max-w-[100px] truncate">{file.name}</span>
                  <button onClick={() => setLandingFiles(prev => prev.filter((_, idx) => idx !== i))} className="hover:text-red-500"><X className="h-3 w-3" /></button>
                </div>
              ))}
            </div>
          )}
          <div className="mt-3 flex items-center justify-between">
            <motion.button onClick={handleLandingSend} disabled={!landingInput.trim() && landingFiles.length === 0} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex h-10 w-10 items-center justify-center rounded-full transition-all disabled:opacity-30 shadow-lg" style={{ background: "linear-gradient(135deg, hsl(43 80% 50%), hsl(43 70% 45%))", color: "#fff" }}><Send className="h-4 w-4" /></motion.button>
            <div className="flex items-center gap-2">
              <button onClick={() => landingFileRef.current?.click()} className="flex h-9 w-9 items-center justify-center rounded-full border transition-all hover:bg-white/80 hover:shadow-sm active:scale-95" style={{ borderColor: "#d4d4d4", color: "#a3a3a3" }}><UploadIcon className="h-4 w-4" /></button>
              <button onClick={() => landingFileRef.current?.click()} className="flex h-9 w-9 items-center justify-center rounded-full border transition-all hover:bg-white/80 hover:shadow-sm active:scale-95" style={{ borderColor: "#d4d4d4", color: "#a3a3a3" }}><Plus className="h-4 w-4" /></button>
            </div>
          </div>
          <input ref={landingFileRef} type="file" className="hidden" multiple onChange={handleLandingFileSelect} />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="mt-6 flex flex-wrap justify-center gap-2.5">
          {chipItems.map((chip, i) => (
            <motion.button key={chip.key} onClick={() => handleChipClick(t(lang, chip.key))} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + i * 0.06 }} whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.96 }} className="flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium transition-all backdrop-blur-sm shadow-sm hover:shadow-md" style={{ borderColor: "hsl(43 80% 55% / 0.25)", color: "#525252", background: "hsl(0 0% 100% / 0.6)" }}>
              <chip.icon className="h-4 w-4" style={{ color: "hsl(43 80% 45%)" }} />
              {t(lang, chip.key)}
            </motion.button>
          ))}
        </motion.div>
      </div>

      {/* Footer */}
      <motion.footer initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="relative z-10 pb-4 text-center">
        <p className="text-xs" style={{ color: "#a3a3a3" }}>© 2026 ErfanAI — Powered by Advanced AI</p>
      </motion.footer>
    </div>
  );
};

/* ═══════════════════════ LOGIN SCREEN ═══════════════════════ */
const LoginScreen = ({ onLogin }: { onLogin: () => void }) => {
  const { lang } = useLang();
  const dir = isRTL(lang) ? "rtl" : "ltr";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, signUp, signInWithGoogle, signInWithApple, resetPassword } = useAuth();

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      toast.error(t(lang, "login.enter_email_for_reset"));
      return;
    }
    setIsLoading(true);
    const { error } = await resetPassword(email);
    setIsLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success(t(lang, "login.reset_link_sent"));
    }
  };

  const handleEmailAuth = async () => {
    if (!email.trim()) {
      toast.error(t(lang, "login.enter_email"));
      return;
    }
    if (!password.trim() || password.length < 6) {
      toast.error(t(lang, "login.enter_password"));
      return;
    }
    setIsLoading(true);
    try {
      if (isSignUp) {
        const { error } = await signUp(email, password);
        if (error) {
          toast.error(error.message);
        } else {
          // Auto-confirm is enabled, so user is logged in immediately
          toast.success(t(lang, "login.sign_up_success") || "تم إنشاء الحساب بنجاح!");
        }
      } else {
        const { error } = await signIn(email, password);
        if (error) {
          if (error.message.includes("Invalid login credentials")) {
            toast.error(t(lang, "login.invalid_credentials") || "البريد الإلكتروني أو كلمة المرور غير صحيحة");
          } else {
            toast.error(error.message);
          }
        }
      }
    } catch (e: any) {
      toast.error(e.message || "حدث خطأ غير متوقع");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    const { error } = await signInWithGoogle();
    if (error) toast.error(error.message);
    setIsLoading(false);
  };

  const handleAppleLogin = async () => {
    setIsLoading(true);
    const { error } = await signInWithApple();
    if (error) toast.error(error.message);
    setIsLoading(false);
  };

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden font-cairo gradient-bg-dark noise-overlay" dir={dir}>
      <div className="dot-pattern absolute inset-0 opacity-5" />
      {/* Decorative gradient orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 right-10 h-72 w-72 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, hsl(43 80% 55%), transparent 70%)" }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.08, 0.15, 0.08] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 left-10 h-60 w-60 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, hsl(142 71% 50%), transparent 70%)" }}
          animate={{ scale: [1, 1.15, 1], opacity: [0.05, 0.12, 0.05] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
      </div>

      <header className="relative z-10 flex items-center justify-end px-5 py-4">
        <div className="flex items-center gap-2.5">
          <span className="text-lg font-bold" style={{ color: "#e5e5e5" }}>ErfanAI</span>
          <motion.div animate={{ rotate: [0, 5, -5, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}>
            <ErfanAILogo className="h-11 w-11" color="#e5e5e5" />
          </motion.div>
        </div>
      </header>

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, type: "spring", stiffness: 100 }} className="flex w-full max-w-md flex-col items-center">
          <motion.div className="mb-8 flex h-28 w-28 items-center justify-center animate-pulse-glow rounded-full" style={{ background: "hsl(0 0% 8%)" }}>
            <ErfanAILogo className="h-24 w-24" color="#f5f5f5" />
          </motion.div>

          <h1 className="mb-2 text-2xl font-extrabold gradient-hero">{t(lang, "login.title")}</h1>
          <p className="mb-10 text-sm text-center" style={{ color: "#737373" }}>
            {t(lang, "login.subtitle")} <span className="font-semibold" style={{ color: "hsl(43 80% 55%)" }}>ErfanAI</span>
          </p>

          <div className="flex w-full flex-col gap-3">
            <motion.button onClick={handleGoogleLogin} disabled={isLoading} whileHover={{ scale: 1.01, y: -1 }} whileTap={{ scale: 0.98 }} className="flex w-full items-center justify-center gap-3 rounded-xl py-4 text-sm font-medium transition-all glass hover:border-white/15 disabled:opacity-50 shadow-lg">
              <span style={{ color: "#e5e5e5" }}>{t(lang, "login.continue_google")}</span>
              <svg className="h-5 w-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
            </motion.button>
            <motion.button onClick={handleAppleLogin} disabled={isLoading} whileHover={{ scale: 1.01, y: -1 }} whileTap={{ scale: 0.98 }} className="flex w-full items-center justify-center gap-3 rounded-xl py-4 text-sm font-medium transition-all glass hover:border-white/15 disabled:opacity-50 shadow-lg">
              <span style={{ color: "#e5e5e5" }}>{t(lang, "login.continue_apple")}</span>
              <svg className="h-5 w-5" fill="#e5e5e5" viewBox="0 0 24 24"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" /></svg>
            </motion.button>
          </div>

          <div className="my-7 flex w-full items-center gap-3">
            <div className="h-px flex-1" style={{ background: "linear-gradient(90deg, transparent, hsl(43 80% 55% / 0.3), transparent)" }} />
            <span className="text-sm" style={{ color: "#737373" }}>{t(lang, "login.or")}</span>
            <div className="h-px flex-1" style={{ background: "linear-gradient(90deg, transparent, hsl(43 80% 55% / 0.3), transparent)" }} />
          </div>

          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t(lang, "login.email_placeholder")} className="w-full rounded-xl px-4 py-4 text-sm outline-none transition-all glass focus-ring-accent" style={{ color: "#e5e5e5" }} dir={dir} />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder={t(lang, "login.password_placeholder")} className="mt-3 w-full rounded-xl px-4 py-4 text-sm outline-none transition-all glass focus-ring-accent" style={{ color: "#e5e5e5" }} dir={dir} onKeyDown={(e) => { if (e.key === "Enter") handleEmailAuth(); }} />
          {!isSignUp && (
            <button onClick={handleForgotPassword} disabled={isLoading} className="mt-2 self-start text-xs transition-all hover:opacity-80" style={{ color: "hsl(43 80% 55%)" }}>
              {t(lang, "login.forgot_password")}
            </button>
          )}
          <motion.button onClick={handleEmailAuth} disabled={isLoading} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} className="mt-5 w-full rounded-xl py-4 text-sm font-semibold transition-all disabled:opacity-50 shadow-lg" style={{ background: "linear-gradient(135deg, hsl(43 80% 50%), hsl(43 70% 40%))", color: "#fff" }}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : isSignUp ? t(lang, "login.sign_up") : t(lang, "login.continue")}
          </motion.button>
          <button onClick={() => setIsSignUp(!isSignUp)} className="mt-4 text-sm transition-colors hover:opacity-80" style={{ color: "#737373" }}>
            {isSignUp ? t(lang, "login.have_account") : t(lang, "login.no_account")}
          </button>
        </motion.div>
      </div>
    </div>
  );
};

/* ═══════════════════════ SIDEBAR USER INFO ═══════════════════════ */
const SidebarUserInfo = () => {
  const { lang } = useLang();
  const { user } = useAuth();
  const { plan } = usePlan();
  const displayName = user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split("@")[0] || "User";
  const avatarUrl = user?.user_metadata?.avatar_url || user?.user_metadata?.picture || null;
  return (
    <>
      {avatarUrl ? (
        <img src={avatarUrl} alt={displayName} className="h-9 w-9 rounded-full object-cover" />
      ) : (
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">{displayName.charAt(0).toUpperCase()}</div>
      )}
      <div>
        <p className="text-sm font-semibold text-foreground">{displayName}</p>
        <p className="text-xs text-muted-foreground">{planLabel(plan.tier, lang)}</p>
      </div>
    </>
  );
};

/* ═══════════════════════ SIDEBAR ═══════════════════════ */
const Sidebar = ({ isOpen, onClose, onNewTask, onNavigate, conversations, onSelectConversation, onDeleteConversation, onRenameConversation }: { isOpen: boolean; onClose: () => void; onNewTask: () => void; onNavigate: (page: string) => void; conversations?: { id: string; title: string; updated_at: string }[]; onSelectConversation?: (id: string) => void; onDeleteConversation?: (id: string) => void; onRenameConversation?: (id: string, title: string) => void }) => {
  const { lang } = useLang();
  const dir = isRTL(lang) ? "rtl" : "ltr";
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const editInputRef = useRef<HTMLInputElement>(null);

  const handleStartRename = (conv: { id: string; title: string }) => {
    setEditingId(conv.id);
    setEditTitle(conv.title);
    setTimeout(() => editInputRef.current?.focus(), 50);
  };

  const handleSaveRename = () => {
    if (editingId && editTitle.trim()) {
      onRenameConversation?.(editingId, editTitle.trim());
      toast.success(t(lang, "profile.saved"));
    }
    setEditingId(null);
    setEditTitle("");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 z-40" style={{ background: "hsl(0 0% 0% / 0.7)" }} />
          <motion.div initial={{ x: isRTL(lang) ? "100%" : "-100%" }} animate={{ x: 0 }} exit={{ x: isRTL(lang) ? "100%" : "-100%" }} transition={{ type: "spring", damping: 25, stiffness: 300 }} className={`fixed ${isRTL(lang) ? "right-0" : "left-0"} top-0 z-50 flex h-full w-80 flex-col glass ${isRTL(lang) ? "border-l" : "border-r"} border-border/40 overflow-hidden`} dir={dir}>
            {/* Aurora glow */}
            <div className="pointer-events-none absolute inset-0 opacity-60" style={{ background: "radial-gradient(circle at 50% -10%, hsl(var(--erfan-gold) / 0.18), transparent 55%), radial-gradient(circle at 0% 100%, hsl(var(--erfan-green) / 0.12), transparent 50%)" }} />

            {/* Brand header */}
            <div className="relative flex items-center justify-between px-5 pt-5 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="relative h-9 w-9 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, hsl(var(--erfan-gold)), hsl(var(--erfan-green)))" }}>
                  <Sparkles className="h-4.5 w-4.5 text-background" strokeWidth={2.5} />
                  <div className="absolute inset-0 rounded-xl animate-pulse-glow" />
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="text-base font-bold text-foreground">ErfanAI</span>
                  <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">workspace</span>
                </div>
              </div>
              <button onClick={onClose} className="rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors"><X className="h-4.5 w-4.5" /></button>
            </div>

            {/* Primary CTA */}
            <div className="relative px-4 pb-3">
              <button onClick={() => { onNewTask(); onClose(); }} className="group relative flex w-full items-center gap-3 overflow-hidden rounded-2xl px-4 py-3 text-sm font-semibold text-background transition-all hover:scale-[1.02] active:scale-[0.98]" style={{ background: "linear-gradient(135deg, hsl(var(--erfan-gold)), hsl(var(--erfan-gold) / 0.85))" }}>
                <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-background/20"><Plus className="h-4 w-4" /></div>
                <span className="flex-1 text-start">{t(lang, "sidebar.new_task")}</span>
                <kbd className="rounded-md bg-background/20 px-1.5 py-0.5 text-[10px] font-mono">⌘N</kbd>
              </button>
            </div>

            {/* Quick nav */}
            <div className="relative px-3">
              <p className="px-3 pb-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground/70">{t(lang, "sidebar.discover")}</p>
              <nav className="grid grid-cols-3 gap-1.5">
                {[
                  { icon: Bot, labelKey: "sidebar.agents", action: "agents" },
                  { icon: Search, labelKey: "sidebar.search", action: "search" },
                  { icon: Sparkles, labelKey: "sidebar.discover", action: "discover" },
                ].map((item) => (
                  <button key={item.labelKey} onClick={() => { onNavigate(item.action); onClose(); }} className="group flex flex-col items-center gap-1.5 rounded-xl border border-border/40 bg-card/40 px-2 py-3 text-[11px] font-medium text-muted-foreground transition-all hover:border-accent/50 hover:bg-card/80 hover:text-foreground">
                    <item.icon className="h-4 w-4 text-accent group-hover:scale-110 transition-transform" />
                    <span className="truncate">{t(lang, item.labelKey)}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Conversation History */}
            {conversations && conversations.length > 0 && (
              <div className="relative mt-4 flex-1 overflow-y-auto px-3 pb-3">
                <div className="sticky top-0 z-10 flex items-center justify-between px-3 py-2 backdrop-blur-md bg-background/60">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground/70">{t(lang, "sidebar.chats")}</p>
                  <span className="text-[10px] font-medium text-muted-foreground/60">{conversations.length}</span>
                </div>
                <div className="space-y-0.5">
                  {conversations.map((conv) => (
                    <div key={conv.id} className="group relative flex items-center gap-1">
                      {editingId === conv.id ? (
                        <div className="flex-1 flex items-center gap-1 px-2">
                          <input
                            ref={editInputRef}
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            onKeyDown={(e) => { if (e.key === "Enter") handleSaveRename(); if (e.key === "Escape") { setEditingId(null); setEditTitle(""); } }}
                            onBlur={handleSaveRename}
                            className="flex-1 rounded-lg border border-accent bg-secondary px-2.5 py-1.5 text-sm text-foreground outline-none focus:ring-1 focus:ring-accent"
                            dir={dir}
                          />
                        </div>
                      ) : (
                        <>
                          <span className={`absolute ${isRTL(lang) ? "right-1" : "left-1"} top-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-accent/0 group-hover:bg-accent transition-colors`} />
                          <button
                            onClick={() => { onSelectConversation?.(conv.id); onClose(); }}
                            className={`flex-1 truncate rounded-lg ${isRTL(lang) ? "pr-5 pl-3" : "pl-5 pr-3"} py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-card/60 transition-colors text-start`}
                          >
                            <span className="truncate block">{conv.title}</span>
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleStartRename(conv); }}
                            className="opacity-0 group-hover:opacity-100 p-1.5 text-muted-foreground hover:text-accent transition-all rounded-lg hover:bg-accent/10"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); onDeleteConversation?.(conv.id); }}
                            className="opacity-0 group-hover:opacity-100 p-1.5 text-muted-foreground hover:text-destructive transition-all rounded-lg hover:bg-destructive/10"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {!conversations || conversations.length === 0 ? <div className="flex-1" /> : null}
            <div className="relative border-t border-border/40 p-3 backdrop-blur-md bg-card/30">
              <div className="flex items-center gap-3">
                <SidebarUserInfo />
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

// Categorize a notification into tabs
const notifCategory = (n: Notification): "updates" | "messages" => {
  if (n.type === "update" || n.type === "promo" || n.type === "tip") return "updates";
  return "messages";
};

// Hero gradient per notification type (mimics hero header card)
const notifHeroGradient: Record<string, string> = {
  welcome: "from-sky-200 via-rose-100 to-orange-200",
  update: "from-sky-200 via-rose-100 to-orange-200",
  tip: "from-amber-100 via-yellow-100 to-orange-200",
  promo: "from-fuchsia-200 via-pink-200 to-orange-200",
  security: "from-emerald-100 via-teal-100 to-sky-200",
};

const formatDateGroup = (timestamp: number, lang: Lang): string => {
  const d = new Date(timestamp);
  const locale = isRTL(lang) ? "ar-EG" : "en-US";
  return d.toLocaleDateString(locale, { month: "long", day: "numeric", year: "numeric" });
};

const NotificationsPanel = ({ isOpen, onClose, onUpgrade }: { isOpen: boolean; onClose: () => void; onUpgrade: () => void }) => {
  const { lang } = useLang();
  const rtl = isRTL(lang);
  const dir = rtl ? "rtl" : "ltr";
  const [notifications, setNotifications] = useState<Notification[]>(() => loadNotifications());
  const [tab, setTab] = useState<"all" | "updates" | "messages">("all");

  // Localized labels (inline to avoid touching translations file)
  const L = {
    title: rtl ? "الإشعارات" : "Notifications",
    all: rtl ? "الكل" : "All",
    updates: rtl ? "التحديثات" : "Updates",
    messages: rtl ? "الرسائل" : "Messages",
    empty: rtl ? "لا توجد إشعارات" : "No notifications",
    updatesGroup: rtl ? "تحديثات" : "Updates",
    messagesGroup: rtl ? "رسائل" : "Messages",
  };

  const markRead = (id: string) => {
    const updated = notifications.map(n => n.id === id ? { ...n, read: true } : n);
    setNotifications(updated);
    saveNotifications(updated);
  };

  const handleNotifClick = (notif: Notification) => {
    markRead(notif.id);
    if (notif.type === "promo") { onUpgrade(); onClose(); }
  };

  // Filter by tab
  const filtered = notifications.filter(n => {
    if (tab === "all") return true;
    return notifCategory(n) === tab;
  });

  // Group consecutive notifications by date
  const groups: { key: string; category: "updates" | "messages"; date: string; items: Notification[] }[] = [];
  filtered.forEach((n) => {
    const cat = notifCategory(n);
    const date = formatDateGroup(n.timestamp, lang);
    const key = `${cat}-${date}`;
    const last = groups[groups.length - 1];
    if (last && last.key === key) last.items.push(n);
    else groups.push({ key, category: cat, date, items: [n] });
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] bg-background flex flex-col"
          dir={dir}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Title */}
          <div className="pt-8 pb-4 px-6">
            <h1 className="text-2xl font-bold text-center text-foreground">{L.title}</h1>
          </div>

          {/* Tabs */}
          <div className="flex items-center justify-center gap-1 px-6 pb-2 shrink-0">
            {([
              { id: "all", label: L.all },
              { id: "updates", label: L.updates },
              { id: "messages", label: L.messages },
            ] as const).map((tb) => (
              <button
                key={tb.id}
                onClick={() => setTab(tb.id)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                  tab === tb.id
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tb.label}
              </button>
            ))}
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto px-6 pb-10">
            {groups.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-20">
                <Bell className="h-12 w-12 text-muted-foreground/20 mb-3" />
                <p className="text-sm text-muted-foreground">{L.empty}</p>
              </div>
            ) : (
              <div className="max-w-2xl mx-auto pt-6 space-y-10">
                {groups.map((g) => (
                  <section key={g.key}>
                    <header className="mb-4">
                      <div className="text-base font-bold text-foreground">
                        {g.category === "updates" ? L.updatesGroup : L.messagesGroup}
                      </div>
                      <div className="text-sm text-muted-foreground mt-0.5">{g.date}</div>
                    </header>
                    <div className="divide-y divide-border/60">
                      {g.items.map((notif, i) => {
                        const IconComp = notifIconMap[notif.icon] || Bell;
                        const gradient = notifHeroGradient[notif.type] || notifHeroGradient.update;
                        return (
                          <motion.button
                            key={notif.id}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.04 }}
                            onClick={() => handleNotifClick(notif)}
                            className="block w-full text-start py-5 group"
                          >
                            {/* Hero card */}
                            <div className={`relative w-full aspect-[16/9] rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center overflow-hidden`}>
                              <div className="flex items-center gap-4">
                                <div className="h-14 w-14 rounded-2xl bg-white shadow-md flex items-center justify-center">
                                  <Sparkles className="h-7 w-7 text-foreground/80" />
                                </div>
                                <div className="h-12 w-12 rounded-full bg-foreground/30 backdrop-blur flex items-center justify-center">
                                  <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                                </div>
                                <div className="h-14 w-14 rounded-2xl bg-white shadow-md flex items-center justify-center">
                                  <IconComp className="h-7 w-7 text-primary" />
                                </div>
                              </div>
                              {!notif.read && (
                                <span className="absolute top-3 end-3 h-2.5 w-2.5 rounded-full bg-accent shadow" />
                              )}
                            </div>
                            {/* Title */}
                            <h3 className="mt-4 text-lg font-bold text-foreground leading-snug">
                              {t(lang, notif.titleKey)}
                            </h3>
                            {/* Body */}
                            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                              {t(lang, notif.bodyKey)}
                            </p>
                          </motion.button>
                        );
                      })}
                    </div>
                  </section>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/* ═══════════════════════ MODEL SELECTOR ═══════════════════════ */
const modelData = [
  { id: "ErfanAI Max", label: "ErfanAI 1.6 Max", badge: "Pro", descKey: "model.max_desc", badgeColor: "bg-primary text-primary-foreground", isPro: true },
  { id: "ErfanAI Pro", label: "ErfanAI 1.6", badge: "Pro", descKey: "model.pro_desc", badgeColor: "bg-primary text-primary-foreground", isPro: true },
  { id: "ErfanAI Lite", label: "ErfanAI 1.6 Lite", badge: null, descKey: "model.lite_desc", badgeColor: "", isPro: false },
];

const ModelSelector = ({ isOpen, onClose, currentModel, onSelect, onUpgrade }: { isOpen: boolean; onClose: () => void; currentModel: string; onSelect: (m: string) => void; onUpgrade: () => void }) => {
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
                <button key={model.id} onClick={() => { if (model.isPro) { onClose(); onUpgrade(); } else { onSelect(model.id); onClose(); } }} className={`flex w-full items-center justify-between px-5 py-3.5 transition-colors ${currentModel === model.id ? "bg-secondary/60" : "hover:bg-secondary/40"}`}>
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

type SettingsTab =
  | "account" | "general" | "billing" | "personalization" | "mail"
  | "data" | "computer" | "browser" | "plugins" | "integrations" | "help";

const SettingsPanel = ({ isOpen, onClose, onChangeModel, onClearHistory, onLogout, currentModel }: SettingsPanelProps) => {
  const { lang, setLang } = useLang();
  const rtl = isRTL(lang);
  const dir = rtl ? "rtl" : "ltr";
  const { plan } = usePlan();
  const { usage } = useCredits();
  const { user: settingsUser } = useAuth();
  const settingsDisplayName = settingsUser?.user_metadata?.full_name || settingsUser?.user_metadata?.name || settingsUser?.email?.split("@")[0] || "User";
  const settingsEmail = settingsUser?.email || "";
  const settingsAvatar = settingsUser?.user_metadata?.avatar_url || settingsUser?.user_metadata?.picture || null;
  const settingsInitial = settingsDisplayName.trim().charAt(0).toUpperCase() || "U";
  const userId = settingsUser?.id || "";

  const [activeTab, setActiveTab] = useState<SettingsTab>("account");
  const [settings, setSettingsState] = useState<AppSettings>(loadSettings);
  const [fullName, setFullName] = useState(settingsDisplayName);
  const [computerSub, setComputerSub] = useState<"cloud" | "local">("cloud");
  const [pluginSub, setPluginSub] = useState<"connectors" | "skills" | "data">("connectors");
  const [browserNotif, setBrowserNotif] = useState<boolean>(false);
  const [persistLogin, setPersistLogin] = useState<boolean>(false);
  const [moreOpen, setMoreOpen] = useState(false);

  useEffect(() => { setFullName(settingsDisplayName); }, [settingsDisplayName, isOpen]);
  useEffect(() => { if (isOpen) setMoreOpen(false); }, [isOpen]);

  const updateSetting = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    setSettingsState(prev => { const next = { ...prev, [key]: value }; saveSettings(next); return next; });
  };

  const L = rtl ? {
    title: "الإعدادات", personal: "شخصي", fullName: "الاسم الكامل", free: "مجاني",
    upgrade: "ترقية", credits: "النقاط", freeCredits: "نقاط مجانية",
    dailyRefresh: "نقاط التحديث اليومي", refreshAt: "تتجدد إلى 300 في الساعة 03:06 يوميًا",
    email: "البريد الإلكتروني", userId: "معرّف المستخدم", copy: "نسخ", copied: "تم النسخ",
    appearance: "المظهر", language: "اللغة", theme: "السمة",
    light: "فاتح", dark: "داكن", auto: "تلقائي",
    commPrefs: "تفضيلات التواصل", browserNotif: "إشعارات المتصفح",
    browserNotifDesc: "تلقّى إشعارات في متصفحك عند تحقق تقدم جديد أو اكتمال مهمة.",
    cloudComp: "كمبيوتر سحابي", localComp: "كمبيوتر محلي",
    persistentTitle: "مساحة عمل سحابية دائمة، متاحة على مدار الساعة.",
    persistentDesc: "كمبيوتر سحابي دائم التشغيل مع تخزين دائم — يعمل ويبني في أي وقت.",
    createNow: "إنشاء الآن",
    persistLogin: "الاحتفاظ بحالة تسجيل الدخول عبر المهام",
    learnMore: "اعرف المزيد", cookies: "ملفات تعريف الارتباط وبيانات الموقع الأخرى",
    manage: "إدارة", searchPlugins: "البحث في الموصلات والمهارات ومصادر البيانات",
    connectors: "الموصلات", skills: "المهارات", dataSources: "مصادر البيانات", add: "إضافة",
    pluginsEmpty: "اربط Erfan مع تطبيقاتك اليومية وواجهات API و MCPs",
    addConnectors: "إضافة موصلات",
    buildApi: "البناء باستخدام Erfan API", buildApiDesc: "استخدم Erfan API لبناء تكاملات مخصصة",
    useZapier: "استخدام Erfan في Zapier", useZapierDesc: "اربط Erfan بآلاف التطبيقات عبر Zapier",
    useSlack: "استخدام Erfan في Slack", useSlackDesc: "استخدم @Erfan في Slack لتفويض المهام إلى Erfan",
    telegram: "Telegram", telegramDesc: "راسل مهمتك واحصل على النتائج فورًا",
    tabs: {
      account: "الحساب", general: "عام", billing: "الاستخدام والفوترة",
      personalization: "التخصيص", mail: "بريد Erfan", data: "ضوابط البيانات",
      computer: "جهازي", browser: "متصفح سحابي", plugins: "إضافاتي",
      integrations: "التكاملات", help: "الحصول على مساعدة",
    },
    placeholder: "قريبًا...", emptyPersonalization: "لا توجد تخصيصات بعد.",
    emptyMail: "بريد Erfan غير مفعّل في حسابك.",
    emptyData: "إدارة بياناتك وسجلاتك من هنا (قريبًا).",
    emptyBilling: "تفاصيل الاستخدام والفوترة.",
    plan: "الخطة", remaining: "النقاط المتبقية",
  } : {
    title: "Settings", personal: "Personal", fullName: "Full name", free: "Free",
    upgrade: "Upgrade", credits: "Credits", freeCredits: "Free credits",
    dailyRefresh: "Daily refresh credits", refreshAt: "Refresh to 300 at 03:06 every day",
    email: "Email", userId: "User ID", copy: "Copy", copied: "Copied",
    appearance: "Appearance", language: "Language", theme: "Theme",
    light: "Light", dark: "Dark", auto: "Auto",
    commPrefs: "Communication preferences", browserNotif: "Browser notifications",
    browserNotifDesc: "Get notified in your browser when there's new progress or a task is completed.",
    cloudComp: "Cloud computer", localComp: "Local computer",
    persistentTitle: "Persistent cloud workspace, available 24/7.",
    persistentDesc: "Always-on cloud computer with persistent storage — run and build anytime.",
    createNow: "Create now",
    persistLogin: "Persist login state across tasks",
    learnMore: "Learn more", cookies: "Cookies and other website data",
    manage: "Manage", searchPlugins: "Search connectors, skills, data sources",
    connectors: "Connectors", skills: "Skills", dataSources: "Data sources", add: "Add",
    pluginsEmpty: "Connect Erfan with your everyday apps, APIs and MCPs",
    addConnectors: "Add connectors",
    buildApi: "Build with Erfan API", buildApiDesc: "Use Erfan API to build custom integrations",
    useZapier: "Use Erfan in Zapier", useZapierDesc: "Connect Erfan to thousands of apps with Zapier",
    useSlack: "Use Erfan in Slack", useSlackDesc: "Use @Erfan in Slack to assign tasks to Erfan",
    telegram: "Telegram", telegramDesc: "Message your task, get results delivered instantly",
    tabs: {
      account: "Account", general: "General", billing: "Usage & Billing",
      personalization: "Personalization", mail: "Mail Erfan", data: "Data controls",
      computer: "My Computer", browser: "Cloud browser", plugins: "My plugins",
      integrations: "Integrations", help: "Get help",
    },
    placeholder: "Coming soon...", emptyPersonalization: "No personalization yet.",
    emptyMail: "Mail Erfan is not enabled for your account.",
    emptyData: "Manage your data and history here (coming soon).",
    emptyBilling: "Usage and billing details.",
    plan: "Plan", remaining: "Remaining credits",
  };

  const tabs: { id: SettingsTab; label: string }[] = [
    { id: "account", label: L.tabs.account },
    { id: "general", label: L.tabs.general },
    { id: "billing", label: L.tabs.billing },
    { id: "personalization", label: L.tabs.personalization },
    { id: "mail", label: L.tabs.mail },
    { id: "data", label: L.tabs.data },
    { id: "computer", label: L.tabs.computer },
    { id: "browser", label: L.tabs.browser },
    { id: "plugins", label: L.tabs.plugins },
    { id: "integrations", label: L.tabs.integrations },
    { id: "help", label: L.tabs.help },
  ];

  const Toggle = ({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) => (
    <button onClick={() => onChange(!value)} className={`relative h-6 w-11 rounded-full transition-colors ${value ? "bg-accent" : "bg-muted-foreground/30"}`}>
      <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${value ? "translate-x-[22px]" : "translate-x-0.5"}`} />
    </button>
  );

  const SectionCard: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
    <div className={`rounded-2xl border border-border/60 bg-secondary/40 ${className}`}>{children}</div>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 z-40 bg-black/70" />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 12 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.97, y: 12 }}
            transition={{ type: "spring", damping: 26, stiffness: 320 }}
            className="pointer-events-auto w-[560px] h-[640px] max-w-[calc(100vw-2rem)] max-h-[calc(100vh-2rem)] flex flex-col rounded-2xl border border-border bg-card shadow-2xl overflow-hidden"
            dir={dir}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 pt-5 pb-3">
              <h2 className="text-xl font-bold text-foreground">{L.title}</h2>
              <button onClick={onClose} className="rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Account switcher row */}
            <div className="px-5 pb-3">
              <button className="flex w-full items-center gap-3 rounded-lg p-2 hover:bg-secondary/60 transition-colors">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-base font-bold text-primary-foreground overflow-hidden shrink-0">
                  {settingsAvatar ? <img src={settingsAvatar} alt={settingsDisplayName} className="h-full w-full object-cover" /> : settingsInitial}
                </div>
                <div className="flex-1 min-w-0 text-start">
                  <div className="text-sm font-semibold text-foreground truncate">{settingsDisplayName}</div>
                  <div className="text-xs text-muted-foreground truncate">{L.personal}</div>
                </div>
                <ChevronsUpDown className="h-4 w-4 text-muted-foreground shrink-0" />
              </button>
            </div>

            {/* Tabs (horizontal scroll) + more menu */}
            <div className="relative border-b border-border/60">
              <div className="flex items-stretch gap-5 px-5 overflow-x-auto scrollbar-hide whitespace-nowrap pr-12">
                {tabs.map(tab => {
                  const active = activeTab === tab.id;
                  return (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                      className={`relative py-3 text-sm font-medium transition-colors flex items-center gap-1 ${active ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
                      {tab.id === "help" && <ArrowUpRight className="h-3.5 w-3.5" />}
                      <span>{tab.label}</span>
                      {active && <span className="absolute bottom-0 inset-x-0 h-0.5 bg-foreground rounded-full" />}
                    </button>
                  );
                })}
              </div>
              <button onClick={() => setMoreOpen(v => !v)} className={`absolute top-1/2 -translate-y-1/2 ${rtl ? "left-2" : "right-2"} p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary`}>
                <AlignJustify className="h-4 w-4" />
              </button>
              {moreOpen && (
                <div className={`absolute z-10 top-full mt-1 ${rtl ? "left-2" : "right-2"} w-52 rounded-xl border border-border bg-popover shadow-xl py-1`}>
                  {tabs.map(tab => (
                    <button key={tab.id} onClick={() => { setActiveTab(tab.id); setMoreOpen(false); }}
                      className={`w-full px-4 py-2 text-sm text-start hover:bg-secondary transition-colors ${activeTab === tab.id ? "text-foreground font-semibold" : "text-foreground/80"}`}>
                      {tab.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-5 py-5">
              {activeTab === "account" && (
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground overflow-hidden shrink-0">
                      {settingsAvatar ? <img src={settingsAvatar} alt={settingsDisplayName} className="h-full w-full object-cover" /> : settingsInitial}
                    </div>
                    <div className="flex-1 min-w-0">
                      <label className="block text-xs text-muted-foreground mb-1.5">{L.fullName}</label>
                      <input value={fullName} onChange={e => setFullName(e.target.value)}
                        onBlur={async () => {
                          if (fullName && fullName !== settingsDisplayName) {
                            try { await supabase.auth.updateUser({ data: { full_name: fullName } }); toast.success("✓"); } catch {}
                          }
                        }}
                        className="w-full rounded-lg border border-border bg-secondary/50 px-3 py-2.5 text-sm text-foreground outline-none focus:border-foreground/40" />
                    </div>
                    <button onClick={() => { onLogout(); onClose(); }} title="Logout"
                      className="mt-6 rounded-lg border border-border p-2.5 text-foreground hover:bg-secondary transition-colors">
                      <LogOut className="h-4 w-4" />
                    </button>
                  </div>

                  <SectionCard className="p-5">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-serif font-semibold text-foreground">{L.free}</span>
                      <button onClick={() => { onClose(); window.dispatchEvent(new CustomEvent("open-upgrade")); }}
                        className="rounded-lg bg-foreground px-4 py-2 text-sm font-semibold text-background hover:opacity-90 transition-opacity">
                        {L.upgrade}
                      </button>
                    </div>
                    <div className="my-4 border-t border-dashed border-border/70" />
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                          <Sparkles className="h-4 w-4" /> {L.credits}
                          <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                        </div>
                        <span className="text-sm font-semibold text-foreground">{usage.remaining}</span>
                      </div>
                      <div className="flex items-center justify-between -mt-3">
                        <span className="text-xs text-muted-foreground">{L.freeCredits}</span>
                        <span className="text-xs text-muted-foreground">{usage.remaining}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                          <CalendarCheck className="h-4 w-4" /> {L.dailyRefresh}
                          <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                        </div>
                        <span className="text-sm font-semibold text-foreground">0</span>
                      </div>
                      <p className="text-xs text-muted-foreground -mt-3">{L.refreshAt}</p>
                    </div>
                  </SectionCard>

                  <div className="space-y-1.5">
                    <p className="text-sm font-semibold text-foreground">{L.email}</p>
                    <p className="text-sm text-muted-foreground break-all">{settingsEmail}</p>
                  </div>
                  <div className="flex items-end justify-between gap-3">
                    <div className="flex-1 min-w-0 space-y-1.5">
                      <p className="text-sm font-semibold text-foreground">{L.userId}</p>
                      <p className="text-sm text-muted-foreground break-all">{userId}</p>
                    </div>
                    <button onClick={() => { navigator.clipboard.writeText(userId); toast.success(L.copied); }}
                      className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary transition-colors">
                      {L.copy}
                    </button>
                  </div>
                </div>
              )}

              {activeTab === "general" && (
                <div className="space-y-6">
                  <h3 className="text-base font-semibold text-foreground">{L.appearance}</h3>
                  <div>
                    <label className="block text-sm text-foreground mb-2">{L.language}</label>
                    <div className="relative">
                      <select value={lang} onChange={e => { const v = e.target.value as Lang; setLang(v); updateSetting("language", v); document.documentElement.dir = isRTL(v) ? "rtl" : "ltr"; }}
                        className="w-full appearance-none rounded-lg border border-border bg-secondary/50 px-3 py-2.5 pr-9 text-sm text-foreground outline-none focus:border-foreground/40">
                        {(["العربية","English","Français","Español","Deutsch","Türkçe"] as Lang[]).map(l => <option key={l} value={l}>{l}</option>)}
                      </select>
                      <ChevronDown className={`pointer-events-none absolute top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground ${rtl ? "left-3" : "right-3"}`} />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-foreground mb-2">{L.theme}</label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { id: "light", label: L.light, Icon: Sun },
                        { id: "dark", label: L.dark, Icon: Moon },
                        { id: "auto", label: L.auto, Icon: Monitor },
                      ].map(opt => {
                        const active = settings.theme === opt.id;
                        return (
                          <button key={opt.id} onClick={() => { updateSetting("theme", opt.id); applyTheme(opt.id); }}
                            className={`flex flex-col items-center gap-2 rounded-xl border py-4 transition-all ${active ? "border-foreground bg-secondary/40" : "border-border/60 hover:bg-secondary/40"}`}>
                            <opt.Icon className="h-5 w-5 text-foreground" />
                            <span className="text-sm text-foreground">{opt.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border/60">
                    <h3 className="text-base font-semibold text-foreground mb-4">{L.commPrefs}</h3>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-foreground">{L.browserNotif}</p>
                        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{L.browserNotifDesc}</p>
                      </div>
                      <Toggle value={browserNotif} onChange={async v => {
                        setBrowserNotif(v);
                        if (v && typeof Notification !== "undefined" && Notification.permission !== "granted") {
                          try { await Notification.requestPermission(); } catch {}
                        }
                      }} />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "billing" && (
                <div className="space-y-4">
                  <SectionCard className="p-5 flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{L.plan}</p>
                      <p className="text-lg font-semibold text-foreground">{planLabel(plan.tier, lang)}</p>
                    </div>
                    <button onClick={() => { onClose(); window.dispatchEvent(new CustomEvent("open-upgrade")); }}
                      className="rounded-lg bg-foreground px-4 py-2 text-sm font-semibold text-background">{L.upgrade}</button>
                  </SectionCard>
                  <SectionCard className="p-5 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm font-semibold text-foreground"><Sparkles className="h-4 w-4" />{L.remaining}</div>
                    <span className="text-base font-bold text-foreground">{usage.remaining}</span>
                  </SectionCard>
                  <p className="text-xs text-muted-foreground text-center pt-2">{L.emptyBilling}</p>
                </div>
              )}

              {activeTab === "personalization" && (
                <div className="py-16 text-center text-sm text-muted-foreground">{L.emptyPersonalization}</div>
              )}

              {activeTab === "mail" && (
                <div className="py-16 text-center text-sm text-muted-foreground flex flex-col items-center gap-3">
                  <Mail className="h-10 w-10 text-muted-foreground/60" />
                  {L.emptyMail}
                </div>
              )}

              {activeTab === "data" && (
                <div className="space-y-3">
                  <button onClick={() => { onClearHistory(); toast.success("✓"); }}
                    className="w-full rounded-xl bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive hover:bg-destructive/20 transition-colors text-start">
                    {t(lang, "settings.clear_history")}
                  </button>
                  <p className="text-xs text-muted-foreground">{L.emptyData}</p>
                </div>
              )}

              {activeTab === "computer" && (
                <div className="space-y-5">
                  <div className="flex items-center gap-6 border-b border-border/60">
                    {[
                      { id: "cloud" as const, label: L.cloudComp },
                      { id: "local" as const, label: L.localComp },
                    ].map(s => (
                      <button key={s.id} onClick={() => setComputerSub(s.id)}
                        className={`relative pb-3 text-sm font-semibold transition-colors ${computerSub === s.id ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
                        {s.label}
                        {computerSub === s.id && <span className="absolute bottom-0 inset-x-0 h-0.5 bg-foreground rounded-full" />}
                      </button>
                    ))}
                  </div>
                  <SectionCard className="p-5">
                    <div className="flex items-start gap-4">
                      <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-secondary shrink-0">
                        <Monitor className="h-7 w-7 text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-foreground leading-snug">{L.persistentTitle}</p>
                        <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{L.persistentDesc}</p>
                      </div>
                      <button className="mt-1 rounded-lg bg-foreground px-4 py-2 text-sm font-semibold text-background hover:opacity-90 transition-opacity flex items-center gap-1.5 whitespace-nowrap">
                        <Plus className="h-4 w-4" /> {L.createNow}
                      </button>
                    </div>
                  </SectionCard>
                </div>
              )}

              {activeTab === "browser" && (
                <div className="space-y-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{L.persistLogin}</p>
                      <a href="#" onClick={e => e.preventDefault()} className="text-xs text-muted-foreground underline">{L.learnMore}</a>
                    </div>
                    <Toggle value={persistLogin} onChange={setPersistLogin} />
                  </div>
                  <div className="border-t border-border/60 pt-5 flex items-center justify-between gap-4">
                    <p className="text-sm font-semibold text-foreground">{L.cookies}</p>
                    <button className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary transition-colors">{L.manage}</button>
                  </div>
                </div>
              )}

              {activeTab === "plugins" && (
                <div className="space-y-4">
                  <div className="relative">
                    <Search className={`absolute top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground ${rtl ? "right-3" : "left-3"}`} />
                    <input placeholder={L.searchPlugins}
                      className={`w-full rounded-lg border border-border bg-secondary/50 py-2.5 text-sm text-foreground outline-none focus:border-foreground/40 ${rtl ? "pr-9 pl-3" : "pl-9 pr-3"}`} />
                  </div>
                  <div className="flex items-center gap-2">
                    {[
                      { id: "connectors" as const, label: L.connectors },
                      { id: "skills" as const, label: L.skills },
                      { id: "data" as const, label: L.dataSources },
                    ].map(s => (
                      <button key={s.id} onClick={() => setPluginSub(s.id)}
                        className={`rounded-full px-4 py-1.5 text-sm transition-colors ${pluginSub === s.id ? "border border-border bg-secondary text-foreground font-semibold" : "text-muted-foreground hover:text-foreground"}`}>
                        {s.label}
                      </button>
                    ))}
                    <button className="ms-auto rounded-lg border border-border px-4 py-1.5 text-sm font-medium text-foreground hover:bg-secondary transition-colors">{L.add}</button>
                  </div>
                  <div className="py-14 flex flex-col items-center gap-4 text-center">
                    <Plug className="h-10 w-10 text-muted-foreground/60" />
                    <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">{L.pluginsEmpty}</p>
                    <button className="inline-flex items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary transition-colors">
                      <Plus className="h-4 w-4" /> {L.addConnectors}
                    </button>
                  </div>
                </div>
              )}

              {activeTab === "integrations" && (
                <div className="space-y-3">
                  {[
                    { title: L.buildApi, desc: L.buildApiDesc, Icon: () => <Plug className="h-5 w-5 text-foreground" />, bg: "bg-secondary" },
                    { title: L.useZapier, desc: L.useZapierDesc, Icon: () => <span className="text-xs font-bold text-white">zap</span>, bg: "bg-orange-600" },
                    { title: L.useSlack, desc: L.useSlackDesc, Icon: () => <MessageSquare className="h-5 w-5 text-white" />, bg: "bg-rose-500" },
                    { title: L.telegram, desc: L.telegramDesc, Icon: () => <Send className="h-5 w-5 text-white" />, bg: "bg-sky-500" },
                  ].map((it, i) => (
                    <SectionCard key={i} className="p-4 flex items-center gap-4 hover:bg-secondary/60 cursor-pointer transition-colors">
                      <div className={`flex h-11 w-11 items-center justify-center rounded-xl shrink-0 ${it.bg}`}><it.Icon /></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground">{it.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{it.desc}</p>
                      </div>
                    </SectionCard>
                  ))}
                </div>
              )}

              {activeTab === "help" && (
                <div className="py-16 text-center flex flex-col items-center gap-3">
                  <HelpCircle className="h-10 w-10 text-muted-foreground/60" />
                  <a href="mailto:support@erfan.ai" className="text-sm text-foreground underline">support@erfan.ai</a>
                </div>
              )}
            </div>
          </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

/* ═══════════════════════ PROFILE DROPDOWN ═══════════════════════ */
const ProfileDropdown = ({ isOpen, onClose, onLogout, onOpenSettings, onOpenProfile, onOpenKnowledge, onUpgrade, onHome, onHelp }: { isOpen: boolean; onClose: () => void; onLogout: () => void; onOpenSettings: () => void; onOpenProfile: () => void; onOpenKnowledge: () => void; onUpgrade: () => void; onHome: () => void; onHelp: () => void }) => {
  const { lang } = useLang();
  const dir = isRTL(lang) ? "rtl" : "ltr";
  const { user } = useAuth();
  const displayName = user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split("@")[0] || "User";
  const displayEmail = user?.email || "";
  const avatarUrl = user?.user_metadata?.avatar_url || user?.user_metadata?.picture || null;
  const truncatedEmail = displayEmail.length > 25 ? "..." + displayEmail.slice(-22) : displayEmail;
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
                  <h3 className={`text-sm font-bold text-foreground ${isRTL(lang) ? "text-left" : "text-right"}`}>{displayName}</h3>
                  <p className={`text-xs text-muted-foreground ${isRTL(lang) ? "text-left" : "text-right"}`}>{truncatedEmail}</p>
                </div>
                {avatarUrl ? (
                  <img src={avatarUrl} alt={displayName} className="h-12 w-12 rounded-full object-cover" />
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">{displayName.trim().charAt(0).toUpperCase()}</div>
                )}
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
              <button onClick={() => { window.location.assign("/analytics"); onClose(); }} className={`flex w-full items-center ${isRTL(lang) ? "justify-end" : "justify-start"} gap-3 rounded-lg px-3 py-3 text-sm text-foreground hover:bg-secondary transition-colors`}>
                {!isRTL(lang) && <BarChart3 className="h-5 w-5 text-muted-foreground" />}
                <span>{isRTL(lang) ? "تحليلات المشروع" : "Project Analytics"}</span>
                {isRTL(lang) && <BarChart3 className="h-5 w-5 text-muted-foreground" />}
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

/* ═══════════════════════ TASK EXECUTION TYPES ═══════════════════════ */
type TaskStep = {
  id: string;
  label: string;
  status: "pending" | "running" | "done" | "error";
  icon: "edit" | "terminal" | "check" | "search" | "sparkles";
};

type TaskGroup = {
  id: string;
  title: string;
  description: string;
  status: "pending" | "running" | "done";
  subtasks: { label: string; icon: "edit" | "terminal" }[];
  isExpanded: boolean;
};

const stepIconMap = {
  edit: Pencil,
  terminal: Terminal,
  check: Check,
  search: Search,
  sparkles: Sparkles,
};

const stepStatusColors = {
  pending: "bg-muted-foreground/20 text-muted-foreground",
  running: "bg-blue-500/15 text-blue-500 border border-blue-500/30",
  done: "bg-green-500/15 text-green-500 border border-green-500/30",
  error: "bg-destructive/15 text-destructive border border-destructive/30",
};

/* ═══════════════════════ EXECUTION PANEL ═══════════════════════ */
const ExecutionPanel = ({ 
  taskGroups,
  isVisible, 
  isExpanded, 
  onToggleExpand,
  onToggleGroup,
  finalMessage,
  onContinue,
  elapsedSeconds,
}: { 
  taskGroups: TaskGroup[];
  isVisible: boolean; 
  isExpanded: boolean; 
  onToggleExpand: () => void;
  onToggleGroup: (id: string) => void;
  finalMessage?: string;
  onContinue?: () => void;
  elapsedSeconds: number;
}) => {
  const { lang } = useLang();
  const dir = isRTL(lang) ? "rtl" : "ltr";
  const completedGroups = taskGroups.filter(g => g.status === "done").length;
  const totalGroups = taskGroups.length;
  const isAllDone = completedGroups === totalGroups && totalGroups > 0;
  const currentGroup = taskGroups.find(g => g.status === "running");

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  // Terminal preview lines
  const getPreviewLines = () => {
    const codeLines = [
      "$ npm run build",
      "✓ Building components...",
      "✓ Optimizing assets...",
      "const App = () => {",
      "  return <Main />;",
      "};",
      "export default App;",
    ];
    return codeLines.slice(0, Math.min(completedGroups + 2, codeLines.length));
  };

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="mb-4 rounded-2xl border border-border bg-card overflow-hidden shadow-xl"
      dir={dir}
    >
      {/* Expanded Content - Task Groups */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="max-h-[60vh] overflow-y-auto">
              {taskGroups.map((group, gi) => (
                <motion.div
                  key={group.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: gi * 0.08 }}
                  className="border-b border-border/50 last:border-b-0"
                >
                  {/* Group Header */}
                  <button
                    onClick={() => onToggleGroup(group.id)}
                    className="w-full flex items-start gap-3 px-4 py-3.5 hover:bg-secondary/30 transition-colors"
                  >
                    {/* Status Icon */}
                    <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full mt-0.5 ${
                      group.status === "done" 
                        ? "bg-green-500/15 text-green-500" 
                        : group.status === "running"
                          ? "bg-blue-500/15 text-blue-500"
                          : "bg-muted-foreground/10 text-muted-foreground/40"
                    }`}>
                      {group.status === "done" ? (
                        <Check className="h-3.5 w-3.5" />
                      ) : group.status === "running" ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <div className="h-2 w-2 rounded-full bg-muted-foreground/30" />
                      )}
                    </div>

                    {/* Title */}
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-bold leading-relaxed ${isRTL(lang) ? "text-right" : "text-left"} ${
                        group.status === "done" 
                          ? "text-foreground" 
                          : group.status === "running" 
                            ? "text-foreground"
                            : "text-muted-foreground/60"
                      }`}>
                        {group.title}
                      </p>
                    </div>

                    {/* Expand Arrow */}
                    <motion.div
                      animate={{ rotate: group.isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="shrink-0 mt-0.5"
                    >
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    </motion.div>
                  </button>

                  {/* Group Content (expanded) */}
                  <AnimatePresence>
                    {group.isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className={`px-4 pb-4 ${isRTL(lang) ? "pr-[52px]" : "pl-[52px]"}`}>
                          {/* Description */}
                          <p className={`text-sm text-muted-foreground leading-relaxed mb-3 ${isRTL(lang) ? "text-right" : "text-left"}`}>
                            {group.description}
                          </p>

                          {/* Sub-task Chips */}
                          <div className="flex flex-wrap gap-2">
                            {group.subtasks.map((sub, si) => (
                              <motion.div
                                key={si}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: si * 0.05 }}
                                className="flex items-center gap-2 rounded-full bg-secondary/80 border border-border px-3 py-1.5"
                              >
                                <div className={`flex h-5 w-5 items-center justify-center rounded-md ${
                                  group.status === "done" 
                                    ? "bg-green-500/15 text-green-500" 
                                    : "bg-accent/15 text-accent"
                                }`}>
                                  {sub.icon === "edit" ? (
                                    <Pencil className="h-3 w-3" />
                                  ) : (
                                    <Terminal className="h-3 w-3" />
                                  )}
                                </div>
                                <span className="text-xs text-foreground/80 font-medium">{sub.label}</span>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}

              {/* Final AI Response */}
              {isAllDone && finalMessage && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="px-4 py-4 border-t border-border"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-accent/15">
                      <Sparkles className="h-4 w-4 text-accent" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-foreground leading-relaxed">{finalMessage}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Continue Button - Shows when all done */}
      <AnimatePresence>
        {isAllDone && onContinue && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-border bg-accent/5 px-4 py-3"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-accent/15">
                  <Sparkles className="h-4 w-4 text-accent" />
                </div>
                <p className="text-sm text-foreground">
                  {t(lang, "execution.can_continue")}
                </p>
              </div>
              <button
                onClick={onContinue}
                className="rounded-xl border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground hover:bg-secondary transition-colors"
              >
                {t(lang, "execution.continue")}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Collapsed Bar / Preview with Terminal Thumbnail */}
      <motion.button
        onClick={onToggleExpand}
        className="w-full flex items-center gap-3 px-4 py-3 bg-secondary/50 hover:bg-secondary/80 transition-colors"
        whileHover={{ scale: 1.005 }}
        whileTap={{ scale: 0.995 }}
      >
        {/* Live Code Thumbnail Preview */}
        <motion.div 
          className="h-14 w-20 rounded-xl overflow-hidden shrink-0 border border-border relative"
          style={{ background: "linear-gradient(135deg, #0d0d0d 0%, #1a1a1a 100%)" }}
          animate={!isAllDone ? { 
            boxShadow: [
              "0 0 0px hsl(var(--accent)/0)",
              "0 0 12px hsl(var(--accent)/0.3)",
              "0 0 0px hsl(var(--accent)/0)"
            ]
          } : {}}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* Scanline Effect */}
          {!isAllDone && (
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "linear-gradient(180deg, transparent 0%, hsl(var(--accent)/0.08) 50%, transparent 100%)",
                height: "30%"
              }}
              animate={{ y: ["-100%", "400%"] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            />
          )}
          
          {/* Code Lines Container */}
          <div className="h-full w-full flex flex-col gap-[3px] p-1.5 overflow-hidden relative z-10">
            {getPreviewLines().map((line, i) => (
              <motion.div
                key={`${line}-${i}`}
                initial={{ opacity: 0, x: -10, scaleX: 0 }}
                animate={{ opacity: 1, x: 0, scaleX: 1 }}
                transition={{ delay: i * 0.12, duration: 0.3, ease: "easeOut" }}
                className="flex items-center gap-1 origin-left"
              >
                <motion.div 
                  className="h-[4px] w-[4px] rounded-full shrink-0"
                  style={{ 
                    background: line.startsWith("$") ? "#22c55e" : 
                               line.startsWith("✓") ? "hsl(var(--accent))" : "#525252"
                  }}
                />
                <motion.div 
                  className={`h-[4px] rounded-full ${
                    line.startsWith("$") ? "bg-green-400" : 
                    line.startsWith("✓") ? "bg-accent" : "bg-muted-foreground/50"
                  }`}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(line.length * 2, 100)}%` }}
                  transition={{ delay: i * 0.12 + 0.1, duration: 0.4, ease: "easeOut" }}
                />
              </motion.div>
            ))}
            
            {/* Typing Cursor */}
            {!isAllDone && (
              <motion.div className="flex items-center gap-1 mt-auto" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                <motion.div className="h-[4px] w-[2px] bg-accent rounded-full" animate={{ opacity: [1, 0, 1] }} transition={{ duration: 0.8, repeat: Infinity }} />
                <motion.div className="h-[4px] bg-muted-foreground/30 rounded-full" animate={{ width: ["0%", "40%", "60%", "40%"] }} transition={{ duration: 2, repeat: Infinity }} />
              </motion.div>
            )}
            
            {/* Success Overlay */}
            <AnimatePresence>
              {isAllDone && (
                <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }} className="absolute inset-0 flex items-center justify-center bg-green-500/10 backdrop-blur-[1px]">
                  <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", damping: 12, stiffness: 200 }} className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500/20 border border-green-500/40">
                    <Check className="h-3.5 w-3.5 text-green-400" />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* Corner Glow */}
          {!isAllDone && (
            <motion.div className="absolute -top-2 -right-2 h-6 w-6 rounded-full blur-md" style={{ background: "hsl(var(--accent)/0.4)" }} animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }} />
          )}
        </motion.div>

        {/* Progress Info - Title + Time + Status */}
        <div className="flex-1 flex flex-col gap-0.5 min-w-0">
          <motion.span 
            className="text-xs text-foreground font-semibold truncate"
            key={currentGroup?.title || "done"}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {isAllDone 
              ? t(lang, "execution.completed")
              : currentGroup?.title || t(lang, "execution.processing")
            }
          </motion.span>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-muted-foreground font-mono">{formatTime(elapsedSeconds)}</span>
            <span className="text-[11px] text-muted-foreground">
              {isAllDone ? t(lang, "execution.completed") : "Thinking"}
            </span>
            {!isAllDone && (
              <motion.div 
                className="flex h-4 w-4 items-center justify-center"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <Loader2 className="h-3 w-3 text-blue-500 animate-spin" />
              </motion.div>
            )}
          </div>
        </div>

        {/* Expand/Collapse */}
        <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ type: "spring", damping: 15 }}>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </motion.div>
      </motion.button>
    </motion.div>
  );
};

const TaskExecutionSteps = ({ steps }: { steps: TaskStep[] }) => {
  const { lang } = useLang();
  return (
    <div className="space-y-2 py-1">
      {steps.map((step, i) => {
        const Icon = stepIconMap[step.icon] || Terminal;
        return (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, x: isRTL(lang) ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08, duration: 0.3 }}
            className="flex items-center gap-2.5"
          >
            <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-xs ${stepStatusColors[step.status]}`}>
              {step.status === "running" ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : step.status === "done" ? (
                <Check className="h-3.5 w-3.5" />
              ) : (
                <Icon className="h-3.5 w-3.5" />
              )}
            </div>
            <span className={`text-xs leading-relaxed ${step.status === "done" ? "text-muted-foreground" : step.status === "running" ? "text-foreground font-medium" : "text-muted-foreground/60"}`}>
              {step.label}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
};

/* ═══════════════════════ CHAT MESSAGE ═══════════════════════ */
const ChatMessage = ({ message, isUser, files, steps, isStreaming }: { message: string; isUser: boolean; files?: File[]; steps?: TaskStep[]; isStreaming?: boolean }) => (
  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex ${isUser ? "justify-start" : "justify-end"} mb-3`}>
    <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${isUser ? "bg-accent text-accent-foreground" : "bg-secondary text-foreground"}`}>
      {steps && steps.length > 0 && <TaskExecutionSteps steps={steps} />}
      {message && (
        isUser ? (
          <p className="leading-relaxed">{message}</p>
        ) : (
          <div className="prose prose-sm dark:prose-invert max-w-none leading-relaxed [&>p]:my-1 [&>ul]:my-1 [&>ol]:my-1 [&>pre]:my-2 [&>pre]:rounded-lg [&>pre]:bg-background/30 [&>pre]:p-3 [&>code]:bg-background/30 [&>code]:rounded [&>code]:px-1 [&>code]:py-0.5 [&>code]:text-xs">
            <ReactMarkdown>{message}</ReactMarkdown>
            {isStreaming && (
              <motion.span
                className="inline-block w-1.5 h-4 bg-accent rounded-sm ml-0.5 align-middle"
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
              />
            )}
          </div>
        )
      )}
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
const KnowledgePanel = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const { lang } = useLang();
  const dir = isRTL(lang) ? "rtl" : "ltr";
  const { items, addItem, updateItem, deleteItem, toggleItem } = useKnowledge();
  const [searchQuery, setSearchQuery] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formTitle, setFormTitle] = useState("");
  const [formContent, setFormContent] = useState("");

  const handleAdd = () => {
    if (!formTitle.trim() || !formContent.trim()) return;
    addItem(formTitle.trim(), formContent.trim());
    setFormTitle(""); setFormContent(""); setIsAdding(false);
    toast(t(lang, "knowledge.saved"));
  };

  const handleUpdate = () => {
    if (!editingId || !formTitle.trim() || !formContent.trim()) return;
    updateItem(editingId, formTitle.trim(), formContent.trim());
    setFormTitle(""); setFormContent(""); setEditingId(null);
    toast(t(lang, "knowledge.updated"));
  };

  const handleDelete = (id: string) => {
    deleteItem(id);
    toast(t(lang, "knowledge.deleted"));
  };

  const handleToggle = (id: string) => {
    toggleItem(id);
  };

  const startEdit = (item: { id: string; title: string; content: string }) => {
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
                          {new Date(item.updated_at).toLocaleDateString(lang === "العربية" ? "ar-SA" : "en-US", { year: "numeric", month: "short", day: "numeric" })}
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
const defaultProfile = { name: "", email: "", avatar: null as string | null };

const ProfilePanel = ({ isOpen, onClose, onLogout }: { isOpen: boolean; onClose: () => void; onLogout: () => void }) => {
  const { lang } = useLang();
  const dir = isRTL(lang) ? "rtl" : "ltr";
  const { user } = useAuth();
  const authName = user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split("@")[0] || "User";
  const authEmail = user?.email || "";
  const authAvatar = user?.user_metadata?.avatar_url || user?.user_metadata?.picture || null;
  const [isKnowledgePanelOpen, setIsKnowledgePanelOpen] = useState(false);
  const [profile, setProfile] = useState(() => {
    try {
      const s = localStorage.getItem(PROFILE_KEY);
      if (s) return { ...defaultProfile, ...JSON.parse(s) };
    } catch {}
    return { name: authName, email: authEmail, avatar: authAvatar };
  });
  // Sync with auth data when user changes
  useEffect(() => {
    setProfile(prev => {
      const stored = localStorage.getItem(PROFILE_KEY);
      if (stored) return prev; // user has custom profile, keep it
      return { name: authName, email: authEmail, avatar: authAvatar };
    });
  }, [authName, authEmail, authAvatar]);
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
  const { tasks, addTask, deleteTask, toggleTask } = useScheduledTasks();
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const handleAdd = () => {
    if (!title.trim() || !date) return;
    addTask({
      title: title.trim(),
      description: date,
      schedule_type: "once",
      schedule_time: time || "09:00",
      prompt: `${title.trim()} - ${date} ${time}`,
    });
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
        <button onClick={handleAdd} disabled={!title.trim() || !date} className="w-full rounded-xl bg-accent text-accent-foreground py-3 text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-40">{t(lang, "schedule.add_btn")}</button>
      </div>
      {tasks.length === 0 ? (
        <div className="text-center py-10"><CalendarCheck className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" /><p className="text-sm text-muted-foreground">{t(lang, "schedule.empty")}</p></div>
      ) : (
        <div className="space-y-2">
          {tasks.map(task => (
            <div key={task.id} className={`flex items-center gap-3 rounded-xl border border-border p-3 ${!task.enabled ? "opacity-50" : ""}`}>
              <button onClick={() => toggleTask(task.id)} className={`h-5 w-5 rounded-md border-2 flex items-center justify-center transition-colors ${!task.enabled ? "bg-accent border-accent" : "border-muted-foreground"}`}>
                {!task.enabled && <span className="text-accent-foreground text-xs">✓</span>}
              </button>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium text-foreground ${!task.enabled ? "line-through" : ""}`}>{task.title}</p>
                <p className="text-xs text-muted-foreground">{task.description} {task.schedule_time && `• ${task.schedule_time}`}</p>
              </div>
              <button onClick={() => { deleteTask(task.id); toast(t(lang, "schedule.deleted")); }} className="text-muted-foreground hover:text-red-500 transition-colors"><Trash2 className="h-4 w-4" /></button>
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
const pricingPlans = [
  {
    id: "free",
    priceMonthly: 0,
    priceYearly: 0,
    descKey: "pricing.free_desc",
    highlighted: false,
    monthlyCredits: 0,
    isFree: true,
    features: [
      { icon: RotateCcw, key: "pricing.f_refresh_free" },
      { icon: Sparkles, key: "pricing.f_monthly_free" },
      { icon: Search, key: "pricing.f_research_free" },
      { icon: Globe, key: "pricing.f_websites_free" },
      { icon: Presentation, key: "pricing.f_slides_free" },
      { icon: BarChart3, key: "pricing.f_concurrent_free" },
      { icon: CalendarCheck, key: "pricing.f_scheduled_free" },
    ],
  },
  {
    id: "pro",
    priceMonthly: 15,
    priceYearly: 12,
    descKey: "pricing.standard_desc",
    highlighted: false,
    monthlyCredits: 4000,
    features: [
      { icon: RotateCcw, key: "pricing.f_refresh" },
      { icon: Sparkles, key: "pricing.f_monthly_4k" },
      { icon: Search, key: "pricing.f_research_standard" },
      { icon: Globe, key: "pricing.f_websites_standard" },
      { icon: Presentation, key: "pricing.f_slides_standard" },
      { icon: Target, key: "pricing.f_scaling_standard" },
      { icon: Zap, key: "pricing.f_beta" },
      { icon: BarChart3, key: "pricing.f_concurrent" },
      { icon: CalendarCheck, key: "pricing.f_scheduled" },
    ],
  },
  {
    id: "plus",
    priceMonthly: 30,
    priceYearly: 25,
    descKey: "pricing.plus_desc",
    highlighted: true,
    monthlyCredits: 8000,
    creditOptions: [4000, 8000, 12000],
    features: [
      { icon: RotateCcw, key: "pricing.f_refresh" },
      { icon: Sparkles, key: "pricing.f_monthly_8k" },
      { icon: Search, key: "pricing.f_research_plus" },
      { icon: Globe, key: "pricing.f_websites_plus" },
      { icon: Presentation, key: "pricing.f_slides_plus" },
      { icon: Target, key: "pricing.f_scaling_plus" },
      { icon: Zap, key: "pricing.f_beta" },
      { icon: BarChart3, key: "pricing.f_concurrent" },
      { icon: CalendarCheck, key: "pricing.f_scheduled" },
    ],
  },
  {
    id: "max",
    priceMonthly: 150,
    priceYearly: 125,
    descKey: "pricing.max_desc",
    highlighted: false,
    monthlyCredits: 40000,
    features: [
      { icon: RotateCcw, key: "pricing.f_refresh" },
      { icon: Sparkles, key: "pricing.f_monthly_40k" },
      { icon: Search, key: "pricing.f_research_max" },
      { icon: Globe, key: "pricing.f_websites_max" },
      { icon: Presentation, key: "pricing.f_slides_max" },
      { icon: Target, key: "pricing.f_scaling_max" },
      { icon: Zap, key: "pricing.f_beta" },
      { icon: BarChart3, key: "pricing.f_concurrent" },
      { icon: CalendarCheck, key: "pricing.f_scheduled" },
    ],
  },
];

const UpgradeProPanel = ({ isOpen, onClose, highlightPlan }: { isOpen: boolean; onClose: () => void; highlightPlan?: string | null }) => {
  const { lang } = useLang();
  const dir = isRTL(lang) ? "rtl" : "ltr";
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");
  const [selectedCredits, setSelectedCredits] = useState(8000);
  const { plan: userPlan } = usePlan();

  useEffect(() => {
    if (!isOpen || !highlightPlan) return;
    const t = setTimeout(() => {
      const el = document.querySelector(`[data-plan-id="${highlightPlan}"]`);
      if (el) (el as HTMLElement).scrollIntoView({ behavior: "smooth", block: "center" });
    }, 250);
    return () => clearTimeout(t);
  }, [isOpen, highlightPlan]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 z-40" style={{ background: "hsl(0 0% 0% / 0.7)" }} />
          <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} transition={{ type: "spring", damping: 25, stiffness: 300 }} className="fixed inset-x-3 top-8 bottom-8 z-50 flex flex-col rounded-2xl border border-border bg-card shadow-2xl overflow-hidden" dir={dir}>
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 shrink-0">
              <h2 className="text-xl font-bold text-foreground">{t(lang, "pricing.title")}</h2>
              <button onClick={onClose} className="rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"><X className="h-5 w-5" /></button>
            </div>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center gap-1 mx-5 mb-4 rounded-xl bg-secondary p-1">
              <button onClick={() => setBilling("monthly")} className={`flex-1 rounded-lg py-2.5 text-xs font-semibold transition-colors ${billing === "monthly" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}>{t(lang, "pro.monthly")}</button>
              <button onClick={() => setBilling("yearly")} className={`flex-1 rounded-lg py-2.5 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 ${billing === "yearly" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}>
                {t(lang, "pro.yearly")} · {t(lang, "pricing.save_17")}
              </button>
            </div>

            {/* Plans */}
            <div className="flex-1 overflow-y-auto px-5 pb-6 space-y-5">
              {pricingPlans.map((plan) => {
                const price = billing === "monthly" ? plan.priceMonthly : plan.priceYearly;
                return (
                  <div key={plan.id} data-plan-id={(plan as any).id || ((plan as any).isFree ? "free" : "")} className={`rounded-2xl border p-5 transition-all ${plan.highlighted ? "border-accent shadow-lg shadow-accent/10" : "border-border"} ${highlightPlan && ((plan as any).id === highlightPlan) ? "ring-2 ring-accent shadow-xl shadow-accent/20" : ""}`} style={plan.highlighted ? { borderWidth: 2 } : {}}>
                    {/* Price */}
                    <div className="mb-1">
                      {(plan as any).isFree ? (
                        <span className="text-3xl font-bold text-foreground">{t(lang, "pricing.free")}</span>
                      ) : (
                        <>
                          <span className="text-3xl font-bold text-foreground">${price}</span>
                          <span className="text-sm text-muted-foreground"> / {t(lang, "pricing.month")}</span>
                        </>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">{t(lang, plan.descKey)}</p>

                    {/* Button */}
                    {(() => {
                      const isFree = (plan as any).isFree;
                      const planId = (plan as any).id as string | undefined;
                      const isCurrent = isFree ? userPlan.tier === "free" : planId === userPlan.tier;
                      if (isCurrent) {
                        return (
                          <button disabled className="w-full rounded-full py-3 text-sm font-bold mb-4 bg-secondary text-muted-foreground cursor-default">
                            {t(lang, "pricing.current_plan")}
                          </button>
                        );
                      }
                      return (
                        <button onClick={() => { toast.success(t(lang, "pro.subscribe")); onClose(); }} className={`w-full rounded-full py-3 text-sm font-bold transition-opacity hover:opacity-90 active:scale-[0.98] mb-4 ${plan.highlighted ? "bg-accent text-accent-foreground" : "bg-foreground text-background"}`}>
                          {t(lang, "pricing.upgrade")}
                        </button>
                      );
                    })()}

                    {/* Credits selector for plus plan */}
                    {plan.creditOptions && (
                      <div className="relative mb-4">
                        <select value={selectedCredits} onChange={e => setSelectedCredits(Number(e.target.value))} className="w-full appearance-none rounded-xl bg-secondary px-4 py-3 text-sm text-foreground outline-none border-none cursor-pointer" style={{ direction: "ltr" }}>
                          {plan.creditOptions.map(c => (
                            <option key={c} value={c}>{c.toLocaleString()} {t(lang, "pricing.credits_month")}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute top-1/2 -translate-y-1/2 right-3 h-4 w-4 text-muted-foreground pointer-events-none" />
                      </div>
                    )}

                    {/* Features */}
                    <div className="space-y-3">
                      {plan.features.map((feat, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <feat.icon className="h-4 w-4 text-muted-foreground shrink-0" />
                          <span className="text-sm text-muted-foreground">{t(lang, feat.key)}</span>
                          {(feat.key.includes("refresh") || feat.key.includes("monthly")) && (
                            <HelpCircle className="h-3.5 w-3.5 text-muted-foreground/50 shrink-0" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
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
const CreditsPanel = ({ isOpen, onClose, onUpgrade, usage }: { isOpen: boolean; onClose: () => void; onUpgrade: () => void; usage: { credits_used: number; total_daily_credits: number; remaining: number } }) => {
  const { lang } = useLang();
  const dir = isRTL(lang) ? "rtl" : "ltr";
  const totalCredits = usage.total_daily_credits;
  const remainingCredits = Math.max(0, usage.remaining);
  const freeCredits = Math.max(0, usage.remaining);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 z-40" />
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            style={{ transformOrigin: isRTL(lang) ? "top left" : "top right" }}
            className={`absolute ${isRTL(lang) ? "left-3" : "right-3"} top-[60px] z-50 w-[300px] rounded-2xl border border-border bg-card shadow-2xl overflow-hidden`}
            dir={dir}
          >
            {/* Header: مجاني + ترقية */}
            <div className="flex items-center justify-between px-5 pt-4 pb-3">
              <button
                onClick={() => { onUpgrade(); onClose(); }}
                className="rounded-full border border-border bg-secondary px-5 py-1.5 text-xs font-semibold text-foreground hover:bg-muted transition-colors"
              >
                {t(lang, "profile.upgrade")}
              </button>
              <span className="text-base font-bold text-foreground">{t(lang, "profile.free")}</span>
            </div>

            {/* Dashed separator */}
            <div className="mx-5 border-t border-dashed border-border" />

            {/* الأرصدة */}
            <div className="px-5 py-3 space-y-3">
              {/* Credits row */}
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-foreground">{remainingCredits}</span>
                <div className="flex items-center gap-2">
                  <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{t(lang, "profile.credits")}</span>
                  <Sparkles className="h-4 w-4 text-foreground" />
                </div>
              </div>
              {/* Free credits row */}
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-foreground">{freeCredits}</span>
                <span className="text-sm text-muted-foreground">{t(lang, "credits.free_credits")}</span>
              </div>

              {/* Daily renewal row */}
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-foreground">{totalCredits}</span>
                  <div className="flex items-center gap-2">
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{t(lang, "credits.daily_renewal")}</span>
                    <CalendarCheck className="h-4 w-4 text-foreground" />
                  </div>
                </div>
                <p className={`text-xs text-muted-foreground mt-1 ${isRTL(lang) ? "text-right" : "text-left"}`}>
                  {t(lang, "credits.renews_daily")}
                </p>
              </div>
            </div>

            {/* View usage link */}
            <button
              onClick={() => { toast(t(lang, "coming_soon")); onClose(); }}
              className="flex w-full items-center justify-center gap-1.5 border-t border-border px-5 py-3 text-sm font-semibold text-foreground hover:bg-secondary/50 transition-colors"
            >
              <ChevronLeft className="h-4 w-4 text-muted-foreground" />
              <span>{t(lang, "credits.view_usage")}</span>
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const AlignJustify = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
);

/* ═══════════════════════ CUSTOMIZE CAROUSEL ═══════════════════════ */
const CustomizeCarousel = ({ lang, dir }: { lang: Lang; dir: string }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    {
      icon: LayoutGrid,
      titleKey: "app.customize",
      subtitleKey: "app.your",
      animateIcon: { rotate: [0, -5, 5, -3, 3, 0], scale: [1, 1.05, 1] },
    },
    {
      icon: Sparkles,
      titleKey: "app.customize",
      subtitleKey: "app.your",
      animateIcon: { scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] },
    },
    {
      icon: Palette,
      titleKey: "app.customize",
      subtitleKey: "app.your",
      animateIcon: { y: [0, -4, 0], rotate: [0, 8, -8, 0] },
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <div className="mt-6">
      <div className="relative overflow-hidden rounded-2xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            whileHover={{ scale: 1.03, y: -4, boxShadow: "0 12px 40px -10px hsl(var(--accent) / 0.4)" }}
            whileTap={{ scale: 0.95 }}
            className="overflow-hidden rounded-2xl bg-card cursor-pointer border border-border relative"
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
                animate={slides[currentSlide].animateIcon}
                transition={{ duration: 3, repeat: Infinity, repeatDelay: 2, ease: "easeInOut" }}
              >
                <motion.div
                  animate={{ scale: [1, 1.3, 1], rotate: [0, 15, -15, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 2.5, ease: "easeInOut" }}
                >
                  {(() => {
                    const IconComponent = slides[currentSlide].icon;
                    return <IconComponent className="h-6 w-6 text-accent" />;
                  })()}
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
                  transition={{ delay: 0.1, duration: 0.3 }}
                >
                  {t(lang, slides[currentSlide].titleKey)}{" "}
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
                  transition={{ delay: 0.2, duration: 0.3 }}
                >
                  {t(lang, slides[currentSlide].subtitleKey)}
                </motion.span>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
      
      {/* Dots indicator */}
      <div className="mt-5 flex items-center justify-center gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-2 w-2 rounded-full transition-all duration-300 ${
              currentSlide === index 
                ? "bg-accent w-4" 
                : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

const AppScreen = ({ onLogout }: { onLogout: () => void }) => {
  const { lang } = useLang();
  const { usage, consumeCredits, canConsume } = useCredits();
  const { plan } = usePlan();
  const { getEnabledContext } = useKnowledge();
  const { meetings: savedMeetingsRaw, saveMeeting: dbSaveMeeting, updateMeeting: dbUpdateMeeting, deleteMeeting: dbDeleteMeeting, uploadAudio } = useMeetings();
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
  const [currentModel, setCurrentModel] = useState("ErfanAI Lite");
  const [inputValue, setInputValue] = useState("");
  const [activeChips, setActiveChips] = useState<string[]>([]);
  const [isPlusMenuOpen, setIsPlusMenuOpen] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [morePanel, setMorePanel] = useState<string | null>(null);
  const [upgradeHighlight, setUpgradeHighlight] = useState<string | null>(null);
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [uploadedAttachments, setUploadedAttachments] = useState<Array<{ name: string; path: string; url: string; type: string; size: number }>>([]);
  const [uploadingCount, setUploadingCount] = useState(0);
  const [chatMode, setChatMode] = useState("standard");
  const [isStreaming, setIsStreaming] = useState(false);
  const {
    conversations: dbConversations,
    currentConversationId,
    messages,
    setMessages,
    loadMessages: loadConvMessages,
    createConversation,
    saveMessage,
    startNewChat,
    deleteConversation,
    clearAllConversations,
    updateTitle,
  } = useConversations();
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
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const [editingMeetingId, setEditingMeetingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  type MeetingView = { id: string; duration: number; date: string; title: string; notes?: string; summary?: string; audioUrl?: string; audio_path?: string | null; transcript?: string | null };
  const savedMeetings: MeetingView[] = useMemo(() => savedMeetingsRaw.map(m => ({
    id: m.id, duration: m.duration, title: m.title,
    date: new Date(m.created_at).toLocaleString(),
    notes: m.notes ?? undefined, summary: m.summary ?? undefined,
    audio_path: m.audio_path, transcript: m.transcript ?? undefined,
  })), [savedMeetingsRaw]);
  const [playbackMeeting, setPlaybackMeeting] = useState<MeetingView | null>(null);
  const [playbackSeconds, setPlaybackSeconds] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const playbackTimerRef = useRef<any>(null);
  const [viewingMeeting, setViewingMeeting] = useState<MeetingView | null>(null);
  const [exportMenuId, setExportMenuId] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);
  const lastTranscriptRef = useRef<string>("");
  const [sttEnabled, setSttEnabled] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState("");
  const [committedTranscript, setCommittedTranscript] = useState("");

  // ── Execution Panel State ──
  const [executionSteps, setExecutionSteps] = useState<TaskStep[]>([]);
  const [executionGroups, setExecutionGroups] = useState<TaskGroup[]>([]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [isExecutionExpanded, setIsExecutionExpanded] = useState(true);
  const [executionFinalMessage, setExecutionFinalMessage] = useState("");
  const [executionElapsed, setExecutionElapsed] = useState(0);
  const executionTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Agent Work Panel State ──
  const [agentPanelOpen, setAgentPanelOpen] = useState(false);
  const [agentTodos, setAgentTodos] = useState<AgentTodo[]>([]);
  const [agentEvents, setAgentEvents] = useState<AgentEvent[]>([]);
  const [agentRole, setAgentRole] = useState<AgentRole>("planner");
  const [agentTaskTitle, setAgentTaskTitle] = useState("");
  const pushAgentEvent = useCallback((e: AgentEvent) => setAgentEvents(prev => [...prev, e]), []);

  // ── Speech-to-Text helpers ──
  const startSpeechRecognition = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) { toast.error(t(lang, "meeting.stt_not_supported")); return; }
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = lang === "العربية" ? "ar" : lang === "English" ? "en-US" : lang === "Français" ? "fr-FR" : lang === "Español" ? "es-ES" : lang === "Deutsch" ? "de-DE" : lang === "Türkçe" ? "tr-TR" : "en-US";
    recognition.onresult = (event: any) => {
      let interim = "";
      let final = "";
      for (let i = 0; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) { final += transcript + " "; } else { interim += transcript; }
      }
      if (final) { setCommittedTranscript(prev => prev + final); }
      setLiveTranscript(interim);
    };
    recognition.onerror = () => {};
    recognition.onend = () => { if (recognitionRef.current && sttEnabled) { try { recognition.start(); } catch {} } };
    recognition.start();
    recognitionRef.current = recognition;
  };

  const stopSpeechRecognition = () => {
    if (recognitionRef.current) { try { recognitionRef.current.stop(); } catch {} recognitionRef.current = null; }
  };

  // ── Export helpers ──
  const exportMeetingAsTxt = (meeting: typeof savedMeetings[0]) => {
    const content = [
      meeting.title,
      `─────────────────────────`,
      `${meeting.date}`,
      `${Math.floor(meeting.duration / 60)}:${(meeting.duration % 60).toString().padStart(2, "0")}`,
      "",
      meeting.summary ? `${t(lang, "meeting.summary_label")}:\n${meeting.summary}` : "",
      meeting.notes ? `\n${t(lang, "meeting.notes_label")}:\n${meeting.notes}` : "",
    ].filter(Boolean).join("\n");
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `${meeting.title}.txt`; a.click(); URL.revokeObjectURL(url);
    toast.success(t(lang, "meeting.exported"));
  };

  const exportMeetingAsPdf = (meeting: typeof savedMeetings[0]) => {
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${meeting.title}</title><style>body{font-family:Arial,sans-serif;padding:40px;max-width:700px;margin:0 auto;color:#1a1a1a;direction:${isRTL(lang)?"rtl":"ltr"}}h1{font-size:22px;border-bottom:2px solid #333;padding-bottom:10px}p{line-height:1.8;margin:8px 0}.meta{color:#666;font-size:13px;margin-bottom:20px}.section{background:#f5f5f5;padding:16px;border-radius:8px;margin:16px 0}h3{font-size:15px;color:#333;margin:0 0 8px 0}</style></head><body><h1>${meeting.title}</h1><p class="meta">${meeting.date} — ${Math.floor(meeting.duration / 60)}:${(meeting.duration % 60).toString().padStart(2, "0")}</p>${meeting.summary ? `<div class="section"><h3>${t(lang, "meeting.summary_label")}</h3><p>${meeting.summary}</p></div>` : ""}${meeting.notes ? `<div class="section"><h3>${t(lang, "meeting.notes_label")}</h3><p>${meeting.notes.replace(/\n/g, "<br>")}</p></div>` : ""}<p style="color:#999;font-size:11px;margin-top:40px;text-align:center">ErfanAI — Meeting Minutes</p></body></html>`;
    const win = window.open("", "_blank");
    if (win) { win.document.write(html); win.document.close(); win.print(); }
    toast.success(t(lang, "meeting.exported"));
  };

  const exportMeetingAudio = async (meeting: MeetingView) => {
    if (meeting.audio_path) {
      const { data } = await supabase.storage.from("user-files").download(meeting.audio_path);
      if (data) {
        const url = URL.createObjectURL(data);
        const a = document.createElement("a"); a.href = url; a.download = `${meeting.title}.webm`; a.click();
        URL.revokeObjectURL(url);
        toast.success(t(lang, "meeting.exported"));
      } else {
        toast.error(t(lang, "meeting.no_audio"));
      }
    } else {
      toast.error(t(lang, "meeting.no_audio"));
    }
  };

  const shareMeeting = async (meeting: typeof savedMeetings[0]) => {
    const text = [meeting.title, meeting.date, `${Math.floor(meeting.duration / 60)}:${(meeting.duration % 60).toString().padStart(2, "0")}`, meeting.summary || "", meeting.notes || ""].filter(Boolean).join("\n");
    if (navigator.share) {
      try { await navigator.share({ title: meeting.title, text }); } catch {}
    } else {
      await navigator.clipboard.writeText(text);
      toast.success(t(lang, "meeting.copied"));
    }
  };

  useState(() => {
    const s = loadSettings();
    applyTheme(s.theme);
    applyFontSize(s.fontSize);
  });

  const { user } = useAuth();
  const authName = user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split("@")[0] || "User";
  const authEmail = user?.email || "";
  const authAvatar = user?.user_metadata?.avatar_url || user?.user_metadata?.picture || null;

  const [headerProfile, setHeaderProfile] = useState(() => {
    try {
      const s = localStorage.getItem(PROFILE_KEY);
      if (s) return { ...defaultProfile, ...JSON.parse(s) };
    } catch {}
    return { name: authName, email: authEmail, avatar: authAvatar };
  });

  useEffect(() => {
    const sync = () => {
      try {
        const s = localStorage.getItem(PROFILE_KEY);
        if (s) { setHeaderProfile({ ...defaultProfile, ...JSON.parse(s) }); return; }
      } catch {}
      setHeaderProfile({ name: authName, email: authEmail, avatar: authAvatar });
    };
    window.addEventListener("storage", sync);
    const id = setInterval(sync, 1000);
    return () => { window.removeEventListener("storage", sync); clearInterval(id); };
  }, [authName, authEmail, authAvatar]);

  useEffect(() => {
    const creditsHandler = () => setIsCreditsOpen(true);
    const upgradeHandler = (e?: Event) => {
      const detail = (e as CustomEvent | undefined)?.detail as { plan?: string } | undefined;
      setUpgradeHighlight(detail?.plan ?? null);
      setMorePanel("upgrade_pro");
    };
    window.addEventListener("open-credits", creditsHandler);
    window.addEventListener("open-upgrade", upgradeHandler as EventListener);
    window.addEventListener("erfan:open-upgrade", upgradeHandler as EventListener);
    return () => { window.removeEventListener("open-credits", creditsHandler); window.removeEventListener("open-upgrade", upgradeHandler as EventListener); window.removeEventListener("erfan:open-upgrade", upgradeHandler as EventListener); };
  }, []);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const files = Array.from(e.target.files);
    e.target.value = "";
    setIsPlusMenuOpen(false);

    if (!user) {
      toast.error(lang === "العربية" ? "يجب تسجيل الدخول لرفع الملفات" : "Please sign in to upload files");
      return;
    }

    setAttachedFiles(prev => [...prev, ...files]);
    setUploadingCount(c => c + files.length);
    toast.success(`${t(lang, "app.files_attached")} ${files.length} ${t(lang, "app.file")}`);

    for (const file of files) {
      try {
        const ext = file.name.includes(".") ? file.name.split(".").pop() : "bin";
        const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
        const path = `${user.id}/uploads/${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${safeName}`;
        const { error: upErr } = await supabase.storage.from("user-files").upload(path, file, {
          contentType: file.type || `application/${ext}`,
          upsert: false,
        });
        if (upErr) throw upErr;
        const { data: signed, error: sErr } = await supabase.storage.from("user-files").createSignedUrl(path, 60 * 60 * 24 * 7);
        if (sErr) throw sErr;
        setUploadedAttachments(prev => [...prev, { name: file.name, path, url: signed.signedUrl, type: file.type, size: file.size }]);
      } catch (err: any) {
        console.error("Upload failed:", err);
        toast.error(`${lang === "العربية" ? "فشل رفع" : "Failed to upload"} ${file.name}: ${err.message || ""}`);
        setAttachedFiles(prev => prev.filter(f => f !== file));
      } finally {
        setUploadingCount(c => Math.max(0, c - 1));
      }
    }
  };

  const removeFile = (index: number) => {
    const file = attachedFiles[index];
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
    if (file) {
      setUploadedAttachments(prev => {
        const idx = prev.findIndex(u => u.name === file.name && u.size === file.size);
        if (idx === -1) return prev;
        const target = prev[idx];
        supabase.storage.from("user-files").remove([target.path]).catch(() => {});
        return prev.filter((_, i) => i !== idx);
      });
    }
  };

  const conversationIdRef = useRef<string | null>(currentConversationId);
  useEffect(() => { conversationIdRef.current = currentConversationId; }, [currentConversationId]);

  const handleSend = async () => {
    if (!inputValue.trim() && attachedFiles.length === 0) return;
    if (uploadingCount > 0) {
      toast.info(lang === "العربية" ? "جارٍ رفع الملفات، انتظر قليلاً..." : "Files are still uploading...");
      return;
    }
    if (!canConsume(2)) return;

    const userMsg = inputValue.trim();
    const currentUploads = [...uploadedAttachments];
    const attachmentsBlock = currentUploads.length > 0
      ? "\n\n" + (lang === "العربية" ? "📎 المرفقات:" : "📎 Attachments:") + "\n" +
        currentUploads.map(u => `- [${u.name}](${u.url}) (${u.type || "file"}, ${(u.size / 1024).toFixed(1)} KB)`).join("\n")
      : "";
    const fullMsgForAI = userMsg + attachmentsBlock;

    setMessages(prev => [...prev, { text: userMsg, isUser: true, files: attachedFiles.length > 0 ? [...attachedFiles] : undefined }]);
    setInputValue("");
    setAttachedFiles([]);
    setUploadedAttachments([]);

    // Create or reuse conversation
    let convId = conversationIdRef.current;
    if (!convId) {
      convId = await createConversation(currentModel, chatMode, userMsg);
    }
    // Save user message to DB (with attachment links so history retains them)
    if (convId) {
      saveMessage(convId, "user", fullMsgForAI);
    }
    
    // Track credit usage
    consumeCredits(2);
    // Track analytics event
    import("@/hooks/useAnalyticsTracker").then(m => m.trackEvent("message", "message_sent", { model: currentModel, mode: chatMode, length: userMsg.length, attachments: currentUploads.length }));

    // Build conversation history for AI with knowledge context
    const knowledgeContext = getEnabledContext();
    const conversationHistory = messages
      .filter(m => m.text)
      .map(m => ({ role: m.isUser ? "user" as const : "assistant" as const, content: m.text }));
    conversationHistory.push({ role: "user", content: fullMsgForAI });

    // Show execution panel with real progress
    setIsExecuting(true);
    setIsExecutionExpanded(true);
    setExecutionElapsed(0);
    setExecutionFinalMessage("");
    
    const thinkingGroups: TaskGroup[] = [
      { id: `g-${Date.now()}-0`, title: t(lang, "task.analyzing_request"), description: "", subtasks: [], status: "running", isExpanded: true },
      { id: `g-${Date.now()}-1`, title: t(lang, "task.generating_response"), description: "", subtasks: [], status: "pending", isExpanded: false },
    ];
    setExecutionGroups(thinkingGroups);

    // ── Initialize Agent Work Panel ──
    setAgentPanelOpen(true);
    setAgentTaskTitle(userMsg.slice(0, 80));
    setAgentEvents([]);
    setAgentRole("planner");
    const baseTodos: AgentTodo[] = [
      { id: "t1", title: "تحليل طلب المستخدم وفهم النية", status: "running" },
      { id: "t2", title: "البحث في قاعدة المعرفة والسياق", status: "pending" },
      { id: "t3", title: "صياغة خطة التنفيذ متعددة الخطوات", status: "pending" },
      { id: "t4", title: "توليد الإجابة عبر النموذج المختار", status: "pending" },
      { id: "t5", title: "مراجعة وتدقيق المخرجات النهائية", status: "pending" },
    ];
    setAgentTodos(baseTodos);
    pushAgentEvent({ type: "terminal", line: `بدء جلسة Sandbox للنموذج: ${currentModel}`, ts: Date.now() });
    pushAgentEvent({ type: "terminal", line: `chat_mode=${chatMode}  context_messages=${conversationHistory.length}`, ts: Date.now() });
    if (knowledgeContext) pushAgentEvent({ type: "file", path: "knowledge/context.md", action: "read", ts: Date.now() });

    if (executionTimerRef.current) clearInterval(executionTimerRef.current);
    executionTimerRef.current = setInterval(() => {
      setExecutionElapsed(prev => prev + 1);
    }, 1000);

    // Add empty assistant message for streaming
    setMessages(prev => [...prev, { text: "", isUser: false, isStreaming: true }]);
    setIsStreaming(true);

    try {
      const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: conversationHistory,
          model: currentModel,
          chatMode,
          knowledgeContext: knowledgeContext || undefined,
        }),
      });

      if (!resp.ok) {
        const errData = await resp.json().catch(() => ({ error: "حدث خطأ غير معروف" }));
        throw new Error(errData.error || `HTTP ${resp.status}`);
      }

      if (!resp.body) throw new Error("No response body");

      // Mark first group done, second running
      setExecutionGroups(prev => prev.map((g, i) => ({
        ...g,
        status: i === 0 ? "done" : "running",
        isExpanded: i === 1,
      })));

      // advance todos & switch agent to executor
      setAgentTodos(prev => prev.map(t =>
        t.id === "t1" ? { ...t, status: "done" } :
        t.id === "t2" ? { ...t, status: "done" } :
        t.id === "t3" ? { ...t, status: "done" } :
        t.id === "t4" ? { ...t, status: "running" } : t
      ));
      setAgentRole("executor");
      pushAgentEvent({ type: "terminal", line: `استدعاء النموذج: ${currentModel} ✓ متصل`, ts: Date.now() });
      pushAgentEvent({ type: "browser", url: `https://ai.gateway.lovable.dev/v1/chat/completions`, title: "Lovable AI Gateway", ts: Date.now() });

      // Stream response token by token
      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";
      let assistantSoFar = "";
      let streamDone = false;

      while (!streamDone) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") {
            streamDone = true;
            break;
          }

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              assistantSoFar += content;
              setMessages(prev => {
                const last = prev[prev.length - 1];
                if (last && !last.isUser) {
                  return prev.map((m, i) => i === prev.length - 1 ? { ...m, text: assistantSoFar } : m);
                }
                return prev;
              });
            }
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }

      // Final flush
      if (textBuffer.trim()) {
        for (let raw of textBuffer.split("\n")) {
          if (!raw) continue;
          if (raw.endsWith("\r")) raw = raw.slice(0, -1);
          if (raw.startsWith(":") || raw.trim() === "") continue;
          if (!raw.startsWith("data: ")) continue;
          const jsonStr = raw.slice(6).trim();
          if (jsonStr === "[DONE]") continue;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              assistantSoFar += content;
              setMessages(prev => prev.map((m, i) => i === prev.length - 1 && !m.isUser ? { ...m, text: assistantSoFar } : m));
            }
          } catch {}
        }
      }

      // Mark streaming done
      setMessages(prev => prev.map((m, i) => i === prev.length - 1 && !m.isUser ? { ...m, isStreaming: false } : m));
      setIsStreaming(false);
      setExecutionFinalMessage(assistantSoFar);

      // complete todos
      setAgentRole("verifier");
      pushAgentEvent({ type: "terminal", line: `اكتمل البث — ${assistantSoFar.length} حرف`, ts: Date.now() });
      pushAgentEvent({ type: "code", path: "output/response.md", preview: assistantSoFar.slice(0, 600), ts: Date.now() });
      setAgentTodos(prev => prev.map(t =>
        t.id === "t4" ? { ...t, status: "done" } :
        t.id === "t5" ? { ...t, status: "done" } : t
      ));

      // Save assistant message to DB
      if (convId && assistantSoFar.trim()) {
        saveMessage(convId, "assistant", assistantSoFar);
      }

    } catch (e: any) {
      console.error("AI chat error:", e);
      const errorMsg = e.message || "حدث خطأ أثناء الاتصال بالذكاء الاصطناعي";
      setMessages(prev => {
        const last = prev[prev.length - 1];
        if (last && !last.isUser && !last.text) {
          return prev.map((m, i) => i === prev.length - 1 ? { ...m, text: `⚠️ ${errorMsg}`, isStreaming: false } : m);
        }
        return [...prev, { text: `⚠️ ${errorMsg}`, isUser: false }];
      });
      setIsStreaming(false);
      toast.error(errorMsg);
    } finally {
      // Clean up execution panel
      if (executionTimerRef.current) clearInterval(executionTimerRef.current);
      setExecutionGroups(prev => prev.map(g => ({ ...g, status: "done" as const })));
      setTimeout(() => { setIsExecutionExpanded(false); }, 1500);
      setTimeout(() => {
        setIsExecuting(false);
        setExecutionGroups([]);
        setExecutionFinalMessage("");
        setExecutionElapsed(0);
      }, 4000);
    }
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
          <button onClick={() => setIsCreditsOpen(true)} className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"><Sparkles className="h-5 w-5" /></button>
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
            <span className="text-sm text-muted-foreground">{planLabel(plan.tier, lang)}</span>
            {plan.tier === "free" && (
              <>
                <span className="text-muted-foreground/30">|</span>
                <button onClick={() => setMorePanel("upgrade_pro")} className="text-sm font-semibold text-accent transition-all hover:brightness-110 active:scale-95">{t(lang, "app.upgrade_to_pro")}</button>
              </>
            )}
          </div>
        </motion.div>

        {messages.length > 0 ? (
          <div className="mt-6 space-y-1">
            {messages.map((msg, i) => (
              <ChatMessage key={i} message={msg.text} isUser={msg.isUser} files={msg.files} steps={msg.steps} isStreaming={msg.isStreaming} />
            ))}
          </div>
        ) : (
          <motion.h1 initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-8 text-center text-2xl font-bold text-accent leading-relaxed">{t(lang, "landing.how_can_i_help")}</motion.h1>
        )}

        {/* Execution Panel - Appears above input when executing */}
        <AnimatePresence>
          {isExecuting && (
            <ExecutionPanel
              taskGroups={executionGroups}
              isVisible={isExecuting}
              isExpanded={isExecutionExpanded}
              onToggleExpand={() => setIsExecutionExpanded(!isExecutionExpanded)}
              onToggleGroup={(id) => setExecutionGroups(prev => prev.map(g => g.id === id ? { ...g, isExpanded: !g.isExpanded } : g))}
              finalMessage={executionFinalMessage}
              elapsedSeconds={executionElapsed}
              onContinue={() => {
                toast.success(t(lang, "execution.can_continue"));
                setIsExecuting(false);
                setExecutionGroups([]);
                setExecutionFinalMessage("");
                setExecutionElapsed(0);
                if (executionTimerRef.current) clearInterval(executionTimerRef.current);
              }}
            />
          )}
        </AnimatePresence>

        {/* Agent Work Panel — Sandbox + Multi-Agent live view */}
        <AgentWorkPanel
          open={agentPanelOpen}
          onClose={() => setAgentPanelOpen(false)}
          taskTitle={agentTaskTitle}
          elapsedSec={executionElapsed}
          todos={agentTodos}
          events={agentEvents}
          activeAgent={agentRole}
          isRunning={isExecuting}
        />
        {/* sentinel */}
        <AnimatePresence>
        </AnimatePresence>

        {/* Input Card — Asymmetric composer with side rail */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="relative mt-6 overflow-hidden rounded-3xl border border-border/60 bg-card shadow-[0_8px_40px_-12px_hsl(var(--erfan-gold)/0.25)]">
          {/* Top accent stripe */}
          <div className="absolute inset-x-0 top-0 h-[2px]" style={{ background: "linear-gradient(90deg, transparent, hsl(var(--erfan-gold) / 0.6), hsl(var(--erfan-green) / 0.6), transparent)" }} />

          <div className="flex">
            {/* Side rail (tools) */}
            <div className={`relative flex flex-col items-center gap-1 ${isRTL(lang) ? "border-l" : "border-r"} border-border/50 bg-secondary/30 px-2 py-3`}>
              <div className="relative">
                <button onClick={() => setIsPlusMenuOpen(!isPlusMenuOpen)} className={`flex h-9 w-9 items-center justify-center rounded-xl transition-all ${isPlusMenuOpen ? "bg-accent text-accent-foreground scale-110" : "text-muted-foreground hover:bg-card hover:text-accent"}`}>
                  <Plus className={`h-[18px] w-[18px] transition-transform ${isPlusMenuOpen ? "rotate-45" : ""}`} />
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
              <button onClick={() => setIsRecordingDialogOpen(true)} className="flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground hover:bg-card hover:text-accent transition-colors"><SlidersHorizontal className="h-[18px] w-[18px]" /></button>
              <button onClick={handleMic} className={`flex h-9 w-9 items-center justify-center rounded-xl transition-colors ${isRecording ? "bg-red-500/15 text-red-500 animate-pulse" : "text-muted-foreground hover:bg-card hover:text-accent"}`}><Mic className="h-[18px] w-[18px]" /></button>
            </div>

            {/* Content column */}
            <div className="flex-1 p-4">
              {activeChips.length > 0 && (
                <div className="mb-2 flex flex-wrap gap-1.5">
                  {activeChips.map((label) => (
                    <span key={label} className="inline-flex items-center gap-1 rounded-full border border-accent/40 bg-accent/10 px-2.5 py-1 text-xs font-medium text-accent">
                      {label}
                      <button onClick={() => toggleChip(label)} className="hover:opacity-70"><X className="h-3 w-3" /></button>
                    </span>
                  ))}
                </div>
              )}
              <textarea value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder={activeChips.length > 0 ? `${t(lang, "app.active_tasks")} ${activeChips.join("، ")}` : t(lang, "landing.input_placeholder")} rows={3} className="w-full resize-none bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none leading-relaxed" dir={dir} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }} />
              {attachedFiles.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {attachedFiles.map((file, index) => {
                    const uploaded = uploadedAttachments.find(u => u.name === file.name && u.size === file.size);
                    const isUploading = !uploaded;
                    return (
                      <div key={index} className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs text-foreground ${isUploading ? "border-accent/40 bg-accent/5" : "border-border bg-secondary"}`}>
                        {isUploading ? (
                          <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-accent border-t-transparent" />
                        ) : file.type.startsWith("image/") ? (
                          <Image className="h-3.5 w-3.5 text-accent" />
                        ) : (
                          <FileText className="h-3.5 w-3.5 text-accent" />
                        )}
                        <span className="max-w-[120px] truncate">{file.name}</span>
                        <button onClick={() => removeFile(index)} className="hover:text-destructive transition-colors"><X className="h-3 w-3" /></button>
                      </div>
                    );
                  })}
                </div>
              )}
              {/* Bottom row: hint + send pill */}
              <div className="mt-3 flex items-center justify-between gap-2">
                <span className="text-[11px] text-muted-foreground/70 hidden sm:inline">
                  <kbd className="rounded-md border border-border/60 bg-secondary/60 px-1.5 py-0.5 font-mono text-[10px]">Enter</kbd> {t(lang, "landing.input_placeholder").slice(0, 0)}↵
                </span>
                <button onClick={handleSend} disabled={!inputValue.trim() && attachedFiles.length === 0} className="group flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-background transition-all hover:scale-[1.03] active:scale-95 disabled:opacity-30 disabled:hover:scale-100" style={{ background: "linear-gradient(135deg, hsl(var(--erfan-gold)), hsl(var(--erfan-green)))" }}>
                  <span>{t(lang, "landing.send_button") || "Send"}</span>
                  <Send className={`h-4 w-4 ${isRTL(lang) ? "rotate-180" : ""} transition-transform group-hover:translate-x-0.5`} />
                </button>
              </div>
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

        {/* Bottom Customize Carousel */}
        {messages.length === 0 && (
          <CustomizeCarousel lang={lang} dir={dir} />
        )}
      </div>

      {/* Overlays */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} onNewTask={() => { startNewChat(); setInputValue(""); setActiveChips([]); toast(t(lang, "new_task.created")); }} onNavigate={(page) => { 
        if (page === "search") { setIsSearchOpen(true); }
        else if (page === "discover") { setIsDiscoverOpen(true); }
        else if (page === "agents") { toast(`${t(lang, "sidebar.agents")} - ${t(lang, "coming_soon")}`); }
      }} conversations={dbConversations} onSelectConversation={(id) => { loadConvMessages(id); }} onDeleteConversation={(id) => { deleteConversation(id); toast.success(t(lang, "settings.history_cleared")); }} onRenameConversation={(id, title) => { updateTitle(id, title); }} />
      <ProfileDropdown isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} onLogout={onLogout} onOpenSettings={() => setIsSettingsOpen(true)} onOpenProfile={() => setIsProfilePanelOpen(true)} onOpenKnowledge={() => setIsKnowledgeOpen(true)} onUpgrade={() => setMorePanel("upgrade_pro")} onHome={onLogout} onHelp={() => setIsHelpOpen(true)} />
      <NotificationsPanel isOpen={isNotificationsOpen} onClose={() => setIsNotificationsOpen(false)} onUpgrade={() => { setIsNotificationsOpen(false); setMorePanel("upgrade_pro"); }} />
      <ModelSelector isOpen={isModelSelectorOpen} onClose={() => setIsModelSelectorOpen(false)} currentModel={currentModel} onSelect={(m) => { setCurrentModel(m); toast(`${t(lang, "model.switched_to")} ${m}`); }} onUpgrade={() => setMorePanel("upgrade_pro")} />
      <SettingsPanel isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} onChangeModel={(m) => setCurrentModel(m)} onClearHistory={() => { clearAllConversations(); setActiveChips([]); }} onLogout={onLogout} currentModel={currentModel} />
      <ProfilePanel isOpen={isProfilePanelOpen} onClose={() => setIsProfilePanelOpen(false)} onLogout={onLogout} />
      <KnowledgePanel isOpen={isKnowledgeOpen} onClose={() => setIsKnowledgeOpen(false)} />
      <HelpPanel isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} onUpgrade={() => { setIsHelpOpen(false); setMorePanel("upgrade_pro"); }} />
      <CreditsPanel isOpen={isCreditsOpen} onClose={() => setIsCreditsOpen(false)} onUpgrade={() => { setIsCreditsOpen(false); setMorePanel("upgrade_pro"); }} usage={usage} />
      <SearchConversationsPanel isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} messages={messages} onSelectMessage={(msg) => { setInputValue(msg); }} />
      <DiscoverPanel isOpen={isDiscoverOpen} onClose={() => setIsDiscoverOpen(false)} onUseTemplate={(prompt) => { setInputValue(prompt); }} />
      <ScheduleTaskPanel isOpen={morePanel === "schedule_task"} onClose={() => setMorePanel(null)} />
      <WideResearchPanel isOpen={morePanel === "wide_research"} onClose={() => setMorePanel(null)} onSubmit={(q) => setInputValue(q)} />
      <SpreadsheetPanel isOpen={morePanel === "spreadsheet"} onClose={() => setMorePanel(null)} />
      <VisualizationPanel isOpen={morePanel === "visualization"} onClose={() => setMorePanel(null)} />
      <VideoPanel isOpen={morePanel === "video"} onClose={() => setMorePanel(null)} onSubmit={(p) => setInputValue(p)} />
      <AudioPanel isOpen={morePanel === "audio"} onClose={() => setMorePanel(null)} onSubmit={(p) => setInputValue(p)} />
      <ChatModePanel isOpen={morePanel === "chat_mode"} onClose={() => setMorePanel(null)} onSelect={(m) => { setChatMode(m); }} />
      <PlaybookPanel isOpen={morePanel === "playbook"} onClose={() => setMorePanel(null)} onUse={(p) => setInputValue(p)} />
      <UpgradeProPanel isOpen={morePanel === "upgrade_pro"} onClose={() => { setMorePanel(null); setUpgradeHighlight(null); }} highlightPlan={upgradeHighlight} />

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
                    {/* Export & Share buttons */}
                    <div className="flex items-center gap-2 pt-2 border-t border-border">
                      <button onClick={() => exportMeetingAsTxt(viewingMeeting)} className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-secondary transition-colors">
                        <FileText className="h-3 w-3" />{t(lang, "meeting.export_txt")}
                      </button>
                      <button onClick={() => exportMeetingAsPdf(viewingMeeting)} className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-secondary transition-colors">
                        <BookOpen className="h-3 w-3" />{t(lang, "meeting.export_pdf")}
                      </button>
                      <button onClick={() => exportMeetingAudio(viewingMeeting)} className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-secondary transition-colors">
                        <Volume2 className="h-3 w-3" />{t(lang, "meeting.export_audio")}
                      </button>
                      <button onClick={() => shareMeeting(viewingMeeting)} className="flex items-center gap-1.5 rounded-lg border border-accent/30 bg-accent/5 px-3 py-1.5 text-xs font-medium text-accent hover:bg-accent/10 transition-colors">
                        <Share2 className="h-3 w-3" />{t(lang, "meeting.share")}
                      </button>
                    </div>
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

                {/* Live Transcript Display */}
                {sttEnabled && (meetingState === "recording" || meetingState === "paused" || meetingState === "stopped") && (committedTranscript || liveTranscript) && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="rounded-xl bg-secondary/50 border border-border p-3 space-y-1 max-h-32 overflow-y-auto"
                  >
                    <p className="text-xs font-semibold text-accent flex items-center gap-1.5">
                      <MessageSquare className="h-3 w-3" />
                      {t(lang, "meeting.stt_transcript")}
                    </p>
                    <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                      {committedTranscript}
                      {liveTranscript && <span className="text-muted-foreground italic">{liveTranscript}</span>}
                    </p>
                  </motion.div>
                )}

                <p className="text-sm text-muted-foreground">
                  {meetingState === "stopped" && meetingSummary ? meetingSummary : t(lang, "meeting.summary_auto")}
                </p>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground font-mono">
                      {Math.floor(meetingSeconds / 60).toString().padStart(1, "0")}:{(meetingSeconds % 60).toString().padStart(2, "0")} / 2:00:00
                    </span>
                    {/* STT Toggle */}
                    <button
                      onClick={() => {
                        if (!sttEnabled) {
                          setSttEnabled(true);
                          if (meetingState === "recording") startSpeechRecognition();
                        } else {
                          setSttEnabled(false);
                          stopSpeechRecognition();
                        }
                      }}
                      className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors ${sttEnabled ? "bg-accent/15 text-accent border border-accent/30" : "bg-secondary text-muted-foreground border border-border hover:text-foreground"}`}
                      title={t(lang, "meeting.stt_toggle")}
                    >
                      <MessageSquare className="h-3 w-3" />
                      {t(lang, "meeting.stt_label")}
                    </button>
                  </div>
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
                        stopSpeechRecognition();
                        setLiveTranscript("");
                        setCommittedTranscript("");
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
                          onClick={async () => {
                            setMeetingState("stopped");
                            if (meetingTimerRef.current) clearInterval(meetingTimerRef.current);
                            if (waveformIntervalRef.current) clearInterval(waveformIntervalRef.current);
                            if (meetingAudioRef.current) { meetingAudioRef.current.getTracks().forEach(t => t.stop()); meetingAudioRef.current = null; }
                            stopSpeechRecognition();
                            const fullTranscript = committedTranscript + liveTranscript;
                            // Stop MediaRecorder & save to DB
                            let audioBlob: Blob | null = null;
                            if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
                              const recorder = mediaRecorderRef.current;
                              const stopPromise = new Promise<Blob>((resolve) => {
                                recorder.onstop = () => {
                                  resolve(new Blob(audioChunksRef.current, { type: "audio/webm" }));
                                };
                              });
                              recorder.stop();
                              audioBlob = await stopPromise;
                            }
                            const mins = Math.floor(meetingSeconds / 60);
                            const summaryText = t(lang, "meeting.auto_summary").replace("{mins}", String(mins || 1));
                            setMeetingSummary(summaryText);
                            if (fullTranscript.trim()) setMeetingNotes(fullTranscript.trim());
                            const saved = await dbSaveMeeting({ title: `${t(lang, "meeting.meeting_num")} #${savedMeetings.length + 1}`, duration: meetingSeconds, notes: fullTranscript.trim() || undefined, summary: summaryText, transcript: fullTranscript.trim() || undefined });
                            if (saved && audioBlob) {
                              await uploadAudio(audioBlob, saved.id);
                            }
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
                          onClick={async () => {
                            setMeetingState("stopped");
                            if (meetingTimerRef.current) clearInterval(meetingTimerRef.current);
                            if (waveformIntervalRef.current) clearInterval(waveformIntervalRef.current);
                            if (meetingAudioRef.current) { meetingAudioRef.current.getTracks().forEach(t => t.stop()); meetingAudioRef.current = null; }
                            stopSpeechRecognition();
                            const fullTranscript2 = committedTranscript + liveTranscript;
                            let audioBlob2: Blob | null = null;
                            if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
                              const recorder = mediaRecorderRef.current;
                              const stopPromise = new Promise<Blob>((resolve) => {
                                recorder.onstop = () => {
                                  resolve(new Blob(audioChunksRef.current, { type: "audio/webm" }));
                                };
                              });
                              recorder.stop();
                              audioBlob2 = await stopPromise;
                            }
                            const mins = Math.floor(meetingSeconds / 60);
                            const summaryText = t(lang, "meeting.auto_summary").replace("{mins}", String(mins || 1));
                            setMeetingSummary(summaryText);
                            if (fullTranscript2.trim()) setMeetingNotes(fullTranscript2.trim());
                            const saved = await dbSaveMeeting({ title: `${t(lang, "meeting.meeting_num")} #${savedMeetings.length + 1}`, duration: meetingSeconds, notes: fullTranscript2.trim() || undefined, summary: summaryText, transcript: fullTranscript2.trim() || undefined });
                            if (saved && audioBlob2) {
                              await uploadAudio(audioBlob2, saved.id);
                            }
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
                            // Start MediaRecorder for audio export
                            audioChunksRef.current = [];
                            try {
                              const recorder = new MediaRecorder(stream);
                              recorder.ondataavailable = (e) => { if (e.data.size > 0) audioChunksRef.current.push(e.data); };
                              recorder.start();
                              mediaRecorderRef.current = recorder;
                            } catch {}
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
                            waveformIntervalRef.current = setInterval(() => {
                              setMeetingWaveform(Array.from({ length: 30 }, () => Math.random() * 0.7 + 0.1));
                            }, 200);
                          }
                          setMeetingState("recording");
                          setMeetingSeconds(0);
                          setMeetingNotes("");
                          setMeetingSummary("");
                          setLiveTranscript("");
                          setCommittedTranscript("");
                          if (sttEnabled) startSpeechRecognition();
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
                                  dbUpdateMeeting(meeting.id, { title: editingTitle || meeting.title });
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
                        <div className="flex items-center gap-0.5 flex-wrap">
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
                          {/* Export dropdown */}
                          <div className="relative">
                            <button
                              onClick={(e) => { e.stopPropagation(); setExportMenuId(exportMenuId === meeting.id ? null : meeting.id); }}
                              className="rounded-lg p-2 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                              title={t(lang, "meeting.export")}
                            >
                              <Download className="h-3.5 w-3.5" />
                            </button>
                            <AnimatePresence>
                              {exportMenuId === meeting.id && (
                                <motion.div
                                  initial={{ opacity: 0, scale: 0.95, y: -5 }}
                                  animate={{ opacity: 1, scale: 1, y: 0 }}
                                  exit={{ opacity: 0, scale: 0.95, y: -5 }}
                                  className="absolute top-full right-0 z-50 mt-1 w-44 rounded-xl border border-border bg-card p-1.5 shadow-xl"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <button onClick={() => { exportMeetingAsTxt(meeting); setExportMenuId(null); }} className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-foreground hover:bg-secondary transition-colors">
                                    <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                                    {t(lang, "meeting.export_txt")}
                                  </button>
                                  <button onClick={() => { exportMeetingAsPdf(meeting); setExportMenuId(null); }} className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-foreground hover:bg-secondary transition-colors">
                                    <BookOpen className="h-3.5 w-3.5 text-muted-foreground" />
                                    {t(lang, "meeting.export_pdf")}
                                  </button>
                                  <button onClick={() => { exportMeetingAudio(meeting); setExportMenuId(null); }} className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-foreground hover:bg-secondary transition-colors">
                                    <Volume2 className="h-3.5 w-3.5 text-muted-foreground" />
                                    {t(lang, "meeting.export_audio")}
                                  </button>
                                  <div className="h-px bg-border my-1" />
                                  <button onClick={() => { shareMeeting(meeting); setExportMenuId(null); }} className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-foreground hover:bg-secondary transition-colors">
                                    <Share2 className="h-3.5 w-3.5 text-muted-foreground" />
                                    {t(lang, "meeting.share")}
                                  </button>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              dbDeleteMeeting(meeting.id);
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
                        if (savedMeetings.length > 0) {
                          dbUpdateMeeting(savedMeetings[0].id, { notes: meetingNotes });
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
  const { user, loading, signOut } = useAuth();
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

  // Sync screen state with auth state
  useEffect(() => {
    if (!loading) {
      if (user) {
        setScreen("app");
      } else if (screen === "app") {
        setScreen("landing");
      }
    }
  }, [user, loading]);

  const handleLogout = async () => {
    await signOut();
    setScreen("landing");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gradient-bg-dark">
        <motion.div
          className="relative"
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{ background: "radial-gradient(circle, hsl(43 80% 55% / 0.2), transparent 70%)" }}
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
          <ErfanAILogo className="h-20 w-20 relative z-10" />
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="mt-6 text-sm font-medium"
          style={{ color: "hsl(43 80% 55%)" }}
        >
          ErfanAI
        </motion.p>
      </div>
    );
  }

  return (
    <LangContext.Provider value={{ lang, setLang }}>
      <AnimatePresence mode="wait">
        {screen === "landing" && !user && (
          <motion.div key="landing" exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
            <LandingPage onLogin={() => setScreen("login")} onRegister={() => setScreen("login")} />
          </motion.div>
        )}
        {screen === "login" && !user && (
          <motion.div key="login" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
            <LoginScreen onLogin={() => setScreen("app")} />
          </motion.div>
        )}
        {screen === "app" && user && (
          <motion.div key="app" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
            <AppScreen onLogout={handleLogout} />
          </motion.div>
        )}
      </AnimatePresence>
    </LangContext.Provider>
  );
};

export default ErfanReplica;
