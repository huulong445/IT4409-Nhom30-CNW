import React, { useState } from 'react';
import { 
  Calendar, 
  Printer, 
  ArrowRightLeft, 
  CheckCircle2, 
  Search,
  Check,
  X
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const ParaclinicalSchedule = () => {
  const { user } = useAuth();
  const [filterType, setFilterType] = useState('ALL'); // 'ALL', 'TODAY', 'NIGHT'
  const [exchangeModalOpen, setExchangeModalOpen] = useState(false);
  const [selectedShift, setSelectedShift] = useState(null);
  const [exchangeSuccess, setExchangeSuccess] = useState(false);

  const scheduleList = [
    {
      id: 1,
      dayOfWeek: "Thứ Hai",
      dateStr: "19/10/2026",
      shiftName: "Ca sáng",
      time: "07:30 - 12:00",
      shiftType: "MORNING",
      room: "Phòng Kỹ thuật Sinh hóa - Tầng 1, Tòa C",
      department: "Trung tâm Xét nghiệm",
      task: "Trực phân tích mẫu sinh hóa máu tự động & duyệt kết quả",
      technicians: "KTV. Nguyễn Phương Thảo, KTV. Trần Minh Đức",
      status: "COMPLETED",
      statusText: "Đã hoàn thành",
      isToday: false,
    },
    {
      id: 2,
      dayOfWeek: "Thứ Ba",
      dateStr: "20/10/2026",
      shiftName: "Cả ngày",
      time: "07:30 - 16:30",
      shiftType: "FULL_DAY",
      room: "Phòng CT-Scanner 128 dãy & MRI 3.0T - Tầng B1, Tòa A2",
      department: "Khoa Chẩn đoán hình ảnh",
      task: "Đọc và hội chẩn kết quả chụp CLVT lồng ngực, sọ não và MRI",
      technicians: "KTV. Phạm Quốc Hưng, KTV. Lê Thị Kim",
      status: "IN_PROGRESS",
      statusText: "Đang trực",
      isToday: true,
    },
    {
      id: 3,
      dayOfWeek: "Thứ Tư",
      dateStr: "21/10/2026",
      shiftName: "Ca chiều",
      time: "13:30 - 17:00",
      shiftType: "AFTERNOON",
      room: "Phòng Siêu âm Doppler 03 - Tầng 2, Tòa C",
      department: "Khoa Thăm dò chức năng",
      task: "Thực hiện siêu âm Doppler tim mạch và siêu âm ổ bụng tổng quát",
      technicians: "KTV. Vũ Hoàng Nam",
      status: "UPCOMING",
      statusText: "Sắp tới",
      isToday: false,
    },
    {
      id: 4,
      dayOfWeek: "Thứ Năm",
      dateStr: "22/10/2026",
      shiftName: "Ca sáng",
      time: "07:30 - 12:00",
      shiftType: "MORNING",
      room: "Phòng Miễn dịch & Sinh học phân tử - Tầng 1, Tòa C",
      department: "Trung tâm Xét nghiệm",
      task: "Phân tích mẫu PCR và ký duyệt kết quả miễn dịch tự động",
      technicians: "KTV. Nguyễn Phương Thảo",
      status: "UPCOMING",
      statusText: "Sắp tới",
      isToday: false,
    },
    {
      id: 5,
      dayOfWeek: "Thứ Sáu",
      dateStr: "23/10/2026",
      shiftName: "Trực đêm cấp cứu",
      time: "17:00 - 07:30 (+1)",
      shiftType: "NIGHT",
      room: "Khu Kỹ thuật CLS Cấp cứu 24/7 - Tầng 1, Tòa A1",
      department: "Khối Cận lâm sàng Cấp cứu",
      task: "Trực kỹ thuật cấp cứu toàn viện: X-quang, CT cấp cứu và xét nghiệm STAT",
      technicians: "KTV. Hoàng Tuấn Anh, KTV. Đỗ Mai Anh",
      status: "UPCOMING",
      statusText: "Sắp tới",
      isToday: false,
    },
    {
      id: 6,
      dayOfWeek: "Thứ Bảy",
      dateStr: "24/10/2026",
      shiftName: "Ca sáng",
      time: "07:30 - 11:30",
      shiftType: "MORNING",
      room: "Phòng Đọc phim & Ký số - Tầng B1, Tòa A2",
      department: "Khoa Chẩn đoán hình ảnh",
      task: "Hội chẩn trực tuyến ca khó và ký số chứng thực kết quả CĐHA",
      technicians: "KTV. Trần Minh Đức",
      status: "UPCOMING",
      statusText: "Sắp tới",
      isToday: false,
    },
  ];

  const filteredSchedule = scheduleList.filter(item => {
    if (filterType === 'TODAY') return item.isToday;
    if (filterType === 'NIGHT') return item.shiftType === 'NIGHT';
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
            Đang trực
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
          <span>Đã gửi yêu cầu đổi ca trực thành công. Chờ lãnh đạo duyệt.</span>
        </div>
      )}

      {/* Header gọn gàng, chuẩn y tế */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-slate-900">
              Lịch trực phòng kỹ thuật & Cận lâm sàng
            </h1>
            <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-700 border border-slate-200 rounded">
              Tuần 43/2026
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Bác sĩ: <strong className="text-slate-700">{user?.fullName || "BS CKI. Lê Thị Hải Hà"}</strong> • Khoa: <span className="text-slate-700">{user?.departmentName || "Trung tâm Cận lâm sàng & Chẩn đoán hình ảnh"}</span>
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

      {/* Thanh điều khiển & lọc tối giản */}
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
            Tất cả ({scheduleList.length})
          </button>
          <button
            onClick={() => setFilterType('TODAY')}
            className={`px-3 py-1 rounded border transition ${
              filterType === 'TODAY'
                ? 'bg-slate-800 text-white border-slate-800 font-medium'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
            }`}
          >
            Ca hôm nay ({scheduleList.filter(s => s.isToday).length})
          </button>
          <button
            onClick={() => setFilterType('NIGHT')}
            className={`px-3 py-1 rounded border transition ${
              filterType === 'NIGHT'
                ? 'bg-slate-800 text-white border-slate-800 font-medium'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
            }`}
          >
            Trực đêm cấp cứu ({scheduleList.filter(s => s.shiftType === 'NIGHT').length})
          </button>
        </div>

        <div className="text-slate-500">
          Tổng số: <strong>{filteredSchedule.length}</strong> ca trực trong tuần
        </div>
      </div>

      {/* Bảng phân công ca trực chuẩn mực, rõ ràng, chính xác */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700 border-collapse">
            <thead className="bg-slate-50 text-slate-700 uppercase font-semibold border-b border-slate-200 text-[11px]">
              <tr>
                <th className="py-2.5 px-3 w-32">Thứ / Ngày</th>
                <th className="py-2.5 px-3 w-36">Ca trực / Giờ</th>
                <th className="py-2.5 px-3 w-56">Phòng kỹ thuật & Khoa</th>
                <th className="py-2.5 px-3 min-w-[240px]">Nhiệm vụ phân công</th>
                <th className="py-2.5 px-3 w-48">Kỹ thuật viên phối hợp</th>
                <th className="py-2.5 px-3 w-28 text-center">Trạng thái</th>
                <th className="py-2.5 px-3 w-24 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSchedule.map((item) => (
                <tr 
                  key={item.id} 
                  className={`hover:bg-slate-50/80 transition ${
                    item.isToday ? 'bg-blue-50/30' : ''
                  }`}
                >
                  {/* Thứ / Ngày */}
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

                  {/* Ca trực / Giờ */}
                  <td className="py-3 px-3 align-top">
                    <div className="font-semibold text-slate-800">{item.shiftName}</div>
                    <div className="text-slate-500 text-[11px] mt-0.5">{item.time}</div>
                  </td>

                  {/* Phòng kỹ thuật & Khoa */}
                  <td className="py-3 px-3 align-top">
                    <div className="font-medium text-slate-900">{item.room}</div>
                    <div className="text-slate-500 text-[11px] mt-0.5">{item.department}</div>
                  </td>

                  {/* Nhiệm vụ phân công */}
                  <td className="py-3 px-3 align-top text-slate-800 leading-relaxed">
                    {item.task}
                  </td>

                  {/* KTV phối hợp */}
                  <td className="py-3 px-3 align-top text-slate-600 text-[11px]">
                    {item.technicians}
                  </td>

                  {/* Trạng thái */}
                  <td className="py-3 px-3 align-top text-center">
                    {getStatusBadge(item.status)}
                  </td>

                  {/* Thao tác */}
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

      {/* Modal đề xuất đổi ca trực - thiết kế tối giản, nhanh, hiệu quả */}
      {exchangeModalOpen && selectedShift && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-slate-300 shadow-lg w-full max-w-md overflow-hidden">
            <div className="px-4 py-3 bg-slate-100 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-semibold text-slate-800 text-sm flex items-center gap-2">
                <ArrowRightLeft className="w-4 h-4 text-slate-600" />
                Đề xuất đổi ca trực
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
                <div className="text-slate-500 text-[11px] mt-0.5">{selectedShift.room}</div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Bác sĩ nhận đổi ca:
                </label>
                <select className="w-full border border-slate-300 rounded p-2 bg-white text-slate-800 focus:outline-none focus:border-slate-500">
                  <option>BS CKI. Nguyễn Văn Hoàng (Trung tâm Xét nghiệm)</option>
                  <option>ThS.BS. Đỗ Thị Thu Hiền (Khoa CĐHA)</option>
                  <option>BS. Vũ Tiến Đạt (Khoa Thăm dò chức năng)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Lý do xin đổi ca:
                </label>
                <textarea 
                  rows={3} 
                  required
                  placeholder="Nhập lý do đổi ca (công tác, lịch hội chẩn...)" 
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

export default ParaclinicalSchedule;
