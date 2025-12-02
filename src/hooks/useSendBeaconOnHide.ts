import { useEffect } from "react";

type BeaconParams = {
  getPayload: () => object | null;
  endpoint?: string | null;
  onSuccess?: () => void;
};

/**
 * Позволяет отправить pending-данные через navigator.sendBeacon при скрытии страницы или beforeunload.
 */
export const useSendBeaconOnHide = ({
  getPayload,
  endpoint,
  onSuccess,
}: BeaconParams) => {
  useEffect(() => {
    const trySend = () => {
      try {
        const payload = getPayload();
        if (!payload || !endpoint) return;
        const body = JSON.stringify(payload);
        const ok = navigator.sendBeacon(
          endpoint,
          new Blob([body], { type: "application/json" })
        );
        if (ok && onSuccess) onSuccess();
      } catch (e) {
        // silent
        console.log(e);
      }
    };

    const onVisibility = () => {
      if (document.visibilityState === "hidden") trySend();
    };
    const onBeforeUnload = () => trySend();

    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("beforeunload", onBeforeUnload);

    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("beforeunload", onBeforeUnload);
    };
  }, [getPayload, endpoint, onSuccess]);
};
