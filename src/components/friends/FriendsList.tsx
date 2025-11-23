import { memo, useEffect, useState } from "react";
import star from "../../assets/icons/star.svg";
import UpdateButton from "./UpdateButton";
import avatar from "../../assets/images/Touch.webp";
import { formatNumber } from "../../utils/formatedNumber";
import useAuthStore from "../../store/authStore";

type ListItemType = {
  name?: string;
  sum?: number;
};

type ReferralType = {
  id: number;
  name: string;
  balance: number;
  avatar: string | null;
};

const ListItem = memo(({ name, sum }: ListItemType) => {
  return (
    <li className='w-full p-4 flex flex-row items-center gap-3 justify-between border border-[#24E6F3CC] rounded-xl'>
      <div className='flex items-center gap-3'>
        <div className='w-10 h-10 bg-cyan-500 p-2 rounded-full border border-[#24E6F3CC]'>
          <img src={avatar} alt='' className='w-full h-full object-cover' />
        </div>
        <div className='flex flex-col gap-1'>
          <p className='text-[14px] font-semibold text-white'>{name}</p>
        </div>
      </div>
      <div>
        <div className='text-white flex items-center gap-1'>
          <p className='text-sm font-bold flex items-center'>
            <span>{formatNumber(sum ?? 0)}</span>
          </p>
          <span>so'm/oylik </span>
        </div>
      </div>
    </li>
  );
});

const FriendsList = () => {
  const [referrals, setReferrals] = useState<ReferralType[]>([]);
  const userId = useAuthStore((s) => s.user?.id);

  const fetchReferrals = async () => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/users/referrals/${userId}`
      );
      const data = await res.json();
      if (res.ok && data.success) {
        setReferrals(data.data);
      } else {
        console.error("Ошибка получения рефералов:", data.message);
      }
    } catch (err) {
      console.error("Ошибка запроса рефералов:", err);
    }
  };

  useEffect(() => {
    fetchReferrals();
  }, []);

  return (
    <div className='py-5 relative z-5 w-full px-3 h-full'>
      <div className='flex items-center justify-between'>
        <p className='flex items-center gap-2 text-white font-semibold text-[18px]'>
          <img src={star} alt='' />
          <span>Murojaatlar ro'yxati</span>
        </p>
        <UpdateButton onClick={fetchReferrals} />
      </div>
      <ul className='w-full bg-[#05A2C6CC] min-h-[200px] h-full max-h-[400px] border border-[#24E6F3CC] rounded-xl mt-5 overflow-y-scroll py-5 px-3 gap-4 flex flex-col scroll-smooth scrollbar-none'>
        {referrals.length > 0 ? (
          referrals.map((el, indx) => (
            <ListItem key={indx} name={el.name} sum={el.balance} />
          ))
        ) : (
          <li className='text-white text-center'>Rеfеral yo‘q</li>
        )}
      </ul>
    </div>
  );
};

export default FriendsList;
