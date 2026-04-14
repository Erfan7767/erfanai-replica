import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface Meeting {
  id: string;
  title: string;
  duration: number;
  notes: string | null;
  summary: string | null;
  transcript: string | null;
  audio_path: string | null;
  created_at: string;
}

export const useMeetings = () => {
  const { user } = useAuth();
  const [meetings, setMeetings] = useState<Meeting[]>([]);

  const fetchMeetings = useCallback(async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("meetings")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) setMeetings(data as Meeting[]);
  }, [user]);

  useEffect(() => { fetchMeetings(); }, [fetchMeetings]);

  const saveMeeting = useCallback(async (meeting: {
    title: string;
    duration: number;
    notes?: string;
    summary?: string;
    transcript?: string;
    audio_path?: string;
  }) => {
    if (!user) return null;
    const { data, error } = await supabase
      .from("meetings")
      .insert({ user_id: user.id, ...meeting })
      .select()
      .single();
    if (!error && data) {
      const m = data as Meeting;
      setMeetings(prev => [m, ...prev]);
      return m;
    }
    return null;
  }, [user]);

  const updateMeeting = useCallback(async (id: string, updates: Partial<Pick<Meeting, "title" | "notes" | "summary" | "audio_path">>) => {
    const cleanUpdates = Object.fromEntries(Object.entries(updates).filter(([_, v]) => v !== undefined));
    if (Object.keys(cleanUpdates).length === 0) return;
    const { error } = await supabase.from("meetings").update(cleanUpdates).eq("id", id);
    if (!error) setMeetings(prev => prev.map(m => m.id === id ? { ...m, ...cleanUpdates } : m));
  }, []);

  const deleteMeeting = useCallback(async (id: string) => {
    await supabase.from("meetings").delete().eq("id", id);
    setMeetings(prev => prev.filter(m => m.id !== id));
  }, []);

  const uploadAudio = useCallback(async (blob: Blob, meetingId: string): Promise<string | null> => {
    if (!user) return null;
    const path = `${user.id}/${meetingId}.webm`;
    const { error } = await supabase.storage.from("user-files").upload(path, blob, { contentType: "audio/webm" });
    if (error) { console.error("Audio upload error:", error); return null; }
    return path;
  }, [user]);

  return { meetings, fetchMeetings, saveMeeting, updateMeeting, deleteMeeting, uploadAudio };
};
