export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      analytics_events: {
        Row: {
          created_at: string
          event_name: string
          event_type: string
          id: string
          metadata: Json | null
          path: string | null
          referrer: string | null
          session_id: string
          source: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          event_name: string
          event_type: string
          id?: string
          metadata?: Json | null
          path?: string | null
          referrer?: string | null
          session_id: string
          source?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          event_name?: string
          event_type?: string
          id?: string
          metadata?: Json | null
          path?: string | null
          referrer?: string | null
          session_id?: string
          source?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      conversations: {
        Row: {
          chat_mode: string
          created_at: string
          id: string
          model: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          chat_mode?: string
          created_at?: string
          id?: string
          model?: string
          title?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          chat_mode?: string
          created_at?: string
          id?: string
          model?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      knowledge_items: {
        Row: {
          content: string
          created_at: string
          enabled: boolean
          id: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          enabled?: boolean
          id?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          enabled?: boolean
          id?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      meetings: {
        Row: {
          audio_path: string | null
          created_at: string
          duration: number
          id: string
          notes: string | null
          summary: string | null
          title: string
          transcript: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          audio_path?: string | null
          created_at?: string
          duration?: number
          id?: string
          notes?: string | null
          summary?: string | null
          title?: string
          transcript?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          audio_path?: string | null
          created_at?: string
          duration?: number
          id?: string
          notes?: string | null
          summary?: string | null
          title?: string
          transcript?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          role: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          role: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          created_at: string
          description: string | null
          id: string
          master_instructions: string | null
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          master_instructions?: string | null
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          master_instructions?: string | null
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      scheduled_tasks: {
        Row: {
          created_at: string
          description: string | null
          enabled: boolean
          id: string
          last_run_at: string | null
          prompt: string | null
          schedule_time: string
          schedule_type: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          enabled?: boolean
          id?: string
          last_run_at?: string | null
          prompt?: string | null
          schedule_time?: string
          schedule_type?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          enabled?: boolean
          id?: string
          last_run_at?: string | null
          prompt?: string | null
          schedule_time?: string
          schedule_type?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_settings: {
        Row: {
          chat_bubble_style: string
          created_at: string
          default_model: string
          font_size: string
          id: string
          language: string
          notif_email: boolean
          notif_messages: boolean
          notif_sound: boolean
          notif_updates: boolean
          notif_vibration: boolean
          theme: string
          updated_at: string
          user_id: string
        }
        Insert: {
          chat_bubble_style?: string
          created_at?: string
          default_model?: string
          font_size?: string
          id?: string
          language?: string
          notif_email?: boolean
          notif_messages?: boolean
          notif_sound?: boolean
          notif_updates?: boolean
          notif_vibration?: boolean
          theme?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          chat_bubble_style?: string
          created_at?: string
          default_model?: string
          font_size?: string
          id?: string
          language?: string
          notif_email?: boolean
          notif_messages?: boolean
          notif_sound?: boolean
          notif_updates?: boolean
          notif_vibration?: boolean
          theme?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_subscriptions: {
        Row: {
          billing_cycle: string
          created_at: string
          current_period_end: string | null
          id: string
          monthly_credits: number
          status: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          tier: string
          updated_at: string
          user_id: string
        }
        Insert: {
          billing_cycle?: string
          created_at?: string
          current_period_end?: string | null
          id?: string
          monthly_credits?: number
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          tier?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          billing_cycle?: string
          created_at?: string
          current_period_end?: string | null
          id?: string
          monthly_credits?: number
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          tier?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_usage: {
        Row: {
          created_at: string
          credits_used: number
          date: string
          id: string
          total_daily_credits: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          credits_used?: number
          date?: string
          id?: string
          total_daily_credits?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          credits_used?: number
          date?: string
          id?: string
          total_daily_credits?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_today_usage: { Args: never; Returns: Json }
      get_user_analytics: { Args: { p_days?: number }; Returns: Json }
      get_user_plan: { Args: never; Returns: Json }
      increment_credits: { Args: { p_cost?: number }; Returns: Json }
      set_user_plan: {
        Args: {
          p_billing_cycle?: string
          p_monthly_credits: number
          p_period_end?: string
          p_status?: string
          p_stripe_customer_id?: string
          p_stripe_subscription_id?: string
          p_tier: string
          p_user_id: string
        }
        Returns: {
          billing_cycle: string
          created_at: string
          current_period_end: string | null
          id: string
          monthly_credits: number
          status: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          tier: string
          updated_at: string
          user_id: string
        }
        SetofOptions: {
          from: "*"
          to: "user_subscriptions"
          isOneToOne: true
          isSetofReturn: false
        }
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
