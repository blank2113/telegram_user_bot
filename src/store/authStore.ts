import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type User = {
  id?: number;
  telegram_id?: number;
  name?: string;
  balance?: number;
  status?: string | null;
  level?: number;
  img?: string | null;
  statusMaxEnergy?: number;
};

type AuthState = {
  user_id: number | null;
  user: User | null;
  isLogged: () => boolean;
  setUserId: (id: number | null) => void;
  setUser: (user: User | null) => void;
  patchUser: (patch: Partial<User>) => void;
  clearUserId: () => void;
  clearAll: () => void;
  incrementBalance: (delta: number) => void;
  setBalance: (value: number) => void;
  setStatus: (status: string | null) => void;
  setLevel: (level: number) => void;
};

const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // initial state
      user_id: null,
      user: null,

      // derived / helpers
      isLogged: () => Boolean(get().user_id && get().user),

      setUserId: (id: number | null) => {
        set((state) => {
          if (state.user_id === id) return state;
          return { ...state, user_id: id };
        });
      },

      setUser: (user: User | null) => {
        set((state) => {
          const same =
            state.user === user ||
            (state.user &&
              user &&
              state.user.id === user.id &&
              JSON.stringify(state.user) === JSON.stringify(user));
          if (same) return state;
          return { ...state, user };
        });
      },

      patchUser: (patch: Partial<User>) => {
        set((state) => {
          const prev = state.user ?? {};

          const keys = Object.keys(patch);
          if (keys.length === 0) return state;
          let changed = false;
          const next: User = { ...prev } as User;
          for (const k of keys as (keyof User)[]) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const v = (patch as any)[k];
            if (next[k] !== v) {
              next[k] = v;
              changed = true;
            }
          }
          if (!changed) return state;
          return { ...state, user: next };
        });
      },

      clearUserId: () => {
        set((state) => {
          if (state.user_id === null) return state;
          return { ...state, user_id: null };
        });
      },

      clearAll: () => {
        set(() => ({ user_id: null, user: null }));
      },

      incrementBalance: (delta: number) => {
        if (!delta) return;
        set((state) => {
          const prevUser = state.user ?? {};
          const prevBalance = Number(prevUser.balance ?? 0);
          const nextBalance = prevBalance + delta;
          // if unchanged (delta 0) -> noop
          if (nextBalance === prevBalance) return state;
          const nextUser = { ...prevUser, balance: nextBalance };
          return { ...state, user: nextUser };
        });
      },

      setBalance: (value: number) => {
        set((state) => {
          const prevUser = state.user ?? {};
          if (Number(prevUser.balance ?? 0) === value) return state;
          return { ...state, user: { ...prevUser, balance: value } };
        });
      },

      setStatus: (status: string | null) => {
        set((state) => {
          const prevUser = state.user ?? {};
          if (prevUser.status === status) return state;
          return { ...state, user: { ...prevUser, status } };
        });
      },

      setLevel: (level: number) => {
        set((state) => {
          const prevUser = state.user ?? {};
          if (prevUser.level === level) return state;
          return { ...state, user: { ...prevUser, level } };
        });
      },
    }),
    {
      name: "auth-storage-session",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({ user_id: state.user_id, user: state.user }),
    }
  )
);

export default useAuthStore;
