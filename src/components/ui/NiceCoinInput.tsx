import React, { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Props = {
  value: number | null;
  onChange?: (n: number) => void;
  min?: number; // minimal allowed value (default 50)
  max?: number | null;
  step?: number;
  presets?: number[]; // quick pick buttons
  placeholder?: string;
  className?: string;
};

export default function NiceCoinInput({
  value: controlledValue,
  onChange,
  min = 5000,
  max = null,
  step = 10,
  presets = [5000, 100000, 200000],
  placeholder = "sizning tikishingiz?",
  className = "",
}: Props) {
  const isControlled = typeof controlledValue === "number";
  const [internal, setInternal] = useState<number>(controlledValue ?? min);
  const [text, setText] = useState<string>((controlledValue ?? min).toString());
  const [error, setError] = useState<string | null>(null);

  // keep internal in sync if controlled
  useEffect(() => {
    if (isControlled) {
      setInternal(controlledValue as number);
      setText(String(controlledValue));
      setError(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [controlledValue]);

  const clamp = useCallback(
    (n: number) => {
      let v = Number.isFinite(n) ? Math.round(n) : min;
      if (v < min) v = min;
      if (max !== null && typeof max === "number" && v > max) v = max;
      return v;
    },
    [min, max]
  );

  const commit = useCallback(
    (raw: string) => {
      if (raw.trim() === "") {
        setText(String(internal));
        setError(null);
        return;
      }
      const parsed = Number(raw.replace(/[^\d-]/g, ""));
      if (!Number.isFinite(parsed) || isNaN(parsed)) {
        setError("Iltimos son kiriting");
        setText(String(internal));
        return;
      }
      const clamped = clamp(parsed);
      setInternal(clamped);
      setText(String(clamped));
      setError(null);
      onChange?.(clamped);
    },
    [clamp, internal, onChange]
  );

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    // allow only digits
    if (/^[0-9]*$/.test(v) || v === "") {
      setText(v);
      setError(null);
    }
  };

  const handleBlur = () => commit(text);

  const changeBy = (delta: number) => {
    const next = clamp(
      (isControlled ? (controlledValue as number) : internal) + delta
    );
    if (!isControlled) {
      setInternal(next);
      setText(String(next));
    }
    onChange?.(next);
    setError(null);
  };

  const handlePreset = (n: number) => {
    const next = clamp(n);
    if (!isControlled) {
      setInternal(next);
      setText(String(next));
    }
    onChange?.(next);
    setError(null);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      commit(text);
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      changeBy(step);
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      changeBy(-step);
    }
  };

  return (
    <div className={`w-full max-w-md mx-auto ${className}`}>
      <label className='block text-[16px] bg-purple-700 text-white rounded-md mb-2 font-semibold text-center py-1'>
        Tikish (monet)
      </label>

      <div className='flex items-center gap-3'>
        <button
          type='button'
          aria-label={`kamaytir ${step}`}
          onClick={() => changeBy(-step)}
          className='text-white text-xl inline-flex items-center justify-center rounded-md px-4 py-2 bg-white/45 active:bg-white/30 transition focus:outline-none border-2 border-[#24E6F3CC]'>
          −
        </button>

        <div className='flex-1'>
          <input
            inputMode='numeric'
            pattern='\d*'
            value={text}
            onChange={handleInput}
            onBlur={handleBlur}
            onKeyDown={onKeyDown}
            aria-invalid={!!error}
            aria-describedby={error ? "coin-error" : undefined}
            placeholder={placeholder}
            className={`w-full bg-linear-to-r text-xl from-white/20 to-white/50 placeholder-white/90 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-white/20 transition shadow-sm`}
            style={{
              fontVariantNumeric: "tabular-nums",
              textAlign: "center",
              fontWeight: 600,
            }}
          />
        </div>

        <button
          type='button'
          aria-label={`ko'paytir ${step}`}
          onClick={() => changeBy(step)}
          className='text-white text-xl inline-flex items-center justify-center rounded-md px-4 py-2 bg-white/45 active:bg-white/30 transition focus:outline-none border-2 border-[#24E6F3CC]'>
          +
        </button>
      </div>

      <div className='flex items-center gap-2 mt-3 flex-wrap justify-center'>
        {presets.map((p) => (
          <button
            key={p}
            type='button'
            onClick={() => handlePreset(p)}
            className='px-3 py-1.5 rounded-3xl text-md font-medium bg-white/50 hover:bg-white/12 transition text-white/90'>
            {p}
          </button>
        ))}
      </div>

      <AnimatePresence>
        {error ? (
          <motion.div
            id='coin-error'
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            className='mt-2 text-sm text-yellow-300'>
            {error}
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div className='mt-2 text-xl text-purple-600 text-center font-semibold'>
        Minimal: <span className='font-medium'>{min}</span> monet
        {max ? (
          <>
            , Maksimal: <span className='font-medium'>{max}</span>
          </>
        ) : null}
      </div>
    </div>
  );
}
