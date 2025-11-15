import { useRef, useMemo } from "react";

// import Progress from "../components/progress/Progress";

import coin from "../assets/images/coin.webp";
import TouchableComp from "../components/airdrop/TouchableComp";

const layers = [10, 8, 6];

export default function AirDrop() {
  const wrapRef = useRef<HTMLDivElement | null>(null);

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

  return (
    <div
      ref={wrapRef}
      className='relative w-full h-full pt-2 space-y-4 flex-1 overflow-hidden pb-55 flex items-center justify-center'>
      {/* Прогресс бар */}
      {/* <Progress value={valueRef.current} height={12} max={1000} /> */}

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
