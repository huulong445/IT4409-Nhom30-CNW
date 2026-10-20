import React, { useState } from 'react';
import { MOCK_COMMON_MEDICATIONS } from '../../services/mockData';
import { Pill, Search, ShieldCheck, AlertCircle, FileText } from 'lucide-react';

const DoctorPrescriptions = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredMeds = MOCK_COMMON_MEDICATIONS.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">
            Kho Thuốc
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Tra cứu tồn kho nhà thuốc bệnh viện, liều dùng và danh mục chi trả BHYT
          </p>
        </div>

        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm tên hoạt chất, biệt dược..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#004282]/20"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-[#f8fafc] text-slate-700 text-xs uppercase font-semibold border-b">
            <tr>
              <th className="py-3 px-4">Tên biệt dược & Hàm lượng</th>
              <th className="py-3 px-4">Đơn vị</th>
              <th className="py-3 px-4">Hướng dẫn dùng chuẩn</th>
              <th className="py-3 px-4 text-center">Tồn kho bệnh viện</th>
              <th className="py-3 px-4 text-center">BHYT</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredMeds.map(med => (
              <tr key={med.id} className="hover:bg-slate-50 transition">
                <td className="py-3.5 px-4 font-semibold text-slate-900">{med.name}</td>
                <td className="py-3.5 px-4">{med.unit}</td>
                <td className="py-3.5 px-4 text-slate-600 text-xs">{med.defaultUsage}</td>
                <td className="py-3.5 px-4 text-center">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                    med.stock > 500 ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                  }`}>
                    {med.stock} {med.unit}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-center">
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    <ShieldCheck className="w-3 h-3" /> Chi trả 100%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DoctorPrescriptions;
