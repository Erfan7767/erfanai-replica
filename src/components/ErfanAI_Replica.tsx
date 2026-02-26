import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
} from "lucide-react";

/* ═══════════════════════ LANDING PAGE (Light) ═══════════════════════ */
const LandingPage = ({ onLogin, onRegister }: { onLogin: () => void; onRegister: () => void }) => (
  <div className="flex min-h-screen flex-col font-cairo" dir="rtl" style={{ background: "#f5f5f4" }}>
    {/* Header */}
    <header className="flex items-center justify-between px-4 py-3">
      {/* Right: Logo */}
      <div className="flex items-center gap-2">
        <Hand className="h-6 w-6" style={{ color: "#1a1a1a" }} />
        <span className="text-xl font-bold" style={{ color: "#1a1a1a" }}>ErfanAgent</span>
      </div>

      {/* Left: Buttons + Hamburger */}
      <div className="flex items-center gap-2">
        <button
          onClick={onLogin}
          className="rounded-lg px-4 py-2 text-sm font-semibold transition-colors"
          style={{ background: "#1a1a1a", color: "#fff" }}
        >
          تسجيل الدخول
        </button>
        <button
          onClick={onRegister}
          className="rounded-lg border px-4 py-2 text-sm font-medium transition-colors"
          style={{ borderColor: "#d4d4d4", color: "#525252" }}
        >
          تسجيل
        </button>
        <button className="p-2" style={{ color: "#525252" }}>
          <Menu className="h-5 w-5" />
        </button>
      </div>
    </header>

    {/* Banner */}
    <div className="flex items-center justify-center gap-2 py-2.5" style={{ background: "#e7e5e4" }}>
      <ArrowRight className="h-4 w-4" style={{ color: "#525252" }} />
      <p className="text-sm font-medium" style={{ color: "#1a1a1a" }}>
        ErfanAgent أصبح الآن جزءًا من <span className="font-bold">Erfan</span>
      </p>
    </div>

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
          placeholder="قم بتعيين مهمة أو اسأل أي شيء"
          rows={3}
          className="w-full resize-none bg-transparent text-sm outline-none leading-relaxed"
          style={{ color: "#1a1a1a", }}
          dir="rtl"
        />
        <div className="mt-2 flex items-center justify-end gap-2">
          <button
            className="flex h-9 w-9 items-center justify-center rounded-full border transition-colors"
            style={{ borderColor: "#d4d4d4", color: "#a3a3a3" }}
          >
            <UploadIcon className="h-4 w-4" />
          </button>
          <button
            className="flex h-9 w-9 items-center justify-center rounded-full border transition-colors"
            style={{ borderColor: "#d4d4d4", color: "#a3a3a3" }}
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
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
            className="flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium transition-colors hover:bg-white"
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

/* ═══════════════════════ LOGIN SCREEN ═══════════════════════ */
const LoginScreen = ({ onLogin }: { onLogin: () => void }) => (
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
        <span className="text-lg font-bold" style={{ color: "#e5e5e5" }}>ErfanAgent</span>
        <Hand className="h-5 w-5" style={{ color: "#e5e5e5" }} />
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
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
          className="mb-6 flex h-24 w-24 items-center justify-center"
        >
          <Hand className="h-16 w-16" style={{ color: "#e5e5e5" }} />
        </motion.div>

        {/* Title */}
        <h1 className="mb-2 text-2xl font-bold" style={{ color: "#f5f5f5" }}>
          تسجيل الدخول أو التسجيل
        </h1>
        <p className="mb-10 text-sm" style={{ color: "#737373" }}>
          ابدأ الإبداع مع <span style={{ color: "#a3a3a3" }}>ErfanAgent</span>
        </p>

        {/* Social buttons */}
        <div className="flex w-full flex-col gap-3">
          {/* Google */}
          <button
            onClick={onLogin}
            className="flex w-full items-center justify-center gap-3 rounded-xl py-4 text-sm font-medium transition-colors"
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
            onClick={onLogin}
            className="flex w-full items-center justify-center gap-3 rounded-xl py-4 text-sm font-medium transition-colors"
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
            onClick={onLogin}
            className="flex w-full items-center justify-center gap-3 rounded-xl py-4 text-sm font-medium transition-colors"
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
          placeholder="أدخل عنوان بريدك الإلكتروني"
          className="w-full rounded-xl px-4 py-4 text-sm outline-none"
          style={{ background: "#1a1a1a", border: "1px solid #333", color: "#e5e5e5" }}
          dir="rtl"
        />

        {/* Continue button */}
        <button
          onClick={onLogin}
          className="mt-4 w-full rounded-xl py-4 text-sm font-semibold transition-all"
          style={{ background: "#404040", color: "#d4d4d4" }}
        >
          استمرار
        </button>
      </motion.div>
    </div>
  </div>
);

/* ═══════════════════════ SIDEBAR ═══════════════════════ */
const Sidebar = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => (
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
            <h2 className="text-lg font-bold text-accent">ErfanAgent</h2>
            <button onClick={onClose} className="rounded-lg p-2 text-muted-foreground hover:bg-secondary transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="flex-1 p-3 space-y-1">
            {[
              { icon: Plus, label: "مهمة جديدة", isAccent: true },
              { icon: Bot, label: "الوكلاء", isAccent: false },
              { icon: Search, label: "بحث", isAccent: false },
              { icon: MessageSquare, label: "المحادثات", isAccent: false },
              { icon: Sparkles, label: "الاكتشاف", isAccent: false },
            ].map((item) => (
              <button
                key={item.label}
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

/* ═══════════════════════ PROFILE DROPDOWN ═══════════════════════ */
const ProfileDropdown = ({ isOpen, onClose, onLogout }: { isOpen: boolean; onClose: () => void; onLogout: () => void }) => (
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
            <button className="text-muted-foreground hover:text-foreground transition-colors">
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
              <button className="rounded-full border border-border bg-foreground px-4 py-1 text-xs font-semibold text-background">
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
            <button className="flex w-full items-center justify-end gap-3 rounded-lg px-3 py-3 text-sm text-foreground hover:bg-secondary transition-colors">
              <span>المعرفة</span>
              <BookOpen className="h-5 w-5 text-muted-foreground" />
            </button>
            <div className="mx-3 border-t border-border" />

            {/* Account */}
            <button className="flex w-full items-center justify-end gap-3 rounded-lg px-3 py-3 text-sm text-foreground hover:bg-secondary transition-colors">
              <span>الحساب</span>
              <User className="h-5 w-5 text-muted-foreground" />
            </button>

            {/* Settings */}
            <button className="flex w-full items-center justify-end gap-3 rounded-lg px-3 py-3 text-sm text-foreground hover:bg-secondary transition-colors">
              <span>الإعدادات</span>
              <Settings className="h-5 w-5 text-muted-foreground" />
            </button>
            <div className="mx-3 border-t border-border" />

            {/* Home - with external link */}
            <button className="flex w-full items-center justify-between rounded-lg px-3 py-3 text-sm text-foreground hover:bg-secondary transition-colors">
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
              <div className="flex items-center gap-3">
                <span>الصفحة الرئيسية</span>
                <Home className="h-5 w-5 text-muted-foreground" />
              </div>
            </button>

            {/* Help - with external link */}
            <button className="flex w-full items-center justify-between rounded-lg px-3 py-3 text-sm text-foreground hover:bg-secondary transition-colors">
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

/* ═══════════════════════ APP SCREEN ═══════════════════════ */
const AppScreen = ({ onLogout }: { onLogout: () => void }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [showTools, setShowTools] = useState(true);
  const [activeChips, setActiveChips] = useState<string[]>([]);

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
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-semibold text-foreground">ErfanAgent Lite</span>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </div>

        {/* Left side: Avatar + icons */}
        <div className="flex items-center gap-3">
          <button className="p-1.5 text-muted-foreground hover:text-foreground transition-colors">
            <Bell className="h-5 w-5" />
          </button>
          <button className="p-1.5 text-muted-foreground hover:text-foreground transition-colors">
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
            <button className="rounded-full bg-accent px-4 py-1.5 text-xs font-semibold text-accent-foreground transition-all hover:brightness-110">
              ابدأ التجربة المجانية
            </button>
          </div>
        </motion.div>

        {/* Main title */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 text-center text-2xl font-bold text-accent leading-relaxed"
        >
          كيف يمكنني مساعدتك؟
        </motion.h1>

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
          />
          {/* Bottom toolbar */}
          <div className="mt-3 flex items-center justify-between">
            <button className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-muted-foreground hover:text-foreground transition-colors">
              <Plus className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-1">
              <button className="rounded-lg p-2 text-muted-foreground hover:text-foreground transition-colors">
                <SlidersHorizontal className="h-[18px] w-[18px]" />
              </button>
              <button className="rounded-lg p-2 text-muted-foreground hover:text-foreground transition-colors">
                <Scissors className="h-[18px] w-[18px]" />
              </button>
              <button className="rounded-lg p-2 text-muted-foreground hover:text-foreground transition-colors">
                <Headphones className="h-[18px] w-[18px]" />
              </button>
              <button className="rounded-lg p-2 text-muted-foreground hover:text-foreground transition-colors">
                <Mic className="h-[18px] w-[18px]" />
              </button>
              <button
                className="mr-1 flex h-9 w-9 items-center justify-center rounded-xl bg-secondary text-muted-foreground transition-colors hover:text-foreground disabled:opacity-30"
                disabled={!inputValue.trim()}
              >
                <Send className="h-[18px] w-[18px]" />
              </button>
            </div>
          </div>
        </motion.div>


        {/* ── Quick Action Chips ── */}
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
                className={`flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium transition-all ${
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
          <button className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary hover:border-accent">
            <MoreHorizontal className="h-4 w-4 text-accent" />
            المزيد
          </button>
        </motion.div>

        {/* ── Bottom Customize Card ── */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-6 card-gold-border overflow-hidden rounded-2xl bg-card"
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
              خصص <span className="text-accent">ErfanAgent</span> الخاص بك
            </p>
          </div>
        </motion.div>

        {/* ── Dot indicators ── */}
        <div className="mt-5 flex items-center justify-center gap-2">
          <div className="h-2 w-2 rounded-full bg-accent" />
          <div className="h-2 w-2 rounded-full bg-muted-foreground/30" />
          <div className="h-2 w-2 rounded-full bg-muted-foreground/30" />
        </div>
      </div>

      {/* Overlays */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <ProfileDropdown isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} onLogout={onLogout} />
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
