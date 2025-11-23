import useClickStore from "../store/clickStore";

export function scheduleResetFor(
  userId: number | undefined,
  lastResetAtIso?: string | null
) {
  if (!userId || !lastResetAtIso) return () => {};

  const last = new Date(lastResetAtIso).getTime();
  if (Number.isNaN(last)) return () => {};

  const HOURS = 12;
  const msLimit = HOURS * 60 * 60 * 1000;
  const now = Date.now();
  const msSince = now - last;

  if (msSince >= msLimit) {
    useClickStore.getState().reset();
    return () => {};
  }

  const msUntil = msLimit - msSince;
  const timer = window.setTimeout(async () => {
    useClickStore.getState().reset();
  }, msUntil);
  console.log("Сброс через", msUntil / 1000, "секунд");
  return () => clearTimeout(timer);
}
