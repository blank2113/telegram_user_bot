import { useEffect, useRef } from "react";
import { scheduleResetFor } from "../utils/scheduleResetFor";

export const useScheduleResetForUser = (
  userId?: string | undefined,
  maxTotalLimit?: string | null
) => {
  const cleanupRef = useRef<() => void>(() => {});

  useEffect(() => {
    // очищаем предыдущее
    cleanupRef.current?.();
    if (userId) {
      cleanupRef.current = scheduleResetFor(Number(userId), maxTotalLimit);
    }
    return () => {
      cleanupRef.current?.();
    };
  }, [userId, maxTotalLimit]);
};
