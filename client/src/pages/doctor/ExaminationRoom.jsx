import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  MOCK_QUEUE, 
  MOCK_ICD10_LIST, 
  MOCK_COMMON_MEDICATIONS, 
  MOCK_LAB_TESTS 
} from '../../services/mockData';
import { 
  ArrowLeft, 
  Save, 
  Printer, 
  Pill, 
  FlaskConical, 
  AlertTriangle, 
  CheckCircle2, 
  Activity, 
  User, 
  FileText, 
  Plus, 
  Trash2, 
  Search,
  Clock,
  ShieldCheck,
  Stethoscope,
  Eye
} from 'lucide-react';
import LabResultModal from '../../components/LabResultModal';

const ExaminationRoom = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Lấy bệnh nhân từ navigation state hoặc mặc định là bệnh nhân số 1
  const initialPatient = location.state?.patient || MOCK_QUEUE[0];
  const [patient, setPatient] = useState(initialPatient);

  // Vital signs state
  const [vitals, setVitals] = useState({
    bpSystolic: 135,
    bpDiastolic: 85,
    heartRate: 78,
    temperature: 36.8,
    spo2: 98,
    weight: 62,
    height: 165
  });

  // Calculate BMI
  const heightInMeters = (vitals.height || 165) / 100;
  const bmi = (vitals.weight / (heightInMeters * heightInMeters)).toFixed(1);
  const getBmiStatus = (bmiValue) => {
    if (bmiValue < 18.5) return { label: 'Thiếu cân', color: 'text-amber-600' };
    if (bmiValue < 23) return { label: 'Bình thường (Chuẩn IDI & WPRO)', color: 'text-emerald-600 font-semibold' };
    if (bmiValue < 25) return { label: 'Tiền béo phì', color: 'text-amber-600 font-semibold' };
    return { label: 'Béo phì', color: 'text-red-600 font-bold' };
  };

  // Clinical records
  const [patientNotes, setPatientNotes] = useState(
    patient.allergies && patient.allergies !== 'Không có'
      ? `Dị ứng: ${patient.allergies}. Tiền sử: ${patient.medicalHistory || 'Không có'}`
      : (patient.medicalHistory ? `Tiền sử bệnh: ${patient.medicalHistory}` : '')
  );
  const [symptoms, setSymptoms] = useState(patient.reason || '');
  const [examNotes, setExamNotes] = useState('Tim đều, T1-T2 rõ, không nghe tiếng thổi bệnh lý. Phổi thông khí tốt, không rale. Bụng mềm, gan lách không sờ chạm.');
  const [selectedIcd, setSelectedIcd] = useState('I10');
  const [diagnosisDetails, setDiagnosisDetails] = useState('Tăng huyết áp độ 1 - Nguy cơ tim mạch trung bình / Rối loạn lipid máu');
  const [doctorAdvice, setDoctorAdvice] = useState('Hạn chế ăn mặn (< 5g muối/ngày), giảm chất béo động vật. Tập thể dục đi bộ nhẹ nhàng 30 phút/ngày. Tái khám sau 1 tháng hoặc khi có đau ngực dữ dội.');

  // Prescriptions list
  const [prescriptions, setPrescriptions] = useState([
    {
      id: 1,
      name: "Amlodipine 5mg",
      quantity: 30,
      unit: "Viên",
      dosage: "1 viên/lần",
      frequency: "Sáng 1 viên sau ăn",
      duration: "30 ngày"
    },
    {
      id: 2,
      name: "Atorvastatin 20mg",
      quantity: 30,
      unit: "Viên",
      dosage: "1 viên/lần",
      frequency: "Tối 1 viên trước khi ngủ",
      duration: "30 ngày"
    }
  ]);

  // Lab orders list
  const [labOrders, setLabOrders] = useState([
    { id: 1, code: "XN-HH-01", name: "Tổng phân tích tế bào máu ngoại vi (24 thông số)", price: 95000, status: "Đã có kết quả: Bình thường" },
    { id: 6, code: "CDHA-ECG", name: "Điện tâm đồ thông thường (ECG 12 chuyển đạo)", price: 80000, status: "Đã có kết quả: Nhịp xoang 78ck/p" }
  ]);

  // Modals
  const [showMedModal, setShowMedModal] = useState(false);
  const [showLabModal, setShowLabModal] = useState(false);
  const [selectedLabForView, setSelectedLabForView] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // New medication form inside modal
  const [newMed, setNewMed] = useState({
    name: "Losartan Potassium 50mg",
    quantity: 30,
    unit: "Viên",
    dosage: "1 viên",
    frequency: "Uống 1 viên vào 08h sáng sau ăn",
    duration: "30 ngày"
  });

  const handleAddMedication = () => {
    setPrescriptions([...prescriptions, { ...newMed, id: Date.now() }]);
    setShowMedModal(false);
  };

  const handleRemoveMedication = (id) => {
    setPrescriptions(prescriptions.filter(p => p.id !== id));
  };

  const handleToggleLab = (test) => {
    if (labOrders.some(l => l.id === test.id)) {
      setLabOrders(labOrders.filter(l => l.id !== test.id));
    } else {
      setLabOrders([...labOrders, { ...test, status: "Chờ thực hiện" }]);
    }
  };

  const [toastMessage, setToastMessage] = useState('');

  const handleSendToLab = () => {
    setToastMessage('Đã lưu chỉ định CLS! Bệnh nhân được chuyển đi thực hiện xét nghiệm & CĐHA.');
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      navigate('/doctor');
    }, 1500);
  };

  const handleSaveRecord = () => {
    setToastMessage('Đã lưu hồ sơ bệnh án & kê đơn thành công! Đang chuyển về hàng đợi...');
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      navigate('/doctor');
    }, 1500);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Toast Saved */}
      {saveSuccess && (
        <div className="fixed top-20 right-8 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 z-50">
          <CheckCircle2 className="w-5 h-5" />
          <span className="font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/doctor')}
            className="p-2 hover:bg-slate-100 rounded-xl transition text-slate-600"
            title="Quay lại danh sách chờ"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Stethoscope className="w-6 h-6 text-[#004282]" />
              {patient.isConclusion || patient.status === 'LAB_READY'
                ? `Phòng Khám - Khám Tổng Kết & Đọc KQ: ${patient.queueNumber}`
                : `Phòng Khám Lâm Sàng - Số Thứ Tự: ${patient.queueNumber}`}
            </h2>
            <span className="text-xs text-slate-500">
              Mã hồ sơ: <strong className="text-slate-800">{patient.patientId}</strong> • Ngày khám: 20/10/2026
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button 
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3.5 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold shadow-sm transition"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            In phiếu
          </button>

          {/* Nút gửi bệnh nhân đi làm xét nghiệm (khi có chỉ định CLS và chưa phải ca kết luận) */}
          {labOrders.length > 0 && !patient.isConclusion && patient.status !== 'LAB_READY' && (
            <button 
              onClick={handleSendToLab}
              className="flex items-center gap-1.5 px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-bold shadow-md transition active:scale-95"
            >
              <FlaskConical className="w-4 h-4" />
              Chỉ định & Gửi làm CLS
            </button>
          )}

          {/* Nút hoàn tất khám & lưu đơn thuốc */}
          <button 
            onClick={handleSaveRecord}
            className="flex items-center gap-2 px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition active:scale-95"
          >
            <Save className="w-4 h-4" />
            {patient.isConclusion || patient.status === 'LAB_READY' ? 'Kết luận & Lưu đơn thuốc' : 'Hoàn thành & Lưu bệnh án'}
          </button>
        </div>
      </div>

      {/* Patient Header Banner (Giống thẻ bệnh nhân Isofhcare) */}
      <div className="bg-gradient-to-r from-[#004282] to-[#0066cc] text-white p-5 rounded-2xl shadow-md">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center font-bold text-xl text-white">
              {patient.fullName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h3 className="text-xl font-bold text-white">{patient.fullName}</h3>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/20 text-white">
                  {patient.gender} • {patient.age} tuổi ({patient.dob})
                </span>
                {patient.hasInsurance ? (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500 text-white flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> BHYT: {patient.insuranceNumber}
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full text-xs bg-amber-400 text-slate-900 font-semibold">
                    Khám theo yêu cầu
                  </span>
                )}
              </div>
              <div className="text-xs text-blue-100 mt-1.5 flex items-center gap-4 flex-wrap">
                <span>Điện thoại: <strong>{patient.phone}</strong></span>
                <span>•</span>
                <span>Địa chỉ: {patient.address}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Thông báo ca khám tổng kết khi đã có đủ kết quả CLS */}
      {(patient.isConclusion || patient.status === 'LAB_READY') && (
        <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-xl flex items-center justify-between text-xs text-emerald-800">
          <div className="font-medium">
            <strong>✓ Bệnh nhân đã hoàn thành đầy đủ kết quả Cận lâm sàng.</strong> Bác sĩ xem các phiếu kết quả chi tiết bên dưới để chẩn đoán xác định và kê đơn điều trị.
          </div>
          <span className="font-semibold text-emerald-700 bg-emerald-100/80 px-2.5 py-1 rounded">
            Đã có đủ kết quả
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Sinh hiệu & Khám lâm sàng */}
        <div className="lg:col-span-2 space-y-6">
          {/* Sinh hiệu (Vital Signs) */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
            <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wide flex items-center gap-2 mb-4 border-b pb-2">
              <Activity className="w-4 h-4 text-[#004282]" />
              Dấu Hiệu Sinh Tồn (Sinh hiệu)
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {/* Huyết áp */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <label className="text-xs text-slate-500 block mb-1 font-medium">Huyết áp (mmHg)</label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    value={vitals.bpSystolic}
                    onChange={(e) => setVitals({ ...vitals, bpSystolic: Number(e.target.value) })}
                    className="w-14 p-1.5 text-center font-bold text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#004282]"
                  />
                  <span className="text-slate-400 font-bold">/</span>
                  <input
                    type="number"
                    value={vitals.bpDiastolic}
                    onChange={(e) => setVitals({ ...vitals, bpDiastolic: Number(e.target.value) })}
                    className="w-14 p-1.5 text-center font-bold text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#004282]"
                  />
                </div>
                <span className={`text-[11px] mt-1 block font-semibold ${vitals.bpSystolic >= 140 ? 'text-red-600' : 'text-emerald-600'}`}>
                  {vitals.bpSystolic >= 140 ? 'Huyết áp cao' : 'Bình thường'}
                </span>
              </div>

              {/* Mạch */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <label className="text-xs text-slate-500 block mb-1 font-medium">Mạch (nhịp/phút)</label>
                <input
                  type="number"
                  value={vitals.heartRate}
                  onChange={(e) => setVitals({ ...vitals, heartRate: Number(e.target.value) })}
                  className="w-full p-1.5 text-center font-bold text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#004282]"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">60 - 100 ck/phút</span>
              </div>

              {/* Thân nhiệt */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <label className="text-xs text-slate-500 block mb-1 font-medium">Nhiệt độ (°C)</label>
                <input
                  type="number"
                  step="0.1"
                  value={vitals.temperature}
                  onChange={(e) => setVitals({ ...vitals, temperature: Number(e.target.value) })}
                  className="w-full p-1.5 text-center font-bold text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#004282]"
                />
                <span className="text-[11px] text-emerald-600 mt-1 block">Không sốt</span>
              </div>

              {/* SpO2 */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <label className="text-xs text-slate-500 block mb-1 font-medium">SpO2 (%)</label>
                <input
                  type="number"
                  value={vitals.spo2}
                  onChange={(e) => setVitals({ ...vitals, spo2: Number(e.target.value) })}
                  className="w-full p-1.5 text-center font-bold text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#004282]"
                />
                <span className="text-[11px] text-emerald-600 mt-1 block">Bão hòa tốt</span>
              </div>

              {/* Chiều cao & Cân nặng & BMI */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 col-span-2 sm:col-span-3 md:col-span-4 flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <div>
                    <label className="text-xs text-slate-500 block font-medium">Cân nặng (kg)</label>
                    <input
                      type="number"
                      value={vitals.weight}
                      onChange={(e) => setVitals({ ...vitals, weight: Number(e.target.value) })}
                      className="w-20 p-1.5 text-center font-bold text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#004282]"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 block font-medium">Chiều cao (cm)</label>
                    <input
                      type="number"
                      value={vitals.height}
                      onChange={(e) => setVitals({ ...vitals, height: Number(e.target.value) })}
                      className="w-20 p-1.5 text-center font-bold text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#004282]"
                    />
                  </div>
                </div>

                <div className="bg-white px-4 py-2 rounded-xl border border-blue-100 flex items-center gap-3 shadow-sm">
                  <div>
                    <div className="text-xs text-slate-400 font-medium">Chỉ số BMI (Tự động)</div>
                    <div className="text-lg font-black text-[#004282]">{bmi} kg/m²</div>
                  </div>
                  <div className={`text-xs ${getBmiStatus(Number(bmi)).color}`}>
                    {getBmiStatus(Number(bmi)).label}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quá trình bệnh lý & Khám lâm sàng */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
            <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wide flex items-center gap-2 border-b pb-2">
              <FileText className="w-4 h-4 text-[#004282]" />
              Hỏi Bệnh & Khám Lâm Sàng
            </h4>

            {/* Lưu ý về bệnh nhân (Do bác sĩ điền) */}
            <div>
              <label className="text-xs font-semibold text-slate-700 flex items-center justify-between mb-1">
                <span className="flex items-center gap-1.5 text-amber-800 font-bold">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  Lưu ý về bệnh nhân:
                </span>
                <span className="text-[11px] text-slate-400 font-normal">Bác sĩ ghi chú (tiền sử, dị ứng, chống chỉ định...)</span>
              </label>
              <textarea
                rows={2}
                value={patientNotes}
                onChange={(e) => setPatientNotes(e.target.value)}
                placeholder="Nhập lưu ý đặc biệt về bệnh nhân (tiền sử bệnh, dị ứng thuốc, dặn dò lưu ý...)..."
                className="w-full p-2.5 text-sm bg-amber-50/50 border border-amber-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Lý do vào viện & Diễn biến bệnh:
              </label>
              <textarea
                rows={2}
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                placeholder="Nhập lý do đến khám, thời gian khởi phát, vị trí đau..."
                className="w-full p-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#004282]/20 focus:border-[#004282]"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Khám lâm sàng các cơ quan (Tuần hoàn, Hô hấp, Tiêu hóa, Thần kinh...):
              </label>
              <textarea
                rows={3}
                value={examNotes}
                onChange={(e) => setExamNotes(e.target.value)}
                placeholder="Ghi nhận tiếng tim, rì rào phế nang, sờ nắn bụng..."
                className="w-full p-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#004282]/20 focus:border-[#004282]"
              />
            </div>

            {/* ICD-10 & Diagnosis */}
            <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-100 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <label className="text-xs font-bold text-[#004282] uppercase tracking-wide">
                  Chẩn Đoán Bệnh & Mã ICD-10 Chính:
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">Mã ICD-10:</span>
                  <select 
                    value={selectedIcd}
                    onChange={(e) => setSelectedIcd(e.target.value)}
                    className="p-1.5 text-xs font-bold bg-white border border-blue-300 rounded-lg text-[#004282] focus:outline-none"
                  >
                    {MOCK_ICD10_LIST.map(icd => (
                      <option key={icd.code} value={icd.code}>
                        [{icd.code}] - {icd.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <input
                type="text"
                value={diagnosisDetails}
                onChange={(e) => setDiagnosisDetails(e.target.value)}
                placeholder="Chi tiết chẩn đoán xác định..."
                className="w-full p-2.5 text-sm font-semibold text-slate-800 bg-white border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#004282]/30"
              />
            </div>
          </div>

          {/* Dặn dò & Hẹn tái khám */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
            <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wide flex items-center gap-2 border-b pb-2">
              <Clock className="w-4 h-4 text-[#004282]" />
              Hướng Dẫn Điều Trị & Lời Dặn Của Bác Sĩ
            </h4>
            <textarea
              rows={2}
              value={doctorAdvice}
              onChange={(e) => setDoctorAdvice(e.target.value)}
              placeholder="Chế độ ăn uống, sinh hoạt, tập luyện, dấu hiệu cần tái khám ngay..."
              className="w-full p-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#004282]/20 focus:border-[#004282]"
            />
          </div>
        </div>

        {/* Right Column: Chỉ định Cận lâm sàng & Kê đơn thuốc */}
        <div className="space-y-6">
          {/* Cận lâm sàng */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between mb-3 border-b pb-2">
              <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wide flex items-center gap-2">
                <FlaskConical className="w-4 h-4 text-purple-600" />
                Cận Lâm Sàng ({labOrders.length})
              </h4>
              <button 
                onClick={() => setShowLabModal(true)}
                className="text-xs text-[#004282] hover:text-[#002f5e] font-bold flex items-center gap-1 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200 transition"
              >
                <Plus className="w-3.5 h-3.5" /> Chỉ định
              </button>
            </div>

            {labOrders.length === 0 ? (
              <div className="text-xs text-slate-400 py-6 text-center italic">
                Chưa có chỉ định xét nghiệm hoặc chẩn đoán hình ảnh.
              </div>
            ) : (
              <div className="space-y-2.5">
                {labOrders.map(test => (
                  <div key={test.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-semibold text-slate-800 leading-snug">{test.name}</span>
                      <button 
                        onClick={() => handleToggleLab(test)}
                        className="text-slate-400 hover:text-red-500 transition"
                        title="Xóa chỉ định"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-2 text-[11px] text-slate-500">
                      <span className="font-mono">{test.code}</span>
                      <span className="text-purple-700 font-medium bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                        {test.status}
                      </span>
                    </div>
                    {/* Nút xem phiếu thông số chi tiết */}
                    <div className="mt-2.5 pt-2 border-t border-slate-200/80 flex items-center justify-between">
                      <button
                        onClick={() => setSelectedLabForView(test)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-[#004282] text-[#004282] hover:text-white font-bold text-[11px] border border-blue-200 transition active:scale-95"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Xem phiếu thông số KQ
                      </button>
                      <span className="text-[10px] text-slate-400">HMUH Lab</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Đơn thuốc điện tử */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between mb-3 border-b pb-2">
              <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wide flex items-center gap-2">
                <Pill className="w-4 h-4 text-emerald-600" />
                Đơn Thuốc Ngoại Trú ({prescriptions.length})
              </h4>
              <button 
                onClick={() => setShowMedModal(true)}
                className="text-xs text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 transition"
              >
                <Plus className="w-3.5 h-3.5" /> Thêm thuốc
              </button>
            </div>

            {prescriptions.length === 0 ? (
              <div className="text-xs text-slate-400 py-6 text-center italic">
                Chưa có thuốc nào trong đơn.
              </div>
            ) : (
              <div className="space-y-3">
                {prescriptions.map((med, index) => (
                  <div key={med.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="font-bold text-slate-900">{index + 1}. {med.name}</span>
                        <span className="ml-2 text-slate-500">Số lượng: <strong>{med.quantity} {med.unit}</strong></span>
                      </div>
                      <button 
                        onClick={() => handleRemoveMedication(med.id)}
                        className="text-slate-400 hover:text-red-500 transition"
                        title="Xóa thuốc"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="text-slate-600 mt-1 italic text-[11px] bg-white p-1.5 rounded border border-slate-100">
                      Cách dùng: {med.frequency} ({med.duration})
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MODAL: Thêm thuốc mới */}
      {showMedModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-[#004282] text-white p-4 flex items-center justify-between">
              <h3 className="font-bold text-base flex items-center gap-2">
                <Pill className="w-5 h-5" /> Kê Thuốc Mới Vào Đơn
              </h3>
              <button onClick={() => setShowMedModal(false)} className="text-white/80 hover:text-white font-bold text-lg">✕</button>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Chọn loại thuốc từ danh mục:</label>
                <select 
                  value={newMed.name}
                  onChange={(e) => {
                    const found = MOCK_COMMON_MEDICATIONS.find(m => m.name === e.target.value);
                    setNewMed({
                      ...newMed,
                      name: e.target.value,
                      unit: found ? found.unit : 'Viên',
                      frequency: found ? found.defaultUsage : newMed.frequency
                    });
                  }}
                  className="w-full p-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-[#004282]"
                >
                  {MOCK_COMMON_MEDICATIONS.map(m => (
                    <option key={m.id} value={m.name}>{m.name} (Kho còn {m.stock} {m.unit})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Số lượng:</label>
                  <input
                    type="number"
                    value={newMed.quantity}
                    onChange={(e) => setNewMed({ ...newMed, quantity: Number(e.target.value) })}
                    className="w-full p-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Đơn vị tính:</label>
                  <input
                    type="text"
                    value={newMed.unit}
                    onChange={(e) => setNewMed({ ...newMed, unit: e.target.value })}
                    className="w-full p-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Hướng dẫn sử dụng:</label>
                <textarea
                  rows={2}
                  value={newMed.frequency}
                  onChange={(e) => setNewMed({ ...newMed, frequency: e.target.value })}
                  placeholder="Ví dụ: Uống 1 viên vào 08h sáng sau bữa ăn..."
                  className="w-full p-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button 
                  onClick={() => setShowMedModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                >
                  Hủy
                </button>
                <button 
                  onClick={handleAddMedication}
                  className="px-5 py-2 text-xs font-bold bg-[#004282] hover:bg-[#002f5e] text-white rounded-xl shadow transition"
                >
                  Thêm vào đơn thuốc
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Chỉ định Cận lâm sàng */}
      {showLabModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-[#004282] text-white p-4 flex items-center justify-between">
              <h3 className="font-bold text-base flex items-center gap-2">
                <FlaskConical className="w-5 h-5" /> Chỉ Định Xét Nghiệm & Chẩn Đoán Hình Ảnh
              </h3>
              <button onClick={() => setShowLabModal(false)} className="text-white/80 hover:text-white font-bold text-lg">✕</button>
            </div>

            <div className="p-5 max-h-[70vh] overflow-y-auto space-y-3">
              <p className="text-xs text-slate-500 mb-2">
                Tích chọn các dịch vụ kỹ thuật cần chỉ định cho bệnh nhân:
              </p>

              {MOCK_LAB_TESTS.map(test => {
                const isSelected = labOrders.some(l => l.id === test.id);
                return (
                  <div 
                    key={test.id}
                    onClick={() => handleToggleLab(test)}
                    className={`p-3 rounded-xl border text-xs flex items-center justify-between cursor-pointer transition ${
                      isSelected 
                        ? 'bg-blue-50 border-[#004282] shadow-sm' 
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input 
                        type="checkbox" 
                        checked={isSelected}
                        onChange={() => {}} 
                        className="w-4 h-4 text-[#004282] rounded"
                      />
                      <div>
                        <div className="font-semibold text-slate-900">{test.name}</div>
                        <div className="text-[11px] text-slate-400">{test.category} • Mã: {test.code}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-[#004282]">{test.price.toLocaleString('vi-VN')} đ</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-4 bg-slate-50 border-t flex justify-end">
              <button 
                onClick={() => setShowLabModal(false)}
                className="px-5 py-2 text-xs font-bold bg-[#004282] hover:bg-[#002f5e] text-white rounded-xl shadow transition"
              >
                Xác nhận chỉ định
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Phiếu kết quả thông số Cận lâm sàng chi tiết */}
      <LabResultModal
        isOpen={Boolean(selectedLabForView)}
        onClose={() => setSelectedLabForView(null)}
        labTest={selectedLabForView}
        patient={patient}
      />
    </div>
  );
};

export default ExaminationRoom;
