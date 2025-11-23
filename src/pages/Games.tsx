import GamesAnimatedImage from "../components/games/GamesAnimatedImage";
import CustomBackground from "../components/ui/CustomBackground";
import CustomButton from "../components/ui/CustomButton";
import wheel from "../assets/images/wheel_bg.png";
import coin from "../assets/images/coin.webp";
import { useNavigate } from "react-router-dom";
import Snowfall from "../components/ui/SnowFlake";

const Games = () => {
  const navigate = useNavigate();

  return (
    <div className='w-full h-full relative z-10 pt-5 pb-34 px-3 flex flex-col items-center gap-5 overflow-y-scroll '>
      <Snowfall />

      <GamesAnimatedImage />
      <div className='w-full'>
        <h1 className='text-white font-bold text-[35px] text-center'>
          O‘ynang. Bonuslar oling va pul ishlang.
        </h1>
      </div>

      <CustomBackground
        title='Bonus 14 G’ildiragi'
        btn={
          <CustomButton title='O’ynash' className='text-[12px] font-semibold' />
        }
        img={
          <img
            src={wheel}
            alt=''
            className='w-20 h-20 object-cover absolute -top-4 left-0 spin-wheel'
          />
        }
        onClick={() => navigate("/wheel")}
      />
      <CustomBackground
        title='Burgut/Quyruq'
        btn={
          <CustomButton title='O’ynash' className='text-[12px] font-semibold' />
        }
        img={
          <img
            src={coin}
            alt=''
            className='w-[75px] h-[75px] object-cover absolute -top-3 left-0 enchanted-spin'
          />
        }
        onClick={() => navigate("/flip_coin")}
      />
    </div>
  );
};

export default Games;
