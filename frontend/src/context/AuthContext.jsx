import React, { createContext, useState, useEffect } from 'react';
import { authService } from '../services/apiServices';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('stayrent_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Validate session on app initialization
    const checkUser = async () => {
      if (user?.token) {
        try {
          const res = await authService.getMe();
          setUser((prev) => ({ ...prev, ...res.data.data }));
        } catch (error) {
          logout();
        }
      }
      setLoading(false);
    };

    checkUser();
  }, []);

  const login = async (credentials) => {
    const res = await authService.login(credentials);
    const userData = res.data.data;
    setUser(userData);
    localStorage.setItem('stayrent_user', JSON.stringify(userData));
    return userData;
  };

  const register = async (userData) => {
    const res = await authService.register(userData);
    const newUser = res.data.data;
    setUser(newUser);
    localStorage.setItem('stayrent_user', JSON.stringify(newUser));
    return newUser;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('stayrent_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
