export const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price)
  }
  
  export const formatDate = (date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date))
  }
  
  export const truncateText = (text, maxLength = 100) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + "..."
  }
  
  export const debounce = (func, wait) => {
    let timeout
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout)
        func(...args)
      }
      clearTimeout(timeout)
      timeout = setTimeout(later, wait)
    }
  }
  
  export const getStockStatus = (quantity) => {
    if (quantity === 0) return { status: "out-of-stock", color: "text-red-500", text: "Out of Stock" }
    if (quantity <= 5) return { status: "low-stock", color: "text-yellow-500", text: "Low Stock" }
    return { status: "in-stock", color: "text-green-500", text: "In Stock" }
  }
  