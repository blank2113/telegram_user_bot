import GamesAnimatedImage from "../components/games/GamesAnimatedImage";
import CustomBackground from "../components/ui/CustomBackground";
import CustomButton from "../components/ui/CustomButton";
import wheel from "../assets/images/wheel_bg.png";
import coin from "../assets/images/coin.webp";
import { useNavigate } from "react-router-dom";

const Games = () => {
  const navigate = useNavigate();

  return (
    <div className='w-full h-full relative z-10 py-5 px-3 flex flex-col items-center gap-5'>
      <CustomButton
        title='Status
sotib olish'
        className='text-[10px] font-semibold absolute top-2 right-3 '
      />
      <GamesAnimatedImage />
      <div className='w-full'>
        <h1 className='text-white font-bold text-[35px] text-center'>
          O’yinlar
        </h1>
        <p className='text-center  font-medium text-[18px] text-gray-300'>
          Kundalik mukofot olish uchun bosing.
        </p>
      </div>
      <div className='flex items-center w-full justify-between pb-5 pt-10'>
        <CustomButton title='Avtokliker' className='text-[12px] font-medium ' />
        <CustomButton title='Booster' className='text-[12px] font-medium' />
      </div>
      <CustomBackground
        title="Tikish g'ildiragi"
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
        title='Tangani aylantiring'
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
