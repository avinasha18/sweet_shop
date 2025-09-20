"use client"

import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { HomeIcon, ArrowLeftIcon } from "@heroicons/react/24/outline"

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-emerald-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4">
      <motion.div
        className="text-center max-w-md mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* 404 Animation */}
        <motion.div
          className="text-8xl font-bold text-pink-400 dark:text-pink-500 mb-4"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        >
          404
        </motion.div>

        {/* Sweet Icons */}
        <motion.div
          className="flex justify-center space-x-4 text-4xl mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <motion.span
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatDelay: 1 }}
          >
            🍭
          </motion.span>
          <motion.span
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatDelay: 0.5 }}
          >
            🍰
          </motion.span>
          <motion.span
            animate={{ rotate: [0, -10, 10, 0] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatDelay: 1.5 }}
          >
            🍪
          </motion.span>
        </motion.div>

        {/* Error Message */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Oops! Page Not Found</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
            Looks like this sweet treat has been eaten! The page you're looking for doesn't exist or has been moved.
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <motion.button
            onClick={() => window.history.back()}
            className="flex items-center justify-center space-x-2 px-6 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium rounded-lg transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeftIcon className="w-5 h-5" />
            <span>Go Back</span>
          </motion.button>

          <Link to="/">
            <motion.button
              className="flex items-center justify-center space-x-2 px-6 py-3 bg-pink-600 hover:bg-pink-700 text-white font-medium rounded-lg transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <HomeIcon className="w-5 h-5" />
              <span>Back to Home</span>
            </motion.button>
          </Link>
        </motion.div>

        {/* Fun Message */}
        <motion.p
          className="text-sm text-gray-500 dark:text-gray-400 mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          Don't worry, there are plenty more sweets waiting for you! 🍬
        </motion.p>
      </motion.div>
    </div>
  )
}

export default NotFound
