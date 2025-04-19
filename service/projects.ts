 import AxiosService from './axios';


//  ****************** Employee *******************
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
export const createProject = async (payload: any ) => {
  try {
    const response = await AxiosService.post(`project/employer`, payload);
    return response.data; // Assuming you want to return the updated user data
  } catch (error) {
    throw error;
  }
};

