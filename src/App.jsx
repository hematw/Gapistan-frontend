import { BrowserRouter, RouterProvider, useRoutes } from "react-router-dom";
import "./App.css";
import router from "./routes";
import Providers from "./providers";
import { Suspense } from "react";

function App() {
  const routing = useRoutes(router);

  return (
    <Providers>
      {/* <Suspense fallback={<div>Loading...</div>}>{routing}</Suspense> */}
      <div>{routing}</div>
    </Providers>
  );
}

export default App;
