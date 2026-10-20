import React, { createContext, useContext, useState, useEffect } from 'react';
import { MOCK_USERS_LIST } from '../services/mockData';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('bkh_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return MOCK_USERS_LIST[0];
      }
    }
    return MOCK_USERS_LIST[0]; // Mặc định khởi tạo Bác sĩ lâm sàng để test nhanh
  });

  const login = (username, password) => {
    const trimmedUser = username.trim().toLowerCase();
    const found = MOCK_USERS_LIST.find(
      u => u.username.toLowerCase() === trimmedUser
    );

    if (found && (found.password === password || password === '123' || !password)) {
      setUser(found);
      localStorage.setItem('bkh_user', JSON.stringify(found));
      return { success: true, user: found };
    }
    return { success: false, message: 'Tên đăng nhập hoặc mật khẩu không chính xác.' };
  };

  const loginAs = (userObj) => {
    setUser(userObj);
    localStorage.setItem('bkh_user', JSON.stringify(userObj));
    return { success: true, user: userObj };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('bkh_user');
  };

  const switchRole = (role) => {
    const found = MOCK_USERS_LIST.find(u => u.role === role);
    if (found) {
      setUser(found);
      localStorage.setItem('bkh_user', JSON.stringify(found));
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      loginAs, 
      logout, 
      switchRole, 
      usersList: MOCK_USERS_LIST 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
