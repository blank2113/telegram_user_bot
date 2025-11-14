import type { ReactNode } from "react";

type Props = {
  title: string;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  img?: ReactNode;
};

const CustomButton = ({ title, onClick, className, disabled, img }: Props) => {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 px-2 py-2 rounded-full  font-extrabold leading-none
        ${className}
        ${
          disabled
            ? " opacity-45 bg-[linear-gradient(90deg,#9CFF8F_0%,#92FDB9_50.5%,#83FEE4_100%)]"
            : "bg-[linear-gradient(90deg,#9CFF8F_0%,#92FDB9_50.5%,#83FEE4_100%)]  transition-transform duration-150 ease-out hover:scale-105 active:scale-105"
        }
        
        ring-2 ring-white/30
        border border-white/10
        shadow-[0_16px_32px_rgba(11,78,120,0.15)]
        scale:100
        transform-gpu
       
        `}>
      {img}
      {title}
    </button>
  );
};

export default CustomButton;
