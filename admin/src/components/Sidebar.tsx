import { Crown, FileText, LayoutDashboard, Users, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Users",
    href: "/users",
    icon: Users,
  },
  {
    label: "Content",
    href: "/content",
    icon: FileText,
  },
  {
    label: "Members",
    href: "/members",
    icon: Crown,
  },
];

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation();

  const isActive = (href: string) => {
    return location.pathname === href;
  };

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-16 left-0 z-40 w-64 bg-gray-800 border-r border-gray-700 transform transition-transform duration-300 ease-in-out lg:relative lg:inset-auto lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ top: "4rem" }}
      >
        <div className="flex flex-col h-full">
          {/* Close button - visible on small screens */}
          <div className="flex items-center justify-between p-4 lg:hidden border-b border-gray-700">
            <h2 className="text-lg font-semibold text-white">Menu</h2>
            <button
              onClick={onClose}
              className="p-1 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand-500"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation menu */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                    active
                      ? "bg-brand-600 text-white"
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
          <div className="p-4 border-t border-gray-700">
            <div className="px-4 py-3 rounded-lg bg-gray-700 bg-opacity-50">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                Version
              </p>
              <p className="text-sm text-gray-300">1.0.0</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
