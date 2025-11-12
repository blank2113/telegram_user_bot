import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Navigation from "../components/navigation/Navigation";
import Header from "../components/header/Header";
import bg from "../assets/images/mainbg.jpg";
import UnAuthorizePage from "../pages/UnAuthorizePage";

const MainLayout = () => {
  const [isMobile, setIsMobile] = useState<boolean>(false);
  // const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const checkScreen = () => setIsMobile(window.innerWidth < 768);
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  // useEffect(() => {
  //   const urlParams = new URLSearchParams(window.location.search);
  //   const startParam = urlParams.get("start");

  //   if (startParam) {
  //     try {
  //       // в браузере вместо Buffer используем atob
  //       const decoded = JSON.parse(atob(startParam));
  //       if (decoded.user_id) {
  //         setUserId(Number(decoded.user_id));
  //       }
  //     } catch (err) {
  //       console.error("Failed to parse start param:", err);
  //     }
  //   }
  // }, []);

  return (
    <main
      className='min-h-screen w-screen h-svh flex flex-col items-center justify-center'
      style={{
        background: `url(${bg}) no-repeat center center / cover`,
        overflow: "hidden",
      }}>
      <div className='absolute inset-0 bg-linear-to-b opacity-35 from-[#09152A] to-[#67C5F8]' />

      {isMobile ? (
        <div className='h-full w-full flex flex-col items-center justify-center'>
          <Header />
          <Outlet />
          <Navigation />
        </div>
      ) : (
        <UnAuthorizePage />
      )}
    </main>
  );
};

export default MainLayout;
