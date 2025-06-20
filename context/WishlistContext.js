"use client";
import { createContext, useContext, useState, useEffect } from 'react';
import { useUser } from './UserContext';
import axiosInstance from '../services/axios';
import Cookies from 'js-cookie';
import { toast } from 'react-hot-toast';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useUser();

  // Load wishlist when user changes
  useEffect(() => {
    const loadWishlist = async () => {
      if (user) {
        try {
          setLoading(true);
          const response = await axiosInstance.get('/wishlist');
          if (response.data?.success) {
            setWishlist(response.data.data?.products || []);
          }
        } catch (error) {
          console.error('Error loading wishlist:', error);
        } finally {
          setLoading(false);
        }
      } else {
        // Load guest wishlist
        try {
          const guestWishlist = JSON.parse(localStorage.getItem("guestWishlist") || "[]");
          setWishlist(guestWishlist);
        } catch {
          setWishlist([]);
        }
      }
    };
    loadWishlist();
  }, [user]);

  const updateGuestWishlist = (items) => {
    localStorage.setItem("guestWishlist", JSON.stringify(items));
    Cookies.set("guestWishlist", JSON.stringify(items), { expires: 7 });
    setWishlist(items);
  };

  const addToWishlist = async (product) => {
    if (user) {
      try {
        setLoading(true);
        const response = await axiosInstance.post(`/wishlist/${product._id}`);
        if (response.data?.success) {
          setWishlist(prev => [...prev, product]);
          toast.success(`${product.name?.en || product.name || 'Item'} added to wishlist!`);
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to add to wishlist");
      } finally {
        setLoading(false);
      }
    } else {
      const guestWishlist = JSON.parse(localStorage.getItem("guestWishlist") || "[]");
      
      // Check if product already exists
      if (guestWishlist.some(item => item._id === product._id)) {
        toast("Already in wishlist");
        return;
      }

      const formattedProduct = {
        _id: product._id,
        name: product.name,
        price: product.price,
        imageLinks: product.imageLinks,
        watchDetails: product.watchDetails,
        classic: product.classic,
        dialColor: product.dialColor,
        createdAt: new Date().toISOString()
      };

      const updatedWishlist = [...guestWishlist, formattedProduct];
      updateGuestWishlist(updatedWishlist);
      toast.success(`${product.name?.en || product.name || 'Item'} added to wishlist!`);
    }
  };

  const removeFromWishlist = async (productId) => {
    if (user) {
      try {
        setLoading(true);
        const response = await axiosInstance.delete(`/wishlist/${productId}`);
        if (response.data?.success) {
          const removedProduct = wishlist.find(item => item._id === productId);
          setWishlist(prev => prev.filter(item => item._id !== productId));
          toast.success(`${removedProduct?.name?.en || removedProduct?.name || 'Item'} removed from wishlist`);
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to remove from wishlist");
      } finally {
        setLoading(false);
      }
    } else {
      const guestWishlist = JSON.parse(localStorage.getItem("guestWishlist") || "[]");
      const removedProduct = guestWishlist.find(item => item._id === productId);
      const updatedWishlist = guestWishlist.filter(item => item._id !== productId);
      updateGuestWishlist(updatedWishlist);
      toast.success(`${removedProduct?.name?.en || removedProduct?.name || 'Item'} removed from wishlist`);
    }
  };

  const clearWishlist = async () => {
    if (user) {
      try {
        setLoading(true);
        const response = await axiosInstance.delete('/wishlist');
        if (response.data?.success) {
          setWishlist([]);
          toast.success("Wishlist cleared");
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to clear wishlist");
      } finally {
        setLoading(false);
      }
    } else {
      updateGuestWishlist([]);
      toast.success("Wishlist cleared");
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.some(item => item._id === productId);
  };

  return (
    <WishlistContext.Provider value={{ 
      wishlist, 
      loading, 
      addToWishlist, 
      removeFromWishlist, 
      clearWishlist,
      isInWishlist
    }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);