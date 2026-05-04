import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

// Decodifica el payload del JWT sin librería externa
const decodeJwt = (token) => {
  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload));
  } catch {
    return {};
  }
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser]   = useState(null);

  const login = (jwtToken) => {
    const payload = decodeJwt(jwtToken);
    setToken(jwtToken);
    setUser({
      username: payload.sub,
      email:    payload.email,
      role:     payload.role,
      id_user:  payload.id_user,
      id_auth:  payload.id_auth,
    });
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      token,
      user,
      isAuthenticated: Boolean(token),
      login,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
};