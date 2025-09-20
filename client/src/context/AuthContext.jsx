"use client"

import { createContext, useContext, useReducer, useEffect } from "react"
import axiosInstance from "../api/axiosInstance.js"
import toast from "react-hot-toast"

const AuthContext = createContext()

const initialState = {
  user: null,
  token: null,
  isLoading: true,
  isAuthenticated: false,
}

const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
      }
    case "LOGOUT":
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      }
    case "SET_LOADING":
      return {
        ...state,
        isLoading: action.payload,
      }
    case "UPDATE_USER":
      return {
        ...state,
        user: { ...state.user, ...action.payload },
      }
    default:
      return state
  }
}

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)

  useEffect(() => {
    const token = localStorage.getItem("token")
    const refreshToken = localStorage.getItem("refreshToken")
    const user = localStorage.getItem("user")

    if (token && refreshToken && user) {
      try {
        const parsedUser = JSON.parse(user)
        dispatch({
          type: "LOGIN_SUCCESS",
          payload: { token, user: parsedUser },
        })
      } catch (error) {
        localStorage.removeItem("token")
        localStorage.removeItem("refreshToken")
        localStorage.removeItem("user")
      }
    }

    dispatch({ type: "SET_LOADING", payload: false })
  }, [])

  const login = async (email, password) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true })
      const response = await axiosInstance.post("/auth/login", { email, password })

      console.log("Login response:", response.data) // Debug log

      const { accessToken, refreshToken, user } = response.data

      localStorage.setItem("token", accessToken)
      localStorage.setItem("refreshToken", refreshToken)
      localStorage.setItem("user", JSON.stringify(user))

      dispatch({
        type: "LOGIN_SUCCESS",
        payload: { token: accessToken, user },
      })

      toast.success(`Welcome back, ${user.name}!`)
      return { success: true }
    } catch (error) {
      console.log("Login error:", error) // Debug log
      dispatch({ type: "SET_LOADING", payload: false })
      return { success: false, error: error.response?.data?.message || "Login failed" }
    }
  }

  const register = async (name, email, password) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true })
      const response = await axiosInstance.post("/auth/register", { name, email, password })

      const { accessToken, refreshToken, user } = response.data

      localStorage.setItem("token", accessToken)
      localStorage.setItem("refreshToken", refreshToken)
      localStorage.setItem("user", JSON.stringify(user))

      dispatch({
        type: "LOGIN_SUCCESS",
        payload: { token: accessToken, user },
      })

      toast.success(`Welcome to Sweet Shop, ${user.name}!`)
      return { success: true }
    } catch (error) {
      dispatch({ type: "SET_LOADING", payload: false })
      return { success: false, error: error.response?.data?.message || "Registration failed" }
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("refreshToken")
    localStorage.removeItem("user")
    dispatch({ type: "LOGOUT" })
    toast.success("Logged out successfully")
  }

  const updateUser = (userData) => {
    const updatedUser = { ...state.user, ...userData }
    localStorage.setItem("user", JSON.stringify(updatedUser))
    dispatch({ type: "UPDATE_USER", payload: userData })
  }

  const value = {
    ...state,
    login,
    register,
    logout,
    updateUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export { AuthContext }
