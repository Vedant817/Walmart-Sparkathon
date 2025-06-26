'use client'
import { Cart } from '@/types';
import React, { createContext, useContext, useState, useEffect } from 'react'

declare global {
  interface Window {
    globalCart?: Cart;
    cartListeners?: (() => void)[];
  }
}

interface CartContextType {
  cart: {[key: string]: number}
  addToCart: (productId: string) => void
  removeFromCart: (productId: string) => void
  updateCartItem: (productId: string, quantity: number) => void
  clearCart: () => void
  getTotalItems: () => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const useCart = () => {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<{[key: string]: number}>({})

  useEffect(() => {
    const savedCart = localStorage.getItem('walmart-cart')
    if (savedCart) {
      setCart(JSON.parse(savedCart))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('walmart-cart', JSON.stringify(cart));
    if (typeof window !== 'undefined') {
      window.globalCart = cart
      if (window.cartListeners) {
        window.cartListeners.forEach(listener => listener())
      }
    }
  }, [cart])

  const addToCart = (productId: string) => {
    setCart(prev => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1
    }))
  }

  const removeFromCart = (productId: string) => {
    setCart(prev => {
      const newCart = { ...prev }
      delete newCart[productId];
      return newCart;
    })
  }

  const updateCartItem = (productId: string, quantity: number) => {
    setCart(prev => {
      const newCart = { ...prev }
      if (quantity <= 0) {
        delete newCart[productId]
      } else {
        newCart[productId] = quantity
      }
      return newCart
    })
  }

  const clearCart = () => {
    setCart({})
  }

  const getTotalItems = () => {
    return Object.values(cart).reduce((sum, count) => sum + count, 0)
  }

  const value: CartContextType = {
    cart,
    addToCart,
    removeFromCart,
    updateCartItem,
    clearCart,
    getTotalItems
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}