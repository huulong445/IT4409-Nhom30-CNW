import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Activity,
  AlertCircle,
  ArrowRight,
  CalendarDays,
  CalendarPlus,
  CheckCircle2,
  ClipboardList,
  FlaskConical,
  HeartPulse,
  LayoutDashboard,
  RefreshCw,
  ShieldCheck,
  UserRound,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';

const features = [
  {
    id: 'booking',
    title: 'Đặt lịch khám',
    description: 'Xem trước cách chọn chuyên khoa, phòng khám và khung giờ.',
    icon: CalendarPlus,
  },
  {
    id: 'appointments',
    title: 'Lịch khám của tôi',
    description: 'Cần API lấy lịch hẹn theo tài khoản bệnh nhân.',
    icon: CalendarDays,
  },
  {
    id: 'records',
    title: 'Hồ sơ bệnh án',
    description: 'Cần API cho bệnh nhân xem bệnh án của chính mình.',
    icon: ClipboardList,
  },
  {
    id: 'results',
    title: 'Chỉ định xét nghiệm',
    description: 'Cần API cho bệnh nhân theo dõi chỉ định và kết quả.',
    icon: FlaskConical,
  },
];

const unavailableFeatures = {
  appointments: {
    title: 'Lịch hẹn khám bệnh',
    message:
      'Backend hiện chưa có API cho bệnh nhân lấy danh sách lịch hẹn của chính mình. ' +
      'API /doctor/appointments chỉ dành cho bác sĩ và không thể thay thế bằng user_id của bệnh nhân.',
  },
  records: {
    title: 'Hồ sơ bệnh án điện tử',
    message:
      'Backend có API lấy bệnh án theo patient_id, nhưng API đó nằm dưới /doctor và yêu cầu quyền DOCTOR. ' +
      'Cần backend bổ sung endpoint riêng có kiểm tra quyền truy cập hồ sơ của bệnh nhân.',
  },
  results: {
    title: 'Chỉ định và kết quả xét nghiệm',
    message:
      'Backend hiện có API tra cứu chỉ định xét nghiệm dành cho bác sĩ, chưa có endpoint tương ứng ' +
      'cho bệnh nhân. Không thể xác nhận đã có kết quả chỉ từ trạng thái hoặc dữ liệu mẫu.',
  },
};

export default function PatientHome() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [profile, setProfile] = useState(null);
  const [profileStatus, setProfileStatus] = useState('idle');
  const [profileError, setProfileError] = useState('');

  const isPatient = String(user?.role || '').toUpperCase() === 'PATIENT';

  const loadProfile = useCallback(async () => {
    setProfile(null);
    setProfileError('');

    if (!user) {
      setProfileStatus('guest');
      return;
    }
    if (!isPatient) {
      setProfileStatus('wrong-role');
      return;
    }
    if (!localStorage.getItem('token')) {
      setProfileStatus('demo');
      return;
    }

    setProfileStatus('loading');
    try {
      const response = await api.get('/users/profile');
      if (!response.data?.success || !response.data?.data) {
        throw new Error(response.data?.message || 'Phản hồi API không hợp lệ.');
      }
      const data = response.data.data;
      if (String(data.role || '').toUpperCase() !== 'PATIENT') {
        throw new Error('Tài khoản xác thực không có vai trò PATIENT.');
      }
      setProfile(data);
      setProfileStatus('success');
    } catch (error) {
      setProfileStatus('error');
      setProfileError(
        error.response?.data?.message || error.message || 'Không thể lấy thông tin tài khoản.'
      );
    }
  }, [user?.user_id, user?.id, user?.role, isPatient]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const currentFeature = unavailableFeatures[activeTab];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-10 space-y-6">
      <div>
        <div className="flex items-center gap-2 text-[#005baa] text-xs font-bold uppercase tracking-wider">
          <HeartPulse size={18} /> Cổng thông tin người bệnh
        </div>
        <h1 className="mt-2 text-2xl md:text-3xl font-extrabold text-slate-900">
          Chăm sóc sức khỏe thuận tiện hơn
        </h1>
        <p className="mt-2 text-sm text-slate-600 max-w-3xl">
          Xem các chức năng dành cho bệnh nhân. Dữ liệu y tế chỉ được hiển thị khi
          backend cung cấp API và tài khoản có quyền truy cập phù hợp.
        </p>
      </div>

      <nav className="flex gap-2 overflow-x-auto pb-1" aria-label="Các mục thông tin bệnh nhân">
        {[
          { id: 'overview', label: 'Tổng quan', icon: LayoutDashboard },
          { id: 'appointments', label: 'Lịch hẹn', icon: CalendarDays },
          { id: 'records', label: 'Bệnh án', icon: ClipboardList },
          { id: 'results', label: 'Xét nghiệm', icon: FlaskConical },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setActiveTab(id)}
            aria-current={activeTab === id ? 'page' : undefined}
            className={`inline-flex items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
              activeTab === id
                ? 'bg-[#004282] text-white shadow-sm'
                : 'border border-slate-200 bg-white text-slate-700 hover:bg-blue-50'
            }`}
          >
            <Icon size={17} /> {label}
          </button>
        ))}
      </nav>

      {activeTab === 'overview' && (
        <>
          <section className="rounded-2xl bg-gradient-to-r from-[#004282] to-[#0872b7] p-6 md:p-9 text-white shadow-lg">
            <div className="flex items-start gap-4">
              <HeartPulse size={44} className="hidden sm:block shrink-0 text-blue-200" />
              <div>
                <p className="text-blue-100 text-sm font-medium">Hệ thống y tế Bách Khoa</p>
                <h2 className="mt-1 text-xl md:text-2xl font-bold">
                  Xin chào, {profile?.username || (isPatient ? user?.username : null) || 'Quý người bệnh'}!
                </h2>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-blue-100">
                  Giao diện đặt khám và tra cứu thông tin đang được tích hợp với backend.
                  Các khung giờ hiển thị ở trang đặt lịch hiện chỉ mang tính minh họa.
                </p>
                <Link
                  to="/patient/booking"
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-[#004282] shadow-sm hover:bg-blue-50"
                >
                  <CalendarPlus size={18} /> Xem trước giao diện đặt lịch <ArrowRight size={17} />
                </Link>
              </div>
            </div>
          </section>

          <div>
            <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-800">
              <Activity size={20} className="text-[#004282]" /> Tiện ích dành cho người bệnh
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {features.map(({ id, title, description, icon: Icon }) => (
                id === 'booking' ? (
                  <Link
                    key={id}
                    to="/patient/booking"
                    className="group rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:border-blue-400 hover:shadow-md"
                  >
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-[#004282]">
                      <Icon size={24} />
                    </div>
                    <h4 className="font-bold text-slate-900">{title}</h4>
                    <p className="mt-2 min-h-12 text-xs leading-relaxed text-slate-500">{description}</p>
                    <span className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-[#005baa]">
                      Xem giao diện <ArrowRight size={14} />
                    </span>
                  </Link>
                ) : (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setActiveTab(id)}
                    className="group rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:border-blue-400 hover:shadow-md"
                  >
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-[#004282]">
                      <Icon size={24} />
                    </div>
                    <h4 className="font-bold text-slate-900">{title}</h4>
                    <p className="mt-2 min-h-12 text-xs leading-relaxed text-slate-500">{description}</p>
                    <span className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-[#005baa]">
                      Xem trạng thái tích hợp <ArrowRight size={14} />
                    </span>
                  </button>
                )
              ))}
            </div>
          </div>
        </>
      )}

      {currentFeature && (
        <section className="rounded-2xl border border-slate-200 bg-white px-6 py-10 shadow-sm">
          <div className="mx-auto max-w-2xl text-center">
            <ShieldCheck size={42} className="mx-auto mb-4 text-[#004282]" />
            <h2 className="text-xl font-bold text-slate-900">{currentFeature.title}</h2>
            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-800">
              <AlertCircle size={15} /> Chưa được backend hỗ trợ cho tài khoản bệnh nhân
            </div>
            <p className="mt-4 text-sm leading-relaxed text-slate-600">{currentFeature.message}</p>
            <p className="mt-3 text-xs text-slate-500">
              Không có dữ liệu nào được tự tạo để thay thế kết quả từ API.
            </p>
            <Link
              to="/patient/profile"
              className="mt-6 inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-[#004282] hover:bg-blue-50"
            >
              <UserRound size={17} /> Xem hồ sơ tài khoản
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
