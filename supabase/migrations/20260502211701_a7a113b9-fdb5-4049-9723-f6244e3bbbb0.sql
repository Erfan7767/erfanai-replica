
-- Subscriptions table
CREATE TABLE public.user_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  tier TEXT NOT NULL DEFAULT 'free' CHECK (tier IN ('free','pro','plus','max')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','canceled','past_due','trialing','incomplete')),
  billing_cycle TEXT NOT NULL DEFAULT 'monthly' CHECK (billing_cycle IN ('monthly','yearly')),
  monthly_credits INTEGER NOT NULL DEFAULT 300,
  current_period_end TIMESTAMPTZ,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own subscription"
  ON public.user_subscriptions FOR SELECT
  USING (auth.uid() = user_id);

CREATE TRIGGER trg_subscriptions_updated_at
  BEFORE UPDATE ON public.user_subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Plan helper
CREATE OR REPLACE FUNCTION public.get_user_plan()
RETURNS json
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID := auth.uid();
  v_row user_subscriptions%ROWTYPE;
  v_daily INT;
BEGIN
  IF v_user_id IS NULL THEN
    RETURN json_build_object('tier','free','status','active','monthly_credits',300,'daily_credits',300);
  END IF;
  SELECT * INTO v_row FROM user_subscriptions WHERE user_id = v_user_id;
  IF NOT FOUND OR v_row.status NOT IN ('active','trialing') THEN
    RETURN json_build_object('tier','free','status','active','monthly_credits',300,'daily_credits',300);
  END IF;
  v_daily := GREATEST(300, CEIL(v_row.monthly_credits::numeric / 30));
  RETURN json_build_object(
    'tier', v_row.tier,
    'status', v_row.status,
    'billing_cycle', v_row.billing_cycle,
    'monthly_credits', v_row.monthly_credits,
    'daily_credits', v_daily,
    'current_period_end', v_row.current_period_end
  );
END;
$$;

-- Set/upgrade plan (called by future Stripe webhook or admin)
CREATE OR REPLACE FUNCTION public.set_user_plan(
  p_user_id UUID,
  p_tier TEXT,
  p_monthly_credits INTEGER,
  p_billing_cycle TEXT DEFAULT 'monthly',
  p_status TEXT DEFAULT 'active',
  p_period_end TIMESTAMPTZ DEFAULT NULL,
  p_stripe_customer_id TEXT DEFAULT NULL,
  p_stripe_subscription_id TEXT DEFAULT NULL
)
RETURNS user_subscriptions
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE v_row user_subscriptions%ROWTYPE;
BEGIN
  INSERT INTO user_subscriptions (
    user_id, tier, monthly_credits, billing_cycle, status,
    current_period_end, stripe_customer_id, stripe_subscription_id
  ) VALUES (
    p_user_id, p_tier, p_monthly_credits, p_billing_cycle, p_status,
    p_period_end, p_stripe_customer_id, p_stripe_subscription_id
  )
  ON CONFLICT (user_id) DO UPDATE SET
    tier = EXCLUDED.tier,
    monthly_credits = EXCLUDED.monthly_credits,
    billing_cycle = EXCLUDED.billing_cycle,
    status = EXCLUDED.status,
    current_period_end = EXCLUDED.current_period_end,
    stripe_customer_id = COALESCE(EXCLUDED.stripe_customer_id, user_subscriptions.stripe_customer_id),
    stripe_subscription_id = COALESCE(EXCLUDED.stripe_subscription_id, user_subscriptions.stripe_subscription_id),
    updated_at = now()
  RETURNING * INTO v_row;

  -- Sync today's usage row daily cap so existing usage continues smoothly
  UPDATE user_usage
    SET total_daily_credits = GREATEST(300, CEIL(p_monthly_credits::numeric / 30))
    WHERE user_id = p_user_id AND date = CURRENT_DATE;

  RETURN v_row;
END;
$$;

-- Override get_today_usage to reflect plan
CREATE OR REPLACE FUNCTION public.get_today_usage()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID := auth.uid();
  v_record user_usage%ROWTYPE;
  v_plan json;
  v_daily INT;
  v_tier TEXT;
BEGIN
  v_plan := get_user_plan();
  v_daily := COALESCE((v_plan->>'daily_credits')::int, 300);
  v_tier := COALESCE(v_plan->>'tier','free');

  SELECT * INTO v_record FROM user_usage
   WHERE user_id = v_user_id AND date = CURRENT_DATE;

  IF NOT FOUND THEN
    RETURN json_build_object(
      'credits_used', 0,
      'total_daily_credits', v_daily,
      'remaining', v_daily,
      'tier', v_tier
    );
  END IF;

  RETURN json_build_object(
    'credits_used', v_record.credits_used,
    'total_daily_credits', v_daily,
    'remaining', GREATEST(0, v_daily - v_record.credits_used),
    'tier', v_tier
  );
END;
$$;

-- Override increment_credits to enforce plan ceiling
CREATE OR REPLACE FUNCTION public.increment_credits(p_cost integer DEFAULT 2)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID := auth.uid();
  v_record user_usage%ROWTYPE;
  v_plan json := get_user_plan();
  v_daily INT := COALESCE((v_plan->>'daily_credits')::int, 300);
  v_tier TEXT := COALESCE(v_plan->>'tier','free');
BEGIN
  INSERT INTO user_usage (user_id, date, credits_used, total_daily_credits)
  VALUES (v_user_id, CURRENT_DATE, p_cost, v_daily)
  ON CONFLICT (user_id, date)
  DO UPDATE SET
    credits_used = user_usage.credits_used + p_cost,
    total_daily_credits = v_daily,
    updated_at = now()
  RETURNING * INTO v_record;

  RETURN json_build_object(
    'credits_used', v_record.credits_used,
    'total_daily_credits', v_daily,
    'remaining', GREATEST(0, v_daily - v_record.credits_used),
    'tier', v_tier,
    'over_limit', v_record.credits_used > v_daily
  );
END;
$$;
