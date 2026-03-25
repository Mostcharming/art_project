import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import "./App.css";
import ErrorBoundary from "./components/ErrorBoundary";
import AdminDetails from "./pages/AdminDetails";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ForgotPasswordTokenPage from "./pages/auth/ForgotPasswordTokenPage";
import Login from "./pages/auth/Login";
import TokenPage from "./pages/auth/TokenPage";
import Content from "./pages/Content";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Members from "./pages/Members";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import ProtectedRoute from "./pages/ProtectedRoute";
import ResetPassword from "./pages/ResetPassword";
import Users from "./pages/Users";

const routeComponents: Record<string, React.FC> = {
  Home,
  Login,
  ForgotPassword,
  ForgotPasswordTokenPage,
  ResetPassword,
  TokenPage,
  Dashboard,
  AdminDetails,
  Content,
  Users,
  Members,
  Profile,
  NotFound,
};

export interface RouteConfig {
  path: string;
  element: keyof typeof routeComponents;
}

interface AppProps {
  routes: RouteConfig[];
}

function App({ routes }: AppProps) {
  const protectedRoutes = [
    "Dashboard",
    "Content",
    "Users",
    "Members",
    "AdminDetails",
    "Profile",
  ];
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
          {/* Catch-all route for 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ErrorBoundary>
      <Toaster position="top-right" theme="dark" />
    </BrowserRouter>
  );
}

export default App;
