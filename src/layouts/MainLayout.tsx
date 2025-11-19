import { useState, useEffect, Suspense } from "react";
import { Outlet } from "react-router-dom";
import bg from "../assets/images/mainbg.webp";
import UnAuthorizePage from "../pages/UnAuthorizePage";
import Navigation from "../components/navigation/Navigation";
import useClickStore from "../store/clickStore";
import Header from "../components/header/Header";
import useAuthStore from "../store/authStore";

const MainLayout = () => {
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const setUser = useAuthStore((s) => s.setUser);

  // call this on app start
  function syncTopOffset() {
    // compute offset from visualViewport when available (more accurate on mobile)
    const vv = (window as any).visualViewport;
    const offset = vv ? Math.max(0, Math.round(vv.offsetTop || 0)) : 0;
    document.documentElement.style.setProperty(
      "--tg-top-offset",
      `${offset}px`
    );
  }

  // update on changes
  if (window.visualViewport) {
    window.visualViewport.addEventListener("resize", syncTopOffset);
    window.visualViewport.addEventListener("scroll", syncTopOffset);
  }
  window.addEventListener("resize", syncTopOffset);
  window.addEventListener("orientationchange", syncTopOffset);
  window.addEventListener("load", syncTopOffset);

  // also run once immediately
  syncTopOffset();

  useEffect(() => {
    const checkScreen = () => setIsMobile(window.innerWidth < 768);
    checkScreen();
    window.addEventListener("resize", checkScreen);
    setUser({
      id: 1,
      telegram_id: 123213,
      name: "Ivan Ivanov",
      balance: 300,
      level: 1,
      status: "common",
      img: null,
      statusMaxEnergy: 100,
    });
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  useEffect(() => {
    const onVisibility = () => {
      if (document.visibilityState === "hidden") {
        // Попытка отправить синхронно: navigator.sendBeacon предпочтителен
        const state = useClickStore.getState();
        const pending = state.pending;
        const endpoint = state.endpoint;
        if (pending > 0 && endpoint) {
          try {
            const body = JSON.stringify({ clicks: pending, ts: Date.now() });
            // sendBeacon возвращает true/false
            const ok = navigator.sendBeacon(
              endpoint,
              new Blob([body], { type: "application/json" })
            );
            if (ok) {
              // уменьшаем pending локально (если нужно)
              // store уже дебагит повторные попытки; можно сбросить:
              useClickStore.setState((s) => ({
                pending: Math.max(0, s.pending - pending),
              }));
            }
          } catch (e) {
            // ничего — store попытается позже
          }
        }
      }
    };

    const onBeforeUnload = (_: BeforeUnloadEvent) => {
      // аналогичная попытка через sendBeacon
      onVisibility();
    };

    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("beforeunload", onBeforeUnload);

    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("beforeunload", onBeforeUnload);
    };
  }, []);

  useEffect(() => {
    const unsubscribe = useAuthStore.subscribe((state) => {
      const max = state.user?.statusMaxEnergy ?? 100; // <-- через state.user
      useClickStore.setState({ maxTotalLimit: max });
    });

    return () => unsubscribe();
  }, []);

  return (
    <main
      className='min-h-screen w-screen h-svh flex flex-col items-center justify-center relative overflow-hidden'
      style={{
        background: `url(${bg}) no-repeat center center / cover`,
      }}>
      {/* Градиент */}
      <div className='absolute inset-0 bg-linear-to-b opacity-45 from-[#09152A] to-[#67C5F8]' />

      {/* Контент */}
      {isMobile ? (
        <div className='h-full w-full flex flex-col items-center justify-center relative z-20'>
          <Header />
          <Suspense
            fallback={
              <div className='w-full h-full flex items-center justify-center'>
                <p className='text-white text-4xl font-semibold'>Loading...</p>
              </div>
            }>
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
