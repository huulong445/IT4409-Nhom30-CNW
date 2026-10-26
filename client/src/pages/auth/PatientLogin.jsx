import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  UserRound,
  LockKeyhole,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
} from "lucide-react";

export default function PatientLogin() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/v1/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });
      const result = await response.json();
      if (result.success) {
        alert("Đăng nhập thành công");
        localStorage.setItem("token", result.data.token);
        localStorage.setItem("user", JSON.stringify(result.data.user));
        navigate("/patient");
      } else {
        setMessage(result.message || "Tài khoản hoặc mật khẩu không chính xác");
      }
    } catch (error) {
      console.error("Lỗi kết nối API:", error);
      setMessage("Không thể kết nối đến máy chủ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-lg shadow-blue-900/5 p-6 sm:p-8">
      <div className="text-center mb-8">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-50 text-[#004282] flex items-center justify-center mb-4">
          <UserRound size={28} />
        </div>

        <h2 className="text-2xl font-bold text-slate-900">Đăng nhập</h2>

        <p className="text-sm text-slate-500 mt-2">
          Truy cập hồ sơ sức khỏe và quản lý lịch khám của bạn
        </p>
      </div>

      {message && (
        <div
          role="alert"
          className="bg-blue-50 border border-blue-100 text-blue-800 p-3 mb-5 rounded-lg text-sm flex items-start gap-2"
        >
          <AlertCircle size={18} className="shrink-0 mt-0.5" />
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label
            htmlFor="patient-identifier"
            className="block text-sm font-semibold mb-2"
          >
            Số điện thoại hoặc Email
          </label>

          <div className="relative">
            <UserRound
              size={18}
              className="absolute left-3 top-3.5 text-slate-400"
            />
            <input
              id="patient-identifier"
              name="username"
              type="text"
              autoComplete="username"
              value={form.username}
              onChange={handleChange}
              placeholder="Nhập số điện thoại hoặc email"
              className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-200 focus:border-[#004282] text-sm"
              required
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="patient-password"
            className="block text-sm font-semibold mb-2"
          >
            Mật khẩu
          </label>

          <div className="relative">
            <LockKeyhole
              size={18}
              className="absolute left-3 top-3.5 text-slate-400"
            />
            <input
              id="patient-password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              value={form.password}
              onChange={handleChange}
              placeholder="Nhập mật khẩu"
              className="w-full pl-10 pr-11 py-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-200 focus:border-[#004282] text-sm"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              className="absolute right-3 top-3.5 text-slate-400 hover:text-blue-700"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-[#004282] hover:bg-[#003566] text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition"
        >
          Đăng nhập
          <ArrowRight size={18} />
        </button>
      </form>

      <p className="mt-7 text-center text-sm text-slate-600">
        Chưa có tài khoản?{" "}
        <Link
          to="/patient/register"
          className="text-[#005baa] font-semibold hover:underline"
        >
          Đăng ký ngay
        </Link>
      </p>

      <div className="mt-6 pt-5 border-t text-center">
        <Link
          to="/login"
          className="text-sm text-slate-500 hover:text-[#004282]"
        >
          Đăng nhập dành cho nhân viên y tế
        </Link>
      </div>
    </div>
  );
}
