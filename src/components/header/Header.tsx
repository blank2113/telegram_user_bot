import coin from "../../assets/icons/coin.svg";
import bell from "../../assets/icons/bell.svg";
import { token } from "./header.tokens";
import { formatNumber } from "../../utils/formatedNumber";
import { memo } from "react";
import { Link } from "react-router-dom";
import useNotifyStore from "../../store/notificationStore";
import useAuthStore from "../../store/authStore";
import CustomAvatar from "../ui/CustomAvatar";
import { useNotifications } from "../../utils/useNotifications";

const Header = () => {
  const { count, reset } = useNotifyStore((s) => s);
  const user = useAuthStore((s) => s.user);

  // подключаем SSE
  useNotifications(String(user?.id) || "2");

  return (
    <header className='w-full px-3 relative flex items-center justify-between min-h-[60px] py-2 gap-5'>
      <Link to={"/home"} className={token.block}>
        <img src={coin} alt='coin' className='w-[30px] h-[30px]' />
        <p className='text-white font-semibold'>
          {formatNumber(Number(user?.balance || 0))}
        </p>
      </Link>

      <Link to='/profile' className='flex items-center justify-center gap-3'>
        <CustomAvatar img={user?.img} />
        <div className='flex flex-col gap-0.5 items-start justify-center'>
          <p
            className='text-white font-semibold max-w-[110px] truncate'
            title='JOV_UZB_777'>
            {user?.name}
          </p>

          <p className='flex items-center justify-start gap-2'>
            <span className='text-[#FFFFFF] text-[10px] font-semibold'>
              LVL
            </span>
            <span className='bg-[#24E6F3] px-1.5 rounded-sm text-[12px]'>
              {user?.level}
            </span>
          </p>
        </div>
      </Link>

      <Link
        to={"/notification"}
        className={token.block + " relative"}
        onClick={() => {
          // при заходе в страницу — считаем уведомления прочитанными
          reset();
        }}
        aria-label={`Открыть уведомления, ${count} непрочитанных`}>
        <img src={bell} alt='bell' className='w-[30px] h-[30px]' />

        {count > 0 && (
          <span
            className='absolute -top-1 -right-1 min-w-5 h-5 px-1.5 flex items-center justify-center text-[11px] font-semibold text-white bg-red-500 rounded-full shadow-md z-20'
            aria-hidden={false}>
            {count > 99 ? "99+" : count}
          </span>
        )}
      </Link>
    </header>
  );
};

export default memo(Header);
