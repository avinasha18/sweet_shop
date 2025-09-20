"use client"

import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { motion } from "framer-motion"
import { ArrowLeftIcon, ShoppingCartIcon, HeartIcon, ShareIcon, MinusIcon, PlusIcon } from "@heroicons/react/24/outline"
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid"
import axiosInstance from "../api/axiosInstance.js"
import { formatPrice, getStockStatus } from "../utils/helpers.js"
import Loader from "../components/Shared/Loader.jsx"
import { useWishlist } from "../context/WishlistContext.jsx"
import { useAuth } from "../context/AuthContext.jsx"
import toast from "react-hot-toast"

const SweetDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [quantity, setQuantity] = useState(1)
  const { isInWishlist, toggleWishlistItem, isLoading: wishlistLoading } = useWishlist()
  const { isAuthenticated } = useAuth()

  const {
    data: apiResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["sweet", id],
    queryFn: async () => {
      const response = await axiosInstance.get(`/sweets/${id}`)
      return response.data
    },
  })

  const sweet = apiResponse?.sweet

  const purchaseMutation = useMutation({
    mutationFn: async ({ sweetId, quantity }) => {
      const response = await axiosInstance.post(`/sweets/${sweetId}/purchase`, { quantity })
      return response.data
    },
    onSuccess: () => {
      toast.success("Purchase successful!")
      queryClient.invalidateQueries(["sweet", id])
      queryClient.invalidateQueries(["sweets"])
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Purchase failed")
    },
  })

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change
    if (newQuantity >= 1 && newQuantity <= sweet?.quantity) {
      setQuantity(newQuantity)
    }
  }

  const handlePurchase = () => {
    if (!sweet || sweet.quantity === 0) return
    purchaseMutation.mutate({ sweetId: id, quantity })
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: sweet?.name,
          text: sweet?.description,
          url: window.location.href,
        })
      } catch (error) {
        console.log("Error sharing:", error)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      toast.success("Link copied to clipboard!")
    }
  }

  if (isLoading) {
    return <Loader text="Loading sweet details..." />
  }

  if (error || !sweet) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Sweet not found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            The sweet you're looking for doesn't exist or has been removed.
          </p>
          <button onClick={() => navigate("/")} className="btn-primary">
            Back to Home
          </button>
        </div>
      </div>
    )
  }

  const stockStatus = getStockStatus(sweet.quantity)

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-emerald-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <motion.button
          onClick={() => navigate("/")}
          className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-pink-600 dark:hover:text-pink-400 mb-8 transition-colors"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          whileHover={{ x: -5 }}
        >
          <ArrowLeftIcon className="w-5 h-5" />
          <span>Back to Sweets</span>
        </motion.button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Section */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-2xl overflow-hidden">
              {sweet.imageUrl ? (
                <img
                  src={sweet.imageUrl || "/placeholder.svg"}
                  alt={sweet.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-8xl">
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
          </motion.div>

          {/* Details Section */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Header */}
            <div>
              <div className="flex items-start justify-between mb-2">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{sweet.name}</h1>
                <div className="flex items-center space-x-2">
                  <motion.button
                    onClick={handleFavoriteToggle}
                    disabled={wishlistLoading}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors disabled:opacity-50"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {isInWishlist(id) ? (
                      <HeartSolidIcon className="w-6 h-6 text-red-500" />
                    ) : (
                      <HeartIcon className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                    )}
                  </motion.button>
                  <motion.button
                    onClick={handleShare}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <ShareIcon className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                  </motion.button>
                </div>
              </div>
              <p className="text-lg text-gray-600 dark:text-gray-400 capitalize mb-2">{sweet.category}</p>
              <div className="flex items-center space-x-4">
                <span className="text-3xl font-bold text-pink-600 dark:text-pink-400">{formatPrice(sweet.price)}</span>
                <span
                  className={`px-3 py-1 text-sm font-medium rounded-full ${stockStatus.color} bg-gray-100 dark:bg-gray-800`}
                >
                  {stockStatus.text}
                </span>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Description</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{sweet.description}</p>
            </div>

            {/* Stock Info */}
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <span className="font-medium">{sweet.quantity}</span> items available
              </p>
            </div>

            {/* Quantity Selector */}
            {sweet.quantity > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Quantity</h3>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg">
                    <motion.button
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <MinusIcon className="w-4 h-4" />
                    </motion.button>
                    <span className="px-4 py-2 text-lg font-medium text-gray-900 dark:text-white">{quantity}</span>
                    <motion.button
                      onClick={() => handleQuantityChange(1)}
                      disabled={quantity >= sweet.quantity}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <PlusIcon className="w-4 h-4" />
                    </motion.button>
                  </div>
                  <span className="text-lg font-semibold text-gray-900 dark:text-white">
                    Total: {formatPrice(sweet.price * quantity)}
                  </span>
                </div>
              </div>
            )}

            {/* Purchase Button */}
            <motion.button
              onClick={handlePurchase}
              disabled={sweet.quantity === 0 || purchaseMutation.isLoading}
              className="w-full flex items-center justify-center space-x-2 py-4 px-6 bg-pink-600 hover:bg-pink-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors duration-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <ShoppingCartIcon className="w-5 h-5" />
              <span>
                {purchaseMutation.isLoading ? "Processing..." : sweet.quantity === 0 ? "Out of Stock" : "Purchase Now"}
              </span>
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default SweetDetail
