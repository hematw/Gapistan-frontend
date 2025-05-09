import { lazy } from "react";

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
];

export default router;
