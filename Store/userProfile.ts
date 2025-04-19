import { create } from "zustand";
import { getUser, updateUser, findUsers } from '@/service/user';

export type UserState = {
  user: any | null;
  users: any | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
};

export type UserActions = {
  fetchUser: () => Promise<void>;
  handleUpdateUser: (payload: any) => Promise<void>;
  handleFindUsers: (params: {
    searchText: string;
    role: string;
  }) => Promise<void>;
};

export type UserStore = UserState & UserActions;

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  users: null,
  status: 'idle',
  error: null,
  fetchUser: async () => {
    set({ status: 'loading', error: null });
    try {
      const response = await getUser();
      set({ user: response.data, status: 'succeeded' });
    } catch (error: any) {
      set({ status: 'failed', error: error.message });
      throw error;
    }
  },
  handleUpdateUser: async (payload: any) => {
    set({ status: 'loading', error: null });
    try {
      const response = await updateUser(payload);
      set({ status: 'succeeded' });
      return response.data; // Assuming you want to return the updated user data
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
