import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import {
  UserRound,
  Phone,
  LockKeyhole,
  Eye,
  EyeOff,
  UserPlus,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

const initialForm = {
  username: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
};

export default function PatientRegister() {
  const [form, setForm] = useState(initialForm);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [valid, setValid] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError("");
    setValid(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setValid(false);

    if (!/^(0\d{9}|\+84\d{9})$/.test(form.phone.trim())) {
      setError(
        "Số điện thoại không hợp lệ (gồm 10 số, bắt đầu bằng 0 hoặc +84).",
      );
      return;
    }

    if (!form.username.trim()) {
      setError("Vui lòng nhập tên tài khoản.");
      return;
    }

    if (form.password.length < 8) {
      setError("Mật khẩu phải có ít nhất 8 ký tự.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }

    try {
      const response = await api.post("/auth/register", {
        username: form.username.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        password: form.password,
      });

      if (response.data?.success) {
        setValid(true);
      } else {
        setError(response.data?.message || "Đăng ký không thành công.");
      }
    } catch (apiErr) {
      setError(
        apiErr.response?.data?.message ||
          "Không thể đăng ký tài khoản. Vui lòng thử lại.",
      );
    }
  };

  const inputClass =
    "w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-[#004282] focus:ring-2 focus:ring-blue-100 transition font-medium";

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-lg shadow-blue-900/5 p-6 sm:p-8">
      <div className="text-center mb-7">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-50 text-[#004282] flex items-center justify-center mb-4">
          <UserPlus size={28} />
        </div>

        <h2 className="text-2xl font-bold text-slate-900">
          Đăng ký tài khoản Người bệnh
        </h2>
        <p className="text-sm text-slate-500 mt-2">
          Tạo tài khoản để đặt lịch khám và tra cứu kết quả y tế trực tuyến
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="mb-5 bg-red-50 text-red-700 border border-red-200 p-3 rounded-xl text-sm flex gap-2"
        >
          <AlertCircle size={18} className="shrink-0" />
          {error}
        </div>
      )}

      {valid && (
        <div
          role="status"
          className="mb-5 bg-emerald-50 text-emerald-800 border border-emerald-200 p-4 rounded-xl text-sm flex gap-2.5"
        >
          <CheckCircle2
            size={20}
            className="shrink-0 text-emerald-600 mt-0.5"
          />
          <div>
            <p className="font-bold">Đăng ký thông tin thành công!</p>
            <p className="text-xs text-emerald-700 mt-0.5">
              Tên tài khoản: <strong>{form.username}</strong> • Email:{" "}
              <strong>{form.email}</strong> • SĐT: <strong>{form.phone}</strong>
            </p>
            <p className="text-xs text-emerald-600 mt-1">
              Dùng tên tài khoản vừa đăng ký để đăng nhập vào Cổng Người Bệnh.
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Tên tài khoản */}
        <div>
          <label
            htmlFor="reg-username"
            className="block text-sm font-semibold mb-1.5 text-slate-700"
          >
            Tên tài khoản <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <UserRound
              size={18}
              className="absolute left-3 top-3.5 text-slate-400"
            />
            <input
              id="reg-username"
              name="username"
              value={form.username}
              onChange={handleChange}
              autoComplete="username"
              placeholder="Nhập tên tài khoản"
              className={`${inputClass} pl-10`}
              required
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="reg-email"
            className="block text-sm font-semibold mb-1.5 text-slate-700"
          >
            Email <span className="text-red-500">*</span>
          </label>
          <input
            id="reg-email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            autoComplete="email"
            placeholder="name@example.com"
            className={inputClass}
            required
          />
        </div>

        {/* Số điện thoại */}
        <div>
          <label
            htmlFor="reg-phone"
            className="block text-sm font-semibold mb-1.5 text-slate-700"
          >
            Số điện thoại <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Phone
              size={18}
              className="absolute left-3 top-3.5 text-slate-400"
            />
            <input
              id="reg-phone"
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
              autoComplete="tel"
              placeholder="Ví dụ: 0912 345 678"
              className={`${inputClass} pl-10`}
              required
            />
          </div>
        </div>

        {/* Mật khẩu */}
        <div>
          <label
            htmlFor="reg-password"
            className="block text-sm font-semibold mb-1.5 text-slate-700"
          >
            Mật khẩu <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <LockKeyhole
              size={18}
              className="absolute left-3 top-3.5 text-slate-400"
            />
            <input
              id="reg-password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={handleChange}
              autoComplete="new-password"
              placeholder="Tối thiểu 8 ký tự"
              className={`${inputClass} pl-10 pr-11`}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* Xác nhận mật khẩu */}
        <div>
          <label
            htmlFor="reg-confirm"
            className="block text-sm font-semibold mb-1.5 text-slate-700"
          >
            Xác nhận mật khẩu <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <LockKeyhole
              size={18}
              className="absolute left-3 top-3.5 text-slate-400"
            />
            <input
              id="reg-confirm"
              name="confirmPassword"
              type={showPassword ? "text" : "password"}
              value={form.confirmPassword}
              onChange={handleChange}
              autoComplete="new-password"
              placeholder="Nhập lại mật khẩu"
              className={`${inputClass} pl-10`}
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-[#004282] hover:bg-[#003566] text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-md transition mt-4 text-sm"
        >
          <UserPlus size={19} />
          Đăng ký tài khoản
        </button>
      </form>

      <p className="text-center text-sm text-slate-600 mt-6">
        Đã có tài khoản?{" "}
        <Link
          to="/login?role=patient"
          className="text-[#005baa] font-semibold hover:underline"
        >
          Đăng nhập ngay
        </Link>
      </p>

      <p className="text-center text-xs text-slate-400 mt-4">
        Bản thử nghiệm — Thông tin được bảo mật theo quy định ngành Y tế.
      </p>
    </div>
  );
}
