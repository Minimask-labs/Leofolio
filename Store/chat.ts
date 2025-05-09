import { create } from "zustand";
import {
  createConversations,
  getMyConversations,
  getSingleConversation,
  sendMessage,
  viewMessages,
} from "@/service/chat";

export type UserState = {
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  loading: boolean;
  chat: any | null;
};

export type UserActions = {
  fetchMychat: () => Promise<any>;
  handleCreateConversations: (body: any) => Promise<any>;
  handleGetSingleConversation: (body: any) => Promise<any>;
  handleSendMessage: (conversationId: string, message: string) => Promise<any>;
  handleViewMessages: (conversationId: string) => Promise<any>;
};

export type UserStore = UserState & UserActions;

export const useChatStore = create<UserStore>((set) => ({
  chat: null,
  status: "idle",
  error: null,
  loading: false,

  // Action to set the singlechatId

  fetchMychat: async () => {
    set({ loading: true, status: "loading", error: null });
    try {
      const response = await getMyConversations();
      set({
        loading: false,
        chat: response.data,
        status: "succeeded",
      });
      return response;
    } catch (error: any) {
      set({ loading: false, status: "failed", error: error.message });
      throw error;
    }
  },
  handleCreateConversations: async (participantId: string) => {
    set({ loading: true, status: "loading", error: null });
    try {
      const response = await createConversations({ participantId });
      set({
        loading: false,
        status: "succeeded",
      });
      // Return the response for further processing
      return response;
    } catch (error: any) {
      set({ loading: false, status: "failed", error: error.message });
      throw error;
    }
  },
  handleGetSingleConversation: async (conversationId: string) => {
    set({ loading: true, status: "loading", error: null });
    try {
      const response = await getSingleConversation({ conversationId });
      set({ loading: false, status: "succeeded" });
      return response;
    } catch (error: any) {
      set({ loading: false, status: "failed", error: error.message });
      throw error;
    }
  },
  handleSendMessage: async (recipientId: string, content: string) => {
    set({ loading: true, status: "loading", error: null });
    try {
      const response = await sendMessage({
        recipientId: recipientId,
        content: content,
      });
      set({ loading: false, status: "succeeded" });
      return response;
    } catch (error: any) {
      set({ loading: false, status: "failed", error: error.message });
      throw error;
    }
  },
  handleViewMessages: async (conversationId: string) => {
    set({ loading: true, status: "loading", error: null });
    try {
      const response = await viewMessages({
        conversationId: conversationId,
      });
      set({ loading: false, status: "succeeded" });
      return response;
    } catch (error: any) {
      set({ loading: false, status: "failed", error: error.message });
      throw error;
    }
  },
}));
