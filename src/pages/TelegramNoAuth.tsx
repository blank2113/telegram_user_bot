import { useEffect, useState } from "react";

type User = {
  id?: number;
  first_name?: string;
  username?: string;
  [k: string]: any;
};

// Определяем тип для Telegram WebApp
interface TelegramWebAppWindow extends Window {
  Telegram?: {
    WebApp: {
      ready: () => void;
      initDataUnsafe?: {
        user?: any;
        user_info?: any;
        from?: any;
      };
    };
  };
}

export default function TelegramNoBackendAuth({
  botUsername = "YourBotUsername",
  persist = true,
}: {
  botUsername?: string;
  persist?: boolean;
}) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const s = localStorage.getItem("tg_user");
      return s ? (JSON.parse(s) as User) : null;
    } catch {
      return null;
    }
  });
  const [status, setStatus] = useState<"idle" | "ok" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const WebApp = (window as TelegramWebAppWindow)?.Telegram?.WebApp;

    if (!WebApp) {
      setStatus("error");
      setError(
        "Telegram WebApp not available. Open the mini app from Telegram mobile."
      );
      return;
    }

    try {
      WebApp.ready();
    } catch {
      // ignore if ready not a function
    }

    const unsafe = WebApp.initDataUnsafe ?? {};
    let userObj: any = unsafe.user ?? unsafe.user_info ?? unsafe.from ?? null;

    if (typeof userObj === "string") {
      try {
        userObj = JSON.parse(userObj);
      } catch {
        userObj = null;
      }
    }

    if (!userObj) {
      setStatus("error");
      setError("User data not found in initDataUnsafe.");
      return;
    }

    const parsed: User = {
      id: Number(userObj.id),
      first_name: userObj.first_name,
      username: userObj.username,
      ...userObj,
    };

    setUser(parsed);
    setStatus("ok");
    setError(null);

    if (persist) {
      try {
        localStorage.setItem("tg_user", JSON.stringify(parsed));
      } catch {}
    }
  }, [persist]);

  const deepLink = `https://t.me/${botUsername}`;

  return (
    <div>
      {status === "idle" && <div>Инициализация Telegram WebApp...</div>}
      {status === "error" && (
        <div>
          <p style={{ color: "crimson" }}>Ошибка: {error}</p>
          <p>
            Откройте мини-приложение через Telegram на мобильном или нажмите на
            ссылку:
          </p>
          <a href={deepLink} target='_blank' rel='noreferrer'>
            {deepLink}
          </a>
        </div>
      )}
      {status === "ok" && user && (
        <div>
          <h3>Привет, {user.first_name ?? user.username ?? "пользователь"}!</h3>
          <p>Telegram ID: {user.id}</p>
          <pre style={{ opacity: 0.8 }}>{JSON.stringify(user, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
