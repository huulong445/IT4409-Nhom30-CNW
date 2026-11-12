
import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CalendarDays, Clock3, Stethoscope,
  UserRound, ArrowLeft, Info, CheckCircle2
} from 'lucide-react';
import { MOCK_USERS_LIST } from '../../services/mockData';

const doctors = MOCK_USERS_LIST.filter(
  user => user.role === 'DOCTOR'
);

const timeSlots = [
  '07:30 - 08:00',
  '08:00 - 08:30',
  '08:30 - 09:00',
  '09:00 - 09:30',
  '09:30 - 10:00',
  '10:00 - 10:30',
  '13:30 - 14:00',
  '14:00 - 14:30',
  '14:30 - 15:00',
];

const today = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function PatientBooking() {
  const [doctorId, setDoctorId] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [confirmed, setConfirmed] = useState(false);

  const selectedDoctor = doctors.find(
    doc => String(doc.id) === doctorId
  );

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!selectedDoctor || !date || !time || date < today()) {
      return;
    }

    // Demo frontend: chưa gửi API hay lưu lịch vào database.
    setConfirmed(true);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <Link
        to="/patient"
        className="inline-flex items-center gap-2 text-sm text-[#004282] font-semibold mb-6 hover:underline"
      >
        <ArrowLeft size={17} />
        Quay lại trang bệnh nhân
      </Link>

      <div className="mb-7">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
          Đặt lịch khám trực tuyến
        </h1>
        <p className="text-slate-500 mt-2">
          Lựa chọn bác sĩ và thời gian khám phù hợp.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <form
          onSubmit={handleSubmit}
          onChange={() => setConfirmed(false)}
          className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 space-y-6"
        >
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold mb-3">
              <Stethoscope size={18} className="text-[#004282]" />
              Chọn bác sĩ và chuyên khoa
            </label>

            <select
              value={doctorId}
              onChange={event => setDoctorId(event.target.value)}
              required
              className="w-full border border-slate-300 rounded-xl p-3 text-sm bg-white"
            >
              <option value="">-- Chọn bác sĩ --</option>
              {doctors.map(doc => (
                <option key={doc.id} value={String(doc.id)}>
                  {doc.fullName} - {doc.departmentName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-semibold mb-3">
              <CalendarDays size={18} className="text-[#004282]" />
              Ngày khám
            </label>

            <input
              type="date"
              value={date}
              min={today()}
              onChange={event => setDate(event.target.value)}
              required
              className="w-full border border-slate-300 rounded-xl p-3 text-sm"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-semibold mb-3">
              <Clock3 size={18} className="text-[#004282]" />
              Khung giờ khám (minh họa)
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {timeSlots.map(slot => (
                <button
                  type="button"
                  key={slot}
                  onClick={() => {
                    setTime(slot);
                    setConfirmed(false);
                  }}
                  aria-pressed={time === slot}
                  className={`px-3 py-3 rounded-xl border text-sm transition ${
                    time === slot
                      ? 'bg-[#004282] text-white border-[#004282]'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-blue-400'
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#004282] hover:bg-[#003566] text-white font-semibold py-3 rounded-xl transition"
          >
            Kiểm tra thông tin đặt lịch
          </button>

          {confirmed && (
            <div
              role="status"
              className="bg-green-50 border border-green-200 p-4 rounded-xl text-sm text-green-800 flex items-start gap-2"
            >
              <CheckCircle2 size={20} className="shrink-0" />
              Thông tin hợp lệ. Đây là bản demo;
              lịch khám chưa được tạo trong hệ thống.
            </div>
          )}
        </form>

        <aside className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5">
            <h3 className="font-bold mb-5 flex items-center gap-2">
              <UserRound size={18} className="text-[#004282]" />
              Thông tin lịch khám
            </h3>

            <div className="space-y-4 text-sm">
              <div>
                <p className="text-slate-500 mb-1">Bác sĩ</p>
                <p className="font-semibold">
                  {selectedDoctor?.fullName || 'Chưa chọn'}
                </p>
              </div>

              <div>
                <p className="text-slate-500 mb-1">Chuyên khoa</p>
                <p className="font-semibold">
                  {selectedDoctor?.departmentName || 'Chưa chọn'}
                </p>
              </div>

              <div>
                <p className="text-slate-500 mb-1">Ngày khám</p>
                <p className="font-semibold">{date || 'Chưa chọn'}</p>
              </div>

              <div>
                <p className="text-slate-500 mb-1">Giờ khám</p>
                <p className="font-semibold">{time || 'Chưa chọn'}</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-900 flex gap-2">
            <Info size={20} className="shrink-0" />
            <p>
              Bản thử nghiệm frontend. Danh sách bác sĩ và khung giờ
              chưa được đồng bộ với lịch làm việc thực tế.
              Không nhập thông tin bệnh nhân thật.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
