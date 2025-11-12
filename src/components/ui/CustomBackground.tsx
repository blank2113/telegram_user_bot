import { type ReactNode } from "react";
import bottom from "../../assets/images/bottom.png";

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
        "border border-t border-t-[#24E6F3CC] " +
        "backdrop-blur-md py-2 px-3 rounded-xl max-w-full w-full min-h-[100px] flex items-center flex-row justify-end gap-5"
      }>
      <div className=' flex flex-col items-center'>
        {props.img}
        <img src={bottom} alt='' className={props.className ?? ""} />
      </div>
      <h1 className='text-white text-[16px] font-semibold'>{props.title}</h1>
      {props.btn}
    </div>
  );
};

export default CustomBackground;
