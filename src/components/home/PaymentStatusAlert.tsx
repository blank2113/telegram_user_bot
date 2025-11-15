import { useEffect } from "react";
import useStatusPaymentStore from "../../store/statusPayment";
import { FaCheck } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";

const PaymentStatusAlert = () => {
  const { paymentStatus, setPaymentStatusOpen, setPaymentStatus } =
    useStatusPaymentStore((state) => state);

  useEffect(() => {
    if (paymentStatus) {
      const timer = setTimeout(() => {
        setPaymentStatus("");
        setPaymentStatusOpen(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [paymentStatus, setPaymentStatus, setPaymentStatusOpen]);

  return (
    <div className='flex flex-col items-center py-20'>
      <div
        className={
          paymentStatus === "success"
            ? "bg-[linear-gradient(90deg,#9CFF8F_0%,#92FDB9_50.5%,#83FEE4_100%)] p-5 w-[150px] h-[150px] rounded-full outline-none flex items-center justify-center"
            : "bg-[linear-gradient(90deg,#F53B3B_0%,#E68753_50.5%,#D53131_100%)] p-5 w-[150px] h-[150px] rounded-full outline-none flex items-center justify-center"
        }>
        {paymentStatus === "success" ? (
          <FaCheck className='text-[120px] text-white' />
        ) : (
          <FaXmark className='text-[150px] text-white' />
        )}
      </div>
      <p>{paymentStatus === "success" ? "Tayyor!" : "Xato"}</p>
      <p>
        {paymentStatus === "success"
          ? "To'ldirish summasi 3 000 000 so'm.!"
          : "Keyinroq qayta urinib ko‘ring."}
      </p>
    </div>
  );
};

export default PaymentStatusAlert;
