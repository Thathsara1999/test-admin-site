import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Search, Filter, Calendar, User } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

type BirthRecord = {
  id: string;
  babyName?: string;
  dateOfBirth?: string;
  motherName?: string;
  registrationNumber?: string;
  createdAt?: { _seconds?: number };
};

type DashboardProps = {
  onSelectChild?: (child: BirthRecord) => void;
};

const FUNCTIONS_BASE_URL =
  process.env.REACT_APP_FUNCTIONS_BASE_URL ||
  "http://localhost:5001/child-health-system-6ba6d/us-central1";

export default function Dashboard({ onSelectChild }: DashboardProps) {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [babies, setBabies] = useState<BirthRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const load = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const token = await user.getIdToken();
        const response = await axios.get(
          `${FUNCTIONS_BASE_URL}/getMyAreaBirthData`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        setBabies(response.data?.babies || []);
      } catch {
        setError("Failed to load children for your area.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [user]);

  const filteredBabies = useMemo(
    () =>
      babies.filter(
        (baby) =>
          baby.babyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          baby.registrationNumber
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          baby.motherName?.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    [babies, searchTerm],
  );

  const stats = useMemo(
    () => ({
      totalChildren: babies.length,
      thisMonthRegistrations: babies.filter((baby) => {
        const seconds = baby.createdAt?._seconds;
        if (!seconds) return false;

        const createdAtDate = new Date(seconds * 1000);
        const now = new Date();

        return (
          createdAtDate.getFullYear() === now.getFullYear() &&
          createdAtDate.getMonth() === now.getMonth()
        );
      }).length,
    }),
    [babies],
  );

  const handleSelectChild = (child: BirthRecord) => {
    onSelectChild?.(child);
    navigate(`/dashboard/child/${child.id}`);
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Midwife Dashboard</h1>
        <p className="text-sm text-gray-600 mt-1">
          {profile?.name || user?.displayName || "Midwife"} - Area:{" "}
          {profile?.area || "Not set"}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-500">Children In Your Area</p>
          <p className="text-2xl font-bold text-blue-700">
            {stats.totalChildren}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-500">Registrations This Month</p>
          <p className="text-2xl font-bold text-emerald-700">
            {stats.thisMonthRegistrations}
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="rounded-xl border border-gray-200 bg-white p-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by baby name, registration number, or mother name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
        </div>
      </div>

      {/* Children List */}
      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
          <h2 className="font-semibold text-gray-800">
            Children Assigned To Your Area
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Click on a child to view and manage their health records
          </p>
        </div>

        {loading ? (
          <p className="p-6 text-center text-sm text-gray-500">
            Loading children...
          </p>
        ) : error ? (
          <p className="p-6 text-sm text-red-600">{error}</p>
        ) : babies.length === 0 ? (
          <p className="p-6 text-sm text-gray-500">
            No records found for your area.
          </p>
        ) : filteredBabies.length === 0 ? (
          <p className="p-6 text-sm text-gray-500">
            No matching children found.
          </p>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredBabies.map((baby) => (
              <div
                key={baby.id}
                onClick={() => handleSelectChild(baby)}
                className="p-4 hover:bg-blue-50 cursor-pointer transition flex items-center justify-between gap-4"
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">
                    {baby.babyName || "Unnamed"}
                  </h3>
                  <div className="mt-2 flex flex-wrap gap-3 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Filter size={16} />
                      Reg: {baby.registrationNumber || "-"}
                    </span>
                    <span className="flex items-center gap-1">
                      <User size={16} />
                      Mother: {baby.motherName || "-"}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar size={16} />
                      DOB: {baby.dateOfBirth || "-"}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
                    View Profile
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
