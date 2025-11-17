import { motion } from "framer-motion";
import { useRef, useCallback } from "react";
import touchAv from "../../assets/images/Touch.webp";
import coin from "../../assets/images/coin.webp";
import useClickStore from "../../store/clickStore";

const TouchableComp = () => {
  const avatarRef = useRef<HTMLImageElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const maxTotalLimit = useClickStore((s) => s.maxTotalLimit);

  // useEffect(() => {
  //   useClickStore
  //     .getState()
  //     .init({ endpoint: "/api/clicks", idleMs: 2000, maxRetries: 3 });
  // }, []);

  const handleTap = useCallback((e: React.MouseEvent) => {
    if (!avatarRef.current || !wrapperRef.current || !containerRef.current)
      return;

    const avatarRect = avatarRef.current.getBoundingClientRect();
    const wrapperRect = wrapperRef.current.getBoundingClientRect();

    // Проверяем клик по аватару
    if (
      e.clientX < avatarRect.left ||
      e.clientX > avatarRect.right ||
      e.clientY < avatarRect.top ||
      e.clientY > avatarRect.bottom
    )
      return;

    // координаты монетки
    const x = e.clientX - wrapperRect.left;
    const y = e.clientY - wrapperRect.top;

    const coinEl = document.createElement("img");
    coinEl.src = coin;
    coinEl.style.position = "absolute";
    coinEl.style.left = `${x}px`;
    coinEl.style.top = `${y}px`;
    coinEl.style.width = "40px"; // размер монетки
    coinEl.style.height = "40px";
    coinEl.style.transform = "translate(-50%, -50%) scale(1)";
    coinEl.style.pointerEvents = "none";
    coinEl.style.zIndex = "30";
    containerRef.current.appendChild(coinEl);

    // анимация монетки
    let start: number | null = null;
    const duration = 800;

    const animate = (time: number) => {
      if (!start) start = time;
      const t = time - start;
      const progress = t / duration;

      coinEl.style.transform = `translate(-50%, ${
        -50 - progress * 60
      }px) scale(${1 + 0.3 * progress})`;
      coinEl.style.opacity = `${1 - progress}`;

      if (t < duration) {
        requestAnimationFrame(animate);
      } else {
        containerRef.current?.removeChild(coinEl);
      }
    };
    requestAnimationFrame(animate);

    useClickStore.getState().registerClick(1);
    // scale аватара
    avatarRef.current.style.transform = "scale(1.1)";
    setTimeout(() => {
      avatarRef.current && (avatarRef.current.style.transform = "scale(1)");
    }, 100);
  }, []);

  return (
    <div
      ref={wrapperRef}
      className='relative w-full h-screen'
      onClick={handleTap}>
      <div ref={containerRef} className='absolute inset-0 w-full h-full' />

      <motion.img
        ref={avatarRef}
        src={touchAv}
        alt=''
        className='absolute bottom-0 left-1/2 -translate-x-1/2 w-auto h-[clamp(230px,52svh,320px)] max-w-[90vw] select-none z-20 cursor-pointer'
        draggable={false}
        decoding='async'
      />
    </div>
  );
};

export default TouchableComp;
