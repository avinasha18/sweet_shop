"use client"
import { Navigate, useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContext.jsx"
import Loader from "./Shared/Loader.jsx"
import toast from "react-hot-toast"

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, isLoading, user } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return <Loader text="Checking authentication..." />
  }

  if (!isAuthenticated) {
    // Store the attempted location for redirect after login
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (requireAdmin && user?.role !== "admin") {
    toast.error("Admin access required")
    return <Navigate to="/" replace />
  }

  return children
}

export default ProtectedRoute
