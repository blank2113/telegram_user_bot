import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type StatusState = {
  chosenNumber: number | null;
  bet: number;
  setChosenNumber: (val: number) => void;
  setBet: (val: number) => void;
};

const useWheelStore = create<StatusState>()(
  persist(
    (set) => ({
      chosenNumber: null,
      bet: 5000,
      setChosenNumber: (val: number) => set(() => ({ chosenNumber: val })),
      setBet: (val: number) => set(() => ({ bet: val })),
    }),
    {
      name: "wheel-storage-session",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

export default useWheelStore;
