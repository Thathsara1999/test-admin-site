import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Home,
  User,
  FileText,
  MessageCircle,
  Bell,
  LogOut,
  Baby,
  X,
  Menu,
} from "lucide-react";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const navigate = useNavigate();
  const location = useLocation(); // to highlight active menu

  const menuItems = [
    { icon: Home, label: "Dashboard", path: "/dashboard" },
    { icon: User, label: "Profiles", path: "/dashboard/profile" },
    { icon: FileText, label: "Records", path: "/dashboard/reports" },
    { icon: MessageCircle, label: "Chat", path: "/dashboard/chat" },
    { icon: Bell, label: "Notifications", path: "/dashboard/notifications" },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-white shadow-lg transition-all duration-300 flex flex-col`}
      >
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {sidebarOpen && (
              <div className="flex items-center">
                <Baby className="w-8 h-8 text-blue-600 mr-2" />
                <span className="font-bold text-gray-800">HealthyKids</span>
              </div>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              {sidebarOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Menu */}
        <nav className="flex-1 p-4">
          {menuItems.map((item, idx) => {
            const isActive = location.pathname === item.path;

            return (
              <button
                key={idx}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center px-4 py-3 rounded-lg transition ${
                  isActive
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {sidebarOpen && <span className="ml-3">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={() => navigate("/signin")} // navigate to signin on logout
            className="w-full flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && <span className="ml-3">Logout</span>}
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto">{children}</div>
    </div>
  );
}
