import light from "../../assets/images/light.webp";
import bottom from "../../assets/images/bottom.png";

interface AnimatedLightProps {
  className?: string;
}

const AnimatedLightCSS = ({ className }: AnimatedLightProps) => {
  return (
    <div className={`relative ${className ?? ""}`}>
      <img
        src={light}
        alt='light'
        className='w-[55px] h-[55px] select-none pointer-events-none animate-light-glow'
        draggable={false}
      />
      <img
        src={bottom}
        alt=''
        className='absolute -bottom-3.5 -left-1 w-[50px] pointer-events-none select-none'
        draggable={false}
      />
    </div>
  );
};

export default AnimatedLightCSS;
