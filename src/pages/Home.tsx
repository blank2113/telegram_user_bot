import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Progress from "../components/progress/Progress";
import touchAv from "../assets/icons/touchAv.svg";
// import coin from "../assets/icons/coin.svg";

const STEP = 1;
type Pop = { id: number; x: number; y: number };

export default function Home() {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const avatarRef = useRef<HTMLImageElement | null>(null);
  const lastTapRef = useRef(0);

  const avatarRectRef = useRef<DOMRect | null>(null);
  const wrapRectRef = useRef<DOMRect | null>(null);

  const [count, setCount] = useState(0);
  const [value, setValue] = useState(45);
  const [_, setPops] = useState<Pop[]>([]);

  // Обновление размеров wrapper и avatar через ResizeObserver (кэшируем DOMRect)
  useEffect(() => {
    const roAvatar = new ResizeObserver(() => {
      if (avatarRef.current)
        avatarRectRef.current = avatarRef.current.getBoundingClientRect();
    });
    const roWrap = new ResizeObserver(() => {
      if (wrapRef.current)
        wrapRectRef.current = wrapRef.current.getBoundingClientRect();
    });

    if (avatarRef.current) {
      avatarRectRef.current = avatarRef.current.getBoundingClientRect();
      roAvatar.observe(avatarRef.current);
    }
    if (wrapRef.current) {
      wrapRectRef.current = wrapRef.current.getBoundingClientRect();
      roWrap.observe(wrapRef.current);
    }

    const onWindowResize = () => {
      if (avatarRef.current)
        avatarRectRef.current = avatarRef.current.getBoundingClientRect();
      if (wrapRef.current)
        wrapRectRef.current = wrapRef.current.getBoundingClientRect();
    };
    window.addEventListener("resize", onWindowResize);

    return () => {
      roAvatar.disconnect();
      roWrap.disconnect();
      window.removeEventListener("resize", onWindowResize);
    };
  }, []);

  // Добавляет pop и удаляет через 900ms
  const spawnPop = useCallback((x: number, y: number) => {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    setPops((arr) => {
      const next = [...arr.slice(-9), { id, x, y }]; // максимум 10
      return next;
    });
    // удаляем через время
    setTimeout(() => {
      setPops((arr) => arr.filter((p) => p.id !== id));
    }, 900);
  }, []);

  const handlePointer = useCallback(
    (e: React.PointerEvent) => {
      // throttle taps
      const now = performance.now();
      if (now - lastTapRef.current < 120) return;
      lastTapRef.current = now;

      // обновляем счётчики
      setCount((c) => c + 1);
      setValue((v) => Math.min(1000, v + STEP));

      // вычисляем координаты для попа
      // 1) если есть cached avatarRect — класть около центра аватара
      // 2) иначе — использовать координаты касания внутри wrapper
      const wrapRect =
        wrapRectRef.current ?? wrapRef.current?.getBoundingClientRect() ?? null;
      const avatarRect =
        avatarRectRef.current ??
        avatarRef.current?.getBoundingClientRect() ??
        null;

      if (!wrapRect) return;

      let x: number;
      let y: number;

      if (avatarRect) {
        // позиция чуть выше центра аватара (как было в оригинале)
        x = avatarRect.left + avatarRect.width / 2 - wrapRect.left;
        y = avatarRect.top + avatarRect.height * 0.25 - wrapRect.top; // чуть выше центра
      } else {
        // если нет avatarRect, используем позицию указателя
        x = e.clientX - wrapRect.left;
        y = e.clientY - wrapRect.top;
      }

      spawnPop(x, y);
    },
    [spawnPop]
  );

  return (
    <div
      ref={wrapRef}
      className='relative w-full h-full py-2 space-y-4 flex-1 overflow-hidden'>
      <Progress value={value} height={12} max={1000} />

      {/* слой с "+1" поверх всего */}
      {/* <div className='pointer-events-none absolute inset-0 z-30'>
        {pops.map((p) => (
          <PlusOne key={p.id} x={p.x} y={p.y} />
        ))}
      </div> */}

      {/* Тап-таргет по центру снизу */}
      <motion.button
        type='button'
        onPointerDown={handlePointer}
        className='absolute left-1/2 bottom-[100px] -translate-x-1/2 focus:outline-none'
        whileTap={{ scale: 0.95 }}
        aria-label='Tap to increase'>
        <span className='absolute inset-0 -z-10 blur-xl rounded-full bg-cyan-300/30' />
        <motion.img
          ref={avatarRef}
          src={touchAv}
          alt=''
          className='w-auto h-[clamp(320px,62svh,520px)] max-w-[90vw] select-none pointer-events-none'
          initial={{ scale: 0.98, rotate: -1, opacity: 0.95 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{ duration: 0.28, ease: "easeOut" }}
          draggable={false}
          decoding='async'
        />
      </motion.button>

      <div className='absolute left-4 top-[72px] text-white/90 text-sm font-semibold z-10'>
        Taps: {count}
      </div>
    </div>
  );
}

/** Всплывающий "+1" в точке (x, y) — оптимизированный */
// const PlusOne = memo(function PlusOne({ x, y }: { x: number; y: number }) {
//   const jitterX = (Math.random() - 0.5) * 12;
//   const jitterY = (Math.random() - 0.5) * 6;

//   return (
//     <motion.img
//       initial={{ x: x + jitterX, y: y + jitterY, opacity: 0, scale: 0.9 }}
//       animate={{ x: x + jitterX, y: y - 36, opacity: 1, scale: 1 }}
//       exit={{ opacity: 0 }}
//       src={coin}
//       alt=''
//       transition={{ duration: 0.8, ease: "easeOut" }}
//       className='absolute -translate-x-1/2 -translate-y-1/2 select-none
//                  w-[40px] h-[40px] font-extrabold text-white
//                  transform-gpu will-change-transform
//                  drop-shadow-[0_2px_6px_rgba(0,0,0,0.55)]'
//       style={{ left: x, top: y }}
//     />
//   );
// });
