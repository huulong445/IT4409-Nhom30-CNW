import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Lock, 
  User, 
  ArrowRight, 
  AlertCircle, 
  Stethoscope, 
  FlaskConical, 
  Shield, 
  Eye, 
  EyeOff,
  CheckCircle2,
  UserRound,
  Phone,
  Mail,
  HeartPulse,
  Sparkles,
  ShieldCheck
} from 'lucide-react';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Role mode: 'PATIENT' hoặc 'STAFF'
  const roleParam = searchParams.get('role');
  const [selectedMode, setSelectedMode] = useState(null);
  const loginMode = selectedMode ?? (roleParam === 'patient' ? 'PATIENT' : 'STAFF');

  // Form input states
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Switch mode handler
  const handleSwitchMode = (mode) => {
    setSelectedMode(mode);
    setErrorMessage('');
    const redirectUrl = searchParams.get('redirect');
    const newParams = mode === 'PATIENT' ? { role: 'patient' } : { role: 'staff' };
    if (redirectUrl && (mode === 'PATIENT' ? redirectUrl.startsWith('/patient') : !redirectUrl.startsWith('/patient'))) {
      newParams.redirect = redirectUrl;
    }
    setSearchParams(newParams);
    setIdentifier('');
    setPassword('');
  };

  const redirectAfterLogin = (userObj) => {
    if (!userObj) {
      navigate('/');
      return;
    }
    const role = String(userObj.role || '').toUpperCase();
    const redirectUrl = searchParams.get('redirect');
    const canUseRedirect =
      redirectUrl &&
      ((role === 'PATIENT' && redirectUrl.startsWith('/patient')) ||
        (role === 'ADMIN' && redirectUrl.startsWith('/admin')) ||
        (role === 'DOCTOR' && redirectUrl.startsWith('/doctor')) ||
        (role === 'RECEPTIONIST' && redirectUrl.startsWith('/receptionist')) ||
        ((role === 'LAB_TECH' || role === 'PARACLINICAL') && redirectUrl.startsWith('/paraclinical')));

    if (canUseRedirect) {
      navigate(redirectUrl);
      return;
    }
    if (role === 'PATIENT') {
      navigate('/patient');
    } else if (role === 'ADMIN') {
      navigate('/admin');
    } else if (role === 'PARACLINICAL' || role === 'LAB_TECH') {
      navigate('/paraclinical');
    } else if (role === 'RECEPTIONIST') {
      navigate('/receptionist');
    } else if (role === 'DOCTOR') {
      navigate('/doctor');
    } else {
      navigate('/');
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!identifier.trim()) {
      setErrorMessage(
        loginMode === 'PATIENT'
          ? 'Vui lòng nhập username đã đăng ký (API chưa hỗ trợ đăng nhập bằng số điện thoại).'
          : 'Vui lòng nhập tên đăng nhập nội bộ (Username).'
      );
      return;
    }

    const res = await login(identifier, password);
    if (res.success) {
      redirectAfterLogin(res.user);
    } else {
      setErrorMessage(res.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-between text-slate-800">
      {/* ================= TOP BANNER ================= */}
      <div className="bg-[#004282] text-white py-3 px-6 shadow-sm border-b border-blue-900">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 hover:opacity-95 transition" title="Về Trang chủ Bệnh viện">
            <div className="w-10 h-10 rounded-xl bg-white/15 p-1.5 flex items-center justify-center shadow-sm shrink-0 text-white">
              <HeartPulse className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="text-base font-bold tracking-tight uppercase">
                BỆNH VIỆN BÁCH KHOA
              </div>
              <div className="text-[11px] text-blue-200">
                Cổng Đăng Nhập Tập Trung (Người Bệnh & Cán Bộ Y Tế)
              </div>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link 
              to="/" 
              className="text-xs bg-white/15 hover:bg-white/25 text-white px-3 py-1.5 rounded-lg border border-white/25 transition font-semibold"
            >
              ← Về Trang chủ
            </Link>
            <div className="hidden sm:block text-right text-xs text-blue-200 pl-3 border-l border-blue-400/30">
              <div>Hotline CSKH: <strong className="text-white">1900 6868</strong></div>
              <div>Cấp cứu 24/7: <strong className="text-white">024 3869 2026</strong></div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= MAIN CONTENT ================= */}
      <div className="flex-1 max-w-6xl w-full mx-auto p-4 md:p-8 flex flex-col lg:flex-row gap-8 items-start justify-center">
        {/* Card Form Đăng Nhập */}
        <div className="w-full lg:w-[440px] bg-white rounded-2xl border border-slate-200 shadow-xl p-6 sm:p-7 shrink-0">
          
          {/* Segmented Control Switcher */}
          <div className="mb-6 bg-slate-100 p-1 rounded-xl flex items-center">
            <button
              type="button"
              onClick={() => handleSwitchMode('PATIENT')}
              className={`flex-1 py-2.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                loginMode === 'PATIENT'
                  ? 'bg-white text-[#004282] shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <UserRound className="w-4 h-4" />
              <span>Người Bệnh</span>
            </button>
            <button
              type="button"
              onClick={() => handleSwitchMode('STAFF')}
              className={`flex-1 py-2.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                loginMode === 'STAFF'
                  ? 'bg-[#004282] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Stethoscope className="w-4 h-4" />
              <span>Cán Bộ Y Tế</span>
            </button>
          </div>

          <div className="mb-5">
            <h2 className="text-xl font-bold text-slate-900">
              {loginMode === 'PATIENT'
                ? 'Đăng nhập Cổng Người Bệnh'
                : 'Đăng nhập Cán Bộ Y Tế'}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              {loginMode === 'PATIENT'
                ? 'Tra cứu hồ sơ sức khỏe cá nhân, kết quả xét nghiệm và quản lý lịch khám'
                : 'Đăng nhập hệ thống quản lý khám chữa bệnh HIS/LIS/PACS Bệnh viện Bách Khoa'}
            </p>
          </div>

          {searchParams.get('redirect')?.includes('booking') && (
            <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2.5 text-xs text-amber-900">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Yêu cầu đăng nhập:</span> Quý khách vui lòng đăng nhập tài khoản Người bệnh để tiếp tục đặt lịch khám trực tuyến.
              </div>
            </div>
          )}

          {errorMessage && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 text-xs text-red-700 animate-shake">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                {loginMode === 'PATIENT' ? 'Số điện thoại hoặc CCCD' : 'Tên đăng nhập (Username)'}
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder={
                    loginMode === 'PATIENT'
                      ? 'Nhập SĐT (vd: 0912 345 678) hoặc CCCD...'
                      : 'Ví dụ: bs_trung, bs_xetnghiem, admin_bv...'
                  }
                  className="w-full pl-9 pr-3 py-2.5 text-xs border border-slate-300 rounded-xl focus:outline-none focus:border-[#004282] focus:ring-2 focus:ring-blue-100 transition font-medium"
                />
                {loginMode === 'PATIENT' ? (
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                ) : (
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                )}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  Mật khẩu
                </label>
                <span className="text-[11px] text-[#004282] hover:underline cursor-pointer">
                  Quên mật khẩu?
                </span>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mật khẩu (mặc định: 123)"
                  className="w-full pl-9 pr-10 py-2.5 text-xs border border-slate-300 rounded-xl focus:outline-none focus:border-[#004282] focus:ring-2 focus:ring-blue-100 transition font-medium"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 transition"
                  title={showPassword ? "Ẩn mật khẩu" : "Hiển thị mật khẩu"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-0.5">
              <label className="flex items-center gap-1.5 text-slate-600 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded border-slate-300 text-[#004282] focus:ring-0" />
                <span>Ghi nhớ đăng nhập</span>
              </label>
            </div>

            <button
              type="submit"
              className={`w-full py-2.5 px-4 rounded-xl text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 ${
                loginMode === 'PATIENT'
                  ? 'bg-gradient-to-r from-blue-700 to-[#004282] hover:from-blue-800 hover:to-[#003466]'
                  : 'bg-gradient-to-r from-[#004282] to-blue-900 hover:from-[#003466] hover:to-blue-950'
              }`}
            >
              <span>{loginMode === 'PATIENT' ? 'Đăng Nhập Cổng Người Bệnh' : 'Đăng Nhập Cán Bộ Y Tế'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Liên kết đăng ký dành cho bệnh nhân */}
          {loginMode === 'PATIENT' ? (
            <div className="mt-6 pt-5 border-t border-slate-100 text-center text-xs text-slate-600">
              Chưa có tài khoản người bệnh?{' '}
              <Link to="/patient/register" className="text-[#004282] font-bold hover:underline">
                Đăng ký khám bệnh ngay &rarr;
              </Link>
            </div>
          ) : (
            <div className="mt-6 pt-5 border-t border-slate-100 text-center text-xs text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600 inline mr-1" />
              Khu vực dành riêng cho nhân viên Bệnh viện Bách Khoa
            </div>
          )}
        </div>
      </div>

      {/* ================= FOOTER ================= */}
      <footer className="text-center text-xs text-slate-500 py-4 border-t border-slate-200 bg-white">
        © {new Date().getFullYear()} <strong>Bệnh viện Bách Khoa</strong> (Đại học Bách Khoa Hà Nội). Cổng đăng nhập tập trung chuẩn Bộ Y Tế.
      </footer>
    </div>
  );
};

export default Login;
