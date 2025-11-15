import { useEffect, useRef } from "react";
import image from "../../assets/images/friends.webp";

const SIZE = 230;

const AnimatedFriendsImage = () => {
  const imgRef = useRef<HTMLImageElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    const el = imgRef.current;
    if (!el) return;

    el.style.willChange = "transform, opacity";
    el.style.transformOrigin = "50% 50%";
    el.style.transform = "translateY(0px)";
    el.style.opacity = "0";

    const loop = (time: number) => {
      if (!startTimeRef.current) startTimeRef.current = time;
      const elapsed = time - startTimeRef.current;

      // Плавное появление (fade-in)
      const fadeIn = Math.min(elapsed / 300, 1);
      el.style.opacity = fadeIn.toString();

      // Лёгкое колебание вверх-вниз
      const translateY = Math.sin(elapsed / 500) * 5; // амплитуда ±5px
      el.style.transform = `translateY(${translateY}px)`;

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, []);

  return (
    <div
      aria-hidden={false}
      style={{
        width: SIZE,
        height: SIZE,
        minWidth: SIZE,
        minHeight: SIZE,
        position: "relative",
        borderRadius: 12,
        overflow: "hidden",
        background:
          "linear-gradient(180deg, rgba(0,0,0,0.03), rgba(255,255,255,0.02))",
      }}>
      <div
        aria-hidden
        className='image-placeholder'
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 5,
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(0,0,0,0.03))",
          pointerEvents: "none",
        }}
      />

      <img
        ref={imgRef}
        src={image}
        alt=''
        loading='lazy'
        decoding='async'
        width={SIZE}
        height={SIZE}
        className='floating-image'
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
          borderRadius: 12,
          zIndex: 10,
          pointerEvents: "none",
        }}
        draggable={false}
      />
    </div>
  );
};

export default AnimatedFriendsImage;
