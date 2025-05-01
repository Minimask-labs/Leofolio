import { create } from "zustand";
import {
  myProjects,
  createProject,
  viewProjectInvitations,
  sendProjectInvite,
  viewProjectInvitationsList,
  projectInviteResponse,
  completeMilestone,
  approveMilestone
} from '@/service/projects';

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
  projects_invites: any | null;
};

export type UserActions = {
  fetchProjects: (params?: any) => void;
  handleCreateProject: (body: any) => Promise<void>;
  handleViewProjectInvitations: (params?: any) => Promise<void>;
  handleProjectInviteResponse: (
    invitationId: string,
    response: string
  ) => Promise<void>;
  handleSendProjectInvite: (
    projectId: string,
    freelancerId: string,
    message: string
  ) => Promise<void>;
  handleViewProjectInvitationsList: (params?: any) => Promise<void>;
  handleCompleteMilestone: (projectId: string, milestoneId: string) => Promise<void>;
  handleApproveMilestone: (projectId: string, milestoneId: string) => Promise<void>;
  // Add more actions as needed
};

export type UserStore = UserState & UserActions;

export const useProjectStore = create<UserStore>((set) => ({
  projects: null,
  projects_invites: null,
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
      return response;
    } catch (error: any) {
      set({ loading: false, status: 'failed', error: error.message });
      throw error;
    }
  },
  // freelancer project invite

  handleViewProjectInvitations: async (params?: any) => {
    set({ loading: true, status: 'loading', error: null });
    try {
      const response = await viewProjectInvitations(params);
      set({ loading: false, status: 'succeeded' });
      return response;
    } catch (error: any) {
      set({ loading: false, status: 'failed', error: error.message });
      throw error;
    }
  },
  handleProjectInviteResponse: async (
    invitationId: string,
    response: string
  ) => {
    set({ loading: true, status: 'loading', error: null });
    try {
      const res = await projectInviteResponse({
        invitationId: invitationId,
        response: response
      });
      set({ loading: false, status: 'succeeded' });
      return res;
    } catch (error: any) {
      set({ loading: false, status: 'failed', error: error.message });
      throw error;
    }
  },
  // employer project invite
  handleSendProjectInvite: async (
    projectId: string,
    freelancerId: string,
    message: string
  ) => {
    set({ loading: true, status: 'loading', error: null });
    try {
      const response = await sendProjectInvite({
        projectId: projectId,
        freelancerId: freelancerId,
        message: message
      });
      set({ loading: false, status: 'succeeded' });
      return response;
    } catch (error: any) {
      set({ loading: false, status: 'failed', error: error.message });
      throw error;
    }
  },
  handleViewProjectInvitationsList: async (params?: any) => {
    set({ loading: true, status: 'loading', error: null });
    try {
      const response = await viewProjectInvitationsList(params);
      set({ loading: false, projects_invites: response.data, status: 'succeeded' });
     } catch (error: any) {
      set({ loading: false, status: 'failed', error: error.message });
      throw error;
    }
  },
  handleCompleteMilestone: async (projectId: string, milestoneId: string) => {
    set({ loading: true, status: 'loading', error: null });
    try {
      const response = await completeMilestone({
        projectId: projectId,
        milestoneId: milestoneId
      });
      set({ loading: false, status: 'succeeded' });
      return response;
    } catch (error: any) {
      set({ loading: false, status: 'failed', error: error.message });
      throw error;
    }
  },
  handleApproveMilestone: async (projectId: string, milestoneId: string) => {
    set({ loading: true, status: 'loading', error: null });
    try {
      const response = await approveMilestone({
        projectId: projectId,
        milestoneId: milestoneId
      });
      set({ loading: false, status: 'succeeded' });
      return response;
    } catch (error: any) {
      set({ loading: false, status: 'failed', error: error.message });
      throw error;
    }
  }
}));

 