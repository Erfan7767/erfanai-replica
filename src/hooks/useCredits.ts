import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface UsageData {
  credits_used: number;
  total_daily_credits: number;
  remaining: number;
  tier?: string;
  over_limit?: boolean;
}

const TIER_LABEL: Record<string, string> = {
  free: "المجانية",
  pro: "Pro",
  plus: "Plus",
  max: "Max",
};

const tierUpgradeHint = (tier?: string) => {
  switch (tier) {
    case "pro": return "يمكنك الترقية إلى Plus أو Max لزيادة السقف.";
    case "plus": return "يمكنك الترقية إلى Max للحصول على سقف أعلى.";
    case "max": return "لقد بلغت الحد الأقصى لخطة Max، سيتم التجديد غداً.";
    default: return "قم بالترقية إلى Pro/Plus/Max للحصول على سقف يومي أعلى.";
  }
};

export const useCredits = () => {
  const { user } = useAuth();
  const [usage, setUsage] = useState<UsageData>({
    credits_used: 0,
    total_daily_credits: 300,
    remaining: 300,
    tier: "free",
  });
  const [loading, setLoading] = useState(true);

  const fetchUsage = useCallback(async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase.rpc('get_today_usage');
      if (!error && data) {
        setUsage(data as unknown as UsageData);
      }
    } catch (e) {
      console.error('Failed to fetch usage:', e);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchUsage();
  }, [fetchUsage]);

  const canConsume = useCallback(
    (cost: number = 2) => {
      if (!user) return true;
      const projected = usage.credits_used + cost;
      if (usage.remaining <= 0 || projected > usage.total_daily_credits) {
        const tierLabel = TIER_LABEL[usage.tier || "free"] || "المجانية";
        const overBy = Math.max(0, projected - usage.total_daily_credits);
        const title = usage.remaining <= 0
          ? `تم استنفاد سقفك اليومي بالكامل (${usage.credits_used}/${usage.total_daily_credits} رصيد)`
          : `لا يمكن إرسال هذه الرسالة — ستتجاوز سقفك اليومي بمقدار ${overBy} رصيد`;
        toast.error(title, {
          description: `الخطة الحالية: ${tierLabel} • تكلفة الرسالة: ${cost} • المتبقي: ${usage.remaining} من ${usage.total_daily_credits}. ${tierUpgradeHint(usage.tier)}`,
          duration: 6000,
        });
        return false;
      }
      return true;
    },
    [user, usage]
  );

  const consumeCredits = useCallback(async (cost: number = 2) => {
    if (!user) return null;
    try {
      const { data, error } = await supabase.rpc('increment_credits', { p_cost: cost });
      if (!error && data) {
        const next = data as unknown as UsageData;
        setUsage(next);
        if (next.over_limit) {
          const tierLabel = TIER_LABEL[next.tier || "free"] || "المجانية";
          const overBy = Math.max(0, next.credits_used - next.total_daily_credits);
          toast.warning(`تجاوزت سقف خطة ${tierLabel} بمقدار ${overBy} رصيد (${next.credits_used}/${next.total_daily_credits})`, {
            description: tierUpgradeHint(next.tier),
            duration: 6000,
          });
        } else if (next.remaining > 0 && next.remaining <= Math.max(10, Math.floor(next.total_daily_credits * 0.1))) {
          toast(`تنبيه: تبقّى ${next.remaining} رصيد فقط من أصل ${next.total_daily_credits} لسقفك اليومي`, { duration: 4000 });
        }
        return next;
      }
    } catch (e) {
      console.error('Failed to consume credits:', e);
    }
    return null;
  }, [user]);

  return { usage, loading, consumeCredits, canConsume, refetchUsage: fetchUsage };
};
