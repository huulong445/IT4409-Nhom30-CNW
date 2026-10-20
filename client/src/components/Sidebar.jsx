import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Users, 
  Stethoscope, 
  ClipboardList, 
  Pill, 
  FlaskConical, 
  Calendar, 
  LayoutDashboard, 
  Building2, 
  FileSpreadsheet, 
  Settings,
  HelpCircle,
  Activity
} from 'lucide-react';

const Sidebar = () => {
  const { user } = useAuth();

  const doctorNavItems = [
    { 
      to: "/doctor", 
      icon: ClipboardList, 
      label: "Hàng đợi khám bệnh", 
      badge: "5",
      badgeColor: "bg-slate-100 text-slate-700 border border-slate-200" 
    },
    { 
      to: "/doctor/exam", 
      icon: Stethoscope, 
      label: "Phòng khám bệnh", 
      sub: "Bệnh nhân hiện tại" 
    },
    { 
      to: "/doctor/prescriptions", 
      icon: Pill, 
      label: "Kho thuốc", 
    },
    { 
      to: "/doctor/schedule", 
      icon: Calendar, 
      label: "Lịch trực phòng khám", 
    },
  ];

  const paraclinicalNavItems = [
    { 
      to: "/paraclinical", 
      icon: FlaskConical, 
      label: "Tiếp nhận & Trả KQ CLS", 
      badge: "3",
      badgeColor: "bg-slate-100 text-slate-700 border border-slate-200" 
    },
    { 
      to: "/paraclinical/schedule", 
      icon: Calendar, 
      label: "Lịch trực phòng kỹ thuật", 
    },
  ];

  const adminNavItems = [
    { 
      to: "/admin", 
      icon: LayoutDashboard, 
      label: "Tổng quan điều hành", 
      exact: true 
    },
    { 
      to: "/admin/users", 
      icon: Users, 
      label: "Quản lý Người dùng & Bác sĩ", 
    },
    { 
      to: "/admin/departments", 
      icon: Building2, 
      label: "Quản lý Khoa phòng & Dịch vụ", 
    },
    { 
      to: "/admin/reports", 
      icon: FileSpreadsheet, 
      label: "Thống kê & Viện phí", 
    },
  ];

  const currentNav = user.role === 'ADMIN' 
    ? adminNavItems 
    : user.role === 'PARACLINICAL' 
    ? paraclinicalNavItems 
    : doctorNavItems;

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between shrink-0 min-h-[calc(100vh-100px)]">
      <div className="p-4">
        {/* Portal status badge */}
        <div className="mb-4 p-3 rounded-lg bg-slate-50 border border-slate-200">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-800 uppercase tracking-wide">
            <Activity className="w-3.5 h-3.5 text-slate-600" />
            {user.role === 'ADMIN' 
              ? 'Chế độ Quản trị' 
              : user.role === 'PARACLINICAL' 
              ? 'Khu vực Cận lâm sàng' 
              : 'Khu vực Lâm sàng'}
          </div>
          <p className="text-xs text-slate-600 mt-1">
            {user.role === 'ADMIN' 
              ? 'Toàn quyền kiểm soát tài khoản và hệ thống' 
              : `${user.departmentName} - ${user.room}`}
          </p>
        </div>

        {/* Navigation links */}
        <nav className="space-y-1">
          {currentNav.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/doctor" || item.to === "/admin" || item.to === "/paraclinical"}
                className={({ isActive }) => `
                  flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all
                  ${isActive 
                    ? 'bg-[#004282] text-white shadow-sm font-semibold' 
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}
                `}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Footer Support / Hotline info box */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50">
        <div className="text-xs text-slate-500 space-y-1.5">
          <div className="flex items-center gap-1.5 font-semibold text-slate-700">
            <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
            <span>Hỗ trợ kỹ thuật CNTT</span>
          </div>
          <p>Nội bộ: <strong>#8124</strong> (Giờ hành chính)</p>
          <p className="text-[11px] text-slate-400">Phiên bản HIS v2.5.0 - BKH (Bệnh viện Bách Khoa)</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
