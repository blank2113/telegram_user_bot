import { useState, useEffect, Suspense } from "react";
import { Outlet } from "react-router-dom";
import bg from "../assets/images/mainbg.webp";
import UnAuthorizePage from "../pages/UnAuthorizePage";
import coin from "../assets/icons/coin.svg"; // иконка монеты

const MainLayout = () => {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const checkScreen = () => setIsMobile(window.innerWidth < 768);
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  const coins = Array.from({ length: 30 }); // количество падающих монет

  return (
    <main
      className='min-h-screen w-screen h-svh flex flex-col items-center justify-center relative overflow-hidden'
      style={{
        background: `url(${bg}) no-repeat center center / cover`,
      }}>
      {/* Градиент */}
      <div className='absolute inset-0 bg-linear-to-b opacity-45 from-[#09152A] to-[#67C5F8]' />

      {/* Падающие монеты */}
      <div className='absolute inset-0 pointer-events-none z-10' aria-hidden>
        {coins.map((_, i) => {
          const size = Math.random() * 15 + 15;
          const left = Math.random() * 100;
          const delay = Math.random() * 5;
          const duration = Math.random() * 6 + 3; // скорость падения
          const rotateDir = Math.random() > 0.5 ? 1 : -1;

          return (
            <img
              key={i}
              src={coin}
              alt='coin'
              className='coin'
              style={
                {
                  width: `${size}px`,
                  height: `${size}px`,
                  left: `${left}%`,
                  animationDelay: `${delay}s`,
                  animationDuration: `${duration}s`,
                  transform: `rotate(0deg)`,
                  "--rotate-dir": rotateDir,
                } as any
              }
            />
          );
        })}
      </div>

      {/* Контент */}
      {isMobile ? (
        <div className='h-full w-full flex flex-col items-center justify-center relative z-20'>
          <Suspense
            fallback={
              <div className='w-full h-full flex items-center justify-center'>
                <p className='text-white text-4xl font-semibold'>Loading...</p>
              </div>
            }>
            <Outlet />
          </Suspense>
        </div>
      ) : (
        <UnAuthorizePage />
      )}
    </main>
  );
};

export default MainLayout;
