import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Lock, 
  User, 
  ArrowRight, 
  AlertCircle, 
  Stethoscope, 
  FlaskConical, 
  Shield, 
  Building2, 
  Eye, 
  EyeOff,
  CheckCircle2,
  FileSpreadsheet
} from 'lucide-react';

const Login = () => {
  const { login, loginAs, usersList } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [activeTab, setActiveTab] = useState('ALL'); // 'ALL', 'CLINICAL', 'PARACLINICAL', 'ADMIN'

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!username.trim()) {
      setErrorMessage('Vui lòng nhập tên đăng nhập.');
      return;
    }

    const res = login(username, password);
    if (res.success) {
      redirectToPortal(res.user);
    } else {
      setErrorMessage(res.message);
    }
  };

  const handleQuickLogin = (userItem) => {
    loginAs(userItem);
    redirectToPortal(userItem);
  };

  const redirectToPortal = (userObj) => {
    if (userObj.role === 'ADMIN') {
      navigate('/admin');
    } else if (userObj.role === 'PARACLINICAL') {
      navigate('/paraclinical');
    } else {
      navigate('/doctor');
    }
  };

  const clinicalDoctors = usersList.filter(u => u.doctorType === 'CLINICAL');
  const paraclinicalDoctors = usersList.filter(u => u.doctorType === 'PARACLINICAL');
  const admins = usersList.filter(u => u.doctorType === 'ADMIN');

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-between text-slate-800">
      {/* Top Banner */}
      <div className="bg-[#004282] text-white py-3 px-6 shadow-sm border-b border-blue-900">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-white p-1 flex items-center justify-center shadow-sm shrink-0">
              <img 
                src="/logo-hmuh.png" 
                alt="Logo Bệnh viện Bách Khoa" 
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="text-base font-bold tracking-tight uppercase">
                BỆNH VIỆN BÁCH KHOA
              </div>
              <div className="text-[11px] text-blue-200">
                Hệ thống Quản lý Khám chữa bệnh & Cận lâm sàng (HIS - LIS - PACS)
              </div>
            </div>
          </div>

          <div className="hidden sm:block text-right text-xs text-blue-200">
            <div>Địa chỉ: <strong>Số 1 Đại Cồ Việt, Hai Bà Trưng, Hà Nội</strong></div>
            <div>Hotline hỗ trợ: <strong className="text-white">1900 6868</strong></div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex-1 max-w-6xl w-full mx-auto p-4 md:p-8 flex flex-col lg:flex-row gap-8 items-start justify-center">
        {/* Left: Login Form */}
        <div className="w-full lg:w-[420px] bg-white rounded-xl border border-slate-200 shadow-sm p-6 shrink-0">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-900">Đăng nhập tài khoản</h2>
            <p className="text-xs text-slate-500 mt-1">
              Đăng nhập bằng tài khoản nội bộ Bệnh viện Bách Khoa để thực hiện nghiệp vụ
            </p>
          </div>

          {errorMessage && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2.5 text-xs text-red-700">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Tên đăng nhập (Username)
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Ví dụ: bs_trung, bs_xetnghiem, bs_cdha..."
                  className="w-full pl-9 pr-3 py-2.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-[#004282] focus:ring-1 focus:ring-[#004282]"
                />
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Mật khẩu
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mật khẩu (mặc định: 123)"
                  className="w-full pl-9 pr-10 py-2.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-[#004282] focus:ring-1 focus:ring-[#004282]"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-1.5 text-slate-600 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded border-slate-300 text-[#004282]" />
                <span>Ghi nhớ tài khoản</span>
              </label>
              <span className="text-slate-400">Mật khẩu mẫu: <strong>123</strong></span>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-[#004282] hover:bg-blue-900 text-white font-semibold text-xs rounded-lg shadow-sm flex items-center justify-center gap-2 transition"
            >
              <span>Đăng nhập hệ thống</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-100 text-[11px] text-slate-500 space-y-1">
            <div className="font-semibold text-slate-700">Quy tắc phân quyền y tế:</div>
            <p>• Bác sĩ lâm sàng chỉ khám đúng khoa phòng phân công.</p>
            <p>• Bác sĩ cận lâm sàng làm việc theo đúng phạm vi chuyên môn (Xét nghiệm, CĐHA hoặc Thăm dò chức năng). Không làm chéo.</p>
          </div>
        </div>

        {/* Right: Quick Demo Accounts segregated by specialty */}
        <div className="flex-1 w-full bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200">
            <div>
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#004282]" />
                Chọn nhanh tài khoản bác sĩ theo chuyên môn
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Nhấp vào tài khoản để đăng nhập trực tiếp và kiểm tra quyền hạn chuyên môn
              </p>
            </div>
          </div>

          <div className="mt-4 space-y-6">
            {/* NHÓM 1: BÁC SĨ CẬN LÂM SÀNG (CHUYÊN MÔN RIÊNG BIỆT - KHÔNG LÀM CHÉO) */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-purple-900 uppercase tracking-wide flex items-center gap-1.5">
                  <FlaskConical className="w-4 h-4 text-purple-700" />
                  Bác sĩ Cận lâm sàng (Phòng kỹ thuật chuyên biệt)
                </span>
                <span className="text-[11px] text-slate-400">Không thể làm chéo các phòng</span>
              </div>

              <div className="grid grid-cols-1 gap-2.5">
                {paraclinicalDoctors.map((doc) => (
                  <div
                    key={doc.id}
                    onClick={() => handleQuickLogin(doc)}
                    className="p-3 rounded-lg border border-purple-200 bg-purple-50/40 hover:bg-purple-50 hover:border-purple-300 cursor-pointer transition flex items-center justify-between gap-3 group"
                  >
                    <div className="flex items-center gap-3">
                      <img 
                        src={doc.avatar} 
                        alt={doc.fullName} 
                        className="w-10 h-10 rounded-full object-cover border border-purple-300 shrink-0" 
                      />
                      <div>
                        <div className="font-bold text-xs text-slate-900 group-hover:text-purple-900">
                          {doc.fullName}
                          <span className="ml-2 font-mono text-[10px] bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded">
                            {doc.username}
                          </span>
                        </div>
                        <div className="text-[11px] font-semibold text-purple-800 mt-0.5">
                          {doc.paraclinicalScope}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {doc.room}
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="px-2.5 py-1 text-[11px] font-semibold bg-white text-purple-800 border border-purple-300 rounded hover:bg-purple-700 hover:text-white transition shrink-0"
                    >
                      Đăng nhập →
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* NHÓM 2: BÁC SĨ LÂM SÀNG THEO CHUYÊN KHOA */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-blue-900 uppercase tracking-wide flex items-center gap-1.5">
                  <Stethoscope className="w-4 h-4 text-blue-700" />
                  Bác sĩ Lâm sàng (Theo từng Chuyên khoa khám bệnh)
                </span>
                <span className="text-[11px] text-slate-400">Phòng khám chuyên khoa</span>
              </div>

              <div className="grid grid-cols-1 gap-2.5">
                {clinicalDoctors.map((doc) => (
                  <div
                    key={doc.id}
                    onClick={() => handleQuickLogin(doc)}
                    className="p-3 rounded-lg border border-slate-200 bg-slate-50/60 hover:bg-blue-50/50 hover:border-blue-300 cursor-pointer transition flex items-center justify-between gap-3 group"
                  >
                    <div className="flex items-center gap-3">
                      <img 
                        src={doc.avatar} 
                        alt={doc.fullName} 
                        className="w-10 h-10 rounded-full object-cover border border-slate-300 shrink-0" 
                      />
                      <div>
                        <div className="font-bold text-xs text-slate-900 group-hover:text-blue-900">
                          {doc.fullName}
                          <span className="ml-2 font-mono text-[10px] bg-slate-200 text-slate-800 px-1.5 py-0.5 rounded">
                            {doc.username}
                          </span>
                        </div>
                        <div className="text-[11px] font-medium text-blue-800 mt-0.5">
                          Chuyên khoa: {doc.specialty}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {doc.room} • {doc.departmentName}
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="px-2.5 py-1 text-[11px] font-semibold bg-white text-slate-700 border border-slate-300 rounded hover:bg-[#004282] hover:text-white transition shrink-0"
                    >
                      Đăng nhập →
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* NHÓM 3: QUẢN TRỊ VIÊN */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-slate-600" />
                  Quản trị viên Hệ thống (Admin Portal)
                </span>
              </div>

              <div className="grid grid-cols-1 gap-2.5">
                {admins.map((adm) => (
                  <div
                    key={adm.id}
                    onClick={() => handleQuickLogin(adm)}
                    className="p-3 rounded-lg border border-slate-200 bg-slate-50/60 hover:bg-slate-100 cursor-pointer transition flex items-center justify-between gap-3 group"
                  >
                    <div className="flex items-center gap-3">
                      <img 
                        src={adm.avatar} 
                        alt={adm.fullName} 
                        className="w-10 h-10 rounded-full object-cover border border-slate-300 shrink-0" 
                      />
                      <div>
                        <div className="font-bold text-xs text-slate-900">
                          {adm.fullName}
                          <span className="ml-2 font-mono text-[10px] bg-slate-200 text-slate-800 px-1.5 py-0.5 rounded">
                            {adm.username}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-600 mt-0.5">
                          {adm.departmentName}
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="px-2.5 py-1 text-[11px] font-semibold bg-white text-slate-700 border border-slate-300 rounded hover:bg-slate-800 hover:text-white transition shrink-0"
                    >
                      Đăng nhập →
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white border-t border-slate-200 py-3 px-6 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} <strong>Bệnh viện Bách Khoa</strong> (Đại học Bách Khoa Hà Nội). Hệ thống HIS phân quyền bảo mật cấp y tế.
      </div>
    </div>
  );
};

export default Login;
