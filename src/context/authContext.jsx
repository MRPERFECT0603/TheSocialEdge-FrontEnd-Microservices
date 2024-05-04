import { createContext, useEffect, useState } from "react";
import { authRequest } from "../axios";
export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (inputs) => {
    try {
      setLoading(true);
      const res = await authRequest.post("/auth/login", inputs, {
        withCredentials: true,
        credentials: 'include',
      });

      setCurrentUser(res.data);
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      setError("Login failed. Please check your credentials and try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(currentUser));
  }, [currentUser]);

  return (
    <AuthContext.Provider value={{ currentUser, login, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};