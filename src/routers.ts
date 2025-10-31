import { createBrowserRouter } from "react-router";
import MainLayout from "./layouts/MainLayout";

import Home from "./pages/Home";
import Games from "./pages/Games";
import Airdrop from "./pages/Airdrop";
import Friends from "./pages/Friends";
import Profile from "./pages/Profile";

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
    ],
  },
]);

export default router;
