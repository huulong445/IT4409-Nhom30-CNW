import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MOCK_QUEUE } from '../../services/mockData';
import { 
  Search, 
  Users, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  FlaskConical
} from 'lucide-react';
import LabResultModal from '../../components/LabResultModal';

const DoctorQueue = () => {
  const navigate = useNavigate();
  const [queue, setQueue] = useState(MOCK_QUEUE);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL'); // 'ALL', 'WAITING', 'LAB_READY', 'WAITING_LAB', 'COMPLETED'
  const [selectedLabTest, setSelectedLabTest] = useState(null);

  // Thống kê số lượng theo quy trình khám
  const stats = {
    total: queue.length,
    waiting: queue.filter(q => q.status === 'WAITING').length,
    inProgress: queue.filter(q => q.status === 'IN_PROGRESS').length,
    labReady: queue.filter(q => q.status === 'LAB_READY').length,
    waitingLab: queue.filter(q => q.status === 'WAITING_LAB').length,
    completed: queue.filter(q => q.status === 'COMPLETED').length,
  };

  const handleStartExam = (patient, isConclusion = false) => {
    const updated = queue.map(p => 
      p.appointmentId === patient.appointmentId 
        ? { ...p, status: 'IN_PROGRESS' } 
        : (p.status === 'IN_PROGRESS' ? { ...p, status: 'WAITING' } : p)
    );
    setQueue(updated);
    navigate('/doctor/exam', { 
      state: { 
        patient: { ...patient, status: 'IN_PROGRESS', isConclusion } 
      } 
    });
  };

  // Đánh dấu vắng mặt (No-show) hoặc phục hồi lượt khám
  const handleToggleNoShow = (appointmentId) => {
    const updated = queue.map(p => {
      if (p.appointmentId === appointmentId) {
        return {
          ...p,
          status: p.status === 'NO_SHOW' ? 'WAITING' : 'NO_SHOW'
        };
      }
      return p;
    });
    setQueue(updated);
  };

  // Bộ lọc dữ liệu tìm kiếm và trạng thái
  const filteredQueue = queue.filter(item => {
    // 1. Lọc theo trạng thái tab
    if (statusFilter === 'WAITING' && item.status !== 'WAITING' && item.status !== 'IN_PROGRESS') {
      return false;
    }
    if (statusFilter === 'LAB_READY' && item.status !== 'LAB_READY') {
      return false;
    }
    if (statusFilter === 'WAITING_LAB' && item.status !== 'WAITING_LAB') {
      return false;
    }
    if (statusFilter === 'COMPLETED' && item.status !== 'COMPLETED') {
      return false;
    }

    // 2. Lọc theo từ khóa tìm kiếm
    const term = searchTerm.toLowerCase().trim();
    if (!term) return true;

    return (
      item.fullName.toLowerCase().includes(term) ||
      item.patientId.toLowerCase().includes(term) ||
      item.queueNumber.toLowerCase().includes(term) ||
      item.phone.includes(term) ||
      (item.reason && item.reason.toLowerCase().includes(term))
    );
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'IN_PROGRESS':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200 animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
            Đang khám
          </span>
        );
      case 'WAITING':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
            Chờ khám
          </span>
        );
      case 'WAITING_LAB':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
            <FlaskConical className="w-3 h-3" />
            Đang làm CLS
          </span>
        );
      case 'LAB_READY':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Đã đủ KQ CLS
          </span>
        );
      case 'NO_SHOW':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
            Vắng mặt
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
            Đã kết luận
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {/* Tiêu đề trang */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-xl font-bold text-slate-800">
            Hàng Đợi Khám Bệnh
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Phòng 204 • PGS.TS.BS Nguyễn Văn Trung • Thứ Ba, 20/10/2026
          </p>
        </div>
        <div className="text-xs text-slate-500 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm flex items-center gap-2">
          <Clock className="w-3.5 h-3.5 text-blue-600" />
          <span>Thời gian tiếp nhận: <strong>07:30 - 17:00</strong></span>
        </div>
      </div>

      {/* Thống kê tiến độ hàng đợi */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div 
          onClick={() => setStatusFilter('ALL')}
          className={`p-3 rounded-xl border cursor-pointer transition ${
            statusFilter === 'ALL' 
              ? 'bg-blue-50/60 border-[#004282] shadow-sm' 
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="text-xs text-slate-500">Tổng bệnh nhân</div>
          <div className="text-xl font-black text-slate-800 mt-1">{stats.total}</div>
        </div>

        <div 
          onClick={() => setStatusFilter('WAITING')}
          className={`p-3 rounded-xl border cursor-pointer transition ${
            statusFilter === 'WAITING' 
              ? 'bg-amber-50/60 border-amber-500 shadow-sm' 
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="text-xs text-amber-700 font-medium">Chờ khám ban đầu</div>
          <div className="text-xl font-black text-amber-800 mt-1">{stats.waiting}</div>
        </div>

        <div className="bg-white p-3 rounded-xl border border-blue-200">
          <div className="text-xs text-blue-700 font-medium">Đang trong phòng khám</div>
          <div className="text-xl font-black text-blue-800 mt-1">{stats.inProgress}</div>
        </div>

        <div 
          onClick={() => setStatusFilter('LAB_READY')}
          className={`p-3 rounded-xl border cursor-pointer transition ${
            statusFilter === 'LAB_READY' 
              ? 'bg-emerald-50/80 border-emerald-500 shadow-sm' 
              : 'bg-white border-emerald-200 hover:border-emerald-400'
          }`}
        >
          <div className="text-xs text-emerald-700 font-bold">Đã có đủ KQ CLS</div>
          <div className="text-xl font-black text-emerald-800 mt-1">{stats.labReady}</div>
        </div>

        <div 
          onClick={() => setStatusFilter('WAITING_LAB')}
          className={`p-3 rounded-xl border cursor-pointer transition ${
            statusFilter === 'WAITING_LAB' 
              ? 'bg-purple-50/80 border-purple-500 shadow-sm' 
              : 'bg-white border-purple-200 hover:border-purple-300'
          }`}
        >
          <div className="text-xs text-purple-700 font-medium">Đang làm CLS</div>
          <div className="text-xl font-black text-purple-800 mt-1">{stats.waitingLab}</div>
        </div>

        <div 
          onClick={() => setStatusFilter('COMPLETED')}
          className={`p-3 rounded-xl border cursor-pointer transition ${
            statusFilter === 'COMPLETED' 
              ? 'bg-slate-100 border-slate-400 shadow-sm' 
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="text-xs text-slate-500">Đã kết luận</div>
          <div className="text-xl font-black text-slate-700 mt-1">{stats.completed}</div>
        </div>
      </div>

      {/* Thanh công cụ tìm kiếm và lọc trạng thái */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-3 shadow-sm">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm theo Tên, Mã BN, SĐT, STT..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#004282] font-medium"
          />
        </div>

        {/* Nút lọc nhanh theo tab duy nhất */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs w-full md:w-auto overflow-x-auto">
          {[
            { id: 'ALL', label: `Tất cả (${stats.total})` },
            { id: 'WAITING', label: `Chờ khám (${stats.waiting + stats.inProgress})` },
            { id: 'LAB_READY', label: `Đủ KQ CLS (${stats.labReady})` },
            { id: 'WAITING_LAB', label: `Đang làm CLS (${stats.waitingLab})` },
            { id: 'COMPLETED', label: `Đã xong (${stats.completed})` }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-md font-semibold whitespace-nowrap transition ${
                statusFilter === tab.id
                  ? 'bg-white text-[#004282] shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* BẢNG 1 HÀNG ĐỢI DUY NHẤT */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm flex flex-col">
        {/* Header bảng */}
        <div className="p-3.5 bg-slate-50/80 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-[#004282]" />
            <h3 className="font-bold text-slate-800 text-sm">
              Danh Sách Bệnh Nhân Tiếp Nhận Phòng Khám 204
            </h3>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-[#004282]">
              {filteredQueue.length} bệnh nhân
            </span>
          </div>

          <div className="text-xs text-slate-500 flex items-center gap-3">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
              {stats.inProgress} đang khám
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              {stats.waiting} chờ lượt
            </span>
          </div>
        </div>

        {/* Bảng dữ liệu duy nhất */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-700 uppercase font-semibold border-b text-[11px] tracking-wider">
              <tr>
                <th className="py-3 px-3.5 w-16 text-center">STT</th>
                <th className="py-3 px-3.5 min-w-[200px]">Bệnh nhân</th>
                <th className="py-3 px-3.5 min-w-[150px]">Khung giờ hẹn</th>
                <th className="py-3 px-3.5 min-w-[220px]">Lý do khám / Tiến độ CLS</th>
                <th className="py-3 px-3.5 w-24">BHYT</th>
                <th className="py-3 px-3.5 text-center w-32">Trạng thái</th>
                <th className="py-3 px-3.5 text-right w-36">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredQueue.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-400">
                    <Users className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                    Không tìm thấy bệnh nhân nào trong hàng đợi phù hợp.
                  </td>
                </tr>
              ) : (
                filteredQueue.map((item) => {
                  const isLabReady = item.status === 'LAB_READY';
                  const isInProgress = item.status === 'IN_PROGRESS';
                  const isWaitingLab = item.status === 'WAITING_LAB';

                  return (
                    <tr 
                      key={item.appointmentId} 
                      className={`hover:bg-blue-50/30 transition-colors ${
                        isInProgress ? 'bg-blue-50/60 font-medium' : isLabReady ? 'bg-emerald-50/30' : item.status === 'NO_SHOW' ? 'opacity-60 bg-slate-50' : ''
                      }`}
                    >
                      {/* Cột 1: Số thứ tự (STT thuần túy, không gắn nhãn ưu tiên/tự do) */}
                      <td className="py-3 px-3.5 text-center">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 font-extrabold text-sm text-[#004282] border border-slate-200">
                          {item.queueNumber}
                        </span>
                      </td>

                      {/* Cột 2: Thông tin Bệnh nhân */}
                      <td className="py-3 px-3.5">
                        <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                          {item.fullName}
                          <span className="font-normal text-slate-500">
                            ({item.gender}, {item.age}t)
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5 font-mono">
                          {item.patientId} • {item.phone}
                        </div>
                        {item.allergies && item.allergies !== 'Không có' && item.allergies !== 'Không rõ' && (
                          <div className="text-[11px] text-red-600 font-semibold mt-0.5 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3 shrink-0" />
                            <span>Dị ứng: {item.allergies}</span>
                          </div>
                        )}
                      </td>

                      {/* Cột 3: Khung giờ hẹn */}
                      <td className="py-3 px-3.5">
                        {item.timeSlot && (
                          <div className="text-slate-800 font-semibold flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                            <span>{item.timeSlot}</span>
                          </div>
                        )}
                        {!item.timeSlot && !isLabReady && (
                          <span className="text-slate-300 font-mono">—</span>
                        )}
                        {isLabReady && (
                          <div className={`text-[11px] text-emerald-700 font-bold ${item.timeSlot ? 'mt-1' : ''}`}>
                            ✓ Đã có đủ KQ CLS
                          </div>
                        )}
                      </td>

                      {/* Cột 4: Lý do khám / Tiến độ xét nghiệm */}
                      <td className="py-3 px-3.5 max-w-xs">
                        {isLabReady ? (
                          <div>
                            <div className="text-emerald-800 font-semibold">
                              {item.labProgress?.summary || 'Đã có đầy đủ kết quả xét nghiệm'}
                            </div>
                            <div className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                              Lý do: {item.reason}
                            </div>
                          </div>
                        ) : isWaitingLab ? (
                          <div>
                            <div className="text-purple-700 font-semibold flex items-center gap-1">
                              <FlaskConical className="w-3 h-3" />
                              {item.labProgress?.summary || 'Đang thực hiện xét nghiệm/chụp chiếu'}
                            </div>
                            <div className="text-[11px] text-slate-400 mt-0.5">
                              Chờ Trung tâm Xét nghiệm trả kết quả
                            </div>
                          </div>
                        ) : (
                          <p className="text-slate-700 line-clamp-2" title={item.reason}>
                            {item.reason}
                          </p>
                        )}
                      </td>

                      {/* Cột 5: BHYT */}
                      <td className="py-3 px-3.5">
                        {item.hasInsurance ? (
                          <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px] font-semibold border border-emerald-200">
                            Có BHYT
                          </span>
                        ) : (
                          <span className="text-slate-500 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                            Tự túc
                          </span>
                        )}
                      </td>

                      {/* Cột 6: Trạng thái */}
                      <td className="py-3 px-3.5 text-center whitespace-nowrap">
                        {getStatusBadge(item.status)}
                      </td>

                      {/* Cột 7: Thao tác */}
                      <td className="py-3 px-3.5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Nút đánh dấu vắng mặt */}
                          {item.status !== 'COMPLETED' && (
                            <button
                              onClick={() => handleToggleNoShow(item.appointmentId)}
                              className={`px-2 py-1 rounded text-xs transition ${
                                item.status === 'NO_SHOW'
                                  ? 'text-slate-700 bg-slate-100 border border-slate-300 hover:bg-slate-200'
                                  : 'text-slate-500 border border-slate-200 hover:text-red-600 hover:border-red-200'
                              }`}
                              title={item.status === 'NO_SHOW' ? 'Phục hồi lượt khám' : 'Báo vắng mặt'}
                            >
                              {item.status === 'NO_SHOW' ? 'Phục hồi' : 'Vắng'}
                            </button>
                          )}

                          {/* Nút hành động chính */}
                          {isLabReady ? (
                            <button
                              onClick={() => handleStartExam(item, true)}
                              className="px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold shadow-sm transition"
                            >
                              Khám kết luận
                            </button>
                          ) : (
                            <button
                              onClick={() => handleStartExam(item)}
                              className={`px-3 py-1 rounded-lg text-xs font-semibold shadow-sm transition ${
                                isInProgress
                                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                  : item.status === 'COMPLETED'
                                  ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                                  : 'bg-[#004282] hover:bg-[#002f5e] text-white'
                              }`}
                            >
                              {isInProgress ? 'Tiếp tục' : item.status === 'COMPLETED' ? 'Xem lại' : 'Khám'}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal xem thông số kết quả CLS (nếu cần xem nhanh) */}
      {selectedLabTest && (
        <LabResultModal
          test={selectedLabTest}
          patient={{ fullName: "Bệnh nhân", patientId: "BN-2024" }}
          onClose={() => setSelectedLabTest(null)}
        />
      )}
    </div>
  );
};

export default DoctorQueue;
