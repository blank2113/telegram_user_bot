import avatar from "../../assets/images/home_main_img.webp";

type Props = {
  img?: string | null;
};

const CustomAvatar = ({ img }: Props) => {
  return (
    <div className='w-10 h-10 bg-[#24E6F3CC] flex items-center justify-center rounded-full border-4 border-[#24E6F3CC] overflow-hidden'>
      <img src={img || avatar} alt='' />
    </div>
  );
};

export default CustomAvatar;
