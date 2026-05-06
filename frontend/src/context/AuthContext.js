import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

const decodeJwt = (token) => {
  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser]   = useState(null);

  useEffect(() => {
    if (token) {
      const payload = decodeJwt(token);
      if (payload) {
        setUser({
          username: payload.sub,
          email:    payload.email,
          role:     payload.role,
          id_user:  payload.id_user,
          id_auth:  payload.id_auth,
        });
      } else {
        logout();
      }
    }
  }, [token]);

  const login = (jwtToken) => {
    localStorage.setItem("token", jwtToken); 
    setToken(jwtToken);
  };

  const logout = () => {
    localStorage.removeItem("token"); 
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