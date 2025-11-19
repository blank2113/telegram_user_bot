import UzbekLeaderboard from "../ui/FakeLeaderboardFromFakerAPI";
import { IoMdCloseCircle } from "react-icons/io";

type Props = {
  onClose?: () => void;
};

const CoinLeaderBoard = ({ onClose }: Props) => {
  return (
    <div className='w-full h-full flex flex-col gap-5 items-end'>
      <button className='active:scale-95 transition-all' onClick={onClose}>
        <IoMdCloseCircle className='text-3xl text-white ' />
      </button>
      <UzbekLeaderboard />
    </div>
  );
};

export default CoinLeaderBoard;
