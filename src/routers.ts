import { createBrowserRouter } from "react-router";
import MainLayout from "./layouts/MainLayout";
import Airdrop from "./pages/Airdrop";
import Friends from "./pages/Friends";
import Profile from "./pages/Profile";
// import FortuneWheel from "./pages/FortuneWheel";
import Home from "./pages/Home";
import InvitePage from "./pages/InvitePage";
import NotificationPage from "./pages/NotificationPage";
import AppLayout from "./layouts/AppLayout";
import Games from "./pages/Games";
import FourtuneWheel from "./pages/FortuneWheel";
import CoinFlip from "./pages/FlipCoinPage";

const router = createBrowserRouter([
  {
    path: "/",
    Component: AppLayout,
    children: [
      {
        path: "/",
        Component: MainLayout,
        children: [
          {
            index: true,
            Component: Home,
          },
          {
            path: "/games",
            Component: Games,
          },
          {
            path: "/airdrop",
            Component: Airdrop,
          },
          {
            path: "/friends",
            Component: Friends,
          },
          {
            path: "/profile",
            Component: Profile,
          },
          {
            path: "/invite/:botUsername",
            Component: InvitePage,
          },
          {
            path: "/wheel",
            Component: FourtuneWheel,
          },
          {
            path: "/flip_coin",
            Component: CoinFlip,
          },
        ],
      },
      {
        path: "/notification",
        Component: NotificationPage,
      },
    ],
  },
]);

export default router;
