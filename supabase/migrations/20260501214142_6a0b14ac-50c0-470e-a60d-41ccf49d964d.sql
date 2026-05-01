-- Analytics events table
CREATE TABLE public.analytics_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  session_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  event_name TEXT NOT NULL,
  path TEXT,
  referrer TEXT,
  user_agent TEXT,
  source TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_analytics_user_created ON public.analytics_events(user_id, created_at DESC);
CREATE INDEX idx_analytics_event_type ON public.analytics_events(event_type, created_at DESC);
CREATE INDEX idx_analytics_session ON public.analytics_events(session_id);

ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- Anyone (incl. anonymous visitors) can insert their own events
CREATE POLICY "Anyone can insert analytics events"
  ON public.analytics_events FOR INSERT
  WITH CHECK (user_id IS NULL OR auth.uid() = user_id);

-- Users can view ONLY their own events
CREATE POLICY "Users can view own analytics events"
  ON public.analytics_events FOR SELECT
  USING (auth.uid() = user_id);

-- Aggregation function: returns analytics summary for current user over N days
CREATE OR REPLACE FUNCTION public.get_user_analytics(p_days INTEGER DEFAULT 30)
RETURNS JSON
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID := auth.uid();
  v_since TIMESTAMPTZ := now() - (p_days || ' days')::INTERVAL;
  v_total_events INT;
  v_unique_sessions INT;
  v_page_views INT;
  v_conversations INT;
  v_messages INT;
  v_credits_used INT;
  v_by_day JSON;
  v_by_source JSON;
  v_top_paths JSON;
  v_event_breakdown JSON;
BEGIN
  IF v_user_id IS NULL THEN
    RETURN json_build_object('error','not_authenticated');
  END IF;

  SELECT COUNT(*) INTO v_total_events
    FROM analytics_events
    WHERE user_id = v_user_id AND created_at >= v_since;

  SELECT COUNT(DISTINCT session_id) INTO v_unique_sessions
    FROM analytics_events
    WHERE user_id = v_user_id AND created_at >= v_since;

  SELECT COUNT(*) INTO v_page_views
    FROM analytics_events
    WHERE user_id = v_user_id AND event_type = 'page_view' AND created_at >= v_since;

  SELECT COUNT(*) INTO v_conversations
    FROM conversations
    WHERE user_id = v_user_id AND created_at >= v_since;

  SELECT COUNT(*) INTO v_messages
    FROM messages m
    JOIN conversations c ON c.id = m.conversation_id
    WHERE c.user_id = v_user_id AND m.created_at >= v_since;

  SELECT COALESCE(SUM(credits_used),0) INTO v_credits_used
    FROM user_usage
    WHERE user_id = v_user_id AND date >= (CURRENT_DATE - p_days);

  -- daily series
  SELECT json_agg(row_to_json(t) ORDER BY day) INTO v_by_day FROM (
    SELECT
      to_char(d::date, 'YYYY-MM-DD') AS day,
      COALESCE((SELECT COUNT(*) FROM analytics_events e
                WHERE e.user_id = v_user_id
                  AND e.event_type = 'page_view'
                  AND e.created_at::date = d::date),0) AS views,
      COALESCE((SELECT COUNT(DISTINCT session_id) FROM analytics_events e
                WHERE e.user_id = v_user_id
                  AND e.created_at::date = d::date),0) AS sessions,
      COALESCE((SELECT COUNT(*) FROM messages m
                JOIN conversations c ON c.id=m.conversation_id
                WHERE c.user_id = v_user_id
                  AND m.created_at::date = d::date),0) AS messages
    FROM generate_series(v_since::date, CURRENT_DATE, INTERVAL '1 day') d
  ) t;

  -- traffic sources
  SELECT json_agg(row_to_json(s)) INTO v_by_source FROM (
    SELECT COALESCE(NULLIF(source,''),'direct') AS source, COUNT(*)::int AS count
    FROM analytics_events
    WHERE user_id = v_user_id AND event_type = 'page_view' AND created_at >= v_since
    GROUP BY 1 ORDER BY 2 DESC LIMIT 10
  ) s;

  -- top paths
  SELECT json_agg(row_to_json(p)) INTO v_top_paths FROM (
    SELECT COALESCE(path,'/') AS path, COUNT(*)::int AS count
    FROM analytics_events
    WHERE user_id = v_user_id AND event_type = 'page_view' AND created_at >= v_since
    GROUP BY 1 ORDER BY 2 DESC LIMIT 10
  ) p;

  -- event breakdown
  SELECT json_agg(row_to_json(b)) INTO v_event_breakdown FROM (
    SELECT event_name, COUNT(*)::int AS count
    FROM analytics_events
    WHERE user_id = v_user_id AND created_at >= v_since
    GROUP BY 1 ORDER BY 2 DESC LIMIT 15
  ) b;

  RETURN json_build_object(
    'days', p_days,
    'total_events', v_total_events,
    'unique_sessions', v_unique_sessions,
    'page_views', v_page_views,
    'conversations', v_conversations,
    'messages', v_messages,
    'credits_used', v_credits_used,
    'by_day', COALESCE(v_by_day,'[]'::json),
    'by_source', COALESCE(v_by_source,'[]'::json),
    'top_paths', COALESCE(v_top_paths,'[]'::json),
    'event_breakdown', COALESCE(v_event_breakdown,'[]'::json)
  );
END;
$$;