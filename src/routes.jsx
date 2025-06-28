import { lazy } from "react";
import VerifyOtp from "./pages/VerifyOtp";
import About from "./pages/About";
import Features from "./pages/Features";
import CallPage from "./pages/CallPage";
import DashboardUsers from "./pages/DashboardUsers";
import DashboardReports from "./pages/DashboardReports";
import AdminLayout from "./pages/AdminRoutes";

const Chat = lazy(() => import("./pages/Chat"));
const SignIn = lazy(() => import("./pages/SignIn"));
const SignUp = lazy(() => import("./pages/SignUp"));
const Home = lazy(() => import("./pages/Home"));
const ProtectedLayout = lazy(() => import("./pages/ProtectedLayout"));

const router = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/chat",
    element: <ProtectedLayout />,
    children: [
      {
        index: true,
        element: <Chat />,
      },
    ],
  },
  {
    path: "/signin",
    element: <SignIn />,
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
  {
    path: "/about",
    element: <About />,
  },
  {
    path: "/features",
    element: <Features />,
  },
  {
    path: "/verify-otp",
    element: <VerifyOtp />,
  },
  {
    path: "/video-call",
    element: <CallPage />,
  },

  {
    path: "/dashboard",
    element: <AdminLayout />,
    children: [
      {
        path: "users",
        element: <DashboardUsers />,
      },
      {
        path: "reports",
        element: <DashboardReports />,
      },
    ],
  },
];

export default router;
