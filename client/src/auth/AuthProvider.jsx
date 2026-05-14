import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/api";
import { setAccessToken, clearAccessToken } from "../api/authTokenStore";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [role, setRole] = useState(null);
  const [user, setUser] = useState(null);
  const [name, setName] = useState(null)
  const [loading, setLoading] = useState(true);

  async function login(login, password) {
    try {
      const res = await api.post("/auth/login", { login, password });
      setAccessToken(res.data.accessToken);
      setRole(res.data.role);
      setUser(res.data.id);
      setName(res.data.name)
      setLoading(false)
      return res.data.role;
    } catch (error) {
      console.error("Logowanie nieudane");
      throw error;
    }
  }

  async function logout() {
    try {
      await api.post("/auth/logout");
    } catch { }
    clearAccessToken();
    setRole(null);
    setName(null)
    setUser(null);
  }

  useEffect(() => {
    async function init() {
      try {
        const res = await api.post("/auth/refresh", {}, { withCredentials: true });

        setAccessToken(res.data.accessToken);
        setUser(res.data.id);
        setName(res.data.name)
        setRole(res.data.role)
      } catch { }
      setLoading(false);
    }
    init();
  }, []);

  const value = {
    role,
    user,
    name,
    login,
    logout,
    loading,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
