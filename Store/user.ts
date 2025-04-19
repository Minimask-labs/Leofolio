import { create } from 'zustand';
import Cookies from 'js-cookie';
import { decrypt, encrypt } from '@/service/encryption';

interface UserState {
  userData: any | null;
  preSaveUserData: any | null;
  token: string | null;
  userType: string | null;
  saveUserToken: (token: string) => void;
  saveUserData: (data: any) => void;
  rememberUserDetails: (details: any) => void;
  removeRememberUserDetails: () => void;
  removeUserData: () => void;
  loadUserData: () => void;
  saveUserType: (data: any) => void;
  currencySign: string;
}
const currentDate = new Date();
const newDate = new Date(currentDate);
newDate.setHours(currentDate.getHours() + 24);

// Function to save data in cookies
const saveToCookies = (key: string, data: any): void => {
  Cookies.set(key, encrypt(JSON.stringify(data)), {
    httpOnly: false,
    expires: newDate,
    path: '/',
    secure: true,
    sameSite: 'strict'
  }); // cookie expires in 7 days
};
const saveToCookiesWithoutEncryption = (key: string, data: any): void => {
  Cookies.set(key, data, {
    httpOnly: false,
    expires: newDate,
    path: '/',
    secure: true,
    sameSite: 'strict'
  }); // cookie expires in 7 days
};

// Function to get data from cookies
const getFromCookies = (key: string): any | null => {
  const cookieData = decrypt(Cookies.get(key));
  if (cookieData) {
    if (typeof cookieData == 'string') {
      try {
        return JSON.parse(cookieData);
        // console.log('valid JSON string:', key, cookieData);
      } catch (error) {
        // console.error('Invalid JSON string:', cookieData);
        return cookieData;
      }
    } else {
      // console.log(key, cookieData);
      return cookieData;
      // Return the object or null if empty}
    }
  }
  return null;
};

// Function to remove data from cookies
const removeFromCookies = (key: string): void => {
  Cookies.remove(key);
};

// Zustand store using cookies
export const useStore = create<UserState>((set) => ({
  // Sample state data
  userData: getFromCookies('userData') || null,
  preSaveUserData: getFromCookies('rememberMe') || null,
  token: getFromCookies('token') || null,
  userType: Cookies.get('userType') || null,
  currencySign:'₦',

  // Action to save data to cookies and update Zustand state
  saveUserData: (data: any) => {
    saveToCookies('userData', data);
    set({ userData: data });
  },
  // Action to save token to cookies and update Zustand state
  saveUserToken: (data: any) => {
    saveToCookies('token', data);
    set({ token: data });
  },

  saveUserType: (data: any) => {
    saveToCookiesWithoutEncryption('userType', data);
    set({ token: data });
  },

  // Action to save token to cookies and update Zustand state
  rememberUserDetails: (data: any) => {
    saveToCookies('rememberMe', data);
    set({ preSaveUserData: data });
  },

  // Action to remove data from cookies and reset Zustand state
  removeRememberUserDetails: () => {
    removeFromCookies('rememberMe');
    set({ preSaveUserData: null });
  },
  removeUserData: () => {
    removeFromCookies('userData');
    set({ userData: null });
  },

  // Action to load data from cookies (optional, for initial loading if needed)
  loadUserData: () => {
    const data = getFromCookies('userData');
    set({ userData: data });
  }
}));
