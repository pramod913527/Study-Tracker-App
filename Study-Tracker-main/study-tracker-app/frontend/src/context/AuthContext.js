import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    // Simulate JWT decode for role (replace with real decode in prod)
    const token = localStorage.getItem('jwt');
    if (token) {
      // Example: decode token to get user/role
      // const { user, role } = jwtDecode(token);
      // setUser(user); setRole(role);
      setUser({ name: 'Demo User' });
      setRole(localStorage.getItem('role') || 'student');
    }
  }, []);

  const login = (token, userInfo) => {
    localStorage.setItem('jwt', token);
    setUser(userInfo);
    setRole(userInfo.role);
    localStorage.setItem('role', userInfo.role);
  };

  const logout = () => {
    localStorage.removeItem('jwt');
    localStorage.removeItem('role');
    setUser(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ user, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
