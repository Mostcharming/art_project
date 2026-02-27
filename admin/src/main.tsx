import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import type { RouteConfig } from "./App";
import App from "./App";
import "./index.css";
import routes from "./routes.json";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App routes={routes as RouteConfig[]} />
  </StrictMode>
);
