import { useEffect, useRef, type FC } from "react";
import friends from "../../assets/images/friends.png";

interface AnimatedFriendsProps {
  className?: string;
  floatAmplitude?: number;
  floatPeriod?: number;
  rotateAmplitude?: number;
  rotatePeriod?: number;
  pulseAmplitude?: number;
  pulsePeriod?: number;
}

const AnimatedFriendsImage: FC<AnimatedFriendsProps> = ({
  className,
  floatAmplitude = 10,
  floatPeriod = 3000,
  rotateAmplitude = 2,
  rotatePeriod = 3000,
  pulseAmplitude = 0.09,
  pulsePeriod = 3000,
}) => {
  const imgRef = useRef<HTMLImageElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastRef = useRef<number>(0);

  useEffect(() => {
    const el = imgRef.current;
    if (!el) return;

    el.style.willChange = "transform, opacity";
    el.style.transformOrigin = "50% 50%";

    const loop = (time: number) => {
      if (time - lastRef.current >= 16) {
        lastRef.current = time;

        const t = time;

        const float =
          Math.sin((t / floatPeriod) * Math.PI * 2) * floatAmplitude;
        const rot =
          Math.sin((t / rotatePeriod) * Math.PI * 2) * rotateAmplitude;
        const pulse =
          1 + Math.sin((t / pulsePeriod) * Math.PI * 2) * pulseAmplitude;
        const micro = Math.sin((t / 230) * Math.PI * 2) * 0.4;

        const translateY = -float + micro * 0.4;
        const rotate = rot + micro * 0.2;
        const scale = pulse + micro * 0.003;

        el.style.transform = `translateY(${translateY.toFixed(
          2
        )}px) rotate(${rotate.toFixed(2)}deg) scale(${scale.toFixed(4)})`;
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [
    floatAmplitude,
    floatPeriod,
    rotateAmplitude,
    rotatePeriod,
    pulseAmplitude,
    pulsePeriod,
  ]);

  return (
    <img
      ref={imgRef}
      src={friends}
      alt='friends'
      className={className ?? "max-w-[250px] w-full h-auto object-contain"}
      style={{
        willChange: "transform",
        transition: "filter 120ms linear",
        display: "block",
      }}
    />
  );
};

export default AnimatedFriendsImage;
