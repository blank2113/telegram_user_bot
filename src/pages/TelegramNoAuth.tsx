import { useEffect, useState } from "react";

type UserData = {
  user_id?: number;
};

export default function MiniApp() {
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    let data: UserData | null = null;

    // 1️⃣ Telegram WebApp
    const WebApp = (window as any)?.Telegram?.WebApp;
    if (WebApp) {
      WebApp.ready();
      const startParam = WebApp.initDataUnsafe?.start_param;
      if (startParam) {
        try {
          data = JSON.parse(atob(startParam));
        } catch (e) {
          console.error("Failed to parse start_param from WebApp", e);
        }
      }
    }

    // 2️⃣ Fallback для прямого URL
    if (!data) {
      const urlParams = new URLSearchParams(window.location.search);
      const startParam = urlParams.get("start");
      if (startParam) {
        try {
          data = JSON.parse(atob(startParam));
        } catch (e) {
          console.error("Failed to parse start_param from URL", e);
        }
      }
    }

    if (data) setUserData(data);
  }, []);

  return (
    <div>
      <h1>Mini App</h1>
      {userData ? (
        <p>Telegram user ID: {userData.user_id}</p>
      ) : (
        <p>No user data</p>
      )}
    </div>
  );
}
