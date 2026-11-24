import { useState } from "react";
import { AlertCircle, FileText, Pill, Search, Trash2, Save } from "lucide-react";
import api from "../../services/api";

const formatDate = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? String(value)
    : date.toLocaleString("vi-VN");
};

export default function DoctorPrescriptions() {
  const [recordId, setRecordId] = useState("");
  const [searchedRecordId, setSearchedRecordId] = useState("");
  const [prescription, setPrescription] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notFound, setNotFound] = useState(false);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [medicationJson, setMedicationJson] = useState("");

  const handleSearch = async (event) => {
    event.preventDefault();
    if (loading) return;

    const id = recordId.trim();
    setError("");
    setNotice("");
    setNotFound(false);
    setPrescription(null);
    setSearchedRecordId("");

    if (!/^[1-9]\d*$/.test(id) || !Number.isSafeInteger(Number(id))) {
      setError("Mã bệnh án (record_id) phải là số nguyên dương hợp lệ.");
      return;
    }

    setLoading(true);
    try {
      const response = await api.get(`/doctor/prescriptions/${id}`);
      const data = response.data?.data;
      if (!response.data?.success || !data || typeof data !== "object" || Array.isArray(data)) {
        throw new Error(response.data?.message || "Phản hồi API đơn thuốc không hợp lệ.");
      }

      setPrescription(data);
      setMedicationJson(data.medication_details == null ? "" :
        typeof data.medication_details === "string"
          ? data.medication_details
          : JSON.stringify(data.medication_details, null, 2));
      setSearchedRecordId(id);
    } catch (err) {
      const status = err.response?.status;
      if (status === 404) {
        setNotFound(true);
        setSearchedRecordId(id);
      } else if (status === 401 || status === 403) {
        setError("Bạn cần đăng nhập bằng tài khoản bác sĩ được xác thực để tra cứu.");
      } else if (status === 502 || status === 503 || !err.response) {
        setError("Không kết nối được backend. Chưa thể tra cứu đơn thuốc.");
      } else {
        setError(err.response?.data?.message || err.message || "Không thể tra cứu đơn thuốc.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!prescription || busy || prescription.medication_details == null) return;
    const id = String(prescription.prescription_id);
    if (!/^[1-9]\d*$/.test(id)) { setError("Mã đơn thuốc không hợp lệ."); return; }
    let details;
    try {
      details = JSON.parse(medicationJson);
      if (!Array.isArray(details) || details.length === 0) {
        throw new Error("Danh sách thuốc cần là một mảng JSON có ít nhất một mục.");
      }
    } catch (err) { setError("Nội dung JSON không hợp lệ: " + err.message); return; }
    if (!window.confirm(`Cập nhật nội dung đơn thuốc #${id} trên backend?`)) return;
    setBusy(true); setError(""); setNotice("");
    try {
      const res = await api.put(`/doctor/prescriptions/${id}`, { medication_details: details });
      if (!res.data?.success) throw new Error(res.data?.message || "Backend không xác nhận cập nhật.");
      setNotice(`Backend đã xác nhận cập nhật đơn #${id}. Hãy tra cứu lại để kiểm tra.`);
      setPrescription(null);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Không thể cập nhật đơn thuốc.");
      setPrescription(null);
    } finally { setBusy(false); }
  };

  const handleDelete = async () => {
    if (!prescription || busy) return;
    const id = String(prescription.prescription_id);
    if (!/^[1-9]\d*$/.test(id)) { setError("Mã đơn thuốc không hợp lệ."); return; }
    if (window.prompt(`Xóa đơn thuốc #${id}? Nhập ${id} để xác nhận:`) !== id) return;
    setBusy(true); setError(""); setNotice("");
    try {
      const res = await api.delete(`/doctor/prescriptions/${id}`);
      if (!res.data?.success) throw new Error(res.data?.message || "Backend không xác nhận xóa.");
      setNotice(`Backend đã xác nhận xóa đơn thuốc #${id}.`);
      setPrescription(null);
      setNotFound(true);
    } catch (err) {
      setError((err.response?.data?.message || err.message || "Không thể xác nhận xóa.") + " Hãy tra cứu lại để xác minh trạng thái.");
      setPrescription(null);
    } finally { setBusy(false); }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold text-slate-800">
          <Pill className="text-emerald-700" /> Tra cứu đơn thuốc
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Tra cứu thông tin đơn thuốc theo mã bệnh án đã được tạo trên hệ thống.
        </p>
      </div>

      <form
        onSubmit={handleSearch}
        className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-end"
      >
        <label className="flex-1 space-y-1 text-sm font-semibold text-slate-700">
          <span>Mã bệnh án (record_id)</span>
          <input
            type="text"
            inputMode="numeric"
            value={recordId}
            disabled={loading || busy}
            onChange={(event) => setRecordId(event.target.value)}
            placeholder="Ví dụ: 12 (không phải mã bệnh nhân)"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 font-normal focus:border-blue-500 focus:outline-none disabled:opacity-60"
          />
        </label>
        <button
          type="submit"
          disabled={loading || busy}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#004282] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
        >
          <Search size={16} /> {loading ? "Đang tra cứu..." : "Tra cứu"}
        </button>
      </form>

      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        <div className="flex items-start gap-2">
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          <p>
            Backend hiện chưa có API danh mục thuốc và tồn kho. API tra cứu đơn thuốc
            chỉ trả thông tin từ bảng <code>prescriptions</code>, chưa trả danh sách
            thuốc trong <code>prescription_details</code>. Vì vậy trang này không
            hiển thị tồn kho, giá hoặc liều dùng giả.
          </p>
        </div>
      </div>

      {notice && !error && (
        <p role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">{notice}</p>
      )}

      {error && (
        <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {notFound && (
        <div role="status" className="rounded-xl border border-slate-200 bg-white p-5 text-sm text-slate-600">
          Chưa tìm thấy đơn thuốc cho bệnh án #{searchedRecordId}.
        </div>
      )}

      {prescription && (
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-800">
            <FileText size={19} className="text-[#004282]" /> Thông tin đơn thuốc
          </h2>
          <dl className="grid gap-4 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-slate-500">Mã đơn thuốc</dt>
              <dd className="mt-1 font-semibold text-slate-900">{prescription.prescription_id ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Mã bệnh án</dt>
              <dd className="mt-1 font-semibold text-slate-900">{prescription.record_id ?? searchedRecordId}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Mã nhân sự bác sĩ</dt>
              <dd className="mt-1 font-semibold text-slate-900">{prescription.doctor_id ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Thời điểm tạo</dt>
              <dd className="mt-1 font-semibold text-slate-900">{formatDate(prescription.created_at)}</dd>
            </div>
          </dl>
          {prescription.medication_details != null ? (
            <div className="mt-5 space-y-2 border-t border-slate-100 pt-4">
              <label className="block text-sm font-semibold text-slate-700">Nội dung đơn thuốc (JSON từ API cũ)
                <textarea rows={7} value={medicationJson} disabled={busy}
                  onChange={e => setMedicationJson(e.target.value)}
                  className="mt-2 w-full rounded-lg border border-slate-300 p-3 font-mono text-xs" />
              </label>
              <p className="text-xs text-amber-700">Chỉ dùng được nếu backend lưu trường medication_details. Schema hiện hành không có trường này, vì vậy PUT có thể thất bại.</p>
              <button type="button" disabled={busy} onClick={handleUpdate} className="inline-flex items-center gap-2 rounded-lg bg-[#004282] px-3 py-2 text-sm text-white disabled:opacity-50"><Save size={15}/> Cập nhật nội dung đơn</button>
            </div>
          ) : <p className="mt-5 border-t border-slate-100 pt-4 text-sm text-slate-500">
            Danh sách thuốc chi tiết chưa có trong phản hồi API. Không thể sửa nội dung đơn thuốc khi thiếu dữ liệu gốc.
          </p>}
          <div className="mt-4 border-t border-slate-100 pt-3">
            <button type="button" onClick={handleDelete} disabled={busy}
              className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-700 disabled:opacity-50">
              <Trash2 size={15}/> Xóa đơn thuốc #{prescription.prescription_id}
            </button>
          </div>
        </div>
      )}

      {!loading && !prescription && !error && !notFound && (
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
          Nhập mã bệnh án để tra cứu đơn thuốc.
        </div>
      )}
    </div>
  );
}
