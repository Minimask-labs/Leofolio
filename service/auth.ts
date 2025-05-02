 import AxiosService from "./axios";
import Cookies from "js-cookie";
 export const walletAuth = async (body: any) => {
  try {
    const response = await AxiosService.post('auth/wallet/login', body);
    return response.data; // Assuming you want to return the updated user data
  } catch (error) {
    throw error;
  }
};
export const getWalletSigner = async (walletAddress: string) => {
  try {
    const response = await AxiosService.get(
      `auth/wallet/${walletAddress}/nonce`
    );
    return response.data; // Assuming you want to return the updated user data
  } catch (error) {
    throw error;
  }
};
export const verify = async (payload:{
    email: string,
    type: string,
    code: string
}) => {
  try {
    const response = await AxiosService.post(`auth/verify-email`, payload);
    return response.data; // Assuming you want to return the updated user data
  } catch (error) {
    throw error;
  }
};
export const requestOtp = async (payload: {
  email: string;
  type: string;
}) => {
  try {
    const response = await AxiosService.post(`otp/request`, payload);
    return response.data; // Assuming you want to return the updated user data
  } catch (error) {
    throw error;
  }
};
export const validateOtp = async (payload: {
  email: string;
  type: string;
  code: string;
}) => {
  try {
    const response = await AxiosService.post(`otp/validate`, payload);
    return response.data; // Assuming you want to return the updated user data
  } catch (error) {
    throw error;
  }
};
  export const logout = () => {
  Cookies.remove('token');
  Cookies.remove('userData');
  Cookies.remove('userType');
};

