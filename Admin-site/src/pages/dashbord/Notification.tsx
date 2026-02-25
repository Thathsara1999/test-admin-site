import React, { useState } from "react";
import {
  Heart,
  Syringe,
  Calendar,
  Activity,
  FileText,
  Baby,
} from "lucide-react";

export default function Notification() {
  const [selectedChild, setSelectedChild] = useState(null);

  const childrenData = [
    {
      name: "Emma Johnson",
      age: "3 years",
      photo: "👧",
      status: "All up to date",
      statusColor: "text-green-500",
      statusColorText: "text-green-600",
    },
    {
      name: "Liam Johnson",
      age: "6 months",
      photo: "👶",
      status: "1 vaccine due",
      statusColor: "text-orange-500",
      statusColorText: "text-orange-600",
    },
  ];

  const upcomingVaccinations = [
    {
      child: "Liam",
      vaccine: "MMR Vaccine",
      dueDate: "March 25, 2026",
      color: "orange",
    },
    {
      child: "Emma",
      vaccine: "Annual Checkup",
      dueDate: "April 10, 2026",
      color: "blue",
    },
  ];

  const quickStats = [
    {
      title: "Upcoming Appointments",
      value: 2,
      colorFrom: "from-blue-500",
      colorTo: "to-blue-600",
    },
    {
      title: "Vaccines Completed",
      value: 12,
      colorFrom: "from-green-500",
      colorTo: "to-green-600",
    },
    {
      title: "Medical Records",
      value: 8,
      colorFrom: "from-purple-500",
      colorTo: "to-purple-600",
    },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Welcome */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Welcome back, Nawanka!
        </h2>
        <p className="text-gray-600">
          Here's an overview of your children's health
        </p>
      </div>

      {/* Children Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {childrenData.map((child, idx) => (
          <div
            key={idx}
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition cursor-pointer border-2 border-transparent hover:border-blue-300"
          >
            <div className="flex items-center mb-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-3xl mr-4">
                {child.photo}
              </div>
              <div>
                <h3 className="font-bold text-gray-800">{child.name}</h3>
                <p className="text-sm text-gray-600">{child.age}</p>
              </div>
            </div>
            <div className="flex items-center text-sm">
              <Heart className={`w-4 h-4 mr-2 ${child.statusColor}`} />
              <span className={child.statusColorText}>{child.status}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Upcoming Vaccinations */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
          <Syringe className="w-5 h-5 mr-2 text-blue-600" />
          Upcoming Vaccinations
        </h3>
        <div className="space-y-3">
          {upcomingVaccinations.map((item, idx) => (
            <div
              key={idx}
              className={`flex items-center justify-between p-4 rounded-lg ${item.color === "orange" ? "bg-orange-50 border-l-4 border-orange-500" : "bg-blue-50 border-l-4 border-blue-500"}`}
            >
              <div>
                <p className="font-medium text-gray-800">
                  {item.child} - {item.vaccine}
                </p>
                <p className="text-sm text-gray-600">Due: {item.dueDate}</p>
              </div>
              <button
                className={`px-4 py-2 rounded-lg text-white text-sm ${item.color === "orange" ? "bg-orange-500 hover:bg-orange-600" : "bg-blue-500 hover:bg-blue-600"}`}
              >
                Schedule
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {quickStats.map((stat, idx) => (
          <div
            key={idx}
            className={`bg-gradient-to-br ${stat.colorFrom} ${stat.colorTo} rounded-xl shadow-md p-6 text-white`}
          >
            {stat.title === "Upcoming Appointments" && (
              <Calendar className="w-8 h-8 mb-2 opacity-80" />
            )}
            {stat.title === "Vaccines Completed" && (
              <Activity className="w-8 h-8 mb-2 opacity-80" />
            )}
            {stat.title === "Medical Records" && (
              <FileText className="w-8 h-8 mb-2 opacity-80" />
            )}
            <p className="text-3xl font-bold">{stat.value}</p>
            <p className="text-sm opacity-90">{stat.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
