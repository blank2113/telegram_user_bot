// Progress.tsx
type Props = {
  value: number; // текущее значение
  max?: number; // максимум шкалы (по умолчанию 100)
  height?: number; // высота в px (по умолчанию 10)
};
export default function Progress({ value, max = 100, height = 10 }: Props) {
  const safeMax = Math.max(1, max); // защита от 0/отрицательных
  const clamped = Math.max(0, Math.min(safeMax, value));
  const pct = (clamped / safeMax) * 100;

  return (
    <div
      className='relative w-full overflow-hidden rounded-full bg-[#1a2745]/70'
      style={{ height }}
      role='progressbar'
      aria-valuemin={0}
      aria-valuemax={safeMax}
      aria-valuenow={clamped}>
      {/* внутренняя дорожка */}
      <div className='absolute inset-y-0 left-0 right-0 my-[2px] rounded-full bg-white/10' />

      {/* заполнение */}
      <div
        className='relative h-full rounded-full transition-[width] duration-500 ease-out overflow-hidden'
        style={{
          width: `${pct}%`,
          // чтобы «носик» оставался круглым на маленьких значениях:
          minWidth: clamped > 0 ? height : 0,
          background: "linear-gradient(90deg,#7DF1F6 0%,#3BD7E6 100%)",
        }}>
        <div
          className='absolute inset-0 opacity-40'
          style={{
            background:
              "repeating-linear-gradient(135deg, rgba(255,255,255,0.5) 0 10px, rgba(255,255,255,0) 10px 20px)",
            backgroundSize: "200px 100%",
            animation: "progress-stripes 1.6s linear infinite",
            boxShadow:
              "inset 0 1px 0 rgba(255,255,255,0.35), inset 0 -1px 0 rgba(0,0,0,0.2)",
          }}
        />
      </div>
    </div>
  );
}
