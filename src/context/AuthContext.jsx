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
  const [institution, setInstitution] = useState(null);
  const [verifier, setVerifier] = useState(null);
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
          setInstitution(res.institution);
          setVerifier(res.verifier);
          localStorage.setItem('yaathri_user', JSON.stringify(res.user));
          setIsLoading(false);
          return;
        } catch (e) {
          console.warn('Session expired', e);
          localStorage.removeItem('yaathri_token');
          localStorage.removeItem('yaathri_user');
          setUser(null);
          setStudent(null);
          setInstitution(null);
          setVerifier(null);
        }
      }
      setIsLoading(false);
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
      setInstitution(meRes.institution);
      setVerifier(meRes.verifier);
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
      setInstitution(meRes.institution);
      setVerifier(meRes.verifier);
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
    setInstitution(null);
    setVerifier(null);
    localStorage.removeItem('yaathri_token');
    localStorage.removeItem('yaathri_user');
  };

  const loginAsDemoStudent = async () => {
    return login('student@yaathri.kerala.gov.in', 'Student@123');
  };

  const loginAsDemoInstitution = async () => {
    return login('institution@yaathri.kerala.gov.in', 'Institution@123');
  };

  const loginAsDemoVerifier = async (type = 'ksrtc') => {
    if (type === 'bus') return login('verifier.bus@yaathri.kerala.gov.in', 'Verifier@123');
    if (type === 'metro') return login('verifier.metro@yaathri.kerala.gov.in', 'Verifier@123');
    return login('verifier.ksrtc@yaathri.kerala.gov.in', 'Verifier@123');
  };

  const loginAsDemoRto = async () => {
    return login('rto@yaathri.kerala.gov.in', 'Rto@123');
  };

  const loginAsDemoAdmin = async () => {
    return login('admin@yaathri.kerala.gov.in', 'Admin@123');
  };

  const role = user?.role || null;
  const isAdmin = role === 'ADMIN';
  const isInstitution = role === 'INSTITUTION' || role === 'ADMIN';
  const isVerifier = role === 'VERIFIER';
  const isRto = role === 'RTO';
  const isStudent = role === 'STUDENT';
  const isAuthenticated = !!token && !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        student,
        institution,
        verifier,
        token,
        role,
        isAdmin,
        isInstitution,
        isVerifier,
        isRto,
        isStudent,
        isAuthenticated,
        isLoading,
        authError,
        login,
        register,
        logout,
        loginAsDemoStudent,
        loginAsDemoInstitution,
        loginAsDemoVerifier,
        loginAsDemoRto,
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

