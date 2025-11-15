import React, { useMemo } from "react";

type SnowfallProps = {
  count?: number; // количество снежинок
  className?: string;
};

const Snowfall: React.FC<SnowfallProps> = ({ count = 30, className = "" }) => {
  const flakes = useMemo(() => {
    return Array.from({ length: count }).map(() => {
      const size = Math.random() * 6 + 4; // 4-10px
      const left = Math.random() * 100;
      const duration = Math.random() * 8 + 6; // 6-14s
      const delay = Math.random() * 5; // случайная задержка
      const opacity = Math.random() * 0.5 + 0.3; // 0.3-0.8
      const sway = Math.random() * 30 - 15; // отклонение влево/вправо
      return { size, left, duration, delay, opacity, sway };
    });
  }, [count]);

  return (
    <div
      className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}
      aria-hidden>
      {flakes.map((flake, i) => (
        <span
          key={i}
          className='snowflake'
          style={
            {
              left: `${flake.left}%`,
              width: `${flake.size}px`,
              height: `${flake.size}px`,
              animationDuration: `${flake.duration}s`,
              animationDelay: `${flake.delay}s`,
              opacity: flake.opacity,
              "--sway": `${flake.sway}px`,
            } as React.CSSProperties
          }
        />
      ))}

      <style>{`
        .snowflake {
          position: absolute;
          top: -10px;
          border-radius: 50%;
          background: rgba(255,255,255,0.9);
          will-change: transform, opacity;
          animation-name: fallSway;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          pointer-events: none;
        }

        @keyframes fallSway {
          0% { transform: translateY(0) translateX(0); opacity: 0; }
          10% { opacity: 0.8; }
          100% { transform: translateY(100vh) translateX(var(--sway)); opacity: 0; }
        }

        @media (prefers-reduced-motion: reduce) {
          .snowflake {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Snowfall;
