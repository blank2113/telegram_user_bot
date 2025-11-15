import { useEffect, useRef, useState } from "react";
import image from "../../assets/images/home_main_img.webp";

const SIZE = 230;

const AnimatedImageNoJump = () => {
  const imgRef = useRef<HTMLImageElement | null>(null);
  const animRef = useRef<number>(0);
  const startRef = useRef<number | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const step = (time: number) => {
      if (!startRef.current) startRef.current = time;
      const elapsed = time - startRef.current;

      const y = Math.sin(elapsed / 500) * 5;
      const rotate = Math.sin(elapsed / 1000) * 6; // чуть поменьше для аккуратности

      if (imgRef.current) {
        imgRef.current.style.transform = `translateY(${y}px) rotate(${rotate}deg)`;
      }

      animRef.current = requestAnimationFrame(step);
    };

    animRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animRef.current);
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
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 10,
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(0,0,0,0.03))",
          transition: "opacity 300ms ease, filter 300ms ease",
          opacity: loaded ? 0 : 1,
          filter: loaded ? "blur(0px)" : "blur(6px)",
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
        onLoad={() => setLoaded(true)}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
          transformOrigin: "50% 50%",
          transition: "filter 300ms ease, opacity 300ms ease",
          willChange: "transform",
          borderRadius: 12,
          opacity: loaded ? 1 : 0.38,
          filter: loaded ? "none" : "blur(10px)",
          zIndex: 10,
        }}
      />
    </div>
  );
};

export default AnimatedImageNoJump;
