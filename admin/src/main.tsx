import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import type { RouteConfig } from "./App";
import App from "./App";
import { ModerationProvider } from "./contexts/ModerationContext";
import { ReactQueryProvider } from "./providers/ReactQueryProvider";
import routes from "./routes.json";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ReactQueryProvider>
      <ModerationProvider>
        <App routes={routes as RouteConfig[]} />
      </ModerationProvider>
    </ReactQueryProvider>
  </StrictMode>
);
