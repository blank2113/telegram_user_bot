import type { FC } from "react";
import { motion } from "framer-motion";
import Bell from "../../assets/icons/bell.svg";

interface RewardCardProps {
  label: string;
  onClick?: () => void;
}

export const NotificationCard: FC<RewardCardProps> = ({ label, onClick }) => {
  return (
    <motion.div
      onClick={onClick}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileTap={{ scale: 0.97 }}
      className='
        w-full relative overflow-hidden
        bg-[#3B8FAD]/70
        p-4
        flex items-center
        backdrop-blur-md
      '>
      {/* Иконка слева */}
      <img
        src={Bell}
        alt='reward icon'
        className='w-8 h-8 object-contain mr-4'
      />

      {/* Текст */}
      <div className='flex flex-col text-white max-w-[200px]'>
        <span className='text-[14px] font-semibold truncate' title={label}>
          {label}
        </span>
      </div>

      {/* Стрелка справа */}
      <div className='ml-auto'>
        <svg
          width='28'
          height='28'
          viewBox='0 0 24 24'
          fill='none'
          stroke='#8EE8FF'
          strokeWidth='2.5'
          strokeLinecap='round'
          strokeLinejoin='round'>
          <path d='M9 18l6-6-6-6' />
        </svg>
      </div>
    </motion.div>
  );
};
