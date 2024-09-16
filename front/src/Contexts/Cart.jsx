import React, { createContext, useState, useEffect, useContext } from "react";
import { MessagesContext } from "./Messages";
import * as l from "../Constants/urls";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [shipping, setShipping] = useState(5); // Default shipping cost
  const [checkoutDetails, setCheckoutDetails] = useState(null);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const { addMessage } = useContext(MessagesContext);

  const tax = 2; // Example tax rate (10%)

  // Calculate subtotal, tax, and total
  const calculateTotals = () => {
    const subtotal = cart.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    const total = subtotal + tax + shipping;
    return { subtotal, tax, total };
  };

  const addToCart = (product, quantity = 1) => {
    setCart((prevCart) => {
      const existingProductIndex = prevCart.findIndex(
        (item) => item.id === product.id
      );

      if (existingProductIndex !== -1) {
        // Product already exists in the cart, update its quantity
        const updatedCart = [...prevCart];
        updatedCart[existingProductIndex].quantity += quantity;
        return updatedCart;
      }

      // Product doesn't exist in the cart, add it with the specified quantity
      return [...prevCart, { ...product, quantity }];
    });

    addMessage({
      type: "success",
      title: "",
      text: `${product.title} was added to the cart.`,
      url: l.SITE_CART,
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  const increaseQuantity = (productId) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId
          ? { ...item, quantity: Math.min(item.quantity + 1, item.in_stock) }
          : item
      )
    );
  };

  const decreaseQuantity = (productId) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId
          ? { ...item, quantity: Math.max(item.quantity - 1, 1) }
          : item
      )
    );
  };

  const updateShipping = (amount) => {
    setShipping(amount);
  };

  const prepareCheckout = () => {
    const totals = calculateTotals();
    setCheckoutDetails({
      cart,
      shipping,
      ...totals,
    });
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        increaseQuantity,
        decreaseQuantity,
        updateShipping,
        prepareCheckout,
        checkoutDetails,
        shipping,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
