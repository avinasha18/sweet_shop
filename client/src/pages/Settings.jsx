"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { SunIcon, MoonIcon, ComputerDesktopIcon } from "@heroicons/react/24/outline"
import { useAuth } from "../context/AuthContext.jsx"

const Settings = () => {
  const { user, updateUser } = useAuth()
  const [theme, setTheme] = useState("system")
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    marketing: false,
  })

  useEffect(() => {
    // Load theme from localStorage
    const savedTheme = localStorage.getItem("theme") || "system"
    setTheme(savedTheme)
    applyTheme(savedTheme)
  }, [])

  const applyTheme = (selectedTheme) => {
    const root = document.documentElement

    if (selectedTheme === "dark") {
      root.classList.add("dark")
    } else if (selectedTheme === "light") {
      root.classList.remove("dark")
    } else {
      // System theme
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        root.classList.add("dark")
      } else {
        root.classList.remove("dark")
      }
    }
  }

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme)
    localStorage.setItem("theme", newTheme)
    applyTheme(newTheme)
  }

  const handleNotificationChange = (type, value) => {
    setNotifications((prev) => ({
      ...prev,
      [type]: value,
    }))
  }

  const themeOptions = [
    {
      value: "light",
      label: "Light",
      icon: SunIcon,
      description: "Light theme",
    },
    {
      value: "dark",
      label: "Dark",
      icon: MoonIcon,
      description: "Dark theme",
    },
    {
      value: "system",
      label: "System",
      icon: ComputerDesktopIcon,
      description: "Follow system preference",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-emerald-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Settings</h1>
          <p className="text-gray-600 dark:text-gray-400">Customize your Sweet Shop experience</p>
        </motion.div>

        <div className="space-y-8">
          {/* Theme Settings */}
          <motion.div
            className="card p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Appearance</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Choose your preferred theme</p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {themeOptions.map((option) => (
                <motion.button
                  key={option.value}
                  onClick={() => handleThemeChange(option.value)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    theme === option.value
                      ? "border-pink-500 bg-pink-50 dark:bg-pink-900/20"
                      : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <option.icon className="w-8 h-8 mx-auto mb-2 text-gray-700 dark:text-gray-300" />
                  <h3 className="font-semibold text-gray-900 dark:text-white">{option.label}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{option.description}</p>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Notification Settings */}
          <motion.div
            className="card p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Notifications</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Manage how you receive notifications</p>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Email Notifications</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Receive order updates via email</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifications.email}
                    onChange={(e) => handleNotificationChange("email", e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 dark:peer-focus:ring-pink-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-pink-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Push Notifications</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Receive browser notifications</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifications.push}
                    onChange={(e) => handleNotificationChange("push", e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 dark:peer-focus:ring-pink-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-pink-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Marketing Emails</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Receive promotional offers and updates</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifications.marketing}
                    onChange={(e) => handleNotificationChange("marketing", e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 dark:peer-focus:ring-pink-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-pink-600"></div>
                </label>
              </div>
            </div>
          </motion.div>

          {/* Account Settings */}
          <motion.div
            className="card p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Account Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                <p className="text-gray-900 dark:text-white">{user?.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                <p className="text-gray-900 dark:text-white">{user?.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Role</label>
                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-400">
                  {user?.role === "admin" ? "Administrator" : "Customer"}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Settings
