import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export type PlanTier = "free" | "pro" | "plus" | "max";

export interface UserPlan {
  tier: PlanTier;
  status: string;
  billing_cycle?: "monthly" | "yearly";
  monthly_credits: number;
  daily_credits: number;
  current_period_end?: string | null;
}

const defaultPlan: UserPlan = {
  tier: "free",
  status: "active",
  monthly_credits: 300,
  daily_credits: 300,
};

export const usePlan = () => {
  const { user } = useAuth();
  const [plan, setPlan] = useState<UserPlan>(defaultPlan);
  const [loading, setLoading] = useState(true);

  const fetchPlan = useCallback(async () => {
    if (!user) {
      setPlan(defaultPlan);
      setLoading(false);
      return;
    }
    const { data, error } = await supabase.rpc("get_user_plan");
    if (!error && data) setPlan(data as unknown as UserPlan);
    setLoading(false);
  }, [user]);

  useEffect(() => { fetchPlan(); }, [fetchPlan]);

  const isPaid = plan.tier !== "free";
  const can = useCallback(
    (feature: "scheduled_tasks" | "knowledge_base" | "advanced_models" | "meetings" | "projects") => {
      if (feature === "advanced_models") return isPaid;
      if (feature === "scheduled_tasks") return plan.tier === "plus" || plan.tier === "max";
      return true; // free features
    },
    [plan.tier, isPaid]
  );

  return { plan, loading, isPaid, can, refetch: fetchPlan };
};
