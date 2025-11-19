import { useEffect, useState } from "react";
import CustomAvatar from "./CustomAvatar";
import { formatNumber } from "../../utils/formatedNumber";

type Leader = {
  id: string;
  name: string;
  score: number;
  avatar: string;
};

const UZ_NAMES = [
  "Azizbek",
  "Bahrom",
  "Davron",
  "Jasur",
  "Nodir",
  "Rustam",
  "Shohruh",
  "Umid",
  "Bekzod",
  "Farruh",
  "Otabek",
  "Mardon",
  "Shaxruz",
  "Yodgor",
  "Sardor",
  "Jahongir",
  "Ilhom",
  "Oybek",
  "Baxrom",
  "Anvar",
  "Doston",
  "Murod",
  "Ravshan",
  "Farrukh",
  "Komil",
  "Shokhrukh",
  "Zafar",
  "Ibrohim",
  "Zokir",
  "Bakhtiyor",
  "Samandar",
  "Shahboz",
  "Miraziz",
  "Elbek",
  "Tohir",
  "Javlon",
  "Odil",
  "Soliq",
  "Islom",
  "Rasul",
  "Sobir",
  "Yusuf",
  "Sherzod",
  "Bekzodbek",
  "Ilhomjon",
  "Shuxrat",
  "Ulugbek",
  "Qahramon",
];

// Расширенный список узбекских фамилий
const UZ_SURNAMES = [
  "Karimov",
  "Tursunov",
  "Mirzaev",
  "Islomov",
  "Rashidov",
  "Sobirov",
  "Ahmedov",
  "Ergashev",
  "Abdullaev",
  "Nazirov",
  "Sharipov",
  "Olimov",
  "Yusupov",
  "Zokirov",
  "Bakirov",
  "Jalilov",
  "Rakhimov",
  "Shukurov",
  "Sodiqov",
  "Qodirov",
  "Usmanov",
  "Yoqubov",
  "Xudoyberdiyev",
  "Anvarov",
  "Ravshanov",
  "Toshpulatov",
  "Hakimov",
  "Murodov",
  "Olimjonov",
];

// Генерация локальных узбекских лидеров
function generateUzLeaders(count: number): Leader[] {
  const leaders: Leader[] = [];
  for (let i = 0; i < count; i++) {
    const firstname = UZ_NAMES[i % UZ_NAMES.length];
    const lastname = UZ_SURNAMES[i % UZ_SURNAMES.length];
    const name = `${firstname} ${lastname}`;
    const id = `uz-${i}`;
    const score = Math.max(
      0,
      1000000 - i * 80 + Math.floor(Math.random() * 50)
    );
    const avatar = `https://api.dicebear.com/9.x/identicon/svg?seed=${encodeURIComponent(
      id
    )}&size=128`;
    leaders.push({ id, name, score, avatar });
  }
  return leaders.sort((a, b) => b.score - a.score);
}

type Props = {
  count?: number;
  autoSimulate?: boolean;
  simulateIntervalMs?: number;
};

export default function UzbekLeaderboard({
  count = 10,
  autoSimulate = false,
  simulateIntervalMs = 3000,
}: Props) {
  const [leaders, setLeaders] = useState<Leader[]>(() =>
    generateUzLeaders(count)
  );
  const [running] = useState<boolean>(autoSimulate);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setLeaders((prev) => {
        const next = prev.map((p) => ({ ...p }));
        const changes = Math.max(
          1,
          Math.floor(Math.random() * Math.min(3, next.length))
        );
        for (let i = 0; i < changes; i++) {
          const idx = Math.floor(Math.random() * next.length);
          const delta = Math.floor((Math.random() - 0.45) * 200);
          next[idx].score = Math.max(0, next[idx].score + delta);
        }
        next.sort((a, b) => b.score - a.score);
        for (let i = 1; i < next.length; i++) {
          if (next[i].score >= next[i - 1].score)
            next[i].score = Math.max(0, next[i - 1].score - 1);
        }
        return next;
      });
    }, simulateIntervalMs);
    return () => clearInterval(id);
  }, [running, simulateIntervalMs]);

  return (
    <div className='w-full max-w-md mx-auto rounded-lg px-2 py-3  bg-linear-to-br from-slate-900 via-indigo-900 to-purple-800   text-white max-h-[350px] overflow-y-scroll'>
      <div className='flex items-center justify-center mb-3'>
        <div>
          <div className='text-lg font-semibold text-center'>Rahbarlar</div>
          <div className='text-xs text-white/60'>Uzbekistan leaderboard</div>
        </div>
      </div>

      <ul className='space-y-3'>
        {leaders.map((p, idx) => {
          const place = idx + 1;
          const medal =
            place === 1 ? "🥇" : place === 2 ? "🥈" : place === 3 ? "🥉" : null;
          return (
            <li
              key={p.id}
              className='flex items-center gap-3 p-2 rounded bg-white/5'>
              <div className='w-5 text-center font-semibold'>{place}</div>
              <CustomAvatar />
              <div className='flex-1 min-w-0'>
                <div className='text-[12px] font-medium'>{p.name}</div>
              </div>
              <div className='flex items-center gap-2'>
                {medal && <div className='text-sm'>{medal}</div>}
                <div className='font-semibold tabular-nums'>
                  {formatNumber(p.score)}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
