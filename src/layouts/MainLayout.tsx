import { Suspense, useMemo } from "react";
import { Outlet, useLocation } from "react-router-dom";
import bg from "../assets/images/mainbg.webp";
import UnAuthorizePage from "../pages/UnAuthorizePage";
import Navigation from "../components/navigation/Navigation";
import Header from "../components/header/Header";
import useClickStore from "../store/clickStore";
import useAuthStore from "../store/authStore";
import { useUser } from "../hooks/useUser";
import { useIsMobile } from "../hooks/useIsMobile";
import { useSendBeaconOnHide } from "../hooks/useSendBeaconOnHide";
import { useScheduleResetForUser } from "../hooks/useScheduleResetForUser";

const MainLayout = () => {
  const location = useLocation();
  const searchParams = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  );
  const start = searchParams.get("start");

  const setUser = useAuthStore((s) => s.setUser);
  const localUser = useAuthStore((s) => s.user);

  let parsedData: { user_id?: string } | null = null;
  if (start) {
    try {
      const decoded = atob(start);
      parsedData = JSON.parse(decoded);
    } catch (err) {
      console.error("Ошибка парсинга Base64 JSON:", err);
    }
  }
  const userId = parsedData?.user_id ?? null;

  const { data: fetchedUser, isLoading, isError } = useUser(userId);

  if (fetchedUser && fetchedUser.id !== localUser?.id) {
    setUser(fetchedUser);
  }

  const isMobile = useIsMobile(768);
  useScheduleResetForUser(localUser?.id?.toString(), localUser?.maxTotalLimit);
  const endpoint = useClickStore.getState().endpoint;
  useSendBeaconOnHide({
    endpoint,
    getPayload: () => {
      const state = useClickStore.getState();
      if (!state.pending || state.pending <= 0) return null;
      return { clicks: state.pending, ts: Date.now() };
    },
    onSuccess: () => {
      useClickStore.setState(() => ({ pending: 0 }));
    },
  });

  return (
    <main
      className='min-h-screen w-screen h-svh flex flex-col items-center justify-center relative overflow-hidden'
      style={{ background: `url(${bg}) no-repeat center center / cover` }}>
      <div className='absolute inset-0 bg-linear-to-b opacity-45 from-[#09152A] to-[#67C5F8]' />

      {isMobile && !isLoading && !isError && userId ? (
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
