import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface DBMessage {
  id: string;
  conversation_id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
}

export interface DBConversation {
  id: string;
  user_id: string;
  title: string;
  model: string;
  chat_mode: string;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  text: string;
  isUser: boolean;
  files?: File[];
  steps?: any[];
  isStreaming?: boolean;
}

export const useConversations = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<DBConversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);

  // Load conversations list
  const loadConversations = useCallback(async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("conversations")
      .select("*")
      .order("updated_at", { ascending: false })
      .limit(50);
    if (!error && data) {
      setConversations(data as DBConversation[]);
    }
  }, [user]);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  // Load messages for a conversation
  const loadMessages = useCallback(async (conversationId: string) => {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });
    if (!error && data) {
      const msgs: ChatMessage[] = (data as DBMessage[]).map(m => ({
        text: m.content,
        isUser: m.role === "user",
      }));
      setMessages(msgs);
    }
    setCurrentConversationId(conversationId);
  }, []);

  // Create a new conversation
  const createConversation = useCallback(async (model: string, chatMode: string, firstMessage: string): Promise<string | null> => {
    if (!user) return null;
    const title = firstMessage.slice(0, 60) || "محادثة جديدة";
    const { data, error } = await supabase
      .from("conversations")
      .insert({ user_id: user.id, title, model, chat_mode: chatMode })
      .select()
      .single();
    if (error || !data) {
      console.error("Error creating conversation:", error);
      return null;
    }
    const conv = data as DBConversation;
    setCurrentConversationId(conv.id);
    setConversations(prev => [conv, ...prev]);
    return conv.id;
  }, [user]);

  // Save a message to the DB
  const saveMessage = useCallback(async (conversationId: string, role: "user" | "assistant", content: string) => {
    if (!content.trim()) return;
    await supabase.from("messages").insert({
      conversation_id: conversationId,
      role,
      content,
    });
  }, []);

  // Start new chat (clear current)
  const startNewChat = useCallback(() => {
    setCurrentConversationId(null);
    setMessages([]);
  }, []);

  // Delete a conversation
  const deleteConversation = useCallback(async (conversationId: string) => {
    await supabase.from("conversations").delete().eq("id", conversationId);
    setConversations(prev => prev.filter(c => c.id !== conversationId));
    if (currentConversationId === conversationId) {
      startNewChat();
    }
  }, [currentConversationId, startNewChat]);

  // Clear all conversations
  const clearAllConversations = useCallback(async () => {
    if (!user) return;
    // Delete all user conversations (cascade deletes messages)
    const ids = conversations.map(c => c.id);
    if (ids.length > 0) {
      for (const id of ids) {
        await supabase.from("conversations").delete().eq("id", id);
      }
    }
    setConversations([]);
    startNewChat();
  }, [user, conversations, startNewChat]);

  // Update conversation title
  const updateTitle = useCallback(async (conversationId: string, title: string) => {
    await supabase.from("conversations").update({ title }).eq("id", conversationId);
    setConversations(prev => prev.map(c => c.id === conversationId ? { ...c, title } : c));
  }, []);

  return {
    conversations,
    currentConversationId,
    messages,
    setMessages,
    loading,
    loadConversations,
    loadMessages,
    createConversation,
    saveMessage,
    startNewChat,
    deleteConversation,
    clearAllConversations,
    updateTitle,
  };
};
