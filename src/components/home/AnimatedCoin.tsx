import coin from "../../assets/images/coin.webp";
import bottom from "../../assets/images/bottom.png";

interface AnimatedCoinProps {
  className?: string;
}

const AnimatedCoin = ({ className }: AnimatedCoinProps) => {
  return (
    <div className={`relative ${className ?? ""}`}>
      <img
        src={coin}
        alt='coin'
        className='w-[60px] h-[60px] object-cover select-none pointer-events-none enchanted-spin'
        draggable={false}
      />
      <img
        src={bottom}
        alt=''
        className='absolute -bottom-2 left-1.5 w-[50px] pointer-events-none select-none'
        draggable={false}
      />
    </div>
  );
};

export default AnimatedCoin;
