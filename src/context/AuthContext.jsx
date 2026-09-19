import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('yaathri_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [student, setStudent] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('yaathri_token') || null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Initialize session on mount
  useEffect(() => {
    async function restoreSession() {
      setIsLoading(true);
      setAuthError(null);
      
      const storedToken = localStorage.getItem('yaathri_token');
      if (storedToken) {
        try {
          const res = await api.auth.getMe();
          setUser(res.user);
          setStudent(res.student);
          localStorage.setItem('yaathri_user', JSON.stringify(res.user));
          setIsLoading(false);
          return;
        } catch (e) {
          console.warn('Session expired, logging in as demo student', e);
          localStorage.removeItem('yaathri_token');
          localStorage.removeItem('yaathri_user');
        }
      }

      // Default: login as Demo Student seamlessly
      try {
        const res = await api.auth.login('shreeram.sandesh@cce.edu.in', 'Student@123');
        setToken(res.access_token);
        setUser(res.user);
        localStorage.setItem('yaathri_token', res.access_token);
        localStorage.setItem('yaathri_user', JSON.stringify(res.user));

        const meRes = await api.auth.getMe();
        setStudent(meRes.student);
      } catch (err) {
        console.warn('Backend offline or initialization note:', err);
      } finally {
        setIsLoading(false);
      }
    }

    restoreSession();
  }, []);

  const login = async (email, password) => {
    setIsLoading(true);
    setAuthError(null);
    try {
      const res = await api.auth.login(email, password);
      setToken(res.access_token);
      setUser(res.user);
      localStorage.setItem('yaathri_token', res.access_token);
      localStorage.setItem('yaathri_user', JSON.stringify(res.user));

      const meRes = await api.auth.getMe();
      setStudent(meRes.student);
      return res;
    } catch (err) {
      setAuthError(err.message || 'Login failed.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (formData) => {
    setIsLoading(true);
    setAuthError(null);
    try {
      const res = await api.auth.register(formData);
      setToken(res.access_token);
      setUser(res.user);
      localStorage.setItem('yaathri_token', res.access_token);
      localStorage.setItem('yaathri_user', JSON.stringify(res.user));

      const meRes = await api.auth.getMe();
      setStudent(meRes.student);
      return res;
    } catch (err) {
      setAuthError(err.message || 'Registration failed.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await api.auth.logout();
    setToken(null);
    setUser(null);
    setStudent(null);
    localStorage.removeItem('yaathri_token');
    localStorage.removeItem('yaathri_user');
  };

  const loginAsDemoStudent = async () => {
    return login('shreeram.sandesh@cce.edu.in', 'Student@123');
  };

  const loginAsDemoAdmin = async () => {
    return login('admin@yaathri.kerala.gov.in', 'Admin@123');
  };

  const role = user?.role || 'STUDENT';
  const isAdmin = role === 'ADMIN';
  const isAuthenticated = !!token && !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        student,
        token,
        role,
        isAdmin,
        isAuthenticated,
        isLoading,
        authError,
        login,
        register,
        logout,
        loginAsDemoStudent,
        loginAsDemoAdmin,
        setStudent,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}

