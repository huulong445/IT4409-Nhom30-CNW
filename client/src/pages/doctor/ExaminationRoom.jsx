import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from "../../contexts/AuthContext";
import {
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
  Stethoscope
} from 'lucide-react';

const ExaminationRoom = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Chỉ lấy bệnh nhân từ navigation state; không tự chọn hồ sơ mẫu
  const initialPatient = location.state?.patient ?? {};
  const [patient, setPatient] = useState(initialPatient);

  // Vital signs state
  const [vitals, setVitals] = useState({
    bpSystolic: "",
    bpDiastolic: "",
    heartRate: "",
    temperature: "",
    spo2: "",
    weight: "",
    height: ""
  });

  // Calculate BMI
  const heightInMeters = Number(vitals.height) / 100;
  const bmi = Number(vitals.weight) > 0 && heightInMeters > 0
    ? (Number(vitals.weight) / (heightInMeters * heightInMeters)).toFixed(1)
    : "—";
  const getBmiStatus = (bmiValue) => {
    if (!Number.isFinite(bmiValue)) return { label: "Chưa có dữ liệu", color: "text-slate-400" };
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
  const [symptoms, setSymptoms] = useState('');
  const [examNotes, setExamNotes] = useState('');
  const [selectedIcd, setSelectedIcd] = useState('');
  const [diagnosisDetails, setDiagnosisDetails] = useState('');
  const [doctorAdvice, setDoctorAdvice] = useState('');

  // Prescriptions list
  const [prescriptions, setPrescriptions] = useState([]);

  // Lab orders list
  const [labOrders, setLabOrders] = useState([]);

  // Modals
  const [showMedModal, setShowMedModal] = useState(false);
  const [showLabModal, setShowLabModal] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [recordId, setRecordId] = useState(null);
  const [recordLookupState, setRecordLookupState] = useState("idle");
  const [recordRefreshKey, setRecordRefreshKey] = useState(0);
  const [existingLabRequests, setExistingLabRequests] = useState([]);
  const [labListStatus, setLabListStatus] = useState("idle");
  const [labRefreshKey, setLabRefreshKey] = useState(0);
  const [isSendingLabs, setIsSendingLabs] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [saveError, setSaveError] = useState("");

  // New medication form inside modal
  const [newMed, setNewMed] = useState({
    name: "",
    quantity: 1,
    unit: "",
    dosage: "",
    frequency: "",
    duration: ""
  });

  const handleAddMedication = () => {
    if (!newMed.name.trim() || !Number.isInteger(Number(newMed.quantity)) ||
        Number(newMed.quantity) <= 0 || !newMed.frequency.trim()) {
      setSaveError("Hãy chọn thuốc, nhập số lượng và hướng dẫn sử dụng hợp lệ.");
      return;
    }
    setPrescriptions(current => [...current, { ...newMed, id: Date.now() }]);
    setShowMedModal(false);
    setSaveError("");
  };

  const handleRemoveMedication = (id) => {
    setPrescriptions(prescriptions.filter(p => p.id !== id));
  };

  const handleToggleLab = (test) => {
    const alreadySaved = existingLabRequests.some(req =>
      String(req.test_type || "").trim().toLowerCase() ===
      String(test.name || "").trim().toLowerCase()
    );
    if (alreadySaved) {
      setSaveError("Xét nghiệm này đã có chỉ định trên hệ thống. Hãy tải lại danh sách trước khi thêm.");
      return;
    }
    setLabOrders(current => current.some(item => item.id === test.id)
      ? current.filter(item => item.id !== test.id)
      : [...current, { ...test, status: "Chưa gửi" }]
    );
    setSaveError("");
  };

  const [toastMessage, setToastMessage] = useState('');

  const patientIdForLookup = Number(patient?.id);
  const appointmentIdForLookup = Number(patient?.appointmentId);

  // Tìm bệnh án của đúng lịch hẹn; không được dùng patient_id thay record_id.
  useEffect(() => {
    let cancelled = false;
    setRecordLookupState("loading");
    setRecordId(null);
    setExistingLabRequests([]);
    setLabListStatus("idle");

    if (!Number.isInteger(patientIdForLookup) || patientIdForLookup <= 0 ||
        !Number.isInteger(appointmentIdForLookup) || appointmentIdForLookup <= 0) {
      setRecordLookupState("error");
      setSaveError("Thiếu patient_id hoặc appointment_id hợp lệ để xác định bệnh án.");
      return () => { cancelled = true; };
    }

    api.get(`/doctor/medical-records/patient/${patientIdForLookup}`)
      .then(res => {
        if (!res.data?.success || !Array.isArray(res.data?.data)) {
          throw new Error(res.data?.message || "Không thể kiểm tra bệnh án của bệnh nhân.");
        }
        if (cancelled) return;

        const matching = res.data.data.find(record =>
          Number(record.appointment_id) === appointmentIdForLookup
        );
        if (matching) {
          const id = Number(matching.record_id);
          if (!Number.isInteger(id) || id <= 0) {
            throw new Error("Bệnh án đã có nhưng record_id không hợp lệ.");
          }
          setRecordId(id);
          setSymptoms(prev => prev || matching.symptoms || "");
          setSelectedIcd(prev => prev || matching.diagnosis_icd10 || "");
          // Backend chỉ lưu một trường notes; giữ nguyên nội dung khi chỉnh sửa.
          setExamNotes(prev => prev || matching.notes || "");
        }
        setRecordLookupState("ready");
      })
      .catch(err => {
        if (cancelled) return;
        setRecordLookupState("error");
        setSaveError(
          "Không thể kiểm tra bệnh án hiện có: " +
          (err.response?.data?.message || err.message) +
          ". Không thể lưu mới để tránh tạo bản ghi trùng."
        );
      });

    return () => { cancelled = true; };
  }, [patientIdForLookup, appointmentIdForLookup, recordRefreshKey]);

  // Đọc danh sách chỉ định thật trước khi cho phép gửi chỉ định mới.
  useEffect(() => {
    let cancelled = false;
    if (recordLookupState !== "ready" || !recordId) {
      setExistingLabRequests([]);
      setLabListStatus(recordLookupState === "ready" ? "ready" : "idle");
      return () => { cancelled = true; };
    }

    setLabListStatus("loading");
    api.get("/doctor/lab-requests", { params: { record_id: recordId } })
      .then(res => {
        if (!res.data?.success || !Array.isArray(res.data?.data)) {
          throw new Error(res.data?.message || "Phản hồi danh sách CLS không hợp lệ.");
        }
        if (!cancelled) {
          setExistingLabRequests(res.data.data);
          setLabListStatus("ready");
        }
      })
      .catch(err => {
        if (!cancelled) {
          setLabListStatus("error");
          setSaveError(
            "Không thể kiểm tra chỉ định CLS đã có: " +
            (err.response?.data?.message || err.message) +
            ". Nhấn Tải lại chỉ định để thử lại."
          );
        }
      });

    return () => { cancelled = true; };
  }, [recordLookupState, recordId, labRefreshKey]);

  const handleSendToLab = async () => {
    setSaveSuccess(false);
    setSaveError("");
    const doctorId = Number(user?.staff_id ?? user?.staffId);

    if (!recordId || recordLookupState !== "ready") {
      setSaveError("Cần lưu hoặc tải bệnh án hợp lệ trước khi gửi chỉ định CLS.");
      return;
    }
    if (!Number.isInteger(doctorId) || doctorId <= 0 ||
        !Number.isInteger(patientIdForLookup) || patientIdForLookup <= 0) {
      setSaveError("Thiếu staff_id bác sĩ hoặc patient_id; không sử dụng ID giả.");
      return;
    }
    if (labListStatus !== "ready") {
      setSaveError("Chưa kiểm tra được các chỉ định hiện có. Hãy tải lại trước khi gửi.");
      return;
    }
    if (labOrders.length === 0) {
      setSaveError("Chưa chọn xét nghiệm để gửi.");
      return;
    }
    if (labOrders.some(lab => existingLabRequests.some(req =>
      String(req.test_type || "").trim().toLowerCase() ===
      String(lab.name || "").trim().toLowerCase()
    ))) {
      setSaveError("Một số xét nghiệm đã có chỉ định. Hãy bỏ lựa chọn trùng trước khi gửi.");
      return;
    }

    setIsSendingLabs(true);
    let sentCount = 0;
    try {
      for (const lab of labOrders) {
        const res = await api.post("/doctor/lab-requests", {
          record_id: recordId,
          patient_id: patientIdForLookup,
          doctor_id: doctorId,
          test_type: lab.name
        });
        if (!res.data?.success || !Number.isInteger(Number(res.data?.lab_request_id)) ||
            Number(res.data.lab_request_id) <= 0) {
          throw new Error(res.data?.message || "Backend không xác nhận ID chỉ định mới.");
        }
        sentCount += 1;
        setExistingLabRequests(current => [...current, {
          lab_request_id: Number(res.data.lab_request_id),
          record_id: recordId,
          test_type: lab.name,
          status: "REQUESTED"
        }]);
        setLabOrders(current => current.filter(item => item.id !== lab.id));
      }
      setToastMessage(`Đã gửi thành công ${sentCount} chỉ định CLS.`);
      setSaveSuccess(true);
    } catch (err) {
      // Kết nối có thể đứt sau khi server đã nhận lệnh; cần tải lại trước khi thử lại.
      setLabListStatus("error");
      setSaveError(
        `Đã xác nhận ${sentCount} chỉ định được gửi. ` +
        `Chỉ định tiếp theo chưa xác định kết quả: ${err.response?.data?.message || err.message}. ` +
        "Hãy tải lại danh sách CLS trước khi gửi lại để tránh trùng."
      );
    } finally {
      setIsSendingLabs(false);
    }
  };



const handleSaveRecord = async () => {
  setSaveError("");
  setSaveSuccess(false);

  if (recordLookupState !== "ready") {
    setSaveError("Chưa kiểm tra được bệnh án hiện có. Không thể lưu khi trạng thái chưa rõ.");
    return;
  }

  const appointmentId = Number(patient?.appointmentId);
  const patientId = Number(patient?.id);
  const doctorId = Number(user?.staff_id ?? user?.staffId);

  if (
    !Number.isInteger(appointmentId) || appointmentId <= 0 ||
    !Number.isInteger(patientId) || patientId <= 0
  ) {
    setSaveError(
      "Thiếu appointment_id hoặc patient_id hợp lệ. " +
      "Vui lòng chọn bệnh nhân từ hàng đợi."
    );
    return;
  }

  if (!Number.isInteger(doctorId) || doctorId <= 0) {
    setSaveError(
      "Không có staff_id của bác sĩ. Không thể lưu bệnh án " +
      "bằng user_id hoặc ID giả."
    );
    return;
  }

  const medicalRecord = {
    appointment_id: appointmentId,
    patient_id: patientId,
    doctor_id: doctorId,
    symptoms: symptoms.trim(),
    diagnosis_icd10: selectedIcd.trim(),
    notes: [
      examNotes.trim(),
      diagnosisDetails.trim(),
      doctorAdvice.trim()
    ].filter(Boolean).join("\n\n")
  };

  if (!medicalRecord.symptoms || !medicalRecord.diagnosis_icd10) {
    setSaveError("Vui lòng nhập triệu chứng và mã chẩn đoán ICD-10.");
    return;
  }

  setIsSaving(true);

  try {
    const res = recordId
      ? await api.put(`/doctor/medical-records/${recordId}`, {
          symptoms: medicalRecord.symptoms,
          diagnosis_icd10: medicalRecord.diagnosis_icd10,
          notes: medicalRecord.notes
        })
      : await api.post("/doctor/medical-records", medicalRecord);

    if (!res.data?.success) {
      throw new Error(res.data?.message || "Không thể lưu bệnh án.");
    }

    if (!recordId) {
      const newId = Number(res.data.record_id);
      if (!Number.isInteger(newId) || newId <= 0) {
        throw new Error(
          "Backend báo thành công nhưng không trả record_id. " +
          "Cần kiểm tra lại dữ liệu trước khi thử lưu tiếp."
        );
      }
      setRecordId(newId);
    }

    setToastMessage(
      "Đã lưu bệnh án thành công. " +
      "Đơn thuốc và chỉ định CLS chưa được gửi."
    );
    setSaveSuccess(true);
  } catch (err) {
    // Nếu POST thất bại hoặc phản hồi bị mất, không thể chắc bệnh án chưa được tạo.
    // Chặn việc POST lần hai cho đến khi tra cứu lại theo appointment_id.
    if (!recordId) setRecordLookupState("error");
    setSaveError(
      (err.response?.data?.message || err.message || "Không thể lưu bệnh án.") +
      (!recordId ? " Hãy kiểm tra lại bệnh án trước khi thử lưu mới." : "")
    );
  } finally {
    setIsSaving(false);
  }
};

  const handleDeleteRecord = async () => {
    if (!recordId || recordLookupState !== "ready" || isSaving || isDeleting || isSendingLabs) return;
    const id = String(recordId);
    const typed = window.prompt(
      `Xóa vĩnh viễn bệnh án #${id}? Các chỉ định và đơn thuốc liên quan có thể bị xóa theo database. Nhập ${id} để xác nhận:`
    );
    if (typed !== id) return;
    setSaveError("");
    setSaveSuccess(false);
    setIsDeleting(true);
    try {
      const res = await api.delete(`/doctor/medical-records/${id}`);
      if (!res.data?.success) throw new Error(res.data?.message || "Backend không xác nhận xóa bệnh án.");
      setRecordId(null);
      setExistingLabRequests([]);
      setLabOrders([]);
      setLabListStatus("idle");
      setRecordLookupState("loading");
      setToastMessage(`Đã xóa bệnh án #${id}. Tải lại hồ sơ trước khi lưu mới.`);
      setSaveSuccess(true);
      setRecordRefreshKey(value => value + 1);
    } catch (err) {
      // Even on a timeout the deletion may have completed. Require a fresh lookup.
      setRecordLookupState("error");
      setSaveError((err.response?.data?.message || err.message || "Không thể xác nhận xóa bệnh án.") +
        " Hãy kiểm tra lại bệnh án trước khi thử xóa hay tạo mới.");
    } finally {
      setIsDeleting(false);
    }
  };

  if (!location.state?.patient) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-6">
        <h2 className="font-bold text-amber-900">Chưa chọn bệnh nhân</h2>
        <p className="mt-2 text-sm text-amber-800">
          Vui lòng chọn một lịch hẹn hợp lệ từ hàng đợi khám bệnh.
        </p>
        <button
          type="button"
          onClick={() => navigate("/doctor")}
          className="mt-4 rounded-lg bg-[#004282] px-4 py-2 text-white"
        >
          Quay lại hàng đợi
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {saveError && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          {saveError}
        </div>
      )}
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-700">
        <span>
          {recordLookupState === "loading" ? "Đang kiểm tra bệnh án theo lịch hẹn..." :
           recordLookupState === "error" ? "Chưa xác minh được bệnh án" :
           recordId ? `Đã xác minh bệnh án #${recordId}` : "Chưa có bệnh án cho lịch hẹn này"}
        </span>
        <button type="button" disabled={isSaving || isSendingLabs}
          onClick={() => { setSaveError(""); setRecordRefreshKey(value => value + 1); }}
          className="rounded-lg border border-blue-200 px-3 py-1 text-blue-700 disabled:opacity-50">
          Kiểm tra lại bệnh án
        </button>
      </div>
      {recordId && (
        <p className="rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-700">
          Bệnh án hiện tại: #{recordId}
        </p>
      )}
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
              Mã hồ sơ: <strong className="text-slate-800">{patient.patientId ?? "—"}</strong> • Ngày khám: {patient.appointmentDate ?? "Chưa có thông tin"}
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
              disabled={isSendingLabs || isSaving || isDeleting || labListStatus !== "ready" || !recordId}
              className="flex items-center gap-1.5 px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-bold shadow-md transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FlaskConical className="w-4 h-4" />
              {isSendingLabs ? "Đang gửi chỉ định..." : "Chỉ định & Gửi làm CLS"}
            </button>
          )}

      {/* Nút hoàn tất khám & lưu đơn thuốc */}
      <button
        onClick={handleSaveRecord}
        disabled={isSaving || isDeleting || isSendingLabs || recordLookupState !== "ready"}
        className="flex items-center gap-2 px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold disabled:opacity-50"
      >
        <Save className="w-4 h-4" />
        {isSaving ? "Đang lưu..." : "Lưu bệnh án"}
      </button>
      {recordId && recordLookupState === "ready" && (
        <button
          type="button"
          onClick={handleDeleteRecord}
          disabled={isDeleting || isSaving || isSendingLabs}
          className="inline-flex items-center gap-1 rounded-xl border border-red-200 px-3 py-2 text-xs font-bold text-red-700 disabled:opacity-50"
        >
          <Trash2 size={16} /> {isDeleting ? "Đang xóa..." : "Xóa bệnh án"}
        </button>
      )}
        </div>
      </div>

      {/* Patient Header Banner (Giống thẻ bệnh nhân Isofhcare) */}
      <div className="bg-gradient-to-r from-[#004282] to-[#0066cc] text-white p-5 rounded-2xl shadow-md">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center font-bold text-xl text-white">
              {(patient.fullName ?? "?").charAt(0)}
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
                    onChange={(e) => setVitals({ ...vitals, bpSystolic: e.target.value === "" ? "" : Number(e.target.value) })}
                    className="w-14 p-1.5 text-center font-bold text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#004282]"
                  />
                  <span className="text-slate-400 font-bold">/</span>
                  <input
                    type="number"
                    value={vitals.bpDiastolic}
                    onChange={(e) => setVitals({ ...vitals, bpDiastolic: e.target.value === "" ? "" : Number(e.target.value) })}
                    className="w-14 p-1.5 text-center font-bold text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#004282]"
                  />
                </div>
                <span className={`text-[11px] mt-1 block font-semibold ${vitals.bpSystolic >= 140 ? 'text-red-600' : 'text-emerald-600'}`}>
                  {vitals.bpSystolic === '' ? 'Chưa có số đo' : vitals.bpSystolic >= 140 ? 'Huyết áp cao' : 'Đã nhập số đo'}
                </span>
              </div>

              {/* Mạch */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <label className="text-xs text-slate-500 block mb-1 font-medium">Mạch (nhịp/phút)</label>
                <input
                  type="number"
                  value={vitals.heartRate}
                  onChange={(e) => setVitals({ ...vitals, heartRate: e.target.value === "" ? "" : Number(e.target.value) })}
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
                  onChange={(e) => setVitals({ ...vitals, temperature: e.target.value === "" ? "" : Number(e.target.value) })}
                  className="w-full p-1.5 text-center font-bold text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#004282]"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">{vitals.temperature === "" ? "Chưa có số đo" : "Đã nhập số đo"}</span>
              </div>

              {/* SpO2 */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <label className="text-xs text-slate-500 block mb-1 font-medium">SpO2 (%)</label>
                <input
                  type="number"
                  value={vitals.spo2}
                  onChange={(e) => setVitals({ ...vitals, spo2: e.target.value === "" ? "" : Number(e.target.value) })}
                  className="w-full p-1.5 text-center font-bold text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#004282]"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">{vitals.spo2 === "" ? "Chưa có số đo" : "Đã nhập số đo"}</span>
              </div>

              {/* Chiều cao & Cân nặng & BMI */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 col-span-2 sm:col-span-3 md:col-span-4 flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <div>
                    <label className="text-xs text-slate-500 block font-medium">Cân nặng (kg)</label>
                    <input
                      type="number"
                      value={vitals.weight}
                      onChange={(e) => setVitals({ ...vitals, weight: e.target.value === "" ? "" : Number(e.target.value) })}
                      className="w-20 p-1.5 text-center font-bold text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#004282]"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 block font-medium">Chiều cao (cm)</label>
                    <input
                      type="number"
                      value={vitals.height}
                      onChange={(e) => setVitals({ ...vitals, height: e.target.value === "" ? "" : Number(e.target.value) })}
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
                    <option value="" disabled>Chọn mã ICD-10</option>
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
                Cận Lâm Sàng — Bản nháp ({labOrders.length})
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
                Chưa chọn chỉ định mới. Các lựa chọn bên dưới chưa gửi lên hệ thống.
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
                    <p className="mt-2 text-[11px] text-amber-700">
                      Bản nháp chưa gửi. Không có phiếu kết quả để xem.
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Chỉ định CLS đã ghi nhận thật từ backend */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h4 className="text-sm font-bold text-slate-800">
                Chỉ định đã gửi ({existingLabRequests.length})
              </h4>
              <button
                type="button"
                disabled={!recordId || isSendingLabs}
                onClick={() => {
                  setSaveError("");
                  setLabRefreshKey(value => value + 1);
                }}
                className="rounded-lg border border-blue-200 px-2 py-1 text-xs font-semibold text-blue-700 disabled:opacity-50"
              >
                Tải lại chỉ định
              </button>
            </div>
            {!recordId ? (
              <p className="mt-2 text-xs text-slate-500">Cần lưu hoặc tải bệnh án trước.</p>
            ) : labListStatus === "loading" ? (
              <p className="mt-2 text-xs text-slate-500">Đang tải chỉ định...</p>
            ) : labListStatus === "error" ? (
              <p className="mt-2 text-xs text-red-700">Không xác minh được chỉ định đã gửi. Hãy tải lại.</p>
            ) : existingLabRequests.length === 0 ? (
              <p className="mt-2 text-xs text-slate-500">Chưa có chỉ định được ghi nhận.</p>
            ) : (
              <ul className="mt-3 space-y-2">
                {existingLabRequests.map(req => (
                  <li key={req.lab_request_id} className="rounded-lg border border-slate-100 p-2 text-xs">
                    <span className="font-medium">{req.test_type}</span>
                    <span className="ml-2 text-slate-500">{req.status || "Chưa rõ trạng thái"}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Đơn thuốc điện tử */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between mb-3 border-b pb-2">
              <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wide flex items-center gap-2">
                <Pill className="w-4 h-4 text-emerald-600" />
                Đơn Thuốc Nháp ({prescriptions.length})
              </h4>
              <button
                onClick={() => setShowMedModal(true)}
                className="text-xs text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 transition"
              >
                <Plus className="w-3.5 h-3.5" /> Thêm thuốc
              </button>
            </div>

            <p className="mb-2 text-xs text-amber-700">
              Thuốc được chọn ở đây chỉ là bản nháp trên frontend, chưa lưu vào database.
            </p>
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
                <label className="text-xs font-bold text-slate-700 block mb-1">Chọn thuốc từ danh sách tham khảo (chưa đồng bộ kho):</label>
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
                    <option value="">Chọn thuốc tham khảo (chưa xác thực)</option>
                    {MOCK_COMMON_MEDICATIONS.map(m => (
                      <option key={m.id} value={m.name}>{m.name}</option>
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
                Danh mục gợi ý ở frontend; chưa đồng bộ giá/danh mục xét nghiệm từ backend. Việc tích chọn chỉ tạo bản nháp.
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
                        <span className="text-[11px] text-slate-500">Chưa có giá xác minh</span>
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
                Lưu lựa chọn (chưa gửi)
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ExaminationRoom;
