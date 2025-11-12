import { type ChangeEvent } from "react";

type Props = {
  value?: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  pl: string;
};

const CustomInput = (props: Props) => {
  return (
    <input
      placeholder={props.pl}
      value={props.value}
      onChange={(e) => props.onChange(e)}
      type='text'
      className='bg-white rounded-[10px] py-2 px-2 w-full'
    />
  );
};

export default CustomInput;
