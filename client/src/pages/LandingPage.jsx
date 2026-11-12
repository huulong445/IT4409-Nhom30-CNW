import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  HeartPulse, PhoneCall, MapPin, Clock, Calendar, ShieldCheck,
  Stethoscope, FlaskConical, Activity, User,
  CheckCircle2, ArrowRight, Award, Building2,
  FileText, ChevronDown, Shield, Microscope,
  Heart, Check, LogOut, LogIn, UserPlus
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { MOCK_USERS_LIST, MOCK_DEPARTMENTS } from '../services/mockData';

export default function LandingPage() {
  const { user, logout } = useAuth();

  // FAQ accordion state
  const [openFaq, setOpenFaq] = useState(0);

  // Specialties filter state for Doctors section
  const [activeSpecialty, setActiveSpecialty] = useState('ALL');

  // Filter clinical doctors
  const doctors = MOCK_USERS_LIST.filter(u => u.role === 'DOCTOR' || u.role === 'PARACLINICAL');

  const filteredDoctors = activeSpecialty === 'ALL'
    ? doctors.slice(0, 6)
    : doctors.filter(d => {
        if (activeSpecialty === 'TIM_MACH') return d.departmentName.toLowerCase().includes('tim');
        if (activeSpecialty === 'TIEU_HOA') return d.departmentName.toLowerCase().includes('tiêu');
        if (activeSpecialty === 'XUONG_KHOP') return d.departmentName.toLowerCase().includes('khớp');
        if (activeSpecialty === 'CAN_LAM_SANG') return d.role === 'PARACLINICAL';
        return true;
      });

  const faqs = [
    {
      q: 'Bệnh viện Bách Khoa có khám chữa bệnh Bảo hiểm Y tế (BHYT) không?',
      a: 'Có. Bệnh viện Bách Khoa tiếp nhận khám chữa bệnh BHYT đúng tuyến và trái tuyến theo quy định của Bộ Y tế và Bảo hiểm Xã hội Việt Nam. Người bệnh có thẻ BHYT đăng ký ban đầu tại các cơ sở y tế tuyến quận/huyện đều được hưởng 100% quyền lợi thanh toán nội trú và hỗ trợ tối đa khi khám ngoại trú.'
    },
    {
      q: 'Lợi ích khi đăng ký khám trực tuyến qua website hoặc ứng dụng?',
      a: 'Bệnh nhân đăng ký trực tuyến sẽ được cấp mã số định danh và giờ khám dự kiến chính xác, không phải xếp hàng lấy số thứ tự giấy tại sảnh tiếp đón, được ưu tiên vào buồng khám theo khung giờ hẹn và nhận kết quả xét nghiệm, đơn thuốc điện tử trực tiếp trên cổng cá nhân.'
    },
    {
      q: 'Thời gian có kết quả xét nghiệm và chẩn đoán hình ảnh là bao lâu?',
      a: 'Các xét nghiệm sinh hóa - huyết học thường quy trả kết quả sau 45 - 90 phút. Siêu âm và chụp X-quang kỹ thuật số có kết quả sau 15 - 30 phút. Chụp cắt lớp vi tính (CT Scanner) và cộng hưởng từ (MRI) được hội đồng bác sĩ chuyên khoa đọc và trả kết quả sau 2 - 3 giờ.'
    },
    {
      q: 'Bệnh viện có dịch vụ khám cấp cứu và làm việc ngày cuối tuần không?',
      a: 'Khoa Cấp cứu & Đơn nguyên Hồi sức tích cực (ICU) hoạt động 24/24 tất cả các ngày trong năm kể cả lễ, Tết. Các phòng khám chuyên khoa dịch vụ theo yêu cầu phục vụ liên tục từ 07:00 đến 17:30 thứ Bảy và Chủ Nhật.'
    },
    {
      q: 'Tôi cần chuẩn bị gì trước khi thực hiện xét nghiệm máu hoặc nội soi tiêu hóa?',
      a: 'Đối với xét nghiệm sinh hóa máu (đường huyết, mỡ máu, chức năng gan thận), quý khách nên nhịn ăn ít nhất 6-8 tiếng (có thể uống nước lọc). Đối với nội soi dạ dày - đại tràng, quý khách cần nhịn ăn tối thiểu 6 tiếng và thực hiện làm sạch đường tiêu hóa theo hướng dẫn của điều dưỡng.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-[#004282] selection:text-white">
      {/* =========================================================================
          1. TOP BAR - CẤP CỨU & LIÊN HỆ
      ========================================================================= */}
      <div className="bg-[#002850] text-slate-200 text-xs py-2 px-4 border-b border-blue-900/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <span className="flex items-center gap-1.5 text-blue-200">
              <MapPin className="w-3.5 h-3.5 text-red-400" />
              Số 1 Đại Cồ Việt, P. Bách Khoa, Q. Hai Bà Trưng, Hà Nội
            </span>
            <span className="hidden md:flex items-center gap-1.5 text-slate-300">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              Khám bệnh: 06:30 - 17:30 (Thứ 2 - CN)
            </span>
            <span className="flex items-center gap-1.5 bg-red-600/30 text-red-200 px-2 py-0.5 rounded font-semibold border border-red-500/30">
              <PhoneCall className="w-3.5 h-3.5 text-red-400 animate-pulse" />
              Cấp cứu 24/7: <strong className="text-white ml-1">024 3869 2026</strong>
            </span>
          </div>

          <div className="flex items-center gap-3 ml-auto">
            {user && user.role === 'PATIENT' ? (
              <div className="flex items-center gap-2">
                <img 
                  src={user.avatar} 
                  alt={user.fullName} 
                  className="w-5 h-5 rounded-full object-cover border border-white/50" 
                />
                <span className="text-white font-semibold hidden sm:inline">{user.fullName}</span>
                <span className="text-[10px] bg-emerald-500/40 text-emerald-200 px-1.5 py-0.5 rounded font-medium">
                  Bệnh nhân
                </span>
                <Link
                  to="/patient"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white px-2.5 py-0.5 rounded text-[11px] font-bold transition flex items-center gap-1 ml-1"
                >
                  Cổng Bệnh Nhân &rarr;
                </Link>
                <button
                  onClick={logout}
                  className="text-red-300 hover:text-white text-[11px] transition flex items-center gap-1 ml-1 px-1.5 py-0.5 rounded hover:bg-red-500/20"
                  title="Đăng xuất khỏi hệ thống"
                >
                  <LogOut className="w-3 h-3" />
                  <span className="hidden md:inline">Đăng xuất</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold text-blue-100 hover:text-white hover:bg-white/10 transition border border-white/20"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  Đăng nhập
                </Link>

                <Link
                  to="/patient/register"
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-white text-[#004282] rounded-lg text-xs font-bold hover:bg-blue-50 transition shadow-sm"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  Đăng ký
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* =========================================================================
          2. MAIN HEADER & NAVIGATION
      ========================================================================= */}
      <header className="bg-white/95 backdrop-blur-md shadow-sm sticky top-[33px] z-40 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          {/* Logo Brand */}
          <Link to="/" className="flex items-center gap-3 group shrink-0">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-[#003870] to-[#0066cc] flex items-center justify-center text-white shadow-md shadow-blue-900/10 group-hover:scale-105 transition-transform shrink-0">
              <HeartPulse className="w-6 h-6 animate-pulse" />
            </div>
            <div className="shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold tracking-tight text-[#003870] whitespace-nowrap">
                  BỆNH VIỆN BÁCH KHOA
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest bg-blue-100 text-[#004282] px-1.5 py-0.5 rounded whitespace-nowrap">
                  HUST HOSPITAL
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium hidden sm:block whitespace-nowrap">
                Hệ thống Y tế Chất lượng cao & Bệnh án Điện tử Thông minh
              </p>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold text-slate-700">
            <a href="#about" className="hover:text-[#004282] transition">Giới thiệu</a>
            <a href="#specialties" className="hover:text-[#004282] transition">Chuyên khoa</a>
            <a href="#doctors" className="hover:text-[#004282] transition">Đội ngũ Bác sĩ</a>
            <a href="#process" className="hover:text-[#004282] transition">Quy trình khám</a>
            <a href="#faq" className="hover:text-[#004282] transition">Hỏi đáp</a>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <Link
              to={user ? "/patient/booking" : "/login?role=patient&redirect=/patient/booking"}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs md:text-sm font-semibold text-white bg-gradient-to-r from-[#004282] to-[#0060b8] hover:from-[#003466] hover:to-[#004e96] shadow-md shadow-blue-800/20 transition-all hover:shadow-lg hover:-translate-y-0.5"
            >
              <Calendar className="w-4 h-4" />
              <span>Đặt lịch khám</span>
            </Link>
          </div>
        </div>
      </header>

      {/* =========================================================================
          3. HERO SECTION
      ========================================================================= */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#002244] via-[#003870] to-[#00529b] text-white py-16 md:py-24">
        {/* Decorative background grid and blurs */}
        <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none"></div>
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-cyan-400/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Hero Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-blue-200 text-xs font-semibold">
                <Award className="w-4 h-4 text-amber-400" />
                <span>Bệnh viện Tiêu chuẩn Quốc gia - Đạt chuẩn Bộ Y tế</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-black tracking-tight leading-[1.18]">
                Tiên Phong Y Học Công Nghệ Cao <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-200 to-white">
                  Chăm Sóc Tận Tâm Toàn Diện
                </span>
              </h1>

              <p className="text-blue-100/90 text-sm sm:text-base md:text-lg max-w-2xl leading-relaxed font-light mx-auto lg:mx-0">
                Hội tụ đội ngũ Giáo sư, Bác sĩ chuyên khoa đầu ngành Đại học Bách Khoa và các bệnh viện tuyến trung ương. 
                Ứng dụng 100% bệnh án điện tử, hệ thống lưu trữ hình ảnh y khoa PACS và tự động hóa xét nghiệm thông minh.
              </p>

              {/* Action buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-2">
                <Link
                  to={user ? "/patient/booking" : "/login?role=patient&redirect=/patient/booking"}
                  className="px-6 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg shadow-emerald-900/30 transition-all flex items-center gap-2 hover:-translate-y-0.5"
                >
                  <Calendar className="w-4 h-4" />
                  Đặt Lịch Khám Trực Tuyến
                </Link>

                <Link
                  to="/patient"
                  className="px-6 py-3.5 rounded-xl font-bold text-sm bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/25 transition-all flex items-center gap-2"
                >
                  <FileText className="w-4 h-4 text-cyan-300" />
                  Tra Cứu Hồ Sơ & Bệnh Án
                </Link>
              </div>

              {/* Highlights badge stats */}
              <div className="pt-6 border-t border-white/15 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center lg:text-left">
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-cyan-300">35+</div>
                  <div className="text-xs text-blue-200/80 font-medium mt-0.5">Năm kinh nghiệm y khoa</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-cyan-300">120+</div>
                  <div className="text-xs text-blue-200/80 font-medium mt-0.5">Bác sĩ & Chuyên gia</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-cyan-300">500k+</div>
                  <div className="text-xs text-blue-200/80 font-medium mt-0.5">Bệnh nhân tin cậy/năm</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-cyan-300">99.2%</div>
                  <div className="text-xs text-blue-200/80 font-medium mt-0.5">Tỷ lệ hài lòng điều trị</div>
                </div>
              </div>
            </div>

            {/* Hero Right Card: Visual Banner & Live Status */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white/20 shadow-blue-950/50">
                <img
                  src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=900&q=80"
                  alt="Bệnh viện Bách Khoa"
                  className="w-full h-80 sm:h-96 object-cover transform hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#002244] via-transparent to-transparent opacity-80"></div>

                {/* Overlay floating card */}
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md rounded-xl p-4 text-slate-800 shadow-xl border border-slate-100">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                      <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                        Phòng Tiếp Đón & Khám Đang Mở Cửa
                      </span>
                    </div>
                    <span className="text-[11px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded">
                      Hôm nay
                    </span>
                  </div>
                  <div className="text-xs text-slate-600 flex items-center justify-between">
                    <span>Hàng đợi tiếp nhận trực tuyến:</span>
                    <strong className="text-blue-700 font-semibold">Ưu tiên số tự động QR</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. QUICK ACTION BAR (DỊCH VỤ TRỌNG TÂM)
      ========================================================================= */}
      <section className="relative -mt-8 z-20 max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-200/80 p-4 sm:p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            to={user ? "/patient/booking" : "/login?role=patient&redirect=/patient/booking"}
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50 transition border border-transparent hover:border-blue-100 group"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-[#004282] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm group-hover:text-[#004282] transition">
                Đặt lịch hẹn khám
              </h4>
              <p className="text-xs text-slate-500">Chủ động ngày giờ & chọn bác sĩ</p>
            </div>
          </Link>

          <Link
            to="/patient/booking"
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-emerald-50 transition border border-transparent hover:border-emerald-100 group"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <FlaskConical className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm group-hover:text-emerald-700 transition">
                Xét nghiệm & CDHA
              </h4>
              <p className="text-xs text-slate-500">Xem kết quả cận lâm sàng số</p>
            </div>
          </Link>

          <a
            href="#doctors"
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-cyan-50 transition border border-transparent hover:border-cyan-100 group"
          >
            <div className="w-12 h-12 rounded-xl bg-cyan-100 text-cyan-800 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <Stethoscope className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm group-hover:text-cyan-800 transition">
                Đội ngũ Bác sĩ
              </h4>
              <p className="text-xs text-slate-500">Giáo sư, Tiến sĩ chuyên khoa</p>
            </div>
          </a>

          <a
            href="tel:02438692026"
            className="flex items-center gap-3 p-3 rounded-xl bg-red-50/60 hover:bg-red-50 transition border border-red-100 group"
          >
            <div className="w-12 h-12 rounded-xl bg-red-500 text-white flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <PhoneCall className="w-6 h-6 animate-bounce" />
            </div>
            <div>
              <h4 className="font-bold text-red-700 text-sm">
                Cấp cứu 24/7
              </h4>
              <p className="text-xs text-red-600 font-semibold">Hotline: 024 3869 2026</p>
            </div>
          </a>
        </div>
      </section>

      {/* =========================================================================
          5. VỀ BỆNH VIỆN BÁCH KHOA & GIỚI THIỆU (ABOUT US)
      ========================================================================= */}
      <section id="about" className="py-16 bg-white border-y border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=900&q=80"
                  alt="Khu khám bệnh Bách Khoa"
                  className="w-full h-[400px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#003870]/80 via-transparent to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <span className="bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase">
                    Cơ sở vật chất hiện đại
                  </span>
                  <h3 className="text-xl font-bold mt-2">
                    Không gian khám chữa bệnh thân thiện, tiện nghi
                  </h3>
                  <p className="text-xs text-slate-200 mt-1">
                    Hệ thống phòng khám vô khuẩn, điều hòa trung tâm và khu chờ đạt tiêu chuẩn bệnh viện khách sạn.
                  </p>
                </div>
              </div>

              {/* Floating Stat Badge */}
              <div className="absolute -bottom-6 -right-4 sm:right-6 bg-white rounded-2xl shadow-xl p-4 border border-slate-100 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-100 text-[#004282] flex items-center justify-center">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-lg font-black text-slate-900">4 Tòa Nhà Chức Năng</div>
                  <div className="text-xs text-slate-500">Tòa A1, A2, B & Trung tâm Kỹ thuật C</div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 space-y-6">
              <div>
                <span className="text-[#005baa] font-bold text-xs uppercase tracking-wider">
                  Về chúng tôi
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                  Biểu Tượng Y Khoa Kết Hợp Công Nghệ Kỹ Thuật Đỉnh Cao
                </h2>
              </div>

              <p className="text-slate-600 text-sm leading-relaxed">
                Được thành lập với sứ mệnh mang đến dịch vụ chăm sóc sức khỏe chất lượng cao, <strong>Bệnh viện Bách Khoa</strong> (thuộc Đại học Bách Khoa Hà Nội) tự hào là cơ sở y tế đi đầu trong việc ứng dụng công nghệ thông tin y tế, trí tuệ nhân tạo (AI) trong chẩn đoán và chuyển đổi số toàn diện.
              </p>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mt-0.5 shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">Hệ thống bệnh án điện tử (EMR) không giấy tờ</h4>
                    <p className="text-xs text-slate-500">Toàn bộ hồ sơ bệnh án, lịch sử dùng thuốc và kết quả xét nghiệm được số hóa trọn đời.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mt-0.5 shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">Trang thiết bị chẩn đoán hình ảnh thế hệ mới</h4>
                    <p className="text-xs text-slate-500">Trang bị máy MRI 3.0T, CT Scanner 128 lát cắt đa tầng, máy siêu âm 4D màu Doppler cao cấp.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mt-0.5 shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">Quy tụ chuyên gia đầu ngành trong nước và quốc tế</h4>
                    <p className="text-xs text-slate-500">Các Giáo sư, Bác sĩ tu nghiệp tại Pháp, Nhật Bản, Hoa Kỳ với hơn 20 năm kinh nghiệm.</p>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-4">
                <a
                  href="#specialties"
                  className="inline-flex items-center gap-2 text-sm font-bold text-[#004282] hover:text-blue-800"
                >
                  Khám phá các chuyên khoa <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          7. CÁC CHUYÊN KHOA TRỌNG ĐIỂM (SPECIALTIES)
      ========================================================================= */}
      <section id="specialties" className="py-16 max-w-7xl mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-[#005baa] font-bold text-xs uppercase tracking-wider">
            Năng lực chuyên môn
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            Các Chuyên Khoa Trọng Điểm
          </h2>
          <p className="text-slate-500 text-sm mt-2">
            Cung cấp đầy đủ các chuyên khoa lâm sàng và cận lâm sàng chuyên sâu, đáp ứng toàn diện nhu cầu khám chữa bệnh.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: Tim Mạch */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 hover:border-blue-400 hover:shadow-xl transition group">
            <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-slate-900 group-hover:text-[#004282] transition">
              Khoa Nội Tim Mạch & Tăng Huyết Áp
            </h3>
            <p className="text-slate-500 text-xs mt-2 leading-relaxed">
              Chẩn đoán và điều trị bệnh mạch vành, rối loạn nhịp tim, suy tim, bệnh lý van tim. Tích hợp máy đo Holter điện tâm đồ 24h và siêu âm tim Doppler màu.
            </p>
            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Trưởng khoa: PGS.TS Nguyễn Văn Trung</span>
              <span className="text-blue-600 font-bold group-hover:translate-x-1 transition-transform">Tòa A1 - Tầng 3 &rarr;</span>
            </div>
          </div>

          {/* Card 2: Tiêu Hóa */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 hover:border-blue-400 hover:shadow-xl transition group">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Activity className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-slate-900 group-hover:text-[#004282] transition">
              Khoa Tiêu Hóa - Gan Mật & Nội Soi
            </h3>
            <p className="text-slate-500 text-xs mt-2 leading-relaxed">
              Nội soi dạ dày, đại tràng phóng đại NBI không đau (gây mê êm ái), tầm soát polyp và ung thư sớm đường tiêu hóa, điều trị viêm gan virus B, C và xơ gan.
            </p>
            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Trưởng khoa: TS.BS Lê Lan Hương</span>
              <span className="text-blue-600 font-bold group-hover:translate-x-1 transition-transform">Tòa A1 - Tầng 4 &rarr;</span>
            </div>
          </div>

          {/* Card 3: Cơ Xương Khớp */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 hover:border-blue-400 hover:shadow-xl transition group">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Activity className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-slate-900 group-hover:text-[#004282] transition">
              Khoa Cơ Xương Khớp & Phục Hồi
            </h3>
            <p className="text-slate-500 text-xs mt-2 leading-relaxed">
              Điều trị thoái hóa khớp, thoát vị đĩa đệm, gout, viêm khớp dạng thấp. Ứng dụng tiêm huyết tương giàu tiểu cầu (PRP) và vật lý trị liệu công nghệ cao.
            </p>
            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Bác sĩ phụ trách: BSCKII Trần Tuấn Anh</span>
              <span className="text-blue-600 font-bold group-hover:translate-x-1 transition-transform">Tòa B - Tầng 2 &rarr;</span>
            </div>
          </div>

          {/* Card 4: Xét Nghiệm */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 hover:border-blue-400 hover:shadow-xl transition group">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Microscope className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-slate-900 group-hover:text-[#004282] transition">
              Trung Tâm Xét Nghiệm Tự Động Hóa
            </h3>
            <p className="text-slate-500 text-xs mt-2 leading-relaxed">
              Hệ thống xét nghiệm Huyết học, Sinh hóa, Miễn dịch, Vi sinh đạt chứng nhận ISO 15189:2012. Liên kết dữ liệu LIS tự động trả kết quả lên hệ thống bệnh viện.
            </p>
            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Phụ trách: BSCKI Lê Thị Hải Hà</span>
              <span className="text-blue-600 font-bold group-hover:translate-x-1 transition-transform">Tòa C - Tầng 1 &rarr;</span>
            </div>
          </div>

          {/* Card 5: Chẩn Đoán Hình Ảnh */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 hover:border-blue-400 hover:shadow-xl transition group">
            <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <FlaskConical className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-slate-900 group-hover:text-[#004282] transition">
              Khoa Chẩn Đoán Hình Ảnh Kỹ Thuật Cao
            </h3>
            <p className="text-slate-500 text-xs mt-2 leading-relaxed">
              Trang bị máy MRI 3.0T Silent Scan không tiếng ồn, CT-Scanner 128 lát cắt, hệ thống X-quang kỹ thuật số DR liều tia thấp tối đa và lưu trữ PACS số.
            </p>
            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Phụ trách: ThS.BS Đỗ Thị Thu Hiền</span>
              <span className="text-blue-600 font-bold group-hover:translate-x-1 transition-transform">Tòa A2 - Tầng B1 &rarr;</span>
            </div>
          </div>

          {/* Card 6: Cấp Cứu & Hồi Sức */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 hover:border-blue-400 hover:shadow-xl transition group">
            <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <PhoneCall className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-slate-900 group-hover:text-[#004282] transition">
              Khoa Cấp Cứu & Hồi Sức Tích Cực 24/7
            </h3>
            <p className="text-slate-500 text-xs mt-2 leading-relaxed">
              Trực cấp cứu liên tục 24 giờ. Đội xe cấp cứu chuyên dụng trang bị máy thở di động, sốc tim sẵn sàng hỗ trợ tại chỗ trong vòng 15 phút nội thành Hà Nội.
            </p>
            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Trực 24/7: 024 3869 2026</span>
              <span className="text-red-600 font-bold group-hover:translate-x-1 transition-transform">Sảnh Cấp cứu A2 &rarr;</span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          8. ĐỘI NGŨ Y BÁC SĨ CHUYÊN GIA (DOCTORS)
      ========================================================================= */}
      <section id="doctors" className="py-16 bg-slate-100/70 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-[#005baa] font-bold text-xs uppercase tracking-wider">
                Đội ngũ thầy thuốc
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                Các Bác Sĩ & Chuyên Gia Đầu Ngành
              </h2>
              <p className="text-slate-500 text-sm mt-1">
                Tận tâm, y đức và giàu kinh nghiệm điều trị thực tiễn
              </p>
            </div>

            {/* Filter buttons */}
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'ALL', label: 'Tất cả' },
                { id: 'TIM_MACH', label: 'Tim Mạch' },
                { id: 'TIEU_HOA', label: 'Tiêu Hóa' },
                { id: 'XUONG_KHOP', label: 'Xương Khớp' },
                { id: 'CAN_LAM_SANG', label: 'Cận Lâm Sàng' }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setActiveSpecialty(f.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    activeSpecialty === f.id
                      ? 'bg-[#004282] text-white shadow-sm'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map((doc) => (
              <div
                key={doc.id}
                className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col"
              >
                <div className="p-6 flex items-start gap-4 flex-1">
                  <img
                    src={doc.avatar}
                    alt={doc.fullName}
                    className="w-20 h-20 rounded-2xl object-cover border-2 border-blue-100 shadow-md shrink-0"
                  />
                  <div>
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 mb-1">
                      {doc.role === 'DOCTOR' ? 'Bác sĩ lâm sàng' : 'Bác sĩ cận lâm sàng'}
                    </span>
                    <h3 className="font-bold text-base text-slate-900 line-clamp-1">
                      {doc.fullName}
                    </h3>
                    <p className="text-xs text-blue-600 font-medium mt-0.5">
                      {doc.specialty}
                    </p>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                      {doc.departmentName}
                    </p>
                  </div>
                </div>

                <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                  <span className="flex items-center gap-1 text-slate-500">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {doc.room}
                  </span>
                  <Link
                    to={user ? "/patient/booking" : "/login?role=patient&redirect=/patient/booking"}
                    className="text-[#004282] font-bold hover:underline flex items-center gap-1"
                  >
                    Đặt lịch khám &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          9. QUY TRÌNH KHÁM BỆNH CHUẨN HÓA (EXAMINATION PROCESS)
      ========================================================================= */}
      <section id="process" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-[#005baa] font-bold text-xs uppercase tracking-wider">
              Trải nghiệm người bệnh
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Quy Trình Khám Chữa Bệnh 4 Bước Đơn Giản
            </h2>
            <p className="text-slate-500 text-sm mt-2">
              Tối ưu hóa thời gian nhờ số hóa toàn diện từ khâu đặt hẹn đến lúc nhận kết quả và mua thuốc.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {/* Step 1 */}
            <div className="relative text-center space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-blue-100 text-[#004282] font-black text-xl flex items-center justify-center mx-auto shadow-md">
                01
              </div>
              <h3 className="font-bold text-base text-slate-900">
                1. Đặt Lịch Trực Tuyến
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Người bệnh đăng ký thông qua website hoặc tổng đài, chọn chuyên khoa, bác sĩ và khung giờ mong muốn.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative text-center space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 font-black text-xl flex items-center justify-center mx-auto shadow-md">
                02
              </div>
              <h3 className="font-bold text-base text-slate-900">
                2. Check-in Kiosk Thông Minh
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Đến bệnh viện quét mã QR tại Kiosk tự động tại sảnh A để nhận số thứ tự ưu tiên và chỉ dẫn buồng khám.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative text-center space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-cyan-100 text-cyan-800 font-black text-xl flex items-center justify-center mx-auto shadow-md">
                03
              </div>
              <h3 className="font-bold text-base text-slate-900">
                3. Khám & Cận Lâm Sàng
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Bác sĩ thăm khám lâm sàng. Nếu có chỉ định xét nghiệm/chụp chiếu, dữ liệu tự đồng bộ ngay lập tức.
              </p>
            </div>

            {/* Step 4 */}
            <div className="relative text-center space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-700 font-black text-xl flex items-center justify-center mx-auto shadow-md">
                04
              </div>
              <h3 className="font-bold text-base text-slate-900">
                4. Kết Luận & Đơn Thuốc Số
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Bác sĩ tư vấn phác đồ điều trị, kê đơn thuốc điện tử. Bệnh nhân dễ dàng tra cứu lịch sử trên cổng cá nhân.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          10. HỎI ĐÁP THƯỜNG GẶP (FAQ ACCORDION)
      ========================================================================= */}
      <section id="faq" className="py-16 max-w-4xl mx-auto px-4">
        <div className="text-center mb-10">
          <span className="text-[#005baa] font-bold text-xs uppercase tracking-wider">
            Giải đáp thắc mắc
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            Câu Hỏi Thường Gặp Của Người Bệnh
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Những thông tin cần biết trước khi đến thăm khám tại Bệnh viện Bách Khoa
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm transition"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
                className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-slate-800 hover:text-[#004282] transition"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                    openFaq === idx ? 'transform rotate-180 text-[#004282]' : ''
                  }`}
                />
              </button>

              {openFaq === idx && (
                <div className="px-4 pb-5 sm:px-5 text-xs sm:text-sm text-slate-600 border-t border-slate-100 pt-3 leading-relaxed">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          13. BANNER KHẨN CẤP & BẢO HIỂM
      ========================================================================= */}
      <section className="bg-gradient-to-r from-red-600 to-rose-700 text-white py-10 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
              <PhoneCall className="w-8 h-8 text-white animate-pulse" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-black">
                Cần Hỗ Trợ Y Tế Khẩn Cấp?
              </h3>
              <p className="text-red-100 text-xs sm:text-sm mt-1">
                Đội ngũ cấp cứu lưu động và hồi sức tích cực 24/7 luôn sẵn sàng hỗ trợ bệnh nhân trên toàn địa bàn.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href="tel:02438692026"
              className="px-6 py-3 rounded-xl bg-white text-red-600 font-extrabold text-sm shadow-lg hover:bg-red-50 transition flex items-center gap-2"
            >
              <PhoneCall className="w-4 h-4" />
              Gọi Cấp Cứu: 024 3869 2026
            </a>
            <a
              href="tel:19006868"
              className="px-5 py-3 rounded-xl bg-red-800/60 hover:bg-red-800 text-white font-bold text-sm border border-red-400/40 transition"
            >
              Tổng đài tư vấn: 1900 6868
            </a>
          </div>
        </div>
      </section>

      {/* =========================================================================
          14. FOOTER TOÀN DIỆN
      ========================================================================= */}
      <footer className="bg-slate-900 text-slate-400 text-xs pt-12 pb-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-10">
          {/* Cột 1: Thông tin bệnh viện */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-[#004282] text-white flex items-center justify-center">
                <HeartPulse className="w-5 h-5" />
              </div>
              <span className="text-base font-extrabold text-white tracking-tight">
                BỆNH VIỆN BÁCH KHOA
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              Cơ sở khám chữa bệnh công nghệ cao trực thuộc Đại học Bách Khoa Hà Nội. Tiên phong ứng dụng giải pháp bệnh viện thông minh, hồ sơ bệnh án điện tử và trí tuệ nhân tạo trong y tế.
            </p>
            <div className="space-y-1.5 text-slate-300">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>Số 1 Đại Cồ Việt, P. Bách Khoa, Q. Hai Bà Trưng, TP. Hà Nội</span>
              </div>
              <div className="flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Tổng đài CSKH: 1900 6868 | Cấp cứu: 024 3869 2026</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Giấy phép hoạt động khám chữa bệnh số: 128/BYT-GPHĐ</span>
              </div>
            </div>
          </div>

          {/* Cột 2: Chuyên khoa */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm">Chuyên Khoa Chính</h4>
            <ul className="space-y-2 text-slate-400">
              <li><a href="#specialties" className="hover:text-white transition">Khoa Tim Mạch</a></li>
              <li><a href="#specialties" className="hover:text-white transition">Khoa Tiêu Hóa - Gan Mật</a></li>
              <li><a href="#specialties" className="hover:text-white transition">Khoa Cơ Xương Khớp</a></li>
              <li><a href="#specialties" className="hover:text-white transition">Trung Tâm Xét Nghiệm LIS</a></li>
              <li><a href="#specialties" className="hover:text-white transition">Khoa Chẩn Đoán Hình Ảnh</a></li>
              <li><a href="#specialties" className="hover:text-white transition">Khoa Cấp Cứu 24/7</a></li>
            </ul>
          </div>

          {/* Cột 3: Người bệnh cần biết */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm">Hướng Dẫn Người Bệnh</h4>
            <ul className="space-y-2 text-slate-400">
              <li><Link to={user ? "/patient/booking" : "/login?role=patient&redirect=/patient/booking"} className="hover:text-white transition">Đặt lịch khám trước</Link></li>
              <li><a href="#process" className="hover:text-white transition">Quy trình khám chữa bệnh</a></li>
              <li><a href="#faq" className="hover:text-white transition">Chính sách BHYT & Câu hỏi thường gặp</a></li>
              <li><Link to="/patient" className="hover:text-white transition">Tra cứu kết quả xét nghiệm</Link></li>
              <li><Link to="/patient/register" className="hover:text-white transition">Đăng ký tài khoản bệnh nhân</Link></li>
            </ul>
          </div>

          {/* Cột 4: Hệ thống số hóa */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm">Cổng Phần Mềm</h4>
            <ul className="space-y-2 text-slate-400">
              <li><Link to="/doctor" className="hover:text-emerald-400 transition">Cổng Bác Sĩ Khám Bệnh</Link></li>
              <li><Link to="/paraclinical" className="hover:text-purple-400 transition">Cổng Bác Sĩ Cận Lâm Sàng</Link></li>
              <li><Link to="/admin" className="hover:text-amber-400 transition">Cổng Quản Trị Hệ Thống</Link></li>
              <li><Link to="/login?role=staff" className="hover:text-white transition">Đăng Nhập Cán Bộ Y Tế</Link></li>
              <li><Link to="/login?role=patient" className="hover:text-cyan-400 transition">Đăng Nhập Người Bệnh</Link></li>
            </ul>
          </div>
        </div>

        {/* Bản quyền */}
        <div className="max-w-7xl mx-auto px-4 pt-6 border-t border-slate-800 text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div>
            © {new Date().getFullYear()} <strong>Bệnh viện Bách Khoa</strong> (Đại học Bách Khoa Hà Nội). Bản quyền thuộc về Nhóm 30 - IT4409 Công Nghệ Web.
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Tiêu chuẩn HIS/LIS/PACS Bộ Y Tế</span>
            <span>•</span>
            <span>Bảo mật y tế EMR</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
