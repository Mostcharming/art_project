import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import type { RouteConfig } from "./App";
import App from "./App";
import { ReactQueryProvider } from "./providers/ReactQueryProvider";
import routes from "./routes.json";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ReactQueryProvider>
      <App routes={routes as RouteConfig[]} />
    </ReactQueryProvider>
  </StrictMode>
);
