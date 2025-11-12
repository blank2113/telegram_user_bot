import { type ReactNode } from "react";

type Props = {
  img?: ReactNode;
  title: string;
  btn?: ReactNode;
  className?: string;
};

const CustomBackground = (props: Props) => {
  return (
    <div
      className={
        "bg-[linear-gradient(90deg,rgba(14,112,191,0.4)_0%,rgba(50,245,240,0.4)_100%)] " +
        "border border-[#24E6F3CC] " +
        "backdrop-blur-md py-2 px-3 rounded-xl max-w-full w-full min-h-[70px] flex items-center flex-row justify-between gap-5 relative"
      }>
      <div className='w-[70px]'>{props.img}</div>

      <h1 className='text-white text-[16px] font-semibold'>{props.title}</h1>

      {props.btn}
    </div>
  );
};

export default CustomBackground;
