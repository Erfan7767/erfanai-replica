import { useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const SESSION_KEY = "erfan_analytics_session";

function getSessionId(): string {
  let s = sessionStorage.getItem(SESSION_KEY);
  if (!s) {
    s = crypto.randomUUID();
    sessionStorage.setItem(SESSION_KEY, s);
  }
  return s;
}

function detectSource(referrer: string): string {
  if (!referrer) return "direct";
  try {
    const host = new URL(referrer).hostname.toLowerCase();
    if (host.includes("google.")) return "google";
    if (host.includes("bing.")) return "bing";
    if (host.includes("duckduckgo.")) return "duckduckgo";
    if (host.includes("facebook.") || host.includes("fb.")) return "facebook";
    if (host.includes("twitter.") || host.includes("x.com")) return "twitter";
    if (host.includes("linkedin.")) return "linkedin";
    if (host.includes("instagram.")) return "instagram";
    if (host.includes("youtube.")) return "youtube";
    if (host.includes("tiktok.")) return "tiktok";
    if (host.includes("reddit.")) return "reddit";
    if (host.includes("github.")) return "github";
    return host;
  } catch {
    return "direct";
  }
}

export async function trackEvent(
  eventType: string,
  eventName: string,
  metadata: Record<string, unknown> = {},
  userId?: string | null
) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    const uid = userId ?? user?.id ?? null;
    await supabase.from("analytics_events").insert([{
      user_id: uid ?? undefined,
      session_id: getSessionId(),
      event_type: eventType,
      event_name: eventName,
      path: typeof window !== "undefined" ? window.location.pathname : null,
      referrer: typeof document !== "undefined" ? document.referrer : null,
      user_agent: typeof navigator !== "undefined" ? navigator.userAgent : null,
      source: typeof document !== "undefined" ? detectSource(document.referrer) : "direct",
      metadata,
    });
  } catch (e) {
    console.error("analytics track error", e);
  }
}

/** Auto page-view tracking. Mount once near app root. */
export function useAnalyticsTracker() {
  const { user } = useAuth();
  const lastPath = useRef<string>("");

  useEffect(() => {
    const path = window.location.pathname;
    if (lastPath.current === path) return;
    lastPath.current = path;
    trackEvent("page_view", "page_view", { title: document.title }, user?.id ?? null);
  }, [user?.id]);
}
