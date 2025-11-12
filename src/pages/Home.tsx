import CustomBackground from "../components/ui/CustomBackground";
import CustomButton from "../components/ui/CustomButton";
import CustomPopup from "../components/ui/CustomPopup";
import { useEffect, useState } from "react";
import StatusMenu from "../components/home/StatusMenu";
import useStatusPaymentStore from "../store/statusPayment";
import StatusPayment from "../components/home/StatusPayment";
import PaymentStatusAlert from "../components/home/PaymentStatusAlert";
import { socket } from "../utils/socket";
import AnimatedImage from "../components/home/AnimatedImage";
import AnimatedLight from "../components/home/AnimatedLight";
import AnimatedCoin from "../components/home/AnimatedCoin";

const Home = () => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const {
    open,
    setOpen,
    paymentStatusOpen,
    setPaymentStatusOpen,
    setPaymentStatus,
  } = useStatusPaymentStore((state) => state);

  useEffect(() => {
    const anyHandler = (event: string, ...args: any[]) => {
      const payload = args[0];
      console.log("[socket any] event:", event, payload);
      if (event === "withdraw_update") {
        const status = payload?.status;
        if (status === "APPROVED") {
          setPaymentStatus("success");
        } else if (status === "REJECTED") {
          setPaymentStatus("404");
        } else {
          setPaymentStatus("");
        }
        setPaymentStatusOpen(true);
      }
    };

    socket.onAny(anyHandler);
    return () => {
      socket.offAny(anyHandler);
    };
  }, [setPaymentStatus, setPaymentStatusOpen]);

  return (
    <div className='px-3 pt-10 pb-10 h-svh relative z-1 flex flex-col items-center justify-center  w-full gap-4 overflow-hidden '>
      <AnimatedImage />
      <CustomButton
        title='Pul chiqarish'
        onClick={() => console.log(1)}
        className='absolute top-4 right-3'
      />
      <h1 className='text-center text-[30px]  text-white font-semibold leading-tight'>
        Pul kiritish/ yechib olish
      </h1>
      <div className='w-full flex flex-col items-center justify-end gap-3'>
        <CustomBackground
          title='Status sotib olish'
          img={<AnimatedLight className='absolute -top-4 left-0' />}
          btn={
            <CustomButton
              title='Davom etish'
              onClick={() => setModalOpen(true)}
            />
          }
        />
        <CustomBackground
          title='Limon sotib olish'
          img={<AnimatedCoin className='absolute -top-2 left-2' />}
          className='absolute left-2 bottom-1'
          btn={
            <CustomButton title='Davom etish' onClick={() => console.log(1)} />
          }
        />
      </div>
      <CustomPopup
        open={modalOpen}
        setOpen={setModalOpen}
        component={<StatusMenu setClose={setModalOpen} />}
      />
      <CustomPopup
        open={open}
        setOpen={setOpen}
        component={<StatusPayment />}
      />
      <CustomPopup
        open={paymentStatusOpen}
        setOpen={setPaymentStatusOpen}
        component={<PaymentStatusAlert />}
      />
    </div>
  );
};

export default Home;
