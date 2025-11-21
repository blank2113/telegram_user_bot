import { create } from "zustand";
import type { NotificationPayload } from "../types/notification";

interface NotifyState {
  unread: NotificationPayload[];
  count: number;
  setUnread: (arr: NotificationPayload[]) => void;
  add: (payload: NotificationPayload) => void;
  markRead: (ids: string[]) => void;
  reset: () => void;
}

const useNotifyStore = create<NotifyState>((set) => ({
  unread: [],
  count: 0,
  setUnread: (arr) => set({ unread: arr, count: arr.length }),
  add: (payload) =>
    set((state) => ({
      unread: [payload, ...state.unread],
      count: state.count + 1,
    })),
  markRead: (ids: string[]) =>
    set((state) => ({
      unread: state.unread.filter((n) => !ids.includes(n.id)),
      count: state.unread.filter((n) => !ids.includes(n.id)).length,
    })),
  reset: () => set({ unread: [], count: 0 }),
}));

export default useNotifyStore;
