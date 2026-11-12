import React, { useState, useEffect } from "react";
import api from "../../services/api";
import {
  Users,
  Search,
  UserPlus,
  Lock,
  Unlock,
  CheckCircle2,
  XCircle,
  Trash2,
  AlertCircle,
} from "lucide-react";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState({
    username: "",
    password: "",
    role: "DOCTOR",
    email: "",
    phone: "",
    department_id: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setErrorMessage("");
      try {
        const res = await api.get("/admin/users");
        if (!res.data?.success || !Array.isArray(res.data?.data)) {
          throw new Error(
            res.data?.message || "Không thể tải danh sách người dùng.",
          );
        }

        setUsers(
          res.data.data.map((user) => ({
            id: user.user_id ?? user.id,
            username: user.username || "",
            fullName: user.full_name || user.fullName || user.username || "",
            role: user.role || "",
            email: user.email || "",
            phone: user.phone || user.phone_number || "",
            department: user.department_name || user.department || "",
            isActive:
              user.is_active !== undefined ? Boolean(user.is_active) : true,
          })),
        );
      } catch (err) {
        setErrorMessage(
          err.response?.data?.message ||
            err.message ||
            "Không thể tải danh sách người dùng.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    const fetchDepartments = async () => {
      try {
        const res = await api.get("/admin/departments", {
          params: { limit: 100 },
        });
        if (res.data?.success && Array.isArray(res.data?.data)) {
          setDepartments(res.data.data);
        }
      } catch (err) {
        setErrorMessage(
          err.response?.data?.message ||
            err.message ||
            "Không thể tải danh sách khoa phòng.",
        );
      }
    };

    fetchData();
    fetchDepartments();
  }, []);

  const toggleUserStatus = async (id) => {
    const target = users.find((u) => u.id === id);
    if (!target) return;
    const nextStatus = !target?.isActive;
    try {
      const res = await api.patch(`/admin/users/${id}/status`, {
        is_active: nextStatus,
      });
      if (!res.data?.success) {
        throw new Error(
          res.data?.message || "Không thể cập nhật trạng thái tài khoản.",
        );
      }
      setUsers((currentUsers) =>
        currentUsers.map((user) =>
          user.id === id ? { ...user, isActive: nextStatus } : user,
        ),
      );
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message ||
          err.message ||
          "Không thể cập nhật trạng thái tài khoản.",
      );
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    try {
      const res = await api.post("/admin/users", {
        username: newUser.username.trim(),
        password: newUser.password,
        email: newUser.email.trim(),
        phone_number: newUser.phone.trim(),
        role: newUser.role,
        ...(newUser.department_id
          ? { department_id: Number(newUser.department_id) }
          : {}),
      });

      if (!res.data?.success) {
        throw new Error(res.data?.message || "Không thể tạo tài khoản.");
      }

      setShowAddModal(false);
      setNewUser({
        username: "",
        password: "",
        role: "DOCTOR",
        email: "",
        phone: "",
        department_id: "",
      });
      setIsLoading(true);
      try {
        const usersRes = await api.get("/admin/users");
        if (!usersRes.data?.success || !Array.isArray(usersRes.data?.data)) {
          throw new Error(
            usersRes.data?.message ||
              "Tài khoản đã tạo nhưng không thể tải lại danh sách.",
          );
        }
        setUsers(
          usersRes.data.data.map((user) => ({
            id: user.user_id ?? user.id,
            username: user.username || "",
            fullName: user.full_name || user.fullName || user.username || "",
            role: user.role || "",
            email: user.email || "",
            phone: user.phone || user.phone_number || "",
            department: user.department_name || user.department || "",
            isActive:
              user.is_active !== undefined ? Boolean(user.is_active) : true,
          })),
        );
      } finally {
        setIsLoading(false);
      }
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message ||
          err.message ||
          "Không thể tạo tài khoản.",
      );
    }
  };

  const handleDeleteUser = async (user) => {
    if (!window.confirm(`Bạn có chắc muốn xóa tài khoản ${user.username}?`))
      return;

    setErrorMessage("");
    try {
      const res = await api.delete(`/admin/users/${user.id}`);
      if (!res.data?.success) {
        throw new Error(res.data?.message || "Không thể xóa tài khoản.");
      }
      setUsers((currentUsers) =>
        currentUsers.filter((currentUser) => currentUser.id !== user.id),
      );
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message ||
          err.message ||
          "Không thể xóa tài khoản.",
      );
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.phone.includes(searchTerm);

    if (roleFilter === "ALL") return matchesSearch;
    return matchesSearch && u.role === roleFilter;
  });
  const departmentRequired = ["DOCTOR", "RECEPTIONIST", "LAB_TECH"].includes(
    newUser.role,
  );

  const getRoleBadge = (role) => {
    switch (role) {
      case "ADMIN":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
            Quản trị viên
          </span>
        );
      case "DOCTOR":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-[#004282]">
            Bác sĩ
          </span>
        );
      case "RECEPTIONIST":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-100 text-teal-800">
            Tiếp tân
          </span>
        );
      case "LAB_TECH":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-800">
            KTV Xét nghiệm
          </span>
        );
      case "PATIENT":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
            Bệnh nhân
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Users className="w-7 h-7 text-[#004282]" />
            Quản Lý Nhân Sự & Người Dùng Hệ Thống
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Quản lý tài khoản cán bộ y tế, phân quyền bảo mật 5 Roles theo chuẩn
            RBAC
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#004282] hover:bg-[#003366] text-white rounded-xl font-semibold shadow-sm text-xs transition"
        >
          <UserPlus className="w-4 h-4" />
          Thêm người dùng mới
        </button>
      </div>

      {errorMessage && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm theo Tên, Username, Email, SĐT..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#004282]/20"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto p-1 bg-slate-100/80 rounded-xl">
          {[
            { id: "ALL", label: "Tất cả" },
            { id: "DOCTOR", label: "Bác sĩ" },
            { id: "RECEPTIONIST", label: "Tiếp đón" },
            { id: "LAB_TECH", label: "Kỹ thuật viên" },
            { id: "ADMIN", label: "Quản trị" },
            { id: "PATIENT", label: "Bệnh nhân" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setRoleFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                roleFilter === tab.id
                  ? "bg-white text-[#004282] shadow-sm font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-[#f8fafc] text-slate-700 text-xs uppercase font-semibold border-b">
              <tr>
                <th className="py-3.5 px-4">Họ và tên</th>
                <th className="py-3.5 px-4">Tài khoản & Liên hệ</th>
                <th className="py-3.5 px-4">Vai trò (Role)</th>
                <th className="py-3.5 px-4">Khoa phòng công tác</th>
                <th className="py-3.5 px-4 text-center">Trạng thái</th>
                <th className="py-3.5 px-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading && (
                <tr>
                  <td
                    colSpan="6"
                    className="px-4 py-8 text-center text-sm text-slate-500"
                  >
                    Đang tải dữ liệu...
                  </td>
                </tr>
              )}
              {!isLoading && filteredUsers.length === 0 && (
                <tr>
                  <td
                    colSpan="6"
                    className="px-4 py-8 text-center text-sm text-slate-500"
                  >
                    {errorMessage
                      ? "Không tải được dữ liệu người dùng."
                      : "Không có người dùng nào."}
                  </td>
                </tr>
              )}
              {!isLoading &&
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50 transition">
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {user.fullName}
                    </td>
                    <td className="py-3.5 px-4 text-xs">
                      <div className="font-mono text-slate-800 font-semibold">
                        {user.username}
                      </div>
                      <div className="text-slate-400">
                        {user.email} • {user.phone}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">{getRoleBadge(user.role)}</td>
                    <td className="py-3.5 px-4 text-xs text-slate-600">
                      {user.department}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {user.isActive ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                          <CheckCircle2 className="w-3 h-3" /> Hoạt động
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-red-700 bg-red-50 px-2 py-0.5 rounded">
                          <XCircle className="w-3 h-3" /> Đã khóa
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => toggleUserStatus(user.id)}
                          className={`p-1.5 rounded-lg border text-xs font-medium transition ${
                            user.isActive
                              ? "text-red-600 border-red-200 hover:bg-red-50"
                              : "text-emerald-600 border-emerald-200 hover:bg-emerald-50"
                          }`}
                          title={user.isActive ? "Khóa tài khoản" : "Mở khóa"}
                        >
                          {user.isActive ? (
                            <Lock className="w-3.5 h-3.5" />
                          ) : (
                            <Unlock className="w-3.5 h-3.5" />
                          )}
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user)}
                          className="p-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition"
                          title="Xóa tài khoản"
                          aria-label={`Xóa tài khoản ${user.username}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Thêm người dùng */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-[#004282] text-white p-4 flex items-center justify-between">
              <h3 className="font-bold text-base flex items-center gap-2">
                <UserPlus className="w-5 h-5" /> Thêm Cán Bộ / Người Dùng Mới
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-white/80 hover:text-white font-bold text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="p-5 space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Tên đăng nhập (Username):
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: bs_nguyenvanb"
                  value={newUser.username}
                  onChange={(e) =>
                    setNewUser({ ...newUser, username: e.target.value })
                  }
                  className="w-full p-2 bg-slate-50 border rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Mật khẩu:
                </label>
                <input
                  type="password"
                  required
                  minLength={8}
                  maxLength={72}
                  autoComplete="new-password"
                  value={newUser.password}
                  onChange={(e) =>
                    setNewUser({ ...newUser, password: e.target.value })
                  }
                  className="w-full p-2 bg-slate-50 border rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Vai trò hệ thống:
                  </label>
                  <select
                    value={newUser.role}
                    onChange={(e) =>
                      setNewUser({
                        ...newUser,
                        role: e.target.value,
                        department_id: "",
                      })
                    }
                    className="w-full p-2 bg-slate-50 border rounded-xl"
                  >
                    <option value="DOCTOR">Bác sĩ khám</option>
                    <option value="RECEPTIONIST">Tiếp đón / Thu ngân</option>
                    <option value="LAB_TECH">Kỹ thuật viên XN</option>
                    <option value="ADMIN">Quản trị viên</option>
                    <option value="PATIENT">Bệnh nhân</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Số điện thoại:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="0912..."
                    value={newUser.phone}
                    onChange={(e) =>
                      setNewUser({ ...newUser, phone: e.target.value })
                    }
                    className="w-full p-2 bg-slate-50 border rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Email:
                </label>
                <input
                  type="email"
                  placeholder="canbo@hmuh.vn"
                  value={newUser.email}
                  onChange={(e) =>
                    setNewUser({ ...newUser, email: e.target.value })
                  }
                  className="w-full p-2 bg-slate-50 border rounded-xl"
                />
              </div>

              {departmentRequired && (
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Khoa phòng:
                  </label>
                  <select
                    required
                    value={newUser.department_id}
                    onChange={(e) =>
                      setNewUser({ ...newUser, department_id: e.target.value })
                    }
                    className="w-full p-2 bg-slate-50 border rounded-xl"
                  >
                    <option value="">Chọn khoa phòng</option>
                    {departments.map((department) => (
                      <option
                        key={department.department_id}
                        value={department.department_id}
                      >
                        {department.department_name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold bg-[#004282] text-white rounded-xl"
                >
                  Tạo tài khoản
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
