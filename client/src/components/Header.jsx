import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { 
  PhoneCall, 
  MapPin, 
  Bell, 
  Shield, 
  Stethoscope, 
  FlaskConical,
  User, 
  LogOut,
  ChevronDown
} from 'lucide-react';

const Header = () => {
  const { user, switchRole, logout } = useAuth();
  const navigate = useNavigate();

  const handleRoleChange = (role) => {
    switchRole(role);
    if (role === 'ADMIN') {
      navigate('/admin');
    } else if (role === 'PARACLINICAL') {
      navigate('/paraclinical');
    } else {
      navigate('/doctor');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
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
              Cấp cứu 24/7: <strong className="text-white">024 3869 2026</strong>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-yellow-300 font-semibold bg-blue-950/60 px-2 py-0.5 rounded-full border border-yellow-500/30">
              <PhoneCall className="w-3 h-3 text-yellow-400 animate-pulse" />
              <span>Tổng đài Đặt khám: 1900 6868</span>
            </div>

            {/* Chuyển đổi vai trò demo: Bác sĩ Lâm sàng <-> Bác sĩ Cận lâm sàng <-> Admin */}
            <div className="flex items-center bg-blue-900/80 rounded-md p-0.5 border border-blue-700/60 text-xs">
              <button
                onClick={() => handleRoleChange('DOCTOR')}
                className={`px-2.5 py-1 rounded flex items-center gap-1 transition-all ${
                  user.role === 'DOCTOR' 
                    ? 'bg-white text-[#004282] font-semibold shadow-sm' 
                    : 'text-blue-200 hover:text-white'
                }`}
                title="Giao diện Bác sĩ Lâm sàng"
              >
                <Stethoscope className="w-3 h-3" />
                BS Lâm sàng
              </button>
              <button
                onClick={() => handleRoleChange('PARACLINICAL')}
                className={`px-2.5 py-1 rounded flex items-center gap-1 transition-all ${
                  user.role === 'PARACLINICAL' 
                    ? 'bg-white text-[#004282] font-semibold shadow-sm' 
                    : 'text-blue-200 hover:text-white'
                }`}
                title="Giao diện Bác sĩ Cận lâm sàng"
              >
                <FlaskConical className="w-3 h-3" />
                BS Cận lâm sàng
              </button>
              <button
                onClick={() => handleRoleChange('ADMIN')}
                className={`px-2.5 py-1 rounded flex items-center gap-1 transition-all ${
                  user.role === 'ADMIN' 
                    ? 'bg-white text-[#004282] font-semibold shadow-sm' 
                    : 'text-blue-200 hover:text-white'
                }`}
                title="Giao diện Quản trị viên"
              >
                <Shield className="w-3 h-3" />
                Admin
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-2.5 flex items-center justify-between">
        {/* Logo & Brand Identity */}
        <Link to={user.role === 'ADMIN' ? '/admin' : user.role === 'PARACLINICAL' ? '/paraclinical' : '/doctor'} className="flex items-center gap-3 group">
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
              {user.role === 'ADMIN' 
                ? 'Hệ thống Quản trị & Điều hành Bệnh viện (Admin Portal)' 
                : user.role === 'PARACLINICAL'
                ? `Khu vực Cận lâm sàng • ${user.specialty}`
                : `Phòng khám Bác sĩ Lâm sàng • ${user.specialty}`}
            </p>
          </div>
        </Link>

        {/* User Profile & Actions */}
        <div className="flex items-center gap-3">
          {/* Notification Button */}
          <button className="relative p-2 rounded-full hover:bg-blue-800/60 transition text-blue-200 hover:text-white" title="Thông báo hệ thống">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#004282]"></span>
          </button>

          {/* User info card */}
          <div className="flex items-center gap-3 pl-3 border-l border-blue-700/60">
            <img 
              src={user.avatar} 
              alt={user.fullName} 
              className="w-9 h-9 rounded-full object-cover border-2 border-white shadow-sm"
            />
            <div className="hidden md:block text-left">
              <div className="text-sm font-semibold text-white leading-tight flex items-center gap-1.5">
                {user.fullName}
                {user.role === 'DOCTOR' && (
                  <span className="w-2 h-2 rounded-full bg-emerald-400" title="Đang trực"></span>
                )}
              </div>
              <div className="text-xs text-blue-200 truncate max-w-[220px]">
                {user.departmentName}
                {user.room && ` • ${user.room}`}
              </div>
            </div>

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
