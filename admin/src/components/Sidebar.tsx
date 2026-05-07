import {
  Layers,
  LogOut,
  SquareKanban,
  UserPen,
  UserRound,
  Users,
  X,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import carslLogo from "../assets/carsl.svg";
import { useUserStore } from "../store/userStore";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: SquareKanban,
  },
  {
    label: "Content Management",
    href: "/content",
    icon: Layers,
  },
  {
    label: "Users",
    href: "/users",
    icon: Users,
  },
  {
    label: "Team Members",
    href: "/members",
    icon: UserPen,
  },
];

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, clearUser } = useUserStore();

  const isActive = (href: string) => {
    return location.pathname === href;
  };

  const handleLogout = () => {
    clearUser();
    navigate("/login");
  };

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#oc111d] border-r border-gray-700 transform transition-transform duration-300 ease-in-out lg:relative lg:inset-auto lg:translate-x-0 flex flex-col h-screen lg:h-screen ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo section */}
          <div className="flex items-center justify-between px-4 py-2 mt-4 ml-4 flex-shrink-0">
            <img src={carslLogo} alt="CARSL" className="h-6" />
            {/* Close button - visible on small screens */}
            <button
              onClick={onClose}
              className="lg:hidden p-1 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand-500"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation menu */}
          <nav className="flex-1 px-4 py-4 space-y-0 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
                    active
                      ? "bg-brand-600 text-white bg-gray-700"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Footer section */}
          <div className="p-4 space-y-3 flex-shrink-0 border-t border-gray-700">
            <Link
              to="/profile"
              onClick={onClose}
              className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg transition-colors font-medium ${
                isActive("/profile")
                  ? "bg-brand-600 text-white bg-gray-700"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white"
              }`}
            >
              <UserRound className="w-5 h-5" />
              <span>Profile</span>
            </Link>
            <div className="px-4 py-3 border-t border-gray-700 pt-4">
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">
                    {user?.firstname} {user?.lastname}
                  </p>
                  <p className="text-xs text-gray-400 truncate">
                    {user?.email}
                  </p>
                </div>

                <div className="flex-shrink-0 mt-1">
                  <div
                    onClick={handleLogout}
                    className="w-10 h-10 text-gray-400 rounded-full bg-brand-600 flex items-center justify-center cursor-pointer hover:bg-brand-700 transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
