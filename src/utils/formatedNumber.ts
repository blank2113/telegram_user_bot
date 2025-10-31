// utils/formatNumber.ts
export function formatNumber(
  n: number,
  opts: {
    threshold?: number; // после какого значения сокращать
    locale?: string; // "ru-RU" → "1,2 млн", "en-US" → "1.2M"
    maxFractionDigits?: number; // сколько знаков после запятой в компактном виде
  } = {}
) {
  const { threshold = 1_000_0, locale = "en-US", maxFractionDigits = 1 } = opts;

  if (Math.abs(n) >= threshold) {
    return new Intl.NumberFormat(locale, {
      notation: "compact",
      maximumFractionDigits: maxFractionDigits,
    }).format(n); // напр.: 900 млн, 1,2 млрд
  }
  // до порога показываем полностью с разделителями разрядов
  return new Intl.NumberFormat(locale).format(n); // напр.: 900 000 000
}
