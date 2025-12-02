import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import useAuthStore from "./authStore";

type ClickStore = {
  // state
  total: number; // общий счётчик кликов (для UI)
  pending: number; // клики, ожидающие отправки
  isSending: boolean;
  lastReset: number;
  limitMarked: boolean;
  maxTotalLimit: number;
  // config
  idleMs: number;
  endpoint: string | null;
  maxRetries: number;
  // actions
  init: (opts: {
    endpoint: string;
    idleMs?: number;
    maxRetries?: number;
  }) => void;
  registerClick: (count?: number) => void;
  flush: () => Promise<void>;
  reset: () => void;
  setMaxTotalLimit: (num: number) => void;
};

const STORAGE_KEY = "app_clicks_v1_meta";
const QUEUE_KEY = "app_clicks_v1_queue";

/* -------------
  Module-level queue & timers (not stored in zustand state)
  - queue persisted separately in localStorage (array of ClickPayload-like items)
  ------------- */

type QueueItem = { id: string; clicks: number; ts: number };
const queue: QueueItem[] = loadQueue();

function loadQueue(): QueueItem[] {
  try {
    const raw = localStorage.getItem(QUEUE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as QueueItem[];
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}
function persistQueue() {
  try {
    localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
  } catch {
    // ignore (private mode etc)
  }
}
function pushToQueue(item: QueueItem) {
  queue.push(item);
  persistQueue();
}
function shiftQueue(count: number) {
  queue.splice(0, count);
  persistQueue();
}
function queueSum() {
  return queue.reduce((s, i) => s + i.clicks, 0);
}

let idleTimer: number | null = null;
let retryTimer: number | null = null;
let sendingLock = false;
let currentRetry = 0;

/* small helpers */
const now = () => Date.now();
const randId = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

function clearIdleTimer() {
  if (idleTimer !== null) {
    clearTimeout(idleTimer);
    idleTimer = null;
  }
}
function clearRetryTimer() {
  if (retryTimer !== null) {
    clearTimeout(retryTimer);
    retryTimer = null;
  }
}
function clearAllTimers() {
  clearIdleTimer();
  clearRetryTimer();
  currentRetry = 0;
}

/**
 * Start idle timer (fires after idleMs of no activity)
 */
function startIdleTimerForState(idleMs: number) {
  clearIdleTimer();
  idleTimer = window.setTimeout(() => {
    idleTimer = null;
    void flushPending(); // fire-and-forget
  }, idleMs);
}

/**
 * flushPending implementation uses module-level queue and zustand state for config
 * It will send batches equal to queued items grouped (we send all items as one payload)
 * and on success remove them.
 */
async function flushPending(): Promise<void> {
  const state = useClickStore.getState();
  const endpoint = state.endpoint;
  const maxRetries = state.maxRetries ?? 3;

  if (!endpoint) return;
  // nothing to send
  if (queue.length === 0) {
    // ensure pending reflect queue
    useClickStore.setState({ pending: 0 });
    return;
  }

  if (sendingLock) return;
  sendingLock = true;
  useClickStore.setState({ isSending: true });

  // prepare payload from queue (all items)
  const payload = {
    events: queue.map((q) => ({ id: q.id, clicks: q.clicks, ts: q.ts })),
  };

  // try send with retries
  const trySend = async (): Promise<boolean> => {
    try {
      const controller = new AbortController();
      const timeout = window.setTimeout(() => controller.abort(), 10_000);
      const res = await fetch(endpoint!, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
      clearTimeout(timeout);
      if (!res.ok) throw new Error(`status=${res.status}`);
      return true;
    } catch (err) {
      console.log(err);

      return false;
    }
  };

  let ok = await trySend();

  while (!ok && currentRetry < maxRetries) {
    const base = Math.pow(2, currentRetry) * 500;
    const jitter = Math.floor(Math.random() * 300);
    const wait = base + jitter;
    currentRetry++;
    await new Promise((r) => {
      retryTimer = window.setTimeout(() => {
        retryTimer = null;
        r(null);
      }, wait);
    });
    ok = await trySend();
  }

  if (ok) {
    // remove all sent items (we sent entire queue)
    shiftQueue(queue.length);
    currentRetry = 0;
    // update pending ui
    useClickStore.setState({ pending: queueSum() });
    // persist meta (optional)
    try {
      const meta = { lastFlushTs: Date.now() };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(meta));
    } catch (e) {
      console.log(e);
    }
  } else {
    // failed after retries, keep queue intact; schedule next attempt after some delay
    currentRetry = 0;
    const nextWait = Math.min(30_000, 2000 + Math.floor(Math.random() * 2000));
    idleTimer = window.setTimeout(() => {
      idleTimer = null;
      void flushPending();
    }, nextWait);
  }

  sendingLock = false;
  useClickStore.setState({ isSending: false });
}

/* -------------------------
  Zustand store with persist(localStorage)
--------------------------*/
const useClickStore = create<ClickStore>()(
  persist(
    (set, get) => ({
      total: 0,
      maxTotalLimit: 1000,
      pending: queueSum(),
      limitMarked: false,
      lastReset: Date.now(),
      isSending: false,
      idleMs: 1000,
      endpoint: null,
      maxRetries: 3,

      init: ({ endpoint, idleMs = 1000, maxRetries = 3 }) => {
        set({ endpoint, idleMs, maxRetries });

        // reflect queue sum into state
        set({ pending: queueSum() });

        // if queue has items, schedule idle flush soon
        if (queue.length > 0) {
          startIdleTimerForState(idleMs);
        }

        // try beacon on pagehide/visibilitychange
        window.addEventListener("visibilitychange", () => {
          if (document.visibilityState === "hidden") {
            // best-effort send via sendBeacon
            const ep = get().endpoint;
            if (!ep || queue.length === 0) return;
            try {
              const snapshot = queue.slice(0, 50); // limit for beacon
              const payload = JSON.stringify({
                events: snapshot.map((q) => ({
                  id: q.id,
                  clicks: q.clicks,
                  ts: q.ts,
                })),
              });
              if (navigator.sendBeacon) {
                navigator.sendBeacon(
                  ep,
                  new Blob([payload], { type: "application/json" })
                );
                // assume best-effort delivered -> remove snapshot
                shiftQueue(snapshot.length);
                set({ pending: queueSum() });
              }
            } catch (e) {
              console.log(e);
            }
          }
        });

        // beforeunload fallback
        window.addEventListener("pagehide", () => {
          const ep = get().endpoint;
          if (!ep || queue.length === 0) return;
          try {
            const snapshot = queue.slice(0, 50);
            const payload = JSON.stringify({
              events: snapshot.map((q) => ({
                id: q.id,
                clicks: q.clicks,
                ts: q.ts,
              })),
            });
            if (navigator.sendBeacon) {
              navigator.sendBeacon(
                ep,
                new Blob([payload], { type: "application/json" })
              );
              shiftQueue(snapshot.length);
              set({ pending: queueSum() });
            }
          } catch (e) {
            console.log(e);
          }
        });
      },
      registerClick(count = 1) {
        if (count <= 0) return;

        const state = get();
        const limit = 1000;
        const remaining = limit - state.total;
        if (remaining <= 0) return; // достигли лимита

        const allowed = Math.min(count, remaining);

        // добавляем в очередь
        const item: QueueItem = { id: randId(), clicks: allowed, ts: now() };
        pushToQueue(item);

        // обновляем UI state: total, pending
        set((s) => {
          const newTotal = s.total + allowed;
          const newPending = s.pending + allowed;

          try {
            localStorage.setItem(
              STORAGE_KEY,
              JSON.stringify({ total: newTotal })
            );
          } catch (e) {
            console.log(e);
          }

          // обновляем баланс пользователя
          const incrementBalance = useAuthStore.getState().incrementBalance;
          incrementBalance(allowed);

          return { total: newTotal, pending: newPending };
        });

        // если достигли лимита и ещё не отмечали на бекенде
        if (get().total >= limit && !get().limitMarked) {
          set({ limitMarked: true }); // ставим флаг, чтобы не отправлять повторно

          (async () => {
            try {
              const user = useAuthStore.getState().user;
              const userId = user?.id;
              if (!userId) {
                set({ limitMarked: false });
                return;
              }

              const res = await fetch(
                `${import.meta.env.VITE_API_URL}/clicks/maxLimit/${userId}`,
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ date: new Date() }),
                }
              );

              if (!res.ok) {
                set({ limitMarked: false }); // сбрасываем флаг, чтобы можно было попытаться снова
                console.warn("mark limit failed", await res.text());
                return;
              }

              const data = await res.json();

              if (data.maxTotalLimit) {
                useAuthStore
                  .getState()
                  .patchUser({ maxTotalLimit: data.maxTotalLimit });
              }
            } catch (err) {
              console.error("Error marking limit:", err);
              set({ limitMarked: false });
            }
          })();
        }

        // restart idle timer
        const idleMs = state.idleMs ?? 1000;
        startIdleTimerForState(idleMs);
      },
      flush: async () => {
        await flushPending();
      },

      reset: () => {
        // clear queue and state
        queue.length = 0;
        persistQueue();
        clearAllTimers();
        set({ total: 0, pending: 0, isSending: false });
        try {
          localStorage.removeItem(STORAGE_KEY);
          localStorage.removeItem(QUEUE_KEY);
        } catch (e) {
          console.log(e);
        }
      },
      setMaxTotalLimit: (num: number) => {
        set({ maxTotalLimit: num });
      },
    }),
    {
      name: "click-store-v1",
      storage: createJSONStorage(() => localStorage),
      // persist only minimal fields (UI state); we keep the queue in QUEUE_KEY separately
      partialize: (state) => ({
        total: state.total,
        pending: state.pending,
        maxTotalLimit: state.maxTotalLimit,
      }),
    }
  )
);

export default useClickStore;
