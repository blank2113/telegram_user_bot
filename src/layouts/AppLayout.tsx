import { Outlet } from "react-router-dom";
import useStatusPaymentStore from "../store/statusPayment";
import useNotifyStore from "../store/notificationStore";
import { useEffect, useRef } from "react";
import { socket } from "../utils/socket";

const AppLayout = () => {
  const { setPaymentStatus } = useStatusPaymentStore((s) => s);
  const { count, increment } = useNotifyStore((s) => s);
  const muteRef = useRef<boolean>(false);
  const prevCountRef = useRef<number>(0);

  const playBeep = () => {
    if (muteRef.current) return;
    try {
      const AudioContextClass =
        window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const duration = 0.12;
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "sine";
      o.frequency.value = 880;
      g.gain.value = 0.0001;
      o.connect(g);
      g.connect(ctx.destination);

      const now = ctx.currentTime;
      g.gain.setValueAtTime(0.0001, now);
      g.gain.exponentialRampToValueAtTime(0.12, now + 0.01);
      g.gain.exponentialRampToValueAtTime(0.001, now + duration);

      o.start(now);
      o.stop(now + duration + 0.02);

      setTimeout(() => {
        try {
          ctx.close();
        } catch {}
      }, (duration + 0.1) * 1000);
    } catch {}
  };

  useEffect(() => {
    const anyHandler = (event: string, ...args: any[]) => {
      const payload = args[0];

      if (event === "withdraw_update") {
        const status = payload?.status;
        if (status === "APPROVED") setPaymentStatus("success");
        else if (status === "REJECTED") setPaymentStatus("404");
        else setPaymentStatus("");
        // mark as new notification
        increment(1);
        return;
      }

      if (event === "new_notification" || event === "message") {
        increment(1);
      }
    };

    socket.onAny(anyHandler);
    return () => {
      socket.offAny(anyHandler);
    };
  }, [increment, setPaymentStatus]);

  useEffect(() => {
    const prev = prevCountRef.current;
    if (count > prev) playBeep();
    prevCountRef.current = count;
  }, [count]);

  return <Outlet />;
};

export default AppLayout;
