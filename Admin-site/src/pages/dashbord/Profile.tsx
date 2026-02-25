import React from "react";
import { TrendingUp, Syringe, Heart } from "lucide-react";

export default function Profile() {
  const child = {
    name: "Emma Johnson",
    age: "3 years",
    dob: "Jan 15, 2023",
    bloodType: "O+",
    parent: "Nawanka Thathsara",
    status: "All up to date",
    statusColor: "text-green-500",
    statusColorText: "text-green-600",
    photo: "👧",
    height: "98cm",
    heightChange: "↑ 5cm since last visit",
    weight: "15kg",
    weightChange: "↑ 0.8kg since last visit",
    bmi: "15.6",
    bmiStatus: "Normal range",
    weightHistory: [10, 11, 12, 13, 14.2, 14.5, 15],
    heightHistory: [80, 85, 90, 92, 95, 97, 98],
    vaccinations: [
      { name: "DTaP", date: "Feb 2023", status: "completed" },
      { name: "Polio", date: "Feb 2023", status: "completed" },
      { name: "MMR", date: "Jan 2024", status: "completed" },
      { name: "Varicella", date: "Pending", status: "upcoming" },
    ],
  };

  const handleBack = () => {
    alert("Go back clicked!"); // replace with navigation
  };

  return (
    <div className="p-6">
      {/* Back Button */}
      <button
        onClick={handleBack}
        className="mb-6 text-blue-600 hover:underline flex items-center"
      >
        ← Back to Dashboard
      </button>

      {/* Profile Header */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex items-start">
          <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center text-5xl mr-6">
            {child.photo}
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-800">{child.name}</h2>
            <p className="text-gray-600">{child.age}</p>

            <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
              <div>
                <p className="text-gray-600">Date of Birth</p>
                <p className="font-medium">{child.dob}</p>
              </div>
              <div>
                <p className="text-gray-600">Blood Type</p>
                <p className="font-medium">{child.bloodType}</p>
              </div>
              <div>
                <p className="text-gray-600">Parent</p>
                <p className="font-medium">{child.parent}</p>
              </div>
              <div>
                <p className="text-gray-600">Status</p>
                <div className="flex items-center">
                  <Heart className={`w-4 h-4 mr-2 ${child.statusColor}`} />
                  <span className={child.statusColorText}>{child.status}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Growth Tracking */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
          Growth Tracking
        </h3>

        {/* Current Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 text-center">
            <p className="text-gray-600 text-sm mb-2">Height</p>
            <p className="text-3xl font-bold text-blue-700">{child.height}</p>
            <p className="text-xs text-green-600 mt-1">{child.heightChange}</p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 text-center">
            <p className="text-gray-600 text-sm mb-2">Weight</p>
            <p className="text-3xl font-bold text-green-700">{child.weight}</p>
            <p className="text-xs text-green-600 mt-1">{child.weightChange}</p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 text-center">
            <p className="text-gray-600 text-sm mb-2">BMI</p>
            <p className="text-3xl font-bold text-purple-700">{child.bmi}</p>
            <p className="text-xs text-green-600 mt-1">{child.bmiStatus}</p>
          </div>
        </div>

        {/* Weight Chart */}
        <div className="mb-6">
          <h4 className="font-semibold text-gray-700 mb-3">
            Weight Progress (kg)
          </h4>
          <div className="bg-gray-50 rounded-lg p-4 h-64 relative">
            <svg className="w-full h-full" viewBox="0 0 600 200">
              <line
                x1="40"
                y1="20"
                x2="40"
                y2="180"
                stroke="#e5e7eb"
                strokeWidth="2"
              />
              <line
                x1="40"
                y1="180"
                x2="580"
                y2="180"
                stroke="#e5e7eb"
                strokeWidth="2"
              />

              {child.weightHistory.map((weight, idx) => {
                const x = 40 + idx * 80;
                const y = 180 - (weight - 10) * 10;
                return <circle key={idx} cx={x} cy={y} r="5" fill="#10b981" />;
              })}

              <path
                d={child.weightHistory
                  .map((w, idx) => {
                    const x = 40 + idx * 80;
                    const y = 180 - (w - 10) * 10;
                    return `${idx === 0 ? "M" : "L"} ${x},${y}`;
                  })
                  .join(" ")}
                fill="none"
                stroke="#10b981"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* Height Chart */}
        <div>
          <h4 className="font-semibold text-gray-700 mb-3">
            Height Progress (cm)
          </h4>
          <div className="bg-gray-50 rounded-lg p-4 h-64 relative">
            <svg className="w-full h-full" viewBox="0 0 600 200">
              <line
                x1="40"
                y1="20"
                x2="40"
                y2="180"
                stroke="#e5e7eb"
                strokeWidth="2"
              />
              <line
                x1="40"
                y1="180"
                x2="580"
                y2="180"
                stroke="#e5e7eb"
                strokeWidth="2"
              />

              {child.heightHistory.map((height, idx) => {
                const x = 40 + idx * 80;
                const y = 180 - (height - 60) * 2; // scale for chart
                return <circle key={idx} cx={x} cy={y} r="5" fill="#3b82f6" />;
              })}

              <path
                d={child.heightHistory
                  .map((h, idx) => {
                    const x = 40 + idx * 80;
                    const y = 180 - (h - 60) * 2;
                    return `${idx === 0 ? "M" : "L"} ${x},${y}`;
                  })
                  .join(" ")}
                fill="none"
                stroke="#3b82f6"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Vaccination Records */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
          <Syringe className="w-5 h-5 mr-2 text-blue-600" />
          Immunization Record
        </h3>
        <div className="space-y-3">
          {child.vaccinations.map((vaccine, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                    vaccine.status === "completed"
                      ? "bg-green-100"
                      : "bg-orange-100"
                  }`}
                >
                  <Syringe
                    className={`w-5 h-5 ${
                      vaccine.status === "completed"
                        ? "text-green-600"
                        : "text-orange-600"
                    }`}
                  />
                </div>
                <div>
                  <p className="font-medium text-gray-800">{vaccine.name}</p>
                  <p className="text-sm text-gray-600">{vaccine.date}</p>
                </div>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  vaccine.status === "completed"
                    ? "bg-green-100 text-green-700"
                    : "bg-orange-100 text-orange-700"
                }`}
              >
                {vaccine.status === "completed" ? "✓ Done" : "Upcoming"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
