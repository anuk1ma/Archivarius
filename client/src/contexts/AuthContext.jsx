import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(Boolean(localStorage.getItem("token")));

  useEffect(() => {
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    api
      .get("/auth/me", token)
      .then((data) => setUser(data.user))
      .catch(() => {
        localStorage.removeItem("token");
        setToken("");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, [token]);

  const value = useMemo(
    () => ({
      token,
      user,
      loading,
      isAuthenticated: Boolean(user),
      isAdmin: user?.role === "admin",
      async login(credentials) {
        const data = await api.post("/auth/login", credentials);
        localStorage.setItem("token", data.token);
        setToken(data.token);
        setUser(data.user);
      },
      async register(payload) {
        const data = await api.post("/auth/register", payload);
        localStorage.setItem("token", data.token);
        setToken(data.token);
        setUser(data.user);
      },
      setUser,
      logout() {
        localStorage.removeItem("token");
        setToken("");
        setUser(null);
      }
    }),
    [token, user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
