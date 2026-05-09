import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface AppNotification {
  id: string;
  user_id: string;
  title: string;
  body: string | null;
  kind: string;
  read: boolean;
  link: string | null;
  created_at: string;
}

export function useNotifications() {
  const { user } = useAuth();
  const [items, setItems] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data } = await supabase
      .from("notifications")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);
    setItems((data as AppNotification[]) ?? []);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    load();
    if (!user) return;
    const ch = supabase
      .channel(`notif-${user.id}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "notifications", filter: `user_id=eq.${user.id}` },
        () => load()
      )
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [user, load]);

  const markRead = async (id: string) => {
    await supabase.from("notifications").update({ read: true }).eq("id", id);
  };
  const markAllRead = async () => {
    if (!user) return;
    await supabase.from("notifications").update({ read: true }).eq("user_id", user.id).eq("read", false);
  };
  const remove = async (id: string) => {
    await supabase.from("notifications").delete().eq("id", id);
  };
  const push = async (n: { title: string; body?: string; kind?: string; link?: string }) => {
    if (!user) return;
    await supabase.from("notifications").insert({
      user_id: user.id,
      title: n.title,
      body: n.body ?? null,
      kind: n.kind ?? "info",
      link: n.link ?? null,
    });
  };

  const unread = items.filter((i) => !i.read).length;
  return { items, unread, loading, markRead, markAllRead, remove, push, reload: load };
}
