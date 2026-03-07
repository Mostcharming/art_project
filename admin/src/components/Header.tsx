import { LogOut, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import carslLogo from "../assets/carsl.svg";
import { useUserStore } from "../store/userStore";

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const navigate = useNavigate();
  const { user, clearSession } = useUserStore();

  const handleLogout = () => {
    clearSession();
    navigate("/", { replace: true });
  };

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8 bg-gray-800 border-b border-gray-700">
      {/* Left section - Logo and Menu button */}
      <div className="flex items-center gap-4">
        {/* Menu button - visible on small screens */}
        <button
          onClick={onMenuClick}
          className="lg:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand-500"
          aria-label="Toggle sidebar"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Logo */}
        <div className="flex items-center">
          <img src={carslLogo} alt="CARSL" className="h-6" />
        </div>
      </div>

      {/* Right section - User info and logout */}
      <div className="flex items-center gap-4">
        {/* User info */}
        {user && (
          <div className="hidden sm:flex flex-col items-end">
            <p className="text-sm font-medium text-white">
              {user.firstname || user.email.split("@")[0]}
            </p>
            <p className="text-xs text-gray-400">
              {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
            </p>
          </div>
        )}

        {/* Logout button */}
        <button
          onClick={handleLogout}
          className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand-500 transition-colors"
          title="Logout"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
