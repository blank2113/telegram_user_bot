import { memo, type ReactNode } from "react";

import icon4 from "../../assets/images/friend_icon.png";
import CustomButton from "../ui/CustomButton";
import { Link, useNavigate } from "react-router-dom";
import money from "../../assets/images/money-stack.png";
import vip from "../../assets/images/vip (1).png";
import useAuthStore from "../../store/authStore";
import { formatNumber } from "../../utils/formatedNumber";

type ProfileStatsItemType = {
  color: string;
  img?: ReactNode;
  title?: string;
  subTitle?: string;
  comp?: ReactNode;
  link?: string;
};

const ProfileStatsItem = memo(
  ({ color, img, title, subTitle, comp, link = "" }: ProfileStatsItemType) => {
    return (
      <Link
        to={link}
        className={"w-full rounded-xl p-2 min-h-[100px] " + color}>
        <div className='flex items-center justify-between'>
          <p className='text-white text-[15px] font-semibold'>{title}</p>
          {img}
        </div>
        <p className='text-white text-[12px]'>{subTitle}</p>
        {comp}
      </Link>
    );
  }
);

const ProfileStats = () => {
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();

  return (
    <div className='relative z-10 w-full px-3 grid grid-cols-2 gap-3'>
      <ProfileStatsItem
        color='[background:linear-gradient(0deg,rgba(146,227,250,0.7)_0%,rgba(71,195,230,0.7)_58.54%,rgba(50,186,224,0.7)_71.44%,rgba(21,148,184,0.7)_85.67%,rgba(19,160,200,0.7)_100%),radial-gradient(43.35%_15.91%_at_50%_2.69%,rgba(36,230,243,0.5)_0%,rgba(36,230,243,0)_100%)] border border-[#24E6F3]'
        img={<img src={money} alt='' className='w-[40px] h-[40px]' />}
        title='Balans'
        link='/home'
        comp={
          <p className='pt-3 text-white text-[25px] font-semibold'>
            {formatNumber(user?.balance ?? 0)} so'm
          </p>
        }
      />
      <ProfileStatsItem
        color='[background:linear-gradient(0deg,rgba(223,198,255,0.7)_0%,rgba(174,119,244,0.7)_58.54%,rgba(162,91,253,0.7)_71.44%,rgba(174,119,244,0.7)_85.67%,rgba(162,105,235,0.7)_100%),radial-gradient(43.35%_15.91%_at_50%_2.69%,rgba(206,189,250,0.5)_0%,rgba(206,189,250,0)_100%)] border border-[#C19EFF]'
        img={<img src={vip} alt='' className='w-[40px] h-[40px]' />}
        title='Status'
        comp={
          <div className='pt-3 flex flex-col items-start gap-2'>
            <p className='text-white font-semibold text-[20px]'>
              {user?.status}
            </p>
            <CustomButton
              title='Statusni yaxshilash'
              className='text-[11px] font-semibold'
              onClick={() => navigate("/home")}
            />
          </div>
        }
      />
      <ProfileStatsItem
        color='[background:linear-gradient(0deg,rgba(251,227,110,0.7)_0%,rgba(255,235,140,0.7)_58.54%,rgba(255,234,131,0.7)_71.44%,rgba(223,195,60,0.7)_85.67%,rgba(251,227,110,0.7)_100%),radial-gradient(43.35%_15.91%_at_50%_2.69%,rgba(255,215,31,0.5)_0%,rgba(255,215,31,0)_100%)] 
     border border-[#FBE36E]'
        img={<img src={icon4} alt='' className='w-[40px] h-[40px]' />}
        title='Do’stlar'
        comp={
          <div className='pt-3 pb-2 flex flex-col gap-2'>
            <p className='text-white font-bold text-[25px]'>14 do'stal</p>
            <p className='text-green-600 font-semibold text-sm'>
              {formatNumber(14 * 1000)} so'm / har kun
            </p>
            <CustomButton
              title="Do'stlarni taklif qiling"
              className='text-[12px]'
              onClick={() => navigate("/friends")}
            />
          </div>
        }
      />
    </div>
  );
};

export default ProfileStats;
