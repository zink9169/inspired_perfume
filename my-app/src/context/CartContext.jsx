// src/context/CartContext.jsx
import React, { createContext, useState, useContext, useEffect } from "react";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("perfumeCart");
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error("Error loading cart:", error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("perfumeCart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, size = "10ml", quantity = 1) => {
    setCartItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(
        (item) => item.id === product.id && item.size === size,
      );

      if (existingItemIndex >= 0) {
        // Update quantity if item already exists
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += quantity;
        return updatedItems;
      } else {
        // Add new item to cart
        const price = size === "10ml" ? product.price_10ml : product.price_35ml;
        const newItem = {
          id: product.id,
          product_id: product.id,
          name: product.name,
          size,
          quantity,
          unit_price: price,
          subtotal: price * quantity,
        };
        return [...prevItems, newItem];
      }
    });
  };

  const clearCart = () => {
    setCartItems([]);
  };
  const updateQuantity = (itemId, size, newQuantity) => {
    if (newQuantity < 1) return;

    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === itemId && item.size === size) {
          return {
            ...item,
            quantity: newQuantity,
            subtotal: item.unit_price * newQuantity,
          };
        }
        return item;
      }),
    );
  };

  const removeFromCart = (itemId, size) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => !(item.id === itemId && item.size === size)),
    );
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cartItems.reduce((sum, item) => sum + item.subtotal, 0);

  const value = {
    cartItems,
    cartCount,
    cartTotal,
    addToCart,
    clearCart,
    updateQuantity,
    removeFromCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
