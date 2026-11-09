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
  const { login, loginAs, usersList } = useAuth();
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
  const [staffCategory, setStaffCategory] = useState('ALL'); // 'ALL', 'CLINICAL', 'PARACLINICAL', 'ADMIN'

  // Switch mode handler
  const handleSwitchMode = (mode) => {
    setSelectedMode(mode);
    setErrorMessage('');
    const redirectUrl = searchParams.get('redirect');
    const newParams = mode === 'PATIENT' ? { role: 'patient' } : { role: 'staff' };
    if (redirectUrl) newParams.redirect = redirectUrl;
    setSearchParams(newParams);
    if (mode === 'PATIENT') {
      setIdentifier('0912345678');
      setPassword('123');
    } else {
      setIdentifier('bs_trung');
      setPassword('123');
    }
  };

  const redirectAfterLogin = (userObj) => {
    if (!userObj) {
      navigate('/');
      return;
    }
    const redirectUrl = searchParams.get('redirect');
    if (redirectUrl) {
      navigate(redirectUrl);
      return;
    }
    if (userObj.role === 'PATIENT') {
      navigate('/patient');
    } else if (userObj.role === 'ADMIN') {
      navigate('/admin');
    } else if (userObj.role === 'PARACLINICAL') {
      navigate('/paraclinical');
    } else if (userObj.role === 'DOCTOR') {
      navigate('/doctor');
    } else {
      navigate('/');
    }
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!identifier.trim()) {
      setErrorMessage(
        loginMode === 'PATIENT'
          ? 'Vui lòng nhập số điện thoại hoặc số CCCD của bạn.'
          : 'Vui lòng nhập tên đăng nhập nội bộ (Username).'
      );
      return;
    }

    const res = login(identifier, password);
    if (res.success) {
      redirectAfterLogin(res.user);
    } else {
      setErrorMessage(res.message);
    }
  };

  const handleQuickLogin = (userItem) => {
    loginAs(userItem);
    redirectAfterLogin(userItem);
  };

  // Staff lists
  const clinicalDoctors = usersList.filter(u => u.doctorType === 'CLINICAL');
  const paraclinicalDoctors = usersList.filter(u => u.doctorType === 'PARACLINICAL');
  const admins = usersList.filter(u => u.doctorType === 'ADMIN');
  const patients = usersList.filter(u => u.role === 'PATIENT');

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
              <span className="text-[11px] text-slate-400">Mật khẩu mẫu: 123</span>
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

        {/* Khối Gợi Ý Đăng Nhập Nhanh Mẫu (Demo Quick Login) */}
        <div className="flex-1 w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <h3 className="font-bold text-sm text-slate-800">
                  {loginMode === 'PATIENT'
                    ? 'Tài Khoản Mẫu Cho Người Bệnh'
                    : 'Tài Khoản Mẫu Cho Cán Bộ Y Tế (1 Click)'}
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Bấm vào một tài khoản bên dưới để tự động đăng nhập và trải nghiệm ngay
              </p>
            </div>
          </div>

          {loginMode === 'PATIENT' ? (
            /* Danh sách tài khoản mẫu người bệnh */
            <div className="space-y-3">
              {patients.length > 0 ? (
                patients.map(p => (
                  <div
                    key={p.id}
                    onClick={() => handleQuickLogin(p)}
                    className="p-4 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 cursor-pointer transition flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <img src={p.avatar} alt={p.fullName} className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0" />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-slate-800 group-hover:text-[#004282] transition">
                            {p.fullName}
                          </h4>
                          <span className="text-[10px] bg-emerald-100 text-emerald-700 font-bold px-1.5 py-0.5 rounded">
                            Bệnh nhân
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          SĐT: <strong className="text-slate-700">{p.phone}</strong> • Mã BN: {p.patientId}
                        </div>
                        <div className="text-[11px] text-blue-600 font-medium mt-0.5">
                          Số BHYT: {p.insuranceNumber}
                        </div>
                      </div>
                    </div>
                    <button className="px-3 py-1.5 rounded-lg bg-blue-50 group-hover:bg-[#004282] text-[#004282] group-hover:text-white text-xs font-semibold transition shrink-0">
                      Đăng nhập &rarr;
                    </button>
                  </div>
                ))
              ) : (
                <div
                  onClick={() => handleQuickLogin({
                    id: 501,
                    username: "benhnhan",
                    fullName: "Nguyễn Thị Mai Lan",
                    role: "PATIENT",
                    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80"
                  })}
                  className="p-4 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 cursor-pointer transition flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80" alt="Mai Lan" className="w-12 h-12 rounded-xl object-cover shrink-0" />
                    <div>
                      <h4 className="font-bold text-sm text-slate-800 group-hover:text-[#004282]">
                        Nguyễn Thị Mai Lan
                      </h4>
                      <p className="text-xs text-slate-500">SĐT: 0912 345 678 • Mã BN: BN-2024-0089</p>
                    </div>
                  </div>
                  <span className="px-3 py-1.5 rounded-lg bg-[#004282] text-white text-xs font-semibold">
                    Đăng nhập &rarr;
                  </span>
                </div>
              )}

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 text-xs text-slate-600 space-y-1">
                <div className="font-bold text-slate-800">Quyền lợi tài khoản người bệnh:</div>
                <div>• Tra cứu kết quả xét nghiệm huyết học, sinh hóa số hóa</div>
                <div>• Xem kết quả chụp X-quang, MRI trực tuyến</div>
                <div>• Theo dõi lịch hẹn khám và đơn thuốc điện tử</div>
              </div>
            </div>
          ) : (
            /* Danh sách tài khoản mẫu cán bộ y tế */
            <div>
              {/* Category selector */}
              <div className="flex gap-1.5 mb-4 border-b border-slate-200 pb-2">
                {[
                  { id: 'ALL', label: 'Tất cả vai trò' },
                  { id: 'CLINICAL', label: 'BS Lâm sàng' },
                  { id: 'PARACLINICAL', label: 'BS Cận lâm sàng' },
                  { id: 'ADMIN', label: 'Quản trị viên' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setStaffCategory(tab.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                      staffCategory === tab.id
                        ? 'bg-[#004282] text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                {(staffCategory === 'ALL' || staffCategory === 'CLINICAL') && clinicalDoctors.map(doc => (
                  <div
                    key={doc.id}
                    onClick={() => handleQuickLogin(doc)}
                    className="p-3 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 cursor-pointer transition flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <img src={doc.avatar} alt={doc.fullName} className="w-10 h-10 rounded-xl object-cover shrink-0" />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-xs text-slate-800 group-hover:text-[#004282]">{doc.fullName}</h4>
                          <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.2 rounded font-semibold">Lâm sàng</span>
                        </div>
                        <div className="text-[11px] text-slate-500">{doc.specialty} • User: <code className="text-slate-700 font-bold">{doc.username}</code></div>
                      </div>
                    </div>
                    <span className="text-xs text-[#004282] font-bold group-hover:translate-x-1 transition-transform">Chọn &rarr;</span>
                  </div>
                ))}

                {(staffCategory === 'ALL' || staffCategory === 'PARACLINICAL') && paraclinicalDoctors.map(doc => (
                  <div
                    key={doc.id}
                    onClick={() => handleQuickLogin(doc)}
                    className="p-3 rounded-xl border border-slate-200 hover:border-purple-500 hover:bg-purple-50/50 cursor-pointer transition flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <img src={doc.avatar} alt={doc.fullName} className="w-10 h-10 rounded-xl object-cover shrink-0" />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-xs text-slate-800 group-hover:text-purple-700">{doc.fullName}</h4>
                          <span className="text-[10px] bg-purple-100 text-purple-700 px-1.5 py-0.2 rounded font-semibold">Cận lâm sàng</span>
                        </div>
                        <div className="text-[11px] text-slate-500">{doc.specialty} • User: <code className="text-slate-700 font-bold">{doc.username}</code></div>
                      </div>
                    </div>
                    <span className="text-xs text-purple-700 font-bold group-hover:translate-x-1 transition-transform">Chọn &rarr;</span>
                  </div>
                ))}

                {(staffCategory === 'ALL' || staffCategory === 'ADMIN') && admins.map(adm => (
                  <div
                    key={adm.id}
                    onClick={() => handleQuickLogin(adm)}
                    className="p-3 rounded-xl border border-slate-200 hover:border-amber-500 hover:bg-amber-50/50 cursor-pointer transition flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <img src={adm.avatar} alt={adm.fullName} className="w-10 h-10 rounded-xl object-cover shrink-0" />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-xs text-slate-800 group-hover:text-amber-700">{adm.fullName}</h4>
                          <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.2 rounded font-semibold">Quản trị</span>
                        </div>
                        <div className="text-[11px] text-slate-500">{adm.departmentName} • User: <code className="text-slate-700 font-bold">{adm.username}</code></div>
                      </div>
                    </div>
                    <span className="text-xs text-amber-700 font-bold group-hover:translate-x-1 transition-transform">Chọn &rarr;</span>
                  </div>
                ))}
              </div>
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
