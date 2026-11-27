import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import api from "../services/api";

const AuthContext = createContext(null);
const USER_KEY = "bkh_user";

function storedSession() {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      localStorage.removeItem(USER_KEY);
      return null;
    }
    const user = JSON.parse(localStorage.getItem(USER_KEY) || "null");
    if (!user || typeof user !== "object") return null;
    return user;
  } catch {
    return null;
  }
}

function clearSessionStorage() {
  localStorage.removeItem("token");
  localStorage.removeItem(USER_KEY);
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(storedSession);
  const revision = useRef(0);
  const [authChecking, setAuthChecking] = useState(() =>
    Boolean(localStorage.getItem("token"))
  );

  useEffect(() => {
    let cancelled = false;
    const startedAt = revision.current;
    if (!localStorage.getItem("token")) {
      setAuthChecking(false);
      return undefined;
    }
    setAuthChecking(true);
    api.get("/users/profile")
      .then((res) => {
        if (!res.data?.success || !res.data?.data) throw new Error("Phiên đăng nhập không hợp lệ.");
        if (cancelled || startedAt !== revision.current) return;
        const p = res.data.data;
        const fresh = {
          id: p.user_id,
          user_id: p.user_id,
          username: p.username,
          email: p.email,
          phone: p.phone,
          role: p.role,
          fullName: p.full_name || p.username,
          staff_id: p.staff_id ?? undefined,
        };
        setUser(fresh);
        localStorage.setItem(USER_KEY, JSON.stringify(fresh));
      })
      .catch(() => {
        if (cancelled || startedAt !== revision.current) return;
        clearSessionStorage();
        setUser(null);
      })
      .finally(() => { if (!cancelled && startedAt === revision.current) setAuthChecking(false); });
    return () => { cancelled = true; };
  }, []);

  const login = async (identifier, password) => {
    if (!identifier?.trim() || !password) {
      return { success: false, message: "Vui lòng nhập tên đăng nhập và mật khẩu." };
    }
    const startedAt = ++revision.current;
    try {
      clearSessionStorage();
      setUser(null);
      const response = await api.post("/auth/login", {
        username: identifier.trim(),
        password,
      });
      if (startedAt !== revision.current) return { success: false, message: "Có phiên đăng nhập mới hơn." };
      const data = response.data?.data;
      if (!response.data?.success || !data?.token || !data.user?.user_id || !data.user?.role) {
        return { success: false, message: "Backend không trả JWT hoặc thông tin tài khoản hợp lệ." };
      }
      const beUser = data.user;
      const fullUser = {
        ...beUser,
        id: beUser.user_id,
        fullName: beUser.full_name || beUser.username,
        role: beUser.role.toUpperCase(),
      };
      clearSessionStorage();
      localStorage.setItem("token", data.token);
      localStorage.setItem(USER_KEY, JSON.stringify(fullUser));
      setUser(fullUser);
      setAuthChecking(false);
      return { success: true, user: fullUser };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Không kết nối được backend. Đăng nhập chưa thành công.",
      };
    }
  };

  const updateLocalUser = (patch) => {
    setUser((previous) => {
      if (!previous) return null;
      const safe = { ...patch };
      delete safe.role;
      delete safe.id;
      delete safe.user_id;
      const next = { ...previous, ...safe };
      localStorage.setItem(USER_KEY, JSON.stringify(next));
      return next;
    });
  };

  const logout = async () => {
    revision.current += 1;
    if (localStorage.getItem("token")) {
      try { await api.post("/auth/logout"); } catch { /* Token will be removed locally. */ }
    }
    clearSessionStorage();
    setUser(null);
    setAuthChecking(false);
    return { success: true };
  };

  const switchRole = (role) => Boolean(user && (
    user.role === role || (role === "LAB_TECH" && user.role === "PARACLINICAL")
  ));

  return (
    <AuthContext.Provider value={{
      user, authChecking, login, logout, updateLocalUser, switchRole,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
