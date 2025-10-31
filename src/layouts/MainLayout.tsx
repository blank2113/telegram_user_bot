import { Outlet } from "react-router-dom";
import Navigation from "../components/navigation/Navigation";
import Header from "../components/header/Header";
import bg from "../assets/images/mainbg.jpg";

const MainLayout = () => {
  return (
    <main
      className='min-h-screen w-screen bg-[radial-gradient(186.36%_46.59%_at_50%_78.92%,#24E6F3_0%,#091830_100%)] flex  flex-col'
      style={{
        background: `url(${bg})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center center",
      }}>
      <div className='absolute inset-0 bg-linear-to-b opacity-35 from-[#09152A] to-[#67C5F8]' />

      <Header />
      <Outlet />
      <Navigation />
    </main>
  );
};

export default MainLayout;
