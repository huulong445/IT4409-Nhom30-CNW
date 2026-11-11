import React from 'react';
import { MOCK_DEPARTMENTS } from '../../services/mockData';
import { 
  Users, 
  Building2, 
  Activity, 
  TrendingUp, 
  DollarSign, 
  UserCheck, 
  Clock, 
  AlertCircle,
  FileSpreadsheet,
  ArrowUpRight
} from 'lucide-react';

const AdminDashboard = () => {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Activity className="w-7 h-7 text-[#004282]" />
            Bảng Điều Hành Trung Tâm Bệnh Viện
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Dữ liệu giám sát thời gian thực toàn hệ thống Bệnh viện Bách Khoa
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            Hệ thống HIS hoạt động bình thường
          </span>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Lượt khám hôm nay</span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#004282] flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 mt-3">1,415</div>
          <div className="text-xs text-emerald-600 font-medium mt-1 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> +12.4% so với tuần trước
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Bác sĩ & Nhân sự trực</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 mt-3">84 / 92</div>
          <div className="text-xs text-slate-500 font-medium mt-1">
            Tại 38 phòng khám chuyên khoa
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Công suất phòng khám</span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 mt-3">89.2%</div>
          <div className="text-xs text-amber-600 font-medium mt-1">
            Cao điểm: 08:30 - 10:30
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Viện phí & Dịch vụ</span>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 mt-3">482.6 tr</div>
          <div className="text-xs text-purple-600 font-medium mt-1">
            BHYT thanh toán: 64.5%
          </div>
        </div>
      </div>

      {/* Department Patient Load Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
            <Building2 className="w-5 h-5 text-[#004282]" />
            Phân Bổ Lượng Bệnh Nhân Theo Các Khoa Phòng
          </h3>
          <span className="text-xs text-slate-500">Cập nhật tự động 5 phút/lần</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-[#f8fafc] text-slate-700 text-xs uppercase font-semibold border-b">
              <tr>
                <th className="py-3 px-4">Khoa Phòng Chuyên Môn</th>
                <th className="py-3 px-4">Vị trí tòa nhà</th>
                <th className="py-3 px-4 text-center">Bác sĩ đang trực</th>
                <th className="py-3 px-4 text-center">Lượt khám hôm nay</th>
                <th className="py-3 px-4">Tải công suất</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {MOCK_DEPARTMENTS.map(dept => {
                const percentage = Math.min(100, Math.round((dept.totalPatientsToday / 400) * 100));
                return (
                  <tr key={dept.id} className="hover:bg-slate-50 transition">
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {dept.name}
                      <span className="ml-2 font-mono text-xs text-slate-400 font-normal">({dept.code})</span>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-600">{dept.location}</td>
                    <td className="py-3.5 px-4 text-center font-semibold text-slate-800">{dept.activeDoctors} BS</td>
                    <td className="py-3.5 px-4 text-center font-bold text-[#004282]">{dept.totalPatientsToday}</td>
                    <td className="py-3.5 px-4 w-48">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${percentage > 85 ? 'bg-red-500' : percentage > 60 ? 'bg-blue-600' : 'bg-emerald-500'}`} 
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-semibold text-slate-700 w-8">{percentage}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
