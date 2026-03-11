import { create } from "zustand";
import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

const TOKEN_KEY = "ottleszek_token";
const USER_ID_KEY = "ottleszek_user_id";

const isWeb = Platform.OS === "web";

async function getItem(key: string): Promise<string | null> {
  if (isWeb && typeof localStorage !== "undefined") {
    return localStorage.getItem(key);
  }
  return await SecureStore.getItemAsync(key);
}

async function setItem(key: string, value: string): Promise<void> {
  if (isWeb && typeof localStorage !== "undefined") {
    localStorage.setItem(key, value);
    return;
  }
  await SecureStore.setItemAsync(key, value);
}

async function removeItem(key: string): Promise<void> {
  if (isWeb && typeof localStorage !== "undefined") {
    localStorage.removeItem(key);
    return;
  }
  await SecureStore.deleteItemAsync(key);
}

interface AuthState {
  token: string | null;
  userId: string | null;
  setAuth: (token: string, userId: string) => Promise<void>;
  clearAuth: () => Promise<void>;
  hydrate: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  userId: null,

  setAuth: async (token: string, userId: string) => {
    await setItem(TOKEN_KEY, token);
    await setItem(USER_ID_KEY, userId);
    set({ token, userId });
  },

  clearAuth: async () => {
    await removeItem(TOKEN_KEY);
    await removeItem(USER_ID_KEY);
    set({ token: null, userId: null });
  },

  hydrate: async () => {
    try {
      const token = await getItem(TOKEN_KEY);
      const userId = await getItem(USER_ID_KEY);
      set({ token, userId });
    } catch {
      set({ token: null, userId: null });
    }
  },
}));
