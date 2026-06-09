
CREATE POLICY "Users can update own messages"
ON public.messages
FOR UPDATE
USING (EXISTS (SELECT 1 FROM public.conversations c WHERE c.id = messages.conversation_id AND c.user_id = auth.uid()))
WITH CHECK (EXISTS (SELECT 1 FROM public.conversations c WHERE c.id = messages.conversation_id AND c.user_id = auth.uid()));

CREATE POLICY "Users update own files"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'user-files' AND (auth.uid())::text = (storage.foldername(name))[1])
WITH CHECK (bucket_id = 'user-files' AND (auth.uid())::text = (storage.foldername(name))[1]);

REVOKE INSERT, UPDATE, DELETE ON public.user_subscriptions FROM authenticated, anon;
CREATE POLICY "No client inserts on subscriptions"
ON public.user_subscriptions FOR INSERT TO authenticated WITH CHECK (false);
CREATE POLICY "No client updates on subscriptions"
ON public.user_subscriptions FOR UPDATE TO authenticated USING (false) WITH CHECK (false);
CREATE POLICY "No client deletes on subscriptions"
ON public.user_subscriptions FOR DELETE TO authenticated USING (false);

DROP POLICY IF EXISTS "Users can insert own usage" ON public.user_usage;
DROP POLICY IF EXISTS "Users can update own usage" ON public.user_usage;
REVOKE INSERT, UPDATE, DELETE ON public.user_usage FROM authenticated, anon;
CREATE POLICY "No client inserts on usage"
ON public.user_usage FOR INSERT TO authenticated WITH CHECK (false);
CREATE POLICY "No client updates on usage"
ON public.user_usage FOR UPDATE TO authenticated USING (false) WITH CHECK (false);
CREATE POLICY "No client deletes on usage"
ON public.user_usage FOR DELETE TO authenticated USING (false);

REVOKE EXECUTE ON FUNCTION public.get_today_usage() FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.get_user_plan() FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.get_user_analytics(integer) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.increment_credits(integer) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_today_usage() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_plan() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_analytics(integer) TO authenticated;
GRANT EXECUTE ON FUNCTION public.increment_credits(integer) TO authenticated;
