import { IoMdCloseCircle } from "react-icons/io";

type Props = {
  onClose?: () => void;
};

const TelegramLinkPopup = ({ onClose }: Props) => {
  return (
    <div className='flex flex-col items-center gap-5'>
      <div className='w-full relative'>
        <p className=' text-center text-xl text-white'>Taklifingiz</p>
        <button
          className='absolute top-0 right-0 hover:scale-105 active:scale-95 transition-all'
          onClick={onClose}>
          <IoMdCloseCircle className='text-3xl text-white' />
        </button>
      </div>
      <div className='w-full h-0.5 bg-linear-to-r from-white/0 via-white/50 to-white/0' />
      <p className='text-white text-center'>
        Do'stingizning yo'nalishi bo'lish uchun ularning havolasini qo'shing.
        Shundan so'ng, siz ularning yo'nalishi sifatida ro'yxatdan o'tasiz.
        Shuni ta'kidlash kerakki, bu harakatni qaytarib bo'lmaydi
      </p>
      <p className='bg-[#071240B2] w-full p-3 rounded-3xl text-gray-400 text-center'>
        https://t.me/Jov_uzb_777
      </p>
      <button className='w-full bg-[#B7F8FF] p-3 transform transition-transform duration-200  rounded-3xl active:scale-95'>
        Nusxalash
      </button>
    </div>
  );
};

export default TelegramLinkPopup;
