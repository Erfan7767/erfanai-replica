
-- Revoke from anon on user-facing functions (still callable by authenticated)
REVOKE EXECUTE ON FUNCTION public.get_today_usage() FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.get_user_analytics(integer) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.get_user_plan() FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.increment_credits(integer) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM anon, public;

GRANT EXECUTE ON FUNCTION public.get_today_usage() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_analytics(integer) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_plan() TO authenticated;
GRANT EXECUTE ON FUNCTION public.increment_credits(integer) TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;

-- Internal-only functions: revoke from everyone exposed via API
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.update_conversation_timestamp() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.set_user_plan(uuid, text, integer, text, text, timestamptz, text, text) FROM anon, authenticated, public;
