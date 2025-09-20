"use client"

import { createContext, useContext, useReducer, useEffect } from "react"
import axiosInstance from "../api/axiosInstance.js"
import toast from "react-hot-toast"

const WishlistContext = createContext()

const initialState = {
  items: [],
  itemCount: 0,
  isLoading: false,
}

const wishlistReducer = (state, action) => {
  switch (action.type) {
    case "SET_LOADING":
      return {
        ...state,
        isLoading: action.payload,
      }

    case "SET_WISHLIST":
      return {
        ...state,
        items: action.payload.items || [],
        itemCount: action.payload.itemCount || 0,
        isLoading: false,
      }

    case "ADD_TO_WISHLIST_SUCCESS":
      return {
        ...state,
        items: action.payload.items || [],
        itemCount: action.payload.itemCount || 0,
        isLoading: false,
      }

    case "REMOVE_FROM_WISHLIST_SUCCESS":
      return {
        ...state,
        items: action.payload.items || [],
        itemCount: action.payload.itemCount || 0,
        isLoading: false,
      }

    case "CLEAR_WISHLIST_SUCCESS":
      return {
        ...state,
        items: [],
        itemCount: 0,
        isLoading: false,
      }

    case "WISHLIST_ERROR":
      return {
        ...state,
        isLoading: false,
      }

    default:
      return state
  }
}

export const WishlistProvider = ({ children }) => {
  const [state, dispatch] = useReducer(wishlistReducer, initialState)

  // Load wishlist from server on mount
  useEffect(() => {
    loadWishlist()
  }, [])

  const loadWishlist = async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true })
      const response = await axiosInstance.get("/wishlist")
      dispatch({ type: "SET_WISHLIST", payload: response.data.wishlist })
    } catch (error) {
      console.error("Error loading wishlist:", error)
      dispatch({ type: "WISHLIST_ERROR" })
    }
  }

  const addToWishlist = async (sweetId) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true })
      const response = await axiosInstance.post(`/wishlist/add/${sweetId}`)
      
      dispatch({ type: "ADD_TO_WISHLIST_SUCCESS", payload: response.data.wishlist })
      toast.success(response.data.message)
    } catch (error) {
      dispatch({ type: "WISHLIST_ERROR" })
      toast.error(error.response?.data?.message || "Failed to add to wishlist")
    }
  }

  const removeFromWishlist = async (sweetId) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true })
      const response = await axiosInstance.delete(`/wishlist/remove/${sweetId}`)
      
      dispatch({ type: "REMOVE_FROM_WISHLIST_SUCCESS", payload: response.data.wishlist })
      toast.success(response.data.message)
    } catch (error) {
      dispatch({ type: "WISHLIST_ERROR" })
      toast.error(error.response?.data?.message || "Failed to remove from wishlist")
    }
  }

  const clearWishlist = async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true })
      const response = await axiosInstance.delete("/wishlist/clear")
      
      dispatch({ type: "CLEAR_WISHLIST_SUCCESS", payload: response.data.wishlist })
      toast.success(response.data.message)
    } catch (error) {
      dispatch({ type: "WISHLIST_ERROR" })
      toast.error(error.response?.data?.message || "Failed to clear wishlist")
    }
  }

  const toggleWishlistItem = async (sweetId) => {
    if (isInWishlist(sweetId)) {
      await removeFromWishlist(sweetId)
    } else {
      await addToWishlist(sweetId)
    }
  }

  const isInWishlist = (sweetId) => {
    return state.items.some(item => item.sweetId._id === sweetId)
  }

  const getWishlistItem = (sweetId) => {
    return state.items.find(item => item.sweetId._id === sweetId)
  }

  const value = {
    ...state,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
    toggleWishlistItem,
    isInWishlist,
    getWishlistItem,
    loadWishlist,
  }

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  )
}

export const useWishlist = () => {
  const context = useContext(WishlistContext)
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider")
  }
  return context
}
