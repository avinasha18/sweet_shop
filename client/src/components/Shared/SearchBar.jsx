"use client"

import { useState, useEffect } from "react"
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline"
import { motion } from "framer-motion"

const SearchBar = ({ onSearch, placeholder = "Search sweets...", className = "" }) => {
  const [query, setQuery] = useState("")

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      onSearch(query)
    }, 300)

    return () => clearTimeout(debounceTimer)
  }, [query, onSearch])

  return (
    <motion.div
      className={`relative ${className}`}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="input-field pl-10"
        placeholder={placeholder}
      />
    </motion.div>
  )
}

export default SearchBar
