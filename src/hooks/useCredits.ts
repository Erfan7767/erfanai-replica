import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface UsageData {
  credits_used: number;
  total_daily_credits: number;
  remaining: number;
}

export const useCredits = () => {
  const { user } = useAuth();
  const [usage, setUsage] = useState<UsageData>({
    credits_used: 0,
    total_daily_credits: 300,
    remaining: 300,
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

  const consumeCredits = useCallback(async (cost: number = 2) => {
    if (!user) return;
    try {
      const { data, error } = await supabase.rpc('increment_credits', { p_cost: cost });
      if (!error && data) {
        setUsage(data as unknown as UsageData);
      }
    } catch (e) {
      console.error('Failed to consume credits:', e);
    }
  }, [user]);

  return { usage, loading, consumeCredits, refetchUsage: fetchUsage };
};
