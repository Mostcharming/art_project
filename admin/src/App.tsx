import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import ErrorBoundary from "./components/ErrorBoundary";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ForgotPasswordTokenPage from "./pages/auth/ForgotPasswordTokenPage";
import Login from "./pages/auth/Login";
import TokenPage from "./pages/auth/TokenPage";
import Content from "./pages/Content";
import Dashboard from "./pages/Dashboard";
import Members from "./pages/Members";
import ProtectedRoute from "./pages/ProtectedRoute";
import ResetPassword from "./pages/ResetPassword";
import Users from "./pages/Users";

const routeComponents: Record<string, React.FC> = {
  Login,
  ForgotPassword,
  ForgotPasswordTokenPage,
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
  const protectedRoutes = ["Dashboard", "Content", "Users", "Members"];
  return (
    <BrowserRouter>
      <ErrorBoundary>
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
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default App;
