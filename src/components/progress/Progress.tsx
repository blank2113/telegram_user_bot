import useClickStore from "../../store/clickStore";
import useAuthStore from "../../store/authStore";

type Props = {
  max?: number; // максимум шкалы (по умолчанию 100)
  height?: number; // высота в px (по умолчанию 10)
};

export default function Progress({ height = 10 }: Props) {
  const total = useClickStore((s) => s.total);
  const user = useAuthStore((s) => s.user);

  let value = total;

  const maxTotalLimit = Number(user?.maxTotalLimit ? 1000 : 0); // дефолт 1000 если лимит есть
  const safeMax = Math.max(1, maxTotalLimit);

  // Проверка на 12 часов с момента установки лимита
  if (user?.maxTotalLimit) {
    const limitDate = new Date(user.maxTotalLimit);
    const now = new Date();
    const hoursDiff = (now.getTime() - limitDate.getTime()) / (1000 * 60 * 60);

    if (hoursDiff < 12) {
      value = safeMax; // шкала заполнена полностью
    }
  }

  const clamped = Math.max(0, Math.min(safeMax, value));
  const pct = (clamped / safeMax) * 100;

  return (
    <div
      className='absolute top-1 w-full overflow-hidden rounded-full bg-[#1a2745]/70'
      style={{ height }}
      role='progressbar'
      aria-valuemin={0}
      aria-valuemax={safeMax}
      aria-valuenow={clamped}>
      {/* внутренняя дорожка */}
      <div className='absolute inset-y-0 left-0 right-0 my-0.5 rounded-full bg-white/10' />

      {/* заполнение */}
      <div
        className='relative h-full rounded-full transition-[width] duration-500 ease-out overflow-hidden'
        style={{
          width: `${pct}%`,
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
