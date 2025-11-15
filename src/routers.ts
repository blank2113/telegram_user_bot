import { createBrowserRouter } from "react-router";
import MainLayout from "./layouts/MainLayout";
import { lazy } from "react";
const Home = lazy(() => import("./pages/Home"));
const Games = lazy(() => import("./pages/Games"));
const Airdrop = lazy(() => import("./pages/Airdrop"));
const Friends = lazy(() => import("./pages/Friends"));
const Profile = lazy(() => import("./pages/Profile"));
const InvitePage = lazy(() => import("./pages/InvitePage"));
const NotificationPage = lazy(() => import("./pages/NotificationPage"));
const FourtuneWheel = lazy(() => import("./pages/FortuneWheel"));
const CoinFlip = lazy(() => import("./pages/FlipCoinPage"));

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
]);

export default router;
