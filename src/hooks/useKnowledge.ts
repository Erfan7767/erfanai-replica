import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface KnowledgeItem {
  id: string;
  title: string;
  content: string;
  enabled: boolean;
  created_at: string;
  updated_at: string;
}

export const useKnowledge = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<KnowledgeItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchItems = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("knowledge_items")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) setItems(data as KnowledgeItem[]);
    setLoading(false);
  }, [user]);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const addItem = useCallback(async (title: string, content: string) => {
    if (!user) return;
    const { data, error } = await supabase
      .from("knowledge_items")
      .insert({ user_id: user.id, title, content })
      .select()
      .single();
    if (!error && data) setItems(prev => [data as KnowledgeItem, ...prev]);
  }, [user]);

  const updateItem = useCallback(async (id: string, title: string, content: string) => {
    const { error } = await supabase
      .from("knowledge_items")
      .update({ title, content })
      .eq("id", id);
    if (!error) setItems(prev => prev.map(i => i.id === id ? { ...i, title, content, updated_at: new Date().toISOString() } : i));
  }, []);

  const deleteItem = useCallback(async (id: string) => {
    await supabase.from("knowledge_items").delete().eq("id", id);
    setItems(prev => prev.filter(i => i.id !== id));
  }, []);

  const toggleItem = useCallback(async (id: string) => {
    const item = items.find(i => i.id === id);
    if (!item) return;
    const { error } = await supabase
      .from("knowledge_items")
      .update({ enabled: !item.enabled })
      .eq("id", id);
    if (!error) setItems(prev => prev.map(i => i.id === id ? { ...i, enabled: !i.enabled } : i));
  }, [items]);

  const getEnabledContext = useCallback(() => {
    return items.filter(i => i.enabled).map(i => `[${i.title}]: ${i.content}`).join("\n");
  }, [items]);

  return { items, loading, addItem, updateItem, deleteItem, toggleItem, getEnabledContext };
};
