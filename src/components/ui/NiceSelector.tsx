import { useState, useCallback } from "react";
import { motion } from "framer-motion";

type Props = {
  count?: number;
  value?: number | null;
  onChange?: (n: number) => void;
  className?: string;
};

/**
 * NiceSelector — сетка кнопок с красивой анимацией и состоянием выбора.
 * - count: сколько кнопок (по умолчанию 14)
 * - value: контролируемое значение (номер, 1-based) или null
 * - onChange: callback при выборе
 */
export default function NiceSelector({
  count = 14,
  value = null,
  onChange,
  className = "",
}: Props) {
  const [selected, setSelected] = useState<number | null>(value ?? null);

  // обновляем локально и вызываем callback
  const handleSelect = useCallback(
    (n: number) => {
      setSelected(n);
      onChange?.(n);
    },
    [onChange]
  );

  // motion variants (shared)
  const btnVariants = {
    idle: { scale: 1, boxShadow: "0 8px 20px rgba(2,6,23,0.25)" },
    hover: { scale: 1.04 },
    tap: { scale: 0.98 },
    selected: {
      scale: 1.06,
      // border & glow are handled by style + animate below
    },
  };

  // color gradients per index (just to add variety)
  // const gradients = [
  //   "from-[#7C3AED] via-[#4F46E5] to-[#06B6D4]",
  //   "from-[#059669] via-[#10B981] to-[#34D399]",
  //   "from-[#F59E0B] via-[#F97316] to-[#FB923C]",
  //   "from-[#EF4444] via-[#F43F5E] to-[#EC4899]",
  // ];

  return (
    <div
      className={`flex items-center flex-wrap gap-3 justify-center ${className}`}>
      {Array.from({ length: count }).map((_, idx) => {
        const n = idx + 1;
        const isSelected = selected === n;
        // const grad = gradients[idx % gradients.length];
        return (
          <motion.button
            key={n}
            type='button'
            role='button'
            aria-pressed={isSelected}
            onClick={() => handleSelect(n)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleSelect(n);
              }
            }}
            variants={btnVariants}
            initial='idle'
            whileHover='hover'
            whileTap='tap'
            animate={isSelected ? "selected" : "idle"}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
            className={`
              relative inline-flex items-center justify-center
              px-3 py-2 rounded-lg text-sm font-semibold text-white 
              focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
              focus-visible:ring-white/30 border-2 border-[#24E6F3CC]
              select-none
            `}
            style={{
              // gradient background via inline style to combine with Tailwind-like strings
              background: isSelected
                ? // animated gradient for selected
                  `linear-gradient(135deg, ${
                    idx % 4 === 0
                      ? "#7C3AED"
                      : idx % 4 === 1
                      ? "#059669"
                      : idx % 4 === 2
                      ? "#F59E0B"
                      : "#EF4444"
                  }, rgba(255,255,255,0.04))`
                : `linear-gradient(135deg, rgba(255,255,255,0.5), rgba(255,255,255,0.5))`,
              boxShadow: isSelected
                ? `0 6px 18px ${
                    idx % 4 === 0
                      ? "rgba(124,58,237,0.18)"
                      : idx % 4 === 1
                      ? "rgba(5,150,105,0.18)"
                      : idx % 4 === 2
                      ? "rgba(245,158,11,0.16)"
                      : "rgba(239,68,68,0.16)"
                  }`
                : undefined,
              minWidth: 48,
              minHeight: 40,
            }}>
            {/* animated border/glow ring for selected */}
            <motion.span
              aria-hidden
              initial={{ opacity: 0, scale: 0.95 }}
              animate={
                isSelected
                  ? { opacity: 1, scale: 1 }
                  : { opacity: 0, scale: 0.95 }
              }
              transition={{ duration: 0.35, ease: "easeOut" }}
              style={{
                position: "absolute",
                inset: -2,
                borderRadius: 12,
                zIndex: 0,
                pointerEvents: "none",
                background: isSelected
                  ? `linear-gradient(90deg, ${
                      idx % 4 === 0
                        ? "#7C3AED66"
                        : idx % 4 === 1
                        ? "#05966966"
                        : idx % 4 === 2
                        ? "#F59E0B66"
                        : "#EF444466"
                    }, transparent 70%)`
                  : "transparent",
                filter: isSelected ? "blur(8px)" : "none",
                mixBlendMode: "screen",
              }}
            />

            {/* content */}
            <span
              style={{
                position: "relative",
                zIndex: 2,
                pointerEvents: "none",
              }}>
              {n}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}
