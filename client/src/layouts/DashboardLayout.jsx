import React from 'react';
import { Outlet, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

const DashboardLayout = () => {
  const location = useLocation();
  const { user, authChecking, isDemo } = useAuth();

  if (authChecking) return <div className="p-6">Đang xác minh phiên đăng nhập...</div>;

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  const routeRoles = {
    admin: 'ADMIN',
    doctor: 'DOCTOR',
    paraclinical: 'LAB_TECH',
  };
  const roleHomes = {
    ADMIN: '/admin',
    DOCTOR: '/doctor',
    PARACLINICAL: '/paraclinical',
    LAB_TECH: '/paraclinical',
    PATIENT: '/patient',
  };
  const routeRole = routeRoles[location.pathname.split('/')[1]];
  const userRole = String(user.role || '').toUpperCase();

  if (!routeRole || (userRole !== routeRole && !(userRole === "PARACLINICAL" && routeRole === "LAB_TECH" && isDemo))) {
    return <Navigate to={roleHomes[userRole] || '/'} replace />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f4f6f9]">
      <Header />
      {isDemo && <div role="status" className="bg-amber-100 border-b border-amber-300 px-4 py-2 text-center text-sm font-semibold text-amber-900">CHẾ ĐỘ DEMO — Không có phiên backend, mọi thao tác dữ liệu thật có thể bị từ chối.</div>}
      <div className="flex-1 flex w-full">
        <Sidebar />
        <main className="flex-1 overflow-x-hidden p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default DashboardLayout;
