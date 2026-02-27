import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Content from "./pages/Content";
import Dashboard from "./pages/Dashboard";
import ForgotPassword from "./pages/ForgotPassword";
import Login from "./pages/Login";
import Members from "./pages/Members";
import ProtectedRoute from "./pages/ProtectedRoute";
import ResetPassword from "./pages/ResetPassword";
import TokenPage from "./pages/TokenPage";
import Users from "./pages/Users";

const routeComponents: Record<string, React.FC> = {
  Login,
  ForgotPassword,
  ResetPassword,
  TokenPage,
  Dashboard,
  Content,
  Users,
  Members,
};

export interface RouteConfig {
  path: string;
  element: keyof typeof routeComponents;
}

interface AppProps {
  routes: RouteConfig[];
}

function App({ routes }: AppProps) {
  // Define which routes require authentication
  const protectedRoutes = ["Dashboard", "Content", "Users", "Members"];
  return (
    <BrowserRouter>
      <Routes>
        {routes.map((r) => {
          const Element = routeComponents[r.element];
          const isProtected = protectedRoutes.includes(r.element);
          return (
            <Route
              key={r.path}
              path={r.path}
              element={
                isProtected ? (
                  <ProtectedRoute>
                    <Element />
                  </ProtectedRoute>
                ) : (
                  <Element />
                )
              }
            />
          );
        })}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
