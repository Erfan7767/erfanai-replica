
-- Table to track daily user credits usage
CREATE TABLE public.user_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  credits_used INTEGER NOT NULL DEFAULT 0,
  total_daily_credits INTEGER NOT NULL DEFAULT 300,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, date)
);

-- Enable RLS
ALTER TABLE public.user_usage ENABLE ROW LEVEL SECURITY;

-- Users can only see their own usage
CREATE POLICY "Users can view own usage" ON public.user_usage
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- Users can insert their own usage
CREATE POLICY "Users can insert own usage" ON public.user_usage
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own usage
CREATE POLICY "Users can update own usage" ON public.user_usage
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Function to increment credits used (upsert for today)
CREATE OR REPLACE FUNCTION public.increment_credits(p_cost INTEGER DEFAULT 2)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_record user_usage%ROWTYPE;
BEGIN
  INSERT INTO user_usage (user_id, date, credits_used)
  VALUES (auth.uid(), CURRENT_DATE, p_cost)
  ON CONFLICT (user_id, date)
  DO UPDATE SET credits_used = user_usage.credits_used + p_cost, updated_at = now()
  RETURNING * INTO v_record;
  
  RETURN json_build_object(
    'credits_used', v_record.credits_used,
    'total_daily_credits', v_record.total_daily_credits,
    'remaining', v_record.total_daily_credits - v_record.credits_used
  );
END;
$$;

-- Function to get today's usage
CREATE OR REPLACE FUNCTION public.get_today_usage()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_record user_usage%ROWTYPE;
BEGIN
  SELECT * INTO v_record FROM user_usage
  WHERE user_id = auth.uid() AND date = CURRENT_DATE;
  
  IF NOT FOUND THEN
    RETURN json_build_object(
      'credits_used', 0,
      'total_daily_credits', 300,
      'remaining', 300
    );
  END IF;
  
  RETURN json_build_object(
    'credits_used', v_record.credits_used,
    'total_daily_credits', v_record.total_daily_credits,
    'remaining', v_record.total_daily_credits - v_record.credits_used
  );
END;
$$;
