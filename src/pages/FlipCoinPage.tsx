import { useState, useRef, useEffect, type FC } from "react";
import { motion, useAnimation, type Transition } from "framer-motion";
import back from "../assets/images/back.png";
import front from "../assets/images/front.png";
import CustomButton from "../components/ui/CustomButton";
import CustomPopup from "../components/ui/CustomPopup";
import CoinLeaderBoard from "../components/games/CoinLeaderBoard";
import useAuthStore from "../store/authStore";

type CoinSide = "HEADS" | "TAILS";

const clamp = (v: number, min: number, max: number) =>
  Math.max(min, Math.min(max, v));

const CoinFlip: FC = () => {
  const user = useAuthStore((s) => s.user);
  const [bet, setBet] = useState<number>(1000);
  const [message, setMessage] = useState<string>("");
  const [isFlipping, setIsFlipping] = useState<boolean>(false);
  const [lastResult, setLastResult] = useState<CoinSide | null>(null);
  const rotationRef = useRef<number>(0);
  const [modal, setModal] = useState<boolean>(false);
  const patchUser = useAuthStore((s) => s.patchUser);

  const controls = useAnimation();

  const haptic = (type: "light" | "medium" | "heavy" = "light") => {
    try {
      if (typeof navigator !== "undefined" && (navigator as any).vibrate) {
        (navigator as any).vibrate(
          type === "light" ? 20 : type === "medium" ? 40 : 70
        );
      }
    } catch {}
  };

  const [isMobile, setIsMobile] = useState<boolean>(false);
  useEffect(() => {
    const onResize = () =>
      setIsMobile(typeof window !== "undefined" && window.innerWidth < 768);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const coinTransition: Transition = {
    rotateX: {
      type: "tween",
      ease: [0.22, 1, 0.36, 1],
      duration: isMobile ? 1.2 : 1.4,
    },
    y: {
      duration: isMobile ? 1.2 : 1.4,
      times: [0, 0.28, 0.78, 1],
      ease: "easeInOut",
    },
    scale: { duration: isMobile ? 1.2 : 1.4, ease: "easeInOut" },
  };

  const flipCoin = async (choice: CoinSide) => {
    if (isFlipping) return;

    const stake = Number(bet);
    if (!Number.isFinite(stake) || stake <= 0) {
      setMessage("10 dan kattaroq taklif kiriting");
      return;
    }
    if (stake > Number(user?.balance)) {
      setMessage("Mablag'lar yetarli emas");
      return;
    }

    setMessage("");
    setIsFlipping(true);

    try {
      // делаем запрос на сервер
      const response = await fetch(
        "https://api.itformanomberone.com/api/flipCoin/play",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: 1,
            choice: choice,
            amount: stake,
          }),
        }
      );

      if (!response.ok) {
        setMessage(`Ошибка сервера: ${response.status}`);
        setIsFlipping(false);
        return;
      }

      const data = await response.json();

      const spins = Math.floor(Math.random() * 3) + (isMobile ? 3 : 4);
      const extra = data?.result === "heads" ? 0 : 180;
      const base = Math.round(rotationRef.current / 360) * 360;
      const targetRotation = base + spins * 360 + extra;
      rotationRef.current = targetRotation;

      // запускаем анимацию
      await controls.start(
        {
          rotateX: targetRotation,
          y: isMobile ? [-110, -22, 0] : [-130, -26, 0],
          scale: [1, 1.03, 1.02, 1],
        },
        coinTransition
      );
      console.log(data);

      setLastResult(data?.result);

      const won = data.won;
      setMessage(
        won
          ? `Siz g'alaba qozondingiz ${stake} — tushib ketdi ${
              data?.result === "heads" ? "Burgut" : "Quyruqlar"
            }`
          : `Siz yutqazdingiz ${stake} — tushib ketdi ${
              data?.result === "heads" ? "Burgut" : "Quyruqlar"
            }`
      );
      patchUser({ balance: data.newBalance });
      haptic(won ? "light" : "medium");
    } catch (err) {
      console.error("Ошибка запроса flipCoin:", err);
      setMessage("Произошла ошибка при обращении к серверу");
    } finally {
      setIsFlipping(false);
    }
  };

  useEffect(() => {
    controls.set({ rotateX: rotationRef.current });
  }, [controls]);

  const onBetChange = (val: string) => {
    const n = Number(val);
    if (Number.isNaN(n)) return; // проверка на NaN
    setBet(clamp(Math.round(n), 1000, 1_000_000));
  };

  return (
    <div className='flex flex-col  items-center bg-transparent pt-5  overflow-y-auto pb-35 px-3  gap-5 w-full h-full'>
      <div className='flex items-center justify-end w-full'>
        <CustomButton
          onClick={() => setModal(true)}
          title='Rahbarlar'
          className='font-medium text-[14px]'
        />
      </div>
      <div className='w-full max-w-md mx-4 rounded-2xl p-4 shadow-md bg-white/5 backdrop-blur-md border border-white/10'>
        <div className='flex items-center justify-between mb-3'>
          <div>
            <div className='text-sm text-white relative z-10'>Balans</div>
            <div className='text-lg font-semibold text-yellow-400 relative z-10'>
              {user?.balance}
            </div>
          </div>
          <div className='text-right'>
            <div className='text-xs text-white relative z-10'>Oxirgi</div>
            <div className='text-sm text-yellow-400 relative z-10'>
              {lastResult
                ? lastResult === "HEADS"
                  ? "Burgut"
                  : "Quyruqlar"
                : "—"}
            </div>
          </div>
        </div>

        {/* coin container */}
        <div
          className='relative bg-linear-to-br from-slate-900 via-indigo-900 to-purple-800 rounded-xl pt-24 pb-6 px-4'
          style={{ boxShadow: "0 6px 18px rgba(16,24,40,0.06)" }}>
          {/* монета — абсолютно спозиционирована сверху, но НЕ выталкивает контент */}
          <div className='absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 z-30'>
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
                className='w-full h-full rounded-full flex items-center justify-center select-none relative'
                style={{ transformStyle: "preserve-3d", perspective: 1000 }}
                animate={controls}
                initial={{ rotateX: rotationRef.current, y: 0, scale: 1 }}>
                <div
                  className='absolute inset-0'
                  style={{
                    backfaceVisibility: "hidden",
                    transform: "rotateX(0deg)",
                  }}>
                  <img
                    src={front}
                    alt='front'
                    className='w-full h-full object-cover rounded-full'
                    draggable={false}
                  />
                </div>

                <div
                  className='absolute inset-0'
                  style={{
                    backfaceVisibility: "hidden",
                    transform: "rotateX(180deg)",
                  }}>
                  <img
                    src={back}
                    alt='back'
                    className='w-full h-full object-cover rounded-full'
                    draggable={false}
                  />
                </div>
              </motion.div>
            </div>
          </div>

          {/* Форма и кнопки — с дополнительным паддингом сверху (pt-24) чтобы не налезали на монету */}
          <div className='flex flex-col gap-3'>
            <label className='text-xs text-white'>Minimal 5.000 so’m</label>
            <input
              value={bet}
              onChange={(e) => onBetChange(e.target.value)}
              className='w-full p-3 rounded-lg border border-gray-100 text-sm text-white'
              type='number' // добавлено
              min={1000}
            />

            <div className='flex gap-3'>
              <button
                onClick={() => flipCoin("HEADS")}
                disabled={
                  isFlipping || bet < 1000 || bet > (user?.balance ?? 0)
                }
                aria-pressed={isFlipping}
                style={{
                  background: "linear-gradient(90deg,#7C3AED,#4F46E5)",
                  color: "white",
                }}
                className='flex-1 py-3 rounded-lg text-white font-semibold text-sm shadow-sm disabled:opacity-60'>
                Burgut
              </button>

              <button
                onClick={() => flipCoin("TAILS")}
                disabled={
                  isFlipping || bet < 1000 || bet > (user?.balance ?? 0)
                }
                aria-pressed={isFlipping}
                style={{
                  background: "linear-gradient(90deg,#059669,#10B981)",
                  color: "white",
                }}
                className='flex-1 py-3 rounded-lg text-white font-semibold text-sm shadow-sm disabled:opacity-60'>
                Quyruq
              </button>
            </div>

            <div className='mt-2 text-sm text-white min-h-11'>
              {message || "-"}
            </div>
          </div>
        </div>
      </div>

      <CustomPopup
        open={modal}
        setOpen={setModal}
        component={<CoinLeaderBoard onClose={() => setModal(false)} />}
      />
    </div>
  );
};

export default CoinFlip;
