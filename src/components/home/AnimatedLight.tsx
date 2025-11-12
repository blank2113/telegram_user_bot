import { useEffect, useRef } from "react";
import light from "../../assets/images/light.png";
import bottom from "../../assets/images/bottom.png";

interface AnimatedImageProps {
  className?: string;
}

const AnimatedLight = ({ className }: AnimatedImageProps) => {
  const imgRef = useRef<HTMLImageElement>(null);
  const animationRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);

  useEffect(() => {
    const animate = (time: number) => {
      if (!imgRef.current) return;

      // Ограничиваем обновление ~60fps (каждые 16ms)
      if (time - lastTimeRef.current > 16) {
        lastTimeRef.current = time;

        // Мерцание с легкой случайностью для более живого эффекта
        const base = 0.3; // минимальная яркость
        const variance = Math.random() * 2.5; // до максимальной яркости
        imgRef.current.style.opacity = (base + variance).toString();
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationRef.current);
  }, []);

  return (
    <div className={"" + className}>
      <img
        ref={imgRef}
        src={light}
        alt='light'
        className='w-[70px] h-[70px]'
        style={{ willChange: "opacity", transition: "opacity 0.05s linear" }}
      />
      <img
        src={bottom}
        alt=''
        className='absolute -bottom-2.3 left-0 w-[50px]'
      />
    </div>
  );
};

export default AnimatedLight;
