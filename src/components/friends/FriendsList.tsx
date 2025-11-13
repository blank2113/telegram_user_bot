import { memo } from "react";
import star from "../../assets/icons/star.svg";
import UpdateButton from "./UpdateButton";
import avatar from "../../assets/icons/touchAv.svg";

type ListItemType = {
  name?: string;
  lvl?: number;
  sum?: number;
};

const ListItem = memo(({ name, lvl, sum }: ListItemType) => {
  return (
    <li className='w-full p-4 flex flex-row items-center gap-3 justify-between border border-[#24E6F3CC] rounded-xl'>
      <div className='flex items-center gap-3'>
        <div className='w-[50px] h-[50px] bg-cyan-500 p-2 rounded-full border border-[#24E6F3CC]'>
          <img src={avatar} alt='' className='w-full h-full object-cover' />
        </div>
        <div className='flex flex-col gap-1'>
          <p className='text-[18px] font-semibold text-white'>{name}</p>
          <p className='bg-[#24E6F3] px-2 py-0.5 rounded-sm text-[12px] font-semibold flex items-center justify-center w-fit'>
            {lvl}
          </p>
        </div>
      </div>
      <div>
        <p className='text-white flex items-center gap-1'>
          <span className='text-xl font-bold'>{sum}</span>
          <span>limon/oylik </span>
        </p>
      </div>
    </li>
  );
});

const FriendsList = () => {
  return (
    <div className='py-5 relative z-5 w-full px-3 h-full'>
      <div className='flex items-center justify-between'>
        <p className='flex items-center gap-2 text-white font-semibold text-[18px]'>
          <img src={star} alt='' />
          <span>Murojaatlar ro'yxati</span>
        </p>
        <UpdateButton />
      </div>
      <ul className='w-full bg-[#05A2C6CC] min-h-[200px] h-full max-h-[400px] border border-[#24E6F3CC] rounded-xl mt-5 overflow-y-scroll py-5 px-3 gap-4 flex flex-col scroll-smooth scrollbar-none'>
        {Array.from({ length: 10 })
          .fill(5)
          .map((_, indx) => (
            <ListItem key={indx} name={"test test"} lvl={++indx} sum={50000} />
          ))}
      </ul>
    </div>
  );
};

export default FriendsList;
