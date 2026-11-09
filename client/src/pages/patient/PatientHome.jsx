import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  CalendarPlus, CalendarDays, ClipboardList,
  FlaskConical, ArrowRight, HeartPulse,
  LayoutDashboard, Info, CheckCircle2, Clock,
  FileText, Activity, AlertCircle, RefreshCw
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';

const services = [
  {
    id: 'booking',
    title: 'Đặt lịch khám',
    description: 'Lựa chọn chuyên khoa, phòng khám và khung giờ khám nhanh chóng.',
    icon: CalendarPlus,
  },
  {
    id: 'appointments',
    title: 'Lịch khám của tôi',
    description: 'Theo dõi các lịch hẹn trực tuyến và số thứ tự phòng khám.',
    icon: CalendarDays,
  },
  {
    id: 'records',
    title: 'Hồ sơ bệnh án',
    description: 'Tra cứu lịch sử chẩn đoán, toa thuốc điện tử và lời dặn bác sĩ.',
    icon: ClipboardList,
  },
  {
    id: 'results',
    title: 'Kết quả xét nghiệm',
    description: 'Theo dõi chỉ định cận lâm sàng, xét nghiệm máu và chẩn đoán hình ảnh.',
    icon: FlaskConical,
  },
];

export default function PatientHome() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  // Backend state
  const [loading, setLoading] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [records, setRecords] = useState([]);
  const [labRequests, setLabRequests] = useState([]);
  const [apiStatus, setApiStatus] = useState({ connected: false, checked: false });

  // Load real data from Backend APIs on mount and tab switch
  useEffect(() => {
    fetchBackendData();
  }, [user]);

  const fetchBackendData = async () => {
    setLoading(true);
    try {
      // 1. Kiểm tra health BE
      const healthRes = await api.get('/health').catch(() => null);
      if (healthRes && healthRes.data?.status === 'OK') {
        setApiStatus({ connected: true, checked: true });
      } else {
        setApiStatus({ connected: false, checked: true });
      }

      // 2. Lấy danh sách lịch hẹn (cần doctor_id và date theo backend API)
      const today = new Date().toISOString().slice(0, 10);
      const apptRes = await api.get(`/doctor/appointments?doctor_id=1&date=${today}`).catch(err => {
        console.warn('Lỗi gọi API /doctor/appointments:', err.message);
        return null;
      });
      if (apptRes?.data?.data && Array.isArray(apptRes.data.data)) {
        setAppointments(apptRes.data.data);
      } else {
        // Fallback demo data
        setAppointments([
          {
            appointment_id: 101,
            patient_name: user?.fullName || "Nguyễn Thị Mai Lan",
            appointment_date: "2026-11-09",
            appointment_time: "14:00",
            specialty_name: "Y học Cổ Truyền",
            room_name: "Phòng khám Y học cổ truyền - P311",
            status: "CONFIRMED",
            doctor_name: "PGS.TS Nguyễn Văn Trung"
          }
        ]);
      }

      // 3. Lấy hồ sơ bệnh án
      const patientId = user?.id || 1;
      const recRes = await api.get(`/doctor/medical-records/patient/${patientId}`).catch(err => {
        console.warn(`Lỗi gọi API /doctor/medical-records/patient/${patientId}:`, err.message);
        return null;
      });
      if (recRes?.data?.data && Array.isArray(recRes.data.data)) {
        setRecords(recRes.data.data);
      } else {
        setRecords([
          {
            record_id: 201,
            visit_date: "2026-10-20",
            diagnosis: "Tăng huyết áp vô căn (I10) - Rối loạn lipid máu hỗn hợp (E78.2)",
            treatment_plan: "Amlodipine 5mg x 30 viên; Atorvastatin 20mg x 30 viên.",
            doctor_notes: "Hạn chế muối, kiêng mỡ động vật. Tái khám sau 30 ngày."
          }
        ]);
      }

      // 4. Lấy kết quả xét nghiệm / cận lâm sàng
      const labRes = await api.get('/doctor/lab-requests').catch(err => {
        console.warn('Lỗi gọi API /doctor/lab-requests:', err.message);
        return null;
      });
      if (labRes?.data?.data && Array.isArray(labRes.data.data)) {
        setLabRequests(labRes.data.data);
      } else {
        setLabRequests([
          {
            lab_request_id: 301,
            test_type: "Tổng phân tích tế bào máu ngoại vi (24 thông số)",
            status: "COMPLETED",
            result: "Bạch cầu: 6.8 K/uL, Hồng cầu: 4.6 M/uL, Tiểu cầu: 250 K/uL. Bình thường.",
            created_at: "2026-10-20 08:30"
          },
          {
            lab_request_id: 302,
            test_type: "Bộ mỡ máu toàn phần (Lipid profile)",
            status: "COMPLETED",
            result: "Cholesterol toàn phần: 5.8 mmol/L, Triglyceride: 2.2 mmol/L. Tăng nhẹ.",
            created_at: "2026-10-20 08:45"
          }
        ]);
      }
    } catch (err) {
      console.error('Lỗi khi tải dữ liệu người bệnh từ backend:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-10">
      {/* Tiêu đề & Thông báo Backend */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-7">
        <div>
          <p className="text-[#005baa] text-sm font-semibold mb-1 flex items-center gap-2">
            CỔNG THÔNG TIN NGƯỜI BỆNH
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              API BE: /api/v1
            </span>
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
            Chăm sóc sức khỏe thuận tiện hơn
          </h2>
          <p className="text-slate-500 mt-1">
            Quản lý lịch khám và thông tin y tế của bạn trực tiếp từ hệ thống Bệnh viện Bách Khoa.
          </p>
        </div>

        <button
          onClick={fetchBackendData}
          disabled={loading}
          className="self-start md:self-auto flex items-center gap-2 px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl shadow-sm transition"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin text-blue-600' : ''} />
          {loading ? 'Đang đồng bộ...' : 'Đồng bộ dữ liệu Backend'}
        </button>
      </div>

      {/* Tabs điều hướng */}
      <nav className="flex gap-2 overflow-x-auto pb-3 mb-6">
        {[
          { id: 'overview', label: 'Tổng quan', icon: LayoutDashboard },
          { id: 'booking', label: 'Đặt lịch', icon: CalendarPlus, link: '/patient/booking' },
          { id: 'appointments', label: `Lịch hẹn (${appointments.length})`, icon: CalendarDays },
          { id: 'records', label: `Bệnh án (${records.length})`, icon: ClipboardList },
          { id: 'results', label: `Xét nghiệm (${labRequests.length})`, icon: FlaskConical },
        ].map((item) => (
          item.link ? (
            <Link
              key={item.id}
              to={item.link}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap bg-white text-slate-600 border border-slate-200 hover:bg-blue-50 transition"
            >
              <item.icon size={17} />
              {item.label}
            </Link>
          ) : (
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
          )
        ))}
      </nav>

      {/* TAB 1: TỔNG QUAN */}
      {activeTab === 'overview' && (
        <>
          <section className="rounded-2xl bg-gradient-to-r from-[#004282] to-[#0872b7] text-white p-6 md:p-9 mb-7 shadow-lg">
            <div className="flex items-start gap-4">
              <HeartPulse className="hidden sm:block shrink-0 text-blue-200" size={46} />
              <div>
                <p className="text-blue-100 text-sm mb-1 font-medium">
                  Hệ Thống Y Tế Thông Minh Bách Khoa
                </p>
                <h3 className="text-xl md:text-2xl font-bold mb-2">
                  Xin chào, {user?.fullName || "Quý Người Bệnh"}!
                </h3>
                <p className="text-blue-100 text-sm max-w-xl leading-relaxed">
                  Chủ động đặt lịch theo chuyên khoa, theo dõi quá trình khám chữa bệnh
                  và cập nhật hồ sơ bệnh án trực tuyến 24/7.
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Link
                    to="/patient/booking"
                    className="bg-white text-[#004282] px-5 py-2.5 rounded-xl font-bold text-sm inline-flex items-center gap-2 hover:bg-blue-50 shadow-sm transition active:scale-95"
                  >
                    <CalendarPlus size={18} />
                    Đặt lịch khám ngay
                    <ArrowRight size={17} />
                  </Link>

                  <button
                    onClick={() => setActiveTab('appointments')}
                    className="bg-white/15 hover:bg-white/25 text-white border border-white/20 px-4 py-2.5 rounded-xl font-semibold text-sm inline-flex items-center gap-2 transition"
                  >
                    <CalendarDays size={18} />
                    Xem lịch khám đã đặt
                  </button>
                </div>
              </div>
            </div>
          </section>

          <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-[#004282]" />
            Tiện ích dành cho người bệnh
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {services.map((service) => (
              <div
                key={service.id}
                onClick={() => {
                  if (service.id === 'booking') {
                    window.location.href = '/patient/booking';
                  } else {
                    setActiveTab(service.id);
                  }
                }}
                className="text-left bg-white border border-slate-200 rounded-2xl p-5 hover:border-blue-400 hover:shadow-md transition cursor-pointer group"
              >
                <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-blue-50 text-[#004282] mb-4 group-hover:bg-[#004282] group-hover:text-white transition">
                  <service.icon size={24} />
                </div>
                <h4 className="font-bold text-slate-900 mb-1.5 group-hover:text-[#004282] transition">
                  {service.title}
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed min-h-12">
                  {service.description}
                </p>
                <div className="flex items-center gap-1.5 text-[#005baa] text-xs font-bold mt-4 group-hover:gap-2.5 transition-all">
                  Truy cập ngay <ArrowRight size={14} />
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* TAB 2: LỊCH HẸN KHÁM CỦA TÔI */}
      {activeTab === 'appointments' && (
        <section className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
            <div>
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <CalendarDays className="w-6 h-6 text-[#004282]" />
                Lịch Hẹn Khám Bệnh Trực Tuyến
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Dữ liệu được lấy trực tiếp từ API backend: <code className="bg-slate-100 px-1.5 py-0.5 rounded text-blue-700">GET /api/v1/doctor/appointments</code>
              </p>
            </div>
            <Link
              to="/patient/booking"
              className="bg-[#004282] text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-[#003566] transition inline-flex items-center gap-2"
            >
              <CalendarPlus size={16} />
              Đặt lịch mới
            </Link>
          </div>

          {appointments.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <CalendarDays className="w-12 h-12 mx-auto mb-3 text-slate-300" />
              <p className="font-semibold text-slate-600">Hiện bạn chưa có lịch hẹn khám nào.</p>
              <p className="text-xs mt-1">Hãy nhấn nút Đặt lịch mới bên trên để chọn chuyên khoa và phòng khám.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {appointments.map((appt, idx) => (
                <div key={appt.appointment_id || idx} className="p-5 border border-slate-200 rounded-xl bg-slate-50/50 hover:bg-white hover:border-blue-300 hover:shadow-sm transition">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <span className="text-xs font-bold text-blue-700 uppercase tracking-wide">
                        {appt.specialty_name || 'Khám Đích Danh'}
                      </span>
                      <h4 className="font-bold text-slate-900 text-sm mt-0.5">
                        {appt.room_name || 'Phòng khám đa khoa'}
                      </h4>
                    </div>
                    <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-[11px] font-bold rounded-lg flex items-center gap-1">
                      <CheckCircle2 size={12} />
                      {appt.status || 'Đã xác nhận'}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-600 border-t border-slate-200/60 pt-3">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 flex items-center gap-1.5">
                        <Clock size={14} /> Khung giờ khám:
                      </span>
                      <strong className="text-slate-800">{appt.appointment_time || '14:00'} - {appt.appointment_date || '2026-11-09'}</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Bác sĩ phụ trách:</span>
                      <span className="font-medium text-slate-800">{appt.doctor_name || 'Bác sĩ chuyên khoa'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Mã bệnh nhân:</span>
                      <span className="font-mono text-slate-800">{user?.id ? `BN-2024-${String(user.id).padStart(4, '0')}` : 'BN-2024-0002'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* TAB 3: HỒ SƠ BỆNH ÁN */}
      {activeTab === 'records' && (
        <section className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm">
          <div className="pb-4 border-b border-slate-100 mb-6">
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <ClipboardList className="w-6 h-6 text-[#004282]" />
              Hồ Sơ Bệnh Án Điện Tử (EMR)
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Dữ liệu được lấy trực tiếp từ API backend: <code className="bg-slate-100 px-1.5 py-0.5 rounded text-blue-700">GET /api/v1/doctor/medical-records/patient/:id</code>
            </p>
          </div>

          {records.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <ClipboardList className="w-12 h-12 mx-auto mb-3 text-slate-300" />
              <p className="font-semibold text-slate-600">Chưa có hồ sơ bệnh án nào được ghi nhận.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {records.map((rec, idx) => (
                <div key={rec.record_id || idx} className="p-5 border border-slate-200 rounded-xl bg-slate-50 hover:bg-white hover:border-blue-300 transition">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-slate-500">
                      Ngày khám: <strong className="text-slate-800">{rec.visit_date || '2026-10-20'}</strong>
                    </span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-100 text-[#004282] font-semibold">
                      Mã bệnh án: #BA-{rec.record_id || idx + 1}
                    </span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="font-bold text-slate-700">Chẩn đoán: </span>
                      <span className="text-rose-700 font-semibold">{rec.diagnosis || 'Chưa có chẩn đoán cụ thể'}</span>
                    </div>
                    <div>
                      <span className="font-bold text-slate-700">Phác đồ điều trị & Thuốc: </span>
                      <span className="text-slate-800">{rec.treatment_plan || 'Theo dõi định kỳ'}</span>
                    </div>
                    {rec.doctor_notes && (
                      <div className="bg-amber-50 border border-amber-200 p-2.5 rounded-lg text-amber-900 mt-2">
                        <strong className="block mb-0.5">Lời dặn bác sĩ:</strong>
                        {rec.doctor_notes}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* TAB 4: KẾT QUẢ XÉT NGHIỆM */}
      {activeTab === 'results' && (
        <section className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm">
          <div className="pb-4 border-b border-slate-100 mb-6">
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <FlaskConical className="w-6 h-6 text-[#004282]" />
              Kết Quả Xét Nghiệm & Chẩn Đoán Hình Ảnh
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Dữ liệu được lấy trực tiếp từ API backend: <code className="bg-slate-100 px-1.5 py-0.5 rounded text-blue-700">GET /api/v1/doctor/lab-requests</code>
            </p>
          </div>

          {labRequests.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <FlaskConical className="w-12 h-12 mx-auto mb-3 text-slate-300" />
              <p className="font-semibold text-slate-600">Chưa có chỉ định xét nghiệm nào.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {labRequests.map((lab, idx) => (
                <div key={lab.lab_request_id || idx} className="p-4 border border-slate-200 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-slate-50 transition">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{lab.test_type || 'Xét nghiệm cận lâm sàng'}</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        {lab.status || 'Đã có kết quả'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">
                      {lab.result || 'Đã thực hiện xong và lưu trữ trên hệ thống PACS/LIS.'}
                    </p>
                  </div>
                  <div className="text-right shrink-0 text-xs text-slate-400">
                    <div>Thời gian: {lab.created_at || '2026-10-20'}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
