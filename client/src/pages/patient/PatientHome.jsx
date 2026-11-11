import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CalendarPlus, CalendarDays, ClipboardList,
  FlaskConical, ArrowRight, HeartPulse,
  LayoutDashboard, Info
} from 'lucide-react';

const services = [
  {
    id: 'booking',
    title: 'Đặt lịch khám',
    description: 'Lựa chọn chuyên khoa, bác sĩ và thời gian khám.',
    icon: CalendarPlus,
  },
  {
    id: 'appointments',
    title: 'Lịch khám của tôi',
    description: 'Theo dõi các lịch hẹn và trạng thái khám bệnh.',
    icon: CalendarDays,
  },
  {
    id: 'records',
    title: 'Hồ sơ bệnh án',
    description: 'Tra cứu lịch sử khám, chẩn đoán và đơn thuốc.',
    icon: ClipboardList,
  },
  {
    id: 'results',
    title: 'Kết quả xét nghiệm',
    description: 'Theo dõi kết quả cận lâm sàng của bạn.',
    icon: FlaskConical,
  },
];

const detailContent = {
  booking: {
    title: 'Đặt lịch khám trực tuyến',
    message: 'Chức năng lựa chọn chuyên khoa, bác sĩ và lịch khám sẽ được bổ sung ở bước tiếp theo.',
  },
  appointments: {
    title: 'Lịch khám của tôi',
    message: 'Chưa kết nối dữ liệu lịch hẹn từ hệ thống bệnh viện.',
  },
  records: {
    title: 'Hồ sơ bệnh án',
    message: 'Chưa kết nối dữ liệu bệnh án cá nhân.',
  },
  results: {
    title: 'Kết quả xét nghiệm',
    message: 'Chưa kết nối kết quả xét nghiệm từ hệ thống.',
  },
};

export default function PatientHome() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-10">
      <div className="mb-7">
        <p className="text-[#005baa] text-sm font-semibold mb-2">
          CỔNG THÔNG TIN NGƯỜI BỆNH
        </p>
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
          Chăm sóc sức khỏe thuận tiện hơn
        </h2>
        <p className="text-slate-500 mt-2">
          Quản lý lịch khám và thông tin y tế của bạn tại một nơi.
        </p>
      </div>

      <nav className="flex gap-2 overflow-x-auto pb-3 mb-6">
        {[
          { id: 'overview', label: 'Tổng quan', icon: LayoutDashboard },
          { id: 'booking', label: 'Đặt lịch', icon: CalendarPlus },
          { id: 'appointments', label: 'Lịch hẹn', icon: CalendarDays },
          { id: 'records', label: 'Bệnh án', icon: ClipboardList },
          { id: 'results', label: 'Xét nghiệm', icon: FlaskConical },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition ${
              activeTab === item.id
                ? 'bg-[#004282] text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-blue-50'
            }`}
          >
            <item.icon size={17} />
            {item.label}
          </button>
        ))}
      </nav>

      {activeTab === 'overview' ? (
        <>
          <section className="rounded-2xl bg-gradient-to-r from-[#004282] to-[#0872b7] text-white p-6 md:p-9 mb-7">
            <div className="flex items-start gap-4">
              <HeartPulse className="hidden sm:block shrink-0" size={42} />
              <div>
                <p className="text-blue-100 text-sm mb-2">
                  Dịch vụ y tế trực tuyến
                </p>
                <h3 className="text-xl md:text-2xl font-bold mb-2">
                  Đồng hành cùng sức khỏe của bạn
                </h3>
                <p className="text-blue-100 text-sm max-w-xl">
                  Chủ động đặt lịch, theo dõi quá trình khám chữa bệnh
                  và quản lý thông tin sức khỏe mọi lúc.
                </p>
                <button
                  onClick={() => setActiveTab('booking')}
                  className="mt-5 bg-white text-[#004282] px-5 py-2.5 rounded-lg font-semibold text-sm flex items-center gap-2 hover:bg-blue-50"
                >
                  Đặt lịch khám
                  <ArrowRight size={17} />
                </button>
              </div>
            </div>
          </section>

          <h3 className="font-bold text-lg mb-4">
            Tiện ích dành cho người bệnh
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {services.map((service) => (
              <button
                key={service.id}
                onClick={() => setActiveTab(service.id)}
                className="text-left bg-white border border-slate-200 rounded-2xl p-5 hover:border-blue-300 hover:shadow-md transition group"
              >
                <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-blue-50 text-[#004282] mb-5">
                  <service.icon size={25} />
                </div>
                <h4 className="font-bold text-slate-900 mb-2">
                  {service.title}
                </h4>
                <p className="text-sm text-slate-500 min-h-16">
                  {service.description}
                </p>
                <div className="flex items-center gap-2 text-[#005baa] text-sm font-semibold mt-4 group-hover:gap-3 transition-all">
                  Xem chi tiết <ArrowRight size={16} />
                </div>
              </button>
            ))}
          </div>

          <div className="mt-8 bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3 text-sm text-blue-900">
            <Info size={20} className="shrink-0" />
            <p>
              Đây là giao diện thử nghiệm. Dữ liệu khám chữa bệnh thực tế
              chỉ hiển thị sau khi hệ thống được kết nối backend và xác thực.
            </p>
          </div>
        </>
      ) : (
        <section className="bg-white border border-slate-200 rounded-2xl p-6 md:p-10 min-h-64">
          <h3 className="text-xl font-bold text-slate-900 mb-3">
            {detailContent[activeTab].title}
          </h3>
          <p className="text-slate-500 mb-6">
            {detailContent[activeTab].message}
          </p>
            <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl mb-6">
                <p className="text-sm text-blue-900 font-medium mb-3">
                    Vui lòng đăng nhập để sử dụng các dịch vụ
                    và tra cứu thông tin y tế cá nhân khi hệ thống
                    được kết nối backend.
                </p>
                <Link
                to="/patient/booking"
                className="inline-flex mt-4 bg-[#004282] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#003566]"
                >
                Xem giao diện đặt lịch thử nghiệm
                </Link>


            <div className="flex flex-wrap gap-3">
                <Link
                to="/patient/login"
                className="bg-[#004282] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#003566]"
                >
                Đăng nhập
                </Link>

                <Link
                to="/patient/register"
                className="bg-white border border-blue-200 text-[#004282] px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-100"
                >
                Tạo tài khoản
                </Link>
            </div>
            </div>
          <button
            onClick={() => setActiveTab('overview')}
            className="text-[#004282] text-sm font-semibold hover:underline"
          >
            ← Quay lại tổng quan
          </button>
        </section>
      )}
    </div>
  );
}
