import React, { useState } from 'react';
import { Calendar, Printer, ArrowRightLeft, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const DoctorSchedule = () => {
  const { user } = useAuth();
  const [filterType, setFilterType] = useState('ALL');
  const [exchangeModalOpen, setExchangeModalOpen] = useState(false);
  const [selectedShift, setSelectedShift] = useState(null);
  const [exchangeSuccess, setExchangeSuccess] = useState(false);

  if (user?.role === 'PARACLINICAL') {
    return <Navigate to="/paraclinical/schedule" replace />;
  }

  const schedule = [
    { 
      id: 1, 
      dayOfWeek: "Thứ Hai", 
      dateStr: "19/10/2026", 
      shiftName: "Ca sáng", 
      time: "07:30 - 12:00", 
      room: "Phòng 204 - Tầng 2, Nhà A2", 
      task: "Khám chuyên khoa Nội Tim Mạch", 
      status: "COMPLETED", 
      statusText: "Đã hoàn thành", 
      isToday: false 
    },
    { 
      id: 2, 
      dayOfWeek: "Thứ Ba", 
      dateStr: "20/10/2026", 
      shiftName: "Cả ngày", 
      time: "07:30 - 16:30", 
      room: "Phòng 204 - Tầng 2, Nhà A2", 
      task: "Khám Tổng hợp & Tăng huyết áp", 
      status: "IN_PROGRESS", 
      statusText: "Đang khám", 
      isToday: true 
    },
    { 
      id: 3, 
      dayOfWeek: "Thứ Tư", 
      dateStr: "21/10/2026", 
      shiftName: "Ca chiều", 
      time: "13:30 - 17:00", 
      room: "Phòng Hội chẩn - Tầng 5, Nhà A1", 
      task: "Hội chẩn ca bệnh tim mạch nặng liên viện", 
      status: "UPCOMING", 
      statusText: "Sắp tới", 
      isToday: false 
    },
    { 
      id: 4, 
      dayOfWeek: "Thứ Năm", 
      dateStr: "22/10/2026", 
      shiftName: "Ca sáng", 
      time: "07:30 - 12:00", 
      room: "Phòng 204 - Tầng 2, Nhà A2", 
      task: "Khám chuyên gia theo yêu cầu", 
      status: "UPCOMING", 
      statusText: "Sắp tới", 
      isToday: false 
    },
    { 
      id: 5, 
      dayOfWeek: "Thứ Sáu", 
      dateStr: "23/10/2026", 
      shiftName: "Ca sáng", 
      time: "07:30 - 12:00", 
      room: "Giảng đường B3 - ĐHYHN", 
      task: "Giảng dạy lâm sàng sinh viên Y5 - Module Tim mạch", 
      status: "UPCOMING", 
      statusText: "Sắp tới", 
      isToday: false 
    },
  ];

  const filtered = schedule.filter(item => {
    if (filterType === 'TODAY') return item.isToday;
    return true;
  });

  const handleOpenExchange = (shift) => {
    setSelectedShift(shift);
    setExchangeModalOpen(true);
  };

  const handleSubmitExchange = (e) => {
    e.preventDefault();
    setExchangeModalOpen(false);
    setExchangeSuccess(true);
    setTimeout(() => setExchangeSuccess(false), 3000);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'IN_PROGRESS':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-800 border border-blue-200">
            Đang khám
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
            Đã hoàn thành
          </span>
        );
      case 'UPCOMING':
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200">
            Sắp tới
          </span>
        );
    }
  };

  return (
    <div className="space-y-4 max-w-7xl mx-auto">
      {/* Toast thông báo */}
      {exchangeSuccess && (
        <div className="fixed top-4 right-4 z-50 bg-slate-900 text-white text-xs px-4 py-3 rounded border border-slate-700 shadow-md flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Đã gửi yêu cầu đổi ca trực lâm sàng thành công. Chờ lãnh đạo duyệt.</span>
        </div>
      )}

      {/* Header gọn gàng */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-slate-900">
              Lịch trực khám lâm sàng & Giảng dạy
            </h1>
            <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-700 border border-slate-200 rounded">
              Tuần 43/2026
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Bác sĩ: <strong className="text-slate-700">{user?.fullName || "PGS.TS.BS Nguyễn Văn Trung"}</strong> • Khoa: <span className="text-slate-700">{user?.departmentName || "Khoa Khám bệnh - Nội Tổng Hợp"}</span>
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => window.print()}
            className="px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 rounded text-xs font-medium flex items-center gap-1.5 transition"
          >
            <Printer className="w-3.5 h-3.5" />
            In lịch trực
          </button>
        </div>
      </div>

      {/* Bộ lọc tối giản */}
      <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
        <div className="flex items-center gap-1.5">
          <span className="text-slate-500 font-medium mr-1">Bộ lọc:</span>
          <button
            onClick={() => setFilterType('ALL')}
            className={`px-3 py-1 rounded border transition ${
              filterType === 'ALL'
                ? 'bg-slate-800 text-white border-slate-800 font-medium'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
            }`}
          >
            Tất cả ({schedule.length})
          </button>
          <button
            onClick={() => setFilterType('TODAY')}
            className={`px-3 py-1 rounded border transition ${
              filterType === 'TODAY'
                ? 'bg-slate-800 text-white border-slate-800 font-medium'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
            }`}
          >
            Hôm nay ({schedule.filter(s => s.isToday).length})
          </button>
        </div>

        <div className="text-slate-500">
          Tổng số: <strong>{filtered.length}</strong> ca phân công trong tuần
        </div>
      </div>

      {/* Bảng phân ca trực lâm sàng */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700 border-collapse">
            <thead className="bg-slate-50 text-slate-700 uppercase font-semibold border-b border-slate-200 text-[11px]">
              <tr>
                <th className="py-2.5 px-3 w-32">Thứ / Ngày</th>
                <th className="py-2.5 px-3 w-36">Ca trực / Giờ</th>
                <th className="py-2.5 px-3 w-56">Phòng khám / Địa điểm</th>
                <th className="py-2.5 px-3">Nội dung nhiệm vụ</th>
                <th className="py-2.5 px-3 w-28 text-center">Trạng thái</th>
                <th className="py-2.5 px-3 w-24 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((item) => (
                <tr 
                  key={item.id} 
                  className={`hover:bg-slate-50/80 transition ${
                    item.isToday ? 'bg-blue-50/30' : ''
                  }`}
                >
                  <td className="py-3 px-3 align-top font-medium">
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-900 font-semibold">{item.dayOfWeek}</span>
                      {item.isToday && (
                        <span className="text-[10px] bg-blue-600 text-white px-1.5 py-0.2 rounded font-bold">
                          HÔM NAY
                        </span>
                      )}
                    </div>
                    <div className="text-slate-500 text-[11px] mt-0.5">{item.dateStr}</div>
                  </td>

                  <td className="py-3 px-3 align-top">
                    <div className="font-semibold text-slate-800">{item.shiftName}</div>
                    <div className="text-slate-500 text-[11px] mt-0.5">{item.time}</div>
                  </td>

                  <td className="py-3 px-3 align-top">
                    <div className="font-medium text-slate-900">{item.room}</div>
                  </td>

                  <td className="py-3 px-3 align-top text-slate-800 leading-relaxed font-medium">
                    {item.task}
                  </td>

                  <td className="py-3 px-3 align-top text-center">
                    {getStatusBadge(item.status)}
                  </td>

                  <td className="py-3 px-3 align-top text-right">
                    {item.status === 'UPCOMING' ? (
                      <button
                        onClick={() => handleOpenExchange(item)}
                        className="text-xs font-medium text-slate-700 hover:text-blue-700 hover:underline inline-flex items-center gap-1"
                        title="Đề xuất đổi ca trực"
                      >
                        <ArrowRightLeft className="w-3 h-3" />
                        Đổi ca
                      </button>
                    ) : (
                      <span className="text-slate-400 text-[11px]">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal đề xuất đổi ca trực lâm sàng */}
      {exchangeModalOpen && selectedShift && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-slate-300 shadow-lg w-full max-w-md overflow-hidden">
            <div className="px-4 py-3 bg-slate-100 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-semibold text-slate-800 text-sm flex items-center gap-2">
                <ArrowRightLeft className="w-4 h-4 text-slate-600" />
                Đề xuất đổi ca trực lâm sàng
              </h3>
              <button 
                onClick={() => setExchangeModalOpen(false)}
                className="text-slate-500 hover:text-slate-800 text-sm font-bold p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitExchange} className="p-4 space-y-3 text-xs">
              <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                <div className="font-semibold text-slate-800">
                  {selectedShift.dayOfWeek} ({selectedShift.dateStr}) — {selectedShift.shiftName} ({selectedShift.time})
                </div>
                <div className="text-slate-500 text-[11px] mt-0.5">{selectedShift.room} • {selectedShift.task}</div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Bác sĩ nhận đổi ca cùng:
                </label>
                <select className="w-full border border-slate-300 rounded p-2 bg-white text-slate-800 focus:outline-none focus:border-slate-500">
                  <option>BS CKII. Trần Tuấn Anh (Khoa Tim Mạch)</option>
                  <option>ThS.BS. Phạm Thu Hương (Khoa Nội Tổng Hợp)</option>
                  <option>BS CKI. Vũ Đình Long (Khoa Tiêu Hóa - Gan Mật)</option>
                  <option>TS.BS. Hoàng Mai Anh (Khoa Khám Bệnh)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Lý do xin đổi ca trực:
                </label>
                <textarea 
                  rows={3} 
                  required
                  placeholder="Nhập lý do đổi ca (công tác giảng dạy, hội chẩn liên viện, việc đột xuất...)" 
                  className="w-full border border-slate-300 rounded p-2 text-slate-800 focus:outline-none focus:border-slate-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setExchangeModalOpen(false)}
                  className="px-3 py-1.5 border border-slate-300 text-slate-700 rounded hover:bg-slate-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded font-medium"
                >
                  Gửi yêu cầu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorSchedule;
