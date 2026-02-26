import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Message, Model, Conversation } from "@cleus/shared";

interface ChatState {
  conversations: Conversation[];
  activeConversationId: string | null;
  selectedModel: Model;
  isGenerating: boolean;
  streamingContent: string;

  // Actions
  createConversation: (title?: string) => string;
  deleteConversation: (id: string) => void;
  setActiveConversation: (id: string) => void;
  addMessage: (conversationId: string, message: Message) => void;
  setSelectedModel: (model: Model) => void;
  setIsGenerating: (v: boolean) => void;
  appendStreamChunk: (chunk: string) => void;
  clearStream: () => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      conversations: [],
      activeConversationId: null,
      selectedModel: "cleus-uncensored",
      isGenerating: false,
      streamingContent: "",

      createConversation: (title) => {
        const id = crypto.randomUUID();
        const conversation: Conversation = {
          id,
          title: title ?? "New Chat",
          messages: [],
          model: get().selectedModel,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((s) => ({
          conversations: [conversation, ...s.conversations],
          activeConversationId: id,
        }));
        return id;
      },

      deleteConversation: (id) =>
        set((s) => ({
          conversations: s.conversations.filter((c) => c.id !== id),
          activeConversationId:
            s.activeConversationId === id ? null : s.activeConversationId,
        })),

      setActiveConversation: (id) => set({ activeConversationId: id }),

      addMessage: (conversationId, message) =>
        set((s) => ({
          conversations: s.conversations.map((c) =>
            c.id === conversationId
              ? {
                  ...c,
                  messages: [...c.messages, message],
                  updatedAt: new Date().toISOString(),
                }
              : c
          ),
        })),

      setSelectedModel: (model) => set({ selectedModel: model }),
      setIsGenerating: (v) => set({ isGenerating: v }),
      appendStreamChunk: (chunk) =>
        set((s) => ({ streamingContent: s.streamingContent + chunk })),
      clearStream: () => set({ streamingContent: "" }),
    }),
    { name: "cleus-chat-store", partialize: (s) => ({ conversations: s.conversations }) }
  )
);
