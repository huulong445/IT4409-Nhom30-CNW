import { useEffect, useMemo, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { ArrowLeft, CalendarDays, UserPlus } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import api from "../../services/api";

const localDate = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const initialPatientForm = {
  full_name: "",
  dob: "",
  gender: "OTHER",
  address: "",
  identity_card: "",
  insurance_number: "",
};

export default function PatientBooking() {
  const { user } = useAuth();
  const [patients, setPatients] = useState([]);
  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [patientForm, setPatientForm] = useState(initialPatientForm);
  const [showPatientForm, setShowPatientForm] = useState(false);
  const [appointmentDate, setAppointmentDate] = useState(localDate());
  const [availability, setAvailability] = useState([]);
  const [selectedShift, setSelectedShift] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [loadingPatients, setLoadingPatients] = useState(true);
  const [loadingAvailability, setLoadingAvailability] = useState(true);
  const [savingPatient, setSavingPatient] = useState(false);
  const [booking, setBooking] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const selectedPatient = useMemo(
    () => patients.find((patient) => String(patient.patient_id) === selectedPatientId),
    [patients, selectedPatientId],
  );
  const selectedAvailability =
    selectedShift === "" ? null : availability[Number(selectedShift)] || null;

  const isPatientUser = Boolean(user && String(user.role).toUpperCase() === "PATIENT");

  useEffect(() => {
    if (!isPatientUser) {
      setLoadingPatients(false);
      return undefined;
    }
    let cancelled = false;

    const loadPatients = async () => {
      setLoadingPatients(true);
      try {
        const response = await api.get("/patients");
        if (!response.data?.success || !Array.isArray(response.data.data)) {
          throw new Error("Phản hồi danh sách hồ sơ không hợp lệ");
        }

        if (!cancelled) {
          const ownPatients = response.data.data;
          setPatients(ownPatients);
          setSelectedPatientId((current) =>
            ownPatients.some((patient) => String(patient.patient_id) === current)
              ? current
              : String(ownPatients[0]?.patient_id || ""),
          );
        }
      } catch (requestError) {
        if (!cancelled) {
          setError(
            requestError.response?.data?.message ||
              requestError.message ||
              "Không thể tải hồ sơ bệnh nhân",
          );
        }
      } finally {
        if (!cancelled) setLoadingPatients(false);
      }
    };

    loadPatients();
    return () => {
      cancelled = true;
    };
  }, [isPatientUser]);

  useEffect(() => {
    if (!isPatientUser) {
      setLoadingAvailability(false);
      return undefined;
    }
    let cancelled = false;

    const loadAvailability = async () => {
      setLoadingAvailability(true);
      setAvailability([]);
      setSelectedShift("");
      try {
        const response = await api.get("/patients/availability", {
          params: { date: appointmentDate },
        });
        if (!response.data?.success || !Array.isArray(response.data.data)) {
          throw new Error("Phản hồi lịch trực không hợp lệ");
        }
        if (!cancelled) setAvailability(response.data.data);
      } catch (requestError) {
        if (!cancelled) {
          setError(
            requestError.response?.data?.message ||
              requestError.message ||
              "Không thể tải lịch trực bác sĩ",
          );
        }
      } finally {
        if (!cancelled) setLoadingAvailability(false);
      }
    };

    loadAvailability();
    return () => {
      cancelled = true;
    };
  }, [appointmentDate, isPatientUser]);

  const createPatient = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setSavingPatient(true);

    try {
      const response = await api.post("/patients", patientForm);
      if (!response.data?.success || !response.data?.data?.patient_id) {
        throw new Error(response.data?.message || "Không tạo được hồ sơ bệnh nhân");
      }

      const newPatient = response.data.data;
      setPatients((current) => [newPatient, ...current]);
      setSelectedPatientId(String(newPatient.patient_id));
      setPatientForm(initialPatientForm);
      setShowPatientForm(false);
      setSuccess(`Đã tạo hồ sơ ${newPatient.full_name}. Bạn có thể chọn hồ sơ này để đặt lịch.`);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          requestError.message ||
          "Không thể tạo hồ sơ bệnh nhân",
      );
    } finally {
      setSavingPatient(false);
    }
  };

  const createAppointment = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!selectedPatient || !selectedAvailability || !appointmentTime) {
      setError("Vui lòng chọn hồ sơ bệnh nhân, ca trực và giờ khám.");
      return;
    }

    setBooking(true);
    try {
      const response = await api.post("/patients/appointments", {
        patient_id: selectedPatient.patient_id,
        doctor_id: selectedAvailability.doctor_id,
        room_id: selectedAvailability.room_id,
        appointment_date: appointmentDate,
        appointment_time: appointmentTime,
      });

      if (!response.data?.success || !response.data?.data?.appointment_id) {
        throw new Error(response.data?.message || "Không tạo được lịch hẹn");
      }

      setSuccess(
        `Đặt lịch thành công cho ${selectedPatient.full_name}. Mã lịch hẹn: ${response.data.data.appointment_id}.`,
      );
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          requestError.message ||
          "Không thể đặt lịch khám",
      );
    } finally {
      setBooking(false);
    }
  };

  if (!user) {
    return <Navigate to="/login?role=patient&redirect=/patient/booking" replace />;
  }
  if (String(user.role).toUpperCase() !== "PATIENT") {
    return (
      <div className="mx-auto max-w-2xl p-8 text-amber-800">
        Chức năng này dành cho tài khoản bệnh nhân.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-8">
      <Link
        to="/patient"
        className="inline-flex items-center gap-2 text-sm font-semibold text-[#004282] hover:underline"
      >
        <ArrowLeft size={17} />
        Quay lại Cổng Người Bệnh
      </Link>

      <header>
        <h1 className="text-2xl font-extrabold text-slate-900">
          Đặt lịch khám
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Chọn hồ sơ bệnh nhân cần khám. Một tài khoản có thể quản lý nhiều hồ sơ.
        </p>
      </header>

      {error && (
        <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}
      {success && (
        <div role="status" className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800">
          {success}
        </div>
      )}

      <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-bold text-slate-900">Hồ sơ bệnh nhân</h2>
            <p className="text-sm text-slate-500">
              Lịch hẹn sẽ được gắn với hồ sơ đang chọn.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setShowPatientForm((visible) => !visible);
              setError("");
              setSuccess("");
            }}
            className="inline-flex items-center gap-2 rounded-lg bg-[#004282] px-4 py-2 text-sm font-semibold text-white hover:bg-[#003466]"
          >
            <UserPlus size={16} />
            {showPatientForm ? "Đóng" : "Thêm hồ sơ"}
          </button>
        </div>

        {loadingPatients ? (
          <p className="text-sm text-slate-500">Đang tải hồ sơ...</p>
        ) : patients.length ? (
          <label className="block text-sm font-medium text-slate-700">
            Người bệnh
            <select
              value={selectedPatientId}
              onChange={(event) => {
                setSelectedPatientId(event.target.value);
                setSuccess("");
              }}
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2"
            >
              {patients.map((patient) => (
                <option key={patient.patient_id} value={patient.patient_id}>
                  {patient.full_name} — Mã BN {patient.patient_id}
                </option>
              ))}
            </select>
          </label>
        ) : (
          <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
            Tài khoản chưa có hồ sơ bệnh nhân. Hãy tạo hồ sơ trước khi đặt lịch.
          </p>
        )}

        {showPatientForm && (
          <form onSubmit={createPatient} className="grid gap-3 border-t border-slate-100 pt-4 sm:grid-cols-2">
            <label className="text-sm font-medium text-slate-700">
              Họ tên *
              <input
                required
                maxLength={100}
                value={patientForm.full_name}
                onChange={(event) => setPatientForm({ ...patientForm, full_name: event.target.value })}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
              />
            </label>
            <label className="text-sm font-medium text-slate-700">
              Ngày sinh *
              <input
                required
                type="date"
                max={localDate()}
                value={patientForm.dob}
                onChange={(event) => setPatientForm({ ...patientForm, dob: event.target.value })}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
              />
            </label>
            <label className="text-sm font-medium text-slate-700">
              Giới tính *
              <select
                value={patientForm.gender}
                onChange={(event) => setPatientForm({ ...patientForm, gender: event.target.value })}
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2"
              >
                <option value="MALE">Nam</option>
                <option value="FEMALE">Nữ</option>
                <option value="OTHER">Khác</option>
              </select>
            </label>
            <label className="text-sm font-medium text-slate-700">
              Địa chỉ
              <input
                maxLength={500}
                value={patientForm.address}
                onChange={(event) => setPatientForm({ ...patientForm, address: event.target.value })}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
              />
            </label>
            <label className="text-sm font-medium text-slate-700">
              CCCD/VNeID
              <input
                maxLength={20}
                value={patientForm.identity_card}
                onChange={(event) => setPatientForm({ ...patientForm, identity_card: event.target.value })}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
              />
            </label>
            <label className="text-sm font-medium text-slate-700">
              Mã BHYT
              <input
                maxLength={20}
                value={patientForm.insurance_number}
                onChange={(event) => setPatientForm({ ...patientForm, insurance_number: event.target.value })}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
              />
            </label>
            <div className="sm:col-span-2">
              <button
                type="submit"
                disabled={savingPatient}
                className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-60"
              >
                {savingPatient ? "Đang lưu..." : "Tạo hồ sơ"}
              </button>
            </div>
          </form>
        )}
      </section>

      <form onSubmit={createAppointment} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="font-bold text-slate-900">Thông tin lịch khám</h2>

        {selectedPatient && (
          <div className="rounded-lg bg-blue-50 p-3 text-sm text-blue-900">
            Đặt lịch cho <strong>{selectedPatient.full_name}</strong> (Mã BN {selectedPatient.patient_id})
          </div>
        )}

        <label className="block text-sm font-medium text-slate-700">
          Ngày khám *
          <span className="relative mt-1 block">
            <CalendarDays size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              required
              type="date"
              min={localDate()}
              value={appointmentDate}
              onChange={(event) => {
                setAppointmentDate(event.target.value);
                setError("");
                setSuccess("");
              }}
              className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3"
            />
          </span>
        </label>

        <label className="block text-sm font-medium text-slate-700">
          Bác sĩ, khoa, phòng và ca trực *
          <select
            required
            value={selectedShift}
            onChange={(event) => setSelectedShift(event.target.value)}
            disabled={loadingAvailability || availability.length === 0}
            className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 disabled:bg-slate-100"
          >
            <option value="">
              {loadingAvailability
                ? "Đang tải lịch trực..."
                : availability.length
                  ? "Chọn ca trực"
                  : "Không có ca trực phòng khám trong ngày này"}
            </option>
            {availability.map((shift, index) => (
              <option key={`${shift.doctor_id}-${shift.room_id}-${shift.start_time}-${index}`} value={index}>
                {shift.department_name} — BS. {shift.doctor_name} — {shift.room_name} ({String(shift.start_time).slice(0, 5)}–{String(shift.end_time).slice(0, 5)})
              </option>
            ))}
          </select>
        </label>

        <div className="block text-sm font-medium text-slate-700">
          <span>Giờ khám *</span>
          <div className="mt-1 grid grid-cols-2 gap-3">
            <select
              required
              aria-label="Giờ khám (00-23)"
              value={appointmentTime ? appointmentTime.split(":")[0] : ""}
              onChange={(event) => {
                const hour = event.target.value;
                const minute = appointmentTime ? appointmentTime.split(":")[1] || "00" : "00";
                setAppointmentTime(hour ? `${hour}:${minute}` : "");
              }}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2"
            >
              <option value="">Chọn giờ (00h - 23h)</option>
              {Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0")).map((hour) => (
                <option key={hour} value={hour}>
                  {hour} giờ
                </option>
              ))}
            </select>
            <select
              required
              aria-label="Phút khám (00-59)"
              value={appointmentTime ? appointmentTime.split(":")[1] || "00" : ""}
              onChange={(event) => {
                const minute = event.target.value;
                const hour = appointmentTime ? appointmentTime.split(":")[0] || "00" : "00";
                setAppointmentTime(minute ? `${hour}:${minute}` : "");
              }}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2"
            >
              <option value="">Chọn phút (00 - 59)</option>
              {Array.from({ length: 60 }, (_, i) => String(i).padStart(2, "0")).map((minute) => (
                <option key={minute} value={minute}>
                  {minute} phút
                </option>
              ))}
            </select>
          </div>
        </div>

        {selectedAvailability && (
          <p className="text-xs text-slate-500">
            Giờ khám phải nằm trong ca trực của bác sĩ. Hệ thống sẽ kiểm tra lại lịch khi lưu.
          </p>
        )}

        <button
          type="submit"
          disabled={
            booking ||
            loadingPatients ||
            patients.length === 0 ||
            !selectedPatient ||
            loadingAvailability ||
            !selectedAvailability
          }
          className="rounded-lg bg-[#004282] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#003466] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {booking ? "Đang đặt lịch..." : "Xác nhận đặt lịch"}
        </button>
      </form>
    </div>
  );
}
