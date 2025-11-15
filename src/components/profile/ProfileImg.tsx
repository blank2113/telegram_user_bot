import { useState, useRef } from "react";
import avatar from "../../assets/images/home_main_img.webp";
import { FaEdit } from "react-icons/fa";

const ProfileImg = () => {
  const [image, setImage] = useState<string>(avatar);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      setImage(url);
      // Тут можно сразу отправлять файл на сервер, если нужно
    }
  };

  return (
    <div className='relative z-20'>
      <button
        onClick={handleClick}
        className='w-40 h-40 bg-[#24E6F3CC] flex items-center justify-center rounded-full border-4 border-[#24E6F3CC] overflow-hidden'>
        <img src={image} alt='Profile' className='w-full h-full object-cover' />
      </button>
      <FaEdit className='text-2xl text-[#24E6F3CC]  absolute bottom-0 right-1 z-10' />

      <input
        ref={inputRef}
        type='file'
        accept='image/*'
        onChange={handleChange}
        className='hidden'
      />
    </div>
  );
};

export default ProfileImg;
