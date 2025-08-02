import { lazy } from "react";
const VerifyOtp = lazy(() => import("./pages/VerifyOtp"));
const About = lazy(() => import("./pages/About"));
const Features = lazy(() => import("./pages/Features"));
const CallPage = lazy(() => import("./pages/CallPage"));
const DashboardUsers = lazy(() => import("./pages/DashboardUsers"));
const DashboardReports = lazy(() => import("./pages/DashboardReports"));
const AdminLayout = lazy(() => import("./pages/AdminRoutes"));

const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
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
      {
        path: "video-call",
        element: <CallPage />,
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
    path: "/reset-password",
    element: <ResetPassword />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
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
