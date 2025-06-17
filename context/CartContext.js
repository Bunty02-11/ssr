"use client";
import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import axiosInstance from '../services/axios';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useCountry } from './CountryContext';
import Cookies from 'js-cookie';

const CartContext = createContext();
const API_URL = 'https://0vm9jauvgc.execute-api.us-east-1.amazonaws.com/stag';

// Map countries to their respective currencies
const countryCurrencyMap = {
  'india': 'INR',
  'uae': 'AED',
  'usa': 'USD',
  'uk': 'GBP',
  'ksa': 'SAR',
  'kuwait': 'KWD',
  'qatar': 'QAR'
  // Add more countries as needed
};

// Reverse map to get country from currency
const currencyToCountryMap = Object.entries(countryCurrencyMap).reduce((acc, [country, currency]) => {
  acc[currency.toUpperCase()] = country;
  return acc;
}, {});

// Get default currency from localStorage if available
const getInitialCurrency = () => {
  if (typeof window !== 'undefined') {
    const storedCountry = localStorage.getItem('selectedCountry');
    console.log('Initial country from localStorage:', storedCountry);
    return countryCurrencyMap[storedCountry] || 'AED';
  }
  return 'AED';
};

function CartProvider({ children }) {
  const router = useRouter();
  const [currency, setCurrency] = useState(getInitialCurrency());
  const [cart, setCart] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [itemCount, setItemCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [orderProcessing, setOrderProcessing] = useState(false);
  const [forceRefresh, setForceRefresh] = useState(0);
  const [cartIdData, setCartIdData] = useState(null);
  
  // Use refs to prevent excessive API calls
  const isRefreshing = useRef(false);
  const lastStoredCountry = useRef(typeof window !== 'undefined' ? localStorage.getItem('selectedCountry') : 'india');

  // This ensures we always have the latest country from localStorage
  const getLatestSelectedCountry = useCallback(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('selectedCountry') || 'india';
    }
    return 'india';
  }, []);

  // Check and update currency on component mount only
  useEffect(() => {
    // Force currency sync on mount
    if (typeof window !== 'undefined') {
      const storedCountry = localStorage.getItem('selectedCountry');
      const newCurrency = countryCurrencyMap[storedCountry] || 'AED';
      console.log('Setting currency on mount:', newCurrency, 'from country:', storedCountry);
      setCurrency(newCurrency);
      lastStoredCountry.current = storedCountry;
    }
  }, []);

  // Listen for custom countryChange event
  useEffect(() => {
    const handleCountryChange = (e) => {
      const newCountry = e.detail?.country || getLatestSelectedCountry();
      const newCurrency = countryCurrencyMap[newCountry] || 'AED';
      
      // Only update if changed to prevent re-renders
      if (newCurrency !== currency) {
        console.log('Country changed via event to:', newCountry, 'updating currency to:', newCurrency);
        setCurrency(newCurrency);
        lastStoredCountry.current = newCountry;
        
        // Refresh cart data after currency changes (only if we're logged in)
        if (isLoggedIn && !isRefreshing.current) {
          refreshCart();
        }
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('countryChange', handleCountryChange);
    }
    
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('countryChange', handleCountryChange);
      }
    };
  }, [currency, getLatestSelectedCountry, isLoggedIn]);

  // Poll for country changes (fallback, less frequent)
  useEffect(() => {
    const checkCountry = () => {
      if (typeof window !== 'undefined') {
        const storedCountry = localStorage.getItem('selectedCountry');
        
        // Only proceed if the country has actually changed
        if (storedCountry && storedCountry !== lastStoredCountry.current) {
          const newCurrency = countryCurrencyMap[storedCountry] || 'AED';
          console.log('Country poll detected change:', storedCountry, 'updating currency to:', newCurrency);
          setCurrency(newCurrency);
          lastStoredCountry.current = storedCountry;
          
          // Refresh cart data after currency changes (only if we're logged in)
          if (isLoggedIn && !isRefreshing.current) {
            refreshCart();
          }
        }
      }
    };

    // Check less frequently (once per second) to reduce overhead
    const interval = setInterval(checkCountry, 1000);
    return () => clearInterval(interval);
  }, [isLoggedIn]);
  
  // Force refresh the cart when forceRefresh changes
  useEffect(() => {
    if (forceRefresh > 0 && !isRefreshing.current) {
      checkAuthAndFetchCart();
    }
  }, [forceRefresh]);

  // Get current currency - only check if needed to reduce overhead
  const getCurrency = useCallback(() => {
    // Use the current state value as the source of truth
    return currency;
  }, [currency]);

  // Get country from selected country or currency
  const getCountryFromCurrency = (currencyCode) => {
    return currencyToCountryMap[currencyCode.toUpperCase()] || 'india'; // Default to UAE if not found
  };

  // Get the country name for API requests
  const getCountry = () => {
    if (typeof window !== 'undefined') {
      // First try to get directly from localStorage
      const storedCountry = localStorage.getItem('selectedCountry');
      if (storedCountry) {
        return storedCountry;
      }
      // If not found, try to determine from current currency
      return getCountryFromCurrency(getCurrency());
    }
    return 'uae'; // Default to UAE if window is not available
  };

  // Helper for guest cart
  const getGuestCart = () => {
    try {
      return JSON.parse(localStorage.getItem("guestCart") || "[]");
    } catch {
      return [];
    }
  };
  const setGuestCart = (items) => {
    localStorage.setItem("guestCart", JSON.stringify(items));
    Cookies.set("guestCart", JSON.stringify(items), { expires: 7 });
    setCart(items);
    setItemCount(items.reduce((sum, item) => sum + item.quantity, 0));
    setCartTotal(items.reduce((sum, item) => sum + (item.price * item.quantity), 0));
  };

  // Helper to normalize country/currency codes to standard currency codes
  const normalizeCurrency = (currencyOrCountry) => {
    if (!currencyOrCountry) return 'AED';
    const upper = currencyOrCountry.toUpperCase();
    if (upper === 'KSA') return 'SAR';
    if (upper === 'KUWAIT') return 'KWD';
    if (upper === 'QATAR') return 'QAR';
    if (upper === 'UAE') return 'AED';
    if (upper === 'INDIA') return 'INR';
    if (upper === 'USA') return 'USD';
    if (upper === 'UK') return 'GBP';
    if (['INR', 'AED', 'SAR', 'KWD', 'QAR', 'USD', 'GBP'].includes(upper)) return upper;
    return 'AED';
  };

  // Fetch and process cart data from server
  const fetchAndProcessCart = useCallback(async () => {
    if (!isLoggedIn) {
      // Guest: load from localStorage/cookies
      try {
        const guestCart = getGuestCart();
        console.log('Loading guest cart from localStorage:', guestCart);
        
        // Normalize currency for each item
        const normalizedCart = guestCart.map(item => ({
          ...item,
          currency: normalizeCurrency(item.currency),
        }));
        
        setCart(normalizedCart);
        setItemCount(normalizedCart.reduce((sum, item) => sum + (item.quantity || 1), 0));
        
        // Calculate total with proper price handling
        const total = normalizedCart.reduce((sum, item) => {
          let priceValue = item.price;
          let priceNum = 0;
          if (typeof priceValue === "string") {
            const match = priceValue.match(/([\d,.]+)/);
            priceNum = match ? parseFloat(match[1].replace(/,/g, "")) : 0;
          } else if (typeof priceValue === "number") {
            priceNum = priceValue;
          }
          return sum + (priceNum * (item.quantity || 1));
        }, 0);
        
        setCartTotal(total);
        console.log('Guest cart loaded successfully:', { items: normalizedCart.length, total });
      } catch (error) {
        console.error('Error loading guest cart:', error);
        setCart([]);
        setItemCount(0);
        setCartTotal(0);
      }
      setLoading(false);
      return;
    }
    if (isRefreshing.current) return; // Prevent concurrent refreshes
    
    isRefreshing.current = true;
    try {
      const response = await axiosInstance.get(`/cart`);
      console.log(response.data.data, "response")

      if (response.data?.success) {
        const apiCart = response.data.data;
        const mappedItems = apiCart.items.map(item => ({
          _id: item._id, // Map the cart item ID
          productId: item.product._id,
          name: item.product.name.en,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          currency: item.currency, // Make sure currency is included
        }));
        setCartIdData(apiCart._id);
        setCart(mappedItems);
        setItemCount(mappedItems.reduce((sum, item) => sum + item.quantity, 0));
        setCartTotal(apiCart.totalPrice || 0);
      } else {
        setCart([]);
        setCartIdData(null);
        setItemCount(0);
        setCartTotal(0);
      }
    } catch (error) {
      console.error('Failed to fetch cart:', error);
      setCart([]);
      setItemCount(0);
      setCartTotal(0);
    } finally {
      setLoading(false);
      isRefreshing.current = false;
    }
  }, [isLoggedIn]);

  // Check auth and fetch cart - exposed for manual refresh
  const checkAuthAndFetchCart = useCallback(async () => {
    if (isRefreshing.current) return; // Prevent concurrent refreshes
    
    isRefreshing.current = true;
    try {
      setLoading(true);
      const authResponse = await axiosInstance.get(`/users/profile`);
      if (authResponse.data?.success) {
        setIsLoggedIn(true);
        // Directly fetch logged-in user's cart here instead of relying on fetchAndProcessCart
        // This ensures we fetch the user's cart immediately after confirming authentication
        try {
          const cartResponse = await axiosInstance.get(`/cart`);
          console.log(cartResponse.data.data, "logged-in user cart response");

          if (cartResponse.data?.success) {
            const apiCart = cartResponse.data.data;
            const mappedItems = apiCart.items.map(item => ({
              _id: item._id, // Map the cart item ID
              productId: item.product._id,
              name: item.product.name.en,
              price: item.price,
              quantity: item.quantity,
              image: item.image,
              currency: item.currency, // Make sure currency is included
            }));

            setCartIdData(apiCart._id);
            setCart(mappedItems);
            setItemCount(mappedItems.reduce((sum, item) => sum + item.quantity, 0));
            setCartTotal(apiCart.totalPrice || 0);
            console.log('Logged-in user cart loaded successfully:', { items: mappedItems.length, total: apiCart.totalPrice });
          } else {
            setCart([]);
            setCartIdData(null);
            setItemCount(0);
            setCartTotal(0);
          }
        } catch (cartError) {
          console.error('Failed to fetch logged-in user cart:', cartError);
          setCart([]);
          setCartIdData(null);
          setItemCount(0);
          setCartTotal(0);
        }
      } else {
        setIsLoggedIn(false);
        // For guest users, load cart from localStorage
        await fetchAndProcessCart();
      }
    } catch (error) {
      console.error('Authentication error:', error);
      setIsLoggedIn(false);
      // For guest users, load cart from localStorage
      await fetchAndProcessCart();
    } finally {
      setLoading(false);
      isRefreshing.current = false;
    }
  }, [fetchAndProcessCart]);

  // Modified useEffect to always load cart (guest or logged-in)
  useEffect(() => {
    // Only fetch cart if we're not on the order success page
    if (typeof window !== 'undefined' && !window.location.pathname.includes('/order-success')) {
      checkAuthAndFetchCart();
    }
  }, [checkAuthAndFetchCart]);

  // Additional effect to specifically handle guest cart loading
  useEffect(() => {
    // If we're not logged in and cart is empty, try loading guest cart from localStorage
    if (!isLoggedIn && cart.length === 0 && !loading) {
      const guestCart = getGuestCart();
      if (guestCart.length > 0) {
        console.log('Force loading guest cart:', guestCart);
        fetchAndProcessCart();
      }
    }
  }, [isLoggedIn, cart.length, loading, fetchAndProcessCart]);

  // Additional effect to handle logged-in user cart loading when isLoggedIn state changes
  useEffect(() => {
    // If user just logged in and cart is empty, fetch their cart from server
    if (isLoggedIn && cart.length === 0 && !loading && !isRefreshing.current) {
      console.log('User logged in with empty cart, fetching from server...');
      const fetchUserCart = async () => {
        if (isRefreshing.current) return;
        
        isRefreshing.current = true;
        try {
          const response = await axiosInstance.get(`/cart`);
          console.log(response.data.data, "user cart after login");

          if (response.data?.success) {
            const apiCart = response.data.data;
            const mappedItems = apiCart.items.map(item => ({
              _id: item._id,
              productId: item.product._id,
              name: item.product.name.en,
              price: item.price,
              quantity: item.quantity,
              image: item.image,
              currency: item.currency,
            }));

            setCartIdData(apiCart._id);
            setCart(mappedItems);
            setItemCount(mappedItems.reduce((sum, item) => sum + item.quantity, 0));
            setCartTotal(apiCart.totalPrice || 0);
            console.log('User cart loaded after login:', { items: mappedItems.length, total: apiCart.totalPrice });
          }
        } catch (error) {
          console.error('Failed to fetch user cart after login:', error);
        } finally {
          isRefreshing.current = false;
        }
      };
      
      fetchUserCart();
    }
  }, [isLoggedIn, cart.length, loading]);

  // Add to cart
  const addToCart = async (product) => {
    if (!isLoggedIn) {
      // Guest: add to localStorage/cookies
      const guestCart = getGuestCart();
      const existing = guestCart.find(item => item.productId === (product.productId || product._id));
      if (existing) {
        // Update quantity
        const updated = guestCart.map(item =>
          item.productId === (product.productId || product._id)
            ? { ...item, quantity: (item.quantity || 1) + (product.quantity || 1) }
            : item
        );
        setGuestCart(updated.map(item => ({
          ...item,
          currency: normalizeCurrency(item.currency),
        })));
        toast.success("Added to cart successfully!");
      } else {
        const cartItem = {
          productId: product.productId || product._id,
          name: product.name,
          price: typeof product.price === "object" ? product.price : product.price,
          images: product.images || [product.image] || [],
          image: product.image || (product.images && product.images[0]) || "",
          quantity: product.quantity || 1,
          currency: normalizeCurrency(getCurrency()),
        };
        setGuestCart([...guestCart, cartItem]);
        toast.success("Added to cart successfully!");
      }
      return;
    }

    try {
      const currentCurrency = getCurrency();
      const currentCountry = getCountry();
      console.log("Adding to cart with currency:", currentCurrency, "country:", currentCountry);
      
      setLoading(true);
      const response = await axiosInstance.post(`/cart`, {
        productId: product.productId,
        quantity: product.quantity || 1,
        currency: currentCountry,
        // country: currentCountry
      });

      if (response.data?.success) {
        await fetchAndProcessCart();
        toast.success(`Added ${product.name} to cart`);
      } else {
        toast.error(response.data?.message || 'Failed to add item to cart');
      }
    } catch (error) {
      console.error('Add to cart error:', error);
      toast.error(error.response?.data?.message || 'Failed to add item');
    } finally {
      setLoading(false);
    }
  };

  // Remove from cart
  const removeFromCart = async (itemId) => {
    if (!isLoggedIn) {
      // Guest: remove from localStorage/cookies
      const guestCart = getGuestCart();
      const updated = guestCart.filter(item => item._id !== itemId && item.productId !== itemId);
      setGuestCart(updated);
      toast.success('Item removed from cart');
      return;
    }

    try {
      setLoading(true);
      const response = await axiosInstance.delete(`/cart/${itemId}`);

      if (response.data?.success) {
        await fetchAndProcessCart();
        toast.success('Item removed from cart');
      } else {
        toast.error(response.data?.message || 'Failed to remove item');
        setLoading(false);
      }
    } catch (error) {
      console.error('Remove item error:', error);
      toast.error(error.response?.data?.message || 'Failed to remove item');
      setLoading(false);
    }
  };

  // Update quantity
  const updateQuantity = async (itemId, newQuantity) => {
    if (!isLoggedIn) {
      if (newQuantity < 1) {
        toast.error('Quantity must be at least 1');
        return;
      }
      const guestCart = getGuestCart();
      const updated = guestCart.map(item =>
        (item._id === itemId || item.productId === itemId)
          ? { ...item, quantity: newQuantity }
          : item
      );
      setGuestCart(updated);
      toast.success('Quantity updated');
      return;
    }

    if (newQuantity < 1) {
      toast.error('Quantity must be at least 1');
      return;
    }

    try {
      const currentCurrency = getCurrency();
      const currentCountry = getCountry();
      console.log("Updating quantity with currency:", currentCurrency, "country:", currentCountry);
      
      setLoading(true);
      const response = await axiosInstance.put(`/cart/${itemId}`, 
        { 
          quantity: newQuantity,
          currency: currentCurrency,
          country: currentCountry
        } // Pass the updated quantity, currency and country
      );

      if (response.data?.success) {
        await fetchAndProcessCart(); // Refresh the cart after updating
        toast.success('Quantity updated');
      } else {
        toast.error(response.data?.message || 'Failed to update quantity');
        setLoading(false);
      }
    } catch (error) {
      console.error('Update quantity error:', error);
      toast.error(error.response?.data?.message || 'Failed to update quantity');
      setLoading(false);
    }
  };

  // Clear cart
  const clearCart = async () => {
    if (!isLoggedIn) {
      // Clear guest cart completely - both localStorage and state
      if (typeof window !== 'undefined') {
        localStorage.removeItem("guestCart");
        Cookies.remove("guestCart");
      }
      setCart([]);
      setCartIdData(null);
      setItemCount(0);
      setCartTotal(0);
      toast.success('Cart cleared successfully');
      return;
    }

    try {
      setLoading(true);
      const response = await axiosInstance.delete(`/cart`);

      if (response.data?.success) {
        setCart([]);
        setCartIdData(null);
        setItemCount(0);
        setCartTotal(0);
        toast.success('Cart cleared successfully');
      } else {
        toast.error(response.data?.message || 'Failed to clear cart');
      }
    } catch (error) {
      console.error('Clear cart error:', error);
      toast.error(error.response?.data?.message || 'Failed to clear cart');
    } finally {
      setLoading(false);
    }
  };

  // Create order from cart
  const createOrder = async (shippingAddress, paymentMethod) => {
    if (!isLoggedIn) {
      toast.error('Please login to place an order');
      router.push('/login');
      return;
    }

    if (cart.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    try {
      const currentCurrency = getCurrency();
      const currentCountry = getCountry();
      console.log("Creating order with currency:", currentCurrency, "country:", currentCountry);
      
      setOrderProcessing(true);
      setLoading(true);
      
      // Calculate prices
      const taxRate = 0.1; // 10% tax
      const taxPrice = cartTotal * taxRate;
      const shippingPrice = cartTotal > 5000 ? 0 : 500; // Free shipping over 5000
      const totalPrice = cartTotal + taxPrice + shippingPrice;
      
      // Format order items according to required structure
      const orderItems = cart.map(item => ({
        product: item.productId,
        name: item.name,
        image: item.images && item.images.length > 0 ? item.images[0] : '/no-image.webp',
        price: item.price,
        quantity: item.quantity
      }));
      
      // Create order using the cart items
      const response = await axiosInstance.post(
        `/orders`, 
        {
          orderItems,
          shippingAddress,
          paymentMethod,
          taxPrice,
          shippingPrice,
          totalPrice,
          currency: currentCurrency,
          country: currentCountry
        }
      );

      if (response.data?.success) {
        // Clear the cart after successful order
        await clearCart();
        toast.success('Order placed successfully!');
        return response.data.data; // Return order data
      } else {
        toast.error(response.data?.message || 'Failed to place order');
        throw new Error(response.data?.message || 'Failed to place order');
      }
    } catch (error) {
      console.error('Create order error:', error);
      toast.error(error.response?.data?.message || 'Failed to place order');
      throw error;
    } finally {
      setOrderProcessing(false);
      setLoading(false);
    }
  };

  // Get cart items filtered by current currency - works for both guest and logged-in
  const getCartItemsByCurrency = useCallback(() => {
    const currentCurrency = normalizeCurrency(getCurrency());
    return cart.filter(item => normalizeCurrency(item.currency) === currentCurrency);
  }, [cart, getCurrency]);

  // Get total price for current currency - use cached calculation 
  const getCurrentCurrencyTotal = useCallback(() => {
    const filteredItems = getCartItemsByCurrency();
    return filteredItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  }, [getCartItemsByCurrency]);

  // Trigger a manual refresh of the cart data
  const refreshCart = useCallback(() => {
    if (!isRefreshing.current) {
      setForceRefresh(prev => prev + 1);
    }
  }, []);

  // Clear guest cart after successful checkout
  const clearGuestCartAfterCheckout = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem("guestCart");
      Cookies.remove("guestCart");
      // Also clear any related session data
      localStorage.removeItem("x-session-id");
    }
    setCart([]);
    setItemCount(0);
    setCartTotal(0);
    console.log('Guest cart cleared after successful checkout');
  }, []);

  return (
    <CartContext.Provider value={{ 
      cart, 
      cartTotal, 
      itemCount,
      loading,
      isLoggedIn,
      orderProcessing,
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart,
      clearGuestCartAfterCheckout,
      createOrder,
      checkAuthAndFetchCart,
      getCurrency,
      getCountry,
      getCartItemsByCurrency,
      getCurrentCurrencyTotal,
      refreshCart,
      cartIdData,
      currency,
    }}>
      {children}
    </CartContext.Provider>
  );
}

const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};

export { CartProvider, useCart };