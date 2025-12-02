import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type StatusState = {
  open: boolean;
  openBalance: boolean;
  paymentStatus: string;
  paymentStatusOpen: boolean;
  obj: {
    title: string;
    text: string;
    sum: number;
  };
  setOpen: (open: boolean) => void;
  setOpenBalance: (open: boolean) => void;
  setPaymentStatus: (status: string) => void;
  setPaymentStatusOpen: (open: boolean) => void;
  setObj: (obj: { title: string; text: string; sum: number }) => void;
};

const useStatusPaymentStore = create<StatusState>()(
  persist(
    (set) => ({
      open: false,
      openBalance: false,
      obj: { title: "", text: "", sum: 0 },
      paymentStatus: "",
      paymentStatusOpen: false,
      setOpen: (status: boolean) => set(() => ({ open: status })),
      setOpenBalance: (status: boolean) => set(() => ({ openBalance: status })),
      setPaymentStatus: (status: string) =>
        set(() => ({ paymentStatus: status })),
      setPaymentStatusOpen: (status: boolean) =>
        set(() => ({ paymentStatusOpen: status })),
      setObj: (obj: { title: string; text: string; sum: number }) =>
        set(() => ({ obj: obj })),
    }),
    {
      name: "status-payment-storage-session",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

export default useStatusPaymentStore;
