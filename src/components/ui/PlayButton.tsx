// PlayButton.tsx
import React from "react";
import { motion } from "framer-motion";

type Props = {
  isSpinning?: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
  className?: string;
  disabled?: boolean;
};

export default function PlayButton({
  isSpinning = false,
  onClick,
  children = "O’ynash",
  className = "",
  disabled = false,
}: Props) {
  const isDisabled = disabled || isSpinning;

  return (
    <motion.button
      type='button'
      onClick={() => {
        if (isDisabled) return;
        onClick?.();
      }}
      whileTap={isDisabled ? {} : { scale: 0.98 }}
      whileHover={isDisabled ? {} : { scale: 1.02 }}
      animate={isSpinning ? { filter: "blur(1px)" } : { filter: "blur(0px)" }}
      transition={{ duration: 0.28 }}
      aria-busy={isSpinning}
      aria-disabled={isDisabled}
      disabled={isDisabled}
      className={[
        "relative inline-flex items-center justify-center select-none rounded-xl py-2 px-5 font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        // background
        "bg-linear-to-r from-amber-500 via-amber-400 to-amber-300 text-amber-900",
        // text + shadow
        "text-white shadow-lg",
        // disabled look
        isDisabled ? "opacity-80 cursor-not-allowed" : "cursor-pointer",
        // accessible focus ring
        "focus-visible:ring-amber-300 focus-visible:ring-opacity-80",
        className,
      ].join(" ")}>
      {/* glow background for selected/active look */}
      <span
        aria-hidden
        className='absolute inset-0 rounded-xl pointer-events-none'
        style={{
          boxShadow: isSpinning
            ? "0 8px 30px rgba(249,115,22,0.18)"
            : "0 8px 24px rgba(37,99,235,0.08)",
          mixBlendMode: "screen",
        }}
      />

      {/* left: spinner */}
      <span className='relative z-10 flex items-center gap-3'>
        {isSpinning ? (
          <>
            <svg
              className='animate-spin -ml-1 h-5 w-5 text-white/90'
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              aria-hidden='true'>
              <circle
                className='opacity-20'
                cx='12'
                cy='12'
                r='10'
                stroke='currentColor'
                strokeWidth='4'
              />
              <path
                className='opacity-100'
                fill='currentColor'
                d='M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z'
              />
            </svg>
            {/* <span className='text-sm'>
              {children === "O’ynash" ? "Aylanish..." : children}
            </span> */}
          </>
        ) : (
          <>
            {/* Play icon */}
            <svg
              className='h-5 w-5 text-white/95'
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 20 20'
              fill='currentColor'
              aria-hidden='true'>
              <path d='M4.5 3.5v13l11-6.5-11-6.5z' />
            </svg>
            <span className='text-sm'>{children}</span>
          </>
        )}
      </span>
    </motion.button>
  );
}
