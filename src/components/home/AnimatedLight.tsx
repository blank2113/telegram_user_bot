import { useEffect, useRef } from "react";
import light from "../../assets/images/light.webp";
import bottom from "../../assets/images/bottom.png";

interface AnimatedLightProps {
  className?: string;
}

const AnimatedLightOptimized = ({ className }: AnimatedLightProps) => {
  const imgRef = useRef<HTMLImageElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const el = imgRef.current;
    if (!el) return;

    el.style.willChange = "opacity";

    const animate = (time: number) => {
      const t = time / 300;
      const opacity = 0.3 + Math.abs(Math.sin(t)) * 0.7; // 0.3–1.0
      el.style.opacity = opacity.toString();

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <div className={`relative ${className ?? ""}`}>
      <img
        ref={imgRef}
        src={light}
        alt='light'
        className='w-[55px] h-[55px] select-none pointer-events-none'
        style={{ transformOrigin: "50% 50%" }}
        draggable={false}
      />
      <img
        src={bottom}
        alt=''
        className='absolute -bottom-3.5 -left-1 w-[50px] pointer-events-none select-none'
        draggable={false}
      />
    </div>
  );
};

export default AnimatedLightOptimized;
