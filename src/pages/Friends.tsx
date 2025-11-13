import AnimatedFriendsImage from "../components/friends/AnimatedFriendsImage";
import CustomButton from "../components/ui/CustomButton";
import tg_icon from "../assets/icons/tg.svg";
import FriendsList from "../components/friends/FriendsList";
import CustomPopup from "../components/ui/CustomPopup";
import { useState } from "react";
import TelegramLinkPopup from "../components/friends/TelegramLinkPopup";

const Friends = () => {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <div className='w-full h-full flex flex-col items-center relative z-10 py-10 overflow-y-scroll'>
      <AnimatedFriendsImage />
      <div className='flex flex-col items-center gap-2 py-5'>
        <h1 className='text-white text-4xl font-semibold'>Do’stlar</h1>
        <p className='text-white text-center px-3 text-[19px] opacity-90'>
          Har bir taklif qilingan do'stingiz uchun balansingizga 10%,
          shuningdek, o'yinlar uchun 30 energiya oling
        </p>
      </div>
      <CustomButton
        onClick={() => setOpen(true)}
        title='Taklifni yuborish'
        className='text-md font-medium'
        img={<img src={tg_icon} alt='' />}
      />
      <FriendsList />
      <CustomPopup
        open={open}
        setOpen={setOpen}
        component={<TelegramLinkPopup onClose={() => setOpen(false)} />}
      />
    </div>
  );
};

export default Friends;
