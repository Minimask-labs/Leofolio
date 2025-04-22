import { create } from "zustand";
import { getUser, updateUser, findUsers, uploadMedia } from '@/service/user';
import { Payload } from "recharts/types/component/DefaultLegendContent";

export type UserState = {
  media: any | null;
  user: any | null;
  users: any | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  loading: boolean;
};

export type UserActions = {
  fetchUser: () => Promise<void>;
  handleUpdateUser: (payload: any) => Promise<void>;
  handleUploadMedia: (Payload: any) => Promise<void>;
  handleFindUsers: (params?: {
    searchText?: string;
    role?: string;
  }) => Promise<void>;
};

export type UserStore = UserState & UserActions;

export const useUserProfileStore = create<UserStore>((set) => ({
  user: null,
  users: null,
  status: 'idle',
  loading: false,
  error: null,
  media: null,
  fetchUser: async () => {
    set({loading: true, status: 'loading', error: null });
    try {
      const response = await getUser();
      set({loading: false, user: response.data, status: 'succeeded' });
 
    } catch (error: any) {
      set({ loading: false, status: 'failed', error: error.message });
      throw error;
    }
  },
  handleUpdateUser: async (payload: any) => {
    set({ status: 'loading', error: null });
    try {
      const response = await updateUser(payload);
      set({ status: 'succeeded' });
      return response; // Assuming you want to return the updated user data
    } catch (error: any) {
      set({ status: 'failed', error: error.message });
      throw error;
    }
  },
  handleUploadMedia: async (payload: any) => {
    set({ status: 'loading', error: null });
    try {
      const response = await uploadMedia(payload);
      console.log(response?.data);
      set({ status: response.data.success ? 'succeeded' : 'failed', media: response?.data });
     } catch (error: any) {
      set({ status: 'failed', error: error.message });
      throw error;
    }
  },

  handleFindUsers: async (params: { searchText: string; role: string }) => {
    set({ status: 'loading', error: null });
    try {
      const response = await findUsers(params);
      set({ users: response.data, status: 'succeeded' });
    } catch (error: any) {
      set({ status: 'failed', error: error.message });
      throw error;
    }
  }
}));
