import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type StatusState = {
  open: boolean;
  paymentStatus: string;
  paymentStatusOpen: boolean;
  obj: {
    title: string;
    text: string;
  };
  setOpen: (open: boolean) => void;
  setPaymentStatus: (status: string) => void;
  setPaymentStatusOpen: (open: boolean) => void;
  setObj: (obj: { title: string; text: string }) => void;
};

const useStatusPaymentStore = create<StatusState>()(
  persist(
    (set) => ({
      open: false,
      obj: { title: "", text: "" },
      paymentStatus: "",
      paymentStatusOpen: false,
      setOpen: (status: boolean) => set(() => ({ open: status })),
      setPaymentStatus: (status: string) =>
        set(() => ({ paymentStatus: status })),
      setPaymentStatusOpen: (status: boolean) =>
        set(() => ({ paymentStatusOpen: status })),
      setObj: (obj: { title: string; text: string }) =>
        set(() => ({ obj: obj })),
    }),
    {
      name: "status-payment-storage-session",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

export default useStatusPaymentStore;
