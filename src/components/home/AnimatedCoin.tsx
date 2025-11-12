import { useEffect, useRef } from "react";
import coin from "../../assets/images/hcoin.png";
import bottom from "../../assets/images/bottom.png";

interface AnimatedCoinProps {
  className?: string;
  // настройка амплитуды/скорости при необходимости
  bounceAmplitude?: number; // px
  bouncePeriod?: number; // ms
  rotateAmplitude?: number; // deg
  rotatePeriod?: number; // ms
}

const AnimatedCoin = ({
  className,
  bounceAmplitude = 5,
  bouncePeriod = 2000,
  rotateAmplitude = 9,
  rotatePeriod = 3600,
}: AnimatedCoinProps) => {
  const ref = useRef<HTMLImageElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastRef = useRef<number>(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Используем will-change + transform — это даёт GPU-ускорение
    el.style.willChange = "transform, opacity";

    const loop = (time: number) => {
      // ограничим обновления ~60fps (каждые ~16ms)
      if (time - lastRef.current >= 16) {
        lastRef.current = time;

        // нормализуем время в миллисекундах
        const t = time;

        // Плавный подпрыг: синус, но с фазой чтобы выглядело естественно
        const bounce =
          Math.sin((t / bouncePeriod) * Math.PI * 2) * bounceAmplitude;

        // Мягкое покачивание по оси Z (rotate)
        const rot =
          Math.sin((t / rotatePeriod) * Math.PI * 2) * rotateAmplitude;

        // Немного дополнительных микродвижений (для живости)
        const micro =
          Math.sin((t / 230) * Math.PI * 2) * 0.6 +
          Math.cos((t / 370) * Math.PI * 2) * 0.6;

        // Собираем финальную трансформацию
        // translateY: отрицательное — вверх
        const translateY = -Math.abs(bounce) + micro * 0.6;
        const rotate = rot + micro * 0.15;

        el.style.transform = `translateY(${translateY}px) rotate(${rotate}deg)`;
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [bounceAmplitude, bouncePeriod, rotateAmplitude, rotatePeriod]);

  return (
    <div className={className}>
      <img
        ref={ref}
        src={coin}
        alt='coin'
        className='w-[60px] h-[60px] object-cover'
        // блокируем pointer-events только если нужно
        style={{
          display: "block",
          transformOrigin: "50% 50%",
          // небольшая CSS-плавность при резких сменах (не мешает rAF)
          transition: "filter 120ms linear",
          willChange: "transform",
        }}
      />
      <img
        src={bottom}
        alt=''
        className='absolute -bottom-1 left-1.5 w-[50px]'
      />
    </div>
  );
};

export default AnimatedCoin;
