import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Progress from "../components/progress/Progress";
import touchAv from "../assets/icons/touchAv.svg";

const STEP = 1;

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  ttl: number;
  size: number;
  rot: number;
  alpha: number;
};
type User = {
  id?: number;
  first_name?: string;
  username?: string;
  [k: string]: any;
};

export default function Home() {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const avatarRef = useRef<HTMLImageElement | null>(null);

  const [count, setCount] = useState(0);
  const [value, setValue] = useState(45);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const WebApp = window?.Telegram?.WebApp;
    if (!WebApp) {
      console.warn("Telegram WebApp not available");
      return;
    }

    WebApp.ready();

    // Если хочешь использовать initData в дальнейшем — получаем её:
    // const initData = WebApp.initData ?? null;
    const unsafe = WebApp.initDataUnsafe ?? {};

    // На UI можно показывать предварительные данные (unsafe) — это только UX
    let userObj: any = unsafe.user ?? null;
    if (typeof userObj === "string") {
      try {
        userObj = JSON.parse(userObj);
      } catch {
        // ignore
      }
    }

    if (userObj) setUser(userObj);
    // Если позже используешь initData — оставь её; если нет — подчисти:
    // (если пока не используешь initData, можно закомментировать объявление выше)
  }, []);
  // particles are stored in ref to avoid React re-renders
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number | null>(null);
  const lastTsRef = useRef<number | null>(null);

  // cached rects
  const wrapRectRef = useRef<DOMRect | null>(null);
  const avatarRectRef = useRef<DOMRect | null>(null);

  // detect low-end device heuristics
  const isLowEndRef = useRef<boolean>(false);
  useEffect(() => {
    const hw = (navigator as any).hardwareConcurrency || 4;
    const deviceMemory = (navigator as any).deviceMemory || 4; // may be undefined
    isLowEndRef.current = hw <= 2 || deviceMemory <= 1;
  }, []);

  // resize canvas when wrapper changes size
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    const resize = () => {
      const canvas = canvasRef.current;
      const wrap = wrapRef.current;
      if (!canvas || !wrap) return;
      const rect = wrap.getBoundingClientRect();
      const dpr = Math.max(1, window.devicePixelRatio || 1);
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // cache wrapper rect for pointer coords
      wrapRectRef.current = rect;
      // cache avatar rect if present
      if (avatarRef.current)
        avatarRectRef.current = avatarRef.current.getBoundingClientRect();
    };

    resize();
    const ro = new ResizeObserver(resize);
    if (wrapRef.current) ro.observe(wrapRef.current);
    if (avatarRef.current) ro.observe(avatarRef.current);

    window.addEventListener("resize", resize);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", resize);
    };
  }, []);

  useEffect(() => {
    const tick = (ts: number) => {
      const canvas = canvasRef.current;
      if (!canvas) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      if (lastTsRef.current == null) lastTsRef.current = ts;
      const dt = Math.min(40, ts - lastTsRef.current);
      lastTsRef.current = ts;

      const w = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, w, h);

      const arr = particlesRef.current;

      for (let i = arr.length - 1; i >= 0; i--) {
        const p = arr[i];
        p.life -= dt;
        if (p.life <= 0) {
          arr.splice(i, 1);
          continue;
        }

        p.vy += -0.03 * (dt / 16); // small upward "lift"
        p.x += p.vx * (dt / 16);
        p.y += p.vy * (dt / 16);

        p.alpha = Math.max(0, p.life / p.ttl);

        // draw simple circle (fast) — avoids image decoding overhead on weak devices
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.fillStyle = "rgba(255,215,0,1)"; // gold-ish
        ctx.arc(p.x, p.y, p.size / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // limit particles for safety
      const maxParticles = isLowEndRef.current ? 40 : 120;
      if (arr.length > maxParticles) {
        arr.splice(0, arr.length - maxParticles);
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      lastTsRef.current = null;
    };
  }, []);

  // lightweight spawn function (no setState)
  const spawnParticles = useCallback((clientX: number, clientY: number) => {
    const wrapRect =
      wrapRectRef.current ?? wrapRef.current?.getBoundingClientRect();
    if (!wrapRect) return;
    const insideX = clientX - wrapRect.left;
    const insideY = clientY - wrapRect.top;

    const low = isLowEndRef.current;
    const N = low ? 3 : 6; // fewer particles on low-end
    const baseSize = Math.max(8, Math.min(28, wrapRect.width * 0.03));

    for (let i = 0; i < N; i++) {
      const angle = (Math.random() - 0.5) * Math.PI * 0.7;
      const speed = (0.6 + Math.random() * 1.1) * (low ? 0.7 : 1);
      const p: Particle = {
        x: insideX + (Math.random() - 0.5) * 8,
        y: insideY + (Math.random() - 0.5) * 6,
        vx: Math.cos(angle) * speed * (1 + Math.random() * 0.6),
        vy: -Math.abs(Math.sin(angle) * speed * (0.6 + Math.random())),
        life: 700 + Math.random() * 300,
        ttl: 700 + Math.random() * 300,
        size: baseSize * (0.6 + Math.random() * 0.9),
        rot: (Math.random() - 0.5) * 0.8,
        alpha: 1,
      };
      particlesRef.current.push(p);
    }

    // safety cap even if spawns frequent
    const cap = low ? 60 : 200;
    if (particlesRef.current.length > cap) {
      particlesRef.current.splice(0, particlesRef.current.length - cap);
    }
  }, []);

  // pointer handler — extremely light: update two states + call spawnParticles
  const lastTapRef = useRef(0);
  const handlePointer = useCallback(
    (e: React.PointerEvent) => {
      const now = performance.now();
      if (now - lastTapRef.current < 100) return; // quick throttle
      lastTapRef.current = now;

      // local count state updates (batched)
      setCount((c) => c + 1);
      setValue((v) => Math.min(1000, v + STEP));

      // compute spawn location: prefer avatar center if available
      const avatarRect = avatarRef.current?.getBoundingClientRect();
      const wrapRect =
        wrapRectRef.current ?? wrapRef.current?.getBoundingClientRect();
      if (!wrapRect) return;

      if (avatarRect) {
        // place above avatar center (like original)
        const x = avatarRect.left + avatarRect.width / 2;
        const y = avatarRect.top + avatarRect.height * 0.28;
        spawnParticles(x, y);
      } else {
        spawnParticles(e.clientX, e.clientY);
      }
    },
    [spawnParticles]
  );

  return (
    <div
      ref={wrapRef}
      className='relative w-full h-full py-2 space-y-4 flex-1 overflow-hidden'>
      <Progress value={value} height={12} max={1000} />

      <p>{user?.first_name}</p>
      {/* canvas overlay для частиц */}
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 30,
          pointerEvents: "none", // не мешает кликам
        }}
      />

      {/* Тап-таргет по центру снизу */}
      <motion.button
        type='button'
        onPointerDown={handlePointer}
        className='absolute left-1/2 bottom-[100px] -translate-x-1/2 focus:outline-none'
        whileTap={{ scale: 0.95 }}
        aria-label='Tap to increase'>
        <span className='absolute inset-0 -z-10 blur-xl rounded-full bg-cyan-300/30' />
        <motion.img
          ref={avatarRef}
          src={touchAv}
          alt=''
          className='w-auto h-[clamp(320px,62svh,520px)] max-w-[90vw] select-none pointer-events-none'
          initial={{ scale: 0.98, rotate: -1, opacity: 0.95 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{ duration: 0.28, ease: "easeOut" }}
          draggable={false}
          decoding='async'
        />
      </motion.button>

      <div className='absolute left-4 top-[72px] text-white/90 text-sm font-semibold z-10'>
        Taps: {count}
      </div>
    </div>
  );
}
