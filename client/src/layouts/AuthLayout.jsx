
import { Link, Outlet } from 'react-router-dom';
import { HeartPulse, ArrowLeft, ShieldCheck } from 'lucide-react';

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f4f7fb]">
      <header className="bg-[#004282] text-white">
        <div className="max-w-6xl mx-auto px-5 py-5 flex items-center justify-between gap-3">
          <Link to="/patient" className="flex items-center gap-3">
            <div className="bg-white/15 p-2 rounded-xl">
              <HeartPulse size={28} />
            </div>
            <div>
              <h1 className="font-bold text-sm sm:text-lg">
                BỆNH VIỆN BÁCH KHOA
              </h1>
              <p className="text-blue-100 text-xs">
                Cổng thông tin người bệnh
              </p>
            </div>
          </Link>

          <Link
            to="/patient"
            className="flex items-center gap-2 text-xs sm:text-sm hover:text-blue-200"
          >
            <ArrowLeft size={17} />
            Trang chủ
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <Outlet />

          <div className="flex items-center justify-center gap-2 mt-6 text-xs text-slate-500 text-center">
            <ShieldCheck size={16} />
            Hệ thống tài khoản người bệnh
          </div>
        </div>
      </main>

      <footer className="text-center text-xs text-slate-500 py-5 border-t bg-white">
        © 2026 - Hệ thống quản lý khám chữa bệnh
      </footer>
    </div>
  );
}
