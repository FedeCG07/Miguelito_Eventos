"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export interface User {
  id: string
  name: string
  email: string
  balance: number
  avatar?: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  register: (name: string, email: string, password: string) => Promise<boolean>
  logout: () => void
  updateBalance: (amount: number) => void
  createEvent: (eventData: any) => Promise<string>
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Mock login - in production this would validate against a backend
    const mockUser: User = {
      id: "1",
      name: "Usuario Demo",
      email,
      balance: 5000,
      avatar: "/diverse-user-avatars.png",
    }

    setUser(mockUser)
    localStorage.setItem("user", JSON.stringify(mockUser))
    return true
  }

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    const mockUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      email,
      balance: 0,
      avatar: "/diverse-user-avatars.png",
    }

    setUser(mockUser)
    localStorage.setItem("user", JSON.stringify(mockUser))
    return true
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  const updateBalance = (amount: number) => {
    if (user) {
      const updatedUser = { ...user, balance: user.balance + amount }
      setUser(updatedUser)
      localStorage.setItem("user", JSON.stringify(updatedUser))
    }
  }

  const createEvent = async (eventData: any): Promise<string> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Generate a unique ID for the event
    const eventId = Math.random().toString(36).substr(2, 9)

    // In a real app, this would save to a database
    // For now, we'll store it in localStorage
    const existingEvents = JSON.parse(localStorage.getItem("userEvents") || "[]")
    const newEvent = {
      ...eventData,
      id: eventId,
      creatorId: user?.id,
      creatorName: user?.name,
      attendees: 0,
      attendeesList: [],
    }
    existingEvents.push(newEvent)
    localStorage.setItem("userEvents", JSON.stringify(existingEvents))

    return eventId
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateBalance, createEvent, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
