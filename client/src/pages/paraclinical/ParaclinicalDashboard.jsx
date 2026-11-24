import { FlaskConical, AlertCircle, ShieldCheck, ClipboardList } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

export default function ParaclinicalDashboard() {
  const { user, isDemo } = useAuth();
  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold text-slate-900"><FlaskConical className="text-purple-700" /> Tiếp nhận & trả kết quả cận lâm sàng</h1>
        <p className="mt-1 text-sm text-slate-500">Cổng làm việc của kỹ thuật viên xét nghiệm, chẩn đoán hình ảnh và nhân viên CLS.</p>
      </div>
      <div role="status" className="rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
        <div className="flex items-start gap-3"><AlertCircle className="mt-0.5 shrink-0" size={20} />
          <div className="space-y-2">
            <h2 className="font-bold">Chưa có API cận lâm sàng dành cho LAB_TECH</h2>
            <p>Backend hiện chỉ có <code>GET /doctor/lab-requests</code> với quyền <strong>DOCTOR</strong>. Tài khoản {user?.role || "LAB_TECH"} không được quyền sử dụng endpoint này.</p>
            <p>Vì vậy hệ thống <strong>không hiển thị các kết quả xét nghiệm mô phỏng</strong>, không ghi nhận tiếp nhận mẫu và không cho ký duyệt/trả kết quả khi chưa có API thật.</p>
            {isDemo && <p className="font-semibold">Bạn đang xem chế độ demo; chưa đăng nhập với JWT từ backend.</p>}
          </div>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <section className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="flex items-center gap-2 font-bold text-slate-800"><ClipboardList size={20} className="text-[#004282]"/> Danh sách yêu cầu xét nghiệm</h2>
          <p className="mt-3 text-sm text-slate-600">Chưa có API dành riêng cho kỹ thuật viên để lấy các yêu cầu theo khoa/phòng.</p>
          <div className="mt-4 rounded-lg border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">Chưa tải được dữ liệu thực.</div>
        </section>
        <section className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="flex items-center gap-2 font-bold text-slate-800"><ShieldCheck size={20} className="text-[#004282]"/> Nhập & phê duyệt kết quả</h2>
          <p className="mt-3 text-sm text-slate-600">Cần backend cung cấp endpoint lưu kết quả xét nghiệm cùng cơ chế phân quyền, trạng thái và người phê duyệt.</p>
          <button type="button" disabled className="mt-5 rounded-lg bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-500 cursor-not-allowed">Chưa hỗ trợ trả kết quả</button>
        </section>
      </div>
    </div>
  );
}
