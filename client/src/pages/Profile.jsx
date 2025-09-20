"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { motion } from "framer-motion"
import { UserIcon, ShoppingBagIcon, ClockIcon } from "@heroicons/react/24/outline"
import axiosInstance from "../api/axiosInstance.js"
import { useAuth } from "../context/AuthContext.jsx"
import { formatPrice, formatDate } from "../utils/helpers.js"
import Loader from "../components/Shared/Loader.jsx"

const Profile = () => {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("orders")

  const { data: orders, isLoading: ordersLoading } = useQuery({
    queryKey: ["user-orders"],
    queryFn: async () => {
      const response = await axiosInstance.get("/user/orders")
      return response.data
    },
  })

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["user-stats"],
    queryFn: async () => {
      const response = await axiosInstance.get("/user/stats")
      return response.data
    },
  })

  if (ordersLoading || statsLoading) {
    return <Loader text="Loading your profile..." />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-emerald-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <motion.div
          className="card p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-r from-pink-400 to-pink-600 rounded-full flex items-center justify-center">
              <UserIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{user?.name}</h1>
              <p className="text-gray-600 dark:text-gray-400">{user?.email}</p>
              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-400 mt-1">
                {user?.role === "admin" ? "Administrator" : "Customer"}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="card p-6 text-center">
            <ShoppingBagIcon className="w-8 h-8 text-pink-600 dark:text-pink-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.totalOrders || 0}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Orders</p>
          </div>
          <div className="card p-6 text-center">
            <div className="w-8 h-8 text-emerald-600 dark:text-emerald-400 mx-auto mb-2 text-2xl">💰</div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatPrice(stats?.totalSpent || 0)}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Spent</p>
          </div>
          <div className="card p-6 text-center">
            <ClockIcon className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats?.memberSince ? formatDate(stats.memberSince).split(",")[0] : "N/A"}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Member Since</p>
          </div>
        </motion.div>

        {/* Order History */}
        <motion.div
          className="card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Order History</h2>
          </div>

          <div className="p-6">
            {!orders || orders.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingBagIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No orders yet</h3>
                <p className="text-gray-600 dark:text-gray-400">Start shopping to see your order history here!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order, index) => (
                  <motion.div
                    key={order._id}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">{order.sweetName}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Quantity: {order.quantity} • {formatDate(order.createdAt)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-pink-600 dark:text-pink-400">{formatPrice(order.totalAmount)}</p>
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            order.status === "completed"
                              ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                              : order.status === "pending"
                                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
                                : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Profile
