
import { Outlet, Link } from 'react-router-dom';
import {
  HeartPulse, Phone, MapPin,
  LogIn, UserPlus
} from 'lucide-react';

export default function PatientLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">

      <header className="bg-[#004282] text-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-4">

          {/* Logo và tên bệnh viện */}
          <Link to="/patient" className="flex items-center gap-3">
            <div className="bg-white/15 rounded-xl p-2">
              <HeartPulse size={28} />
            </div>

            <div>
              <h1 className="font-bold text-base md:text-xl">
                BỆNH VIỆN BÁCH KHOA
              </h1>
              <p className="text-blue-100 text-xs md:text-sm">
                Cổng thông tin dành cho người bệnh
              </p>
            </div>
          </Link>

          {/* Các nút xác thực bệnh nhân */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              to="/patient/login"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-white/30 text-sm font-semibold hover:bg-white/10 transition"
            >
              <LogIn size={17} />
              Đăng nhập
            </Link>

            <Link
              to="/patient/register"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-[#004282] rounded-lg text-sm font-semibold hover:bg-blue-50 transition"
            >
              <UserPlus size={17} />
              Đăng ký
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full">
        <Outlet />
      </main>

      <footer className="bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-6 text-sm text-slate-500 flex flex-col md:flex-row justify-between gap-3">
          <span>
            © 2026 - Hệ thống quản lý khám chữa bệnh
          </span>

          <div className="flex flex-wrap gap-4">
            <span className="flex items-center gap-1">
              <MapPin size={15} />
              Hà Nội, Việt Nam
            </span>
            <span className="flex items-center gap-1">
              <Phone size={15} />
              Trung tâm hỗ trợ
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
