import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import {
  PhoneCall,
  MapPin,
  Bell,
  Shield,
  Stethoscope,
  FlaskConical,
  User,
  LogOut,
  ChevronDown,
} from "lucide-react";

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const result = await logout();
    navigate("/");
    if (!result.success) {
      window.alert(result.message);
    }
  };

  if (!user) return null;

  return (
    <header className="w-full bg-[#004282] text-white shadow-md z-40 sticky top-0">
      {/* Top Bar - Thông tin liên hệ Bệnh Viện Bách Khoa */}
      <div className="bg-[#002f5e] text-xs py-1.5 px-4 md:px-8 border-b border-blue-900/40">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-4 text-blue-200">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-blue-300" />
              Số 1 Đại Cồ Việt, Hai Bà Trưng, Hà Nội
            </span>
            <span className="hidden sm:inline-block text-blue-400">|</span>
            <span className="hidden sm:flex items-center gap-1 text-red-300 font-medium">
              Cấp cứu 24/7:{" "}
              <strong className="text-white">024 3869 2026</strong>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-yellow-300 font-semibold bg-blue-950/60 px-2 py-0.5 rounded-full border border-yellow-500/30">
              <PhoneCall className="w-3 h-3 text-yellow-400 animate-pulse" />
              <span>Tổng đài Đặt khám: 1900 6868</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-2.5 flex items-center justify-between">
        {/* Logo & Brand Identity */}
        <Link
          to={
            user.role === "ADMIN"
              ? "/admin"
              : (user.role === "PARACLINICAL" || user.role === "LAB_TECH")
                ? "/paraclinical"
                : user.role === "RECEPTIONIST"
                  ? "/receptionist"
                  : "/doctor"
          }
          className="flex items-center gap-3 group"
        >
          <div className="w-11 h-11 rounded-lg bg-white p-1 flex items-center justify-center shadow-sm shrink-0">
            <img
              src="/logo-hmuh.png"
              alt="Logo Bệnh viện Bách Khoa"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base md:text-lg font-bold tracking-tight text-white uppercase group-hover:text-blue-200 transition-colors">
                BỆNH VIỆN BÁCH KHOA
              </h1>
            </div>
            <p className="text-xs text-blue-200 font-medium tracking-wide">
              {user.role === "ADMIN"
                ? "Hệ thống Quản trị & Điều hành Bệnh viện (Admin Portal)"
                : (user.role === "PARACLINICAL" || user.role === "LAB_TECH")
                  ? `Khu vực Cận lâm sàng • ${user.specialty}`
                  : user.role === "RECEPTIONIST"
                    ? "Quầy Tiếp Đón & Điều Phối Bệnh Nhân (Receptionist Portal)"
                    : `Phòng khám Bác sĩ Lâm sàng • ${user.specialty}`}
            </p>
          </div>
        </Link>

        {/* User Profile & Actions */}
        <div className="flex items-center gap-3">
          {/* Notification Button */}
          <span className="p-2 text-blue-200" title="Thông báo hệ thống: chưa tích hợp API">
            <Bell className="w-5 h-5" />
          </span>

          {/* User info card */}
          <div className="flex items-center gap-3 pl-3 border-l border-blue-700/60">
            {user.avatar ? <img
              src={user.avatar}
              alt={user.fullName || user.username}
              className="w-9 h-9 rounded-full object-cover border-2 border-white shadow-sm"
            /> : <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-white/20 font-bold text-white">{(user.fullName || user.username || "?").charAt(0)}</div>}
            <div className="hidden md:block text-left">
              <div className="text-sm font-semibold text-white leading-tight flex items-center gap-1.5">
                {user.fullName}
                {user.role === "DOCTOR" && (
                  <span
                    className="w-2 h-2 rounded-full bg-slate-300"
                    title="Bác sĩ"
                  ></span>
                )}
              </div>
              <div className="text-xs text-blue-200 truncate max-w-[220px]">
                {user.departmentName || "Chưa có khoa"}
                {user.room && ` • ${user.room}`}
              </div>
            </div>

      <Link
        to={
          user.role === "ADMIN"
            ? "/admin/profile"
            : user.role === "DOCTOR"
            ? "/doctor/profile"
            : "/paraclinical/profile"
        }
        className="flex items-center gap-1.5 rounded-lg border border-blue-700 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-800"
      >
        <User size={16} />
        Hồ sơ
      </Link>

            {/* Logout button */}
            <button
              onClick={handleLogout}
              className="ml-2 p-2 rounded-lg bg-blue-900/80 hover:bg-red-600/90 text-blue-200 hover:text-white transition flex items-center gap-1.5 text-xs font-semibold border border-blue-700/60"
              title="Đăng xuất khỏi tài khoản"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden lg:inline">Đăng xuất</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
