import { Link, useLocation } from "react-router-dom";
import type { Links } from "./_types";
import icon1 from "../../assets/images/icon.webp";
import icon2 from "../../assets/images/icon2.webp";
import icon3 from "../../assets/images/tap.png";
import icon4 from "../../assets/images/icon4.webp";
import icon5 from "../../assets/images/icon5.webp";

const links: Links[] = [
  { id: 1, name: "Magazin", link: "/home", icon: icon1 },
  { id: 2, name: "O’yinlar", link: "/games", icon: icon2 },
  { id: 3, name: "Tap", link: "/", icon: icon3 },
  { id: 4, name: "Do’stlar", link: "/friends", icon: icon4 },
  { id: 5, name: "Sozlamalar", link: "/profile", icon: icon5 },
];

const Navigation = () => {
  const { pathname } = useLocation();

  return (
    <nav className='w-full px-3 z-50 absolute bottom-3'>
      <div className='flex justify-between items-center w-full p-2 bg-linear-to-r from-[#7CCFE6] to-[#60C3E1] rounded-xl shadow-3xl'>
        {links.map((el) => {
          const active = pathname === el.link;

          return (
            <Link
              key={el.id}
              to={el.link}
              className={`flex flex-col items-center justify-center gap-1 p-1.5 rounded-xl transition-all duration-300 
                ${active ? "bg-[#40B5DB] scale-110" : "bg-transparent"}`}
              style={{ willChange: "transform, background-color" }}>
              <img
                src={el.icon}
                alt={el.name}
                className={`w-6 h-6 transition-transform duration-300 ${
                  active ? "scale-110" : "scale-100"
                }`}
                style={{ willChange: "transform" }}
              />
              <p className='text-[10px] text-white'>{el.name}</p>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default Navigation;
