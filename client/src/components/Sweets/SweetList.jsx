"use client"

import { motion } from "framer-motion"
import SweetCard from "./SweetCard.jsx"

const SweetList = ({ sweets }) => {
  if (!sweets || sweets.length === 0) {
    return (
      <motion.div
        className="text-center py-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-6xl mb-4">🍭</div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No sweets found</h3>
        <p className="text-gray-600 dark:text-gray-400">
          Try adjusting your search or filters to find what you're looking for.
        </p>
      </motion.div>
    )
  }

  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {sweets.map((sweet, index) => (
        <motion.div
          key={sweet._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.5 }}
        >
          <SweetCard sweet={sweet} />
        </motion.div>
      ))}
    </motion.div>
  )
}

export default SweetList
