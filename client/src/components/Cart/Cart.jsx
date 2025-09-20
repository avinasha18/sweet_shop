"use client"

import { motion, AnimatePresence } from "framer-motion"
import { XMarkIcon, ShoppingBagIcon, TrashIcon, PlusIcon, MinusIcon } from "@heroicons/react/24/outline"
import { useCart } from "../../context/CartContext.jsx"
import { useAuth } from "../../context/AuthContext.jsx"
import { formatPrice } from "../../utils/helpers.js"
import toast from "react-hot-toast"
import axiosInstance from "../../api/axiosInstance.js"
import { useMutation, useQueryClient } from "@tanstack/react-query"

const Cart = () => {
  const { 
    items, 
    totalItems, 
    totalPrice, 
    isOpen, 
    toggleCart, 
    updateQuantity, 
    removeFromCart, 
    clearCart 
  } = useCart()
  
  const { isAuthenticated } = useAuth()
  const queryClient = useQueryClient()

  const purchaseMutation = useMutation({
    mutationFn: async (cartItems) => {
      const promises = cartItems.map(item =>
        axiosInstance.post(`/sweets/${item.sweet._id}/purchase`, { 
          quantity: item.quantity 
        })
      )
      return Promise.all(promises)
    },
    onSuccess: () => {
      toast.success("Purchase completed successfully!")
      clearCart()
      toggleCart()
      queryClient.invalidateQueries(["sweets"])
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Purchase failed")
    },
  })

  const handlePurchase = () => {
    if (!isAuthenticated) {
      toast.error("Please login to purchase items")
      return
    }
    
    if (items.length === 0) {
      toast.error("Your cart is empty")
      return
    }

    purchaseMutation.mutate(items)
  }

  const handleQuantityChange = (sweetId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(sweetId)
    } else {
      updateQuantity(sweetId, newQuantity)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleCart}
          />

          {/* Cart Panel */}
          <motion.div
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white dark:bg-gray-800 shadow-xl z-50 flex flex-col"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-2">
                <ShoppingBagIcon className="w-6 h-6 text-pink-600" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Cart ({totalItems})
                </h2>
              </div>
              <button
                onClick={toggleCart}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              >
                <XMarkIcon className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingBagIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Your cart is empty
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Add some delicious sweets to get started!
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <motion.div
                      key={item.sweet._id}
                      className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                    >
                      <div className="flex items-start space-x-3">
                        <img
                          src={item.sweet.imageUrl || "/api/placeholder/80/80"}
                          alt={item.sweet.name}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900 dark:text-white truncate">
                            {item.sweet.name}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {formatPrice(item.sweet.price)} each
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleQuantityChange(item.sweet._id, item.quantity - 1)}
                                className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors"
                              >
                                <MinusIcon className="w-4 h-4 text-gray-500" />
                              </button>
                              <span className="text-sm font-medium text-gray-900 dark:text-white min-w-[2rem] text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => handleQuantityChange(item.sweet._id, item.quantity + 1)}
                                className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors"
                              >
                                <PlusIcon className="w-4 h-4 text-gray-500" />
                              </button>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-sm font-medium text-gray-900 dark:text-white">
                                {formatPrice(item.sweet.price * item.quantity)}
                              </span>
                              <button
                                onClick={() => removeFromCart(item.sweet._id)}
                                className="p-1 hover:bg-red-100 dark:hover:bg-red-900 rounded-full transition-colors"
                              >
                                <TrashIcon className="w-4 h-4 text-red-500" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-semibold text-gray-900 dark:text-white">
                    Total:
                  </span>
                  <span className="text-lg font-semibold text-pink-600">
                    {formatPrice(totalPrice)}
                  </span>
                </div>
                <button
                  onClick={handlePurchase}
                  disabled={purchaseMutation.isPending}
                  className="w-full bg-pink-600 hover:bg-pink-700 disabled:bg-pink-400 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                >
                  {purchaseMutation.isPending ? "Processing..." : "Purchase Now"}
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default Cart
