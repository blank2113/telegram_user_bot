export const TASK_KEYS = {
  invite: "daily_invite_count",
  bonus14: "daily_bonus14_count",
  burgut: "daily_burgut_count",
};

export const TASK_LIMITS = {
  invite: 3, // 3 друга в день
  bonus14: 1, // 3 игры в день
  burgut: 1, // 3 игры в день
};

// получить счетчик за сегодня
export function getTodayCount(key: string) {
  const raw = localStorage.getItem(key);
  if (!raw) return 0;
  const data = JSON.parse(raw);
  const last = new Date(data.lastDate);
  const today = new Date();
  if (
    last.getFullYear() === today.getFullYear() &&
    last.getMonth() === today.getMonth() &&
    last.getDate() === today.getDate()
  ) {
    return data.count;
  }
  return 0;
}

// обновить счетчик
export function incrementTodayCount(key: string) {
  const count = getTodayCount(key) + 1;
  localStorage.setItem(
    key,
    JSON.stringify({ count, lastDate: new Date().toISOString() })
  );
  return count;
}
