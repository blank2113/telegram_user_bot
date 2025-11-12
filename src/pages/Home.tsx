import image from "../assets/images/img1.png";
import CustomBackground from "../components/ui/CustomBackground";
import CustomButton from "../components/ui/CustomButton";
import light from "../assets/images/light.png";
import coin from "../assets/images/hcoin.png";
import CustomPopup from "../components/ui/CustomPopup";
import { useEffect, useState } from "react";
import StatusMenu from "../components/home/StatusMenu";
import useStatusPaymentStore from "../store/statusPayment";
import StatusPayment from "../components/home/StatusPayment";
import PaymentStatusAlert from "../components/home/PaymentStatusAlert";
import { socket } from "../utils/socket";

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

      // пример обработки конкретного события
      if (event === "withdraw_update") {
        const status = payload?.status;
        if (status === "APPROVED") {
          setPaymentStatus("success");
        } else if (status === "REJECTED") {
          setPaymentStatus("404");
        } else {
          setPaymentStatus(""); // неизвестный статус
        }
        setPaymentStatusOpen(true); // показываем алерт
      }

      // для других событий можно оставить лог или сохранить raw
    };

    socket.onAny(anyHandler);
    return () => {
      socket.offAny(anyHandler);
    };
  }, [setPaymentStatus, setPaymentStatusOpen]);

  return (
    <div className='px-3 pt-10 pb-40 relative z-1 flex flex-col items-center  w-full gap-4 overflow-y-scroll h-svh'>
      <img src={image} alt='' className='w-[200] h-[200] object-contain' />
      <CustomButton
        title='Pul chiqarish'
        onClick={() => console.log(1)}
        className='absolute top-4 right-3'
      />
      <h1 className='text-center text-[35px] md:text-[48px] lg:text-[64px] text-white font-semibold leading-tight'>
        Pul kiritish/ yechib olish
      </h1>

      <CustomBackground
        title='Status sotib olish'
        img={
          <img
            src={light}
            alt=''
            className='absolute -top-4 left-3 w-[90px] h-[90px]'
          />
        }
        className='absolute left-4 bottom-4'
        btn={
          <CustomButton
            title='Davom etish'
            onClick={() => setModalOpen(true)}
          />
        }
      />
      <CustomBackground
        title='Limon sotib olish'
        img={
          <img
            src={coin}
            alt=''
            className='absolute w-[90px] h-[90px] -top-3 left-1'
          />
        }
        className='absolute left-4 bottom-5'
        btn={
          <CustomButton title='Davom etish' onClick={() => console.log(1)} />
        }
      />
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
