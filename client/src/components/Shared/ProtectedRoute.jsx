"use client"
import { Navigate, useLocation } from "react-router-dom"
import { useAuth } from "../../context/AuthContext.jsx"
import Loader from "./Loader.jsx"

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, isLoading, user } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return <Loader text="Checking authentication..." />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (requireAdmin && user?.role !== "admin") {
    return <Navigate to="/" replace />
  }

  return children
}

export default ProtectedRoute
