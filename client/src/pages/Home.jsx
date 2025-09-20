"use client"

import { useState, useCallback } from "react"
import { useQuery } from "@tanstack/react-query"
import { motion } from "framer-motion"
import axiosInstance from "../api/axiosInstance.js"
import SweetList from "../components/Sweets/SweetList.jsx"
import SweetFilters from "../components/Sweets/SweetFilters.jsx"
import SearchBar from "../components/Shared/SearchBar.jsx"
import Loader from "../components/Shared/Loader.jsx"

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState({
    category: "",
    minPrice: "",
    maxPrice: "",
    inStock: false,
  })

  const {
    data: apiResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["sweets", searchQuery, filters],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (searchQuery) params.append("search", searchQuery)
      if (filters.category) params.append("category", filters.category)
      if (filters.minPrice) params.append("minPrice", filters.minPrice)
      if (filters.maxPrice) params.append("maxPrice", filters.maxPrice)
      if (filters.inStock) params.append("inStock", "true")

      const response = await axiosInstance.get(`/sweets?${params.toString()}`)
      return response.data
    },
  })

  const sweets = apiResponse?.sweets || []

  const handleSearch = useCallback((query) => {
    setSearchQuery(query)
  }, [])

  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters)
  }, [])

  if (isLoading) {
    return <Loader text="Loading delicious sweets..." />
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-600 dark:text-gray-400">We couldn't load the sweets. Please try again later.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-emerald-50 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <motion.section
        className="relative py-20 px-4 sm:px-6 lg:px-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1
            className="text-4xl md:text-6xl font-extrabold text-gray-900 dark:text-white mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            Welcome to{" "}
            <span className="bg-gradient-to-r from-pink-500 to-emerald-500 bg-clip-text text-transparent">
              Sweet Shop
            </span>
          </motion.h1>
          <motion.p
            className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Discover a world of delicious treats, from artisanal chocolates to freshly baked pastries. Every sweet tells
            a story of craftsmanship and love.
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <SearchBar
              onSearch={handleSearch}
              placeholder="Search for your favorite sweets..."
              className="w-full sm:w-96"
            />
          </motion.div>
        </div>
      </motion.section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <motion.aside
            className="lg:w-64 flex-shrink-0"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <SweetFilters filters={filters} onFilterChange={handleFilterChange} />
          </motion.aside>

          {/* Sweet List */}
          <motion.main
            className="flex-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
          >
             <div className="mb-6">
               <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                 {searchQuery ? `Search results for "${searchQuery}"` : "All Sweets"}
               </h2>
               <p className="text-gray-600 dark:text-gray-400">
                 {sweets.length} {sweets.length === 1 ? "sweet" : "sweets"} found
               </p>
             </div>
             <SweetList sweets={sweets} />
          </motion.main>
        </div>
      </div>
    </div>
  )
}

export default Home
