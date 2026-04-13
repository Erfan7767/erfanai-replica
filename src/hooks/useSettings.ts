import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { type Lang } from "@/lib/translations";

export interface UserSettings {
  language: Lang;
  theme: string;
  font_size: string;
  chat_bubble_style: string;
  default_model: string;
  notif_messages: boolean;
  notif_updates: boolean;
  notif_sound: boolean;
  notif_vibration: boolean;
  notif_email: boolean;
}

const defaultSettings: UserSettings = {
  language: "العربية",
  theme: "dark",
  font_size: "medium",
  chat_bubble_style: "modern",
  default_model: "ErfanAI Lite",
  notif_messages: true,
  notif_updates: true,
  notif_sound: true,
  notif_vibration: false,
  notif_email: false,
};

export const useSettings = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  const [loaded, setLoaded] = useState(false);

  const fetchSettings = useCallback(async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("user_settings")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();
    if (!error && data) {
      const s: UserSettings = {
        language: (data as any).language || defaultSettings.language,
        theme: (data as any).theme || defaultSettings.theme,
        font_size: (data as any).font_size || defaultSettings.font_size,
        chat_bubble_style: (data as any).chat_bubble_style || defaultSettings.chat_bubble_style,
        default_model: (data as any).default_model || defaultSettings.default_model,
        notif_messages: (data as any).notif_messages ?? defaultSettings.notif_messages,
        notif_updates: (data as any).notif_updates ?? defaultSettings.notif_updates,
        notif_sound: (data as any).notif_sound ?? defaultSettings.notif_sound,
        notif_vibration: (data as any).notif_vibration ?? defaultSettings.notif_vibration,
        notif_email: (data as any).notif_email ?? defaultSettings.notif_email,
      };
      setSettings(s);
    }
    setLoaded(true);
  }, [user]);

  useEffect(() => { fetchSettings(); }, [fetchSettings]);

  const updateSetting = useCallback(async <K extends keyof UserSettings>(key: K, value: UserSettings[K]) => {
    if (!user) return;
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);

    // Upsert
    const { error } = await supabase
      .from("user_settings")
      .upsert({
        user_id: user.id,
        ...newSettings,
      }, { onConflict: "user_id" });
    if (error) console.error("Settings update error:", error);
  }, [user, settings]);

  return { settings, loaded, updateSetting };
};
