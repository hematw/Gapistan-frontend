import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import Providers from "./providers/index.jsx";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* Browser router should be here because without this we can not use react-router hooks and components */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
