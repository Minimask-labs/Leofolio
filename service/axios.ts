import axios from 'axios';
import Cookies from 'js-cookie';
import { decrypt } from '@/service/encryption';
// import { useRouter } from 'next/router';
// const router = useRouter();
import Router from 'next/router'; // Use Router instead of useRouter


// Retrieve baseURL from environment variable
const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: baseURL
  // Replace with your actual base URL
});

// Optional: Add an interceptor to include authorization token in requests
axiosInstance.interceptors.request.use((config) => {
    const user = decrypt(Cookies.get("token"));
    if (user) {
        config.headers.Authorization = `Bearer ${user}`;
    }
    return config;
});

// Interceptor for handling errors globally
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        const status  = error?.response?.status;
        // console.log(status);
        // console.log(error);

       if (typeof window !== 'undefined') {

         if ( status === 500) {
           // Unauthenticated user or server error, redirect to the product page
            Cookies.remove('token');
            Cookies.remove('userData');
            Cookies.remove('userType');
            Router.push('/auth');
          }else if (status === 401 ) {
           // Unauthenticated user or server error, redirect to the product page
           Cookies.remove('token');
           Cookies.remove('userData');
           Cookies.remove('userType');
           Router.push('/auth');
         } else {
           // Handle other errors if needed
           console.error('An error occurred:', error?.message);
         }
       }
       return Promise.reject(error);
    }
);

export default axiosInstance;
