import { createBrowserRouter } from "react-router";
import MainLayout from "./layouts/MainLayout";
import Airdrop from "./pages/Airdrop";
import Friends from "./pages/Friends";
import Profile from "./pages/Profile";

import CoinFlip from "./pages/FlipCoinPage";
import Home from "./pages/Home";

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
        Component: CoinFlip,
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
    ],
  },
]);

export default router;
