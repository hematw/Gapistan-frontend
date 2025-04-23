import Chat from "./pages/Chat";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Home from "./pages/Home";
import ProtectedLayout from "./pages/ProtectedLayout";

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
