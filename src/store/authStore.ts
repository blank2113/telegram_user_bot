import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type AuthState = {
  user_id: number | null;
  setUserId: (id: number | null) => void;
  clearUserId: () => void;
};

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user_id: null,
      setUserId: (id: number | null) => set(() => ({ user_id: id })),
      clearUserId: () => set(() => ({ user_id: null })),
    }),
    {
      name: "auth-storage-session",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

export default useAuthStore;
