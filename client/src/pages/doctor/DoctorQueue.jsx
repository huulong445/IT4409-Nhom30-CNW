import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MOCK_QUEUE } from '../../services/mockData';
import { Search } from 'lucide-react';
import LabResultModal from '../../components/LabResultModal';

const DoctorQueue = () => {
  const navigate = useNavigate();
  const [queue, setQueue] = useState(MOCK_QUEUE);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('ALL_FLOWS'); // 'INITIAL', 'LAB_READY', 'WAITING_LAB', 'ALL_FLOWS'
  const [selectedLabTest, setSelectedLabTest] = useState(null);

  // 1. Hàng đợi khám lâm sàng ban đầu (Chưa làm CLS)
  const initialPriorityQueue = queue.filter(
    item => item.patientType === 'PRIORITY' && item.status !== 'LAB_READY' && item.status !== 'WAITING_LAB'
  );
  const initialWalkinQueue = queue.filter(
    item => item.patientType === 'WALK_IN' && item.status !== 'LAB_READY' && item.status !== 'WAITING_LAB'
  );

  // 2. Hàng đợi ĐÃ CÓ ĐỦ KẾT QUẢ CLS (Chờ bác sĩ khám tổng kết & kê đơn)
  const labReadyQueue = queue.filter(item => item.status === 'LAB_READY');

  // 3. Danh sách Đang thực hiện CLS (Đang chờ phòng xét nghiệm / CĐHA trả kết quả)
  const waitingLabQueue = queue.filter(item => item.status === 'WAITING_LAB');

  // Thống kê số lượng theo quy trình khám
  const stats = {
    total: queue.length + 18,
    waitingInitial: initialPriorityQueue.filter(q => q.status === 'WAITING').length + 
                    initialWalkinQueue.filter(q => q.status === 'WAITING').length,
    waitingLab: waitingLabQueue.length,
    labReady: labReadyQueue.length,
    inProgress: queue.filter(q => q.status === 'IN_PROGRESS').length,
    completed: queue.filter(q => q.status === 'COMPLETED').length + 10
  };

  const handleStartExam = (patient, isConclusion = false) => {
    const updated = queue.map(p => 
      p.appointmentId === patient.appointmentId 
        ? { ...p, status: 'IN_PROGRESS' } 
        : (p.status === 'IN_PROGRESS' ? { ...p, status: p.status === 'IN_PROGRESS' ? 'WAITING' : p.status } : p)
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

  const filterList = (list) => {
    return list.filter(item => {
      const term = searchTerm.toLowerCase();
      return (
        item.fullName.toLowerCase().includes(term) ||
        item.patientId.toLowerCase().includes(term) ||
        item.queueNumber.toLowerCase().includes(term) ||
        item.phone.includes(term)
      );
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'IN_PROGRESS':
        return <span className="px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">Đang khám</span>;
      case 'WAITING':
        return <span className="px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">Chờ khám</span>;
      case 'WAITING_LAB':
        return <span className="px-2 py-0.5 rounded text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200">Đang làm CLS</span>;
      case 'LAB_READY':
        return <span className="px-2 py-0.5 rounded text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">Đã đủ KQ CLS</span>;
      case 'NO_SHOW':
        return <span className="px-2 py-0.5 rounded text-xs font-medium bg-red-50 text-red-700 border border-red-200">Vắng mặt</span>;
      case 'COMPLETED':
        return <span className="px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">Đã kết luận</span>;
      default:
        return null;
    }
  };

  // Render bảng hàng đợi khám ban đầu
  const renderInitialQueueTable = (items, title, subTitle, showTimeSlot = true) => {
    const filtered = filterList(items);

    return (
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden flex flex-col">
        {/* Header bảng */}
        <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-slate-800 text-sm">
              {title}
              <span className="ml-2 px-2 py-0.5 rounded text-xs font-medium bg-slate-200 text-slate-700">
                {items.filter(i => i.status !== 'COMPLETED').length} bệnh nhân
              </span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">{subTitle}</p>
          </div>
          <div className="text-xs text-slate-500">
            {items.filter(i => i.status === 'WAITING').length} đang chờ
          </div>
        </div>

        {/* Bảng dữ liệu */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-700 uppercase font-semibold border-b text-[11px]">
              <tr>
                <th className="py-2.5 px-3 w-16 text-center">STT</th>
                <th className="py-2.5 px-3">Bệnh nhân</th>
                {showTimeSlot && <th className="py-2.5 px-3">Khung giờ hẹn</th>}
                <th className="py-2.5 px-3">Lý do khám</th>
                <th className="py-2.5 px-3">BHYT</th>
                <th className="py-2.5 px-3 text-center">Trạng thái</th>
                <th className="py-2.5 px-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={showTimeSlot ? 7 : 6} className="py-6 text-center text-slate-400">
                    Không có bệnh nhân trong danh sách này.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr 
                    key={item.appointmentId} 
                    className={`hover:bg-slate-50 transition-colors ${
                      item.status === 'IN_PROGRESS' ? 'bg-blue-50/40' : item.status === 'NO_SHOW' ? 'opacity-60 bg-slate-50' : ''
                    }`}
                  >
                    <td className="py-3 px-3 text-center">
                      <span className="font-semibold text-slate-800">
                        {item.queueNumber}
                      </span>
                    </td>

                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-900 text-xs">
                        {item.fullName}
                        <span className="font-normal text-slate-500 ml-1">
                          ({item.gender}, {item.age}t)
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5 font-mono">
                        {item.patientId} • {item.phone}
                      </div>
                      {item.allergies && item.allergies !== 'Không có' && (
                        <div className="text-[11px] text-red-600 font-medium mt-0.5">
                          Lưu ý: {item.allergies}
                        </div>
                      )}
                    </td>

                    {showTimeSlot && (
                      <td className="py-3 px-3">
                        <div className="text-slate-800 font-medium">
                          {item.timeSlot}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          {item.priorityReason}
                        </div>
                      </td>
                    )}

                    <td className="py-3 px-3 max-w-xs">
                      <p className="text-slate-700 line-clamp-2" title={item.reason}>
                        {item.reason}
                      </p>
                    </td>

                    <td className="py-3 px-3">
                      {item.hasInsurance ? (
                        <span className="text-slate-700">Có BHYT</span>
                      ) : (
                        <span className="text-slate-400">Tự túc</span>
                      )}
                    </td>

                    <td className="py-3 px-3 text-center whitespace-nowrap">
                      {getStatusBadge(item.status)}
                    </td>

                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleToggleNoShow(item.appointmentId)}
                          className={`px-2 py-1 rounded text-xs transition ${
                            item.status === 'NO_SHOW'
                              ? 'text-slate-700 bg-slate-100 border border-slate-300 hover:bg-slate-200'
                              : 'text-slate-500 border border-slate-200 hover:text-red-600'
                          }`}
                        >
                          {item.status === 'NO_SHOW' ? 'Phục hồi' : 'Vắng mặt'}
                        </button>

                        <button
                          onClick={() => handleStartExam(item)}
                          className="px-3 py-1 bg-[#004282] hover:bg-[#002f5e] text-white rounded text-xs font-medium transition"
                        >
                          {item.status === 'IN_PROGRESS' ? 'Tiếp tục' : 'Khám'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // Render bảng bệnh nhân ĐÃ CÓ ĐỦ KẾT QUẢ CLS (Chờ khám tổng kết)
  const renderLabReadyTable = () => {
    const filtered = filterList(labReadyQueue);

    return (
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden flex flex-col">
        <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-slate-800 text-sm">
              Danh Sách Đã Có Đầy Đủ Kết Quả Cận Lâm Sàng (Chờ Khám Tổng Kết)
              <span className="ml-2 px-2 py-0.5 rounded text-xs font-medium bg-emerald-100 text-emerald-800">
                {labReadyQueue.length} bệnh nhân sẵn sàng kết luận
              </span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Bệnh nhân đã làm xong toàn bộ xét nghiệm & chẩn đoán hình ảnh, quay lại buồng khám để bác sĩ kết luận và kê đơn
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-700 uppercase font-semibold border-b text-[11px]">
              <tr>
                <th className="py-2.5 px-3 w-16 text-center">STT</th>
                <th className="py-2.5 px-3">Bệnh nhân</th>
                <th className="py-2.5 px-3">Kết quả CLS đã hoàn thành</th>
                <th className="py-2.5 px-3">Thời gian nhận đủ KQ</th>
                <th className="py-2.5 px-3">BHYT</th>
                <th className="py-2.5 px-3 text-center">Trạng thái</th>
                <th className="py-2.5 px-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-6 text-center text-slate-400">
                    Hiện chưa có bệnh nhân nào đang chờ kết luận kết quả CLS.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.appointmentId} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-3 text-center">
                      <span className="font-semibold text-slate-800">{item.queueNumber}</span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-900 text-xs">
                        {item.fullName}
                        <span className="font-normal text-slate-500 ml-1">({item.gender}, {item.age}t)</span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5 font-mono">{item.patientId} • {item.phone}</div>
                      {item.allergies && item.allergies !== 'Không có' && (
                        <div className="text-[11px] text-red-600 font-medium mt-0.5">Lưu ý: {item.allergies}</div>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      <div className="text-slate-800 font-medium">
                        {item.labProgress?.summary || 'Đã có đầy đủ kết quả xét nghiệm'}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Chẩn đoán sơ bộ: {item.reason}
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="text-slate-700 font-mono">{item.labProgress?.completedAt || '09:15'}</span>
                    </td>
                    <td className="py-3 px-3">
                      {item.hasInsurance ? <span className="text-slate-700">Có BHYT</span> : <span className="text-slate-400">Tự túc</span>}
                    </td>
                    <td className="py-3 px-3 text-center whitespace-nowrap">
                      {getStatusBadge(item.status)}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => handleStartExam(item, true)}
                        className="px-3 py-1.5 bg-[#004282] hover:bg-[#002f5e] text-white rounded text-xs font-semibold shadow-sm transition"
                      >
                        Khám tổng kết & Kê đơn
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // Render bảng bệnh nhân ĐANG LÀM CLS (Chờ phòng xét nghiệm trả kết quả)
  const renderWaitingLabTable = () => {
    const filtered = filterList(waitingLabQueue);

    return (
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden flex flex-col">
        <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-slate-800 text-sm">
              Danh Sách Đang Thực Hiện Cận Lâm Sàng (Theo Dõi Tiến Độ Phòng Xét Nghiệm)
              <span className="ml-2 px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                {waitingLabQueue.length} bệnh nhân đang làm CLS
              </span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Theo dõi tiến độ trả kết quả từ Trung tâm Xét nghiệm & Khoa Chẩn đoán hình ảnh
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-700 uppercase font-semibold border-b text-[11px]">
              <tr>
                <th className="py-2.5 px-3 w-16 text-center">STT</th>
                <th className="py-2.5 px-3">Bệnh nhân</th>
                <th className="py-2.5 px-3">Tiến độ thực hiện dịch vụ</th>
                <th className="py-2.5 px-3">Thời gian chỉ định</th>
                <th className="py-2.5 px-3">BHYT</th>
                <th className="py-2.5 px-3 text-center">Trạng thái</th>
                <th className="py-2.5 px-3 text-right">Ghi chú</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-6 text-center text-slate-400">
                    Hiện không có bệnh nhân nào đang thực hiện xét nghiệm.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.appointmentId} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-3 text-center">
                      <span className="font-semibold text-slate-800">{item.queueNumber}</span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-900 text-xs">
                        {item.fullName}
                        <span className="font-normal text-slate-500 ml-1">({item.gender}, {item.age}t)</span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5 font-mono">{item.patientId} • {item.phone}</div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="text-slate-800 font-medium">
                        {item.labProgress?.summary || 'Đang thực hiện các chỉ định CLS'}
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="text-slate-700 font-mono">{item.labProgress?.orderedAt || item.checkinTime}</span>
                    </td>
                    <td className="py-3 px-3">
                      {item.hasInsurance ? <span className="text-slate-700">Có BHYT</span> : <span className="text-slate-400">Tự túc</span>}
                    </td>
                    <td className="py-3 px-3 text-center whitespace-nowrap">
                      {getStatusBadge(item.status)}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <span className="text-xs text-purple-700 bg-purple-50 px-2 py-1 rounded border border-purple-200">
                        Chờ trả kết quả
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Tiêu đề trang */}
      <div>
        <h2 className="text-xl font-bold text-slate-800">
          Hàng Đợi Khám Bệnh
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Phòng 204 • PGS.TS.BS Nguyễn Văn Trung • Thứ Ba, 20/10/2026
        </p>
      </div>

      {/* Thống kê đơn giản theo quy trình khám */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white p-3 rounded-lg border border-slate-200">
          <div className="text-xs text-slate-500">Tổng đăng ký</div>
          <div className="text-xl font-bold text-slate-800 mt-1">{stats.total}</div>
        </div>

        <div className="bg-white p-3 rounded-lg border border-slate-200">
          <div className="text-xs text-slate-500">Chờ khám ban đầu</div>
          <div className="text-xl font-bold text-slate-800 mt-1">{stats.waitingInitial}</div>
        </div>

        <div className="bg-white p-3 rounded-lg border border-purple-200 bg-purple-50/20">
          <div className="text-xs text-purple-700 font-medium">Đang làm CLS</div>
          <div className="text-xl font-bold text-purple-800 mt-1">{stats.waitingLab}</div>
        </div>

        <div className="bg-white p-3 rounded-lg border border-emerald-300 bg-emerald-50/30">
          <div className="text-xs text-emerald-700 font-bold">Đã có đủ KQ CLS</div>
          <div className="text-xl font-black text-emerald-800 mt-1">{stats.labReady}</div>
        </div>

        <div className="bg-white p-3 rounded-lg border border-slate-200">
          <div className="text-xs text-slate-500">Đang khám</div>
          <div className="text-xl font-bold text-slate-800 mt-1">{stats.inProgress}</div>
        </div>

        <div className="bg-white p-3 rounded-lg border border-slate-200">
          <div className="text-xs text-slate-500">Đã kết luận xong</div>
          <div className="text-xl font-bold text-slate-800 mt-1">{stats.completed}</div>
        </div>
      </div>

      {/* Thanh tìm kiếm & chọn hiển thị luồng */}
      <div className="bg-white p-3 rounded-lg border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm theo Tên, Mã BN, SĐT, STT..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-[#004282]"
          />
        </div>

        {/* Bộ nút chuyển đổi luồng khám đơn giản */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded text-xs w-full md:w-auto flex-wrap">
          <button
            onClick={() => setActiveTab('ALL_FLOWS')}
            className={`px-3 py-1 rounded font-medium transition ${
              activeTab === 'ALL_FLOWS' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Tất cả theo dõi ({queue.length})
          </button>

          <button
            onClick={() => setActiveTab('LAB_READY')}
            className={`px-3 py-1 rounded font-medium transition ${
              activeTab === 'LAB_READY' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Đã đủ KQ CLS - Chờ kết luận ({labReadyQueue.length})
          </button>

          <button
            onClick={() => setActiveTab('INITIAL')}
            className={`px-3 py-1 rounded font-medium transition ${
              activeTab === 'INITIAL' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Khám ban đầu (2 danh sách)
          </button>

          <button
            onClick={() => setActiveTab('WAITING_LAB')}
            className={`px-3 py-1 rounded font-medium transition ${
              activeTab === 'WAITING_LAB' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Đang làm CLS ({waitingLabQueue.length})
          </button>
        </div>
      </div>

      {/* Hiển thị danh sách theo luồng quy trình */}
      {activeTab === 'ALL_FLOWS' ? (
        <div className="space-y-4">
          {/* 1. Ưu tiên hàng đầu: Danh sách bệnh nhân đã có đầy đủ KQ CLS chờ bác sĩ kết luận */}
          {labReadyQueue.length > 0 && renderLabReadyTable()}

          {/* 2. Hai danh sách chờ khám ban đầu (Ưu tiên & Tự do) */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {renderInitialQueueTable(
              initialPriorityQueue,
              "1. Hàng đợi Ưu tiên & Đặt trước (Khám ban đầu)",
              "Bệnh nhân đặt qua ứng dụng, khám dịch vụ, người cao tuổi",
              true
            )}

            {renderInitialQueueTable(
              initialWalkinQueue,
              "2. Hàng đợi Bệnh nhân tự do (Khám ban đầu)",
              "Bệnh nhân lấy số tại Kiosk sảnh và quầy tiếp đón",
              false
            )}
          </div>

          {/* 3. Danh sách bệnh nhân đang làm CLS */}
          {waitingLabQueue.length > 0 && renderWaitingLabTable()}
        </div>
      ) : activeTab === 'LAB_READY' ? (
        renderLabReadyTable()
      ) : activeTab === 'INITIAL' ? (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {renderInitialQueueTable(
            initialPriorityQueue,
            "1. Hàng đợi Ưu tiên & Đặt trước (Khám ban đầu)",
            "Bệnh nhân đặt qua ứng dụng, khám dịch vụ, người cao tuổi",
            true
          )}

          {renderInitialQueueTable(
            initialWalkinQueue,
            "2. Hàng đợi Bệnh nhân tự do (Khám ban đầu)",
            "Bệnh nhân lấy số tại Kiosk sảnh và quầy tiếp đón",
            false
          )}
        </div>
      ) : (
        renderWaitingLabTable()
      )}

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
