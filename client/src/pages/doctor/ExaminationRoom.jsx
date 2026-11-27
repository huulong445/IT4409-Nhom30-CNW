import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from "../../contexts/AuthContext";

const ICD10_CATALOG = [
  { code: "I10", name: "Bệnh tăng huyết áp vô căn (nguyên phát)" },
  { code: "I20.0", name: "Cơn đau thắt ngực không ổn định" },
  { code: "I25.1", name: "Bệnh tim do xơ vữa động mạch" },
  { code: "E11.9", name: "Đái tháo đường type 2 không có biến chứng" },
  { code: "E78.0", name: "Tăng cholesterol máu thuần túy" },
  { code: "K29.7", name: "Viêm dạ dày, không đặc hiệu" },
  { code: "J00", name: "Viêm mũi họng cấp (Cảm thường)" },
  { code: "J45.9", name: "Hen phế quản, không xác định" },
  { code: "M54.5", name: "Đau thắt lưng dưới" },
  { code: "R42", name: "Chóng mặt và hoa mắt" }
];

const LAB_TEST_CATALOG = [
  { id: 1, category: "Xét nghiệm Huyết học", name: "Tổng phân tích tế bào máu ngoại vi (24 thông số)", code: "XN-HH-01" },
  { id: 2, category: "Xét nghiệm Sinh hóa", name: "Định lượng Glucose máu", code: "XN-SH-01" },
  { id: 3, category: "Xét nghiệm Sinh hóa", name: "Đo hoạt độ men gan (AST/ALT)", code: "XN-SH-02" },
  { id: 4, category: "Xét nghiệm Sinh hóa", name: "Bộ mỡ máu toàn phần (Cholesterol, Triglycerid, HDL-C, LDL-C)", code: "XN-SH-03" },
  { id: 5, category: "Xét nghiệm Sinh hóa", name: "Định lượng Ure, Creatinin máu (Đánh giá chức năng thận)", code: "XN-SH-04" },
  { id: 6, category: "Chẩn đoán hình ảnh", name: "Điện tâm đồ thông thường (ECG 12 chuyển đạo)", code: "CDHA-ECG" },
  { id: 7, category: "Chẩn đoán hình ảnh", name: "Siêu âm Doppler Tim qua thành ngực", code: "CDHA-SATM" },
  { id: 8, category: "Chẩn đoán hình ảnh", name: "Chụp X-quang ngực thẳng kỹ thuật số (CR/DR)", code: "CDHA-XQN" }
];
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

// Danh mục thuốc khớp med_id trong database (schema/data mẫu) để kê đơn trực tiếp qua POST /doctor/prescriptions
const DB_MEDICINES = [
  { med_id: 1, name: "Paracetamol 500mg", unit: "Viên", unit_price: 800, defaultUsage: "1 viên khi sốt trên 38.5 độ C" },
  { med_id: 2, name: "Amoxicillin 500mg", unit: "Viên", unit_price: 2500, defaultUsage: "1 viên x 3 lần/ngày sau ăn" },
  { med_id: 4, name: "Omeprazole 20mg", unit: "Viên", unit_price: 1500, defaultUsage: "1 viên buổi sáng trước ăn 30 phút" },
  { med_id: 6, name: "Metformin 500mg", unit: "Viên", unit_price: 600, defaultUsage: "1 viên x 2 lần/ngày trong bữa ăn" },
  { med_id: 13, name: "Amlodipine 5mg", unit: "Viên", unit_price: 500, defaultUsage: "1 viên buổi sáng" },
  { med_id: 14, name: "Telmisartan 40mg", unit: "Viên", unit_price: 3500, defaultUsage: "1 viên buổi sáng sau ăn" },
  { med_id: 15, name: "Aspirin 81mg", unit: "Viên", unit_price: 400, defaultUsage: "1 viên/ngày sau ăn trưa" },
  { med_id: 16, name: "Atorvastatin 20mg", unit: "Viên", unit_price: 2800, defaultUsage: "1 viên buổi tối" },
  { med_id: 17, name: "Bisoprolol 2.5mg", unit: "Viên", unit_price: 1800, defaultUsage: "1 viên buổi sáng" },
];

const ExaminationRoom = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const initialPatient = location.state?.patient ?? {};
  const [patient, setPatient] = useState(initialPatient);
  const [loadingInProgress, setLoadingInProgress] = useState(!location.state?.patient);

  // Tự động tải bệnh nhân đang ở trạng thái IN_PROGRESS khi mở trực tiếp Phòng khám từ menu
  useEffect(() => {
    if (location.state?.patient) {
      setPatient(location.state.patient);
      setLoadingInProgress(false);
      return;
    }

    let cancelled = false;
    setLoadingInProgress(true);
    const now = new Date();
    const today = [
      now.getFullYear(),
      String(now.getMonth() + 1).padStart(2, "0"),
      String(now.getDate()).padStart(2, "0"),
    ].join("-");

    api.get("/doctor/appointments", { params: { date: today } })
      .then((res) => {
        if (cancelled) return;
        const list = Array.isArray(res.data?.data) ? res.data.data : [];
        const activeIndex = list.findIndex((item) => item.status === "IN_PROGRESS");
        if (activeIndex === -1) {
          setPatient({});
          return;
        }
        const item = list[activeIndex];
        const dob = item.dob ? new Date(item.dob) : null;
        let age = null;
        if (dob && !Number.isNaN(dob.getTime())) {
          age = now.getFullYear() - dob.getFullYear();
          if (
            now.getMonth() < dob.getMonth() ||
            (now.getMonth() === dob.getMonth() && now.getDate() < dob.getDate())
          ) {
            age--;
          }
        }
        setPatient({
          id: item.patient_id,
          appointmentId: item.appointment_id,
          appointmentDate: item.appointment_date
            ? String(item.appointment_date).slice(0, 10)
            : today,
          queueNumber: String(activeIndex + 1).padStart(2, "0"),
          patientId: String(item.patient_id ?? "—"),
          fullName: item.full_name || "Chưa có tên",
          gender:
            item.gender === "MALE" ? "Nam" :
            item.gender === "FEMALE" ? "Nữ" : "Khác",
          age,
          dob: item.dob ? String(item.dob).slice(0, 10) : null,
          phone: "—",
          hasInsurance: Boolean(item.insurance_number),
          insuranceNumber: item.insurance_number || "",
          status: "IN_PROGRESS",
          rawStatus: "IN_PROGRESS",
          timeSlot: item.appointment_time ?? item.time_slot ?? null,
        });
      })
      .catch(() => {
        if (!cancelled) setPatient({});
      })
      .finally(() => {
        if (!cancelled) setLoadingInProgress(false);
      });

    return () => { cancelled = true; };
  }, [location.state?.patient]);

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
  const [isSavingPrescription, setIsSavingPrescription] = useState(false);
  const [existingPrescriptions, setExistingPrescriptions] = useState([]);
  const [selectedLabResult, setSelectedLabResult] = useState(null);
  const [loadingLabResultId, setLoadingLabResultId] = useState(null);
  const [recordSearchMode, setRecordSearchMode] = useState("full_name");
  const [recordSearchValue, setRecordSearchValue] = useState("");
  const [recordSearchResults, setRecordSearchResults] = useState([]);
  const [recordSearchLoading, setRecordSearchLoading] = useState(false);
  const [recordSearchError, setRecordSearchError] = useState("");
  const [saveError, setSaveError] = useState("");

  // New medication form inside modal
  const [newMed, setNewMed] = useState({
    med_id: 1,
    name: "Paracetamol 500mg",
    quantity: 10,
    unit: "Viên",
    unit_price: 800,
    dosage: "1 viên khi sốt trên 38.5 độ C",
    note: "",
    frequency: "1 viên khi sốt trên 38.5 độ C",
    duration: ""
  });

  const handleAddMedication = () => {
    const qty = Number(newMed.quantity);
    const medId = Number(newMed.med_id);
    const price = Number(newMed.unit_price);
    const dosageText = (newMed.dosage || newMed.frequency || "").trim();
    if (!Number.isInteger(medId) || medId <= 0 || !Number.isInteger(qty) ||
        qty <= 0 || !Number.isFinite(price) || price < 0 || !dosageText) {
      setSaveError("Hãy nhập med_id hợp lệ, số lượng > 0, đơn giá >= 0 và liều dùng.");
      return;
    }
    setPrescriptions(current => [...current, {
      ...newMed,
      med_id: medId,
      quantity: qty,
      unit_price: price,
      dosage: dosageText,
      frequency: dosageText,
      id: Date.now()
    }]);
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

    api.get("/doctor/medical-records/patient", { params: { patient_id: patientIdForLookup } })
      .then(async res => {
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
          // Gọi thêm GET /doctor/medical-records?record_id=... để đồng bộ chi tiết mới nhất
          let detail = matching;
          try {
            const detailRes = await api.get("/doctor/medical-records", { params: { record_id: id } });
            if (detailRes.data?.success && detailRes.data?.data) {
              detail = detailRes.data.data;
            }
          } catch {
            // Dùng dữ liệu từ danh sách nếu không tải được chi tiết
          }
          if (cancelled) return;
          setRecordId(id);
          setSymptoms(prev => prev || detail.symptoms || "");
          setSelectedIcd(prev => prev || detail.diagnosis_icd10 || "");
          // Backend chỉ lưu một trường notes; giữ nguyên nội dung khi chỉnh sửa.
          setExamNotes(prev => prev || detail.notes || "");
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
      ? await api.put("/doctor/medical-records", {
          symptoms: medicalRecord.symptoms,
          diagnosis_icd10: medicalRecord.diagnosis_icd10,
          notes: medicalRecord.notes
        }, { params: { record_id: recordId } })
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
      const res = await api.delete("/doctor/medical-records", {
        params: { record_id: id }
      });
      if (!res.data?.success) throw new Error(res.data?.message || "Backend không xác nhận xóa bệnh án.");
      setRecordId(null);
      setExistingLabRequests([]);
      setExistingPrescriptions([]);
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

  // Tải đơn thuốc đã lưu theo record_id (GET /doctor/prescriptions?record_id=...)
  useEffect(() => {
    if (!recordId) {
      setExistingPrescriptions([]);
      return;
    }
    let cancelled = false;
    api.get("/doctor/prescriptions", { params: { record_id: recordId } })
      .then(res => {
        if (!cancelled && res.data?.success && Array.isArray(res.data?.data)) {
          setExistingPrescriptions(res.data.data);
        }
      })
      .catch(() => {
        if (!cancelled) setExistingPrescriptions([]);
      });
    return () => { cancelled = true; };
  }, [recordId]);

  const handleSavePrescription = async () => {
    setSaveError("");
    setSaveSuccess(false);
    const doctorId = Number(user?.staff_id ?? user?.staffId);
    if (!recordId) {
      setSaveError("Cần lưu bệnh án để có record_id trước khi gửi đơn thuốc.");
      return;
    }
    if (!Number.isInteger(doctorId) || doctorId <= 0) {
      setSaveError("Thiếu staff_id của bác sĩ.");
      return;
    }
    if (prescriptions.length === 0) {
      setSaveError("Chưa có thuốc nào trong đơn nháp.");
      return;
    }
    setIsSavingPrescription(true);
    try {
      const medication_details = prescriptions.map(med => ({
        med_id: Number(med.med_id),
        quantity: Number(med.quantity),
        unit_price: Number(med.unit_price),
        dosage: String(med.dosage || med.frequency || "").trim(),
        note: String(med.note || "").trim() || null,
      }));
      const res = await api.post("/doctor/prescriptions", {
        record_id: recordId,
        doctor_id: doctorId,
        medication_details,
      });
      if (!res.data?.success) {
        throw new Error(res.data?.message || "Không thể lưu đơn thuốc.");
      }
      setPrescriptions([]);
      setToastMessage(`Đã kê đơn thuốc #${res.data.prescription_id} thành công!`);
      setSaveSuccess(true);
      const reloadRes = await api.get("/doctor/prescriptions", { params: { record_id: recordId } }).catch(() => null);
      if (reloadRes?.data?.success && Array.isArray(reloadRes.data.data)) {
        setExistingPrescriptions(reloadRes.data.data);
      }
    } catch (err) {
      setSaveError(err.response?.data?.message || err.message || "Không thể lưu đơn thuốc.");
    } finally {
      setIsSavingPrescription(false);
    }
  };

  const handleViewLabResult = async (labRequestId) => {
    setSaveError("");
    setLoadingLabResultId(labRequestId);
    try {
      const res = await api.get("/doctor/lab-results", {
        params: { lab_request_id: labRequestId },
      });
      if (!res.data?.success || !res.data?.data) {
        throw new Error(res.data?.message || "Không lấy được kết quả xét nghiệm.");
      }
      setSelectedLabResult({
        is_completed: Boolean(res.data.is_completed),
        message: res.data.message,
        ...res.data.data,
      });
    } catch (err) {
      setSaveError(err.response?.data?.message || err.message || "Không thể xem kết quả xét nghiệm.");
    } finally {
      setLoadingLabResultId(null);
    }
  };

  const handleCompleteAppointment = async () => {
    const appointmentId = Number(patient?.appointmentId);
    if (!Number.isInteger(appointmentId) || appointmentId <= 0) return;
    setSaveError("");
    try {
      const res = await api.put("/doctor/appointment/status", {
        appointment_id: appointmentId,
        status: "COMPLETED",
      });
      if (!res.data?.success) throw new Error(res.data?.message || "Không thể hoàn tất lịch hẹn.");
      setToastMessage("Đã hoàn tất lịch hẹn (COMPLETED)!");
      setSaveSuccess(true);
    } catch (err) {
      setSaveError(err.response?.data?.message || err.message || "Không thể cập nhật trạng thái lịch hẹn.");
    }
  };

  const handleSearchMedicalRecords = async (e) => {
    e.preventDefault();
    const val = recordSearchValue.trim();
    setRecordSearchError("");
    setRecordSearchResults([]);
    if (!val) {
      setRecordSearchError("Vui lòng nhập giá trị cần tra cứu.");
      return;
    }
    setRecordSearchLoading(true);
    try {
      let res;
      if (recordSearchMode === "record_id") {
        res = await api.get("/doctor/medical-records", { params: { record_id: val } });
        setRecordSearchResults(res.data?.data ? [res.data.data] : []);
      } else if (recordSearchMode === "patient_id") {
        res = await api.get("/doctor/medical-records/patient", { params: { patient_id: val } });
        setRecordSearchResults(Array.isArray(res.data?.data) ? res.data.data : []);
      } else {
        res = await api.get("/doctor/medical-records/patient/name", { params: { full_name: val } });
        setRecordSearchResults(Array.isArray(res.data?.data) ? res.data.data : []);
      }
    } catch (err) {
      setRecordSearchError(err.response?.data?.message || err.message || "Không tìm thấy bệnh án.");
    } finally {
      setRecordSearchLoading(false);
    }
  };

  if (loadingInProgress) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
        Đang kiểm tra bệnh nhân đang khám trong phòng...
      </div>
    );
  }

  if (!patient?.id || !patient?.appointmentId) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-6">
        <h2 className="font-bold text-amber-900">Không có bệnh nhân nào trong phòng khám</h2>
        <p className="mt-2 text-sm text-amber-800">
          Hiện chưa có bệnh nhân nào đang khám (IN_PROGRESS). Vui lòng chọn một lịch hẹn từ hàng đợi khám bệnh.
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

      {/* Nút hoàn tất khám & lưu bệnh án */}
      <button
        onClick={handleSaveRecord}
        disabled={isSaving || isDeleting || isSendingLabs || recordLookupState !== "ready"}
        className="flex items-center gap-2 px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold disabled:opacity-50"
      >
        <Save className="w-4 h-4" />
        {isSaving ? "Đang lưu..." : "Lưu bệnh án"}
      </button>
      <button
        type="button"
        onClick={handleCompleteAppointment}
        disabled={isSaving || isDeleting || isSendingLabs}
        className="flex items-center gap-1.5 px-4 py-2 bg-[#004282] hover:bg-[#002f5e] text-white rounded-xl text-xs font-bold disabled:opacity-50"
      >
        <CheckCircle2 className="w-4 h-4" />
        Hoàn tất lịch hẹn
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
                    {ICD10_CATALOG.map(icd => (
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
                  <li key={req.lab_request_id} className="rounded-lg border border-slate-100 p-2 text-xs flex items-center justify-between gap-2">
                    <div>
                      <span className="font-medium">{req.test_type}</span>
                      <span className="ml-2 text-slate-500">{req.status || "Chưa rõ trạng thái"}</span>
                    </div>
                    <button
                      type="button"
                      disabled={loadingLabResultId === req.lab_request_id}
                      onClick={() => handleViewLabResult(req.lab_request_id)}
                      className="inline-flex items-center gap-1 rounded border border-emerald-200 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 hover:bg-emerald-50 disabled:opacity-50"
                    >
                      <Eye size={12} />
                      {loadingLabResultId === req.lab_request_id ? "..." : "Xem KQ"}
                    </button>
                  </li>
                ))}
              </ul>
            )}
            {selectedLabResult && (
              <div className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50/40 p-3 text-xs space-y-1.5">
                <div className="flex items-center justify-between font-bold text-slate-800">
                  <span>KQ CLS #{selectedLabResult.lab_request_id}: {selectedLabResult.test_type}</span>
                  <button type="button" onClick={() => setSelectedLabResult(null)} className="text-slate-500 hover:text-slate-800">✕</button>
                </div>
                <p className="text-slate-600">{selectedLabResult.message}</p>
                {selectedLabResult.is_completed && (
                  <pre className="overflow-x-auto rounded bg-white p-2 border text-[11px] font-mono">
                    {JSON.stringify(selectedLabResult.result_data, null, 2)}
                  </pre>
                )}
              </div>
            )}
          </div>

          {/* Đơn thuốc điện tử */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b pb-2">
              <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wide flex items-center gap-2">
                <Pill className="w-4 h-4 text-emerald-600" />
                Đơn Thuốc ({prescriptions.length} nháp)
              </h4>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowMedModal(true)}
                  className="text-xs text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 transition"
                >
                  <Plus className="w-3.5 h-3.5" /> Thêm thuốc
                </button>
                {prescriptions.length > 0 && (
                  <button
                    type="button"
                    disabled={isSavingPrescription || !recordId}
                    onClick={handleSavePrescription}
                    className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-1 px-2.5 py-1 rounded-lg disabled:opacity-50"
                  >
                    <Save className="w-3.5 h-3.5" />
                    {isSavingPrescription ? "Đang gửi..." : "Lưu đơn"}
                  </button>
                )}
              </div>
            </div>

            {!recordId && (
              <p className="text-xs text-amber-700">
                Cần lưu bệnh án để có mã bệnh án trước khi gửi đơn thuốc (POST /doctor/prescriptions).
              </p>
            )}
            {prescriptions.length === 0 ? (
              <div className="text-xs text-slate-400 py-4 text-center italic">
                Chưa có thuốc nào trong đơn nháp.
              </div>
            ) : (
              <div className="space-y-3">
                {prescriptions.map((med, index) => (
                  <div key={med.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="font-bold text-slate-900">{index + 1}. {med.name} (ID: {med.med_id})</span>
                        <span className="ml-2 text-slate-500">SL: <strong>{med.quantity} {med.unit}</strong> • {Number(med.unit_price).toLocaleString("vi-VN")}đ</span>
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
                      Liều dùng: {med.dosage || med.frequency} {med.note ? `(${med.note})` : ""}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {existingPrescriptions.length > 0 && (
              <div className="border-t pt-3 space-y-2">
                <p className="text-xs font-bold text-slate-700">Đơn thuốc đã lưu trên hệ thống ({existingPrescriptions.length}):</p>
                {existingPrescriptions.map((p) => (
                  <div key={p.prescription_id} className="rounded-lg border border-emerald-200 bg-emerald-50/40 p-2.5 text-xs space-y-1">
                    <div className="font-semibold text-emerald-900">Đơn #{p.prescription_id}</div>
                    {(p.details || []).map((d, idx) => (
                      <div key={d.detail_id ?? idx} className="text-slate-700">
                        • {d.med_name || `Thuốc #${d.med_id}`} × {d.quantity} — {d.dosage}
                      </div>
                    ))}
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
                <label className="text-xs font-bold text-slate-700 block mb-1">Chọn thuốc theo danh mục DB:</label>
                <select
                  value={newMed.med_id}
                  onChange={(e) => {
                    const found = DB_MEDICINES.find(m => m.med_id === Number(e.target.value));
                    if (found) {
                      setNewMed({
                        ...newMed,
                        med_id: found.med_id,
                        name: found.name,
                        unit: found.unit,
                        unit_price: found.unit_price,
                        dosage: found.defaultUsage,
                        frequency: found.defaultUsage
                      });
                    }
                  }}
                  className="w-full p-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-[#004282]"
                >
                  {DB_MEDICINES.map(m => (
                    <option key={m.med_id} value={m.med_id}>[ID #{m.med_id}] {m.name} ({m.unit_price.toLocaleString("vi-VN")}đ/{m.unit})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Mã thuốc (med_id):</label>
                  <input
                    type="number"
                    min={1}
                    value={newMed.med_id}
                    onChange={(e) => setNewMed({ ...newMed, med_id: Number(e.target.value) })}
                    className="w-full p-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Số lượng:</label>
                  <input
                    type="number"
                    min={1}
                    value={newMed.quantity}
                    onChange={(e) => setNewMed({ ...newMed, quantity: Number(e.target.value) })}
                    className="w-full p-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Đơn giá (đ):</label>
                  <input
                    type="number"
                    min={0}
                    value={newMed.unit_price}
                    onChange={(e) => setNewMed({ ...newMed, unit_price: Number(e.target.value) })}
                    className="w-full p-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Liều dùng (dosage):</label>
                <input
                  type="text"
                  value={newMed.dosage}
                  onChange={(e) => setNewMed({ ...newMed, dosage: e.target.value, frequency: e.target.value })}
                  placeholder="Ví dụ: Sáng 1 viên, Tối 1 viên..."
                  className="w-full p-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Ghi chú (note):</label>
                <input
                  type="text"
                  value={newMed.note}
                  onChange={(e) => setNewMed({ ...newMed, note: e.target.value })}
                  placeholder="Ví dụ: Uống sau khi ăn..."
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

              {LAB_TEST_CATALOG.map(test => {
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
