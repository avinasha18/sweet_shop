import axios from "axios"
import toast from "react-hot-toast"

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api"

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
})

// Request interceptor to add auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || "Something went wrong"
    const url = error.config?.url || ""

    // Don't show error toasts for auth endpoints - let the components handle them
    if (url.includes("/auth/")) {
      return Promise.reject(error)
    }

    if (error.response?.status === 401) {
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      window.location.href = "/login"
      toast.error("Session expired. Please login again.")
    } else if (error.response?.status >= 500) {
      toast.error("Server error. Please try again later.")
    } else {
      toast.error(message)
    }

    return Promise.reject(error)
  },
)

export default axiosInstance
