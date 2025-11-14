import { createBrowserRouter } from "react-router";
import MainLayout from "./layouts/MainLayout";
import Airdrop from "./pages/Airdrop";
import Friends from "./pages/Friends";
import Profile from "./pages/Profile";

import CoinFlip from "./pages/FlipCoinPage";
import FortuneWheel from "./pages/FortuneWheel";
import Home from "./pages/Home";
import InvitePage from "./pages/InvitePage";

const router = createBrowserRouter([
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
        Component: FortuneWheel,
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
    ],
  },
]);

export default router;
