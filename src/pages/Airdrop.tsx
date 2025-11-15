import { useRef, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Progress from "../components/progress/Progress";
import touchAv from "../assets/images/Touch.webp";
import coin from "../assets/images/coin.webp";

const STEP = 1;
const layers = [10, 8, 6];

export default function AirDrop() {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const avatarRef = useRef<HTMLImageElement | null>(null);
  const lastTapRef = useRef(0);

  const countRef = useRef(0);
  const valueRef = useRef(45);

  const [pops, setPops] = useState<{ id: number; x: number; y: number }[]>([]);

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

  const handlePointer = (e: React.PointerEvent) => {
    const now = performance.now();
    if (now - lastTapRef.current < 120) return;
    lastTapRef.current = now;

    // обновляем счетчики
    countRef.current += 1;
    valueRef.current = Math.min(1000, valueRef.current + STEP);

    // позиция для визуального "+1"
    const rect = wrapRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const id = Date.now() + Math.floor(Math.random() * 1000);
    setPops((arr) => [...arr, { id, x, y }]);

    // удалить через 900ms
    setTimeout(() => {
      setPops((arr) => arr.filter((p) => p.id !== id));
    }, 900);
  };

  return (
    <div
      ref={wrapRef}
      className='relative w-full h-full pt-2 space-y-4 flex-1 overflow-hidden pb-55'
      onPointerDown={handlePointer}>
      {/* Прогресс бар */}
      <Progress value={valueRef.current} height={12} max={1000} />

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
      <AnimatePresence>
        {pops.map((p) => (
          <motion.span
            key={p.id}
            initial={{ x: p.x, y: p.y, opacity: 1, scale: 1 }}
            animate={{ y: p.y - 40, opacity: 0, scale: 1.2 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className='absolute -translate-x-1/2 -translate-y-1/2 text-white font-bold pointer-events-none'>
            +1
          </motion.span>
        ))}
      </AnimatePresence>

      {/* Аватар */}
      <motion.img
        ref={avatarRef}
        src={touchAv}
        alt=''
        className='absolute left-1/2 bottom-[100px] -translate-x-1/2 w-auto h-[clamp(320px,62svh,520px)] max-w-[90vw] select-none pointer-events-none z-20'
        initial={{ scale: 0.98, rotate: -1, opacity: 0.95 }}
        animate={{ scale: 1, rotate: 0, opacity: 1 }}
        transition={{ duration: 0.28, ease: "easeOut" }}
        draggable={false}
        decoding='async'
      />

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
