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
  Camera,
  Globe,
  ArrowLeft,
  Settings,
  LogOut,
  ChevronLeft,
  Sparkles,
  Zap,
  MessageSquare,
} from "lucide-react";

/* ─────────────────────── Login Screen ─────────────────────── */
const LoginScreen = ({ onLogin }: { onLogin: () => void }) => (
  <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background font-cairo" dir="rtl">
    {/* Dot pattern overlay */}
    <div className="dot-pattern absolute inset-0 opacity-20" />

    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative z-10 flex w-full max-w-sm flex-col items-center gap-8 px-6"
    >
      {/* Logo */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
        className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary shadow-[0_0_40px_hsl(var(--erfan-green-glow))]"
      >
        <Hand className="h-10 w-10 text-primary-foreground" />
      </motion.div>

      <h1 className="text-3xl font-bold text-foreground">ErfanAI</h1>
      <p className="text-center text-muted-foreground">مساعدك الذكي لإنجاز المهام</p>

      {/* Social buttons */}
      <div className="flex w-full flex-col gap-3">
        <button
          onClick={onLogin}
          className="flex w-full items-center justify-center gap-3 rounded-xl border border-border bg-secondary px-4 py-3.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
          تسجيل الدخول بحساب Google
        </button>

        <button
          onClick={onLogin}
          className="flex w-full items-center justify-center gap-3 rounded-xl border border-border bg-secondary px-4 py-3.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
        >
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M11.4 24H1.6C.7 24 0 23.3 0 22.4V1.6C0 .7.7 0 1.6 0h9.8v24zm1.2 0h9.8c.9 0 1.6-.7 1.6-1.6V1.6c0-.9-.7-1.6-1.6-1.6h-9.8v24z"/></svg>
          تسجيل الدخول بحساب Microsoft
        </button>

        <button
          onClick={onLogin}
          className="flex w-full items-center justify-center gap-3 rounded-xl border border-border bg-secondary px-4 py-3.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
        >
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
          تسجيل الدخول بحساب Apple
        </button>
      </div>

      {/* Divider */}
      <div className="flex w-full items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs text-muted-foreground">أو</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      {/* Email input */}
      <div className="flex w-full items-center gap-2 rounded-xl border border-border bg-secondary px-4 py-3">
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
        className="w-full rounded-xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground transition-all hover:brightness-110 shadow-[0_0_20px_hsl(var(--erfan-green-glow))]"
      >
        تسجيل الدخول
      </button>
    </motion.div>

    {/* Footer */}
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.8 }}
      className="absolute bottom-6 text-xs text-muted-foreground"
    >
      من <span className="font-semibold text-foreground">Erfan</span>
    </motion.p>
  </div>
);

/* ─────────────────────── Sidebar ─────────────────────── */
const Sidebar = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => (
  <AnimatePresence>
    {isOpen && (
      <>
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-40 bg-[hsl(var(--erfan-overlay))]"
        />

        {/* Panel */}
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed right-0 top-0 z-50 flex h-full w-72 flex-col bg-background border-l border-border"
          dir="rtl"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h2 className="text-lg font-bold text-foreground">القائمة</h2>
            <button onClick={onClose} className="rounded-lg p-2 text-muted-foreground hover:bg-accent transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Menu items */}
          <nav className="flex-1 p-3 space-y-1">
            {[
              { icon: Plus, label: "مهمة جديدة", accent: true },
              { icon: Bot, label: "الوكلاء" },
              { icon: Search, label: "بحث" },
              { icon: MessageSquare, label: "المحادثات" },
              { icon: Sparkles, label: "الاكتشاف" },
            ].map((item) => (
              <button
                key={item.label}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                  item.accent
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-accent"
                }`}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </button>
            ))}
          </nav>

          {/* Footer */}
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

/* ─────────────────────── Profile Modal ─────────────────────── */
const ProfileModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => (
  <AnimatePresence>
    {isOpen && (
      <>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-40 bg-[hsl(var(--erfan-overlay))]"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: -20 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          className="fixed left-4 right-4 top-16 z-50 mx-auto max-w-sm rounded-2xl border border-border bg-card p-5 shadow-2xl"
          dir="rtl"
        >
          {/* User info */}
          <div className="flex items-center gap-4 mb-5">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
              E
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">Erfan Moharam</h3>
              <p className="text-xs text-muted-foreground">nmoharam7796@gmail.com</p>
            </div>
          </div>

          {/* Credits */}
          <div className="mb-5 rounded-xl bg-accent p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">الرصيد المتبقي</span>
              <div className="flex items-center gap-1.5">
                <Zap className="h-4 w-4 text-primary" />
                <span className="text-lg font-bold text-foreground">300</span>
              </div>
            </div>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-border">
              <div className="h-full w-3/4 rounded-full bg-primary" />
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-1">
            <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-foreground hover:bg-accent transition-colors">
              <Settings className="h-4 w-4 text-muted-foreground" />
              الإعدادات
            </button>
            <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-destructive hover:bg-accent transition-colors">
              <LogOut className="h-4 w-4" />
              تسجيل الخروج
            </button>
          </div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
);

/* ─────────────────────── App Screen ─────────────────────── */
const AppScreen = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");

  return (
    <div className="relative flex min-h-screen flex-col bg-background font-cairo" dir="rtl">
      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-center justify-between px-4 py-3 border-b border-border"
      >
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="rounded-lg p-2 text-muted-foreground hover:bg-accent transition-colors"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="text-sm font-semibold text-foreground">ErfanAI 1.6 Lite</span>
        </div>

        <button
          onClick={() => setIsProfileOpen(true)}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground transition-transform hover:scale-105"
        >
          E
        </button>
      </motion.header>

      {/* Main content */}
      <div className="flex flex-1 flex-col items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8 text-center"
        >
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
            <Hand className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-1">مرحباً، Erfan</h2>
          <p className="text-sm text-muted-foreground">كيف يمكنني مساعدتك اليوم؟</p>
        </motion.div>

        {/* Quick actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8 grid w-full max-w-sm grid-cols-2 gap-3"
        >
          {[
            { icon: Globe, label: "بحث في الويب" },
            { icon: Bot, label: "وكيل ذكي" },
            { icon: Camera, label: "تحليل صورة" },
            { icon: MessageSquare, label: "محادثة جديدة" },
          ].map((action) => (
            <button
              key={action.label}
              className="flex items-center gap-2.5 rounded-xl border border-border bg-card p-3.5 text-right text-sm font-medium text-foreground transition-colors hover:bg-accent"
            >
              <action.icon className="h-4 w-4 text-primary shrink-0" />
              {action.label}
            </button>
          ))}
        </motion.div>
      </div>

      {/* Input bar */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="border-t border-border p-4"
      >
        <div className="flex items-end gap-2 rounded-2xl border border-border bg-card p-3">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="اكتب مهمتك هنا..."
            rows={1}
            className="flex-1 resize-none bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
            dir="rtl"
          />
          <div className="flex items-center gap-1">
            <button className="rounded-lg p-2 text-muted-foreground hover:bg-accent transition-colors">
              <Upload className="h-4 w-4" />
            </button>
            <button className="rounded-lg p-2 text-muted-foreground hover:bg-accent transition-colors">
              <Mic className="h-4 w-4" />
            </button>
            <button className="rounded-lg p-2 text-muted-foreground hover:bg-accent transition-colors">
              <Globe className="h-4 w-4" />
            </button>
            <button
              className="mr-1 flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-transform hover:scale-105 disabled:opacity-40"
              disabled={!inputValue.trim()}
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Sidebar & Profile */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <ProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
    </div>
  );
};

/* ─────────────────────── Main Export ─────────────────────── */
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
