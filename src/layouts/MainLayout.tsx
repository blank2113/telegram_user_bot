import { useState, useEffect, Suspense, useRef } from "react";
import { Outlet, useLocation } from "react-router-dom";
import bg from "../assets/images/mainbg.webp";
import UnAuthorizePage from "../pages/UnAuthorizePage";
import Navigation from "../components/navigation/Navigation";
import useClickStore from "../store/clickStore";
import Header from "../components/header/Header";
import useAuthStore from "../store/authStore";
import { scheduleResetFor } from "../utils/scheduleResetFor";

const MainLayout = () => {
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const setUser = useAuthStore((s) => s.setUser);
  const user = useAuthStore((s) => s.user);
  const resetCleanupRef = useRef<() => void>(() => {});
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const start = searchParams.get("start");

  let parsedData = null;
  if (start) {
    try {
      const decoded = atob(start);
      parsedData = JSON.parse(decoded);
    } catch (err) {
      console.error("Ошибка парсинга Base64 JSON:", err);
    }
  }

  // --- Fetch user по id ---
  const fetchUser = async () => {
    try {
      // const userId = 12345;
      const res = await fetch(`http://localhost:3000/api/users/profile/12345`);
      if (!res.ok) {
        console.error("Ошибка получения пользователя:", res.statusText);
        return;
      }
      const data = await res.json();

      if (data) {
        setUser(data);
      }
    } catch (err) {
      console.error("Ошибка при запросе пользователя:", err);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    resetCleanupRef.current?.();

    if (user?.id) {
      resetCleanupRef.current = scheduleResetFor(user?.id, user.maxTotalLimit);
    }

    return () => {
      resetCleanupRef.current?.();
    };
  }, [user?.id, user?.maxTotalLimit]);

  useEffect(() => {
    const checkScreen = () => setIsMobile(window.innerWidth < 768);
    checkScreen();
    window.addEventListener("resize", checkScreen);

    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  // --- Сохраняем клики при уходе со страницы ---
  useEffect(() => {
    const onVisibility = () => {
      if (document.visibilityState === "hidden") {
        const state = useClickStore.getState();
        const pending = state.pending;
        const endpoint = state.endpoint;
        if (pending > 0 && endpoint) {
          try {
            const body = JSON.stringify({ clicks: pending, ts: Date.now() });
            const ok = navigator.sendBeacon(
              endpoint,
              new Blob([body], { type: "application/json" })
            );
            if (ok) {
              useClickStore.setState((s) => ({
                pending: Math.max(0, s.pending - pending),
              }));
            }
          } catch {}
        }
      }
    };

    const onBeforeUnload = (_: BeforeUnloadEvent) => onVisibility();

    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("beforeunload", onBeforeUnload);

    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("beforeunload", onBeforeUnload);
    };
  }, []);

  return (
    <main
      className='min-h-screen w-screen h-svh flex flex-col items-center justify-center relative overflow-hidden'
      style={{
        background: `url(${bg}) no-repeat center center / cover`,
      }}>
      <div className='absolute inset-0 bg-linear-to-b opacity-45 from-[#09152A] to-[#67C5F8]' />

      {isMobile ? (
        <div className='h-full w-full flex flex-col items-center justify-center relative z-20'>
          <Header />
          <Suspense
            fallback={
              <div className='w-full h-full flex items-center justify-center'>
                <p className='text-white text-4xl font-semibold'>Loading...</p>
              </div>
            }>
            <p className='bg-red-600 text-white text-2xl w-full py-5 px-3'>
              User ID: {parsedData?.user_id ?? "Не указан"}
            </p>
            <Outlet />
          </Suspense>
          <Navigation />
        </div>
      ) : (
        <UnAuthorizePage />
      )}
    </main>
  );
};

export default MainLayout;
