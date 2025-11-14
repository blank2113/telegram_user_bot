import { create } from "zustand";

type NotifyStore = {
  count: number;
  setCount: (n: number) => void;
  increment: (by?: number) => void;
  reset: () => void;
  unreadIds: number[];
  setUnreadIds: (ids: number[]) => void;
  markRead: (id: number) => void;
};

const useNotifyStore = create<NotifyStore>((set) => ({
  count: 0,
  setCount: (n) => set({ count: n }),
  increment: (by = 1) => set((s) => ({ count: s.count + by })),
  reset: () => set({ count: 0, unreadIds: [] }),
  unreadIds: [],
  setUnreadIds: (ids) => set({ unreadIds: ids, count: ids.length }),
  markRead: (id) =>
    set((s) => {
      const ids = s.unreadIds.filter((x) => x !== id);
      return { unreadIds: ids, count: ids.length };
    }),
}));

export default useNotifyStore;
