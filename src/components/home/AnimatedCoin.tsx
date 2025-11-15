import { useEffect, useRef } from "react";
import coin from "../../assets/images/coin.webp";
import bottom from "../../assets/images/bottom.png";

interface AnimatedCoinProps {
  className?: string;
  bounceAmplitude?: number; // px
  bouncePeriod?: number; // ms
  rotateAmplitude?: number; // deg
  rotatePeriod?: number; // ms
}

const AnimatedCoinOptimized = ({
  className,
  bounceAmplitude = 10,
  bouncePeriod = 2000,
  rotateAmplitude = 9,
  rotatePeriod = 3600,
}: AnimatedCoinProps) => {
  const coinRef = useRef<HTMLImageElement | null>(null);
  const rafRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);

  useEffect(() => {
    const el = coinRef.current;
    if (!el) return;

    el.style.willChange = "transform";

    const loop = (time: number) => {
      // Ограничение обновления ~60fps
      if (time - lastTimeRef.current >= 16) {
        lastTimeRef.current = time;

        const tBounce = (time % bouncePeriod) / bouncePeriod;
        const tRotate = (time % rotatePeriod) / rotatePeriod;

        // Плавный bounce и rotate
        const translateY =
          -Math.abs(Math.sin(tBounce * Math.PI * 2)) * bounceAmplitude;
        const rotate = Math.sin(tRotate * Math.PI * 2) * rotateAmplitude;

        el.style.transform = `translateY(${translateY}px) rotate(${rotate}deg)`;
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

    return () => cancelAnimationFrame(rafRef.current);
  }, [bounceAmplitude, bouncePeriod, rotateAmplitude, rotatePeriod]);

  return (
    <div className={`relative ${className ?? ""}`}>
      <img
        ref={coinRef}
        src={coin}
        alt='coin'
        className='w-[55px] h-[55px] object-cover select-none pointer-events-none'
        style={{
          transformOrigin: "50% 50%",
        }}
        draggable={false}
      />
      <img
        src={bottom}
        alt=''
        className='absolute -bottom-1 left-0 w-[50px] pointer-events-none select-none'
        draggable={false}
      />
    </div>
  );
};

export default AnimatedCoinOptimized;
