import React, { useState } from "react";
import {
  ClipboardCheck,
  UserPlus,
  Receipt,
  Search,
  Clock,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Phone,
  CreditCard,
  Building2,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

const TABS = [
  { id: "checkin", label: "Tiếp đón & Check-in", icon: ClipboardCheck },
  { id: "walkin", label: "Đăng ký khám tại quầy", icon: UserPlus },
  { id: "billing", label: "Thu phí & Hóa đơn", icon: Receipt },
];

const ReceptionistDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("checkin");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState(() =>
    new Date().toISOString().slice(0, 10)
  );
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [notice, setNotice] = useState("");

  // Form state for walk-in registration (0h - 24h)
  const [walkinForm, setWalkinForm] = useState({
    fullName: "",
    phone: "",
    identityCard: "",
    dob: "",
    gender: "MALE",
    department: "",
    appointmentHour: "08",
    appointmentMinute: "00",
    reason: "",
  });

  const handleActionWithoutBackend = (message) => {
    setNotice(message);
  };

  const handleWalkinSubmit = (event) => {
    event.preventDefault();
    setNotice(
      `Đã ghi nhận thông tin tạm trên giao diện cho bệnh nhân "${walkinForm.fullName}" lúc ${walkinForm.appointmentHour}:${walkinForm.appointmentMinute}. Backend hiện chưa có API /api/v1/receptionist để lưu xuống cơ sở dữ liệu.`
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Quầy Tiếp Đón & Điều Phối Bệnh Nhân
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Nhân viên tiếp tân: <strong className="text-slate-700">{user?.name || user?.username}</strong>
            {user?.departmentName ? ` • ${user.departmentName}` : ""}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm">
            <Calendar className="w-4 h-4 text-[#004282]" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="text-slate-700 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Backend API notice */}
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-sm text-amber-900">
          <p className="font-semibold">
            Cổng Tiếp tân đã sẵn sàng giao diện — đang chờ Backend bổ sung API
          </p>
          <p className="text-amber-800 mt-0.5">
            Backend hiện tại chưa có nhóm endpoint <code className="font-mono bg-amber-100 px-1 rounded">/api/v1/receptionist/*</code> cho vai trò <code className="font-mono bg-amber-100 px-1 rounded">RECEPTIONIST</code> (mới chỉ hỗ trợ đăng nhập và hồ sơ cá nhân). Không có dữ liệu giả nào được tạo để thay thế API.
          </p>
        </div>
      </div>

      {notice && (
        <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-900 flex items-center justify-between gap-3">
          <span>{notice}</span>
          <button
            type="button"
            onClick={() => setNotice("")}
            className="text-xs font-semibold text-blue-700 hover:underline shrink-0"
          >
            Đóng
          </button>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase">
            <span>Lịch hẹn hôm nay</span>
            <Calendar className="w-4 h-4 text-[#004282]" />
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">—</p>
          <p className="text-xs text-slate-400 mt-1">Chưa có API thống kê tiếp tân</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase">
            <span>Chờ check-in</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-bold text-amber-600 mt-2">—</p>
          <p className="text-xs text-slate-400 mt-1">Chưa có API hàng đợi quầy</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase">
            <span>Đã điều phối phòng</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-emerald-600 mt-2">—</p>
          <p className="text-xs text-slate-400 mt-1">Chưa có API trạng thái tiếp đón</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase">
            <span>Chờ thu phí / Hóa đơn</span>
            <Receipt className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-blue-700 mt-2">—</p>
          <p className="text-xs text-slate-400 mt-1">Chưa có API viện phí</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition ${
                active
                  ? "bg-[#004282] text-white shadow-sm"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab 1: Check-in */}
      {activeTab === "checkin" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row gap-3 md:items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm theo mã lịch hẹn, tên bệnh nhân, SĐT, CCCD..."
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#004282]"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {[
                { key: "ALL", label: "Tất cả" },
                { key: "PENDING", label: "Chờ check-in" },
                { key: "CHECKED_IN", label: "Đã tiếp nhận" },
                { key: "CANCELLED", label: "Đã hủy" },
              ].map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setStatusFilter(item.key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    statusFilter === item.key
                      ? "bg-blue-50 text-[#004282] border border-blue-200"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {item.label}
                </button>
              ))}
              <button
                type="button"
                onClick={() =>
                  handleActionWithoutBackend(
                    "Chưa thể tải danh sách lịch hẹn vì Backend chưa có API cho vai trò RECEPTIONIST."
                  )
                }
                className="px-3.5 py-1.5 rounded-lg bg-[#004282] text-white text-xs font-semibold hover:bg-[#003163] transition"
              >
                Tra cứu
              </button>
            </div>
          </div>

          <div className="p-10 text-center">
            <ClipboardCheck className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-slate-800">
              Chưa có dữ liệu lịch hẹn tiếp đón
            </h3>
            <p className="text-sm text-slate-500 max-w-lg mx-auto mt-1">
              Khi Backend bổ sung API lấy danh sách lịch hẹn theo ngày và xác nhận check-in cho tiếp tân, danh sách bệnh nhân đặt lịch sẽ hiển thị tại đây để bạn cấp số thứ tự và điều phối vào phòng khám.
            </p>
          </div>
        </div>
      )}

      {/* Tab 2: Walk-in Registration */}
      {activeTab === "walkin" && (
        <form
          onSubmit={handleWalkinSubmit}
          className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5"
        >
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Đăng ký khám trực tiếp tại quầy
            </h2>
            <p className="text-sm text-slate-500">
              Dành cho bệnh nhân đến khám trực tiếp chưa đặt lịch trước.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <label className="block text-sm font-medium text-slate-700">
              Họ và tên *
              <input
                required
                type="text"
                value={walkinForm.fullName}
                onChange={(e) =>
                  setWalkinForm((prev) => ({ ...prev, fullName: e.target.value }))
                }
                placeholder="Nguyễn Văn A"
                className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
              />
            </label>

            <label className="block text-sm font-medium text-slate-700">
              Số điện thoại *
              <div className="relative mt-1">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  required
                  type="tel"
                  value={walkinForm.phone}
                  onChange={(e) =>
                    setWalkinForm((prev) => ({ ...prev, phone: e.target.value }))
                  }
                  placeholder="0912 345 678"
                  className="w-full rounded-xl border border-slate-300 pl-9 pr-3 py-2 text-sm"
                />
              </div>
            </label>

            <label className="block text-sm font-medium text-slate-700">
              Số CCCD
              <div className="relative mt-1">
                <CreditCard className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={walkinForm.identityCard}
                  onChange={(e) =>
                    setWalkinForm((prev) => ({
                      ...prev,
                      identityCard: e.target.value,
                    }))
                  }
                  placeholder="001099000001"
                  className="w-full rounded-xl border border-slate-300 pl-9 pr-3 py-2 text-sm"
                />
              </div>
            </label>

            <label className="block text-sm font-medium text-slate-700">
              Ngày sinh *
              <input
                required
                type="date"
                value={walkinForm.dob}
                onChange={(e) =>
                  setWalkinForm((prev) => ({ ...prev, dob: e.target.value }))
                }
                className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
              />
            </label>

            <label className="block text-sm font-medium text-slate-700">
              Giới tính *
              <select
                value={walkinForm.gender}
                onChange={(e) =>
                  setWalkinForm((prev) => ({ ...prev, gender: e.target.value }))
                }
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm"
              >
                <option value="MALE">Nam</option>
                <option value="FEMALE">Nữ</option>
                <option value="OTHER">Khác</option>
              </select>
            </label>

            <label className="block text-sm font-medium text-slate-700">
              Khoa / Phòng khám *
              <div className="relative mt-1">
                <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  required
                  type="text"
                  value={walkinForm.department}
                  onChange={(e) =>
                    setWalkinForm((prev) => ({
                      ...prev,
                      department: e.target.value,
                    }))
                  }
                  placeholder="VD: Khoa Nội tổng hợp"
                  className="w-full rounded-xl border border-slate-300 pl-9 pr-3 py-2 text-sm"
                />
              </div>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="block text-sm font-medium text-slate-700">
              <span>Giờ tiếp nhận (0h - 24h) *</span>
              <div className="mt-1 grid grid-cols-2 gap-3">
                <select
                  value={walkinForm.appointmentHour}
                  onChange={(e) =>
                    setWalkinForm((prev) => ({
                      ...prev,
                      appointmentHour: e.target.value,
                    }))
                  }
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm"
                >
                  {Array.from({ length: 24 }, (_, i) =>
                    String(i).padStart(2, "0")
                  ).map((h) => (
                    <option key={h} value={h}>
                      {h} giờ
                    </option>
                  ))}
                </select>
                <select
                  value={walkinForm.appointmentMinute}
                  onChange={(e) =>
                    setWalkinForm((prev) => ({
                      ...prev,
                      appointmentMinute: e.target.value,
                    }))
                  }
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm"
                >
                  {Array.from({ length: 60 }, (_, i) =>
                    String(i).padStart(2, "0")
                  ).map((m) => (
                    <option key={m} value={m}>
                      {m} phút
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <label className="block text-sm font-medium text-slate-700">
              Lý do khám / Triệu chứng ban đầu
              <input
                type="text"
                value={walkinForm.reason}
                onChange={(e) =>
                  setWalkinForm((prev) => ({ ...prev, reason: e.target.value }))
                }
                placeholder="VD: Đau đầu, sốt nhẹ..."
                className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
              />
            </label>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#004282] text-white text-sm font-semibold hover:bg-[#003163] transition"
            >
              <UserPlus className="w-4 h-4" />
              Tiếp nhận & Cấp số khám
            </button>
          </div>
        </form>
      )}

      {/* Tab 3: Billing */}
      {activeTab === "billing" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-10 text-center">
          <Receipt className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-800">
            Thu phí & Hóa đơn khám chữa bệnh
          </h3>
          <p className="text-sm text-slate-500 max-w-lg mx-auto mt-1">
            Backend hiện chưa cung cấp API hóa đơn / thanh toán cho tiếp tân. Sau khi Backend mở endpoint viện phí, màn hình này sẽ hiển thị danh sách phiếu thu và xác nhận thanh toán.
          </p>
        </div>
      )}
    </div>
  );
};

export default ReceptionistDashboard;
