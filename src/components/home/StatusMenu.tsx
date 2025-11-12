import bronze from "../../assets/images/bronze.png";
import silver from "../../assets/images/silver.png";
import gold from "../../assets/images/gold.png";
import dimond from "../../assets/images/dimond.png";
import vip from "../../assets/images/vip.png";
import legend from "../../assets/images/legend.png";
import CustomButton from "../ui/CustomButton";
import useStatusPaymentStore from "../../store/statusPayment";

type Props = {
  setClose: (bol: boolean) => void;
};

const list = [
  {
    id: 1,
    img: bronze,
    title: "Bronze",
    text: "Narxi: 130.000 so'm + o'ljaga 10%",
  },
  {
    id: 2,
    img: silver,
    title: "Silver",
    text: "Narxi: 130.000 so'm + o'ljaga 10%",
  },
  {
    id: 3,
    img: gold,
    title: "Gold",
    text: "Narxi: 130.000 so'm + o'ljaga 10%",
  },
  {
    id: 4,
    img: dimond,
    title: "Diamond",
    text: "Narxi: 130.000 so'm + o'ljaga 10%",
  },
  { id: 5, img: vip, title: "VIP", text: "Narxi: 130.000 so'm + o'ljaga 10%" },
  {
    id: 6,
    img: legend,
    title: "LEGENDA",
    text: "Narxi: 130.000 so'm + o'ljaga 10%",
  },
];

const StatusMenu = ({ setClose }: Props) => {
  const { setObj, setOpen } = useStatusPaymentStore((state) => state);

  return (
    <div>
      <p className='text-white text-3xl font-semibold mb-4 text-center'>
        Status sotib olish
      </p>

      <div className='flex flex-col gap-4'>
        {list.map((el) => (
          <div
            key={el.id}
            className={
              "bg-[linear-gradient(90deg,rgba(14,112,191,0.25)_0%,rgba(50,245,240,0.12)_100%)] " +
              "border border-[#24E6F3CC] backdrop-blur-md py-3 px-3 rounded-2xl w-full flex items-center justify-between gap-3"
            }>
            <div className='flex-shrink-0'>
              <img
                src={el.img}
                alt={el.title}
                className='w-[50px] h-[50px] object-cover'
              />
            </div>

            <div className='flex-1 px-2 min-w-0'>
              <div className='text-white text-sm font-semibold truncate'>
                {el.title}
              </div>
              <div className='text-white/70 text-xs truncate'>{el.text}</div>
            </div>

            {/* кнопка */}
            <div className='flex-shrink-0'>
              <CustomButton
                title='Sotib olish'
                onClick={() => {
                  setObj({ title: el.title, text: el.text });
                  setOpen(true);
                  setClose(false);
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatusMenu;
