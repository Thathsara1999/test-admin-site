import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import SignIn from "./pages/auth/SignIn";
import SignUp from "./pages/auth/SignUp";
import Dashboard from "./pages/dashbord/Dashboard";
import ProtectedRoute from "./routes/ProtectedRoute";
import MainLayout from "./components/MainLayout";
import Profile from "./pages/dashbord/Profile";
import Reports from "./pages/dashbord/Reports";
import Chatbot from "./pages/dashbord/Chatbot";
import Notifications from "./pages/dashbord/Notification";
import BabyForm from "./pages/dashbord/BabyForm";
import AdminDashboard from "./pages/admin/admin";
import GrowthAnalysis from "./pages/dashbord/GrowthAnalysis";
import { BirthRegistrationForm } from "./pages/dashbord/Birthregistrationform";
import { NeonatalExaminationForm } from "./pages/dashbord/Neonatalexaminationform";
import { ImmunizationRecordForm } from "./pages/dashbord/Immunizationrecordform";
import UploadChart from "./pages/dashbord/uploadChart";

export default function App() {
  const handleSelectChild = (child: any) => {
    console.log("Selected child:", child);
  };

  return (
    <BrowserRouter>
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
          <Route path="profile" element={<Profile />} />
          <Route path="reports" element={<Reports />} />
          <Route path="chatbot" element={<Chatbot />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="babyform" element={<BabyForm />} />
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
        </Route>

        {/* 404 */}
        <Route path="*" element={<h1>Page Not Found</h1>} />
      </Routes>
    </BrowserRouter>
  );
}
