"use client"

import { motion } from "framer-motion"
import { ShoppingBagIcon } from "@heroicons/react/24/outline"
import { useCart } from "../../context/CartContext.jsx"

const CartButton = () => {
  const { totalItems, toggleCart } = useCart()

  return (
    <motion.button
      onClick={toggleCart}
      className="relative p-2 text-gray-600 hover:text-pink-600 dark:text-gray-300 dark:hover:text-pink-400 transition-colors"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <ShoppingBagIcon className="w-6 h-6" />
      {totalItems > 0 && (
        <motion.span
          className="absolute -top-1 -right-1 bg-pink-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 15 }}
        >
          {totalItems > 99 ? "99+" : totalItems}
        </motion.span>
      )}
    </motion.button>
  )
}

export default CartButton
