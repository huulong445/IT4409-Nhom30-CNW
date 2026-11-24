import { FileSpreadsheet, AlertCircle } from "lucide-react";

export default function AdminReports() {
  return <div className="mx-auto max-w-6xl space-y-5">
    <h1 className="flex items-center gap-2 text-2xl font-bold text-slate-900"><FileSpreadsheet className="text-[#004282]" /> Thống kê & viện phí</h1>
    <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
      <AlertCircle className="mt-0.5 shrink-0" size={19} />
      <div><p className="font-bold">Chưa tích hợp API báo cáo</p>
        <p className="mt-2">Backend chưa có endpoint tổng hợp doanh thu, lượt khám, công suất hoặc chi trả BHYT. Để không cung cấp số liệu giả, trang chưa hiển thị bảng báo cáo và không cho xuất file thống kê.</p></div>
    </div>
  </div>;
}
