"use client"

import { motion } from "framer-motion"
import {
  CubeIcon,
  ExclamationTriangleIcon,
  CurrencyDollarIcon,
  ShoppingCartIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline"
import { formatPrice } from "../../utils/helpers.js"

const StatsCards = ({ stats }) => {
  const cards = [
    {
      title: "Total Sweets",
      value: stats?.totalSweets || 0,
      icon: CubeIcon,
      color: "bg-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      textColor: "text-blue-600 dark:text-blue-400",
    },
    {
      title: "Out of Stock",
      value: stats?.outOfStock || 0,
      icon: ExclamationTriangleIcon,
      color: "bg-red-500",
      bgColor: "bg-red-50 dark:bg-red-900/20",
      textColor: "text-red-600 dark:text-red-400",
    },
    {
      title: "Low Stock",
      value: stats?.lowStock || 0,
      icon: ExclamationTriangleIcon,
      color: "bg-yellow-500",
      bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
      textColor: "text-yellow-600 dark:text-yellow-400",
    },
    {
      title: "Total Revenue",
      value: formatPrice(stats?.totalRevenue || 0),
      icon: CurrencyDollarIcon,
      color: "bg-green-500",
      bgColor: "bg-green-50 dark:bg-green-900/20",
      textColor: "text-green-600 dark:text-green-400",
    },
    {
      title: "Total Orders",
      value: stats?.totalOrders || 0,
      icon: ShoppingCartIcon,
      color: "bg-purple-500",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
      textColor: "text-purple-600 dark:text-purple-400",
    },
    {
      title: "Active Users",
      value: stats?.activeUsers || 0,
      icon: UserGroupIcon,
      color: "bg-pink-500",
      bgColor: "bg-pink-50 dark:bg-pink-900/20",
      textColor: "text-pink-600 dark:text-pink-400",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cards.map((card, index) => (
        <motion.div
          key={card.title}
          className={`card p-6 ${card.bgColor}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.5 }}
          whileHover={{ y: -5, scale: 1.02 }}
        >
          <div className="flex items-center">
            <div className={`p-3 rounded-full ${card.color}`}>
              <card.icon className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{card.title}</p>
              <p className={`text-2xl font-bold ${card.textColor}`}>{card.value}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

export default StatsCards
