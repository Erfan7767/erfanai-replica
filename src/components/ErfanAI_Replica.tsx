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
} from "lucide-react";

/* ═══════════════════════ LOGIN SCREEN ═══════════════════════ */
const LoginScreen = ({ onLogin }: { onLogin: () => void }) => (
  <div
    className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background font-cairo"
    dir="rtl"
  >
    <div className="dot-pattern absolute inset-0 opacity-15" />

    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative z-10 flex w-full max-w-sm flex-col items-center gap-7 px-6"
    >
      {/* Logo */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
        className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary"
      >
        <Hand className="h-10 w-10 text-primary-foreground" />
      </motion.div>

      <h1 className="text-3xl font-bold text-accent">ErfanAgent</h1>
      <p className="text-center text-muted-foreground">مساعدك الذكي لإنجاز المهام</p>

      {/* Social buttons */}
      <div className="flex w-full flex-col gap-3">
        {[
          {
            label: "تسجيل الدخول بحساب Google",
            icon: (
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
            ),
          },
          {
            label: "تسجيل الدخول بحساب Microsoft",
            icon: (
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11.4 24H1.6C.7 24 0 23.3 0 22.4V1.6C0 .7.7 0 1.6 0h9.8v24zm1.2 0h9.8c.9 0 1.6-.7 1.6-1.6V1.6c0-.9-.7-1.6-1.6-1.6h-9.8v24z" />
              </svg>
            ),
          },
          {
            label: "تسجيل الدخول بحساب Apple",
            icon: (
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </svg>
            ),
          },
        ].map((btn) => (
          <button
            key={btn.label}
            onClick={onLogin}
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-border bg-card px-4 py-3.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
          >
            {btn.icon}
            {btn.label}
          </button>
        ))}
      </div>

      {/* Divider */}
      <div className="flex w-full items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs text-muted-foreground">أو</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      {/* Email */}
      <div className="flex w-full items-center gap-2 rounded-xl border border-border bg-card px-4 py-3">
        <Mail className="h-5 w-5 text-muted-foreground" />
        <input
          type="email"
          placeholder="أدخل بريدك الإلكتروني"
          className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
          dir="rtl"
        />
      </div>

      <button
        onClick={onLogin}
        className="w-full rounded-xl bg-accent py-3.5 text-sm font-semibold text-accent-foreground transition-all hover:brightness-110"
      >
        تسجيل الدخول
      </button>
    </motion.div>

    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.8 }}
      className="absolute bottom-6 text-xs text-muted-foreground"
    >
      من <span className="font-semibold text-accent">Erfan</span>
    </motion.p>
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

/* ═══════════════════════ PROFILE MODAL ═══════════════════════ */
const ProfileModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => (
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
          initial={{ opacity: 0, scale: 0.9, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: -20 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          className="fixed left-4 right-4 top-16 z-50 mx-auto max-w-sm rounded-2xl border border-border bg-card p-5 shadow-2xl"
          dir="rtl"
        >
          <div className="flex items-center gap-4 mb-5">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
              E
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">Erfan Moharam</h3>
              <p className="text-xs text-muted-foreground">nmoharam7796@gmail.com</p>
            </div>
          </div>

          <div className="mb-5 rounded-xl bg-secondary p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">الرصيد المتبقي</span>
              <div className="flex items-center gap-1.5">
                <Zap className="h-4 w-4 text-accent" />
                <span className="text-lg font-bold text-accent">300</span>
              </div>
            </div>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-background">
              <div className="h-full w-3/4 rounded-full bg-accent" />
            </div>
          </div>

          <div className="space-y-1">
            <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-foreground hover:bg-secondary transition-colors">
              <Settings className="h-4 w-4 text-muted-foreground" />
              الإعدادات
            </button>
            <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-destructive hover:bg-secondary transition-colors">
              <LogOut className="h-4 w-4" />
              تسجيل الخروج
            </button>
          </div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
);

/* ═══════════════════════ APP SCREEN ═══════════════════════ */
const AppScreen = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [showTools, setShowTools] = useState(true);

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
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="قم بتعيين مهمة أو اسأل أي شيء"
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

        {/* ── Tools connection bar ── */}
        <AnimatePresence>
          {showTools && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              transition={{ delay: 0.35 }}
              className="mt-4 card-gold-border flex items-center justify-between rounded-2xl bg-card px-4 py-3"
            >
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowTools(false)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
                <Globe className="h-5 w-5 text-accent" />
              </div>
              <p className="text-sm text-foreground">
                قم بتوصيل أدواتك بـ{" "}
                <span className="font-semibold text-accent">ErfanAgent</span>
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Quick Action Chips ── */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
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
              className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary hover:border-accent"
            >
              <chip.icon className="h-4 w-4 text-accent" />
              {chip.label}
            </button>
          ))}
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
      <ProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
    </div>
  );
};

/* ═══════════════════════ MAIN EXPORT ═══════════════════════ */
const ErfanReplica = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <AnimatePresence mode="wait">
      {!isLoggedIn ? (
        <motion.div key="login" exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.3 }}>
          <LoginScreen onLogin={() => setIsLoggedIn(true)} />
        </motion.div>
      ) : (
        <motion.div
          key="app"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <AppScreen />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ErfanReplica;
