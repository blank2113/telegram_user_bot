import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { createPortal } from "react-dom";
import {
  motion,
  AnimatePresence,
  type Variants,
  type Transition,
} from "framer-motion";

type Types = {
  open: boolean;
  setOpen: (value: boolean) => void;
  component: ReactNode;
};

// явно типизированный transition
const springTransition: Transition = {
  type: "spring",
  stiffness: 450,
  damping: 40,
  mass: 1,
};

// Variants типизированы как Variants
const overlayVariant: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modalVariant: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: springTransition, // <- тут теперь корректный тип
  },
  exit: {
    opacity: 0,
    y: 10,
    scale: 0.995,
    transition: { duration: 0.18, ease: "easeInOut" },
  },
};

const CustomPopup = ({ open = true, setOpen, component }: Types) => {
  const contentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev || "";
    };
  }, [open]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className='fixed inset-0 z-9999 flex items-center justify-center'
          onMouseDown={() => setOpen(false)}
          aria-modal='true'
          role='dialog'
          initial='hidden'
          animate='visible'
          exit='hidden'>
          <motion.div
            className='absolute inset-0 bg-[#00000066] backdrop-blur-sm'
            variants={overlayVariant}
            initial='hidden'
            animate='visible'
            exit='hidden'
            transition={{ duration: 0.22, ease: "linear" }}
            onMouseDown={() => setOpen(false)}
            aria-hidden='true'
          />

          <motion.div
            ref={contentRef}
            className='relative z-50 bg-[#FFFFFF55] p-4 shadow-2xl max-w-[90vw] w-full rounded-xl'
            variants={modalVariant}
            initial='hidden'
            animate='visible'
            exit='exit'
            onMouseDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
            tabIndex={-1}
            onAnimationComplete={() => {
              contentRef.current?.focus();
            }}
            style={{ willChange: "transform, opacity" }}>
            {component}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default CustomPopup;
