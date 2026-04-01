import React, { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  Home,
  User,
  MessageCircle,
  Bell,
  LogOut,
  Baby,
  X,
  Menu,
  LineChart,
  Upload,
} from "lucide-react";
import { LucideIcon } from "lucide-react";

// ✅ Type for menu item
type MenuItem = {
  icon: LucideIcon;
  label: string;
  path: string;
};

// ✅ Type for section
type MenuSection = {
  title: string;
  items: MenuItem[];
};

const MainLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Menu configuration
  const menuSections: MenuSection[] = [
    {
      title: "MAIN",
      items: [
        { icon: Home, label: "Dashboard", path: "/dashboard" },
        { icon: LineChart, label: "Growth", path: "/dashboard/growth" },
        { icon: MessageCircle, label: "Chatbot", path: "/dashboard/chatbot" },
      ],
    },
    {
      title: "MANAGEMENT",
      items: [
        { icon: User, label: "Profiles", path: "/dashboard/profile" },
        { icon: Bell, label: "Notifications", path: "/dashboard/notification" },
      ],
    },
    {
      title: "ANALYTICS",
      items: [
        {
          icon: LineChart,
          label: "Growth Analysis",
          path: "/dashboard/growth-analysis",
        },
        {
          icon: Upload,
          label: "Chart Upload",
          path: "/dashboard/chart-upload",
        },
      ],
    },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* 🔵 Sidebar */}
      <div
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-white shadow-lg transition-all duration-300 flex flex-col`}
      >
        {/* 🔷 Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          {sidebarOpen && (
            <div className="flex items-center">
              <Baby className="w-8 h-8 text-blue-600 mr-2" />
              <span className="font-bold text-gray-800 text-lg">
                HealthyKids
              </span>
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

        {/* 🔷 Menu */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-4">
          {menuSections.map((section, sIdx) => (
            <div key={sIdx}>
              {/* Section Title */}
              {sidebarOpen && (
                <p className="text-xs font-semibold text-gray-400 px-3 mb-2">
                  {section.title}
                </p>
              )}

              {/* Items */}
              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const active = location.pathname === item.path;

                  return (
                    <button
                      key={item.path}
                      title={!sidebarOpen ? item.label : ""}
                      onClick={() => navigate(item.path)}
                      className={`w-full flex items-center px-3 py-2 rounded-lg transition-all ${
                        active
                          ? "bg-blue-50 text-blue-600"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0" />

                      {sidebarOpen && (
                        <span className="ml-3 text-sm">{item.label}</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* 🔷 Footer */}
        <div className="p-3 border-t border-gray-200">
          <button
            onClick={() => navigate("/signin")}
            className="w-full flex items-center px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && <span className="ml-3">Logout</span>}
          </button>
        </div>
      </div>

      {/* 🟢 Main Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
