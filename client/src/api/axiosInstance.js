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

// Response interceptor for error handling and token refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    const message = error.response?.data?.message || "Something went wrong"
    const url = error.config?.url || ""

    // Don't show error toasts for auth endpoints - let the components handle them
    if (url.includes("/auth/")) {
      return Promise.reject(error)
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = localStorage.getItem("refreshToken")
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken: refreshToken,
          })

          const { accessToken } = response.data
          localStorage.setItem("token", accessToken)

          // Retry the original request with new token
          originalRequest.headers.Authorization = `Bearer ${accessToken}`
          return axiosInstance(originalRequest)
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        localStorage.removeItem("token")
        localStorage.removeItem("refreshToken")
        localStorage.removeItem("user")
        
        // Only show toast if not already on login page
        if (window.location.pathname !== "/login") {
          toast.error("Session expired. Please login again.")
          window.location.href = "/login"
        }
      }
    } else if (error.response?.status === 401) {
      localStorage.removeItem("token")
      localStorage.removeItem("refreshToken")
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
