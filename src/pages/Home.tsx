import { memo, useRef, useState } from "react";
import { motion } from "framer-motion";
import Progress from "../components/progress/Progress";
import touchAv from "../assets/icons/touchAv.svg";
import coin from "../assets/icons/coin.svg";

const STEP = 1;
type Pop = { id: number; x: number; y: number };

export default function Home() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLImageElement>(null);
  const lastTapRef = useRef(0);

  const [count, setCount] = useState(0);
  const [value, setValue] = useState(45);
  const [animKey, setAnimKey] = useState(0);
  const [pops, setPops] = useState<Pop[]>([]);

  const spawnPop = (x: number, y: number) => {
    const id = Date.now() + Math.random();
    setPops((arr) => [...arr.slice(-15), { id, x, y }]);
    setTimeout(() => setPops((arr) => arr.filter((p) => p.id !== id)), 900);
  };

  const handleTap = () => {
    const now = performance.now();
    if (now - lastTapRef.current < 120) return;
    lastTapRef.current = now;

    setCount((c) => c + 1);
    setValue((v) => Math.min(1000, v + STEP));
    setAnimKey((k) => k + 1);

    const cRect = wrapRef.current?.getBoundingClientRect();
    const aRect = avatarRef.current?.getBoundingClientRect();
    if (!cRect || !aRect) return;

    const x = aRect.left + aRect.width / 15 - cRect.left;
    const x2 = aRect.left + aRect.width / 3 - cRect.left;
    const y = aRect.top + aRect.height / 15 - cRect.top - aRect.height * 0.18;
    const y2 = aRect.top + aRect.height / 3 - cRect.top - aRect.height * 0.18;

    spawnPop(x, y);
  };

  return (
    <div
      ref={wrapRef}
      className='relative w-full h-full py-2 space-y-4 flex-1 overflow-hidden'>
      <Progress value={value} height={12} max={1000} />

      {/* слой с "+1" поверх всего */}
      <div className='pointer-events-none absolute inset-0 z-30'>
        {pops.map((p) => (
          <PlusOne key={p.id} x={p.x} y={p.y} />
        ))}
      </div>

      {/* Тап-таргет по центру снизу */}
      <motion.button
        type='button'
        onTap={handleTap} // ← только onTap
        className='absolute left-1/2 bottom-[100px] -translate-x-1/2 focus:outline-none'
        whileTap={{ scale: 0.95 }}
        aria-label='Tap to increase'>
        <span className='absolute inset-0 -z-10 blur-xl rounded-full bg-cyan-300/30' />
        <motion.img
          ref={avatarRef}
          key={animKey}
          src={touchAv}
          alt=''
          className='w-auto h-[clamp(320px,62svh,520px)] max-w-[90vw] select-none pointer-events-none'
          initial={{ scale: 0.9, rotate: -2, opacity: 0.9 }}
          animate={{
            scale: [1, 1.12, 0.98, 1],
            rotate: [0, -2, 1, 0],
            opacity: 1,
          }}
          transition={{ duration: 0.28, ease: "easeOut" }}
          draggable={false}
        />
      </motion.button>

      <div className='absolute left-4 top-[72px] text-white/90 text-sm font-semibold z-10'>
        Taps: {count}
      </div>
    </div>
  );
}

/** Всплывающий "+1" в точке (x, y) — оптимизированный */
const PlusOne = memo(function PlusOne({ x, y }: { x: number; y: number }) {
  const jitterX = (Math.random() - 0.5) * 12;
  const jitterY = (Math.random() - 0.5) * 6;

  return (
    <motion.img
      initial={{ x: x + jitterX, y: y + jitterY, opacity: 0, scale: 0.9 }}
      animate={{ x: x + jitterX, y: y - 36, opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      src={coin}
      alt=''
      transition={{ duration: 0.8, ease: "easeOut" }}
      className='absolute -translate-x-1/2 -translate-y-1/2 select-none
                 w-[40px] h-[40px] font-extrabold text-white
                 transform-gpu will-change-transform
                 drop-shadow-[0_2px_6px_rgba(0,0,0,0.55)]'
      style={{ left: x, top: y }}
    />
  );
});
