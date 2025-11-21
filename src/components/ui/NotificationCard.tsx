import type { FC } from 'react';
import { motion } from 'framer-motion';
import Bell from '../../assets/icons/bell.svg';

interface RewardCardProps {
  amount: number;
  label: string;
  time: string;
  onClick?: () => void;
}

export const NotificationCard: FC<RewardCardProps> = ({
  amount,
  label,
  time,
  onClick,
}) => {
  return (
    <motion.div
      onClick={onClick}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileTap={{ scale: 0.97 }}
      className="
        w-full relative overflow-hidden
        bg-[#3B8FAD]/70
        p-4
        flex items-center
        backdrop-blur-md
      "
    >
      {/* Иконка слева */}
      <img
        src={Bell}
        alt="reward icon"
        className="w-14 h-14 object-contain mr-4"
      />

      {/* Текст */}
      <div className="flex flex-col text-white">
        <span className="text-[16px] font-semibold">
          +{amount} {label}
        </span>
        <span className="text-sm opacity-80 text-[12px]">{time}</span>
      </div>

      {/* Стрелка справа */}
      <div className="ml-auto">
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#8EE8FF"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M9 18l6-6-6-6" />
        </svg>
      </div>
    </motion.div>
  );
};
