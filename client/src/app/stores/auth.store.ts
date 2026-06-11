import { create } from "zustand";
import { getMe } from "@/feat/auth/services/auth.service";
import type { AuthUser } from "@/shared/types/auth";

type SetSessionPayload = {
  user: AuthUser;
  token: string;
  remember: boolean;
};

type AuthStore = {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  hydrateSession: () => Promise<void>;
  setSession: (payload: SetSessionPayload) => void;
  clearSession: () => void;
};

function saveSession(token: string, user: AuthUser, remember: boolean) {
  const authStorage = remember ? localStorage : sessionStorage;
  authStorage.setItem("token", token);
  authStorage.setItem("user", JSON.stringify(user));

  const otherStorage = remember ? sessionStorage : localStorage;
  otherStorage.removeItem("token");
  otherStorage.removeItem("user");
}

function readStoredToken() {
  return localStorage.getItem("token") || sessionStorage.getItem("token");
}

function clearAllSessionStorage() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("user");
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  token: null,
  isLoading: true,
  isAuthenticated: false,

  setSession: ({ user, token, remember }) => {
    saveSession(token, user, remember);

    set({
      user,
      token,
      isLoading: false,
      isAuthenticated: true,
    });
  },

  clearSession: () => {
    clearAllSessionStorage();

    set({
      user: null,
      token: null,
      isLoading: false,
      isAuthenticated: false,
    });
  },

  hydrateSession: async () => {
    const storedToken = readStoredToken();

    if (!storedToken) {
      set({
        user: null,
        token: null,
        isLoading: false,
        isAuthenticated: false,
      });
      return;
    }

    // Set token immediately so interceptor can use it
    set({ token: storedToken });

    try {
      const user = await getMe();

      set({
        user,
        isLoading: false,
        isAuthenticated: true,
      });
    } catch {
      get().clearSession();
    }
  },
}));