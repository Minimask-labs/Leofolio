 import AxiosService from './axios';


//  ****************** conversations *******************
 export const createConversations = async (payload: {
  participantId: string;
}) => {
  try {
    const response = await AxiosService.post('conversation', payload);
    return response?.data; // Assuming you want to return the updated user data
  } catch (error) {
    throw error;
  }
};

 export const getMyConversations = async () => {
  try {
    const response = await AxiosService.get('conversation');
    return response?.data; // Assuming you want to return the updated user data
  } catch (error) {
    throw error;
  }
};
 export const getSingleConversation = async (params: {
  conversationId: string;
}) => {
  try {
    const response = await AxiosService.get('conversation/single', {
      params: params,
    });
    return response?.data; // Assuming you want to return the updated user data
  } catch (error) {
    throw error;
  }
};
  export const sendMessage = async (payload: {
   recipientId: string;
   content: string;
 }) => {
   try {
     const response = await AxiosService.post(
       'conversation/message/send',
       payload
     );
     return response?.data; // Assuming you want to return the updated user data
   } catch (error) {
     throw error;
   }
 };
    export const viewMessages = async (params: {
    conversationId: string;
    }) => {
    try {
        const response = await AxiosService.get('conversation/message/list', {
        params: params,
        });
        return response?.data; // Assuming you want to return the updated user data
    } catch (error) {
        throw error;
    }
    };