import { useState } from "react";
import {
  FlaskConical,
  Search,
  Play,
  PlusCircle,
  Save,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import api from "../../services/api";

const DEFAULT_RESULT_JSON = JSON.stringify(
  {
    conclusion: "Bình thường",
    note: "Đã kiểm tra mẫu đạt chuẩn",
  },
  null,
  2
);

const validId = (value) =>
  /^[1-9]\d*$/.test(String(value).trim()) && Number.isSafeInteger(Number(value));

export default function ParaclinicalDashboard() {
  const { user } = useAuth();
  const [labRequestId, setLabRequestId] = useState("");
  const [labTechId, setLabTechId] = useState(
    user?.staff_id ? String(user.staff_id) : ""
  );
  const [resultId, setResultId] = useState("");
  const [resultJson, setResultJson] = useState(DEFAULT_RESULT_JSON);
  const [attachmentUrl, setAttachmentUrl] = useState("");

  const [fetchedResult, setFetchedResult] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const parseJsonObject = (raw) => {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      throw new Error("result_data phải là một JSON object (ví dụ: {\"conclusion\": \"...\"}).");
    }
    return parsed;
  };

  // 1. PUT /api/v1/labtechnician/lab/status
  const handleStartProcessing = async () => {
    setError("");
    setNotice("");
    if (!validId(labRequestId)) {
      setError("Vui lòng nhập mã chỉ định (lab_request_id) là số nguyên dương.");
      return;
    }
    setBusy(true);
    try {
      const res = await api.put("/labtechnician/lab/status", {
        lab_request_id: Number(labRequestId),
      });
      if (!res.data?.success) {
        throw new Error(res.data?.message || "Không chuyển được trạng thái.");
      }
      setNotice(
        res.data.message ||
          `Đã chuyển chỉ định #${labRequestId} sang trạng thái PROCESSING.`
      );
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Lỗi cập nhật trạng thái.");
    } finally {
      setBusy(false);
    }
  };

  // 2. GET /api/v1/labtechnician/lab/process?lab_request_id=...
  const handleGetResult = async (event) => {
    event.preventDefault();
    setError("");
    setNotice("");
    setFetchedResult(null);
    if (!validId(labRequestId)) {
      setError("Vui lòng nhập mã chỉ định (lab_request_id) là số nguyên dương.");
      return;
    }
    setBusy(true);
    try {
      const res = await api.get("/labtechnician/lab/process", {
        params: { lab_request_id: Number(labRequestId) },
      });
      if (!res.data?.success || !res.data?.data) {
        throw new Error(res.data?.message || "Không tìm thấy kết quả xét nghiệm.");
      }
      const data = res.data.data;
      setFetchedResult(data);
      setResultId(String(data.result_id || ""));
      setAttachmentUrl(data.attachment_url || "");
      const parsedData =
        typeof data.result_data === "string"
          ? JSON.parse(data.result_data)
          : data.result_data;
      setResultJson(JSON.stringify(parsedData || {}, null, 2));
      setNotice(`Đã tải kết quả #${data.result_id} cho chỉ định #${labRequestId}.`);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Không thể tra cứu kết quả.");
    } finally {
      setBusy(false);
    }
  };

  // 3. POST /api/v1/labtechnician/lab/process
  const handleCreateResult = async (event) => {
    event.preventDefault();
    setError("");
    setNotice("");
    if (!validId(labRequestId) || !validId(labTechId)) {
      setError("Vui lòng nhập lab_request_id và lab_tech_id là số nguyên dương.");
      return;
    }
    let resultDataObj;
    try {
      resultDataObj = parseJsonObject(resultJson);
    } catch (jsonErr) {
      setError("JSON result_data không hợp lệ: " + jsonErr.message);
      return;
    }

    setBusy(true);
    try {
      const res = await api.post("/labtechnician/lab/process", {
        lab_request_id: Number(labRequestId),
        lab_tech_id: Number(labTechId),
        result_data: resultDataObj,
        attachment_url: attachmentUrl.trim() || null,
      });
      if (!res.data?.success) {
        throw new Error(res.data?.message || "Không thể nhập kết quả.");
      }
      setResultId(String(res.data.result_id || ""));
      setNotice(
        `Đã nhập kết quả xét nghiệm thành công! Mã kết quả (result_id): ${res.data.result_id}.`
      );
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Lỗi nhập kết quả xét nghiệm.");
    } finally {
      setBusy(false);
    }
  };

  // 4. PUT /api/v1/labtechnician/lab/process?result_id=...
  const handleUpdateResult = async () => {
    setError("");
    setNotice("");
    if (!validId(resultId)) {
      setError("Vui lòng nhập result_id hợp lệ để cập nhật kết quả.");
      return;
    }
    let resultDataObj;
    try {
      resultDataObj = parseJsonObject(resultJson);
    } catch (jsonErr) {
      setError("JSON result_data không hợp lệ: " + jsonErr.message);
      return;
    }

    setBusy(true);
    try {
      const res = await api.put(
        "/labtechnician/lab/process",
        {
          result_data: resultDataObj,
          attachment_url: attachmentUrl.trim() || null,
        },
        { params: { result_id: Number(resultId) } }
      );
      if (!res.data?.success) {
        throw new Error(res.data?.message || "Không thể cập nhật kết quả.");
      }
      setNotice(`Đã cập nhật kết quả xét nghiệm #${resultId} thành công!`);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Lỗi cập nhật kết quả.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold text-slate-900">
          <FlaskConical className="text-purple-700" /> Tiếp nhận & trả kết quả cận lâm sàng
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Quản lý quy trình xét nghiệm: Tiếp nhận mẫu (PROCESSING), Tra cứu, Nhập mới và Cập nhật kết quả.
        </p>
      </div>

      {error && (
        <div role="alert" className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {notice && (
        <div role="status" className="flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
          <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
          <span>{notice}</span>
        </div>
      )}

      {/* Bước 1 & 2: Tra cứu kết quả hoặc tiếp nhận xử lý chỉ định */}
      <form
        onSubmit={handleGetResult}
        className="rounded-xl border border-slate-200 bg-white p-5 space-y-4 shadow-sm"
      >
        <h2 className="font-bold text-slate-800 text-base">
          1. Tiếp nhận chỉ định & Tra cứu kết quả theo mã chỉ định
        </h2>
        <div className="flex flex-col sm:flex-row gap-3 sm:items-end">
          <label className="flex-1 text-sm font-semibold text-slate-700">
            Mã chỉ định xét nghiệm (lab_request_id)
            <input
              type="number"
              min="1"
              value={labRequestId}
              disabled={busy}
              onChange={(e) => setLabRequestId(e.target.value)}
              placeholder="Ví dụ: 13 (REQUESTED) hoặc 11 (PROCESSING) hoặc 1 (COMPLETED)"
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 font-normal text-sm"
            />
          </label>
          <button
            type="button"
            disabled={busy}
            onClick={handleStartProcessing}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-purple-700 hover:bg-purple-800 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            <Play size={16} /> Tiếp nhận mẫu (PROCESSING)
          </button>
          <button
            type="submit"
            disabled={busy}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#004282] hover:bg-[#003366] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            <Search size={16} /> Xem kết quả (GET)
          </button>
        </div>

        {fetchedResult && (
          <div className="rounded-lg border border-blue-200 bg-blue-50/40 p-4 text-xs space-y-2">
            <div className="grid gap-2 sm:grid-cols-3 text-slate-700">
              <div><strong>Result ID:</strong> #{fetchedResult.result_id}</div>
              <div><strong>KTV:</strong> {fetchedResult.lab_tech_name || `#${fetchedResult.lab_tech_id}`}</div>
              <div><strong>Hoàn thành:</strong> {fetchedResult.completed_at ? new Date(fetchedResult.completed_at).toLocaleString("vi-VN") : "—"}</div>
            </div>
            {fetchedResult.attachment_url && (
              <div>
                <strong>Tệp đính kèm:</strong>{" "}
                <a href={fetchedResult.attachment_url} target="_blank" rel="noreferrer" className="text-blue-700 underline">
                  {fetchedResult.attachment_url}
                </a>
              </div>
            )}
          </div>
        )}
      </form>

      {/* Bước 3 & 4: Nhập mới (POST) hoặc Cập nhật (PUT) kết quả xét nghiệm */}
      <form
        onSubmit={handleCreateResult}
        className="rounded-xl border border-slate-200 bg-white p-5 space-y-4 shadow-sm"
      >
        <h2 className="font-bold text-slate-800 text-base">
          2. Nhập mới (POST) hoặc Cập nhật (PUT) kết quả xét nghiệm
        </h2>

        <div className="grid gap-4 sm:grid-cols-3">
          <label className="text-sm font-semibold text-slate-700">
            Mã KTV (lab_tech_id) — dùng khi POST
            <input
              type="number"
              min="1"
              value={labTechId}
              disabled={busy}
              onChange={(e) => setLabTechId(e.target.value)}
              placeholder="Ví dụ: 10"
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 font-normal text-sm"
            />
          </label>
          <label className="text-sm font-semibold text-slate-700">
            Mã kết quả (result_id) — dùng khi PUT
            <input
              type="number"
              min="1"
              value={resultId}
              disabled={busy}
              onChange={(e) => setResultId(e.target.value)}
              placeholder="Tự điền khi Xem/Nhập KQ"
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 font-normal text-sm"
            />
          </label>
          <label className="text-sm font-semibold text-slate-700">
            Link file đính kèm (attachment_url)
            <input
              type="text"
              value={attachmentUrl}
              disabled={busy}
              onChange={(e) => setAttachmentUrl(e.target.value)}
              placeholder="https://pacs.hospital.vn/results/..."
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 font-normal text-sm"
            />
          </label>
        </div>

        <label className="block text-sm font-semibold text-slate-700">
          Dữ liệu kết quả (result_data — JSON Object)
          <textarea
            rows={7}
            value={resultJson}
            disabled={busy}
            onChange={(e) => setResultJson(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 p-3 font-mono text-xs"
          />
        </label>

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={busy}
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            <PlusCircle size={16} /> Nhập kết quả mới (POST)
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={handleUpdateResult}
            className="inline-flex items-center gap-2 rounded-lg bg-[#004282] hover:bg-[#003366] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            <Save size={16} /> Cập nhật kết quả (PUT)
          </button>
        </div>
      </form>
    </div>
  );
}
