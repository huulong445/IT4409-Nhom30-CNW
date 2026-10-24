
import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  UserRound, Phone, Mail, LockKeyhole,
  Eye, EyeOff, UserPlus, AlertCircle,
  CheckCircle2
} from 'lucide-react';

const initialForm = {
  fullName: '',
  phone: '',
  email: '',
  dateOfBirth: '',
  gender: '',
  password: '',
  confirmPassword: '',
};

export default function PatientRegister() {
  const [form, setForm] = useState(initialForm);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [valid, setValid] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setError('');
    setValid(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError('');
    setValid(false);

    if (!form.fullName.trim()) {
      setError('Vui lòng nhập họ và tên.');
      return;
    }

    if (!/^(0\d{9}|\+84\d{9})$/.test(form.phone)) {
      setError('Số điện thoại không hợp lệ.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError('Email không hợp lệ.');
      return;
    }

    if (!form.dateOfBirth || !form.gender) {
      setError('Vui lòng nhập ngày sinh và giới tính.');
      return;
    }

    if (form.dateOfBirth > new Date().toISOString().slice(0, 10)) {
      setError('Ngày sinh không được ở tương lai.');
      return;
    }

    if (form.password.length < 8) {
      setError('Mật khẩu phải có ít nhất 8 ký tự.');
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp.');
      return;
    }

    // Chưa gửi thông tin đến backend
    setValid(true);
  };

  const inputClass =
    'w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-[#004282] focus:ring-2 focus:ring-blue-100';

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-lg shadow-blue-900/5 p-6 sm:p-8">
      <div className="text-center mb-7">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-50 text-[#004282] flex items-center justify-center mb-4">
          <UserPlus size={28} />
        </div>

        <h2 className="text-2xl font-bold text-slate-900">
          Đăng ký tài khoản
        </h2>
        <p className="text-sm text-slate-500 mt-2">
          Tạo tài khoản để sử dụng các dịch vụ y tế trực tuyến
        </p>
      </div>

      {error && (
        <div role="alert" className="mb-5 bg-red-50 text-red-700 border border-red-200 p-3 rounded-xl text-sm flex gap-2">
          <AlertCircle size={18} className="shrink-0" />
          {error}
        </div>
      )}

      {valid && (
        <div role="status" className="mb-5 bg-green-50 text-green-800 border border-green-200 p-3 rounded-xl text-sm flex gap-2">
          <CheckCircle2 size={18} className="shrink-0" />
          Thông tin hợp lệ. Đây là bản demo, tài khoản chưa được tạo vì chưa kết nối backend.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="reg-name" className="block text-sm font-semibold mb-2">
            Họ và tên <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <UserRound size={18} className="absolute left-3 top-3.5 text-slate-400" />
            <input
              id="reg-name"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              autoComplete="name"
              placeholder="Nguyễn Văn A"
              className={`${inputClass} pl-10`}
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="reg-phone" className="block text-sm font-semibold mb-2">
            Số điện thoại <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Phone size={18} className="absolute left-3 top-3.5 text-slate-400" />
            <input
              id="reg-phone"
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
              autoComplete="tel"
              placeholder="09xxxxxxxx"
              className={`${inputClass} pl-10`}
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="reg-email" className="block text-sm font-semibold mb-2">
            Email <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Mail size={18} className="absolute left-3 top-3.5 text-slate-400" />
            <input
              id="reg-email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
              placeholder="example@gmail.com"
              className={`${inputClass} pl-10`}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="reg-dob" className="block text-sm font-semibold mb-2">
              Ngày sinh <span className="text-red-500">*</span>
            </label>
            <input
              id="reg-dob"
              name="dateOfBirth"
              type="date"
              value={form.dateOfBirth}
              onChange={handleChange}
              className={inputClass}
              required
            />
          </div>

          <div>
            <label htmlFor="reg-gender" className="block text-sm font-semibold mb-2">
              Giới tính <span className="text-red-500">*</span>
            </label>
            <select
              id="reg-gender"
              name="gender"
              value={form.gender}
              onChange={handleChange}
              className={inputClass}
              required
            >
              <option value="">Chọn giới tính</option>
              <option value="MALE">Nam</option>
              <option value="FEMALE">Nữ</option>
              <option value="OTHER">Khác</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="reg-password" className="block text-sm font-semibold mb-2">
            Mật khẩu <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <LockKeyhole size={18} className="absolute left-3 top-3.5 text-slate-400" />
            <input
              id="reg-password"
              name="password"
              type={showPassword ? 'text' : 'password'}
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
              aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
              className="absolute right-3 top-3.5 text-slate-400"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="reg-confirm" className="block text-sm font-semibold mb-2">
            Xác nhận mật khẩu <span className="text-red-500">*</span>
          </label>
          <input
            id="reg-confirm"
            name="confirmPassword"
            type={showPassword ? 'text' : 'password'}
            value={form.confirmPassword}
            onChange={handleChange}
            autoComplete="new-password"
            placeholder="Nhập lại mật khẩu"
            className={inputClass}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-[#004282] hover:bg-[#003566] text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition mt-3"
        >
          <UserPlus size={19} />
          Đăng ký tài khoản
        </button>
      </form>

      <p className="text-center text-sm text-slate-600 mt-6">
        Đã có tài khoản?{' '}
        <Link
          to="/patient/login"
          className="text-[#005baa] font-semibold hover:underline"
        >
          Đăng nhập ngay
        </Link>
      </p>

      <p className="text-center text-xs text-slate-400 mt-4">
        Bản thử nghiệm — không nhập dữ liệu cá nhân thật.
      </p>
    </div>
  );
}
