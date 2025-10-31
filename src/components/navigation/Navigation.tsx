import { Link, useLocation } from "react-router-dom";
import type { Links } from "./_types";
import icon1 from "../../assets/icons/icon1.svg";
import icon2 from "../../assets/icons/icon2.svg";
import icon3 from "../../assets/icons/icon3.svg";
import icon4 from "../../assets/icons/icon4.svg";
import icon5 from "../../assets/icons/icon5.svg";
import { motion } from "framer-motion";

const links: Links[] = [
  { id: 1, name: "Pul kiritish", link: "/", icon: icon1 },
  { id: 2, name: "O’yinlar", link: "/games", icon: icon2 },
  { id: 3, name: "Airdrop", link: "/airdrop", icon: icon3 },
  { id: 4, name: "Do’stlar", link: "/friends", icon: icon4 },
  { id: 5, name: "Sozlamalar", link: "/profile", icon: icon5 },
];

const Navigation = () => {
  const { pathname } = useLocation();

  return (
    <div className='absolute bottom-6 w-full px-3 z-10'>
      <div
        className=' left-0 right-0 min-h-12 bg-linear-to-r from-[#7CCFE6] to-[#60C3E1] rounded-[12px] p-2 
      flex items-center justify-between w-full shadow-2xl
      '>
        {links.map((el) => (
          <Link
            to={el.link}
            key={el.id}
            className={
              pathname == el.link
                ? "flex flex-col items-center justify-center gap-2 bg-[#40B5DB]  p-2 rounded-[12px]"
                : "flex flex-col items-center justify-center gap-2  p-2 rounded-[12px]"
            }>
            <motion.img
              initial={{ scale: 1 }}
              animate={el.link === pathname ? { scale: 1.25 } : { scale: 1 }}
              transition={{ duration: 0.3 }}
              src={el.icon}
              alt=''
            />
            <p className='text-[11px] text-white'>{el.name}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Navigation;
