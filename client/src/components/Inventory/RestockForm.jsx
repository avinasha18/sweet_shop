"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import axiosInstance from "../../api/axiosInstance.js"
import toast from "react-hot-toast"

const RestockForm = ({ sweet, onClose }) => {
  const [quantity, setQuantity] = useState("")
  const [notes, setNotes] = useState("")
  const [errors, setErrors] = useState({})
  const queryClient = useQueryClient()

  const restockMutation = useMutation({
    mutationFn: async ({ sweetId, quantity, notes }) => {
      const response = await axiosInstance.post(`/admin/sweets/${sweetId}/restock`, {
        quantity: Number.parseInt(quantity),
        notes,
      })
      return response.data
    },
    onSuccess: () => {
      toast.success("Sweet restocked successfully!")
      queryClient.invalidateQueries(["admin-sweets"])
      queryClient.invalidateQueries(["admin-stats"])
      queryClient.invalidateQueries(["sweets"])
      queryClient.invalidateQueries(["sweet", sweet._id])
      onClose()
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Restock failed")
    },
  })

  const validateForm = () => {
    const newErrors = {}

    if (!quantity) {
      newErrors.quantity = "Quantity is required"
    } else if (isNaN(quantity) || Number.parseInt(quantity) <= 0) {
      newErrors.quantity = "Quantity must be a positive number"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validateForm()) return

    restockMutation.mutate({
      sweetId: sweet._id,
      quantity,
      notes,
    })
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Restock: {sweet.name}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Current stock: <span className="font-medium">{sweet.quantity}</span> items
        </p>
      </div>

      <div>
        <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Quantity to Add *
        </label>
        <input
          id="quantity"
          name="quantity"
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => {
            setQuantity(e.target.value)
            if (errors.quantity) {
              setErrors((prev) => ({ ...prev, quantity: "" }))
            }
          }}
          className={`input-field ${errors.quantity ? "border-red-500 focus:ring-red-400" : ""}`}
          placeholder="Enter quantity to add"
        />
        {errors.quantity && <p className="mt-1 text-sm text-red-600">{errors.quantity}</p>}
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Notes (Optional)
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="input-field resize-none"
          placeholder="Add any notes about this restock..."
        />
      </div>

      {quantity && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md p-3">
          <p className="text-sm text-green-700 dark:text-green-400">
            New stock level will be:{" "}
            <span className="font-medium">{sweet.quantity + Number.parseInt(quantity || 0)}</span> items
          </p>
        </div>
      )}

      <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <motion.button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Cancel
        </motion.button>
        <motion.button
          type="submit"
          disabled={restockMutation.isLoading}
          className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {restockMutation.isLoading ? "Restocking..." : "Restock"}
        </motion.button>
      </div>
    </motion.form>
  )
}

export default RestockForm
