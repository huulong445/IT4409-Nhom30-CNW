import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import DashboardLayout from './layouts/DashboardLayout';

import PatientRegister from './pages/auth/PatientRegister';
import PatientBooking from './pages/patient/PatientBooking';
import AuthLayout from './layouts/AuthLayout';

// Patient pages
import PatientLayout from './layouts/PatientLayout';
import PatientHome from './pages/patient/PatientHome';

// Doctor pages
import DoctorQueue from './pages/doctor/DoctorQueue';
import ExaminationRoom from './pages/doctor/ExaminationRoom';
import DoctorPrescriptions from './pages/doctor/DoctorPrescriptions';
import DoctorLabs from './pages/doctor/DoctorLabs';
import DoctorSchedule from './pages/doctor/DoctorSchedule';

// Paraclinical pages
import ParaclinicalDashboard from './pages/paraclinical/ParaclinicalDashboard';
import ParaclinicalSchedule from './pages/paraclinical/ParaclinicalSchedule';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import DepartmentManagement from './pages/admin/DepartmentManagement';
import AdminReports from './pages/admin/AdminReports';

import NotFound from './pages/NotFound';
import Login from './pages/auth/Login';
import LandingPage from './pages/LandingPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Trang chủ Landing Page */}
          <Route path="/" element={<LandingPage />} />

          {/* Trang Đăng nhập cán bộ y tế */}
          <Route path="/login" element={<Login />} />

          {/* Giao diện Bác sĩ Lâm sàng (Clinical Doctor Portal) */}
          <Route path="/doctor" element={<DashboardLayout />}>
            <Route index element={<DoctorQueue />} />
            <Route path="exam" element={<ExaminationRoom />} />
            <Route path="prescriptions" element={<DoctorPrescriptions />} />
            <Route path="labs" element={<DoctorLabs />} />
            <Route path="schedule" element={<DoctorSchedule />} />
          </Route>

          {/* Giao diện Bác sĩ Cận lâm sàng (Paraclinical Doctor Portal) */}
          <Route path="/paraclinical" element={<DashboardLayout />}>
            <Route index element={<ParaclinicalDashboard />} />
            <Route path="schedule" element={<ParaclinicalSchedule />} />
          </Route>

          {/* Giao diện Quản trị viên (Admin Portal) */}
          <Route path="/admin" element={<DashboardLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="departments" element={<DepartmentManagement />} />
            <Route path="reports" element={<AdminReports />} />
          </Route>

          {/* Giao diện bệnh nhân */}
          <Route path="/patient" element={<PatientLayout />}>
            <Route index element={<PatientHome />} />
            <Route path="booking" element={<PatientBooking />} />
          </Route>

          {/* Giao diện xác thực tập trung: tự động chuyển về trang login thống nhất */}
          <Route path="/patient/login" element={<Navigate to="/login?role=patient" replace />} />

          <Route path="/patient/register" element={<AuthLayout />}>
            <Route index element={<PatientRegister />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
