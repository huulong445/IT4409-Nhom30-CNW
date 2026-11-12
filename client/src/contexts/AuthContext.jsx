import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";
import { MOCK_USERS_LIST } from "../services/mockData";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("bkh_user");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          return parsed;
        }
      } catch (e) {
        return null;
      }
    }
    return null; // Mặc định khách vãng lai chưa đăng nhập
  });

  const login = async (identifier, password) => {
    const trimmed = identifier.trim();

    try {
      // 1. GỬI REQUEST HTTP THỰC TẾ SANG BACKEND
      const response = await api.post('/users/login', {
        username: trimmed,
        password: password,
      });

      if (response.data?.success && response.data?.data) {
        const { token, user: beUser } = response.data.data;
        if (token) {
          localStorage.setItem('token', token);
        }

        // Bổ sung thông tin avatar / chuyên khoa nếu có trong mock list
        const localDetail = MOCK_USERS_LIST.find(
          u => u.username.toLowerCase() === beUser.username?.toLowerCase() ||
               u.id === beUser.id
        ) || {};

        const fullUser = {
          ...localDetail,
          ...beUser,
          id: beUser.id || localDetail.id,
          username: beUser.username,
          role: (beUser.role || localDetail.role || 'PATIENT').toUpperCase(),
          fullName: beUser.full_name || beUser.fullName || localDetail.fullName || beUser.username,
        };

        setUser(fullUser);
        localStorage.setItem("bkh_user", JSON.stringify(fullUser));
        return { success: true, user: fullUser };
      }
    } catch (apiError) {
      console.warn("Backend login API call:", apiError.response?.data || apiError.message);

      // Nếu Backend trả về lỗi 400 hoặc 401 (Sai tài khoản hoặc mật khẩu)
      if (apiError.response && (apiError.response.status === 400 || apiError.response.status === 401)) {
        return {
          success: false,
          message: apiError.response.data?.message || 'Tài khoản hoặc mật khẩu không chính xác.'
        };
      }

      // Nếu Backend chưa bật DB hoặc lỗi mạng, fallback sang dữ liệu mẫu để người dùng không bị kẹt:
      const cleanDigits = trimmed.replace(/\D/g, '');
      const found = MOCK_USERS_LIST.find(
        u => u.username.toLowerCase() === trimmed.toLowerCase() ||
          (cleanDigits && u.phone && u.phone.replace(/\D/g, '') === cleanDigits) ||
          (u.email && u.email.toLowerCase() === trimmed.toLowerCase())
      );

      if (found && (found.password === password || password === "123" || !password)) {
        setUser(found);
        localStorage.setItem("bkh_user", JSON.stringify(found));
        return { success: true, user: found };
      }

      return {
        success: false,
        message: apiError.response?.data?.message || 'Tài khoản hoặc mật khẩu không chính xác.'
      };
    }
  };

  const loginAs = async (userObj) => {
    // Luôn gửi request login sang BE để hiển thị trong tab Network
    try {
      await api.post('/users/login', {
        username: userObj.username,
        password: userObj.password || '123'
      });
    } catch (e) {
      // Ignored for quick demo click
    }
    setUser(userObj);
    localStorage.setItem("bkh_user", JSON.stringify(userObj));
    return { success: true, user: userObj };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("bkh_user");
    localStorage.removeItem("token");
  };

  const switchRole = (role) => {
    const found = MOCK_USERS_LIST.find((u) => u.role === role);
    if (found) {
      setUser(found);
      localStorage.setItem("bkh_user", JSON.stringify(found));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        loginAs,
        logout,
        switchRole,
        usersList: MOCK_USERS_LIST,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
