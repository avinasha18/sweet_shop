"use client"

import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { HeartIcon } from "@heroicons/react/24/outline"
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid"
import { formatPrice, getStockStatus } from "../../utils/helpers.js"
import { useWishlist } from "../../context/WishlistContext.jsx"
import { useAuth } from "../../context/AuthContext.jsx"
import PurchaseButton from "../Inventory/PurchaseButton.jsx"
import toast from "react-hot-toast"

const SweetCard = ({ sweet }) => {
  const { isInWishlist, toggleWishlistItem, isLoading } = useWishlist()
  const { isAuthenticated } = useAuth()
  const stockStatus = getStockStatus(sweet.quantity)

  const handleFavoriteToggle = (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!isAuthenticated) {
      toast.error("Please login to manage your wishlist")
      return
    }
    
    toggleWishlistItem(sweet._id)
  }

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    // TODO: Implement add to cart functionality
    console.log("Add to cart:", sweet._id)
  }

  return (
    <motion.div
      className="card overflow-hidden group cursor-pointer"
      whileHover={{ y: -5, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <Link to={`/sweets/${sweet._id}`} className="block">
        {/* Image */}
        <div className="relative h-48 bg-gray-200 dark:bg-gray-700 overflow-hidden">
          {sweet.imageUrl ? (
            <img
              src={sweet.imageUrl || "/placeholder.svg"}
              alt={sweet.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl">
              {sweet.category === "Cakes" && "🎂"}
              {sweet.category === "Candy" && "🍬"}
              {sweet.category === "Cookies" && "🍪"}
              {sweet.category === "Chocolates" && "🍫"}
              {sweet.category === "Ice Cream" && "🍦"}
              {sweet.category === "Pastries" && "🥐"}
              {sweet.category === "Other" && "🍭"}
            </div>
          )}

          {/* Favorite Button */}
          <motion.button
            onClick={handleFavoriteToggle}
            disabled={isLoading}
            className="absolute top-3 right-3 p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 disabled:opacity-50"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {isInWishlist(sweet._id) ? (
              <HeartSolidIcon className="w-5 h-5 text-red-500" />
            ) : (
              <HeartIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            )}
          </motion.button>

          {/* Stock Status Badge */}
          <div className="absolute top-3 left-3">
            <span
              className={`px-2 py-1 text-xs font-medium rounded-full bg-white dark:bg-gray-800 ${stockStatus.color}`}
            >
              {stockStatus.text}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors line-clamp-1">
              {sweet.name}
            </h3>
            <span className="text-lg font-bold text-pink-600 dark:text-pink-400">{formatPrice(sweet.price)}</span>
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 capitalize">{sweet.category}</p>

          <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 line-clamp-2">{sweet.description}</p>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500 dark:text-gray-400">{sweet.quantity} in stock</span>

            <div onClick={(e) => e.preventDefault()}>
              <PurchaseButton sweet={sweet} className="text-sm" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export default SweetCard
