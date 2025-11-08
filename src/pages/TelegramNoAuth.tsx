import { useEffect, useState } from "react";

type UserData = {
  userId?: number;
};

export default function TelegramNoAuth() {
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    const WebApp = (window as any)?.Telegram?.WebApp;
    if (!WebApp) return;

    WebApp.ready();

    // Получаем start_param
    const startParam = WebApp.initDataUnsafe?.start_param;
    if (startParam) {
      try {
        const data = JSON.parse(atob(startParam));
        setUserData(data);
      } catch (e) {
        console.error("Failed to parse start_param", e);
      }
    }
  }, []);

  return (
    <div>
      <h1>Mini App</h1>
      {userData ? (
        <p>Telegram user ID: {userData.userId}</p>
      ) : (
        <p>No user data</p>
      )}
    </div>
  );
}
