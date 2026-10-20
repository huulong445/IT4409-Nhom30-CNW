import React from 'react';
import { FileSpreadsheet, Download, TrendingUp, DollarSign, Calendar } from 'lucide-react';

const AdminReports = () => {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <FileSpreadsheet className="w-7 h-7 text-[#004282]" />
            Báo Cáo Thống Kê & Doanh Thu Viện Phí
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Tổng hợp dữ liệu theo biểu mẫu 79a/BHYT, 80a/BHYT của Bộ Y Tế
          </p>
        </div>

        <button className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold shadow-sm text-xs transition">
          <Download className="w-4 h-4" />
          Xuất file Excel báo cáo
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 uppercase">Tổng doanh thu tháng 10/2026</div>
          <div className="text-2xl font-bold text-slate-900 mt-2">12,850,000,000 đ</div>
          <div className="text-xs text-emerald-600 mt-1">Đạt 104% kế hoạch tháng</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 uppercase">Quyết toán BHYT đề nghị</div>
          <div className="text-2xl font-bold text-[#004282] mt-2">8,290,000,000 đ</div>
          <div className="text-xs text-blue-600 mt-1">Tỷ lệ duyệt tạm tính 98.6%</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 uppercase">Doanh thu dịch vụ yêu cầu</div>
          <div className="text-2xl font-bold text-amber-600 mt-2">4,560,000,000 đ</div>
          <div className="text-xs text-amber-600 mt-1">Khám chuyên gia, nội soi gây mê...</div>
        </div>
      </div>
    </div>
  );
};

export default AdminReports;
