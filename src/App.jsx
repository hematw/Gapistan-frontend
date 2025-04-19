import { BrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
// import Chat from "./Chat";
// import SpotlightCard from "./components/SpotlightCard";
// import Login from "./pages/login";
// import Register from "./pages/register";
import RoutesRenderer from "./routes";
import router from "./routes";

function App() {
  return (
    <>
      {/* <Chat /> */}
      {/* <Login /> */}
      {/* <Register /> */}
      <RouterProvider router={router} />
    </>
  );
}

export default App;
