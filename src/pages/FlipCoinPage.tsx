import React, { useState, useRef, useEffect, type FC } from "react";
import { motion, type Transition } from "framer-motion";
import back from "../assets/images/back.png";
import front from "../assets/images/front.png";

type CoinSide = "heads" | "tails";

const CoinFlip: FC = () => {
  const [balance, setBalance] = useState<number>(1000);
  const [bet, setBet] = useState<number>(10);
  const [message, setMessage] = useState<string>("");
  const [isFlipping, setIsFlipping] = useState<boolean>(false);
  const [lastResult, setLastResult] = useState<CoinSide | null>(null);

  const [rotation, setRotation] = useState<number>(0);
  const rotationRef = useRef<number>(0);
  // const touchStartY = useRef<number | null>(null);

  const [isTelegramWebApp, setIsTelegramWebApp] = useState<boolean>(false);
  useEffect(() => {
    setIsTelegramWebApp(Boolean(window.Telegram && window.Telegram.WebApp));
  }, []);
  console.log(isTelegramWebApp);

  const haptic = (type: "light" | "medium" | "heavy" = "light") => {
    try {
      if (navigator.vibrate) {
        navigator.vibrate(type === "light" ? 20 : type === "medium" ? 40 : 70);
      }
    } catch {}
  };

  const [isMobile, setIsMobile] = useState<boolean>(false);
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const flipCoin = (choice: CoinSide) => {
    if (isFlipping) return;
    const stake = Number(bet) || 0;
    if (stake <= 0) {
      setMessage("Введите ставку больше 0");
      return;
    }
    if (stake > balance) {
      setMessage("Недостаточно средств");
      return;
    }

    setMessage("");
    setIsFlipping(true);

    const result: CoinSide = Math.random() < 0.5 ? "heads" : "tails";
    const spins = Math.floor(Math.random() * 3) + (isMobile ? 3 : 4);
    const extra = result === "heads" ? 0 : 180;
    const targetRotation = rotationRef.current + spins * 360 + extra;

    rotationRef.current = targetRotation;
    setRotation(targetRotation);

    const totalMs = isMobile ? 1200 : 1400;
    setTimeout(() => {
      const won = result === choice;
      setLastResult(result);
      if (won) {
        setBalance((b) => b + stake);
        setMessage(
          `Вы выиграли ${stake} — выпало ${
            result === "heads" ? "Орёл" : "Решка"
          }`
        );
        haptic("light");
      } else {
        setBalance((b) => b - stake);
        setMessage(
          `Вы проиграли ${stake} — выпало ${
            result === "heads" ? "Орёл" : "Решка"
          }`
        );
        haptic("medium");
      }
      setTimeout(() => haptic("light"), 80);
      setIsFlipping(false);
    }, totalMs);
  };

  const coinTransition: Transition = {
    rotateX: {
      type: "tween",
      ease: [0.22, 1, 0.36, 1],
      duration: 1.4,
    },
    y: {
      duration: 1.4,
      times: [0, 0.28, 0.78, 1],
      ease: "easeInOut",
    },
    scale: { duration: 1.4, ease: "easeInOut" },
  };

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (isFlipping) return;
    e.preventDefault();
    const factor = isMobile ? 0.45 : 0.7;
    rotationRef.current += e.deltaY * factor;
    setRotation(rotationRef.current);
  };

  // const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
  //   if (isFlipping) return;
  //   touchStartY.current = e.touches?.[0]?.clientY ?? null;
  // };
  // const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
  //   if (isFlipping) return;
  //   if (touchStartY.current == null) return;
  //   const y = e.touches?.[0]?.clientY ?? 0;
  //   const dy = touchStartY.current - y;
  //   const factor = isMobile ? 0.9 : 1.1;
  //   rotationRef.current += dy * factor;
  //   setRotation(rotationRef.current);
  //   touchStartY.current = y;
  // };
  // const handleTouchEnd = () => {
  //   touchStartY.current = null;
  // };

  return (
    <div
      className=' flex items-center justify-center bg-transparent pb-50 h-full overflow-y-scroll'
      style={{
        paddingTop: "0px",
        paddingBottom: "60px",
      }}>
      <div className='w-full max-w-md mx-4 rounded-2xl p-4 shadow-md  bg-white/5 backdrop-blur-md  border border-white/10'>
        <div className='flex items-center justify-between mb-3'>
          <div>
            <div className='text-sm text-white relative z-10'>Баланс</div>
            <div className='text-lg font-semibold text-yellow-400 relative z-10'>
              {balance}
            </div>
          </div>
          <div className='text-right'>
            <div className='text-xs text-white relative z-10'>Последний</div>
            <div className='text-sm text-yellow-400 relative z-10'>
              {lastResult ? (lastResult === "heads" ? "Орёл" : "Решка") : "—"}
            </div>
          </div>
        </div>

        <div
          className='relative bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-800 rounded-xl pt-16 pb-4 px-4'
          style={{ boxShadow: "0 6px 18px rgba(16,24,40,0.06)" }}>
          <div
            className={`absolute left-1/2 transform -translate-x-1/2 ${"-top-16"} z-30`}>
            <div
              className={`${isMobile ? "w-28 h-28" : "w-36 h-36"} relative`}
              style={{ perspective: 1000 }}>
              <motion.div
                className='absolute left-1/2 -translate-x-1/2 bottom-2 rounded-full pointer-events-none'
                style={{
                  width: isMobile ? "46%" : "40%",
                  height: isMobile ? 16 : 20,
                  background:
                    "radial-gradient(ellipse at center, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.12) 60%, rgba(0,0,0,0) 100%)",
                }}
                animate={
                  isFlipping
                    ? {
                        scaleX: [1, 0.4, 0.7, 1],
                        opacity: [0.9, 0.14, 0.5, 0.9],
                        y: [0, isMobile ? 18 : 22, isMobile ? 6 : 8, 0],
                        filter: [
                          "blur(6px)",
                          "blur(18px)",
                          "blur(10px)",
                          "blur(6px)",
                        ],
                      }
                    : { scaleX: 1, opacity: 0.9, y: 0, filter: "blur(6px)" }
                }
                transition={{
                  duration: isMobile ? 1.2 : 1.4,
                  ease: "easeInOut",
                }}
              />

              <motion.div
                className={`w-full h-full rounded-full bg-gradient-to-b from-yellow-300 to-yellow-400 flex items-center justify-center text-4xl shadow-sm select-none ${
                  isMobile ? "" : "shadow-md"
                }`}
                style={{ transformStyle: "preserve-3d" }}
                onWheel={handleWheel}
                // onTouchStart={handleTouchStart}
                // onTouchMove={handleTouchMove}
                // onTouchEnd={handleTouchEnd}
                animate={
                  isFlipping
                    ? {
                        rotateX: rotation,
                        y: [0, isMobile ? -110 : -130, isMobile ? -22 : -26, 0],
                        scale: [1, 1.03, 1.02, 1],
                      }
                    : { rotateX: rotation, y: 0, scale: 1 }
                }
                transition={coinTransition}
                onClick={() => {
                  if (!isFlipping)
                    flipCoin(Math.random() < 0.5 ? "heads" : "tails");
                }}
                role='button'
                aria-label='Монета — нажмите для броска, свайпом крутите'>
                <div
                  style={{
                    backfaceVisibility: "hidden",
                    transform: "rotateX(0deg) translateZ(2px)",
                  }}
                  className='absolute inset-0 flex flex-col items-center justify-center'>
                  <img
                    src={front}
                    alt=''
                    className='w-full h-full object-cover'
                  />
                </div>
                <div
                  style={{
                    backfaceVisibility: "hidden",
                    transform: "rotateX(180deg) translateZ(2px)",
                  }}
                  className='absolute inset-0 flex flex-col items-center justify-center'>
                  <div className=''>
                    <img
                      src={back}
                      alt=''
                      className='w-full h-full object-cover'
                    />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          <div className='flex flex-col gap-3'>
            <label className='text-xs text-white'>Ставка</label>
            <input
              value={bet}
              onChange={(e) => setBet(Number(e.target.value))}
              type='number'
              min={1}
              className='w-full p-3 rounded-lg border border-gray-100 text-sm text-white'
            />

            <div className='flex gap-3'>
              <button
                onClick={() => flipCoin("heads")}
                disabled={isFlipping}
                style={{
                  background: "linear-gradient(90deg,#7C3AED,#4F46E5)",
                  color: "white",
                }}
                className='flex-1 py-3 rounded-lg bg-blue-600 text-white font-semibold text-sm shadow-sm disabled:opacity-60'>
                Орёл
              </button>
              <button
                onClick={() => flipCoin("tails")}
                disabled={isFlipping}
                style={{
                  background: "linear-gradient(90deg,#059669,#10B981)",
                  color: "white",
                }}
                className='flex-1 py-3 rounded-lg bg-green-600 text-white font-semibold text-sm shadow-sm disabled:opacity-60'>
                Решка
              </button>
            </div>

            <div className='mt-2 text-sm text-white min-h-[44px]'>
              {message || "—"}
            </div>
            <div className='text-xs text-white'>
              Прокрутите вверх/вниз по монете или нажмите для броска. Интерфейс
              оптимизирован для Telegram Mini App.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoinFlip;
