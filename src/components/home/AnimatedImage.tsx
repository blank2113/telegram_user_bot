import { useEffect, useRef } from "react";
import image from "../../assets/images/img1.png";

const AnimatedImage = () => {
  const imgRef = useRef<HTMLImageElement>(null);
  const animationRef = useRef<number>(0);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    const animate = (time: number) => {
      if (!startTimeRef.current) startTimeRef.current = time;
      const elapsed = time - startTimeRef.current;

      const y = Math.sin(elapsed / 500) * 5; // +-10px
      const rotate = Math.sin(elapsed / 1000) * 5; // +-5deg

      if (imgRef.current) {
        imgRef.current.style.transform = `translateY(${y}px) rotate(${rotate}deg)`;
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationRef.current);
  }, []);

  return (
    <img
      ref={imgRef}
      src={image}
      alt=''
      className='w-[230px] h-[230px] object-contain'
      style={{
        willChange: "transform", // GPU оптимизация
      }}
    />
  );
};

export default AnimatedImage;
