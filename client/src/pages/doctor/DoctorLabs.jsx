import { useState } from "react";
import { FlaskConical, Search, RefreshCw, Pencil, Trash2, Save, X } from "lucide-react";
import api from "../../services/api";

const STATUS_NAMES = {
  REQUESTED: "Đã chỉ định", PROCESSING: "Đang thực hiện",
  COMPLETED: "Đã hoàn thành chỉ định", CANCELLED: "Đã hủy",
};
const STATUS_STYLES = {
  REQUESTED: "bg-amber-50 text-amber-800", PROCESSING: "bg-blue-50 text-blue-800",
  COMPLETED: "bg-emerald-50 text-emerald-800", CANCELLED: "bg-slate-100 text-slate-600",
};
const formatDate = value => value ? new Date(value).toLocaleString("vi-VN") : "—";
const validId = value => /^[1-9]\d*$/.test(String(value)) && Number.isSafeInteger(Number(value));
const errorMessage = err => {
  if ([401, 403].includes(err.response?.status)) return "Cần đăng nhập bằng tài khoản bác sĩ thật có quyền truy cập API.";
  if (!err.response || [502, 503].includes(err.response.status)) return "Chưa kết nối được backend hoặc database.";
  return err.response?.data?.message || err.message || "Thao tác thất bại.";
};

export default function DoctorLabs() {
  const [patientId, setPatientId] = useState("");
  const [searchedId, setSearchedId] = useState("");
  const [labs, setLabs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [busyId, setBusyId] = useState(null);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const fetchLabs = async (value) => {
    const id = String(value).trim();
    if (!validId(id)) {
      setError("Vui lòng nhập patient_id là số nguyên dương hợp lệ.");
      setLabs([]);
      setSearchedId("");
      return;
    }
    setLoading(true);
    setError(""); setNotice(""); setSearchedId(""); setLabs([]); setEditing(null);
    try {
      const res = await api.get("/doctor/lab-requests", { params: { patient_id: id } });
      if (!res.data?.success || !Array.isArray(res.data.data)) {
        throw new Error(res.data?.message || "Phản hồi API không hợp lệ.");
      }
      setLabs(res.data.data);
      setSearchedId(id);
    } catch (err) { setError(errorMessage(err)); }
    finally { setLoading(false); }
  };

  const beginEdit = lab => {
    setError(""); setNotice("");
    setEditing({ id: String(lab.lab_request_id), test_type: lab.test_type || "", status: lab.status || "REQUESTED" });
  };

  const saveEdit = async event => {
    event.preventDefault();
    if (!editing || busyId || !searchedId) return;
    const item = labs.find(lab => String(lab.lab_request_id) === editing.id);
    if (!item || !validId(editing.id) || item.status !== "REQUESTED" || !editing.test_type.trim()) {
      setError("Chỉ sửa được yêu cầu đang ở trạng thái Đã chỉ định và có tên xét nghiệm hợp lệ.");
      return;
    }
    if (editing.test_type.trim().length > 100) {
      setError("Tên xét nghiệm tối đa 100 ký tự theo database."); return;
    }
    setBusyId(editing.id); setError(""); setNotice("");
    try {
      // Backend PUT expects both fields and overwrites both; retain original status.
      const res = await api.put(`/doctor/lab-requests/${editing.id}`, {
        test_type: editing.test_type.trim(), status: "REQUESTED",
      });
      if (!res.data?.success) throw new Error(res.data?.message || "Backend không xác nhận cập nhật.");
      setEditing(null);
      setNotice(`Đã cập nhật chỉ định #${editing.id}.`);
      // Reload the authoritative list; never rely only on an optimistic mutation.
      const fresh = await api.get("/doctor/lab-requests", { params: { patient_id: searchedId } });
      if (!fresh.data?.success || !Array.isArray(fresh.data.data)) throw new Error("Đã lưu nhưng không tải lại được danh sách.");
      setLabs(fresh.data.data);
    } catch (err) {
      setError(errorMessage(err) + " Hãy tra cứu lại trước khi thao tác tiếp.");
      setSearchedId(""); setLabs([]);
    } finally { setBusyId(null); }
  };

  const deleteLab = async lab => {
    const id = String(lab.lab_request_id);
    if (!validId(id) || !searchedId || busyId || lab.status !== "REQUESTED") return;
    const confirmation = window.prompt(
      `Xóa chỉ định #${id}? Chỉ thực hiện với yêu cầu chưa xử lý. Nhập ${id} để xác nhận:`
    );
    if (confirmation !== id) return;
    setBusyId(id); setError(""); setNotice("");
    try {
      const res = await api.delete(`/doctor/lab-requests/${id}`);
      if (!res.data?.success) throw new Error(res.data?.message || "Backend không xác nhận xóa.");
      setNotice(`Đã xóa chỉ định #${id}.`);
      const fresh = await api.get("/doctor/lab-requests", { params: { patient_id: searchedId } });
      if (!fresh.data?.success || !Array.isArray(fresh.data.data)) throw new Error("Đã xóa nhưng không tải lại được danh sách.");
      setLabs(fresh.data.data);
    } catch (err) {
      setError(errorMessage(err) + " Hãy tra cứu lại để biết trạng thái thực tế.");
      setSearchedId(""); setLabs([]);
    } finally { setBusyId(null); }
  };

  return <div className="mx-auto max-w-7xl space-y-6">
    <div>
      <h1 className="flex items-center gap-2 text-2xl font-bold text-slate-800"><FlaskConical className="text-purple-600" /> Quản lý chỉ định cận lâm sàng</h1>
      <p className="mt-1 text-sm text-slate-500">Tra cứu, chỉnh sửa và xóa chỉ định chưa thực hiện. Dữ liệu từ backend, không có kết quả xét nghiệm giả.</p>
    </div>
    <form onSubmit={e => { e.preventDefault(); if (!loading && !busyId) fetchLabs(patientId); }} className="flex flex-col gap-3 rounded-xl border bg-white p-4 sm:flex-row sm:items-end">
      <label className="flex-1 space-y-1 text-sm font-semibold text-slate-700">Mã bệnh nhân (patient_id)
        <input value={patientId} disabled={loading || Boolean(busyId)} onChange={e => setPatientId(e.target.value)} inputMode="numeric" placeholder="Ví dụ: 12" className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 font-normal" />
      </label>
      <button type="submit" disabled={loading || Boolean(busyId)} className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#004282] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">
        {loading ? <RefreshCw size={16} className="animate-spin" /> : <Search size={16} />} {loading ? "Đang tra cứu..." : "Tra cứu / Tải lại"}
      </button>
    </form>
    <p className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">API này trả <strong>chỉ định</strong>, không trả phiếu kết quả. Chỉ định đã chuyển sang PROCESSING/COMPLETED/CANCELLED được giữ nguyên; không cho sửa hoặc xóa từ giao diện này.</p>
    {error && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">{error}</p>}
    {notice && !error && <p role="status" className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">{notice}</p>}
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
      <table className="w-full min-w-[780px] text-left text-sm">
        <thead className="border-b bg-slate-50 text-slate-700"><tr><th className="px-4 py-3">Mã chỉ định</th><th className="px-4 py-3">Bệnh án</th><th className="px-4 py-3">Xét nghiệm</th><th className="px-4 py-3">Ngày tạo</th><th className="px-4 py-3">Trạng thái</th><th className="px-4 py-3">Thao tác</th></tr></thead>
        <tbody className="divide-y divide-slate-100">
          {labs.map(lab => <tr key={lab.lab_request_id}>
            <td className="px-4 py-3 font-mono">{lab.lab_request_id}</td><td className="px-4 py-3 font-mono">{lab.record_id}</td>
            <td className="px-4 py-3">{lab.test_type || "—"}</td><td className="px-4 py-3">{formatDate(lab.created_at)}</td>
            <td className="px-4 py-3"><span className={`rounded-full px-2 py-1 text-xs ${STATUS_STYLES[lab.status] || "bg-slate-100"}`}>{STATUS_NAMES[lab.status] || lab.status || "Không rõ"}</span></td>
            <td className="space-x-2 px-4 py-3">
              {lab.status === "REQUESTED" && <>
                <button type="button" disabled={Boolean(busyId)} onClick={() => beginEdit(lab)} className="inline-flex items-center gap-1 rounded border px-2 py-1 text-blue-700 disabled:opacity-40"><Pencil size={13} /> Sửa</button>
                <button type="button" disabled={Boolean(busyId)} onClick={() => deleteLab(lab)} className="inline-flex items-center gap-1 rounded border px-2 py-1 text-red-700 disabled:opacity-40"><Trash2 size={13} /> Xóa</button>
              </>}
              {lab.status !== "REQUESTED" && <span className="text-xs text-slate-400">Chỉ xem</span>}
            </td>
          </tr>)}
          {!loading && labs.length === 0 && <tr><td colSpan={6} className="px-4 py-10 text-center text-slate-500">{error ? "Không tải được dữ liệu." : searchedId ? `Không có chỉ định cho bệnh nhân #${searchedId}.` : "Nhập mã bệnh nhân để tra cứu."}</td></tr>}
          {loading && <tr><td colSpan={6} className="px-4 py-10 text-center text-slate-500">Đang tải dữ liệu...</td></tr>}
        </tbody>
      </table>
    </div>
    {editing && <form onSubmit={saveEdit} className="space-y-4 rounded-xl border border-blue-200 bg-white p-5">
      <h2 className="text-base font-bold">Chỉnh sửa chỉ định #{editing.id}</h2>
      <label className="block text-sm font-semibold">Loại xét nghiệm
        <input value={editing.test_type} onChange={e => setEditing(p => ({ ...p, test_type: e.target.value }))} maxLength={100} required disabled={Boolean(busyId)} className="mt-1 w-full rounded-lg border border-slate-300 p-2" />
      </label>
      <p className="text-xs text-slate-500">Giữ trạng thái REQUESTED. Backend không hỗ trợ chỉnh sửa kết quả xét nghiệm tại đây.</p>
      <div className="flex gap-2"><button disabled={Boolean(busyId)} className="inline-flex items-center gap-2 rounded bg-[#004282] px-4 py-2 text-sm text-white"><Save size={16}/> Lưu thay đổi</button>
        <button type="button" disabled={Boolean(busyId)} onClick={() => setEditing(null)} className="inline-flex items-center gap-2 rounded border px-4 py-2 text-sm"><X size={16}/> Hủy</button></div>
    </form>}
  </div>;
}
