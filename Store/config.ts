import { create } from "zustand";
import dayjs from 'dayjs';
export type ConfigState = {
};

export type ConfigActions = {
  handleConfigDate: (date: any, format: string) => string;
  getInitials: (name: string) => string
};

export type ConfigStore = ConfigState & ConfigActions;

export const useConfigStore = create<ConfigStore>((set) => ({
  handleConfigDate: (date: any, format: string) => {
    return dayjs(date).format(format);
  },
   getInitials(name: string) {
  return name
    ?.split(' ')               // Split the name by spaces
    ?.map((word: string) => word[0])      // Get the first letter of each word
    ?.join('')                  // Join them together
    ?.toUpperCase();            // Convert to uppercase
}
}));
