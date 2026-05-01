import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface AnalyticsSummary {
  days: number;
  total_events: number;
  unique_sessions: number;
  page_views: number;
  conversations: number;
  messages: number;
  credits_used: number;
  by_day: Array<{ day: string; views: number; sessions: number; messages: number }>;
  by_source: Array<{ source: string; count: number }>;
  top_paths: Array<{ path: string; count: number }>;
  event_breakdown: Array<{ event_name: string; count: number }>;
}

export function useAnalytics(days: number = 30) {
  const { user } = useAuth();
  const [data, setData] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!user) { setLoading(false); return; }
    setLoading(true); setError(null);
    const { data: res, error: err } = await supabase.rpc("get_user_analytics", { p_days: days });
    if (err) { setError(err.message); setLoading(false); return; }
    setData(res as unknown as AnalyticsSummary);
    setLoading(false);
  }, [user, days]);

  useEffect(() => { fetchData(); }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}
