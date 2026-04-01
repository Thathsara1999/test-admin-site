import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, FileText, Syringe, Heart, TrendingUp } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { BirthRegistrationForm } from "./Birthregistrationform";
import { NeonatalExaminationForm } from "./Neonatalexaminationform";
import { ImmunizationRecordForm } from "./Immunizationrecordform";

const FUNCTIONS_BASE_URL =
  process.env.REACT_APP_FUNCTIONS_BASE_URL ||
  "http://localhost:5001/child-health-system-6ba6d/us-central1";

type Tab = "overview" | "birth" | "neonatal" | "immunization" | "growth";

export const ChildProfilePage: React.FC = () => {
  const { childId } = useParams<{ childId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [childData, setChildData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadChildData = async () => {
      if (!childId || !user) return;

      try {
        setLoading(true);
        const token = await user.getIdToken();

        // Fetch full child data by registration number or baby id
        const response = await axios.get(
          `${FUNCTIONS_BASE_URL}/getChildData?childId=${childId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        setChildData(response.data);
        setError(null);
      } catch {
        setError("Failed to load child data");
      } finally {
        setLoading(false);
      }
    };

    loadChildData();
  }, [childId, user]);

  if (loading)
    return (
      <div className="p-6 text-center">
        <p>Loading child profile...</p>
      </div>
    );

  if (error || !childData)
    return (
      <div className="p-6">
        <button
          onClick={() => navigate("/dashboard")}
          className="mb-4 flex items-center gap-2 text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft size={20} /> Back to Children
        </button>
        <div className="rounded-lg bg-red-50 p-4 text-red-700">
          {error || "Child not found"}
        </div>
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft size={20} /> Back to Children
        </button>
        <h1 className="text-3xl font-bold text-gray-900">
          {childData.babyName || "Child Profile"}
        </h1>
        <div />
      </div>

      {/* Child Overview Card */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-800">
          📋 Child Information
        </h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div>
            <p className="text-sm text-gray-500">Baby Name</p>
            <p className="font-medium text-gray-900">
              {childData.babyName || "-"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Date of Birth</p>
            <p className="font-medium text-gray-900">
              {childData.dateOfBirth || "-"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Mother</p>
            <p className="font-medium text-gray-900">
              {childData.motherName || "-"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Registration No</p>
            <p className="font-medium text-gray-900">
              {childData.registrationNumber || "-"}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-gray-200 bg-white rounded-t-lg">
        <div className="flex flex-wrap gap-0">
          <button
            onClick={() => setActiveTab("overview")}
            className={`flex items-center gap-2 px-4 py-3 font-medium border-b-2 ${
              activeTab === "overview"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            <Heart size={18} /> Overview
          </button>

          <button
            onClick={() => setActiveTab("birth")}
            className={`flex items-center gap-2 px-4 py-3 font-medium border-b-2 ${
              activeTab === "birth"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            <FileText size={18} /> Birth Registration
          </button>

          <button
            onClick={() => setActiveTab("neonatal")}
            className={`flex items-center gap-2 px-4 py-3 font-medium border-b-2 ${
              activeTab === "neonatal"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            <Heart size={18} /> Neonatal Exam
          </button>

          <button
            onClick={() => setActiveTab("immunization")}
            className={`flex items-center gap-2 px-4 py-3 font-medium border-b-2 ${
              activeTab === "immunization"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            <Syringe size={18} /> Immunization
          </button>

          <button
            onClick={() => setActiveTab("growth")}
            className={`flex items-center gap-2 px-4 py-3 font-medium border-b-2 ${
              activeTab === "growth"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            <TrendingUp size={18} /> Growth Records
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="rounded-b-lg border border-t-0 border-gray-200 bg-white p-6">
        {activeTab === "overview" && (
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-800">
              Child Status Overview
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="rounded-lg bg-blue-50 p-4">
                <p className="text-sm text-gray-600">Birth Weight</p>
                <p className="text-lg font-bold text-blue-600">
                  {childData.birthWeight || "-"} kg
                </p>
              </div>
              <div className="rounded-lg bg-green-50 p-4">
                <p className="text-sm text-gray-600">Birth Length</p>
                <p className="text-lg font-bold text-green-600">
                  {childData.birthLength || "-"} cm
                </p>
              </div>
              <div className="rounded-lg bg-purple-50 p-4">
                <p className="text-sm text-gray-600">Gender</p>
                <p className="text-lg font-bold text-purple-600 capitalize">
                  {childData.sex || "-"}
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "birth" && (
          <BirthRegistrationForm childId={childId} childData={childData} />
        )}

        {activeTab === "neonatal" && (
          <NeonatalExaminationForm childId={childId} childData={childData} />
        )}

        {activeTab === "immunization" && (
          <ImmunizationRecordForm childId={childId} childData={childData} />
        )}

        {activeTab === "growth" && (
          <div className="text-center text-gray-500">
            <p>Growth records feature coming soon</p>
          </div>
        )}
      </div>
    </div>
  );
};
