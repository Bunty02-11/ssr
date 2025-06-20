"use client";
import { useMemo, useCallback, useState, useEffect, useRef } from "react";
import Image from "next/image";
import PropTypes from "prop-types";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import { useCart } from "../context/CartContext";
import { useUser } from "../context/UserContext";
import { logoutUser } from "../services/userService";
import { searchProducts } from "../services/productService";
import { useCountry } from '../context/CountryContext';
import { toast } from "react-hot-toast";
import { useWishlist } from "../context/WishlistContext";

const Navbar = ({
  className = "",
  navbarMargin,
  navbarPosition,
  navbarTop,
  navbarRight,
  navbarLeft,
  navbarBackgroundColor,
  logoSrc,
  search,
  account,
  sVG,
  onLogoClick,
  onMenuItemsContainerClick,
  onMenuItemsContainerClick1,
  onMenuItemsContainerClick3,
  bgcolour,
}) => {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isBrowser, setIsBrowser] = useState(false);
  const [windowWidth, setWindowWidth] = useState(0);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const accountDropdownRef = useRef(null);
  const accountButtonRef = useRef(null);
  const searchInputRef = useRef(null);
  const searchResultsRef = useRef(null);
  const searchButtonRef = useRef(null);
  const { itemCount, clearCart } = useCart();
  const { user, clearUser } = useUser();
  const { selectedCountry, updateCountry } = useCountry();
  const { wishlist } = useWishlist();
  const [collections, setCollections] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Carousel state
  const [currentAnnouncementIndex, setCurrentAnnouncementIndex] = useState(0);
  const [scrollData, setScrollData] = useState(null);
  const [announcements, setAnnouncements] = useState([]);

  // Breakpoints
  const TABLET_BREAKPOINT = 1050;

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const response = await fetch('https://0vm9jauvgc.execute-api.us-east-1.amazonaws.com/stag/api/categories/all');
        if (!response.ok) {
          throw new Error('Failed to fetch collections');
        }
        const data = await response.json();
        setCollections(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await fetch('https://0vm9jauvgc.execute-api.us-east-1.amazonaws.com/stag/api/movement/all');
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        const data = await response.json();
        setCategories(data.data);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };

    const fetchScrolls = async () => {
      try {
        const response = await fetch('https://0vm9jauvgc.execute-api.us-east-1.amazonaws.com/stag/api/scroll/scrolls');
        if (!response.ok) {
          throw new Error('Failed to fetch scrolls');
        }
        const data = await response.json();
        setScrollData(data[0]); // Assuming the first object contains all country data
      } catch (err) {
        console.error('Error fetching scrolls:', err);
        // Fallback to default announcements if API fails
        setAnnouncements([
          "Sale: 20% Off - Limited Time Only",
          "Free Shipping on Orders Over $100",
          "New Collection Available Now"
        ]);
      }
    };

    fetchCollections();
    fetchCategories();
    fetchScrolls();
  }, []);

  // Update announcements based on selected country
  useEffect(() => {
    if (scrollData && selectedCountry) {
      const countryScrolls = scrollData[selectedCountry]?.scrolls || [];
      const countryAnnouncements = countryScrolls.map(scroll => scroll.title);
      setAnnouncements(countryAnnouncements.length > 0 ? countryAnnouncements : [
        "Sale: 20% Off - Limited Time Only",
        "Free Shipping on Orders Over $100",
        "New Collection Available Now"
      ]);
      setCurrentAnnouncementIndex(0); // Reset to first announcement when country changes
    } else if (scrollData) {
      // Default to UAE if no country is selected
      const defaultScrolls = scrollData.uae?.scrolls || [];
      const defaultAnnouncements = defaultScrolls.map(scroll => scroll.title);
      setAnnouncements(defaultAnnouncements.length > 0 ? defaultAnnouncements : [
        "Sale: 20% Off - Limited Time Only",
        "Free Shipping on Orders Over $100",
        "New Collection Available Now"
      ]);
    }
  }, [scrollData, selectedCountry]);

  // Auto-rotate announcements
  useEffect(() => {
    if (announcements.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentAnnouncementIndex((prevIndex) => 
        (prevIndex + 1) % announcements.length
      );
    }, 4000); // Change every 4 seconds

    return () => clearInterval(interval);
  }, [announcements.length]);

  useEffect(() => {
    setIsBrowser(true);

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    if (typeof window !== 'undefined') {
      setWindowWidth(window.innerWidth);
      window.addEventListener('resize', handleResize);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', handleResize);
      }
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrolled]);

  const navbarStyle = useMemo(() => {
    return {
      margin: navbarMargin,
      position: navbarPosition || "fixed",
      top: navbarTop || "0",
      right: navbarRight || "0",
      left: navbarLeft || "0",
      backgroundColor: scrolled
        ? 'rgba(0, 0, 0, 0.5)'
        : navbarBackgroundColor || 'black',
      zIndex: 9990,
      transition: "background-color 0.3s ease, transform 0.3s ease",
      transform: scrolled ? "translateY(0)" : "translateY(0)",
      boxShadow: scrolled ? "0 4px 6px rgba(0, 0, 0, 0.1)" : "none",
    };
  }, [
    navbarMargin,
    navbarPosition,
    navbarTop,
    navbarRight,
    navbarLeft,
    navbarBackgroundColor,
    scrolled
  ]);

  const handleProductClick = (collectionId) => {
    router.push(`/collection?id=${collectionId}`);
  };

  const handleMovementClick = (collectionId) => {
    router.push(`/movement?id=${collectionId}`);
  };

  const handleCountryChange = (e) => {
    const newCountry = e.target.value;
    updateCountry(newCountry);
    if (typeof window !== 'undefined') {
      localStorage.setItem('selectedCountry', newCountry);
      const event = new CustomEvent('countryChange', { detail: { country: newCountry } });
      window.dispatchEvent(event);
    }
  };

  // Carousel navigation functions
  const goToPrevAnnouncement = () => {
    setCurrentAnnouncementIndex((prevIndex) => 
      prevIndex === 0 ? announcements.length - 1 : prevIndex - 1
    );
  };

  const goToNextAnnouncement = () => {
    setCurrentAnnouncementIndex((prevIndex) => 
      (prevIndex + 1) % announcements.length
    );
  };

  const handleProfileClick = useCallback(() => {
    setShowAccountDropdown(false);
  }, []);

  const handleLogout = useCallback(async () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (!confirmLogout) return;

    try {
      await logoutUser();
      clearUser();
      setShowAccountDropdown(false);
      clearCart();
      toast.success("Successfully logged out!");
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed. Please try again.");
    }
  }, [clearUser, clearCart, router]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Handle search dropdown
      const searchIconClicked = event.target.closest('[aria-label="Search products"]');
      if (!searchIconClicked) {
        if (searchResultsRef.current && !searchResultsRef.current.contains(event.target) &&
          searchInputRef.current && !searchInputRef.current.contains(event.target)) {
          setShowSearch(false);
          setSearchResults([]);
        }
      }

      // Handle account dropdown
      const accountIconClicked = event.target.closest('[aria-label="Account menu"]');
      const accountDropdown = accountDropdownRef.current;

      if (!accountIconClicked && accountDropdown && !accountDropdown.contains(event.target)) {
        setShowAccountDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (showSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showSearch]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.trim().length >= 3) {
        setIsSearching(true);
        try {
          const results = await searchProducts(searchQuery);
          if (results && Array.isArray(results)) {
            setSearchResults(results);
          } else {
            setSearchResults([]);
          }
        } catch (error) {
          console.error('Search error:', error);
          setSearchResults([]);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const logoVariants = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.5 } },
    hover: { scale: 1.05, transition: { duration: 0.2 } }
  };

  const menuVariants = {
    initial: { opacity: 0, y: -10 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
        duration: 0.3
      }
    }
  };

  const menuItemVariants = {
    initial: { opacity: 0, y: -10 },
    animate: { opacity: 1, y: 0 }
  };

  const iconVariants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
        delay: 0.5
      }
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`w-full h-30 overflow-hidden shrink-0 flex flex-col items-center justify-center box-border z-[50] text-center text-base text-[#fff] font-h5-24 navbar ${className}`}
      style={navbarStyle}
    >
      {/* Top announcement bar carousel */}
      <div className="w-full max-w-full text-black bg-white flex pr-[20px] md:pr-[40px] pl-[20px] md:pl-[40px] items-center justify-between">
        <div className="w-full max-w-[1360px] mx-auto flex px-[20px] md:px-[40px] items-center justify-between">
          <motion.div className="flex items-center">
            <motion.div 
              className="cursor-pointer p-2" 
              whileHover={{ scale: 1.1 }} 
              whileTap={{ scale: 0.9 }}
              onClick={goToPrevAnnouncement}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </motion.div>
          </motion.div>

          <motion.div
            className={`flex-1 flex flex-row items-center justify-around text-sm mx-auto`}
            variants={menuVariants}
            initial="initial"
            animate="animate"
            style={{ maxWidth: '800px' }}
          >
            <motion.div className="flex flex-row items-center justify-center py-1.5 px-3 transition-colors" variants={menuItemVariants}>
              <div className="relative leading-[150%] font-medium text-xs sm:text-sm">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={currentAnnouncementIndex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    {announcements[currentAnnouncementIndex]}
                  </motion.span>
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>

          <motion.div className="flex items-center">
            <motion.div 
              className="cursor-pointer p-2" 
              whileHover={{ scale: 1.1 }} 
              whileTap={{ scale: 0.9 }}
              onClick={goToNextAnnouncement}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Main navbar */}
      <div className="w-full max-w-full flex pt-3 pb-3 items-center justify-center">
        <div className="w-full max-w-[1360px] flex items-center pr-[40px] pl-[40px] justify-between">
          {/* Logo */}
          <motion.div variants={logoVariants} initial="initial" animate="animate" className="flex items-center">
            <Link href="/" onClick={onLogoClick}>
              <Image
                className="h-[40px] md:h-[50px] w-[90px] md:w-[110.3px] relative object-cover cursor-pointer"
                loading="lazy"
                width={110}
                height={50}
                alt="Tornado Logo"
                src={logoSrc}
              />
            </Link>
          </motion.div>

          {/* Mobile view icons (shown <= 1050px) */}
          {windowWidth <= TABLET_BREAKPOINT && (
            <div className="flex items-center space-x-4 ml-auto">
              {/* Search icon */}
              <div className="flex items-center justify-center">
                <button
                  ref={searchButtonRef}
                  className="bg-transparent border-0 p-0 cursor-pointer flex items-center justify-center"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowSearch(!showSearch);
                    if (!showSearch) {
                      setSearchQuery('');
                      setSearchResults([]);
                    }
                  }}
                  aria-label="Search products"
                >
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <Image
                      className="h-11 w-11 relative cursor-pointer"
                      loading="lazy"
                      width={44}
                      height={44}
                      alt="Search"
                      src={search}
                    />
                  </motion.div>
                </button>
              </div>

              {/* Cart icon */}
              <div className="flex items-center justify-center">
                <Link href="/cart">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="relative cursor-pointer flex items-center justify-center"
                  >
                    {itemCount > 0 && (
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-600 rounded-full flex items-center justify-center z-10">
                        <div className="text-white text-xs font-semibold">
                          {itemCount}
                        </div>
                      </div>
                    )}
                    <Image
                      className="h-6 w-6 relative cursor-pointer"
                      loading="lazy"
                      width={24}
                      height={24}
                      alt="Cart"
                      src={sVG}
                    />
                  </motion.div>
                </Link>
              </div>

              {/* Hamburger menu toggle */}
              <div className="flex items-center justify-center">
                <button
                  className="p-1 focus:outline-none bg-black rounded-md flex items-center justify-center"
                  onClick={() => setShowMobileMenu(!showMobileMenu)}
                  aria-label="Toggle mobile menu"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    {showMobileMenu ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    )}
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* Desktop menu items (shown > 1050px) */}
          {windowWidth > TABLET_BREAKPOINT && (
            <motion.div
              className="flex-1 flex flex-row items-center justify-center text-sm mx-auto"
              variants={menuVariants}
              initial="initial"
              animate="animate"
              style={{ marginLeft: '100px', marginRight: '0px', maxWidth: '800px' }}
            >
              <Link href="/about-us" className="no-underline" onClick={onMenuItemsContainerClick}>
                <motion.div
                  className="flex flex-row items-center justify-center py-1.5 px-3 cursor-pointer hover:text-gray-300 no-underline transition-colors"
                  variants={menuItemVariants}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="relative leading-[150%] font-medium text-white no-underline hover:no-underline">About Us</div>
                </motion.div>
              </Link>

              <Link href="/shop" className="no-underline" onClick={onMenuItemsContainerClick3}>
                <motion.div
                  className="flex flex-row items-center justify-center py-1.5 px-3 cursor-pointer hover:text-gray-300 no-underline transition-colors"
                  variants={menuItemVariants}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="relative leading-[150%] text-white no-underline hover:no-underline  font-medium">Shop</div>
                </motion.div>
              </Link>

              <Link href="/blog" className="no-underline" >
                <motion.div
                  className="flex flex-row items-center justify-center py-1.5 px-3 cursor-pointer hover:text-gray-300 no-underline transition-colors"
                  variants={menuItemVariants}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="relative leading-[150%] text-white no-underline hover:no-underline font-medium">Blog</div>
                </motion.div>
              </Link>

              {/* Collection dropdown */}
              <motion.div
                className="flex flex-row items-center justify-center py-1.5 px-3 gap-1 relative"
                variants={menuItemVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onMouseEnter={(e) => {
                  const dropdown = document.getElementById('collection-dropdown');
                  if (dropdown) {
                    const rect = e.currentTarget.getBoundingClientRect();
                    dropdown.style.left = `${rect.left}px`;
                    dropdown.style.display = 'block';
                    setTimeout(() => {
                      dropdown.style.opacity = '1';
                      dropdown.style.visibility = 'visible';
                    }, 10);
                  }
                }}
                onMouseLeave={() => {
                  setTimeout(() => {
                    const dropdown = document.getElementById('collection-dropdown');
                    if (dropdown) {
                      dropdown.style.opacity = '0';
                      dropdown.style.visibility = 'hidden';
                      setTimeout(() => {
                        if (dropdown.style.visibility === 'hidden') {
                          dropdown.style.display = 'none';
                        }
                      }, 300);
                    }
                  }, 100);
                }}
              >
                <div className="relative leading-[150%] font-medium cursor-pointer">
                  Collection
                </div>
              </motion.div>

              <div
                id="collection-dropdown"
                className="w-40 bg-gray-900 rounded-md shadow-lg py-2 absolute z-[9999] transition-all duration-200"
                style={{
                  display: 'none',
                  opacity: 0,
                  visibility: 'hidden',
                  top: '60px'
                }}
              >
                {collections.map((collection) => (
                  <Link
                    key={collection.id || collection._id || collection.name}
                    href={`/collection?id=${collection.id || collection._id || collection.name}`}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-white hover:bg-gray-800 no-underline hover:no-underline transition-colors"
                  >
                    {collection.image && (
                      <Image
                        src={collection.image}
                        alt={collection.name}
                        width={24}
                        height={24}
                        className="rounded-full object-cover"
                      />
                    )}
                    <span>{collection.name}</span>
                  </Link>
                ))}
              </div>

              {/* Category dropdown */}
              <motion.div
                className="flex flex-row items-center justify-center py-1.5 px-3 gap-1 relative"
                variants={menuItemVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onMouseEnter={(e) => {
                  const dropdown = document.getElementById('category-dropdown');
                  if (dropdown) {
                    const rect = e.currentTarget.getBoundingClientRect();
                    dropdown.style.left = `${rect.left}px`;
                    dropdown.style.display = 'block';
                    setTimeout(() => {
                      dropdown.style.opacity = '1';
                      dropdown.style.visibility = 'visible';
                    }, 10);
                  }
                }}
                onMouseLeave={(e) => {
                  setTimeout(() => {
                    const dropdown = document.getElementById('category-dropdown');
                    if (dropdown) {
                      dropdown.style.opacity = '0';
                      dropdown.style.visibility = 'hidden';
                      setTimeout(() => {
                        if (dropdown.style.visibility === 'hidden') {
                          dropdown.style.display = 'none';
                        }
                      }, 300);
                    }
                  }, 100);
                }}
              >
                <div className="relative leading-[150%] font-medium cursor-pointer">
                  Category
                </div>
              </motion.div>

              <div
                id="category-dropdown"
                className="w-40 bg-gray-900 rounded-md shadow-lg py-2 absolute z-[9999] transition-all duration-200"
                style={{
                  display: 'none',
                  opacity: 0,
                  visibility: 'hidden',
                  top: '60px'
                }}
              >
                {categories.map((category) => (
                  <Link
                    key={category.id || category._id || category.name}
                    href={`/movement?id=${category.id || category._id || category.name}`}
                    className="flex items-center text-center gap-2 px-4 py-2 text-sm text-white no-underline hover:no-underline hover:bg-gray-800 transition-colors"
                  >
                    <span>{category.name}</span>
                  </Link>
                ))}
              </div>
            </motion.div>
          )}

          {/* Desktop icons (shown > 1050px) */}
          {windowWidth > TABLET_BREAKPOINT && (
            <motion.div
              className="flex flex-row items-center justify-center text-left text-[13px] gap-1"
              variants={iconVariants}
              initial="initial"
              animate="animate"
            >
              <div className="relative z-[9999]">
                <button
                  ref={searchButtonRef}
                  className="bg-transparent border-0 p-0 cursor-pointer flex items-center justify-center"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowSearch(!showSearch);
                    if (!showSearch) {
                      setSearchQuery('');
                      setSearchResults([]);
                    }
                  }}
                  aria-label="Search products"
                >
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <Image
                      className="h-11 w-11 relative cursor-pointer"
                      loading="lazy"
                      width={44}
                      height={44}
                      alt="Search"
                      src={search}
                    />
                  </motion.div>
                </button>
              </div>

              <div className="relative">
                <motion.button
                  ref={accountButtonRef}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center justify-center bg-transparent border-none cursor-pointer p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowAccountDropdown(!showAccountDropdown);
                  }}
                  aria-label="Account menu"
                >
                  <Image
                    className="h-11 w-11 relative"
                    loading="lazy"
                    width={44}
                    height={44}
                    alt="Account"
                    src={account}
                  />
                </motion.button>
              </div>

              <Link href="/profile/wishlist">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="relative"
                >
                  <div className="relative">
                    <Image
                      className="h-11 w-11 relative"
                      loading="lazy"
                      width={44}
                      height={44}
                      alt="wish"
                      src="/wish.svg"
                    />
                    {wishlist && wishlist.length > 0 && (
                      <div className="absolute -top-[-11px] -right-[-2px] w-5 h-5 bg-red-600 rounded-full flex items-center justify-center z-20">
                        <div className="text-white text-xs font-semibold">
                          {wishlist.length}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              </Link>

              <Link href="/cart">
                <motion.div
                  className="w-11 flex flex-col items-center justify-center pt-0 pb-[5px] pl-[11px] pr-[6.1px] box-border relative cursor-pointer"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {itemCount > 0 && (
                    <div className="absolute top-0 right-0 w-5 h-5 bg-red-600 rounded-full flex items-center justify-center z-10">
                      <div className="text-white text-xs font-semibold">
                        {itemCount}
                      </div>
                    </div>
                  )}
                  <Image
                    className="w-[22px] h-[22px] relative z-[1]"
                    loading="lazy"
                    width={22}
                    height={22}
                    alt="Cart"
                    src={sVG}
                  />
                </motion.div>
              </Link>
            </motion.div>
          )}
        </div>
      </div>

      {/* Mobile menu (shown <= 1050px) */}
      {showMobileMenu && windowWidth <= TABLET_BREAKPOINT && isBrowser && createPortal(
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[9999]" onClick={() => setShowMobileMenu(false)}>
          <div
            className="fixed top-0 right-0 h-full w-[280px] bg-black border-l border-gray-800/50 overflow-y-auto shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-5 border-b border-gray-800/50">
              <h2 className="text-lg font-semibold text-white">Menu</h2>
              <button
                onClick={() => setShowMobileMenu(false)}
                className="w-8 h-8 flex items-center justify-center bg-white text-black rounded-full transition-colors focus:outline-none"
                aria-label="Close menu"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="p-4 border-b border-gray-800/50">
              <div className="flex items-center justify-between space-x-4">
                <select
                  value={selectedCountry}
                  onChange={handleCountryChange}
                  className="flex-1 text-white bg-black rounded-lg px-3 py-3 pr-8 outline-none cursor-pointer border border-white transition-colors appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PHBhdGggZD0ibTYgOSA2IDYgNi02Ii8+PC9zdmc+')] bg-no-repeat bg-[right_0.75rem_center]"
                >
                  <option className="text-white bg-black" value="">Country</option>
                  <option className="text-white bg-black" value="india">INR</option>
                  <option className="text-white bg-black" value="uae">AED</option>
                  <option className="text-white bg-black" value="ksa">SAR</option>
                  <option className="text-white bg-black" value="kuwait">KWD</option>
                  <option className="text-white bg-black" value="qatar">QAR</option>
                </select>
                <div className="flex items-center gap-2 text-white bg-black rounded-lg px-4 py-2 border border-solid-1px border-white transition-colors">
                  <span>EN</span>
                  <Image
                    className="h-4 w-4 opacity-75"
                    loading="lazy"
                    width={16}
                    height={16}
                    alt="iconamoonarrowup2light@2x"
                    src="/iconamoonarrowup2light@2x.webp"
                  />
                </div>
              </div>
            </div>

            <div className="py-4">
              <Link
                href="/about-us"
                className="block py-4 px-6 text-white no-underline hover:bg-gray-800 transition-colors border-b border-gray-800"
                onClick={() => setShowMobileMenu(false)}
              >
                About Us
              </Link>
              <Link
                href="/shop"
                className="block py-4 px-6 text-white no-underline hover:bg-gray-800 transition-colors border-b border-gray-800"
                onClick={() => setShowMobileMenu(false)}
              >
                Shop
              </Link>
              <Link
                href="/blog"
                className="block py-4 px-6 text-white no-underline hover:bg-gray-800 transition-colors border-b border-gray-800"
                onClick={() => setShowMobileMenu(false)}
              >
                Blog
              </Link>

              <div className="border-b border-gray-800">
                <div
                  className="flex justify-between items-center py-4 px-6 text-white hover:bg-gray-800 cursor-pointer"
                  onClick={(e) => {
                    const collectionsList = document.getElementById('mobile-collections-list');
                    if (collectionsList) {
                      collectionsList.classList.toggle('hidden');
                    }
                  }}
                >
                  <span>Collection</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
                <div id="mobile-collections-list" className="hidden">
                  {collections.map((collection) => (
                    <div
                      key={collection.id || collection._id || collection.name}
                      className="py-3 px-10 text-sm text-gray-300 hover:text-white hover:bg-gray-800 cursor-pointer"
                      onClick={() => {
                        handleProductClick(collection.id || collection._id || collection.name);
                        setShowMobileMenu(false);
                      }}
                    >
                      {collection.name}
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-b border-gray-800">
                <div
                  className="flex justify-between items-center py-4 px-6 text-white hover:bg-gray-800 cursor-pointer"
                  onClick={() => {
                    const categoriesList = document.getElementById('mobile-categories-list');
                    if (categoriesList) {
                      categoriesList.classList.toggle('hidden');
                    }
                  }}
                >
                  <span>Category</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
                <div id="mobile-categories-list" className="hidden">
                  {categories.map((category) => (
                    <div
                      key={category.id || category._id || category.name}
                      className="py-3 px-10 text-sm text-gray-300 hover:text-white hover:bg-gray-800 cursor-pointer"
                      onClick={() => {
                        handleMovementClick(category.id || category._id || category.name);
                        setShowMobileMenu(false);
                      }}
                    >
                      {category.name}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                {user ? (
                  <>
                    <Link
                      href="/profile"
                      className="block py-4 px-6 text-white no-underline hover:bg-gray-800 transition-colors border-b border-gray-800"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      My Profile
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setShowMobileMenu(false);
                      }}
                      className="w-full text-left py-4 px-6 text-red-400 hover:bg-gray-800 transition-colors border-b border-gray-800"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="block py-4 px-6 text-white no-underline hover:bg-gray-800 transition-colors border-b border-gray-800"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      Login
                    </Link>
                    <Link
                      href="/register"
                      className="block py-4 px-6 text-white no-underline hover:bg-gray-800 transition-colors border-b border-gray-800"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      Register
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Account dropdown */}
      <AnimatePresence>
        {showAccountDropdown && (
          <motion.div
            ref={accountDropdownRef}
            className={`fixed w-52 bg-gray-900 rounded-md shadow-2xl py-2 text-white border border-gray-700 ${
              windowWidth <= TABLET_BREAKPOINT 
                ? 'top-24 left-1/2 transform -translate-x-1/2' 
                : 'top-24'
            }`}
            style={{ 
              zIndex: 9999,
              ...(windowWidth > TABLET_BREAKPOINT && accountButtonRef.current ? {
                left: `${accountButtonRef.current.getBoundingClientRect().left - 20}px`
              } : {})
            }}
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {user ? (
              <>
                <div className="px-4 py-2 border-b border-gray-700 mb-1">
                  <p className="text-sm font-medium text-gray-300">Signed in as</p>
                  <p className="text-sm font-bold truncate">{user.name}</p>
                </div>
                <Link
                  href="/profile"
                  className="flex items-center px-4 py-2 text-sm no-underline hover:no-underline text-gray-300 hover:bg-gray-800 transition-colors"
                  onClick={() => {
                    setShowAccountDropdown(false);
                    handleProfileClick();
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  My Profile
                </Link>
                <Link
                  href="/profile/orders"
                  className="flex items-center px-4 py-2 text-sm no-underline hover:no-underline text-gray-300 hover:bg-gray-800 transition-colors"
                  onClick={() => setShowAccountDropdown(false)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  Order History
                </Link>
                <Link
                  href="/profile/wishlist"
                  className="flex items-center px-4 py-2 text-sm no-underline hover:no-underline text-gray-300 hover:bg-gray-800 transition-colors"
                  onClick={() => setShowAccountDropdown(false)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  Wishlist
                </Link>
                <div className="border-t border-gray-700 my-1"></div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center px-4 py-2 text-sm text-red-400 hover:bg-gray-800 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="flex items-center px-4 py-2 text-sm no-underline hover:no-underline text-gray-300 hover:bg-gray-800 transition-colors"
                  onClick={() => setShowAccountDropdown(false)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  Login
                </Link>
                <Link
                  href="/register"
                  className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 no-underline hover:no-underline transition-colors"
                  onClick={() => setShowAccountDropdown(false)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  Register
                </Link>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search dropdown */}
      {isBrowser && showSearch && createPortal(
        <div
          className="fixed inset-0 bg-transparent bg-opacity-50 z-[9999]"
          onClick={() => setShowSearch(false)}
        >
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className={`fixed z-[10000] pointer-events-none ${
              windowWidth <= TABLET_BREAKPOINT 
                ? 'top-[80px] left-1/2 transform -translate-x-1/2' 
                : 'top-[80px]'
            }`}
            style={{
              ...(windowWidth > TABLET_BREAKPOINT && searchButtonRef.current ? {
                left: `${searchButtonRef.current.getBoundingClientRect().left - 20}px`
              } : {})
            }}
            onClick={(e) => e.stopPropagation()}
            ref={searchResultsRef}
          >
            <div className="pointer-events-auto">
              <div className={`${
                windowWidth <= TABLET_BREAKPOINT 
                  ? 'w-[280px] sm:w-[320px]' 
                  : 'w-[320px]'
              }`}>
                <div className="relative p-4 pb-2 flex items-center bg-transparent rounded-t-2xl">
                  <span className="pointer-events-none absolute left-8 top-1/2 -translate-y-1/2 flex items-center text-gray-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <circle cx="11" cy="11" r="8" />
                      <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                  </span>
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-10 py-3 bg-white text-black border-0 rounded-full shadow focus:outline-none focus:ring-2 focus:ring-black transition-all text-base"
                    autoFocus
                  />
                  {searchQuery && (
                    <button
                      className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
                      onClick={() => setSearchQuery('')}
                      aria-label="Clear search"
                      tabIndex={0}
                      type="button"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  )}
                </div>
                {(searchQuery.trim().length > 0) && (
                  <div className="max-h-96 overflow-y-auto px-2 pb-2 bg-white rounded-b-2xl">
                    {isSearching ? (
                      <div className="p-4 text-center text-gray-400">
                        <svg className="animate-spin h-5 w-5 mx-auto mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Searching...
                      </div>
                    ) : searchResults.length > 0 ? (
                      <div>
                        {searchResults.map((product, index) => {
                          const productId = product.id || product._id || `product-${index}`;
                          const productName = product.name?.en || (typeof product.name === 'string' ? product.name : '') || product.title?.en || (typeof product.title === 'string' ? product.title : '') || 'Product';
                          const imageUrl = product.imageLinks?.image1 || product.image || product.imageUrl || product.img || product.thumbnail;

                          return (
                            <div
                              key={productId}
                              className="p-3 hover:bg-gray-100 rounded-xl cursor-pointer flex items-center border-t border-gray-200 first:border-t-0 transition-colors"
                              onClick={() => {
                                setShowSearch(false);
                                setSearchQuery('');
                                window.location.href = `/products-details?productId=${productId}`;
                              }}
                            >
                              {imageUrl && (
                                <div className="w-12 h-12 mr-4 flex-shrink-0 overflow-hidden rounded-lg bg-gray-200">
                                  <Image
                                    src={imageUrl}
                                    alt={productName}
                                    width={48}
                                    height={48}
                                    className="object-cover w-full h-full"
                                  />
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="text-base text-black truncate font-medium">{productName}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : searchQuery.trim().length >= 3 ? (
                      <div className="p-4 text-center text-gray-400">
                      No products found
                      </div>
                    ) : (
                      <div className="p-4 text-center text-gray-400">
                      Type at least 3 characters to search
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>,
        document.body
      )}
    </motion.section>
  );
};

Navbar.propTypes = {
  className: PropTypes.string,
  logoSrc: PropTypes.string.isRequired,
  search: PropTypes.string.isRequired,
  account: PropTypes.string.isRequired,
  sVG: PropTypes.string.isRequired,
  navbarMargin: PropTypes.string,
  navbarPosition: PropTypes.string,
  navbarTop: PropTypes.string,
  navbarRight: PropTypes.string,
  navbarLeft: PropTypes.string,
  navbarBackgroundColor: PropTypes.string,
  onLogoClick: PropTypes.func,
  onMenuItemsContainerClick: PropTypes.func,
  onMenuItemsContainerClick1: PropTypes.func,
  onMenuItemsContainerClick3: PropTypes.func,
};

export default Navbar;