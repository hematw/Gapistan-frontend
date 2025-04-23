import { BrowserRouter, RouterProvider, useRoutes } from "react-router-dom";
import "./App.css";
import router from "./routes";
import Providers from "./providers";

function App() {
  const routing = useRoutes(router);

  return <Providers>{routing}</Providers>;
}

export default App;
