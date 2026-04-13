import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface ScheduledTask {
  id: string;
  title: string;
  description: string | null;
  schedule_type: string;
  schedule_time: string;
  prompt: string | null;
  enabled: boolean;
  last_run_at: string | null;
  created_at: string;
}

export const useScheduledTasks = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<ScheduledTask[]>([]);

  const fetchTasks = useCallback(async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("scheduled_tasks")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) setTasks(data as ScheduledTask[]);
  }, [user]);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  const addTask = useCallback(async (task: {
    title: string;
    description?: string;
    schedule_type: string;
    schedule_time: string;
    prompt?: string;
  }) => {
    if (!user) return;
    const { data, error } = await supabase
      .from("scheduled_tasks")
      .insert({ user_id: user.id, ...task })
      .select()
      .single();
    if (!error && data) setTasks(prev => [data as ScheduledTask, ...prev]);
  }, [user]);

  const updateTask = useCallback(async (id: string, updates: Partial<Pick<ScheduledTask, "title" | "description" | "schedule_type" | "schedule_time" | "prompt" | "enabled">>) => {
    const { error } = await supabase.from("scheduled_tasks").update(updates).eq("id", id);
    if (!error) setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  }, []);

  const deleteTask = useCallback(async (id: string) => {
    await supabase.from("scheduled_tasks").delete().eq("id", id);
    setTasks(prev => prev.filter(t => t.id !== id));
  }, []);

  const toggleTask = useCallback(async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    await updateTask(id, { enabled: !task.enabled });
  }, [tasks, updateTask]);

  return { tasks, fetchTasks, addTask, updateTask, deleteTask, toggleTask };
};
