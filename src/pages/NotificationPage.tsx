import { IoMdArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import NotificationList from "../components/notification/NotificationList";
import bg from "../assets/images/mainbg.webp";

const NotificationPage = () => {
  const router = useNavigate();

  return (
    <div
      className='w-full h-svh text-white px-3  flex flex-col gap-5 overflow-y-scroll relative'
      style={{
        background: `url(${bg}) no-repeat center center / cover`,
        overflow: "hidden",
      }}>
      <div className='absolute inset-0 bg-linear-to-b opacity-35 from-[#09152A] to-[#67C5F8]' />
      <div className='w-full h-full py-5 flex flex-col gap-5 relative z-10'>
        <button
          onClick={() => router(-1)}
          className='flex items-center justify-start gap-2'>
          <IoMdArrowRoundBack />
          <p>Notifice</p>
        </button>
        <NotificationList />
      </div>
    </div>
  );
};

export default NotificationPage;
