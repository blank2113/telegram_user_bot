/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import useNotifyStore from "../store/notificationStore";

export const useNotifications = (userId: string) => {
  const add = useNotifyStore((s) => s.add);
  const setUnread = useNotifyStore((s) => s.setUnread);

  useEffect(() => {
    if (!userId) return;

    // Подгружаем непрочитанные уведомления при монтировании
    fetch(`http://localhost:3000/api/notifications/unread/${userId}`)
      .then((res) => res.json())
      .then((arr) => setUnread(arr))
      .catch(console.error);

    const evtSource = new EventSource(
      `http://localhost:3000/api/notifications/events?userId=${userId}`
    );

    // создаём объект аудио
    const playBeep = () => {
      const ctx = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "sine";
      o.frequency.value = 440; // частота тона
      o.connect(g);
      g.connect(ctx.destination);
      o.start();
      o.stop(ctx.currentTime + 0.1); // короткий звук 100ms
    };

    evtSource.addEventListener("batch", (e: MessageEvent) => {
      try {
        const data = JSON.parse(e.data);
        data.batch.forEach((notif: any) => {
          add(notif);
          // проигрываем звук
          playBeep();
        });
      } catch (err) {
        console.error("SSE parse error", err);
      }
    });

    evtSource.onerror = (err) => {
      console.error("SSE error", err);
      evtSource.close();
    };

    return () => evtSource.close();
  }, [userId, add, setUnread]);
};
