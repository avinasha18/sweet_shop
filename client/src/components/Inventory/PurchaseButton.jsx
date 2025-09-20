"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ShoppingCartIcon, CheckIcon } from "@heroicons/react/24/outline"
import { useCart } from "../../context/CartContext.jsx"
import { useAuth } from "../../context/AuthContext.jsx"
import toast from "react-hot-toast"

const PurchaseButton = ({ sweet, className = "" }) => {
  const [quantity, setQuantity] = useState(1)
  const [isExpanded, setIsExpanded] = useState(false)
  const { addToCart, getItemQuantity, isInCart } = useCart()
  const { isAuthenticated } = useAuth()

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast.error("Please login to add items to cart")
      return
    }

    if (sweet.quantity < quantity) {
      toast.error("Insufficient stock available")
      return
    }

    addToCart(sweet, quantity)
    toast.success(`${quantity} x ${sweet.name} added to cart!`)
    setIsExpanded(false)
    setQuantity(1)
  }

  const handleQuickAdd = () => {
    if (!isAuthenticated) {
      toast.error("Please login to add items to cart")
      return
    }

    if (sweet.quantity < 1) {
      toast.error("Out of stock")
      return
    }

    addToCart(sweet, 1)
    toast.success(`${sweet.name} added to cart!`)
  }

  const cartQuantity = getItemQuantity(sweet._id)
  const isOutOfStock = sweet.quantity === 0

  return (
    <div className={`relative ${className}`}>
      {isExpanded ? (
        <motion.div
          className="flex items-center space-x-2"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
        >
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              disabled={quantity <= 1}
            >
              <span className="text-gray-500">−</span>
            </button>
            <span className="text-sm font-medium text-gray-900 dark:text-white min-w-[2rem] text-center">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(Math.min(sweet.quantity, quantity + 1))}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              disabled={quantity >= sweet.quantity}
            >
              <span className="text-gray-500">+</span>
            </button>
          </div>
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className="flex items-center space-x-1 px-3 py-1.5 bg-pink-600 hover:bg-pink-700 disabled:bg-gray-400 text-white text-sm font-medium rounded-md transition-colors"
          >
            <ShoppingCartIcon className="w-4 h-4" />
            <span>Add</span>
          </button>
          <button
            onClick={() => setIsExpanded(false)}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <span className="text-gray-500">×</span>
          </button>
        </motion.div>
      ) : (
        <div className="flex items-center space-x-2">
          {isInCart(sweet._id) ? (
            <motion.div
              className="flex items-center space-x-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                In Cart ({cartQuantity})
              </span>
              <button
                onClick={() => setIsExpanded(true)}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              >
                <span className="text-gray-500">+</span>
              </button>
            </motion.div>
          ) : (
            <button
              onClick={isOutOfStock ? undefined : handleQuickAdd}
              disabled={isOutOfStock}
              className="flex items-center space-x-1 px-3 py-1.5 bg-pink-600 hover:bg-pink-700 disabled:bg-gray-400 text-white text-sm font-medium rounded-md transition-colors"
            >
              <ShoppingCartIcon className="w-4 h-4" />
              <span>{isOutOfStock ? "Out of Stock" : "Add to Cart"}</span>
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default PurchaseButton