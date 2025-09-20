"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { motion } from "framer-motion"
import { PlusIcon, PencilIcon, TrashIcon, EyeIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline"
import axiosInstance from "../api/axiosInstance.js"
import StatsCards from "../components/Dashboard/StatsCards.jsx"
import SweetForm from "../components/Sweets/SweetForm.jsx"
import Modal from "../components/Shared/Modal.jsx"
import Loader from "../components/Shared/Loader.jsx"
import { formatPrice, formatDate, getStockStatus } from "../utils/helpers.js"
import toast from "react-hot-toast"

const AdminDashboard = () => {
  const [selectedSweet, setSelectedSweet] = useState(null)
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [sweetToDelete, setSweetToDelete] = useState(null)
  const queryClient = useQueryClient()

  // Fetch all sweets for management
  const { data: apiResponse, isLoading: sweetsLoading } = useQuery({
    queryKey: ["admin-sweets"],
    queryFn: async () => {
      const response = await axiosInstance.get("/sweets?limit=100")
      return response.data
    },
  })

  const sweets = apiResponse?.sweets || []
  
  // Calculate stats from sweets data
  const stats = {
    totalSweets: sweets.length,
    totalValue: sweets.reduce((sum, sweet) => sum + (sweet.price * sweet.quantity), 0),
    lowStockCount: sweets.filter(sweet => sweet.quantity < 10).length
  }

  // Create sweet mutation
  const createSweetMutation = useMutation({
    mutationFn: async (sweetData) => {
      const response = await axiosInstance.post("/sweets", sweetData)
      return response.data
    },
    onSuccess: () => {
      toast.success("Sweet created successfully!")
      queryClient.invalidateQueries(["admin-sweets"])
      queryClient.invalidateQueries(["sweets"])
      setIsFormModalOpen(false)
      setSelectedSweet(null)
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to create sweet")
    },
  })

  // Update sweet mutation
  const updateSweetMutation = useMutation({
    mutationFn: async ({ id, sweetData }) => {
      const response = await axiosInstance.put(`/sweets/${id}`, sweetData)
      return response.data
    },
    onSuccess: () => {
      toast.success("Sweet updated successfully!")
      queryClient.invalidateQueries(["admin-sweets"])
      queryClient.invalidateQueries(["sweets"])
      queryClient.invalidateQueries(["sweet", selectedSweet?._id])
      setIsFormModalOpen(false)
      setSelectedSweet(null)
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update sweet")
    },
  })

  // Delete sweet mutation
  const deleteSweetMutation = useMutation({
    mutationFn: async (id) => {
      const response = await axiosInstance.delete(`/sweets/${id}`)
      return response.data
    },
    onSuccess: () => {
      toast.success("Sweet deleted successfully!")
      queryClient.invalidateQueries(["admin-sweets"])
      queryClient.invalidateQueries(["sweets"])
      setIsDeleteModalOpen(false)
      setSweetToDelete(null)
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete sweet")
    },
  })

  const handleCreateSweet = () => {
    setSelectedSweet(null)
    setIsFormModalOpen(true)
  }

  const handleEditSweet = (sweet) => {
    setSelectedSweet(sweet)
    setIsFormModalOpen(true)
  }

  const handleDeleteSweet = (sweet) => {
    setSweetToDelete(sweet)
    setIsDeleteModalOpen(true)
  }

  const handleFormSubmit = (sweetData) => {
    if (selectedSweet) {
      updateSweetMutation.mutate({ id: selectedSweet._id, sweetData })
    } else {
      createSweetMutation.mutate(sweetData)
    }
  }

  const confirmDelete = () => {
    if (sweetToDelete) {
      deleteSweetMutation.mutate(sweetToDelete._id)
    }
  }

  if (sweetsLoading) {
    return <Loader text="Loading admin dashboard..." />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-emerald-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Admin Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your sweet shop inventory and view analytics</p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <StatsCards stats={stats} />
        </motion.div>

        {/* Sweet Management Section */}
        <motion.div
          className="mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Sweet Management</h2>
            <motion.button
              onClick={handleCreateSweet}
              className="btn-primary flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <PlusIcon className="w-5 h-5" />
              <span>Add New Sweet</span>
            </motion.button>
          </div>

          {/* Sweet Table */}
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Sweet
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                  {sweets?.map((sweet, index) => {
                    const stockStatus = getStockStatus(sweet.quantity)
                    return (
                      <motion.tr
                        key={sweet._id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-12 w-12">
                              {sweet.imageUrl ? (
                                <img
                                  className="h-12 w-12 rounded-lg object-cover"
                                  src={sweet.imageUrl || "/placeholder.svg"}
                                  alt={sweet.name}
                                />
                              ) : (
                                <div className="h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center text-2xl">
                                  {sweet.category === "Cakes" && "🎂"}
                                  {sweet.category === "Candy" && "🍬"}
                                  {sweet.category === "Cookies" && "🍪"}
                                  {sweet.category === "Chocolates" && "🍫"}
                                  {sweet.category === "Ice Cream" && "🍦"}
                                  {sweet.category === "Pastries" && "🥐"}
                                  {sweet.category === "Other" && "🍭"}
                                </div>
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">{sweet.name}</div>
                              <div className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                                {sweet.description}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {sweet.category}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          {formatPrice(sweet.price)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {sweet.quantity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              stockStatus.status === "out-of-stock"
                                ? "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                                : stockStatus.status === "low-stock"
                                  ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
                                  : "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                            }`}
                          >
                            {stockStatus.text}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(sweet.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <motion.button
                              onClick={() => window.open(`/sweets/${sweet._id}`, "_blank")}
                              className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white p-1"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <EyeIcon className="w-4 h-4" />
                            </motion.button>
                            <motion.button
                              onClick={() => handleEditSweet(sweet)}
                              className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 p-1"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <PencilIcon className="w-4 h-4" />
                            </motion.button>
                            <motion.button
                              onClick={() => handleDeleteSweet(sweet)}
                              className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-1"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <TrashIcon className="w-4 h-4" />
                            </motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Sweet Form Modal */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false)
          setSelectedSweet(null)
        }}
        title={selectedSweet ? "Edit Sweet" : "Create New Sweet"}
        size="lg"
      >
        <SweetForm
          sweet={selectedSweet}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setIsFormModalOpen(false)
            setSelectedSweet(null)
          }}
          isLoading={createSweetMutation.isLoading || updateSweetMutation.isLoading}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false)
          setSweetToDelete(null)
        }}
        title="Delete Sweet"
        size="sm"
      >
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <ExclamationTriangleIcon className="w-8 h-8 text-red-500" />
            </div>
            <div>
              <p className="text-gray-900 dark:text-white">Are you sure you want to delete "{sweetToDelete?.name}"?</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">This action cannot be undone.</p>
            </div>
          </div>
          <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <motion.button
              onClick={() => {
                setIsDeleteModalOpen(false)
                setSweetToDelete(null)
              }}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Cancel
            </motion.button>
            <motion.button
              onClick={confirmDelete}
              disabled={deleteSweetMutation.isLoading}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {deleteSweetMutation.isLoading ? "Deleting..." : "Delete"}
            </motion.button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default AdminDashboard
