import React from 'react';
import { MOCK_LAB_RESULTS_DETAILS } from '../services/mockData';
import { 
  X, 
  Printer, 
  Download, 
  ShieldCheck, 
  Activity, 
  FileText, 
  CheckCircle2, 
  AlertTriangle,
  QrCode
} from 'lucide-react';

const LabResultModal = ({ isOpen, onClose, labTest, patient }) => {
  if (!isOpen || !labTest) return null;

  const testDetails = MOCK_LAB_RESULTS_DETAILS[labTest.code] || {
    testName: labTest.name.toUpperCase(),
    dept: "TRUNG TÂM XÉT NGHIỆM - BỆNH VIỆN ĐẠI HỌC Y HÀ NỘI",
    sampleType: "Mẫu bệnh phẩm đạt tiêu chuẩn",
    sampleTime: "08:00 - 20/10/2026",
    resultTime: "08:30 - 20/10/2026",
    techName: "KTV. Phạm Anh Tuấn",
    approvedBy: "TS.BS. Lê Hoàng Long",
    type: "TABLE",
    parameters: [
      { name: labTest.name, value: "Trong giới hạn", unit: "-", ref: "Bình thường", status: "NORMAL" }
    ],
    conclusion: "Kết quả xét nghiệm hiện tại chưa ghi nhận dấu hiệu bất thường."
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto max-h-[92vh]">
        {/* Top bar modal control */}
        <div className="bg-[#004282] text-white px-5 py-3 flex items-center justify-between no-print shrink-0">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-200" />
            <span className="font-bold text-sm tracking-wide">
              PHIẾU THÔNG SỐ KẾT QUẢ CẬN LÂM SÀNG
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-semibold transition"
            >
              <Printer className="w-3.5 h-3.5" />
              In phiếu
            </button>
            <button
              onClick={onClose}
              className="p-1 hover:bg-white/20 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Paper Canvas (Chuẩn biểu mẫu y tế Bộ Y Tế & BV ĐH Y Hà Nội) */}
        <div className="p-6 overflow-y-auto space-y-5 bg-white text-slate-800 text-xs">
          {/* Header Biểu Mẫu */}
          <div className="flex items-start justify-between border-b pb-3 border-slate-200">
            <div className="space-y-0.5">
              <div className="text-[11px] font-semibold text-slate-500 uppercase">
                BỘ GIÁO DỤC & ĐÀO TẠO - ĐẠI HỌC BÁCH KHOA HÀ NỘI
              </div>
              <div className="text-base font-black text-[#004282] uppercase tracking-tight">
                BỆNH VIỆN BÁCH KHOA
              </div>
              <div className="text-[11px] font-bold text-slate-700">
                {testDetails.dept}
              </div>
              <div className="text-[10px] text-slate-400">
                Địa chỉ: Số 1 Đại Cồ Việt, Hai Bà Trưng, Hà Nội • Hotline: 1900 6868
              </div>
            </div>

            <div className="text-right flex flex-col items-end">
              <div className="font-mono text-[10px] bg-slate-100 px-2 py-1 rounded border border-slate-200 font-bold">
                MÃ XN: {labTest.code}
              </div>
              <div className="mt-1 text-[10px] text-slate-400">
                Số lưu: <strong>BKH-LAB-{labTest.id || '01'}</strong>
              </div>
              <div className="mt-1 flex items-center gap-1 text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                <ShieldCheck className="w-3 h-3" /> Đã ký số bảo mật
              </div>
            </div>
          </div>

          {/* Tiêu đề phiếu */}
          <div className="text-center space-y-1">
            <h2 className="text-lg font-black text-slate-900 uppercase tracking-wide">
              {testDetails.testName}
            </h2>
            <div className="text-[11px] text-slate-500 italic">
              Loại bệnh phẩm: <strong>{testDetails.sampleType}</strong> • Thời gian lấy mẫu: <strong>{testDetails.sampleTime}</strong>
            </div>
          </div>

          {/* Khung Thông Tin Hành Chính Bệnh Nhân */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <div>
              <span className="text-slate-500">Họ và tên:</span>{' '}
              <strong className="text-slate-900 font-bold text-sm uppercase">{patient?.fullName || 'Nguyễn Thị Mai Lan'}</strong>
            </div>
            <div>
              <span className="text-slate-500">Mã bệnh nhân:</span>{' '}
              <strong className="font-mono text-slate-800">{patient?.patientId || 'BN-2024-0089'}</strong>
            </div>
            <div>
              <span className="text-slate-500">Năm sinh / Tuổi:</span>{' '}
              <strong>{patient?.dob || '1978'} ({patient?.age || '48'} tuổi)</strong> - {patient?.gender || 'Nữ'}
            </div>
            <div className="col-span-2">
              <span className="text-slate-500">Địa chỉ:</span>{' '}
              <span>{patient?.address || 'Số 15 phố Chùa Bộc, Đống Đa, Hà Nội'}</span>
            </div>
            <div>
              <span className="text-slate-500">BHYT:</span>{' '}
              <strong className="font-mono text-emerald-700">{patient?.insuranceNumber || 'DN4010123894712'}</strong>
            </div>
            <div>
              <span className="text-slate-500">Khoa chỉ định:</span>{' '}
              <strong>Khoa Khám bệnh - P.204</strong>
            </div>
            <div>
              <span className="text-slate-500">Bác sĩ chỉ định:</span>{' '}
              <strong>PGS.TS. Nguyễn Văn Trung</strong>
            </div>
            <div>
              <span className="text-slate-500">Thời gian trả kết quả:</span>{' '}
              <strong className="text-[#004282]">{testDetails.resultTime}</strong>
            </div>
          </div>

          {/* NỘI DUNG KẾT QUẢ / BẢNG THÔNG SỐ */}
          {testDetails.type === 'TABLE' ? (
            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#f1f5f9] text-slate-700 font-bold border-b uppercase text-[11px]">
                  <tr>
                    <th className="py-2.5 px-3 w-10 text-center">STT</th>
                    <th className="py-2.5 px-3">Tên xét nghiệm / Thông số</th>
                    <th className="py-2.5 px-3 text-right">Kết quả</th>
                    <th className="py-2.5 px-3">Đơn vị</th>
                    <th className="py-2.5 px-3">Trị số bình thường</th>
                    <th className="py-2.5 px-3 text-center">Đánh giá</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {testDetails.parameters.map((param, index) => {
                    const isHigh = param.status === 'HIGH';
                    const isLow = param.status === 'LOW';
                    return (
                      <tr key={index} className={`hover:bg-slate-50 ${isHigh || isLow ? 'bg-amber-50/50 font-semibold' : ''}`}>
                        <td className="py-2 px-3 text-center text-slate-400">{index + 1}</td>
                        <td className="py-2 px-3 font-medium text-slate-800">{param.name}</td>
                        <td className={`py-2 px-3 text-right font-bold text-sm ${isHigh ? 'text-red-600' : isLow ? 'text-blue-600' : 'text-slate-900'}`}>
                          {param.value}
                        </td>
                        <td className="py-2 px-3 text-slate-500 font-mono text-[11px]">{param.unit}</td>
                        <td className="py-2 px-3 text-slate-500 font-mono text-[11px]">{param.ref}</td>
                        <td className="py-2 px-3 text-center">
                          {isHigh ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded">
                              ▲ {param.alert || 'Tăng'}
                            </span>
                          ) : isLow ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                              ▼ {param.alert || 'Giảm'}
                            </span>
                          ) : (
                            <span className="text-emerald-600 text-[11px] font-medium">Bình thường</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            /* Đối với Điện tâm đồ / X-Quang / Siêu âm */
            <div className="space-y-3">
              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-2.5">
                <h4 className="font-bold text-slate-800 text-xs uppercase border-b pb-1.5 flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-[#004282]" />
                  Mô Tả Chi Tiết Các Thông Số Kỹ Thuật:
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                  {testDetails.findings?.map((item, idx) => (
                    <div key={idx} className="p-2 rounded-lg bg-white border border-slate-100">
                      <span className="font-bold text-slate-700 block text-[11px]">{item.title}:</span>
                      <span className="text-slate-900 mt-0.5 block">{item.detail}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Kết Luận Của Bác Sĩ Chuyên Khoa */}
          <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200">
            <span className="font-bold text-[#004282] uppercase text-xs block mb-1">
              KẾT LUẬN CẬN LÂM SÀNG:
            </span>
            <p className="text-slate-800 text-xs font-semibold leading-relaxed">
              {testDetails.conclusion}
            </p>
          </div>

          {/* Chữ ký cán bộ thực hiện & phê duyệt */}
          <div className="grid grid-cols-2 gap-6 pt-4 text-center text-xs">
            <div>
              <span className="font-bold text-slate-700 uppercase block">KỸ THUẬT VIÊN THỰC HIỆN</span>
              <span className="text-[10px] text-slate-400 italic block mt-0.5">(Đã ký số điện tử)</span>
              <div className="h-12 flex items-center justify-center font-serif text-slate-400 italic text-sm">
                {testDetails.techName}
              </div>
              <strong className="text-slate-900 block font-semibold">{testDetails.techName}</strong>
            </div>

            <div>
              <span className="text-[10px] text-slate-500 italic block">Hà Nội, Ngày 20 tháng 10 năm 2026</span>
              <span className="font-bold text-slate-700 uppercase block mt-0.5">BÁC SĨ DUYỆT KẾT QUẢ</span>
              <div className="h-12 flex items-center justify-center font-serif text-[#004282] italic text-sm font-bold">
                {testDetails.approvedBy}
              </div>
              <strong className="text-slate-900 block font-semibold">{testDetails.approvedBy}</strong>
            </div>
          </div>
        </div>

        {/* Footer Modal Actions */}
        <div className="p-3.5 bg-slate-50 border-t flex justify-end gap-2 no-print shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-xl transition"
          >
            Đóng
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-[#004282] hover:bg-[#002f5e] text-white rounded-xl shadow transition"
          >
            <Printer className="w-3.5 h-3.5" />
            In phiếu kết quả
          </button>
        </div>
      </div>
    </div>
  );
};

export default LabResultModal;
