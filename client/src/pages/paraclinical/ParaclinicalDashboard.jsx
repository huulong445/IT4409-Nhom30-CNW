import React, { useState } from 'react';
import { MOCK_PARACLINICAL_REQUESTS } from '../../services/mockData';
import { Search, Eye, CheckCircle2, ShieldCheck, Building2, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import LabResultModal from '../../components/LabResultModal';

const ParaclinicalDashboard = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState(MOCK_PARACLINICAL_REQUESTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL'); // 'ALL', 'BIOCHEMISTRY', 'HEMATOLOGY', 'IMAGING', 'FUNCTIONAL'
  const [statusFilter, setStatusFilter] = useState('ALL'); // 'ALL', 'PENDING', 'IN_PROGRESS', 'COMPLETED'
  
  // Lọc chỉ định theo đúng phạm vi chuyên môn cấp phép của bác sĩ cận lâm sàng
  const userScopeCategories = user?.allowedCategories || [];
  const accessibleRequests = (userScopeCategories.length > 0)
    ? requests.filter(r => userScopeCategories.includes(r.category))
    : requests;

  // Modal nhập & trả kết quả
  const [enteringResultItem, setEnteringResultItem] = useState(null);
  const [resultForm, setResultForm] = useState({
    findings: '',
    conclusion: '',
    techName: 'KTV. Nguyễn Phương Thảo',
    approvedBy: user?.fullName || 'BS CKI. Lê Thị Hải Hà'
  });

  // Modal xem chi tiết kết quả đã trả
  const [viewingResultItem, setViewingResultItem] = useState(null);
  const [successToast, setSuccessToast] = useState('');

  // Thống kê theo phạm vi của bác sĩ
  const stats = {
    total: accessibleRequests.length + 5,
    pending: accessibleRequests.filter(r => r.status === 'PENDING').length,
    inProgress: accessibleRequests.filter(r => r.status === 'IN_PROGRESS').length,
    completed: accessibleRequests.filter(r => r.status === 'COMPLETED').length + 5
  };

  // Chuyển trạng thái sang tiếp nhận / lấy mẫu
  const handleStartProcess = (reqId) => {
    setRequests(requests.map(r => 
      r.reqId === reqId 
        ? { ...r, status: 'IN_PROGRESS', sampleTakenTime: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) } 
        : r
    ));
    setSuccessToast(`Đã tiếp nhận yêu cầu ${reqId} và bắt đầu thực hiện kỹ thuật.`);
    setTimeout(() => setSuccessToast(''), 3000);
  };

  // Mở modal nhập kết quả
  const handleOpenResultEntry = (item) => {
    setEnteringResultItem(item);
    setResultForm({
      findings: item.category === 'IMAGING' 
        ? 'Hình ảnh trường phổi hai bên sáng đều, bóng tim trong giới hạn bình thường.' 
        : 'Các chỉ số phân tích hoàn tất, men gan AST: 42 U/L, ALT: 48 U/L.',
      conclusion: item.category === 'IMAGING' 
        ? 'Hiện tại chưa thấy tổn thương tim phổi cấp tính.' 
        : 'Tăng nhẹ men gan ALT/AST. Theo dõi tổn thương tế bào gan.',
      techName: 'KTV. Nguyễn Phương Thảo',
      approvedBy: 'BS CKI. Lê Thị Hải Hà'
    });
  };

  // Ký duyệt & trả kết quả về phòng khám lâm sàng
  const handleSubmitResult = (e) => {
    e.preventDefault();
    if (!enteringResultItem) return;

    const updated = requests.map(r => {
      if (r.reqId === enteringResultItem.reqId) {
        return {
          ...r,
          status: 'COMPLETED',
          completedAt: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
          approvedBy: resultForm.approvedBy,
          resultSummary: resultForm.conclusion
        };
      }
      return r;
    });

    setRequests(updated);
    setSuccessToast(`Đã ký duyệt & gửi kết quả phiếu ${enteringResultItem.reqId} về ${enteringResultItem.orderRoom}!`);
    setEnteringResultItem(null);
    setTimeout(() => setSuccessToast(''), 3500);
  };

  // Lọc dữ liệu theo tìm kiếm, trạng thái và chuyên môn
  const filteredRequests = accessibleRequests.filter(item => {
    const term = searchTerm.toLowerCase();
    const matchSearch = 
      item.patientName.toLowerCase().includes(term) ||
      item.patientId.toLowerCase().includes(term) ||
      item.reqId.toLowerCase().includes(term) ||
      item.testName.toLowerCase().includes(term);

    const matchCat = categoryFilter === 'ALL' || item.category === categoryFilter;
    const matchStatus = statusFilter === 'ALL' || item.status === statusFilter;

    return matchSearch && matchCat && matchStatus;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING':
        return <span className="px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">Chờ lấy mẫu / chụp</span>;
      case 'IN_PROGRESS':
        return <span className="px-2 py-0.5 rounded text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200">Đang thực hiện</span>;
      case 'COMPLETED':
        return <span className="px-2 py-0.5 rounded text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">Đã trả kết quả</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {/* Toast thông báo */}
      {successToast && (
        <div className="fixed top-20 right-8 bg-[#004282] text-white px-5 py-3 rounded-lg shadow-lg flex items-center gap-2.5 z-50 text-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Tiêu đề trang & Thông tin chuyên môn bác sĩ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-800">
            Tiếp Nhận & Trả Kết Quả Cận Lâm Sàng
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {user?.departmentName || "Trung tâm Cận lâm sàng & Chẩn đoán hình ảnh"} • {user?.room} • <strong className="text-slate-700">{user?.fullName}</strong>
          </p>
        </div>

        {/* Badge phạm vi chuyên môn */}
        {user?.paraclinicalScope && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-lg text-xs text-[#004282]">
            <ShieldCheck className="w-4 h-4 text-[#004282] shrink-0" />
            <div>
              <span className="font-bold">Phạm vi cấp phép:</span> {user.paraclinicalScope}
            </div>
          </div>
        )}
      </div>

      {/* Thống kê đơn giản */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-3 rounded-lg border border-slate-200">
          <div className="text-xs text-slate-500">Tổng chỉ định hôm nay</div>
          <div className="text-xl font-bold text-slate-800 mt-1">{stats.total}</div>
        </div>

        <div className="bg-white p-3 rounded-lg border border-slate-200">
          <div className="text-xs text-slate-500">Chờ tiếp nhận / Lấy mẫu</div>
          <div className="text-xl font-bold text-slate-800 mt-1">{stats.pending}</div>
        </div>

        <div className="bg-white p-3 rounded-lg border border-purple-200 bg-purple-50/20">
          <div className="text-xs text-purple-700 font-medium">Đang thực hiện / Chạy máy</div>
          <div className="text-xl font-bold text-purple-800 mt-1">{stats.inProgress}</div>
        </div>

        <div className="bg-white p-3 rounded-lg border border-emerald-300 bg-emerald-50/20">
          <div className="text-xs text-emerald-700 font-bold">Đã ký duyệt & Trả kết quả</div>
          <div className="text-xl font-black text-emerald-800 mt-1">{stats.completed}</div>
        </div>
      </div>

      {/* Thanh tìm kiếm & bộ lọc */}
      <div className="bg-white p-3 rounded-lg border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm theo Mã phiếu, Tên BN, Kỹ thuật..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-[#004282]"
          />
        </div>

        {/* Lọc chuyên khoa kỹ thuật theo đúng thẩm quyền bác sĩ */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded text-xs w-full md:w-auto flex-wrap">
          <button
            onClick={() => setCategoryFilter('ALL')}
            className={`px-2.5 py-1 rounded font-medium transition ${
              categoryFilter === 'ALL' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Tất cả trong phạm vi ({accessibleRequests.length})
          </button>
          
          {(!userScopeCategories.length || userScopeCategories.includes('BIOCHEMISTRY')) && (
            <button
              onClick={() => setCategoryFilter('BIOCHEMISTRY')}
              className={`px-2.5 py-1 rounded font-medium transition ${
                categoryFilter === 'BIOCHEMISTRY' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Sinh hóa máu
            </button>
          )}

          {(!userScopeCategories.length || userScopeCategories.includes('HEMATOLOGY')) && (
            <button
              onClick={() => setCategoryFilter('HEMATOLOGY')}
              className={`px-2.5 py-1 rounded font-medium transition ${
                categoryFilter === 'HEMATOLOGY' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Huyết học
            </button>
          )}

          {(!userScopeCategories.length || userScopeCategories.includes('IMAGING')) && (
            <button
              onClick={() => setCategoryFilter('IMAGING')}
              className={`px-2.5 py-1 rounded font-medium transition ${
                categoryFilter === 'IMAGING' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Chẩn đoán hình ảnh (X-Quang, CT, MRI)
            </button>
          )}

          {(!userScopeCategories.length || userScopeCategories.includes('FUNCTIONAL')) && (
            <button
              onClick={() => setCategoryFilter('FUNCTIONAL')}
              className={`px-2.5 py-1 rounded font-medium transition ${
                categoryFilter === 'FUNCTIONAL' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Thăm dò chức năng (Điện tim & Siêu âm)
            </button>
          )}
        </div>
      </div>

      {/* Bảng danh sách tiếp nhận chỉ định CLS */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden flex flex-col">
        <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-slate-800 text-sm">
              Danh Sách Yêu Cầu Kỹ Thuật Cận Lâm Sàng Tiếp Nhận
              <span className="ml-2 px-2 py-0.5 rounded text-xs font-medium bg-slate-200 text-slate-700">
                {filteredRequests.length} yêu cầu
              </span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Nhận chỉ định trực tiếp từ các phòng khám lâm sàng, thực hiện kỹ thuật và trả kết quả về hồ sơ bệnh nhân
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-700 uppercase font-semibold border-b text-[11px]">
              <tr>
                <th className="py-2.5 px-3 w-28">Mã phiếu</th>
                <th className="py-2.5 px-3">Bệnh nhân</th>
                <th className="py-2.5 px-3">Dịch vụ kỹ thuật yêu cầu</th>
                <th className="py-2.5 px-3">Nơi chỉ định</th>
                <th className="py-2.5 px-3">Giờ chỉ định</th>
                <th className="py-2.5 px-3">BHYT</th>
                <th className="py-2.5 px-3 text-center">Trạng thái</th>
                <th className="py-2.5 px-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-8 text-center text-slate-400">
                    Không tìm thấy yêu cầu kỹ thuật nào phù hợp.
                  </td>
                </tr>
              ) : (
                filteredRequests.map((item) => (
                  <tr key={item.reqId} className="hover:bg-slate-50 transition-colors">
                    {/* Mã phiếu */}
                    <td className="py-3 px-3 font-mono font-semibold text-slate-800">
                      {item.reqId}
                    </td>

                    {/* Bệnh nhân */}
                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-900 text-xs">
                        {item.patientName}
                        <span className="font-normal text-slate-500 ml-1">
                          ({item.gender}, {item.age}t)
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5 font-mono">
                        {item.patientId} • {item.phone}
                      </div>
                    </td>

                    {/* Dịch vụ */}
                    <td className="py-3 px-3 max-w-xs">
                      <div className="font-semibold text-slate-800">
                        {item.testName}
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                        Mã: {item.testCode}
                      </div>
                      {item.resultSummary && (
                        <div className="text-[11px] text-emerald-700 mt-0.5 font-medium line-clamp-1" title={item.resultSummary}>
                          KQ: {item.resultSummary}
                        </div>
                      )}
                    </td>

                    {/* Nơi chỉ định */}
                    <td className="py-3 px-3">
                      <span className="text-slate-800 font-medium">
                        {item.orderRoom}
                      </span>
                    </td>

                    {/* Giờ chỉ định */}
                    <td className="py-3 px-3 text-slate-600 font-mono">
                      {item.orderedAt}
                    </td>

                    {/* BHYT */}
                    <td className="py-3 px-3">
                      {item.hasInsurance ? (
                        <span className="text-slate-700">Có BHYT</span>
                      ) : (
                        <span className="text-slate-400">Tự túc</span>
                      )}
                    </td>

                    {/* Trạng thái */}
                    <td className="py-3 px-3 text-center whitespace-nowrap">
                      {getStatusBadge(item.status)}
                    </td>

                    {/* Thao tác */}
                    <td className="py-3 px-3 text-right">
                      {item.status === 'PENDING' && (
                        <button
                          onClick={() => handleStartProcess(item.reqId)}
                          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-900 text-white rounded text-xs font-medium transition"
                        >
                          Tiếp nhận & Lấy mẫu
                        </button>
                      )}

                      {item.status === 'IN_PROGRESS' && (
                        <button
                          onClick={() => handleOpenResultEntry(item)}
                          className="px-3 py-1 bg-[#004282] hover:bg-[#002f5e] text-white rounded text-xs font-semibold shadow-sm transition"
                        >
                          Nhập & Trả kết quả
                        </button>
                      )}

                      {item.status === 'COMPLETED' && (
                        <button
                          onClick={() => setViewingResultItem(item)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-slate-700 hover:text-slate-900 border border-slate-300 hover:bg-slate-100 rounded text-xs transition"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          Xem phiếu KQ
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: Nhập & Duyệt trả kết quả về phòng khám lâm sàng */}
      {enteringResultItem && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-lg shadow-xl border border-slate-200 overflow-hidden">
            <div className="bg-[#004282] text-white p-3.5 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm">
                  Nhập & Ký Duyệt Kết Quả Cận Lâm Sàng
                </h3>
                <p className="text-xs text-blue-200 mt-0.5">
                  Mã phiếu: {enteringResultItem.reqId} • Nơi gửi: {enteringResultItem.orderRoom}
                </p>
              </div>
              <button 
                onClick={() => setEnteringResultItem(null)}
                className="text-white/80 hover:text-white font-bold text-sm px-2 py-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitResult} className="p-4 space-y-3.5 text-xs">
              {/* Thông tin bệnh nhân */}
              <div className="p-2.5 rounded bg-slate-50 border border-slate-200 grid grid-cols-2 gap-2 text-slate-700">
                <div>
                  <span className="text-slate-400 block text-[11px]">Bệnh nhân:</span>
                  <strong>{enteringResultItem.patientName}</strong> ({enteringResultItem.gender}, {enteringResultItem.age} tuổi)
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Mã bệnh nhân:</span>
                  <span className="font-mono">{enteringResultItem.patientId}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-400 block text-[11px]">Kỹ thuật thực hiện:</span>
                  <span className="font-semibold text-slate-900">{enteringResultItem.testName} ({enteringResultItem.testCode})</span>
                </div>
              </div>

              {/* Mô tả thông số / hình ảnh */}
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Mô tả chi tiết / Các chỉ số đo đạc:
                </label>
                <textarea
                  rows={3}
                  required
                  value={resultForm.findings}
                  onChange={(e) => setResultForm({ ...resultForm, findings: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-[#004282]"
                />
              </div>

              {/* Kết luận chuyên môn */}
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Kết luận chuyên môn của Bác sĩ Cận lâm sàng:
                </label>
                <textarea
                  rows={2}
                  required
                  value={resultForm.conclusion}
                  onChange={(e) => setResultForm({ ...resultForm, conclusion: e.target.value })}
                  placeholder="Nhập kết luận chuyên môn..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-[#004282]"
                />
              </div>

              {/* Bác sĩ ký duyệt */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="font-semibold text-slate-600 block mb-1">Kỹ thuật viên thực hiện:</label>
                  <input
                    type="text"
                    value={resultForm.techName}
                    onChange={(e) => setResultForm({ ...resultForm, techName: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-600 block mb-1">Bác sĩ ký duyệt kết quả:</label>
                  <input
                    type="text"
                    value={resultForm.approvedBy}
                    onChange={(e) => setResultForm({ ...resultForm, approvedBy: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-xs font-semibold text-[#004282]"
                  />
                </div>
              </div>

              {/* Ghi chú đồng bộ */}
              <div className="p-2 rounded bg-blue-50 border border-blue-100 text-[11px] text-[#004282]">
                Khi bạn bấm <strong>Ký duyệt & Trả kết quả</strong>, phiếu này sẽ lập tức được gửi thẳng về hệ thống của <strong>{enteringResultItem.orderRoom}</strong> để Bác sĩ lâm sàng tổng kết cho bệnh nhân.
              </div>

              {/* Nút hành động */}
              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setEnteringResultItem(null)}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded text-xs font-medium"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#004282] hover:bg-[#002f5e] text-white rounded text-xs font-semibold shadow-sm"
                >
                  Ký duyệt & Trả kết quả về phòng khám
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Xem phiếu thông số chi tiết */}
      {viewingResultItem && (
        <LabResultModal
          test={{
            code: viewingResultItem.testCode,
            name: viewingResultItem.testName,
            statusText: `Đã có kết quả: ${viewingResultItem.resultSummary}`
          }}
          patient={{
            fullName: viewingResultItem.patientName,
            patientId: viewingResultItem.patientId,
            gender: viewingResultItem.gender,
            age: viewingResultItem.age,
            insuranceNumber: viewingResultItem.insuranceNumber
          }}
          onClose={() => setViewingResultItem(null)}
        />
      )}
    </div>
  );
};

export default ParaclinicalDashboard;
