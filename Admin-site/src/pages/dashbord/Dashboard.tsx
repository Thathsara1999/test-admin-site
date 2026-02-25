import React from "react";
import { Heart, Syringe, Calendar, Activity, FileText } from "lucide-react";

interface Child {
  name: string;
  age: string;
  photo: string;
  status: string;
  upcomingVaccines?: { name: string; due: string }[];
  upcomingAppointments?: { name: string; due: string }[];
  vaccinesCompleted?: number;
  medicalRecords?: number;
}

interface DashboardProps {
  onSelectChild: (child: Child) => void;
}

export default function Dashboard({ onSelectChild }: DashboardProps) {
  const children: Child[] = [
    {
      name: "Emma Johnson",
      age: "3 years",
      photo: "👧",
      status: "All up to date",
      upcomingVaccines: [],
      upcomingAppointments: [{ name: "Annual Checkup", due: "April 10, 2026" }],
      vaccinesCompleted: 12,
      medicalRecords: 8,
    },
    {
      name: "Liam Johnson",
      age: "6 months",
      photo: "👶",
      status: "1 vaccine due",
      upcomingVaccines: [{ name: "MMR Vaccine", due: "March 25, 2026" }],
      upcomingAppointments: [],
      vaccinesCompleted: 2,
      medicalRecords: 2,
    },
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Welcome back, Nawanka!
      </h2>

      {/* Notifications Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-md p-4 flex flex-col items-center">
          <Syringe className="w-6 h-6 text-blue-500 mb-2" />
          <p className="text-gray-600 text-sm">Upcoming Vaccinations</p>
          <p className="font-bold text-gray-800">
            {children.reduce(
              (acc, c) => acc + (c.upcomingVaccines?.length || 0),
              0,
            )}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-4 flex flex-col items-center">
          <Calendar className="w-6 h-6 text-green-500 mb-2" />
          <p className="text-gray-600 text-sm">Upcoming Appointments</p>
          <p className="font-bold text-gray-800">
            {children.reduce(
              (acc, c) => acc + (c.upcomingAppointments?.length || 0),
              0,
            )}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-4 flex flex-col items-center">
          <Syringe className="w-6 h-6 text-green-500 mb-2" />
          <p className="text-gray-600 text-sm">Vaccines Completed</p>
          <p className="font-bold text-gray-800">
            {children.reduce((acc, c) => acc + (c.vaccinesCompleted || 0), 0)}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-4 flex flex-col items-center">
          <FileText className="w-6 h-6 text-purple-500 mb-2" />
          <p className="text-gray-600 text-sm">Medical Records</p>
          <p className="font-bold text-gray-800">
            {children.reduce((acc, c) => acc + (c.medicalRecords || 0), 0)}
          </p>
        </div>
      </div>

      {/* Children Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {children.map((child, idx) => (
          <div
            key={idx}
            onClick={() => onSelectChild(child)}
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
              <Heart
                className={`w-4 h-4 mr-2 ${
                  child.status === "All up to date"
                    ? "text-green-500"
                    : "text-orange-500"
                }`}
              />
              <span
                className={
                  child.status === "All up to date"
                    ? "text-green-600"
                    : "text-orange-600"
                }
              >
                {child.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
