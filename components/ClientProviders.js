"use client";

import { CartProvider } from '../context/CartContext';
import { WishlistProvider } from '../context/WishlistContext';
import { UserProvider } from '../context/UserContext';
import { AnimatePresence } from "framer-motion";
import { Toaster } from 'react-hot-toast';

export default function ClientProviders({ children }) {
  return (
    <UserProvider>
      <CartProvider>
        <WishlistProvider>
          <AnimatePresence mode="wait">
            {children}
          </AnimatePresence>
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#000',
                color: '#fff',
                borderRadius: '50px',
                padding: '16px 24px',
                fontSize: '14px',
                fontWeight: '500',
              },
              success: {
                iconTheme: {
                  primary: '#10B981',
                  secondary: '#fff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#EF4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </WishlistProvider>
      </CartProvider>
    </UserProvider>
  );
}