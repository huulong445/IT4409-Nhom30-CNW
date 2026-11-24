import { AlertCircle, X } from "lucide-react";

// The backend exposes lab requests but no lab-results detail API yet.
// Never render MOCK_LAB_RESULTS_DETAILS as if it were a patient's report.
export default function LabResultModal({ isOpen, onClose, labTest }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" role="dialog" aria-modal="true" aria-label="Thông tin kết quả xét nghiệm">
      <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-lg">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-bold text-slate-900">Phiếu kết quả cận lâm sàng</h2>
          <button type="button" onClick={onClose} aria-label="Đóng"><X size={20}/></button>
        </div>
        {labTest?.name && <p className="mt-2 text-sm text-slate-600">Chỉ định: {labTest.name}</p>}
        <div role="status" className="mt-4 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          <AlertCircle className="shrink-0" size={19}/>
          Chưa có endpoint trả chi tiết kết quả xét nghiệm từ backend. Không thể xác nhận thông số hoặc in phiếu kết quả.
        </div>
        <button type="button" onClick={onClose} className="mt-5 rounded-lg bg-[#004282] px-4 py-2 text-sm text-white">Đóng</button>
      </div>
    </div>
  );
}
