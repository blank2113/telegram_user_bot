import coin from "../../assets/icons/coin.svg";
import bell from "../../assets/icons/bell.svg";
import avatar from "../../assets/icons/avatar.svg";
import { token } from "./header.tokens";
import { formatNumber } from "../../utils/formatedNumber";
import { memo } from "react";

const Header = () => {
  return (
    <header className='w-full px-3 relative flex items-center justify-between min-h-[60px] py-2 gap-5'>
      <div className={token.block}>
        <img src={coin} alt='coin' className='w-[30px] h-[30px]' />
        <p className='text-white font-semibold'>{formatNumber(900)}</p>
      </div>
      <div className='flex items-center justify-center gap-3'>
        <img src={avatar} alt='' className='w-[40px] h-[40px]' />
        <div className='flex flex-col gap-0.5 items-start justify-center'>
          <p
            className='text-white font-semibold max-w-[110px] truncate'
            title='JOV_UZB_777'>
            JOV_UZB_777
          </p>

          <p className='flex items-center justify-start gap-2'>
            <span className='text-[#FFFFFF] text-[10px] font-semibold'>
              LVL
            </span>
            <span className='bg-[#24E6F3] px-1.5 rounded-[4px] text-[12px]'>
              4
            </span>
          </p>
        </div>
      </div>
      <div className={token.block}>
        <img src={bell} alt='bell' className='w-[30px] h-[30px]' />
      </div>
    </header>
  );
};

export default memo(Header);
