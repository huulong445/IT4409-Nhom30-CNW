import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Save, ShieldAlert, UserRound } from "lucide-react";
import api from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";

const initialForm = { username: "", email: "", phone: "" };

function errorText(error, fallback) {
  if (error.response?.status === 401) {
    return "Phiên đăng nhập không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập lại bằng tài khoản thật.";
  }
  return error.response?.data?.message || error.message || fallback;
}

export default function Profile() {
  const { user, logout, updateLocalUser } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deactivating, setDeactivating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setProfile(null);
      setError("");
      setSuccess("");

      if (!user) {
        setError("Bạn cần đăng nhập trước khi xem hồ sơ cá nhân.");
        setLoading(false);
        return;
      }
      if (!localStorage.getItem("token")) {
        setError(
          "Bạn đang xem bằng tài khoản demo, chưa có token xác thực từ backend. " +
          "Vui lòng đăng nhập thật để tải và chỉnh sửa hồ sơ."
        );
        setLoading(false);
        return;
      }

      try {
        const response = await api.get("/users/profile");
        if (!response.data?.success || !response.data?.data) {
          throw new Error("API không trả về dữ liệu hồ sơ hợp lệ.");
        }
        if (cancelled) return;
        const data = response.data.data;
        setProfile(data);
        setForm({
          username: data.username || "",
          email: data.email || "",
          phone: data.phone || "",
        });
      } catch (err) {
        if (!cancelled) setError(errorText(err, "Không thể tải hồ sơ cá nhân."));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [user?.id]);

  const handleSave = async (event) => {
    event.preventDefault();
    if (!profile || saving) return;

    const payload = {
      username: form.username.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
    };
    if (!/^[a-zA-Z0-9_]{3,30}$/.test(payload.username)) {
      setError("Username phải dài 3–30 ký tự, chỉ gồm chữ, số và dấu gạch dưới.");
      return;
    }
    if (!payload.email || !payload.phone) {
      setError("Vui lòng nhập email và số điện thoại.");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const response = await api.put("/users/profile", payload);
      if (!response.data?.success || !response.data?.data) {
        throw new Error("API không xác nhận cập nhật hồ sơ.");
      }
      const updated = response.data.data;
      setProfile(updated);
      setForm({
        username: updated.username || "",
        email: updated.email || "",
        phone: updated.phone || "",
      });
      updateLocalUser({
        username: updated.username,
        email: updated.email,
        phone: updated.phone,
      });
      setSuccess("Thông tin tài khoản đã được cập nhật thành công.");
    } catch (err) {
      setError(errorText(err, "Không thể lưu thay đổi."));
    } finally {
      setSaving(false);
    }
  };

  const handleDeactivate = async () => {
    if (!profile || deactivating) return;
    const confirmation = window.prompt(
      "Thao tác này vô hiệu hóa tài khoản và ngăn đăng nhập tiếp. " +
      "Nhập VO_HIEU_HOA để xác nhận:"
    );
    if (confirmation !== "VO_HIEU_HOA") return;

    setDeactivating(true);
    setError("");
    setSuccess("");
    try {
      const response = await api.delete("/users/profile");
      if (!response.data?.success) {
        throw new Error("API không xác nhận vô hiệu hóa tài khoản.");
      }
      await logout();
      navigate("/login", { replace: true });
    } catch (err) {
      setError(errorText(err, "Không thể vô hiệu hóa tài khoản."));
    } finally {
      setDeactivating(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-5 p-2 md:p-4">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold text-slate-800">
          <UserRound className="text-[#004282]" /> Hồ sơ cá nhân
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Xem và cập nhật thông tin tài khoản của bạn
        </p>
      </div>

      {error && (
        <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
          {(!user || !localStorage.getItem("token")) && (
            <Link to="/login" className="ml-2 font-bold underline">Đến trang đăng nhập</Link>
          )}
        </div>
      )}
      {success && (
        <p role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
          {success}
        </p>
      )}
      {loading && <p className="text-sm text-slate-500">Đang tải hồ sơ từ backend...</p>}

      {!loading && (
        <>
          <form onSubmit={handleSave} className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            {[
              { name: "username", label: "Tên đăng nhập", type: "text", maxLength: 30 },
              { name: "email", label: "Email", type: "email", maxLength: 100 },
              { name: "phone", label: "Số điện thoại", type: "tel", maxLength: 20 },
            ].map((field) => (
              <label key={field.name} className="block">
                <span className="mb-1 block text-sm font-semibold text-slate-700">{field.label}</span>
                <input
                  type={field.type}
                  required
                  disabled={!profile}
                  maxLength={field.maxLength}
                  value={form[field.name]}
                  onChange={(event) => setForm((prev) => ({
                    ...prev,
                    [field.name]: event.target.value,
                  }))}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
              </label>
            ))}

            <button
              disabled={!profile || saving || deactivating}
              type="submit"
              className="inline-flex items-center gap-2 rounded-lg bg-[#004282] px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
            >
              <Save size={16} /> {saving ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
          </form>

          <section className="rounded-2xl border border-red-200 bg-white p-6">
            <h2 className="flex items-center gap-2 font-bold text-red-700">
              <ShieldAlert size={18} /> Vô hiệu hóa tài khoản
            </h2>
            <p className="my-3 text-sm text-slate-600">
              Tài khoản sẽ không thể đăng nhập sau khi bị vô hiệu hóa. Chỉ sử dụng khi thực sự cần thiết.
            </p>
            <button
              type="button"
              onClick={handleDeactivate}
              disabled={!profile || deactivating || saving}
              className="rounded-lg border border-red-300 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:opacity-50"
            >
              {deactivating ? "Đang xử lý..." : "Vô hiệu hóa tài khoản của tôi"}
            </button>
          </section>
        </>
      )}
    </div>
  );
}
