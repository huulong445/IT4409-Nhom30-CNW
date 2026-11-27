import React from "react";
import { Calendar, AlertCircle } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

const ReceptionistSchedule = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Lịch Trực Quầy Tiếp Đón
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Nhân viên: <strong className="text-slate-700">{user?.name || user?.username}</strong>
        </p>
      </div>

      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <p className="text-sm text-amber-900">
          Backend chưa cung cấp API lấy lịch trực riêng cho tài khoản Tiếp tân (<code className="font-mono bg-amber-100 px-1 rounded">RECEPTIONIST</code>).
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-10 text-center">
        <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-3" />
        <h3 className="text-base font-semibold text-slate-800">
          Chưa có dữ liệu lịch trực
        </h3>
        <p className="text-sm text-slate-500 max-w-md mx-auto mt-1">
          Lịch phân công ca trực quầy tiếp đón sẽ tự động hiển thị khi Backend bổ sung endpoint lịch trực cho tiếp tân.
        </p>
      </div>
    </div>
  );
};

export default ReceptionistSchedule;
