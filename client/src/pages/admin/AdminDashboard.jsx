import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Activity, Users, Building2, UserCheck, AlertCircle, Calendar, Pill } from "lucide-react";
import api from "../../services/api";

export default function AdminDashboard() {
  const [data, setData] = useState({
    users: null,
    departments: null,
    schedules: null,
    medicines: null,
    health: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");
    setData({ users: null, departments: null, schedules: null, medicines: null, health: null });
    try {
      const [testRes, usersResponse, departmentsResponse, schedulesResponse, medicinesResponse] = await Promise.all([
        api.get("/test").catch(() => null),
        api.get("/admin/users"),
        api.get("/admin/departments", { params: { limit: 100, page: 1 } }),
        api.get("/admin/schedules", { params: { limit: 20, page: 1 } }),
        api.get("/admin/medicines", { params: { limit: 20, page: 1 } }),
      ]);
      if (!usersResponse.data?.success || !Array.isArray(usersResponse.data.data) ||
          !departmentsResponse.data?.success || !Array.isArray(departmentsResponse.data.data)) {
        throw new Error("Backend trả dữ liệu quản trị không hợp lệ.");
      }
      setData({
        health: testRes?.data || null,
        users: usersResponse.data.data,
        departments: departmentsResponse.data,
        schedules: schedulesResponse.data,
        medicines: medicinesResponse.data,
      });
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Không tải được dữ liệu quản trị.");
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => { loadData(); }, [loadData]);

  const users = data.users;
  const departments = data.departments;
  const totalDepartments = departments?.pagination?.total ?? departments?.data?.length;
  const totalSchedules = data.schedules?.pagination?.total ?? data.schedules?.data?.length;
  const totalMedicines = data.medicines?.pagination?.total ?? data.medicines?.data?.length;
  const cards = [
    { label: "Tài khoản", count: users?.length, icon: Users, to: "/admin/users" },
    { label: "Tài khoản bệnh nhân", count: users?.filter(u => u.role === "PATIENT").length, icon: UserCheck, to: "/admin/patients" },
    { label: "Tài khoản nhân viên", count: users?.filter(u => ["DOCTOR", "LAB_TECH", "RECEPTIONIST", "ADMIN"].includes(u.role)).length, icon: Activity, to: "/admin/staff" },
    { label: "Khoa/phòng", count: totalDepartments, icon: Building2, to: "/admin/departments" },
    { label: "Ca trực phân công", count: totalSchedules, icon: Calendar, to: "/admin/schedules" },
    { label: "Danh mục thuốc", count: totalMedicines, icon: Pill, to: "/admin/medicines" },
  ];
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold text-slate-900">
          <Activity className="text-[#004282]" /> Tổng quan quản trị
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Thống kê tài khoản, khoa/phòng, lịch làm việc và kho thuốc theo API quản trị.
        </p>
      </div>
      {error && (
        <div role="alert" className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          <AlertCircle size={18} />{error}
        </div>
      )}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map(card => (
          <Link key={card.label} to={card.to} className="rounded-2xl border bg-white p-5 shadow-sm hover:border-blue-300">
            <card.icon className="text-[#004282]" size={25} />
            <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-slate-500">{card.label}</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">{card.count ?? "—"}</p>
          </Link>
        ))}
      </div>
      <section className="rounded-2xl border bg-white p-5">
        <h2 className="font-bold text-slate-800">Phạm vi dữ liệu đang có</h2>
        <p className="mt-2 text-sm text-slate-600">
          Backend chưa cung cấp API thống kê lượt khám theo ngày hoặc doanh thu viện phí. Các chỉ số này chưa được hiển thị để tránh dùng số liệu giả.
        </p>
      </section>
    </div>
  );
}
