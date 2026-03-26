import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { babyAPI } from "../../services/api";

export const BabyView: React.FC = () => {
  const { babyId } = useParams();
  const [baby, setBaby] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (babyId) {
      babyAPI
        .getBaby(babyId)
        .then(setBaby)
        .finally(() => setLoading(false));
    }
  }, [babyId]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (!baby) return <div className="p-6">Baby not found</div>;

  const measurements = baby.measurements || [];
  const latest = measurements[measurements.length - 1];

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Baby Growth Tracker</h1>

      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">
          {baby.babyInfo.firstName} {baby.babyInfo.lastName}
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600">Birth Date</p>
            <p className="font-semibold">{baby.babyInfo.birthDate}</p>
          </div>
          <div>
            <p className="text-gray-600">Sex</p>
            <p className="font-semibold capitalize">{baby.babyInfo.sex}</p>
          </div>
          <div>
            <p className="text-gray-600">Mother</p>
            <p className="font-semibold">{baby.babyInfo.motherName}</p>
          </div>
          <div>
            <p className="text-gray-600">Total Measurements</p>
            <p className="font-semibold">{measurements.length}</p>
          </div>
        </div>
      </div>

      {latest && (
        <div className="bg-blue-50 p-6 rounded-lg shadow mb-6">
          <h3 className="font-semibold mb-4">Latest Measurement</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-gray-600">Date</p>
              <p className="font-semibold">
                {new Date(latest.date).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Height</p>
              <p className="font-semibold">{latest.height.value} cm</p>
            </div>
            <div>
              <p className="text-gray-600">Weight</p>
              <p className="font-semibold">{latest.weight.value} kg</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="font-semibold mb-4">Measurement History</h3>
        {measurements.length === 0 ? (
          <p className="text-gray-500">No measurements</p>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Date</th>
                <th className="text-left">Height</th>
                <th className="text-left">Weight</th>
                <th className="text-left">Source</th>
              </tr>
            </thead>
            <tbody>
              {measurements.map((m: any) => (
                <tr key={m.measurementId} className="border-b">
                  <td className="py-2">
                    {new Date(m.date).toLocaleDateString()}
                  </td>
                  <td>{m.height.value} cm</td>
                  <td>{m.weight.value} kg</td>
                  <td className="capitalize">{m.source}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
