"use client"

import { createContext, useContext, useReducer, useEffect } from "react"
import axiosInstance from "../api/axiosInstance.js"
import toast from "react-hot-toast"

const CartContext = createContext()

const initialState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
  isOpen: false,
  isLoading: false,
}

const cartReducer = (state, action) => {
  switch (action.type) {
    case "SET_LOADING":
      return {
        ...state,
        isLoading: action.payload,
      }

    case "SET_CART":
      return {
        ...state,
        items: action.payload.items || [],
        totalItems: action.payload.totalItems || 0,
        totalPrice: action.payload.totalPrice || 0,
        isLoading: false,
      }

    case "ADD_TO_CART_SUCCESS":
      return {
        ...state,
        items: action.payload.items || [],
        totalItems: action.payload.totalItems || 0,
        totalPrice: action.payload.totalPrice || 0,
        isLoading: false,
      }

    case "UPDATE_CART_SUCCESS":
      return {
        ...state,
        items: action.payload.items || [],
        totalItems: action.payload.totalItems || 0,
        totalPrice: action.payload.totalPrice || 0,
        isLoading: false,
      }

    case "REMOVE_FROM_CART_SUCCESS":
      return {
        ...state,
        items: action.payload.items || [],
        totalItems: action.payload.totalItems || 0,
        totalPrice: action.payload.totalPrice || 0,
        isLoading: false,
      }

    case "CLEAR_CART_SUCCESS":
      return {
        ...state,
        items: [],
        totalItems: 0,
        totalPrice: 0,
        isLoading: false,
      }

    case "TOGGLE_CART":
      return {
        ...state,
        isOpen: !state.isOpen,
      }

    case "SET_CART_OPEN":
      return {
        ...state,
        isOpen: action.payload,
      }

    case "CART_ERROR":
      return {
        ...state,
        isLoading: false,
      }

    default:
      return state
  }
}

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState)

  // Load cart from server on mount
  useEffect(() => {
    const loadCartData = async () => {
      try {
        dispatch({ type: "SET_LOADING", payload: true })
        const response = await axiosInstance.get("/cart")
        dispatch({ type: "SET_CART", payload: response.data.cart })
      } catch (error) {
        console.error("Error loading cart:", error)
        dispatch({ type: "CART_ERROR" })
        // Don't show error toast for initial load failure
        if (error.response?.status !== 401) {
          toast.error("Failed to load cart")
        }
      }
    }
    
    loadCartData()
  }, [])

  const loadCart = async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true })
      const response = await axiosInstance.get("/cart")
      dispatch({ type: "SET_CART", payload: response.data.cart })
    } catch (error) {
      console.error("Error loading cart:", error)
      dispatch({ type: "CART_ERROR" })
    }
  }

  const addToCart = async (sweet, quantity = 1) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true })
      
      // Validate stock before adding
      if (sweet.quantity < quantity) {
        toast.error(`Insufficient stock. Only ${sweet.quantity} items available.`)
        dispatch({ type: "CART_ERROR" })
        return
      }
      
      const response = await axiosInstance.post("/cart/add", {
        sweetId: sweet._id,
        quantity: quantity
      })
      
      dispatch({ type: "ADD_TO_CART_SUCCESS", payload: response.data.cart })
      toast.success(response.data.message)
    } catch (error) {
      dispatch({ type: "CART_ERROR" })
      const errorMessage = error.response?.data?.message || "Failed to add to cart"
      toast.error(errorMessage)
      
      // If stock issue, reload cart to sync with server
      if (error.response?.status === 400 && errorMessage.includes("stock")) {
        loadCart()
      }
    }
  }

  const updateQuantity = async (sweetId, quantity) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true })
      
      // Validate quantity
      if (quantity < 0) {
        toast.error("Quantity cannot be negative")
        dispatch({ type: "CART_ERROR" })
        return
      }
      
      const response = await axiosInstance.put("/cart/update", {
        sweetId: sweetId,
        quantity: quantity
      })
      
      dispatch({ type: "UPDATE_CART_SUCCESS", payload: response.data.cart })
    } catch (error) {
      dispatch({ type: "CART_ERROR" })
      const errorMessage = error.response?.data?.message || "Failed to update cart"
      toast.error(errorMessage)
      
      // If stock issue, reload cart to sync with server
      if (error.response?.status === 400 && errorMessage.includes("stock")) {
        loadCart()
      }
    }
  }

  const removeFromCart = async (sweetId) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true })
      const response = await axiosInstance.delete(`/cart/item/${sweetId}`)
      
      dispatch({ type: "REMOVE_FROM_CART_SUCCESS", payload: response.data.cart })
      toast.success(response.data.message)
    } catch (error) {
      dispatch({ type: "CART_ERROR" })
      toast.error(error.response?.data?.message || "Failed to remove from cart")
    }
  }

  const clearCart = async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true })
      const response = await axiosInstance.delete("/cart/clear")
      
      dispatch({ type: "CLEAR_CART_SUCCESS", payload: response.data.cart })
      toast.success(response.data.message)
    } catch (error) {
      dispatch({ type: "CART_ERROR" })
      toast.error(error.response?.data?.message || "Failed to clear cart")
    }
  }

  const purchaseCart = async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true })
      const response = await axiosInstance.post("/cart/purchase")
      
      dispatch({ type: "CLEAR_CART_SUCCESS", payload: response.data })
      toast.success(response.data.message)
      return { success: true, orders: response.data.orders }
    } catch (error) {
      dispatch({ type: "CART_ERROR" })
      const errorMessage = error.response?.data?.message || "Purchase failed"
      toast.error(errorMessage)
      
      // If stock issues, reload cart to sync with server
      if (error.response?.status === 400 && errorMessage.includes("stock")) {
        loadCart()
      }
      
      return { success: false, error: error.response?.data }
    }
  }

  const toggleCart = () => {
    dispatch({ type: "TOGGLE_CART" })
  }

  const setCartOpen = (isOpen) => {
    dispatch({ type: "SET_CART_OPEN", payload: isOpen })
  }

  const getItemQuantity = (sweetId) => {
    const item = state.items.find(item => item.sweetId._id === sweetId)
    return item ? item.quantity : 0
  }

  const isInCart = (sweetId) => {
    return state.items.some(item => item.sweetId._id === sweetId)
  }

  const value = {
    ...state,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    purchaseCart,
    toggleCart,
    setCartOpen,
    getItemQuantity,
    isInCart,
    loadCart,
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
