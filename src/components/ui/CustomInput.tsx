import { type ChangeEvent } from "react";

type Props = {
  value?: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  pl: string;
  readOnly?: boolean;
};

const CustomInput = (props: Props) => {
  return (
    <input
      placeholder={props.pl}
      value={props.value}
      onChange={(e) => props.onChange(e)}
      type='text'
      readOnly={props.readOnly ? props.readOnly : false}
      className='bg-white rounded-[10px] py-2 px-2 w-full focus:outline-none'
    />
  );
};

export default CustomInput;
