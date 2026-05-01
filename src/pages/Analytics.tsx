import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useAnalytics } from "@/hooks/useAnalytics";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, BarChart3, Users, Eye, MessagesSquare, Zap, TrendingUp, Globe2 } from "lucide-react";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  BarChart, Bar, PieChart, Pie, Cell, Legend
} from "recharts";

const COLORS = ["hsl(var(--primary))", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#ec4899"];

export default function AnalyticsPage() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [days, setDays] = useState(30);
  const { data, loading, error, refetch } = useAnalytics(days);

  if (authLoading) return null;
  if (!user) { navigate("/"); return null; }

  return (
    <div dir="rtl" className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-10 border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
              <ArrowLeft className="h-5 w-5 rotate-180" />
            </Button>
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              <h1 className="text-lg font-bold">تحليلات المشروع</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {[7, 30, 90].map((d) => (
              <Button key={d} size="sm" variant={days === d ? "default" : "outline"} onClick={() => setDays(d)}>
                {d} يوم
              </Button>
            ))}
            <Button size="sm" variant="ghost" onClick={refetch}>تحديث</Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-6 p-4 md:p-6">
        {error && <Card className="border-destructive p-4 text-destructive">خطأ: {error}</Card>}

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <KPI icon={<Eye className="h-4 w-4" />} label="مشاهدات الصفحات" value={data?.page_views ?? 0} loading={loading} accent="text-blue-400" />
          <KPI icon={<Users className="h-4 w-4" />} label="جلسات فريدة" value={data?.unique_sessions ?? 0} loading={loading} accent="text-emerald-400" />
          <KPI icon={<MessagesSquare className="h-4 w-4" />} label="الرسائل" value={data?.messages ?? 0} loading={loading} accent="text-amber-400" />
          <KPI icon={<Zap className="h-4 w-4" />} label="الرصيد المستهلك" value={data?.credits_used ?? 0} loading={loading} accent="text-fuchsia-400" />
        </div>

        <Card className="p-4">
          <div className="mb-3 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-semibold">النشاط اليومي</h2>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data?.by_day ?? []}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} allowDecimals={false} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                <Legend />
                <Area type="monotone" dataKey="views" name="مشاهدات" stroke="hsl(var(--primary))" fill="url(#g1)" />
                <Area type="monotone" dataKey="sessions" name="جلسات" stroke="#10b981" fill="url(#g2)" />
                <Area type="monotone" dataKey="messages" name="رسائل" stroke="#f59e0b" fillOpacity={0} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="p-4">
            <div className="mb-3 flex items-center gap-2">
              <Globe2 className="h-4 w-4 text-primary" />
              <h2 className="text-sm font-semibold">مصادر الزيارات</h2>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={data?.by_source ?? []} dataKey="count" nameKey="source" outerRadius={90} label>
                    {(data?.by_source ?? []).map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-4">
            <h2 className="mb-3 text-sm font-semibold">أكثر الصفحات مشاهدة</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data?.top_paths ?? []} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={11} allowDecimals={false} />
                  <YAxis type="category" dataKey="path" stroke="hsl(var(--muted-foreground))" fontSize={11} width={120} />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                  <Bar dataKey="count" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        <Card className="p-4">
          <h2 className="mb-3 text-sm font-semibold">توزيع الأحداث</h2>
          <div className="flex flex-wrap gap-2">
            {(data?.event_breakdown ?? []).length === 0 && (
              <p className="text-sm text-muted-foreground">لا توجد أحداث بعد. تصفح وأرسل رسائل لتعبئة البيانات.</p>
            )}
            {(data?.event_breakdown ?? []).map((e) => (
              <Badge key={e.event_name} variant="secondary" className="text-xs">
                {e.event_name} <span className="ms-1 opacity-60">×{e.count}</span>
              </Badge>
            ))}
          </div>
        </Card>
      </main>
    </div>
  );
}

function KPI({ icon, label, value, loading, accent }: { icon: React.ReactNode; label: string; value: number; loading: boolean; accent: string; }) {
  return (
    <Card className="relative overflow-hidden p-4">
      <div className={`mb-2 inline-flex items-center gap-1.5 rounded-full bg-muted/50 px-2 py-1 text-xs ${accent}`}>
        {icon} <span>{label}</span>
      </div>
      <div className="text-2xl font-bold tabular-nums">
        {loading ? "…" : value.toLocaleString("ar-EG")}
      </div>
    </Card>
  );
}
