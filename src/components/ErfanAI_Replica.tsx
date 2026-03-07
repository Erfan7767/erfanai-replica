import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ErfanAILogo from "@/components/ErfanAILogo";
import { toast } from "sonner";
import {
  Hand,
  Mail,
  Menu,
  X,
  Plus,
  Search,
  Bot,
  Upload,
  Mic,
  Headphones,
  Globe,
  ArrowLeft,
  Settings,
  LogOut,
  Sparkles,
  Zap,
  MessageSquare,
  Bell,
  ChevronDown,
  Scissors,
  SlidersHorizontal,
  Code,
  Presentation,
  Smartphone,
  Palette,
  MoreHorizontal,
  LayoutGrid,
  AlignJustify,
  Send,
  ArrowRightLeft,
  HelpCircle,
  Home,
  ExternalLink,
  User,
  BookOpen,
  ChevronLeft,
  ArrowRight,
  Upload as UploadIcon,
  Camera,
  Image,
  FileText,
  Copy,
  Share2,
  Trash2,
  Volume2,
  VolumeX,
} from "lucide-react";

/* ═══════════════════════ LANDING MENU ═══════════════════════ */
const LandingMenu = ({ isOpen, onClose, onLogin }: { isOpen: boolean; onClose: () => void; onLogin: () => void }) => (
  <AnimatePresence>
    {isOpen && (
      <>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-40"
          style={{ background: "rgba(0,0,0,0.5)" }}
        />
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="absolute left-4 top-14 z-50 w-56 rounded-xl border bg-white p-2 shadow-xl"
          style={{ borderColor: "#e5e5e5" }}
          dir="rtl"
        >
          <button
            onClick={() => { onLogin(); onClose(); }}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <User className="h-4 w-4" />
            <span>تسجيل الدخول</span>
          </button>
          <button
            onClick={() => { onLogin(); onClose(); }}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <Mail className="h-4 w-4" />
            <span>تسجيل حساب جديد</span>
          </button>
          <div className="my-1 h-px bg-gray-200" />
          <button
            onClick={() => { toast("قريباً - صفحة المساعدة"); onClose(); }}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <HelpCircle className="h-4 w-4" />
            <span>المساعدة</span>
          </button>
          <button
            onClick={() => { toast("قريباً - الإعدادات"); onClose(); }}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <Settings className="h-4 w-4" />
            <span>الإعدادات</span>
          </button>
        </motion.div>
      </>
    )}
  </AnimatePresence>
);

/* ═══════════════════════ LANDING PAGE (Light) ═══════════════════════ */
const LandingPage = ({ onLogin, onRegister }: { onLogin: () => void; onRegister: () => void }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [landingInput, setLandingInput] = useState("");
  const landingFileRef = useRef<HTMLInputElement>(null);
  const [landingFiles, setLandingFiles] = useState<File[]>([]);

  const handleLandingFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setLandingFiles(prev => [...prev, ...files]);
      toast.success(`تم إرفاق ${files.length} ملف`);
    }
  };

  const handleLandingSend = () => {
    if (landingInput.trim() || landingFiles.length > 0) {
      toast("يرجى تسجيل الدخول أولاً للبدء", { action: { label: "تسجيل الدخول", onClick: onLogin } });
      setLandingInput("");
      setLandingFiles([]);
    }
  };

  const handleChipClick = (label: string) => {
    toast(`${label} - سجّل الدخول للبدء`, { action: { label: "تسجيل الدخول", onClick: onLogin } });
  };

  return (
    <div className="relative flex min-h-screen flex-col font-cairo" dir="rtl" style={{ background: "#f5f5f4" }}>
      {/* Header */}
      <header className="relative flex items-center justify-between px-4 py-3">
        {/* Right: Logo */}
        <div className="flex items-center gap-2">
          <ErfanAILogo className="h-12 w-12" color="#1a1a1a" />
          <span className="text-xl font-bold" style={{ color: "#1a1a1a" }}>ErfanAI</span>
        </div>

        {/* Left: Buttons + Hamburger */}
        <div className="flex items-center gap-2">
          <button
            onClick={onLogin}
            className="rounded-lg px-4 py-2 text-sm font-semibold transition-colors hover:opacity-90"
            style={{ background: "#1a1a1a", color: "#fff" }}
          >
            تسجيل الدخول
          </button>
          <button
            onClick={onRegister}
            className="rounded-lg border px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100"
            style={{ borderColor: "#d4d4d4", color: "#525252" }}
          >
            تسجيل
          </button>
          <button
            className="p-2 transition-colors hover:bg-gray-200 rounded-lg"
            style={{ color: "#525252" }}
            onClick={() => setIsMenuOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>

        <LandingMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} onLogin={onLogin} />
      </header>

      {/* Main content */}
      <div className="flex flex-1 flex-col items-center justify-center px-4 pb-10">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-8 text-center text-2xl font-bold leading-relaxed"
          style={{ color: "#1a1a1a" }}
        >
          كيف يمكنني مساعدتك؟
        </motion.h1>

        {/* Input card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="w-full max-w-lg rounded-2xl border p-4 shadow-sm"
          style={{ background: "#fff", borderColor: "#e5e5e5" }}
        >
          <textarea
            value={landingInput}
            onChange={(e) => setLandingInput(e.target.value)}
            placeholder="قم بتعيين مهمة أو اسأل أي شيء"
            rows={3}
            className="w-full resize-none bg-transparent text-sm outline-none leading-relaxed"
            style={{ color: "#1a1a1a" }}
            dir="rtl"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleLandingSend();
              }
            }}
          />
          {/* Attached files */}
          {landingFiles.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {landingFiles.map((file, i) => (
                <div key={i} className="flex items-center gap-1.5 rounded-lg border px-2 py-1 text-xs" style={{ borderColor: "#d4d4d4", color: "#525252" }}>
                  {file.type.startsWith("image/") ? <Image className="h-3.5 w-3.5" /> : <FileText className="h-3.5 w-3.5" />}
                  <span className="max-w-[100px] truncate">{file.name}</span>
                  <button onClick={() => setLandingFiles(prev => prev.filter((_, idx) => idx !== i))} className="hover:text-red-500">
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
          <div className="mt-2 flex items-center justify-between">
            <button
              onClick={handleLandingSend}
              disabled={!landingInput.trim() && landingFiles.length === 0}
              className="flex h-9 w-9 items-center justify-center rounded-full transition-colors disabled:opacity-30"
              style={{ background: "#1a1a1a", color: "#fff" }}
            >
              <Send className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-2">
              <button
                onClick={() => landingFileRef.current?.click()}
                className="flex h-9 w-9 items-center justify-center rounded-full border transition-colors hover:bg-gray-100"
                style={{ borderColor: "#d4d4d4", color: "#a3a3a3" }}
              >
                <UploadIcon className="h-4 w-4" />
              </button>
              <button
                onClick={() => landingFileRef.current?.click()}
                className="flex h-9 w-9 items-center justify-center rounded-full border transition-colors hover:bg-gray-100"
                style={{ borderColor: "#d4d4d4", color: "#a3a3a3" }}
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>
          <input
            ref={landingFileRef}
            type="file"
            className="hidden"
            multiple
            onChange={handleLandingFileSelect}
          />
        </motion.div>

        {/* Quick action chips */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="mt-5 flex flex-wrap justify-center gap-2.5"
        >
          {[
            { icon: Code, label: "إنشاء موقع ويب" },
            { icon: Presentation, label: "إنشاء عروض تقديمية" },
            { icon: Smartphone, label: "تطوير التطبيقات" },
            { icon: Palette, label: "تصميم" },
            { icon: MoreHorizontal, label: "المزيد" },
          ].map((chip) => (
            <button
              key={chip.label}
              onClick={() => handleChipClick(chip.label)}
              className="flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium transition-colors hover:bg-white active:scale-95"
              style={{ borderColor: "#d4d4d4", color: "#525252", background: "transparent" }}
            >
              <chip.icon className="h-4 w-4" />
              {chip.label}
            </button>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

/* ═══════════════════════ LOGIN SCREEN ═══════════════════════ */
const LoginScreen = ({ onLogin }: { onLogin: () => void }) => {
  const [email, setEmail] = useState("");

  const handleEmailLogin = () => {
    if (email.trim()) {
      toast.success("جاري تسجيل الدخول...");
      setTimeout(onLogin, 800);
    } else {
      toast.error("يرجى إدخال البريد الإلكتروني");
    }
  };

  return (
    <div
      className="relative flex min-h-screen flex-col overflow-hidden font-cairo"
      dir="rtl"
      style={{ background: "#0a0a0a" }}
    >
      {/* Dot pattern overlay */}
      <div className="dot-pattern absolute inset-0 opacity-10" />

      {/* Header with logo */}
      <header className="relative z-10 flex items-center justify-end px-5 py-4">
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold" style={{ color: "#e5e5e5" }}>ErfanAI</span>
          <ErfanAILogo className="h-11 w-11" color="#e5e5e5" />
        </div>
      </header>

      {/* Main content */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex w-full max-w-md flex-col items-center"
        >
          {/* Logo icon */}
          <div className="mb-6 flex h-32 w-32 items-center justify-center">
            <ErfanAILogo className="h-32 w-32" color="#f5f5f5" />
          </div>

          {/* Title */}
          <h1 className="mb-2 text-2xl font-bold" style={{ color: "#f5f5f5" }}>
            تسجيل الدخول أو التسجيل
          </h1>
          <p className="mb-10 text-sm" style={{ color: "#737373" }}>
            ابدأ الإبداع مع <span style={{ color: "#a3a3a3" }}>ErfanAI</span>
          </p>

          {/* Social buttons */}
          <div className="flex w-full flex-col gap-3">
            {/* Google */}
            <button
              onClick={() => { toast.success("جاري تسجيل الدخول عبر Google..."); setTimeout(onLogin, 800); }}
              className="flex w-full items-center justify-center gap-3 rounded-xl py-4 text-sm font-medium transition-colors hover:bg-[#333]"
              style={{ background: "#262626", color: "#e5e5e5" }}
            >
              <span>تابع مع Google</span>
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
            </button>

            {/* Microsoft */}
            <button
              onClick={() => { toast.success("جاري تسجيل الدخول عبر Microsoft..."); setTimeout(onLogin, 800); }}
              className="flex w-full items-center justify-center gap-3 rounded-xl py-4 text-sm font-medium transition-colors hover:bg-[#333]"
              style={{ background: "#262626", color: "#e5e5e5" }}
            >
              <span>تابع مع Microsoft</span>
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <rect x="1" y="1" width="10" height="10" fill="#F25022" />
                <rect x="13" y="1" width="10" height="10" fill="#7FBA00" />
                <rect x="1" y="13" width="10" height="10" fill="#00A4EF" />
                <rect x="13" y="13" width="10" height="10" fill="#FFB900" />
              </svg>
            </button>

            {/* Apple */}
            <button
              onClick={() => { toast.success("جاري تسجيل الدخول عبر Apple..."); setTimeout(onLogin, 800); }}
              className="flex w-full items-center justify-center gap-3 rounded-xl py-4 text-sm font-medium transition-colors hover:bg-[#333]"
              style={{ background: "#262626", color: "#e5e5e5" }}
            >
              <span>تابع مع Apple</span>
              <svg className="h-5 w-5" fill="#e5e5e5" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </svg>
            </button>
          </div>

          {/* Divider */}
          <div className="my-6 flex w-full items-center gap-3">
            <div className="h-px flex-1" style={{ background: "#333" }} />
            <span className="text-sm" style={{ color: "#737373" }}>أو</span>
            <div className="h-px flex-1" style={{ background: "#333" }} />
          </div>

          {/* Email input */}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="أدخل عنوان بريدك الإلكتروني"
            className="w-full rounded-xl px-4 py-4 text-sm outline-none"
            style={{ background: "#1a1a1a", border: "1px solid #333", color: "#e5e5e5" }}
            dir="rtl"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleEmailLogin();
            }}
          />

          {/* Continue button */}
          <button
            onClick={handleEmailLogin}
            className="mt-4 w-full rounded-xl py-4 text-sm font-semibold transition-all hover:bg-[#4a4a4a]"
            style={{ background: "#404040", color: "#d4d4d4" }}
          >
            استمرار
          </button>
        </motion.div>
      </div>
    </div>
  );
};

/* ═══════════════════════ SIDEBAR ═══════════════════════ */
const Sidebar = ({ isOpen, onClose, onNewTask, onNavigate }: { isOpen: boolean; onClose: () => void; onNewTask: () => void; onNavigate: (page: string) => void }) => (
  <AnimatePresence>
    {isOpen && (
      <>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-40"
          style={{ background: "hsl(0 0% 0% / 0.7)" }}
        />
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed right-0 top-0 z-50 flex h-full w-72 flex-col bg-background border-l border-border"
          dir="rtl"
        >
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h2 className="text-lg font-bold text-accent">ErfanAI</h2>
            <button onClick={onClose} className="rounded-lg p-2 text-muted-foreground hover:bg-secondary transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="flex-1 p-3 space-y-1">
            {[
              { icon: Plus, label: "مهمة جديدة", isAccent: true, action: "new_task" },
              { icon: Bot, label: "الوكلاء", isAccent: false, action: "agents" },
              { icon: Search, label: "بحث", isAccent: false, action: "search" },
              { icon: MessageSquare, label: "المحادثات", isAccent: false, action: "chats" },
              { icon: Sparkles, label: "الاكتشاف", isAccent: false, action: "discover" },
            ].map((item) => (
              <button
                key={item.label}
                onClick={() => {
                  if (item.action === "new_task") { onNewTask(); onClose(); }
                  else { onNavigate(item.action); onClose(); }
                }}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                  item.isAccent
                    ? "bg-accent text-accent-foreground"
                    : "text-foreground hover:bg-secondary"
                }`}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </button>
            ))}
          </nav>

          <div className="border-t border-border p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                E
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Erfan Moharam</p>
                <p className="text-xs text-muted-foreground">الخطة المجانية</p>
              </div>
            </div>
          </div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
);

/* ═══════════════════════ NOTIFICATIONS PANEL ═══════════════════════ */
const NotificationsPanel = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => (
  <AnimatePresence>
    {isOpen && (
      <>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-40"
        />
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="absolute left-14 top-[60px] z-50 w-72 rounded-2xl border border-border bg-card shadow-2xl overflow-hidden"
          dir="rtl"
        >
          <div className="flex items-center justify-between p-4 border-b border-border">
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
              <X className="h-4 w-4" />
            </button>
            <h3 className="text-sm font-bold text-foreground">الإشعارات</h3>
          </div>
          <div className="p-6 text-center">
            <Bell className="mx-auto h-8 w-8 text-muted-foreground/40 mb-2" />
            <p className="text-sm text-muted-foreground">لا توجد إشعارات جديدة</p>
          </div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
);

/* ═══════════════════════ MODEL SELECTOR ═══════════════════════ */
const models = [
  { id: "ErfanAI Max", label: "ErfanAI 1.6 Max", badge: "Pro", desc: "وكيل عالي الأداء مصمم للمهام المعقدة.", badgeColor: "bg-primary text-primary-foreground" },
  { id: "ErfanAI Pro", label: "ErfanAI 1.6", badge: "Pro", desc: "وكيل متعدد الاستخدامات قادر على معظم المهام.", badgeColor: "bg-primary text-primary-foreground" },
  { id: "ErfanAI Lite", label: "ErfanAI 1.6 Lite", badge: null, desc: "وكيل خفيف للمهام اليومية.", badgeColor: "" },
];

const ModelSelector = ({ isOpen, onClose, currentModel, onSelect }: { isOpen: boolean; onClose: () => void; currentModel: string; onSelect: (m: string) => void }) => (
  <AnimatePresence>
    {isOpen && (
      <>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-40"
        />
        <motion.div
          initial={{ opacity: 0, y: -10, scaleY: 0.95 }}
          animate={{ opacity: 1, y: 0, scaleY: 1 }}
          exit={{ opacity: 0, y: -10, scaleY: 0.95 }}
          transition={{ duration: 0.2 }}
          style={{ transformOrigin: "top center" }}
          className="absolute right-4 left-4 top-[56px] z-50 rounded-2xl border border-border bg-card shadow-2xl overflow-hidden"
          dir="rtl"
        >
          <div className="py-2">
            {models.map((model, idx) => (
              <button
                key={model.id}
                onClick={() => { onSelect(model.id); onClose(); }}
                className={`flex w-full items-center justify-between px-5 py-3.5 transition-colors ${
                  idx < models.length - 1 ? "" : ""
                } ${currentModel === model.id ? "bg-secondary/60" : "hover:bg-secondary/40"}`}
              >
                {/* Checkmark on left */}
                <div className="w-6 flex items-center justify-center">
                  {currentModel === model.id && (
                    <svg className="h-5 w-5 text-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>
                {/* Text on right */}
                <div className="flex-1 text-right mr-0 ml-3">
                  <div className="flex items-center gap-2 justify-end">
                    {model.badge && (
                      <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${model.badgeColor}`}>
                        {model.badge}
                      </span>
                    )}
                    <span className="text-sm font-semibold text-foreground">{model.label}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{model.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
);

/* ═══════════════════════ SETTINGS HELPERS ═══════════════════════ */
const SETTINGS_KEY = "erfanai_settings";

interface AppSettings {
  language: string;
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
  theme: "داكن",
  fontSize: "متوسط",
  chatBubbleStyle: "حديث",
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

const applyTheme = (t: string) => {
  if (t === "فاتح") {
    document.documentElement.classList.add("light");
  } else if (t === "داكن") {
    document.documentElement.classList.remove("light");
  } else {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (prefersDark) document.documentElement.classList.remove("light");
    else document.documentElement.classList.add("light");
  }
  localStorage.setItem("erfanai_theme", t);
};

const applyFontSize = (fs: string) => {
  const sizeMap: Record<string, string> = { "صغير": "14px", "متوسط": "16px", "كبير": "18px" };
  document.documentElement.style.fontSize = sizeMap[fs] || "16px";
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
    { id: "general" as const, label: "عام", icon: Settings },
    { id: "appearance" as const, label: "المظهر", icon: Palette },
    { id: "notifications" as const, label: "الإشعارات", icon: Bell },
    { id: "account" as const, label: "الحساب", icon: User },
  ];

  const languages = ["العربية", "English", "Français", "Español", "Deutsch", "Türkçe"];
  const themes = ["داكن", "فاتح", "تلقائي (النظام)"];
  const fontSizes = ["صغير", "متوسط", "كبير"];
  const bubbleStyles = ["حديث", "كلاسيكي", "فقاعات"];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40"
            style={{ background: "hsl(0 0% 0% / 0.7)" }}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-x-3 top-10 bottom-10 z-50 flex flex-col rounded-2xl border border-border bg-card shadow-2xl overflow-hidden"
            dir="rtl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <button onClick={onClose} className="rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
                <X className="h-5 w-5" />
              </button>
              <h3 className="text-lg font-bold text-foreground">الإعدادات</h3>
              <div className="w-8" />
            </div>

            {/* Tabs */}
            <div className="flex border-b border-border px-2 overflow-x-auto scrollbar-hide">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap border-b-2 ${
                    activeTab === tab.id
                      ? "border-accent text-accent"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
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
                      اللغة
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {languages.map((lang) => (
                        <button
                          key={lang}
                          onClick={() => { updateSetting("language", lang); document.documentElement.dir = (lang === "العربية" || lang === "العربية") ? "rtl" : "ltr"; toast(`تم تغيير اللغة إلى ${lang}`); }}
                          className={`rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                            settings.language === lang
                              ? "bg-accent text-accent-foreground shadow-md"
                              : "bg-secondary text-foreground hover:bg-secondary/80"
                          }`}
                        >
                          {lang}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Default Model */}
                  <div>
                    <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                      <Zap className="h-4 w-4 text-accent" />
                      النموذج الافتراضي
                    </h4>
                    <div className="space-y-2">
                      {models.map((model) => (
                        <button
                          key={model.id}
                          onClick={() => { updateSetting("defaultModel", model.id); onChangeModel(model.id); toast(`تم تعيين ${model.label} كنموذج افتراضي`); }}
                          className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm transition-colors ${
                            settings.defaultModel === model.id
                              ? "bg-accent text-accent-foreground"
                              : "bg-secondary text-foreground hover:bg-secondary/80"
                          }`}
                        >
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
                      البيانات
                    </h4>
                    <button
                      onClick={() => { onClearHistory(); toast.success("تم مسح سجل المحادثات بنجاح"); }}
                      className="w-full rounded-xl bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive hover:bg-destructive/20 transition-colors"
                    >
                      مسح سجل المحادثات
                    </button>
                  </div>
                </motion.div>
              )}

              {/* ── Appearance Tab ── */}
              {activeTab === "appearance" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
                  {/* Theme */}
                  <div>
                    <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                      <Palette className="h-4 w-4 text-accent" />
                      المظهر
                    </h4>
                    <div className="grid grid-cols-3 gap-2">
                      {themes.map((t) => (
                        <button
                          key={t}
                          onClick={() => { updateSetting("theme", t); applyTheme(t); toast(`تم تغيير المظهر إلى ${t}`); }}
                          className={`rounded-xl px-3 py-3 text-xs font-medium transition-all ${
                            settings.theme === t
                              ? "bg-accent text-accent-foreground shadow-md"
                              : "bg-secondary text-foreground hover:bg-secondary/80"
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Font Size */}
                  <div>
                    <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                      <AlignJustify className="h-4 w-4 text-accent" />
                      حجم الخط
                    </h4>
                    <div className="grid grid-cols-3 gap-2">
                      {fontSizes.map((fs) => (
                        <button
                          key={fs}
                          onClick={() => { updateSetting("fontSize", fs); applyFontSize(fs); toast(`حجم الخط: ${fs}`); }}
                          className={`rounded-xl px-3 py-3 text-sm font-medium transition-all ${
                            settings.fontSize === fs
                              ? "bg-accent text-accent-foreground shadow-md"
                              : "bg-secondary text-foreground hover:bg-secondary/80"
                          }`}
                        >
                          {fs}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Chat Bubble Style */}
                  <div>
                    <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-accent" />
                      نمط فقاعات المحادثة
                    </h4>
                    <div className="grid grid-cols-3 gap-2">
                      {bubbleStyles.map((bs) => (
                        <button
                          key={bs}
                          onClick={() => { updateSetting("chatBubbleStyle", bs); toast(`نمط الفقاعات: ${bs}`); }}
                          className={`rounded-xl px-3 py-3 text-sm font-medium transition-all ${
                            settings.chatBubbleStyle === bs
                              ? "bg-accent text-accent-foreground shadow-md"
                              : "bg-secondary text-foreground hover:bg-secondary/80"
                          }`}
                        >
                          {bs}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ── Notifications Tab ── */}
              {activeTab === "notifications" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                  {([
                    { label: "إشعارات الرسائل", desc: "تلقي إشعار عند وصول رسالة جديدة", key: "notifMessages" as const },
                    { label: "إشعارات التحديثات", desc: "إشعارات عن التحديثات والميزات الجديدة", key: "notifUpdates" as const },
                    { label: "الأصوات", desc: "تشغيل صوت عند وصول إشعار", key: "notifSound" as const },
                    { label: "الاهتزاز", desc: "تفعيل الاهتزاز عند وصول إشعار", key: "notifVibration" as const },
                    { label: "إشعارات البريد الإلكتروني", desc: "إرسال الإشعارات المهمة عبر البريد", key: "notifEmail" as const },
                  ]).map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center justify-between rounded-xl bg-secondary p-4"
                    >
                      <button
                        onClick={() => {
                          const newVal = !settings[item.key];
                          updateSetting(item.key, newVal);
                          toast(`${item.label}: ${newVal ? "مفعّل" : "معطّل"}`);
                          // Vibration API
                          if (item.key === "notifVibration" && newVal && navigator.vibrate) {
                            navigator.vibrate(200);
                          }
                        }}
                        className={`relative h-7 w-12 rounded-full transition-colors ${
                          settings[item.key] ? "bg-accent" : "bg-muted-foreground/30"
                        }`}
                      >
                        <div
                          className={`absolute top-0.5 h-6 w-6 rounded-full bg-foreground shadow-md transition-transform ${
                            settings[item.key] ? "right-0.5" : "right-[calc(100%-1.625rem)]"
                          }`}
                        />
                      </button>
                      <div className="text-right">
                        <p className="text-sm font-medium text-foreground">{item.label}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}

              {/* ── Account Tab ── */}
              {activeTab === "account" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
                  {/* Profile Info */}
                  <div className="flex items-center gap-4 rounded-xl bg-secondary p-4">
                    <div className="text-right flex-1">
                      <p className="text-sm font-bold text-foreground">Erfan Moharam</p>
                      <p className="text-xs text-muted-foreground mt-1">nmoharam7796@gmail.com</p>
                    </div>
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                      E
                    </div>
                  </div>

                  {/* Plan */}
                  <div className="rounded-xl border border-border overflow-hidden">
                    <div className="flex items-center justify-between p-4">
                      <button
                        onClick={() => toast("صفحة الترقية - قريباً")}
                        className="rounded-full bg-accent px-4 py-1.5 text-xs font-semibold text-accent-foreground hover:brightness-110 transition-all"
                      >
                        ترقية
                      </button>
                      <div className="text-right">
                        <p className="text-sm font-medium text-foreground">الخطة الحالية</p>
                        <p className="text-xs text-muted-foreground mt-0.5">الخطة المجانية</p>
                      </div>
                    </div>
                    <div className="border-t border-border px-4 py-3 flex items-center justify-between">
                      <span className="text-sm font-semibold text-foreground">300</span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                        <Sparkles className="h-3.5 w-3.5" />
                        الأرصدة المتبقية
                      </span>
                    </div>
                  </div>

                  {/* Account Actions */}
                  <div className="space-y-2">
                    {/* Change Password */}
                    <button
                      onClick={() => setShowPasswordDialog(true)}
                      className="w-full rounded-xl bg-secondary px-4 py-3 text-sm font-medium text-foreground hover:bg-secondary/80 transition-colors text-right"
                    >
                      تغيير كلمة المرور
                    </button>

                    {/* Export Data */}
                    <button
                      onClick={() => {
                        const data = {
                          settings: loadSettings(),
                          exportDate: new Date().toISOString(),
                          messages: "تم تصدير بيانات المحادثات",
                        };
                        const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement("a");
                        a.href = url;
                        a.download = `erfanai-data-${new Date().toISOString().slice(0, 10)}.json`;
                        a.click();
                        URL.revokeObjectURL(url);
                        toast.success("تم تصدير البيانات بنجاح");
                      }}
                      className="w-full rounded-xl bg-secondary px-4 py-3 text-sm font-medium text-foreground hover:bg-secondary/80 transition-colors text-right"
                    >
                      تصدير البيانات
                    </button>

                    {/* Delete Account */}
                    <button
                      onClick={() => setShowDeleteConfirm(true)}
                      className="w-full rounded-xl bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive hover:bg-destructive/20 transition-colors text-right"
                    >
                      حذف الحساب
                    </button>
                  </div>

                  {/* Password Dialog */}
                  <AnimatePresence>
                    {showPasswordDialog && (
                      <>
                        <motion.div
                          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                          className="fixed inset-0 z-[60] bg-background/80"
                          onClick={() => setShowPasswordDialog(false)}
                        />
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                          className="fixed inset-x-6 top-1/2 -translate-y-1/2 z-[70] rounded-2xl border border-border bg-card p-5 shadow-2xl space-y-4"
                          dir="rtl"
                        >
                          <h3 className="text-base font-bold text-foreground text-center">تغيير كلمة المرور</h3>
                          <input
                            type="password" placeholder="كلمة المرور الحالية" value={oldPassword}
                            onChange={e => setOldPassword(e.target.value)}
                            className="w-full rounded-xl border border-border bg-secondary px-4 py-3 text-sm text-foreground outline-none"
                          />
                          <input
                            type="password" placeholder="كلمة المرور الجديدة" value={newPassword}
                            onChange={e => setNewPassword(e.target.value)}
                            className="w-full rounded-xl border border-border bg-secondary px-4 py-3 text-sm text-foreground outline-none"
                          />
                          <input
                            type="password" placeholder="تأكيد كلمة المرور الجديدة" value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                            className="w-full rounded-xl border border-border bg-secondary px-4 py-3 text-sm text-foreground outline-none"
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => setShowPasswordDialog(false)}
                              className="flex-1 rounded-xl bg-secondary py-3 text-sm font-medium text-foreground"
                            >
                              إلغاء
                            </button>
                            <button
                              onClick={() => {
                                if (!oldPassword || !newPassword || !confirmPassword) {
                                  toast.error("يرجى ملء جميع الحقول");
                                  return;
                                }
                                if (newPassword !== confirmPassword) {
                                  toast.error("كلمة المرور الجديدة غير متطابقة");
                                  return;
                                }
                                if (newPassword.length < 6) {
                                  toast.error("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
                                  return;
                                }
                                toast.success("تم تغيير كلمة المرور بنجاح");
                                setOldPassword(""); setNewPassword(""); setConfirmPassword("");
                                setShowPasswordDialog(false);
                              }}
                              className="flex-1 rounded-xl bg-accent py-3 text-sm font-bold text-accent-foreground"
                            >
                              حفظ
                            </button>
                          </div>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>

                  {/* Delete Confirm Dialog */}
                  <AnimatePresence>
                    {showDeleteConfirm && (
                      <>
                        <motion.div
                          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                          className="fixed inset-0 z-[60] bg-background/80"
                          onClick={() => setShowDeleteConfirm(false)}
                        />
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                          className="fixed inset-x-6 top-1/2 -translate-y-1/2 z-[70] rounded-2xl border border-border bg-card p-5 shadow-2xl space-y-4"
                          dir="rtl"
                        >
                          <h3 className="text-base font-bold text-destructive text-center">حذف الحساب</h3>
                          <p className="text-sm text-muted-foreground text-center leading-relaxed">
                            هل أنت متأكد من حذف حسابك؟ هذا الإجراء لا يمكن التراجع عنه وسيتم حذف جميع بياناتك نهائياً.
                          </p>
                          <div className="flex gap-2">
                            <button
                              onClick={() => setShowDeleteConfirm(false)}
                              className="flex-1 rounded-xl bg-secondary py-3 text-sm font-medium text-foreground"
                            >
                              إلغاء
                            </button>
                            <button
                              onClick={() => {
                                localStorage.clear();
                                toast.success("تم حذف الحساب بنجاح");
                                setShowDeleteConfirm(false);
                                onClose();
                                onLogout();
                              }}
                              className="flex-1 rounded-xl bg-destructive py-3 text-sm font-bold text-destructive-foreground"
                            >
                              حذف نهائياً
                            </button>
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
const ProfileDropdown = ({ isOpen, onClose, onLogout, onOpenSettings }: { isOpen: boolean; onClose: () => void; onLogout: () => void; onOpenSettings: () => void }) => (
  <AnimatePresence>
    {isOpen && (
      <>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-40"
        />
        <motion.div
          initial={{ opacity: 0, y: -10, scaleY: 0.95 }}
          animate={{ opacity: 1, y: 0, scaleY: 1 }}
          exit={{ opacity: 0, y: -10, scaleY: 0.95 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          style={{ transformOrigin: "top left" }}
          className="absolute left-3 top-[60px] z-50 w-[300px] rounded-2xl border border-border bg-card shadow-2xl overflow-hidden"
          dir="rtl"
        >
          {/* User row */}
          <div className="flex items-center justify-between p-4">
            <button
              onClick={() => { toast("تبديل الحساب"); onClose(); }}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowRightLeft className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-3">
              <div>
                <h3 className="text-sm font-bold text-foreground text-left">Erfan Moharam</h3>
                <p className="text-xs text-muted-foreground text-left">...nmoharam7796@gmail.com</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                E
              </div>
            </div>
          </div>

          {/* Plan & Credits box */}
          <div className="mx-4 mb-3 rounded-xl border border-border overflow-hidden">
            {/* Plan row */}
            <div className="flex items-center justify-between px-4 py-3">
              <button
                onClick={() => { toast("صفحة الترقية - قريباً"); onClose(); }}
                className="rounded-full border border-border bg-foreground px-4 py-1 text-xs font-semibold text-background hover:opacity-90 transition-opacity"
              >
                ترقية
              </button>
              <span className="text-sm font-bold text-foreground">مجاني</span>
            </div>
            {/* Dashed divider */}
            <div className="border-t border-dashed border-border" />
            {/* Credits row */}
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-1">
                <ChevronLeft className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-semibold text-foreground">300</span>
              </div>
              <div className="flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">الأرصدة</span>
                <Sparkles className="h-4 w-4 text-foreground" />
              </div>
            </div>
          </div>

          {/* Menu items */}
          <div className="px-2">
            {/* Knowledge */}
            <button
              onClick={() => { toast("قاعدة المعرفة - قريباً"); onClose(); }}
              className="flex w-full items-center justify-end gap-3 rounded-lg px-3 py-3 text-sm text-foreground hover:bg-secondary transition-colors"
            >
              <span>المعرفة</span>
              <BookOpen className="h-5 w-5 text-muted-foreground" />
            </button>
            <div className="mx-3 border-t border-border" />

            {/* Account */}
            <button
              onClick={() => { toast("صفحة الحساب - قريباً"); onClose(); }}
              className="flex w-full items-center justify-end gap-3 rounded-lg px-3 py-3 text-sm text-foreground hover:bg-secondary transition-colors"
            >
              <span>الحساب</span>
              <User className="h-5 w-5 text-muted-foreground" />
            </button>

            {/* Settings */}
            <button
              onClick={() => { onOpenSettings(); onClose(); }}
              className="flex w-full items-center justify-end gap-3 rounded-lg px-3 py-3 text-sm text-foreground hover:bg-secondary transition-colors"
            >
              <span>الإعدادات</span>
              <Settings className="h-5 w-5 text-muted-foreground" />
            </button>
            <div className="mx-3 border-t border-border" />

            {/* Home - with external link */}
            <button
              onClick={() => { toast("الصفحة الرئيسية"); onClose(); }}
              className="flex w-full items-center justify-between rounded-lg px-3 py-3 text-sm text-foreground hover:bg-secondary transition-colors"
            >
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
              <div className="flex items-center gap-3">
                <span>الصفحة الرئيسية</span>
                <Home className="h-5 w-5 text-muted-foreground" />
              </div>
            </button>

            {/* Help - with external link */}
            <button
              onClick={() => { toast("مركز المساعدة - قريباً"); onClose(); }}
              className="flex w-full items-center justify-between rounded-lg px-3 py-3 text-sm text-foreground hover:bg-secondary transition-colors"
            >
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
              <div className="flex items-center gap-3">
                <span>الحصول على المساعدة</span>
                <HelpCircle className="h-5 w-5 text-muted-foreground" />
              </div>
            </button>
            <div className="mx-3 border-t border-border" />

            {/* Logout */}
            <button
              onClick={onLogout}
              className="flex w-full items-center justify-end gap-3 rounded-lg px-3 py-3 text-sm text-destructive hover:bg-secondary transition-colors"
            >
              <span>تسجيل الخروج</span>
              <LogOut className="h-5 w-5" />
            </button>
          </div>
          <div className="h-2" />
        </motion.div>
      </>
    )}
  </AnimatePresence>
);

/* ═══════════════════════ CHAT MESSAGE ═══════════════════════ */
const ChatMessage = ({ message, isUser, files }: { message: string; isUser: boolean; files?: File[] }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className={`flex ${isUser ? "justify-start" : "justify-end"} mb-3`}
  >
    <div
      className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
        isUser
          ? "bg-accent text-accent-foreground"
          : "bg-secondary text-foreground"
      }`}
    >
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
const AppScreen = ({ onLogout }: { onLogout: () => void }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isModelSelectorOpen, setIsModelSelectorOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [currentModel, setCurrentModel] = useState(() => loadSettings().defaultModel || "ErfanAI Lite");
  const [inputValue, setInputValue] = useState("");
  const [showTools, setShowTools] = useState(true);
  const [activeChips, setActiveChips] = useState<string[]>([]);
  const [isPlusMenuOpen, setIsPlusMenuOpen] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [messages, setMessages] = useState<{ text: string; isUser: boolean; files?: File[] }[]>([]);
  const [isRecording, setIsRecording] = useState(false);

  // Apply saved settings on mount
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
      toast.success(`تم إرفاق ${files.length} ملف`);
    }
    setIsPlusMenuOpen(false);
  };

  const removeFile = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSend = () => {
    if (!inputValue.trim() && attachedFiles.length === 0) return;
    
    // Add user message
    setMessages(prev => [...prev, { text: inputValue, isUser: true, files: attachedFiles.length > 0 ? [...attachedFiles] : undefined }]);
    const userMsg = inputValue;
    setInputValue("");
    setAttachedFiles([]);
    
    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, {
        text: `شكراً لرسالتك! أنا ErfanAI وسأساعدك في "${userMsg || "الملفات المرفقة"}". هذه نسخة تجريبية.`,
        isUser: false
      }]);
    }, 1200);
  };

  const handleMic = () => {
    if (isRecording) {
      setIsRecording(false);
      toast("تم إيقاف التسجيل الصوتي");
    } else {
      setIsRecording(true);
      toast("جاري التسجيل الصوتي...", { duration: 2000 });
      setTimeout(() => setIsRecording(false), 3000);
    }
  };

  const chipItems = [
    { icon: Code, label: "إنشاء موقع ويب" },
    { icon: Presentation, label: "إنشاء عروض تقديمية" },
    { icon: Smartphone, label: "تطوير التطبيقات" },
    { icon: Palette, label: "تصميم" },
  ];

  const toggleChip = (label: string) => {
    setActiveChips((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
    );
  };

  return (
    <div className="relative flex min-h-screen flex-col bg-background font-cairo" dir="rtl">
      {/* ── Header ── */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-center justify-between px-4 py-3"
      >
        {/* Right side: Hamburger */}
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="rounded-lg p-2 text-muted-foreground hover:bg-secondary transition-colors"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Center: Title */}
        <button
          onClick={() => setIsModelSelectorOpen(true)}
          className="flex items-center gap-1.5 hover:opacity-80 transition-opacity"
        >
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-semibold text-foreground">
            {models.find(m => m.id === currentModel)?.label || currentModel}
          </span>
        </button>

        {/* Left side: Avatar + icons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsNotificationsOpen(true)}
            className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Bell className="h-5 w-5" />
          </button>
          <button
            onClick={() => toast("✨ الميزات المتقدمة - قريباً")}
            className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Sparkles className="h-5 w-5" />
          </button>
          <button
            onClick={() => setIsProfileOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground transition-transform hover:scale-105"
          >
            E
          </button>
        </div>
      </motion.header>

      {/* ── Scrollable Content ── */}
      <div className="flex-1 overflow-y-auto px-4 pb-6">
        {/* Free plan banner */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-4 flex items-center justify-center"
        >
          <div className="flex items-center gap-4 rounded-full border border-border bg-card px-5 py-2.5">
            <span className="text-sm text-muted-foreground">الخطة المجانية</span>
            <button
              onClick={() => toast("ابدأ التجربة المجانية لمدة 7 أيام - قريباً")}
              className="rounded-full bg-accent px-4 py-1.5 text-xs font-semibold text-accent-foreground transition-all hover:brightness-110 active:scale-95"
            >
              ابدأ التجربة المجانية
            </button>
          </div>
        </motion.div>

        {/* Chat messages */}
        {messages.length > 0 ? (
          <div className="mt-6 space-y-1">
            {messages.map((msg, i) => (
              <ChatMessage key={i} message={msg.text} isUser={msg.isUser} files={msg.files} />
            ))}
          </div>
        ) : (
          /* Main title */
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8 text-center text-2xl font-bold text-accent leading-relaxed"
          >
            كيف يمكنني مساعدتك؟
          </motion.h1>
        )}

        {/* ── Input Card ── */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 card-gold-border rounded-2xl bg-card p-4"
        >
          {/* Active chips tags */}
          {activeChips.length > 0 && (
            <div className="mb-2 flex flex-wrap gap-1.5">
              {activeChips.map((label) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium"
                  style={{ background: "hsl(217 91% 50%)", color: "#fff" }}
                >
                  {label}
                  <button onClick={() => toggleChip(label)} className="hover:opacity-70">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={activeChips.length > 0 ? `المهام المفعّلة: ${activeChips.join("، ")}` : "قم بتعيين مهمة أو اسأل أي شيء"}
            rows={3}
            className="w-full resize-none bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none leading-relaxed"
            dir="rtl"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          {/* Attached files preview */}
          {attachedFiles.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {attachedFiles.map((file, index) => (
                <div key={index} className="flex items-center gap-1.5 rounded-lg border border-border bg-secondary px-2.5 py-1.5 text-xs text-foreground">
                  {file.type.startsWith("image/") ? (
                    <Image className="h-3.5 w-3.5 text-accent" />
                  ) : (
                    <FileText className="h-3.5 w-3.5 text-accent" />
                  )}
                  <span className="max-w-[120px] truncate">{file.name}</span>
                  <button onClick={() => removeFile(index)} className="hover:text-destructive transition-colors">
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
          {/* Bottom toolbar */}
          <div className="mt-3 flex items-center justify-between">
            <div className="relative">
              <button
                onClick={() => setIsPlusMenuOpen(!isPlusMenuOpen)}
                className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors ${
                  isPlusMenuOpen ? "bg-accent text-accent-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                <Plus className={`h-5 w-5 transition-transform ${isPlusMenuOpen ? "rotate-45" : ""}`} />
              </button>

              {/* Plus menu popup */}
              <AnimatePresence>
                {isPlusMenuOpen && (
                  <>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 z-30"
                      onClick={() => setIsPlusMenuOpen(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute bottom-12 right-0 z-40 w-48 rounded-xl border border-border bg-card p-1.5 shadow-xl"
                      dir="rtl"
                    >
                      <button
                        onClick={() => imageInputRef.current?.click()}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-foreground hover:bg-secondary transition-colors"
                      >
                        <Image className="h-4 w-4 text-accent" />
                        <span>رفع صورة</span>
                      </button>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-foreground hover:bg-secondary transition-colors"
                      >
                        <FileText className="h-4 w-4 text-accent" />
                        <span>رفع ملف</span>
                      </button>
                      <button
                        onClick={() => cameraInputRef.current?.click()}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-foreground hover:bg-secondary transition-colors"
                      >
                        <Camera className="h-4 w-4 text-accent" />
                        <span>فتح الكاميرا</span>
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>

              {/* Hidden file inputs */}
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                multiple
                onChange={handleFileSelect}
              />
              <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                multiple
                onChange={handleFileSelect}
              />
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={handleFileSelect}
              />
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => toast("إعدادات الأدوات - قريباً")}
                className="rounded-lg p-2 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              >
                <SlidersHorizontal className="h-[18px] w-[18px]" />
              </button>
              <button
                onClick={() => toast("أداة القص - قريباً")}
                className="rounded-lg p-2 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              >
                <Scissors className="h-[18px] w-[18px]" />
              </button>
              <button
                onClick={() => toast("وضع الاستماع - قريباً")}
                className="rounded-lg p-2 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              >
                <Headphones className="h-[18px] w-[18px]" />
              </button>
              <button
                onClick={handleMic}
                className={`rounded-lg p-2 transition-colors ${
                  isRecording
                    ? "text-red-500 bg-red-500/10 animate-pulse"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                <Mic className="h-[18px] w-[18px]" />
              </button>
              <button
                onClick={handleSend}
                className="mr-1 flex h-9 w-9 items-center justify-center rounded-xl bg-secondary text-muted-foreground transition-colors hover:text-foreground hover:bg-accent hover:text-accent-foreground disabled:opacity-30"
                disabled={!inputValue.trim() && attachedFiles.length === 0}
              >
                <Send className="h-[18px] w-[18px]" />
              </button>
            </div>
          </div>
        </motion.div>


        {/* ── Quick Action Chips ── */}
        {messages.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-5 flex flex-wrap justify-center gap-2.5"
          >
            {chipItems.map((chip) => {
              const isActive = activeChips.includes(chip.label);
              return (
                <button
                  key={chip.label}
                  onClick={() => toggleChip(chip.label)}
                  className={`flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium transition-all active:scale-95 ${
                    isActive
                      ? "border-transparent text-white"
                      : "border-border bg-card text-foreground hover:bg-secondary hover:border-accent"
                  }`}
                  style={isActive ? { background: "hsl(217 91% 50%)" } : undefined}
                >
                  <chip.icon className={`h-4 w-4 ${isActive ? "text-white" : "text-accent"}`} />
                  {chip.label}
                </button>
              );
            })}
            <button
              onClick={() => toast("المزيد من الأدوات - قريباً")}
              className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary hover:border-accent active:scale-95"
            >
              <MoreHorizontal className="h-4 w-4 text-accent" />
              المزيد
            </button>
          </motion.div>
        )}

        {/* ── Bottom Customize Card ── */}
        {messages.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-6 card-gold-border overflow-hidden rounded-2xl bg-card cursor-pointer hover:bg-secondary transition-colors active:scale-[0.98]"
            onClick={() => toast("تخصيص ErfanAI الخاص بك - قريباً")}
          >
            <div className="flex items-center gap-4 p-5">
              {/* Icon block */}
              <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-xl bg-secondary gap-1">
                <LayoutGrid className="h-6 w-6 text-accent" />
                <div className="flex flex-col gap-0.5">
                  <div className="h-[2px] w-8 rounded-full bg-muted-foreground/40" />
                  <div className="h-[2px] w-6 rounded-full bg-muted-foreground/30" />
                </div>
              </div>
              <p className="text-sm font-semibold text-foreground leading-relaxed">
                خصص <span className="text-accent">ErfanAI</span> الخاص بك
              </p>
            </div>
          </motion.div>
        )}

        {/* ── Dot indicators ── */}
        {messages.length === 0 && (
          <div className="mt-5 flex items-center justify-center gap-2">
            <div className="h-2 w-2 rounded-full bg-accent" />
            <div className="h-2 w-2 rounded-full bg-muted-foreground/30" />
            <div className="h-2 w-2 rounded-full bg-muted-foreground/30" />
          </div>
        )}
      </div>

      {/* Overlays */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onNewTask={() => { setInputValue(""); setMessages([]); setActiveChips([]); toast("مهمة جديدة"); }}
        onNavigate={(page) => {
          const labels: Record<string, string> = {
            agents: "الوكلاء",
            search: "البحث",
            chats: "المحادثات",
            discover: "الاكتشاف"
          };
          toast(`${labels[page] || page} - قريباً`);
        }}
      />
      <ProfileDropdown
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        onLogout={onLogout}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />
      <NotificationsPanel isOpen={isNotificationsOpen} onClose={() => setIsNotificationsOpen(false)} />
      <ModelSelector
        isOpen={isModelSelectorOpen}
        onClose={() => setIsModelSelectorOpen(false)}
        currentModel={currentModel}
        onSelect={(m) => { setCurrentModel(m); toast(`تم التبديل إلى ${m}`); }}
      />
      <SettingsPanel
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onChangeModel={(m) => setCurrentModel(m)}
        onClearHistory={() => { setMessages([]); setActiveChips([]); }}
        onLogout={onLogout}
        currentModel={currentModel}
      />
    </div>
  );
};

/* ═══════════════════════ MAIN EXPORT ═══════════════════════ */
const ErfanReplica = () => {
  const [screen, setScreen] = useState<"landing" | "login" | "app">("landing");

  return (
    <AnimatePresence mode="wait">
      {screen === "landing" && (
        <motion.div key="landing" exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
          <LandingPage
            onLogin={() => setScreen("login")}
            onRegister={() => setScreen("login")}
          />
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
  );
};

export default ErfanReplica;
