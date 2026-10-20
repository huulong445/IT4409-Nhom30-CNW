import React from 'react';
import { Link } from 'react-router-dom';
import { Stethoscope, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-[#f4f6f9] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center text-[#004282] mb-4">
        <Stethoscope className="w-8 h-8" />
      </div>
      <h1 className="text-4xl font-black text-slate-800">404</h1>
      <p className="text-slate-600 mt-2 font-medium">Trang không tìm thấy hoặc bạn không có quyền truy cập.</p>
      <Link 
        to="/doctor" 
        className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-[#004282] text-white rounded-xl text-sm font-semibold shadow hover:bg-[#002f5e] transition"
      >
        <ArrowLeft className="w-4 h-4" /> Quay lại trang Bác sĩ
      </Link>
    </div>
  );
};

export default NotFound;
