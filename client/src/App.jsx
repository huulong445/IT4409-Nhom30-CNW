import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import DashboardLayout from './layouts/DashboardLayout';

import PatientRegister from './pages/auth/PatientRegister';
import PatientBooking from './pages/patient/PatientBooking';
import AuthLayout from './layouts/AuthLayout';
import PatientLogin from './pages/auth/PatientLogin';

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

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Trang Đăng nhập */}
          <Route path="/login" element={<Login />} />

          {/* Mặc định chuyển hướng vào giao diện Bác sĩ */}
          <Route path="/" element={<Navigate to="/doctor" replace />} />

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

          {/* Giao diện xác thực */}
          <Route path="/patient/login" element={<AuthLayout />}>
            <Route index element={<PatientLogin />} />
          </Route>

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
