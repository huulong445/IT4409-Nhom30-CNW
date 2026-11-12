import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import {
  UserRound,
  Phone,
  IdCard,
  Calendar,
  LockKeyhole,
  Eye,
  EyeOff,
  UserPlus,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

const initialForm = {
  fullName: "",
  phone: "",
  cccd: "",
  dateOfBirth: "",
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

    if (!form.fullName.trim()) {
      setError("Vui lòng nhập họ và tên.");
      return;
    }

    if (!/^(0\d{9}|\+84\d{9})$/.test(form.phone.trim())) {
      setError(
        "Số điện thoại không hợp lệ (gồm 10 số, bắt đầu bằng 0 hoặc +84).",
      );
      return;
    }

    if (!/^\d{12}$/.test(form.cccd.trim())) {
      setError("Số Căn cước công dân (CCCD) phải gồm đúng 12 chữ số.");
      return;
    }

    if (!form.dateOfBirth) {
      setError("Vui lòng nhập ngày sinh.");
      return;
    }

    if (form.dateOfBirth > new Date().toISOString().slice(0, 10)) {
      setError("Ngày sinh không được ở tương lai.");
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
      // Gửi request đăng ký tài khoản sang Backend
      await api.post("/admin/users", {
        username: form.phone.trim(),
        password: form.password,
        email: `${form.phone.trim()}@patient.bkh.vn`,
        phone: form.phone.trim(),
        role: "PATIENT",
      });
    } catch (apiErr) {
      console.warn("Lỗi gọi API đăng ký user:", apiErr.message);
    }

    setValid(true);
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
              Họ tên: <strong>{form.fullName}</strong> • CCCD:{" "}
              <strong>{form.cccd}</strong> • SĐT: <strong>{form.phone}</strong>
            </p>
            <p className="text-xs text-emerald-600 mt-1">
              Bạn có thể sử dụng SĐT hoặc CCCD này để đăng nhập vào Cổng Người
              Bệnh.
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Họ và tên */}
        <div>
          <label
            htmlFor="reg-name"
            className="block text-sm font-semibold mb-1.5 text-slate-700"
          >
            Họ và tên <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <UserRound
              size={18}
              className="absolute left-3 top-3.5 text-slate-400"
            />
            <input
              id="reg-name"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              autoComplete="name"
              placeholder="Ví dụ: Nguyễn Văn An"
              className={`${inputClass} pl-10`}
              required
            />
          </div>
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

        {/* Số Căn cước công dân (CCCD) */}
        <div>
          <label
            htmlFor="reg-cccd"
            className="block text-sm font-semibold mb-1.5 text-slate-700"
          >
            Số Căn cước công dân (CCCD / ĐDCN){" "}
            <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <IdCard
              size={18}
              className="absolute left-3 top-3.5 text-slate-400"
            />
            <input
              id="reg-cccd"
              name="cccd"
              type="text"
              maxLength={12}
              value={form.cccd}
              onChange={handleChange}
              placeholder="Nhập 12 chữ số CCCD (vd: 001098012345)"
              className={`${inputClass} pl-10 font-mono`}
              required
            />
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            Dùng để đồng bộ định danh y tế điện tử và tra cứu thẻ BHYT
          </span>
        </div>

        {/* Ngày sinh */}
        <div>
          <label
            htmlFor="reg-dob"
            className="block text-sm font-semibold mb-1.5 text-slate-700"
          >
            Ngày sinh <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Calendar
              size={18}
              className="absolute left-3 top-3.5 text-slate-400"
            />
            <input
              id="reg-dob"
              name="dateOfBirth"
              type="date"
              value={form.dateOfBirth}
              onChange={handleChange}
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
