export type NotificationPayload = {
  id: string;
  userId: string;
  event: string;
  payload: Record<string, unknown>;
  ts: number;
};
