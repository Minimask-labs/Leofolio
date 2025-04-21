import AxiosService from './axios';
export const getUser = async () => {
  try {
    const response = await AxiosService.get(
      'user/me'
    );
    return response.data; // Assuming you want to return the updated user data
  } catch (error) {
    throw error;
  }
};
export const updateUser = async (payload:any) => {
  try {
    const response = await AxiosService.patch('user/me',payload);
    return response.data; // Assuming you want to return the updated user data
  } catch (error) {
    throw error;
  }
};
export const uploadMedia = async ( payload: any ) => {
  try {
    const response = await AxiosService.post('media/upload', payload);
    return response.data; // Assuming you want to return the updated user data
  } catch (error) {
    throw error;
  }
};
 export const findUsers = async (params: { searchText: string; role: string }) => {
   try {
     const response = await AxiosService.get(`user/search`, {
       params: params
     });
     return response.data; // Assuming you want to return the updated user data
   } catch (error) {
     throw error;
   }
 };
