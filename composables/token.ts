import {useLocalStorage} from "@vueuse/core";

export const useAuthToken = () => useLocalStorage<string|null>('token', () => null);