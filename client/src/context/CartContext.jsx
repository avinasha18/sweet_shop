"use client"

import { createContext, useContext, useReducer, useEffect } from "react"

const CartContext = createContext()

const initialState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
  isOpen: false,
}

const cartReducer = (state, action) => {
  switch (action.type) {
    case "ADD_TO_CART":
      const existingItem = state.items.find(item => item.sweet._id === action.payload.sweet._id)
      
      if (existingItem) {
        const updatedItems = state.items.map(item =>
          item.sweet._id === action.payload.sweet._id
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        )
        return {
          ...state,
          items: updatedItems,
          totalItems: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
          totalPrice: updatedItems.reduce((sum, item) => sum + (item.sweet.price * item.quantity), 0),
        }
      } else {
        const newItems = [...state.items, action.payload]
        return {
          ...state,
          items: newItems,
          totalItems: newItems.reduce((sum, item) => sum + item.quantity, 0),
          totalPrice: newItems.reduce((sum, item) => sum + (item.sweet.price * item.quantity), 0),
        }
      }

    case "REMOVE_FROM_CART":
      const filteredItems = state.items.filter(item => item.sweet._id !== action.payload)
      return {
        ...state,
        items: filteredItems,
        totalItems: filteredItems.reduce((sum, item) => sum + item.quantity, 0),
        totalPrice: filteredItems.reduce((sum, item) => sum + (item.sweet.price * item.quantity), 0),
      }

    case "UPDATE_QUANTITY":
      const updatedItems = state.items.map(item =>
        item.sweet._id === action.payload.sweetId
          ? { ...item, quantity: action.payload.quantity }
          : item
      ).filter(item => item.quantity > 0)
      
      return {
        ...state,
        items: updatedItems,
        totalItems: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
        totalPrice: updatedItems.reduce((sum, item) => sum + (item.sweet.price * item.quantity), 0),
      }

    case "CLEAR_CART":
      return {
        ...state,
        items: [],
        totalItems: 0,
        totalPrice: 0,
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

    case "LOAD_CART":
      return {
        ...state,
        items: action.payload.items || [],
        totalItems: action.payload.totalItems || 0,
        totalPrice: action.payload.totalPrice || 0,
      }

    default:
      return state
  }
}

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState)

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      try {
        const cartData = JSON.parse(savedCart)
        dispatch({ type: "LOAD_CART", payload: cartData })
      } catch (error) {
        console.error("Error loading cart from localStorage:", error)
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify({
      items: state.items,
      totalItems: state.totalItems,
      totalPrice: state.totalPrice,
    }))
  }, [state.items, state.totalItems, state.totalPrice])

  const addToCart = (sweet, quantity = 1) => {
    dispatch({
      type: "ADD_TO_CART",
      payload: { sweet, quantity }
    })
  }

  const removeFromCart = (sweetId) => {
    dispatch({
      type: "REMOVE_FROM_CART",
      payload: sweetId
    })
  }

  const updateQuantity = (sweetId, quantity) => {
    dispatch({
      type: "UPDATE_QUANTITY",
      payload: { sweetId, quantity }
    })
  }

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" })
  }

  const toggleCart = () => {
    dispatch({ type: "TOGGLE_CART" })
  }

  const setCartOpen = (isOpen) => {
    dispatch({ type: "SET_CART_OPEN", payload: isOpen })
  }

  const getItemQuantity = (sweetId) => {
    const item = state.items.find(item => item.sweet._id === sweetId)
    return item ? item.quantity : 0
  }

  const isInCart = (sweetId) => {
    return state.items.some(item => item.sweet._id === sweetId)
  }

  const value = {
    ...state,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    toggleCart,
    setCartOpen,
    getItemQuantity,
    isInCart,
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
