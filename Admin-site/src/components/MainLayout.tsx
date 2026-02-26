import React from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
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
  FilePlus,
  LineChart,
} from "lucide-react";

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { icon: Home, label: "Dashboard", path: "/dashboard" },
    { icon: User, label: "Profiles", path: "/dashboard/profile" },
    { icon: FileText, label: "Records", path: "/dashboard/reports" },
    { icon: MessageCircle, label: "Chatbot", path: "/dashboard/chatbot" },
    { icon: LineChart, label: "Growth", path: "/dashboard/growth" },
    { icon: Bell, label: "Notifications", path: "/dashboard/notifications" },
    { icon: FilePlus, label: "Baby Form", path: "/dashboard/babyform" },
    {
      icon: Baby,
      label: "Birth Registration",
      path: "/dashboard/birthregistration",
    },
    {
      icon: Baby,
      label: "Neonatal Examination",
      path: "/dashboard/neonatalexamination",
    },
    {
      icon: Baby,
      label: "Immunization Record",
      path: "/dashboard/immunizationrecord",
    },
    { icon: Baby, label: "Upload Chart", path: "/dashboard/upload-chart" },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <div
        className={`${sidebarOpen ? "w-64" : "w-20"} bg-white shadow-lg transition-all duration-300 flex flex-col`}
      >
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
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

        <nav className="flex-1 p-4">
          {menuItems.map((item, idx) => {
            const active = location.pathname === item.path;
            return (
              <button
                key={idx}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center px-4 py-3 rounded-lg transition ${
                  active
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

        <div className="p-4 border-t border-gray-200">
          <button
            className="w-full flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition"
            onClick={() => navigate("/signin")}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && <span className="ml-3">Logout</span>}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <Outlet />
      </div>
    </div>
  );
}
