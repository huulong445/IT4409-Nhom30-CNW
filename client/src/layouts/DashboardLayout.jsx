import React, { useEffect } from 'react';
import { Outlet, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

const DashboardLayout = () => {
  const location = useLocation();
  const { user, switchRole } = useAuth();

  useEffect(() => {
    if (!user) return;
    if (location.pathname.startsWith('/admin') && user.role !== 'ADMIN') {
      switchRole('ADMIN');
    } else if (location.pathname.startsWith('/paraclinical') && user.role !== 'PARACLINICAL') {
      switchRole('PARACLINICAL');
    } else if (location.pathname.startsWith('/doctor') && user.role !== 'DOCTOR') {
      switchRole('DOCTOR');
    }
  }, [location.pathname, user, switchRole]);

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f4f6f9]">
      <Header />
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
