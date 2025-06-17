"use client";

import { CartProvider } from '../context/CartContext';
import { WishlistProvider } from '../context/WishlistContext';
import { UserProvider } from '../context/UserContext';
import { AnimatePresence } from "framer-motion";

export default function ClientProviders({ children }) {
  return (
    <UserProvider>
      <CartProvider>
        <WishlistProvider>
          <AnimatePresence mode="wait">
            {children}
          </AnimatePresence>
        </WishlistProvider>
      </CartProvider>
    </UserProvider>
  );
}