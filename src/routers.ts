import { createBrowserRouter } from "react-router";
import MainLayout from "./layouts/MainLayout";
import Airdrop from "./pages/Airdrop";
import Friends from "./pages/Friends";
import Profile from "./pages/Profile";

import CoinFlip from "./pages/FlipCoinPage";
import Home from "./pages/Home";
import InvitePage from "./pages/InvitePage";
import NotificationPage from "./pages/NotificationPage";

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
      {
        path: "/invite/:botUsername",
        Component: InvitePage,
      },
    ],
  },
  {
    path: "/notification",
    Component: NotificationPage,
  },
]);

export default router;
