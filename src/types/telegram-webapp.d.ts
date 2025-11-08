/* eslint-disable @typescript-eslint/no-explicit-any */
// src/types/telegram-webapp.d.ts
export {};

declare global {
  interface TelegramUser {
    id: number;
    is_bot?: boolean;
    first_name?: string;
    last_name?: string;
    username?: string;
    language_code?: string;

    [key: string]: any;
  }

  interface TelegramInitDataUnsafe {
    user?: TelegramUser | string;
    auth_date?: string;
    [key: string]: any;
  }

  interface TelegramWebApp {
    initData?: string; // signed string
    initDataUnsafe?: TelegramInitDataUnsafe;
    ready: () => void;
    onEvent?: (event: string, cb: (...args: any[]) => void) => void;
    offEvent?: (event: string, cb: (...args: any[]) => void) => void;
    // другие поля/методы, если нужно
    [key: string]: any;
  }

  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp;
    };
  }
}
