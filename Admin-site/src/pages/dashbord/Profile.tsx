import React, { useEffect, useState } from "react";
import { TrendingUp, Syringe, Heart } from "lucide-react";
import { db } from "../../firebase";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";

export default function Profile() {
  const [child, setChild] = useState<any>(null);
  const [vaccinations, setVaccinations] = useState<any[]>([]);
  const [growthRecords, setGrowthRecords] = useState<any[]>([]);
  const childId = "childId123"; // change dynamically later

  useEffect(() => {
    fetchChildData();
  }, []);

  const fetchChildData = async () => {
    try {
      // 🔹 Get child main document
      const childRef = doc(db, "children", childId);
      const childSnap = await getDoc(childRef);

      if (childSnap.exists()) setChild(childSnap.data());

      // 🔹 Get vaccinations subcollection
      const vacRef = collection(db, "children", childId, "vaccinations");
      const vacSnap = await getDocs(vacRef);
      const vacList = vacSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setVaccinations(vacList);

      // 🔹 Get growth records subcollection
      const growthRef = collection(db, "children", childId, "growthRecords");
      const growthSnap = await getDocs(growthRef);
      const growthList = growthSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setGrowthRecords(growthList);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  if (!child) return <p className="p-6">Loading...</p>;
  const age = calculateAge(child.dob);

  // Chart scales
  const weightValues = growthRecords.map((r) => r.weight);
  const minWeight = Math.min(...weightValues, 0);
  const maxWeight = Math.max(...weightValues, 20);

  const heightValues = growthRecords.map((r) => r.height);
  const minHeight = Math.min(...heightValues, 50);
  const maxHeight = Math.max(...heightValues, 120);

  return (
    <div className="p-6">
      {/* Profile Header */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex items-start">
          <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center text-5xl mr-6">
            {child.photo}
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-800">{child.name}</h2>
            <p className="text-gray-600">{age}</p>
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

      {/* Vaccinations */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
          <Syringe className="w-5 h-5 mr-2 text-blue-600" />
          Immunization Record
        </h3>
        <div className="space-y-3">
          {vaccinations.map((vaccine) => (
            <div
              key={vaccine.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div>
                <p className="font-medium text-gray-800">{vaccine.name}</p>
                <p className="text-sm text-gray-600">{vaccine.date}</p>
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

      {/* Weight Chart */}
      <div className="mb-6">
        <h4 className="font-semibold text-gray-700 mb-3">
          Weight Progress (kg)
        </h4>
        <div className="bg-gray-50 rounded-lg p-4 h-64 relative">
          <svg className="w-full h-full" viewBox="0 0 600 200">
            {/* Y Axis */}
            <line
              x1="40"
              y1="10"
              x2="40"
              y2="180"
              stroke="#e5e7eb"
              strokeWidth="2"
            />
            {/* X Axis */}
            <line
              x1="40"
              y1="180"
              x2="580"
              y2="180"
              stroke="#e5e7eb"
              strokeWidth="2"
            />

            {/* Y-axis labels */}
            {Array.from({ length: 6 }).map((_, i) => {
              const val = minWeight + ((maxWeight - minWeight) / 5) * i;
              const y = 180 - (val - minWeight) * 10;
              return (
                <g key={i}>
                  <line x1="35" x2="40" y1={y} y2={y} stroke="#6b7280" />
                  <text
                    x="30"
                    y={y + 3}
                    fontSize="10"
                    textAnchor="end"
                    fill="#6b7280"
                  >
                    {val.toFixed(1)}
                  </text>
                </g>
              );
            })}

            {/* X-axis labels */}
            {growthRecords.map((record, idx) => {
              const x = 40 + (idx * 540) / (growthRecords.length - 1);
              const y = 195;
              return (
                <text
                  key={idx}
                  x={x}
                  y={y}
                  fontSize="10"
                  textAnchor="middle"
                  fill="#6b7280"
                >
                  {record.date}
                </text>
              );
            })}

            {/* Data points */}
            {growthRecords.map((record, idx) => {
              const x = 40 + (idx * 540) / (growthRecords.length - 1);
              const y = 180 - (record.weight - minWeight) * 10;
              return <circle key={idx} cx={x} cy={y} r="5" fill="#10b981" />;
            })}

            {/* Line connecting points */}
            <path
              d={growthRecords
                .map((record, idx) => {
                  const x = 40 + (idx * 540) / (growthRecords.length - 1);
                  const y = 180 - (record.weight - minWeight) * 10;
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
            {/* Y Axis */}
            <line
              x1="40"
              y1="10"
              x2="40"
              y2="180"
              stroke="#e5e7eb"
              strokeWidth="2"
            />
            {/* X Axis */}
            <line
              x1="40"
              y1="180"
              x2="580"
              y2="180"
              stroke="#e5e7eb"
              strokeWidth="2"
            />

            {/* Y-axis labels */}
            {Array.from({ length: 6 }).map((_, i) => {
              const val = minHeight + ((maxHeight - minHeight) / 5) * i;
              const y = 180 - (val - minHeight) * 2;
              return (
                <g key={i}>
                  <line x1="35" x2="40" y1={y} y2={y} stroke="#6b7280" />
                  <text
                    x="30"
                    y={y + 3}
                    fontSize="10"
                    textAnchor="end"
                    fill="#6b7280"
                  >
                    {val.toFixed(0)}
                  </text>
                </g>
              );
            })}

            {/* X-axis labels */}
            {growthRecords.map((record, idx) => {
              const x = 40 + (idx * 540) / (growthRecords.length - 1);
              const y = 195;
              return (
                <text
                  key={idx}
                  x={x}
                  y={y}
                  fontSize="10"
                  textAnchor="middle"
                  fill="#6b7280"
                >
                  {record.date}
                </text>
              );
            })}

            {/* Data points */}
            {growthRecords.map((record, idx) => {
              const x = 40 + (idx * 540) / (growthRecords.length - 1);
              const y = 180 - (record.height - minHeight) * 2;
              return <circle key={idx} cx={x} cy={y} r="5" fill="#3b82f6" />;
            })}

            {/* Line connecting points */}
            <path
              d={growthRecords
                .map((record, idx) => {
                  const x = 40 + (idx * 540) / (growthRecords.length - 1);
                  const y = 180 - (record.height - minHeight) * 2;
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
  );
}

// Auto age calculator
function calculateAge(dob: string) {
  const birth = new Date(dob);
  const today = new Date();
  const diff = today.getFullYear() - birth.getFullYear();
  return `${diff} years`;
}
