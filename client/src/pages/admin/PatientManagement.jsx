import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { RefreshCw, Search, Users, X } from "lucide-react";
import api from "../../services/api";

const getErrorMessage = (error, fallback) =>
  error.response?.data?.message || error.message || fallback;

const formatDate = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "—"
    : date.toLocaleDateString("vi-VN");
};

export default function PatientManagement() {
  const [accounts, setAccounts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const loadPatients = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      // Backend hien chi co danh sach TAI KHOAN, chua co GET /admin/patients.
      const response = await api.get("/admin/users");
      if (!response.data?.success || !Array.isArray(response.data?.data)) {
        throw new Error("Phản hồi danh sách tài khoản không hợp lệ.");
      }
      setAccounts(response.data.data.filter((u) => u.role === "PATIENT"));
    } catch (err) {
      setAccounts([]);
      setError(getErrorMessage(err, "Không thể tải tài khoản bệnh nhân."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPatients();
  }, [loadPatients]);

  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return accounts;
    return accounts.filter((user) =>
      [user.username, user.email, user.phone, String(user.user_id)]
        .some((value) => String(value ?? "").toLowerCase().includes(keyword))
    );
  }, [accounts, search]);

  const viewAccount = async (userId) => {
    setSelected(null);
    setDetailError("");
    setDetailLoading(true);
    try {
      const response = await api.get(`/admin/users/${userId}`);
      if (!response.data?.success || !response.data?.data) {
        throw new Error("Không lấy được chi tiết tài khoản.");
      }
      setSelected(response.data.data);
    } catch (err) {
      setDetailError(getErrorMessage(err, "Không thể xem chi tiết tài khoản."));
    } finally {
      setDetailLoading(false);
    }
  };

  const toggleStatus = async (account) => {
    const currentlyActive = Boolean(account.is_active);
    const nextActive = !currentlyActive;
    const action = currentlyActive ? "khóa" : "mở khóa";
    if (!window.confirm(`Bạn có chắc muốn ${action} tài khoản ${account.username}?`)) {
      return;
    }

    setError("");
    setUpdatingId(account.user_id);
    try {
      const response = await api.patch(
        `/admin/users/${account.user_id}/status`,
        { is_active: nextActive }
      );
      if (!response.data?.success) {
        throw new Error(response.data?.message || "Cập nhật trạng thái thất bại.");
      }
      setAccounts((items) => items.map((item) =>
        item.user_id === account.user_id
          ? { ...item, is_active: nextActive }
          : item
      ));
      setSelected((item) =>
        item?.user_id === account.user_id
          ? { ...item, is_active: nextActive }
          : item
      );
    } catch (err) {
      setError(getErrorMessage(err, "Không thể thay đổi trạng thái tài khoản."));
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Users className="text-[#004282]" size={26} />
            Quản lý bệnh nhân
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Danh sách tài khoản người bệnh đã đăng ký trên hệ thống
          </p>
        </div>
        <button
          type="button"
          onClick={loadPatients}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 border border-slate-200 bg-white rounded-lg hover:bg-slate-50 disabled:opacity-50"
        >
          <RefreshCw size={16} /> Làm mới
        </button>
      </div>

      <div className="p-4 rounded-lg border border-blue-200 bg-blue-50 text-sm text-blue-900">
        Trang này chỉ quản lý <strong>tài khoản có vai trò PATIENT</strong>.
        API hiện tại chưa cung cấp danh sách hồ sơ bệnh nhân, ngày sinh, BHYT
        hoặc bệnh án cho Admin. Những thông tin đó không được suy ra từ tài khoản.
        {" "}<Link to="/admin/users" className="font-semibold underline">
          Đi tới Quản lý tài khoản
        </Link>
      </div>

      {error && (
        <div role="alert" className="p-4 rounded-lg border border-red-200 bg-red-50 text-red-700">
          {error}
        </div>
      )}

      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <label htmlFor="patient-search" className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
          <Search size={16} /> Tìm tài khoản bệnh nhân
        </label>
        <input
          id="patient-search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Tên đăng nhập, email, số điện thoại hoặc mã tài khoản"
          className="w-full px-3 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
      </div>

      <div className="rounded-xl border border-slate-200 bg-white overflow-x-auto">
        <table className="w-full min-w-[760px] text-sm text-left">
          <thead className="bg-slate-100 text-slate-700">
            <tr>
              <th className="p-4">Mã tài khoản</th>
              <th className="p-4">Tên đăng nhập</th>
              <th className="p-4">Email</th>
              <th className="p-4">Điện thoại</th>
              <th className="p-4">Trạng thái tài khoản</th>
              <th className="p-4">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="p-8 text-center text-slate-500">Đang tải dữ liệu...</td></tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-500">
                  {error ? "Chưa tải được dữ liệu." : "Không có tài khoản phù hợp."}
                </td>
              </tr>
            ) : filtered.map((item) => (
              <tr key={item.user_id} className="border-t border-slate-100">
                <td className="p-4">{item.user_id}</td>
                <td className="p-4 font-medium">{item.username}</td>
                <td className="p-4">{item.email || "—"}</td>
                <td className="p-4">{item.phone || "—"}</td>
                <td className="p-4">
                  <span className={Boolean(item.is_active) ? "text-emerald-700" : "text-red-600"}>
                    {Boolean(item.is_active) ? "Hoạt động" : "Đã khóa"}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => viewAccount(item.user_id)}
                      className="text-blue-700 hover:underline"
                    >
                      Xem
                    </button>
                    <button
                      type="button"
                      disabled={updatingId === item.user_id}
                      onClick={() => toggleStatus(item)}
                      className="text-slate-700 hover:underline disabled:opacity-50"
                    >
                      {Boolean(item.is_active) ? "Khóa" : "Mở khóa"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-sm text-slate-500">
        {loading ? "Đang tải..." : `Hiển thị ${filtered.length}/${accounts.length} tài khoản người bệnh`}
      </p>

      {detailError && <div role="alert" className="text-sm text-red-700">{detailError}</div>}
      {detailLoading && <p className="text-sm text-slate-500">Đang tải chi tiết tài khoản...</p>}

      {selected && (
        <section className="rounded-xl border border-slate-200 bg-white p-5 space-y-3" aria-label="Chi tiết tài khoản người bệnh">
          <div className="flex justify-between items-center gap-3">
            <h2 className="text-lg font-bold">Chi tiết tài khoản #{selected.user_id}</h2>
            <button type="button" onClick={() => setSelected(null)} aria-label="Đóng chi tiết">
              <X size={20} />
            </button>
          </div>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div><dt className="text-slate-500">Tên đăng nhập</dt><dd className="font-medium">{selected.username}</dd></div>
            <div><dt className="text-slate-500">Email</dt><dd className="font-medium">{selected.email || "—"}</dd></div>
            <div><dt className="text-slate-500">Điện thoại</dt><dd className="font-medium">{selected.phone || "—"}</dd></div>
            <div><dt className="text-slate-500">Ngày tạo</dt><dd className="font-medium">{formatDate(selected.created_at)}</dd></div>
          </dl>
        </section>
      )}
    </div>
  );
}