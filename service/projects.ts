 import AxiosService from './axios';


//  ****************** projects *******************
export const myProjects = async (params:any) => {
  try {
    const response = await AxiosService.get('project/employer', {
      params: params
    });
    return response?.data; // Assuming you want to return the updated user data
  } catch (error) {
    throw error;
  }
};
 export const myFreelancerProjects = async (params:any) => {
  try {
    const response = await AxiosService.get('project/freelancer', {
      params: params
    });
    return response?.data; // Assuming you want to return the updated user data
  } catch (error) {
    throw error;
  }
};
export const createProject = async (payload: any ) => {
  try {
    const response = await AxiosService.post(`project/employer`, payload);
    return response.data; // Assuming you want to return the updated user data
  } catch (error) {
    throw error;
  }
};
// employer project invite
 export const viewProjectInvitations = async (params: { projectId: string }) => {
  try {
    const response = await AxiosService.get('invitation/employer/project', {
      params: params
    });
    return response?.data; // Assuming you want to return the updated user data
  } catch (error) {
    throw error;
  }
};

export const sendProjectInvite = async (payload: {
  projectId: string;
  freelancerId: string;
  message:string;
}) => {
  try {
    const response = await AxiosService.post(`invitation/project`, payload);
    return response.data; // Assuming you want to return the updated user data
  } catch (error) {
    throw error;
  }
};


// freelancer project invite
 export const viewProjectInvitationsList = async (params?: any) => {
  try {
    const response = await AxiosService.get('invitation/freelancer/project', {
      params: params
    });
    return response?.data; // Assuming you want to return the updated user data
  } catch (error) {
    throw error;
  }
};
   export const projectInviteResponse = async (payload: {
    invitationId: string;
    response: string; // accept | reject
  }) => {
    try {
      const response = await AxiosService.post(
        `invitation/project/respond`,
        payload
      );
      return response.data; // Assuming you want to return the updated user data
    } catch (error) {
      throw error;
    }
  };

  // milestone
   export const completeMilestone = async (payload: {
    projectId: string;
    milestoneId: string;
  }) => {
    try {
      const response = await AxiosService.post(
        `project/milestones/complete`,
        payload
      );
      return response.data; // Assuming you want to return the updated user data
    } catch (error) {
      throw error;
    } 
  };
   export const approveMilestone = async (payload: {
    projectId: string;
    milestoneId: string;
  }) => {
    try {
      const response = await AxiosService.post(
        `project/milestones/approve`,
        payload
      );
      return response.data; // Assuming you want to return the updated user data
    } catch (error) {
      throw error;
    } 
  };
  // http://localhost:4005/api/v1/project/detail?projectId=6812816d336faaed3397f30a
  export const projectDetail = async (params: { projectId: string }) => {
    try {
      const response = await AxiosService.get('project/detail', {
        params: params
      });
      return response?.data; // Assuming you want to return the updated user data
    } catch (error) {
      throw error;
    }
  };