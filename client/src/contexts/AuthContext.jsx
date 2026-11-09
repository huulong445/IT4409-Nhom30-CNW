import React, { createContext, useContext, useState, useEffect } from "react";
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

  const login = (identifier, password) => {
    const trimmed = identifier.trim().toLowerCase();
    const cleanDigits = trimmed.replace(/\D/g, '');
    const found = MOCK_USERS_LIST.find(
<<<<<<< HEAD
      u => u.username.toLowerCase() === trimmed ||
           (cleanDigits && u.phone && u.phone.replace(/\D/g, '') === cleanDigits) ||
           (u.email && u.email.toLowerCase() === trimmed)
=======
      (u) => u.username.toLowerCase() === trimmedUser,
>>>>>>> origin/main
    );

    if (
      found &&
      (found.password === password || password === "123" || !password)
    ) {
      setUser(found);
      localStorage.setItem("bkh_user", JSON.stringify(found));
      return { success: true, user: found };
    }
<<<<<<< HEAD
    return { success: false, message: 'Tên đăng nhập, số điện thoại hoặc mật khẩu không chính xác.' };
=======
    return {
      success: false,
      message: "Tên đăng nhập hoặc mật khẩu không chính xác.",
    };
>>>>>>> origin/main
  };

  const loginAs = (userObj) => {
    setUser(userObj);
    localStorage.setItem("bkh_user", JSON.stringify(userObj));
    return { success: true, user: userObj };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("bkh_user");
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
