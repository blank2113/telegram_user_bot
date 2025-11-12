import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Navigation from "../components/navigation/Navigation";
import Header from "../components/header/Header";
import bg from "../assets/images/mainbg.jpg";
import UnAuthorizePage from "../pages/UnAuthorizePage";

const MainLayout = () => {
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const checkScreen = () => setIsMobile(window.innerWidth < 768);
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  useEffect(() => {
    if (window.Telegram?.WebApp) {
      const urlParams = new URLSearchParams(window.location.search);
      const startParam = urlParams.get("start");

      if (startParam) {
        try {
          // В браузере используем atob вместо Buffer
          const decoded = JSON.parse(atob(startParam));
          setUserId(decoded.user_id);
        } catch (err) {
          console.error("Failed to parse start param:", err);
        }
      }
    }
  }, []);

  console.log(userId);

  return (
    <main
      className='min-h-screen w-screen h-svh flex flex-col items-center justify-center'
      style={{
        background: `url(${bg}) no-repeat center center / cover`,
        overflow: "hidden",
      }}>
      <div className='absolute inset-0 bg-linear-to-b opacity-35 from-[#09152A] to-[#67C5F8]' />

      {isMobile && userId ? (
        <>
          <Header />
          <Outlet />
          <Navigation />
          {userId && (
            <div className='text-white mt-4'>Ваш Telegram ID: {userId}</div>
          )}
        </>
      ) : (
        <UnAuthorizePage />
      )}
    </main>
  );
};

export default MainLayout;
