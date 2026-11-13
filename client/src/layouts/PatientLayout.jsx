import { Outlet, Link } from "react-router-dom";
import {
  HeartPulse,
  Phone,
  MapPin,
  LogIn,
  UserPlus,
  LogOut,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export default function PatientLayout() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    const result = await logout();
    if (!result.success) {
      window.alert(result.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      <header className="bg-[#004282] text-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-4">
          {/* Logo và tên bệnh viện - Về trang chủ */}
          <Link
            to="/"
            className="flex items-center gap-3 group"
            title="Về Trang chủ Bệnh viện"
          >
            <div className="bg-white/15 rounded-xl p-2 group-hover:scale-105 transition-transform">
              <HeartPulse size={28} />
            </div>

            <div>
              <h1 className="font-bold text-base md:text-xl group-hover:text-blue-100 transition">
                BỆNH VIỆN BÁCH KHOA
              </h1>
              <p className="text-blue-100 text-xs md:text-sm">
                Cổng thông tin dành cho người bệnh
              </p>
            </div>
          </Link>

          {/* Các nút xác thực bệnh nhân & về trang chủ */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-blue-100 hover:text-white hover:bg-white/10 transition font-medium"
            >
              Trang chủ
            </Link>

            {user ? (
              <div className="flex items-center gap-2.5">
                <div className="flex items-center gap-2 bg-white/15 px-3 py-1.5 rounded-xl border border-white/20">
                  <img
                    src={user.avatar}
                    alt={user.fullName}
                    className="w-7 h-7 rounded-full object-cover border border-white/40"
                  />
                  <div className="text-left hidden sm:block">
                    <div className="text-xs font-bold text-white leading-tight">
                      {user.fullName}
                    </div>
                    <div className="text-[10px] text-blue-200">
                      {user.role === "PATIENT"
                        ? user.patientId || "Bệnh nhân"
                        : user.specialty || user.role}
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-600/80 hover:bg-red-600 text-white text-xs font-semibold transition"
                  title="Đăng xuất"
                >
                  <LogOut size={15} />
                  <span className="hidden md:inline">Đăng xuất</span>
                </button>
              </div>
            ) : (
              <>
                <Link
                  to="/login?role=patient"
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
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 w-full">
        <Outlet />
      </main>

      <footer className="bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-6 text-sm text-slate-500 flex flex-col md:flex-row justify-between gap-3">
          <span>© 2026 - Hệ thống quản lý khám chữa bệnh</span>

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
