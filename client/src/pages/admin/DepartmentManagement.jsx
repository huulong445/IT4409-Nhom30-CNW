import React, { useState } from 'react';
import { MOCK_DEPARTMENTS } from '../../services/mockData';
import { Building2, Search, Plus, MapPin, Users, Activity } from 'lucide-react';

const DepartmentManagement = () => {
  const [departments, setDepartments] = useState(MOCK_DEPARTMENTS);
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = departments.filter(d => 
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Building2 className="w-7 h-7 text-[#004282]" />
            Danh Mục Khoa Phòng & Khu Vực Chuyên Môn
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Quản lý sơ đồ tổ chức khoa lâm sàng, cận lâm sàng và phòng khám bệnh viện
          </p>
        </div>

        <button className="flex items-center gap-2 px-4 py-2.5 bg-[#004282] hover:bg-[#003366] text-white rounded-xl font-semibold shadow-sm text-xs transition">
          <Plus className="w-4 h-4" />
          Thêm khoa phòng mới
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(dept => (
          <div key={dept.id} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono text-xs font-bold bg-blue-50 text-[#004282] px-2 py-0.5 rounded border border-blue-100">
                {dept.code}
              </span>
              <span className="text-xs text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                Hoạt động
              </span>
            </div>

            <h3 className="font-bold text-slate-900 text-base mb-2">{dept.name}</h3>

            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{dept.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-slate-400 shrink-0" />
                <span>Quy mô: <strong>{dept.activeDoctors} Bác sĩ chuyên khoa</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-slate-400 shrink-0" />
                <span>Lượt khám hôm nay: <strong className="text-[#004282]">{dept.totalPatientsToday} ca</strong></span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DepartmentManagement;
