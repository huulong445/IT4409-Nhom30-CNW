import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import {
  CalendarDays,
  Clock3,
  Stethoscope,
  Building2,
  CheckCircle2,
  UserCheck,
  ArrowLeft,
  Search,
  ChevronUp,
  ChevronDown,
  AlertCircle,
  QrCode
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

// Danh mục Chuyên khoa, Triệu chứng gợi ý và Danh sách Phòng khám kèm Khung giờ
export const BOOKING_SPECIALTIES = [
  {
    id: 'Y_HOC_CO_TRUYEN',
    name: 'Y học Cổ Truyền',
    symptoms: 'Chẩn đoán, duy trì, cải thiện, điều trị và phục hồi bệnh thể chất và tinh thần dựa trên các hiểu biết từ y học dân gian, y học phương đông và y học hiện đại.',
    area: 'Khu Tái Khám Đích Danh (Nhà K1)',
    clinics: [
      {
        id: 'YHCT_P311',
        name: 'Phòng khám Y học cổ truyền - P311 tầng 3 nhà K1',
        location: 'Tầng 3 - Nhà K1',
        timeSlots: ['13:30', '13:45', '14:00', '14:15', '14:30', '14:45', '15:00', '15:15', '15:30']
      },
      {
        id: 'YHCT_P312',
        name: 'PK Y học cổ truyền & Châm cứu (P. 312)',
        location: 'Tầng 3 - Nhà K1',
        timeSlots: ['08:00', '08:30', '09:00', '09:30', '10:00', '13:30', '14:00', '14:30', '15:00']
      }
    ]
  },
  {
    id: 'NOI_DOT_QUY',
    name: 'Nội - Đột quỵ',
    symptoms: 'Đau đầu, yếu liệt tay chân, méo miệng, ngôn ngữ bất thường, chóng mặt, nhìn mờ, tê bì tay chân...',
    area: 'Khu Tái Khám Đích Danh (Nhà K1)',
    clinics: [
      {
        id: 'NOI_P627',
        name: 'PK Nội khoa 10 (P. 627)',
        location: 'Tầng 6 - Nhà K1',
        timeSlots: ['13:30', '13:45', '14:00', '14:15', '14:30', '14:45', '15:00', '15:15', '15:30']
      },
      {
        id: 'NOI_P601',
        name: 'PK Nội khoa 11 (P. 601)',
        location: 'Tầng 6 - Nhà K1',
        timeSlots: ['13:30', '13:45', '14:00', '14:15', '14:30', '14:45', '15:00', '15:15', '15:30']
      }
    ]
  },
  {
    id: 'TAO_HINH_THAM_MY',
    name: 'TẠO HÌNH THẨM MỸ',
    symptoms: 'DỊ TẬT BẨM SINH, SỨT MÔI HỞ HÀM ẾCH, SẸO, VẾT CẮT HOẶC VẾT RÁCH TRÊN VÙNG DA RỘNG, NÂNG MŨI, NÂNG NGỰC, HÚT MỠ...',
    area: 'Khu Phẫu Thuật Tạo Hình (Nhà K2)',
    clinics: [
      {
        id: 'THTM_P501',
        name: 'Phòng khám Tạo hình Thẩm mỹ (P. 501 Nhà K2)',
        location: 'Tầng 5 - Nhà K2',
        timeSlots: ['08:30', '09:00', '09:30', '10:00', '14:00', '14:30', '15:00', '15:30']
      }
    ]
  },
  {
    id: 'TAI_MUI_HONG',
    name: 'Tai Mũi Họng',
    symptoms: 'Triệu chứng: đau đầu, ho, chóng mặt, ngủ ngáy, hắt hơi, ngứa mũi, ngạt mũi, chảy nước mũi, ù tai, nghe kém, khàn tiếng, mất tiếng...',
    area: 'Khu Khám Chuyên Khoa (Nhà B)',
    clinics: [
      {
        id: 'TMH_P201',
        name: 'Phòng khám Tai Mũi Họng 1 (P. 201)',
        location: 'Tầng 2 - Nhà B',
        timeSlots: ['08:00', '08:30', '09:00', '09:30', '10:00', '13:30', '14:00', '14:30', '15:00']
      },
      {
        id: 'TMH_P202',
        name: 'Phòng khám Tai Mũi Họng 2 - Nội soi (P. 202)',
        location: 'Tầng 2 - Nhà B',
        timeSlots: ['08:00', '08:30', '09:00', '09:30', '10:00', '13:30', '14:00', '14:30', '15:00', '15:30']
      }
    ]
  },
  {
    id: 'PHUC_HOI_CHUC_NANG',
    name: 'Phục hồi Chức năng',
    symptoms: 'Khám và tư vấn hướng dẫn tập phục hồi chức năng sau chấn thương, Liệt nửa người, cứng khớp sau phẫu thuật...',
    area: 'Khu Phục Hồi Chức Năng (Nhà C)',
    clinics: [
      {
        id: 'PHCN_P101',
        name: 'Phòng khám Phục hồi chức năng & Lượng giá (P. 101 Nhà C)',
        location: 'Tầng 1 - Nhà C',
        timeSlots: ['08:00', '08:30', '09:00', '09:30', '10:00', '13:30', '14:00', '14:30', '15:00']
      }
    ]
  },
  {
    id: 'TIM_MACH',
    name: 'Khoa Tim Mạch',
    symptoms: 'Đau thắt ngực khi gắng sức, hồi hộp trống ngực, tăng huyết áp, khó thở về đêm, loạn nhịp tim...',
    area: 'Khu Khám Chuyên Khoa (Nhà A2)',
    clinics: [
      {
        id: 'PK_204',
        name: 'Phòng khám 204 - Tim mạch & Tăng huyết áp',
        location: 'Phòng 204 - Tầng 2, Nhà A2',
        timeSlots: ['07:30', '08:00', '08:30', '09:00', '09:30', '10:00', '13:30', '14:00', '14:30', '15:00']
      },
      {
        id: 'PK_205',
        name: 'Phòng khám 205 - Can thiệp tim mạch & Đau ngực',
        location: 'Phòng 205 - Tầng 2, Nhà A2',
        timeSlots: ['08:00', '08:30', '09:00', '09:30', '10:00', '13:30', '14:00', '14:30', '15:00', '15:30']
      }
    ]
  },
  {
    id: 'TIEU_HOA',
    name: 'Khoa Tiêu Hóa - Gan Mật',
    symptoms: 'Đau âm ỉ vùng thượng vị sau ăn, ợ hơi ợ chua, trào ngược thực quản, chướng bụng đầy hơi, vàng da...',
    area: 'Khu Khám Bệnh (Tòa A1)',
    clinics: [
      {
        id: 'PK_305',
        name: 'Phòng khám 305 - Tiêu hóa tổng quát',
        location: 'Phòng 305 - Tầng 3, Nhà A1',
        timeSlots: ['07:30', '08:00', '08:30', '09:00', '09:30', '10:00', '13:30', '14:00', '14:30', '15:00']
      },
      {
        id: 'PK_306',
        name: 'Phòng khám 306 - Gan Mật & Tụy',
        location: 'Phòng 306 - Tầng 3, Nhà A1',
        timeSlots: ['08:00', '08:30', '09:00', '09:30', '10:00', '13:30', '14:00', '14:30', '15:00', '15:30']
      }
    ]
  },
  {
    id: 'CO_XUONG_KHOP',
    name: 'Khoa Cơ Xương Khớp',
    symptoms: 'Đau sưng khớp gối, thoái hóa khớp, đau lưng dưới, đau mỏi vai gáy, thoát vị đĩa đệm, hạn chế vận động...',
    area: 'Khu Khám Bệnh (Tòa B)',
    clinics: [
      {
        id: 'CXK_P102',
        name: 'Phòng khám 102 - Cơ Xương Khớp & Chấn thương',
        location: 'Phòng 102 - Tầng 1, Nhà B',
        timeSlots: ['07:30', '08:00', '08:30', '09:00', '09:30', '10:00', '13:30', '14:00', '14:30', '15:00']
      },
      {
        id: 'CXK_P103',
        name: 'Phòng khám 103 - Cột sống & Thoát vị',
        location: 'Phòng 103 - Tầng 1, Nhà B',
        timeSlots: ['08:00', '08:30', '09:00', '09:30', '10:00', '13:30', '14:00', '14:30', '15:00', '15:30']
      }
    ]
  }
];

const today = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function PatientBooking() {
  const { user } = useAuth();

  // Bắt buộc đăng nhập tài khoản Người bệnh mới được đặt lịch
  if (!user) {
    return <Navigate to="/login?role=patient&redirect=/patient/booking" replace />;
  }

  const [searchSpecialty, setSearchSpecialty] = useState('');
  const [selectedSpecialtyId, setSelectedSpecialtyId] = useState('Y_HOC_CO_TRUYEN');
  const [selectedDate, setSelectedDate] = useState(today());
  const [selectedClinicId, setSelectedClinicId] = useState('YHCT_P311');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('13:30');
  const [isAreaExpanded, setIsAreaExpanded] = useState(true);
  const [confirmed, setConfirmed] = useState(false);
  const [ticketCode, setTicketCode] = useState('');

  // Lọc chuyên khoa theo từ khóa tìm kiếm (theo tên hoặc triệu chứng)
  const filteredSpecialties = BOOKING_SPECIALTIES.filter(spec => {
    const term = searchSpecialty.toLowerCase().trim();
    if (!term) return true;
    return (
      spec.name.toLowerCase().includes(term) ||
      spec.symptoms.toLowerCase().includes(term)
    );
  });

  const selectedSpecialty = BOOKING_SPECIALTIES.find(
    s => s.id === selectedSpecialtyId
  ) || BOOKING_SPECIALTIES[0];

  const selectedClinic = selectedSpecialty?.clinics.find(
    c => c.id === selectedClinicId
  );

  const handleSelectSpecialty = (spec) => {
    setSelectedSpecialtyId(spec.id);
    // Tự động chọn phòng khám và khung giờ đầu tiên của chuyên khoa đó
    if (spec.clinics && spec.clinics.length > 0) {
      setSelectedClinicId(spec.clinics[0].id);
      setSelectedTimeSlot(spec.clinics[0].timeSlots[0] || '');
    } else {
      setSelectedClinicId('');
      setSelectedTimeSlot('');
    }
    setConfirmed(false);
  };

  const handleSelectSlot = (clinicId, slot) => {
    setSelectedClinicId(clinicId);
    setSelectedTimeSlot(slot);
    setConfirmed(false);
  };

  const handleConfirmBooking = (e) => {
    e.preventDefault();
    if (!selectedSpecialty || !selectedClinic || !selectedTimeSlot || !selectedDate) {
      alert('Vui lòng chọn đầy đủ chuyên khoa, ngày khám, phòng khám và khung giờ!');
      return;
    }
    const randomCode = 'BKH-' + Math.floor(100000 + Math.random() * 900000);
    setTicketCode(randomCode);
    setConfirmed(true);
  };

  const handleResetBooking = () => {
    setConfirmed(false);
    setTicketCode('');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header điều hướng */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <Link
          to="/patient"
          className="inline-flex items-center gap-2 text-sm text-[#004282] font-semibold hover:underline"
        >
          <ArrowLeft size={17} />
          Quay lại Cổng Người Bệnh
        </Link>
        <span className="text-xs text-slate-500 bg-white px-3 py-1.5 rounded-lg border border-slate-200">
          Đặt khám trực tuyến 24/7
        </span>
      </div>

      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
          Đặt Lịch Khám Theo Chuyên Khoa
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Lựa chọn chuyên khoa theo triệu chứng sức khỏe, sau đó chọn phòng khám và khung giờ phù hợp.
        </p>
      </div>

      {confirmed ? (
        /* =================== MÀN HÌNH XÁC NHẬN ĐẶT LỊCH THÀNH CÔNG =================== */
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 max-w-2xl mx-auto text-center shadow-xl space-y-6 animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <h2 className="text-2xl font-black text-slate-900">
              Đặt Lịch Khám Thành Công!
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Hệ thống Bệnh viện Bách Khoa đã tiếp nhận lịch hẹn của người bệnh.
            </p>
          </div>

          {/* Phiếu hẹn khám điện tử */}
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50/40 border-2 border-emerald-300 rounded-2xl p-6 text-left relative overflow-hidden">
            <div className="flex items-start justify-between gap-4 border-b border-emerald-200/80 pb-4 mb-4">
              <div>
                <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider bg-emerald-100/80 px-2 py-0.5 rounded">
                  Phiếu Hẹn Khám Trực Tuyến
                </span>
                <div className="text-2xl font-black text-[#0c5936] tracking-wider mt-1.5">
                  {ticketCode}
                </div>
              </div>
              <div className="p-2 bg-white rounded-xl shadow-sm border border-emerald-100 text-slate-800">
                <QrCode className="w-12 h-12 text-[#0c5936]" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700">
              <div>
                <span className="text-slate-500 block">Họ và tên người bệnh:</span>
                <strong className="text-sm text-slate-900">{user.fullName}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Mã bệnh nhân:</span>
                <span className="font-mono font-bold text-slate-900">{user.patientId || 'BN-2024-0089'}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Chuyên khoa:</span>
                <strong className="text-slate-900">{selectedSpecialty?.name}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Ngày hẹn khám:</span>
                <strong className="text-emerald-800 font-bold">{selectedDate}</strong>
              </div>
              <div className="sm:col-span-2">
                <span className="text-slate-500 block">Phòng khám tiếp nhận:</span>
                <strong className="text-slate-900">{selectedClinic?.name}</strong>
                <p className="text-[11px] text-slate-500 mt-0.5">{selectedSpecialty?.area} • {selectedClinic?.location}</p>
              </div>
              <div className="sm:col-span-2 p-2.5 bg-white rounded-xl border border-emerald-200 flex items-center justify-between">
                <span className="font-semibold text-slate-700">Khung giờ khám dự kiến:</span>
                <span className="text-base font-black text-[#0c5936] px-3 py-1 bg-emerald-100 rounded-lg">
                  {selectedTimeSlot}
                </span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-emerald-200 text-[11px] text-emerald-900 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <span>
                Quý khách vui lòng đến bệnh viện trước khung giờ hẹn <strong>15 phút</strong> và quét mã QR tại Kiosk sảnh tiếp đón để nhận số thứ tự vào phòng khám.
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <button
              onClick={handleResetBooking}
              className="px-6 py-2.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
            >
              Đặt lịch khám khác
            </button>
            <Link
              to="/patient"
              className="px-6 py-2.5 rounded-xl text-xs font-bold bg-[#004282] hover:bg-[#003466] text-white shadow-md transition"
            >
              Về Cổng Bệnh Nhân
            </Link>
          </div>
        </div>
      ) : (
        /* =================== FORM CHỌN CHUYÊN KHOA & PHÒNG KHÁM =================== */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* CỘT TRÁI (8/12): CHỌN CHUYÊN KHOA & DANH SÁCH PHÒNG KHÁM KHUNG GIỜ */}
          <div className="lg:col-span-8 space-y-6">
            {/* KHỐI 1: CHỌN NGÀY KHÁM */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-[#004282]" />
                <div>
                  <h3 className="font-bold text-slate-800 text-sm">Chọn ngày khám</h3>
                  <p className="text-xs text-slate-500">Đặt trước từ 1 - 7 ngày</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  min={today()}
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#004282]"
                />
                <button
                  type="button"
                  onClick={() => setSelectedDate(today())}
                  className="px-2.5 py-2 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                >
                  Hôm nay
                </button>
              </div>
            </div>

            {/* KHỐI 2: DANH SÁCH CHUYÊN KHOA (KÈM TRIỆU CHỨNG) NHƯ HÌNH */}
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Stethoscope className="w-5 h-5 text-[#004282]" />
                  <h3 className="font-bold text-slate-800 text-sm">
                    1. Chọn Chuyên Khoa Theo Triệu Chứng
                  </h3>
                </div>
                {/* Thanh tìm kiếm nhanh */}
                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Tìm tên khoa hoặc triệu chứng..."
                    value={searchSpecialty}
                    onChange={(e) => setSearchSpecialty(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#004282] focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              {/* Danh sách cuộn chuyên khoa */}
              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                {filteredSpecialties.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-400">
                    Không tìm thấy chuyên khoa phù hợp với từ khóa "{searchSpecialty}".
                  </div>
                ) : (
                  filteredSpecialties.map((spec) => {
                    const isSelected = selectedSpecialtyId === spec.id;
                    return (
                      <div
                        key={spec.id}
                        onClick={() => handleSelectSpecialty(spec)}
                        className={`p-3.5 cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-slate-100/90 border-l-4 border-[#0c5936] shadow-sm'
                            : 'hover:bg-slate-50/80 border-l-4 border-transparent'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <h4 className={`text-sm font-bold ${isSelected ? 'text-[#0c5936]' : 'text-slate-800'}`}>
                            {spec.name}
                          </h4>
                          {isSelected && (
                            <span className="text-[10px] font-bold bg-[#0c5936] text-white px-2 py-0.5 rounded-full">
                              Đang chọn
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-amber-600 mt-1 leading-snug">
                          <span className="font-bold">Triệu chứng:</span> {spec.symptoms}
                        </p>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* KHỐI 3: DANH SÁCH PHÒNG KHÁM VÀ KHUNG GIỜ (GIỐNG HỆT HÌNH ẢNH MẪU) */}
            {selectedSpecialty && (
              <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-md">
                {/* Header Khu Vực Phòng Khám (Màu xanh đậm theo mẫu hình) */}
                <div
                  onClick={() => setIsAreaExpanded(!isAreaExpanded)}
                  className="bg-[#0c5936] text-white px-4 py-3.5 flex items-center justify-between cursor-pointer select-none"
                >
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-emerald-200" />
                    <h3 className="font-bold text-sm tracking-wide">
                      {selectedSpecialty.area}
                    </h3>
                    <span className="text-[11px] bg-emerald-800/80 text-emerald-100 px-2 py-0.5 rounded-full font-medium ml-1">
                      {selectedSpecialty.name}
                    </span>
                  </div>
                  <button type="button" className="text-emerald-100 hover:text-white">
                    {isAreaExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>
                </div>

                {/* Danh sách phòng khám thuộc khu vực */}
                {isAreaExpanded && (
                  <div className="bg-white divide-y divide-emerald-100">
                    {selectedSpecialty.clinics.map((clinic) => {
                      return (
                        <div key={clinic.id} className="transition-colors">
                          {/* Thanh tiêu đề Phòng khám (Màu xanh lá nhạt như mẫu hình) */}
                          <div className="bg-[#e6f4ea] text-[#0c5936] px-4 py-2.5 flex items-center justify-between text-xs font-bold border-b border-emerald-100">
                            <div className="flex items-center gap-1.5">
                              <span>{clinic.name}</span>
                            </div>
                            <ChevronUp size={16} className="text-emerald-700" />
                          </div>

                          {/* Danh sách các button khung giờ của phòng khám */}
                          <div className="p-4 bg-white">
                            <div className="flex flex-wrap gap-2">
                              {clinic.timeSlots.map((slot) => {
                                const isChosen =
                                  selectedClinicId === clinic.id &&
                                  selectedTimeSlot === slot;

                                return (
                                  <button
                                    key={slot}
                                    type="button"
                                    onClick={() => handleSelectSlot(clinic.id, slot)}
                                    className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                                      isChosen
                                        ? 'bg-[#0c5936] text-white border-2 border-[#0c5936] shadow-md scale-105'
                                        : 'bg-white text-slate-700 border border-emerald-300 hover:border-emerald-600 hover:bg-emerald-50/50'
                                    }`}
                                  >
                                    {slot}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* CỘT PHẢI (4/12): TÓM TẮT THÔNG TIN & XÁC NHẬN */}
          <div className="lg:col-span-4 space-y-4 lg:sticky lg:top-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-5">
              {/* Thông tin người bệnh */}
              <div>
                <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2 mb-3">
                  <UserCheck className="w-4 h-4 text-[#004282]" />
                  Người bệnh đặt lịch
                </h3>
                <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-100 text-xs space-y-1">
                  <div className="font-bold text-slate-900 text-sm">{user.fullName}</div>
                  <div className="text-slate-600 flex items-center justify-between">
                    <span>Mã BN:</span>
                    <strong className="font-mono text-slate-800">{user.patientId || 'BN-2024-0089'}</strong>
                  </div>
                  <div className="text-slate-600 flex items-center justify-between">
                    <span>Số điện thoại:</span>
                    <strong className="text-slate-800">{user.phone || '0912 345 678'}</strong>
                  </div>
                </div>
              </div>

              {/* Thông tin lượt khám đã chọn */}
              <div className="space-y-3 pt-3 border-t border-slate-100 text-xs">
                <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                  Chi tiết lượt khám
                </h4>

                <div className="flex items-start justify-between gap-2">
                  <span className="text-slate-500">Chuyên khoa:</span>
                  <strong className="text-right text-slate-900 font-semibold max-w-[180px]">
                    {selectedSpecialty?.name || 'Chưa chọn'}
                  </strong>
                </div>

                <div className="flex items-start justify-between gap-2">
                  <span className="text-slate-500">Ngày khám:</span>
                  <strong className="text-right text-emerald-800 font-bold">
                    {selectedDate}
                  </strong>
                </div>

                <div className="flex items-start justify-between gap-2">
                  <span className="text-slate-500">Khu vực:</span>
                  <span className="text-right text-slate-700 font-medium">
                    {selectedSpecialty?.area}
                  </span>
                </div>

                <div className="flex items-start justify-between gap-2">
                  <span className="text-slate-500">Phòng khám:</span>
                  <strong className="text-right text-slate-900">
                    {selectedClinic?.name || 'Chưa chọn phòng'}
                  </strong>
                </div>

                <div className="flex items-center justify-between gap-2 p-2.5 bg-emerald-50 rounded-xl border border-emerald-200">
                  <span className="font-semibold text-emerald-900">Khung giờ:</span>
                  <span className="text-sm font-black text-[#0c5936] px-2.5 py-0.5 bg-white rounded-lg border border-emerald-300">
                    {selectedTimeSlot || '--:--'}
                  </span>
                </div>
              </div>

              {/* Nút gửi đặt lịch */}
              <button
                type="button"
                onClick={handleConfirmBooking}
                disabled={!selectedTimeSlot}
                className="w-full bg-[#0c5936] hover:bg-[#0a482b] disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold py-3.5 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm"
              >
                <Clock3 className="w-4 h-4" />
                Xác Nhận Đặt Lịch
              </button>

              <p className="text-[11px] text-slate-400 text-center leading-tight">
                Không thu phí đặt hẹn trực tuyến. Người bệnh thanh toán viện phí tại quầy tiếp đón sau khi khám.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
