import { useRef, useMemo } from "react";
import coin from "../assets/images/coin.webp";
import TouchableComp from "../components/airdrop/TouchableComp";
import Progress from "../components/progress/Progress";
import {
  getTodayCount,
  incrementTodayCount,
  TASK_KEYS,
  TASK_LIMITS,
} from "../utils/bonus";
import { useNavigate } from "react-router-dom";
import { incrementBalance } from "../utils/incrementBalance";

const layers = [10, 8, 6];

export default function AirDrop() {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  const coins = useMemo(() => {
    return layers.flatMap((count, layerIndex) =>
      Array.from({ length: count }).map(() => {
        const size = Math.random() * 20 + 20;
        const left = Math.random() * 100;
        const delay = Math.random() * 5;
        const duration = Math.random() * 6 + 5 - layerIndex;
        const rotateDir = Math.random() > 0.5 ? 1 : -1;
        return { size, left, delay, duration, rotateDir };
      })
    );
  }, []);

  const botUrl = `https://t.me/test_user_appp_bot?start=2`;

  const openTelegramShare = (e?: React.MouseEvent) => {
    e?.preventDefault();
    try {
      // Если внутри Telegram WebApp — используем openLink
      // @ts-ignore
      if (window?.Telegram?.WebApp?.openLink) {
        // @ts-ignore
        window.Telegram.WebApp.openLink(shareUrl);
        return;
      }
    } catch {}

    window.open(botUrl, "_blank", "noopener,noreferrer");
    incrementBalance(100000);
  };

  const handlePlayBonus14 = () => {
    navigate("/flip_coin");
    incrementBalance(30000);
  };

  const handlePlayBurgut = () => {
    navigate("/wheel");
    incrementBalance(30000);
  };

  return (
    <div
      ref={wrapRef}
      className='relative w-full h-full pt-2 space-y-4 flex-1 pb-55 overflow-x-hidden'>
      {/* Прогресс бар */}
      <Progress height={12} />

      {/* Монеты */}
      <div className='absolute inset-0 pointer-events-none z-10'>
        {coins.map((c, i) => (
          <img
            key={i}
            src={coin}
            alt=''
            className='coin'
            style={
              {
                width: `${c.size}px`,
                height: `${c.size}px`,
                left: `${c.left}%`,
                animationDelay: `${c.delay}s`,
                animationDuration: `${c.duration}s`,
                "--rotate-dir": c.rotateDir,
                willChange: "transform, opacity",
              } as any
            }
          />
        ))}
      </div>

      {/* Слой "+1" */}
      <TouchableComp />

      {/* Дневные задания */}
      <div className='w-full max-w-md mt-6 space-y-4 z-20 px-3'>
        {/* Задание 1 */}
        {(() => {
          const done = getTodayCount(TASK_KEYS.invite) >= TASK_LIMITS.invite;
          return (
            <div className='p-5 bg-gradient-to-r from-blue-700/80 to-blue-500/60 rounded-2xl shadow-lg flex flex-col items-start transition-transform transform hover:scale-105 hover:shadow-xl'>
              <div className='flex items-center justify-between w-full flex-col gap-2'>
                <p className='font-bold text-white text-lg'>
                  do‘stni taklif qiling
                </p>
                <span className='text-yellow-400 font-semibold'>
                  💰 100 000 so‘m
                </span>
              </div>
              <p className='text-gray-200 text-sm mt-1 text-center w-full'>
                Taklif qiling va balansingizni oshiring.
              </p>
              <button
                className={`mt-3 w-full px-4 py-2 rounded-xl transition-colors font-medium ${
                  done
                    ? "bg-gray-500 text-gray-300 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
                disabled={done}
                onClick={() => {
                  if (done) return;
                  openTelegramShare();
                  incrementTodayCount(TASK_KEYS.invite);
                }}>
                Taklifni yubориш
              </button>
            </div>
          );
        })()}

        {/* Задание 2 */}
        {(() => {
          const done = getTodayCount(TASK_KEYS.bonus14) >= TASK_LIMITS.bonus14;
          return (
            <div className='p-5 bg-gradient-to-r from-green-700/80 to-green-500/60 rounded-2xl shadow-lg flex flex-col items-start transition-transform transform hover:scale-105 hover:shadow-xl'>
              <div className='flex items-center justify-between w-full flex-col gap-2'>
                <p className='font-bold text-white text-lg'>
                  Bonus14 o‘yinini 15 marta o‘ynang
                </p>
                <span className='text-yellow-400 font-semibold'>
                  💰 30 000 so‘m
                </span>
              </div>
              <p className='text-gray-200 text-sm mt-1 text-center w-full'>
                O‘yinlarni o‘ynab balansingizni oshiring.
              </p>
              <button
                className={`mt-3 w-full px-4 py-2 rounded-xl transition-colors font-medium ${
                  done
                    ? "bg-gray-500 text-gray-300 cursor-not-allowed"
                    : "bg-green-600 text-white hover:bg-green-700"
                }`}
                disabled={done}
                onClick={() => {
                  if (done) return;
                  handlePlayBonus14();
                  incrementTodayCount(TASK_KEYS.bonus14);
                }}>
                O‘ynash
              </button>
            </div>
          );
        })()}

        {/* Задание 3 */}
        {(() => {
          const done = getTodayCount(TASK_KEYS.burgut) >= TASK_LIMITS.burgut;
          return (
            <div className='p-5 bg-gradient-to-r from-yellow-600/80 to-yellow-400/60 rounded-2xl shadow-lg flex flex-col items-start transition-transform transform hover:scale-105 hover:shadow-xl'>
              <div className='flex flex-col gap-2 items-center justify-between w-full'>
                <p className='font-bold text-white text-[16px]'>
                  Burgut/Quyruq o‘yini 15 marta o‘ynang
                </p>
                <span className='text-yellow-900 font-semibold'>
                  💰 30 000 so‘m
                </span>
              </div>
              <p className='text-gray-800 text-sm mt-1 text-center w-full'>
                O‘yinlarni o‘ynab balansingizni oshiring.
              </p>
              <button
                className={`mt-3 w-full px-4 py-2 rounded-xl transition-colors font-medium ${
                  done
                    ? "bg-gray-500 text-gray-300 cursor-not-allowed"
                    : "bg-yellow-500 text-white hover:bg-yellow-600"
                }`}
                disabled={done}
                onClick={() => {
                  if (done) return;
                  handlePlayBurgut();
                  incrementTodayCount(TASK_KEYS.burgut);
                }}>
                O‘ynash
              </button>
            </div>
          );
        })()}
      </div>

      {/* CSS */}
      <style>{`
        .coin {
          position: absolute;
          top: -50px;
          pointer-events: none;
          transform-origin: center;
          animation-name: fallRotate;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }

        @keyframes fallRotate {
          0% { transform: translateY(0) rotate(0deg); opacity: 0; }
          10% { opacity: 1; }
          50% { transform: translateY(50vh) rotate(calc(180deg * var(--rotate-dir))); }
          100% { transform: translateY(100vh) rotate(calc(360deg * var(--rotate-dir))); opacity: 0; }
        }

        @media (prefers-reduced-motion: reduce) {
          .coin { animation: none !important; }
        }
      `}</style>
    </div>
  );
}
