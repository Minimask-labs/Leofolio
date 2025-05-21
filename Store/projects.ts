import { create } from "zustand";
import {
  myProjects,
  createProject,
  viewProjectInvitations,
  sendProjectInvite,
  viewProjectInvitationsList,
  projectInviteResponse,
  completeMilestone,
  approveMilestone,
  projectDetail,
  myFreelancerProjects,
  completeProject,
  approveProject
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
  completed_projects: DataResponse | null;
  projects_invites: any | null;
  project_details: any | null;
  freelancer_projects: DataResponse | null;
  freelancer_completed_projects: DataResponse | null;
};

export type UserActions = {
  fetchProjects: (params?: any) => void;
  fetchCompletedProjects: (params?: { status: 'completed' }) => void;
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
  handleCompleteMilestone: (
    projectId: string,
    milestoneId: string
  ) => Promise<void>;
  handleApproveMilestone: (
    projectId: string,
    milestoneId: string
  ) => Promise<void>;
  handleViewProjectDetail: (projectId: string) => Promise<void>;
  fetchFreelancerProjects: (params?: any) => Promise<void>;
  fetchFreelancerCompletedProjects: (params?: {status: 'completed'}) => Promise<void>;
  handleCompleteProject: (projectId: string) => Promise<void>;
  handleApproveProject: (projectId: string) => Promise<void>;
  // Add more actions as needed
};

export type UserStore = UserState & UserActions;

export const useProjectStore = create<UserStore>((set) => ({
  projects: null,
  project_details: null,
  projects_invites: null,
  freelancer_projects: null,
  freelancer_completed_projects: null,
  status: 'idle',
  error: null,
  loading: false,
  completed_projects: null,

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
  fetchCompletedProjects: async (params?: { status: 'completed' }) => {
    // export enum ProjectStatusEnum {
    //   PLANNING = "planning",
    //   IN_PROGRESS = "in_progress",
    //   AWAITING_APPROVAL = "awaiting_approval",
    //   COMPLETED = "completed",
    //   ON_HOLD = "on_hold",
    //   CANCELLED = "cancelled",
    // }
    set({ loading: true, status: 'loading', error: null });
    try {
      const response = await myProjects(params);
      set({
        loading: false,
        completed_projects: response.data,
        status: 'succeeded'
      });
    } catch (error: any) {
      set({ loading: false, status: 'failed', error: error.message });
      throw error;
    }
  },
  fetchFreelancerCompletedProjects: async (params?: {
    status: 'completed';
  }) => {
    set({ loading: true, status: 'loading', error: null });
    try {
      const response = await myFreelancerProjects(params);
      set({
        loading: false,
        freelancer_completed_projects: response.data,
        status: 'succeeded'
      });
    } catch (error: any) {
      set({ loading: false, status: 'failed', error: error.message });
      throw error;
    }
  },

  fetchFreelancerProjects: async (params?: any) => {
    set({ loading: true, status: 'loading', error: null });
    try {
      const response = await myFreelancerProjects(params);
      set({
        loading: false,
        freelancer_projects: response.data,
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
      set({
        loading: false,
        projects_invites: response.data,
        status: 'succeeded'
      });
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
  },
  handleViewProjectDetail: async (projectId: string) => {
    set({ loading: true, status: 'loading', error: null });
    try {
      const response = await projectDetail({ projectId });
      set({
        loading: false,
        project_details: response.data,
        status: 'succeeded'
      });
    } catch (error: any) {
      set({ loading: false, status: 'failed', error: error.message });
      throw error;
    }
  },
  handleCompleteProject: async (projectId: string) => {
    set({ loading: true, status: 'loading', error: null });
    try {
      const response = await completeProject({ projectId });
      set({ loading: false, status: 'succeeded' });
      return response;
    } catch (error: any) {
      set({ loading: false, status: 'failed', error: error.message });
      throw error;
    }
  },
  handleApproveProject: async (projectId: string) => {
    set({ loading: true, status: 'loading', error: null });
    try {
      const response = await approveProject({ projectId });
      set({ loading: false, status: 'succeeded' });
      return response;
    } catch (error: any) {
      set({ loading: false, status: 'failed', error: error.message });
      throw error;
    }
  }
}));

 