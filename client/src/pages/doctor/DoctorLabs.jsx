import React, { useState } from 'react';
import { FlaskConical, Search, CheckCircle2, Clock, Eye, Download } from 'lucide-react';
import { MOCK_QUEUE } from '../../services/mockData';
import LabResultModal from '../../components/LabResultModal';

const DoctorLabs = () => {
  const [selectedLab, setSelectedLab] = useState(null);
  const [patient, setPatient] = useState(MOCK_QUEUE[0]);

  const labList = [
    {
      id: 1,
      patientName: "Nguyễn Thị Mai Lan",
      patientId: "BN-2024-0089",
      gender: "Nữ",
      age: 48,
      dob: "1978-05-14",
      phone: "0912 345 678",
      insuranceNumber: "DN4010123894712",
      address: "Số 15 phố Chùa Bộc, Đống Đa, Hà Nội",
      testName: "Tổng phân tích tế bào máu ngoại vi (24 thông số)",
      code: "XN-HH-01",
      sampleTime: "07:50 - 20/10/2026",
      status: "COMPLETED",
      statusText: "Đã có kết quả"
    },
    {
      id: 2,
      patientName: "Nguyễn Thị Mai Lan",
      patientId: "BN-2024-0089",
      gender: "Nữ",
      age: 48,
      dob: "1978-05-14",
      phone: "0912 345 678",
      insuranceNumber: "DN4010123894712",
      address: "Số 15 phố Chùa Bộc, Đống Đa, Hà Nội",
      testName: "Điện tâm đồ thông thường (ECG 12 chuyển đạo)",
      code: "CDHA-ECG",
      sampleTime: "07:55 - 20/10/2026",
      status: "COMPLETED",
      statusText: "Đã có kết quả: Nhịp xoang 78ck/p"
    },
    {
      id: 3,
      patientName: "Trần Đình Trọng",
      patientId: "BN-2024-0102",
      gender: "Nam",
      age: 62,
      dob: "1964-11-20",
      phone: "0983 112 233",
      insuranceNumber: "HT3010992837119",
      address: "Cầu Giấy, Hà Nội",
      testName: "Bộ mỡ máu toàn phần (Lipid profile)",
      code: "XN-SH-03",
      sampleTime: "08:25 - 20/10/2026",
      status: "COMPLETED",
      statusText: "Đã có kết quả: Rối loạn lipid máu"
    },
    {
      id: 4,
      patientName: "Lê Hoàng Phúc",
      patientId: "BN-2024-0145",
      gender: "Nam",
      age: 29,
      dob: "1997-03-08",
      phone: "0904 889 900",
      insuranceNumber: "",
      address: "Hai Bà Trưng, Hà Nội",
      testName: "Siêu âm Doppler Tim qua thành ngực",
      code: "CDHA-SATM",
      sampleTime: "08:40 - 20/10/2026",
      status: "COMPLETED",
      statusText: "Đã có kết quả: EF 64%"
    },
    {
      id: 5,
      patientName: "Vũ Thị Hương",
      patientId: "BN-2024-0158",
      gender: "Nữ",
      age: 71,
      dob: "1955-08-25",
      phone: "0977 445 566",
      insuranceNumber: "GD4010582910482",
      address: "Thanh Xuân, Hà Nội",
      testName: "Chụp X-quang ngực thẳng kỹ thuật số (CR/DR)",
      code: "CDHA-XQN",
      sampleTime: "09:05 - 20/10/2026",
      status: "COMPLETED",
      statusText: "Đã có kết quả: Bình thường"
    }
  ];

  const handleOpenSlip = (item) => {
    setSelectedLab({
      id: item.id,
      name: item.testName,
      code: item.code
    });
    setPatient({
      fullName: item.patientName,
      patientId: item.patientId,
      gender: item.gender,
      age: item.age,
      dob: item.dob,
      address: item.address,
      insuranceNumber: item.insuranceNumber
    });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <FlaskConical className="w-7 h-7 text-purple-600" />
          Quản Lý Kết Quả Cận Lâm Sàng & Xét Nghiệm
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Theo dõi tiến độ trả kết quả & tra cứu phiếu thông số chi tiết từng ca khám
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-[#f8fafc] text-slate-700 text-xs uppercase font-semibold border-b">
            <tr>
              <th className="py-3 px-4">Mã BN / Bệnh nhân</th>
              <th className="py-3 px-4">Chỉ định kỹ thuật</th>
              <th className="py-3 px-4">Thời gian lấy mẫu</th>
              <th className="py-3 px-4 text-center">Trạng thái kết quả</th>
              <th className="py-3 px-4 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {labList.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50 transition">
                <td className="py-3.5 px-4 font-semibold text-slate-900">
                  {item.patientName}
                  <div className="text-xs text-slate-400 font-normal">
                    {item.gender} • {item.age} tuổi • <span className="font-mono">{item.patientId}</span>
                  </div>
                </td>
                <td className="py-3.5 px-4 text-xs">
                  <span className="font-semibold text-slate-800 block">{item.testName}</span>
                  <span className="text-slate-400 font-mono">{item.code}</span>
                </td>
                <td className="py-3.5 px-4 text-xs text-slate-500">{item.sampleTime}</td>
                <td className="py-3.5 px-4 text-center">
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5" /> {item.statusText}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-right">
                  <button 
                    onClick={() => handleOpenSlip(item)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#004282] hover:bg-[#002f5e] text-white text-xs font-semibold shadow-sm transition active:scale-95"
                  >
                    <Eye className="w-3.5 h-3.5" /> Xem phiếu thông số
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal phiếu kết quả thông số */}
      <LabResultModal
        isOpen={Boolean(selectedLab)}
        onClose={() => setSelectedLab(null)}
        labTest={selectedLab}
        patient={patient}
      />
    </div>
  );
};

export default DoctorLabs;
