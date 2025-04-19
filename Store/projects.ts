import { create } from "zustand";
import { myProjects, createProject } from '@/service/projects';

export interface Medias {
  name: string;
  url: string;
  _id: string;
}
export interface Milestones {
  title: string;
  description: string;
  deadline: string;
  status: string;
  _id: string;
}
export interface Project {
  _id: string;
  user: string;
  name: string;
  description: string;
  medias: Medias[];
  deadline: string;
  status: number;
  milestones: Milestones[];
  price: number;
  progress: number;
  isDeleted: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface MetaData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface DataResponse {
  data: Project[];
  meta: MetaData;
  message: string;
  success: boolean;
  timestamp: string;
}

   
export type UserState = {
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  loading: boolean;
  projects: DataResponse | null;
 };

export type UserActions = {
  fetchProjects: (params?: any) => void;
  handleCreateProject: (body: any) => Promise<void>;
};

export type UserStore = UserState & UserActions;

export const useProjectStore = create<UserStore>((set) => ({
  projects: null,
  status: 'idle',
  error: null,
  loading: false,

  // Action to set the singleProjectId

  fetchProjects: async (params?: any) => {
    set({ loading: true, status: 'loading', error: null });
    try {
      const response = await myProjects(params);
      set({
        loading: false,
        projects: response.data,
        status: 'succeeded'
      });
      // console.log("fetchProjects", response.data);
    } catch (error: any) {
      set({ loading: false, status: 'failed', error: error.message });
      throw error;
    }
  },
  handleCreateProject: async (body: any) => {
    set({ loading: true, status: 'loading', error: null });
    try {
      const response = await createProject(body);
      set({ loading: false, status: 'succeeded' });
      // console.log("handleCreateProject", response);
      return response;
    } catch (error: any) {
      set({ loading: false, status: 'failed', error: error.message });
      throw error;
    }
  }
}));

 