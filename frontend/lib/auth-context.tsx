"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import axios from "axios";
import { Dna } from "lucide-react";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  DNI: string;
  email: string;
  balance: number;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (identifier: string, password: string) => Promise<boolean>;
  register: (firstName: string, lastName: string, username: string, DNI: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateBalance: (amount: number) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

axios.defaults.withCredentials = true; // algo de las cookies (?
const baseUrl = process.env.NEXT_PUBLIC_API_URL

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${baseUrl}/user/me`)
        setUser(res.data.user);
      } catch (err) {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  const login = async (identifier: string, password: string): Promise<boolean> => {
    try {
      const res = await axios.post(`${baseUrl}/user/login`, { identifier, password });
      setUser(res.data.user);
      return true;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 404) {
          console.warn("Usuario no encontrado")
        } 
      }
      return false
    }
  };

  const register = async (firstName: string, lastName: string, username: string, DNI: string, email: string, password: string): Promise<boolean> => {
    try {
      const res = await axios.post(`${baseUrl}/user/register`, { firstName, lastName, username, DNI, email, password });
      setUser(res.data.user);
      return true;
    } catch (err) {
      console.error("Register error:", err);
      return false;
    }
  };

  const logout = async () => {
    try {
      await axios.get(`${baseUrl}/user/logout`);
      setUser(null);
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const updateBalance = async (amount: number): Promise<boolean> => {
    if (!user) throw new Error("No hay usuario logueado")

    try {
      const res = await axios.post(`${baseUrl}/user/add/${amount}`)
      
      setUser(res.data.user)

      return true
    } catch (err) {
      console.error("Error al actualizar balance:", err)
      throw err
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        updateBalance,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
