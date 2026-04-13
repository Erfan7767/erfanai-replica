import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface Project {
  id: string;
  name: string;
  description: string | null;
  master_instructions: string | null;
  created_at: string;
  updated_at: string;
}

export const useProjects = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);

  const fetchProjects = useCallback(async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("updated_at", { ascending: false });
    if (!error && data) setProjects(data as Project[]);
  }, [user]);

  useEffect(() => { fetchProjects(); }, [fetchProjects]);

  const createProject = useCallback(async (name: string, description?: string, masterInstructions?: string) => {
    if (!user) return null;
    const { data, error } = await supabase
      .from("projects")
      .insert({ user_id: user.id, name, description, master_instructions: masterInstructions })
      .select()
      .single();
    if (!error && data) {
      const p = data as Project;
      setProjects(prev => [p, ...prev]);
      return p;
    }
    return null;
  }, [user]);

  const updateProject = useCallback(async (id: string, updates: Partial<Pick<Project, "name" | "description" | "master_instructions">>) => {
    const { error } = await supabase.from("projects").update(updates).eq("id", id);
    if (!error) setProjects(prev => prev.map(p => p.id === id ? { ...p, ...updates, updated_at: new Date().toISOString() } : p));
  }, []);

  const deleteProject = useCallback(async (id: string) => {
    await supabase.from("projects").delete().eq("id", id);
    setProjects(prev => prev.filter(p => p.id !== id));
  }, []);

  return { projects, fetchProjects, createProject, updateProject, deleteProject };
};
