import bronze from "../../assets/images/bronze.png";
import silver from "../../assets/images/silver.png";
import gold from "../../assets/images/gold.png";
import dimond from "../../assets/images/dimond.png";
import vip from "../../assets/images/vip.png";
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
    text: "SILVER 210.000 so’m ➡️ Silver BONUS",
    sum: 210000,
  },
  {
    id: 2,
    img: silver,
    title: "Silver",
    text: "SILVER 310.000 so’m ➡️ Silver BONUS",
    sum: 310000,
  },
  {
    id: 3,
    img: bronze,
    title: "Gold",
    text: "BRONZE 670.000 so’m ➡️ Bronze BONUS",
    sum: 670000,
  },
  {
    id: 4,
    img: gold,
    title: "Gold",
    text: "GOLD 1.000.000 so’m ➡️ GOLD BONUS",
    sum: 1000000,
  },
  {
    id: 5,
    img: dimond,
    title: "Diamond",
    text: "PLATINUM 3.000.000 so’m ➡️ SUPER BONUS",
    sum: 3000000,
  },
  {
    id: 6,
    img: vip,
    title: "VIP",
    text: "VIP 7.000.000 so’m ➡️ VIP BONUS",
    sum: 7000000,
  },
];

const BalanceMenu = ({ setClose }: Props) => {
  const { setObj, setOpen } = useStatusPaymentStore((state) => state);

  return (
    <div className='max-h-[450px] h-full overflow-y-scroll scroll-smooth'>
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
            <div className='shrink-0'>
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
            <div className='shrink-0'>
              <CustomButton
                title='Sotib olish'
                className='text-[12px] font-semibold'
                onClick={() => {
                  setObj({ title: el.title, text: el.text, sum: el.sum });
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

export default BalanceMenu;
