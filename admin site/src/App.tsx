import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";

import SignIn from "./pages/auth/SignIn";
import SignUp from "./pages/auth/SignUp";
import Dashboard from "./pages/dashbord/Dashboard";
import { ChildProfilePage } from "./pages/dashbord/ChildProfilePage";
import ProtectedRoute from "./routes/ProtectedRoute";
import MainLayout from "./components/MainLayout";
import Profile from "./pages/dashbord/Profile";
import Reports from "./pages/dashbord/Reports";
import Chatbot from "./pages/dashbord/Chatbot";
import NotificationPage from "./pages/Notification";
import AdminDashboard from "./pages/admin/admin";
import GrowthAnalysis from "./pages/dashbord/GrowthAnalysis";
import { BirthRegistrationForm } from "./pages/dashbord/Birthregistrationform";
import { NeonatalExaminationForm } from "./pages/dashbord/Neonatalexaminationform";
import { ImmunizationRecordForm } from "./pages/dashbord/Immunizationrecordform";
import UploadChart from "./pages/dashbord/uploadChart";
import { ToastContainer } from "react-toastify";
import { BabyView } from "./pages/dashbord/BabyView";
import ChartUpload from "./pages/dashbord/ChartUpload";

export default function App() {
  const [chartUploadLoading, setChartUploadLoading] = useState(false);

  const handleSelectChild = (child: any) => {
    console.log("Selected child:", child);
  };

  const handleChartUpload = (data: Record<string, any>) => {
    console.log("Chart uploaded:", data);
    // You can add additional logic here like showing a toast notification
  };

  return (
    <BrowserRouter>
      {/* Toast container added here */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <Routes>
        {/* Redirect root */}
        <Route path="/" element={<Navigate to="/signin" replace />} />

        {/* Auth routes */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/admin" element={<AdminDashboard />} />

        {/* Protected routes */}
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route
            index
            element={<Dashboard onSelectChild={handleSelectChild} />}
          />
          <Route path="child/:childId" element={<ChildProfilePage />} />
          <Route path="profile" element={<Profile />} />
          <Route path="reports" element={<Reports />} />
          <Route path="chatbot" element={<Chatbot />} />
          <Route path="notification" element={<NotificationPage />} />
          <Route path="growth" element={<GrowthAnalysis />} />
          <Route path="birthregistration" element={<BirthRegistrationForm />} />
          <Route
            path="neonatalexamination"
            element={<NeonatalExaminationForm />}
          />
          <Route
            path="immunizationrecord"
            element={<ImmunizationRecordForm />}
          />
          <Route path="upload-chart" element={<UploadChart childId="" />} />
          <Route path="babyview/:babyId" element={<BabyView />} />
          <Route
            path="chart-upload"
            element={
              <ChartUpload
                onUpload={handleChartUpload}
                onLoading={setChartUploadLoading}
                isLoading={chartUploadLoading}
              />
            }
          />
        </Route>

        {/* 404 */}
        <Route path="*" element={<h1>Page Not Found</h1>} />
      </Routes>
    </BrowserRouter>
  );
}
