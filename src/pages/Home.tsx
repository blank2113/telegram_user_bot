import CustomBackground from "../components/ui/CustomBackground";
import CustomButton from "../components/ui/CustomButton";
import CustomPopup from "../components/ui/CustomPopup";
import React, { useCallback, useState } from "react";
import StatusMenu from "../components/home/StatusMenu";
import useStatusPaymentStore from "../store/statusPayment";
import StatusPayment from "../components/home/StatusPayment";
import PaymentStatusAlert from "../components/home/PaymentStatusAlert";
import AnimatedImage from "../components/home/AnimatedImage";
import AnimatedLight from "../components/home/AnimatedLight";
import AnimatedCoin from "../components/home/AnimatedCoin";
import Snowfall from "../components/ui/SnowFlake";

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
    <div className='px-3 pt-10 pb-35 h-svh relative z-1 flex flex-col items-center justify-center  w-full gap-4 overflow-hidden '>
      <AnimatedImage />
      <Snowfall />
      <CustomButton
        title='Pul chiqarish'
        onClick={() => console.log(1)}
        className='absolute top-4 right-3 text-[12px] font-medium'
      />
      <h1 className='text-center text-[30px]  text-white font-semibold leading-tight'>
        Pul kiritish / yechib olish
      </h1>
      <div className='w-full flex flex-col items-center justify-end gap-3'>
        <CustomBackground
          title='Status sotib olish'
          img={<AnimatedLight className='absolute -top-5.5 -left-2' />}
          btn={
            <CustomButton
              title='Davom etish'
              onClick={() => setModalOpen(true)}
              className='text-[12px] font-medium'
            />
          }
        />
        <CustomBackground
          title='Limon sotib olish'
          img={<AnimatedCoin className='absolute -top-4 -left-1' />}
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
