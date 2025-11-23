import CustomBackground from "../components/ui/CustomBackground";
import CustomButton from "../components/ui/CustomButton";
import CustomPopup from "../components/ui/CustomPopup";
import React, { useCallback, useState } from "react";
import StatusMenu from "../components/home/StatusMenu";
import useStatusPaymentStore from "../store/statusPayment";
import StatusPayment from "../components/home/StatusPayment";
import PaymentStatusAlert from "../components/home/PaymentStatusAlert";
import AnimatedImage from "../components/home/AnimatedImage";
import vip from "../assets/images/vip (1).png";
import Snowfall from "../components/ui/SnowFlake";
import purse from "../assets/images/purse.png";
import money from "../assets/images/money-stack.png";
import bonus from "../assets/images/gift.png";

const StatusMenuMemo = React.memo(StatusMenu);
const StatusPaymentMemo = React.memo(StatusPayment);
const PaymentStatusAlertMemo = React.memo(PaymentStatusAlert);

const Home = () => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const { open, setOpen, paymentStatusOpen, setPaymentStatusOpen } =
    useStatusPaymentStore((state) => state);

  const handleCloseModal = useCallback(() => setModalOpen(false), []);
  // const handleCloseStatus = useCallback(() => setOpen(false), []);
  // const handleClosePayment = useCallback(() => setPaymentStatusOpen(false), []);

  return (
    <div className='px-3 pt-10 pb-35 h-svh relative z-1  w-full gap-4 overflow-y-scroll'>
      <AnimatedImage />
      <Snowfall />
      <h1 className='text-center text-[25px]  text-white font-semibold leading-tight'>
        Statusizni yaxshilang. Bonus oling. Pulni kiriting va echib oling
      </h1>
      <div className='w-full flex flex-col items-center justify-end gap-3'>
        <CustomBackground
          title='Status yaxshilash'
          img={<img src={vip} className='w-[50px] h-[50px]' />}
          btn={
            <CustomButton
              title='Davom etish'
              onClick={() => setModalOpen(true)}
              className='text-[12px] font-medium'
            />
          }
        />
        <CustomBackground
          title='Balans echib olish'
          img={<img src={purse} className=' w-[50px] h-[50px]' />}
          className='absolute left-2 bottom-1'
          btn={
            <CustomButton
              title='Davom etish'
              onClick={() => console.log(1)}
              className='text-[12px] font-medium'
            />
          }
        />
        <CustomBackground
          title='Balans to’ldirish'
          img={<img src={money} className='w-[55px] h-[55px]' />}
          className='absolute left-2 bottom-1'
          btn={
            <CustomButton
              title='Davom etish'
              onClick={() => console.log(1)}
              className='text-[12px] font-medium'
            />
          }
        />
        <CustomBackground
          title='Bonus oyinlari'
          img={<img src={bonus} alt='' className='w-[50px] h-[50px]' />}
          className='absolute left-2 bottom-1'
          btn={
            <CustomButton
              title='Davom etish'
              onClick={() => console.log(1)}
              className='text-[12px] font-medium'
            />
          }
        />
      </div>
      <CustomPopup
        open={modalOpen}
        setOpen={setModalOpen}
        component={<StatusMenuMemo setClose={handleCloseModal} />}
      />
      <CustomPopup
        open={open}
        setOpen={setOpen}
        component={<StatusPaymentMemo />}
      />
      <CustomPopup
        open={paymentStatusOpen}
        setOpen={setPaymentStatusOpen}
        component={<PaymentStatusAlertMemo />}
      />
    </div>
  );
};

export default Home;
