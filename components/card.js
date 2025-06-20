"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import PropTypes from "prop-types";
import { useCart } from "../context/CartContext";
import { toast } from "react-hot-toast";
import { useWishlist } from "../context/WishlistContext";
import { useUser } from "../context/UserContext";

const Card = ({
  className = "",
  images,
  hoverImage,
  classic,
  name,
  icroundStar,
  price,
  originalPrice,
  dialColor,
  productId,
  stock,
  _id,
  country,
  discountPrice,
  rating,
}) => {
  const { addToCart } = useCart();
  const { user } = useUser();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [showActions, setShowActions] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [deviceType, setDeviceType] = useState("desktop"); // 'desktop', 'tablet', or 'mobile'

  // Check device type
  useEffect(() => {
    const checkDeviceType = () => {
      const width = window.innerWidth;
      if (width <= 768) {
        setDeviceType("mobile");
      } else if (width <= 1050) {
        setDeviceType("tablet");
      } else {
        setDeviceType("desktop");
      }
    };

    checkDeviceType();
    window.addEventListener('resize', checkDeviceType);

    return () => window.removeEventListener('resize', checkDeviceType);
  }, []);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      productId: _id || productId,
      name: name?.en || name || "",
      price,
      images: [images],
      quantity: 1,
    });
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();

    let priceObj = price;
    if (typeof price === "string" || typeof price === "number") {
      if (typeof _id === "string" && window && window.__ALL_PRODUCTS__) {
        // Optional: If you have a global product list, you could fetch the full object here
      }
    }

    const product = {
      _id: _id || productId,
      name: name?.en || name || "",
      price: priceObj,
      imageLinks: { image1: images },
      watchDetails: { watchType: { en: classic } },
      classic,
      dialColor
    };

    if (isInWishlist(_id || productId)) {
      removeFromWishlist(_id || productId);
    } else {
      addToWishlist(product);
    }
  };

  const handleProductClick = (e) => {
    // Prevent default since we'll use Link component
    e.preventDefault();
  };

  // Show actions based on device type and hover state
  const shouldShowActions = 
    deviceType === "mobile" || 
    (deviceType === "tablet" && showActions) || 
    (deviceType === "desktop" && showActions);

  // Check for stock
  const countryKey = country.toLowerCase();

  
  // Add null/undefined check for stock object
  if (stock && typeof stock === "object" && countryKey) {
    const originalStock = stock; // Keep reference to original stock object
    stock = stock[countryKey];
    
    // fallback to first available stock if not found
    if (typeof stock === "undefined" && Object.keys(originalStock).length > 0) {
      stock = Object.values(originalStock)[0];
    }
  }
  
  // Convert stock to number if it's a string
  if (typeof stock === "string") {
    stock = parseInt(stock, 10);
  }
  
  // Default to 0 if stock is still null/undefined
  if (stock === null || stock === undefined) {
    stock = 0;
  }

  const isOutOfStock = !stock || stock <= 0;

  const formatPriceDisplay = (price, discountPrice, country) => {
    if (!discountPrice || discountPrice === "0" || discountPrice === 0) {
      return <span className="text-[15px]"> {price}</span>;
    }

    return (
      <div className="flex items-center gap-2">
        <span className="text-[15px] text-black">
          {discountPrice}
        </span>
        <span className="text-[13px] line-through text-gray-500">
          {price}
        </span>
      </div>
    );
  };

  return (
    <Link
      href={`/products-details?productId=${_id || productId}`}
      className={`card-container w-full rounded-lg bg-gray-100 shadow-md overflow-hidden flex flex-col items-center justify-start text-center text-xs font-h5-24 relative cursor-pointer shadow-sm no-underline hover:shadow-md transition-shadow duration-300 focus:outline-none ${className}`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
      onTouchStart={() => deviceType !== "desktop" && setShowActions(true)}
      tabIndex={0}
      style={{
        minHeight: '18rem',
        aspectRatio: '320/480',
        contain: 'layout style paint'
      }}
    >
      <div className="self-stretch relative h-[290px] mq1050:h-[220px] mq750:h-[200px] mq450:h-[140px] overflow-hidden shrink-0">
        <div className="w-full h-full relative flex flex-col pt-[12px] pb-[12px]">
          <Image
            className={`relative h-[calc(100%-20px)] w-full max-w-full overflow-hidden max-h-full object-contain transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
            loading="eager"
            priority={true}
            width={290}
            height={290}
            alt={name || "Product Image"}
            src={imageError ? "/no-image.webp" : (showActions && hoverImage ? hoverImage : images || "/no-image.webp")}
            onLoad={() => setImageLoaded(true)}
            onError={() => {
              setImageError(true);
              setImageLoaded(true);
            }}
          />
        </div>

        {imageLoaded && (
          <div className="absolute top-[16px] right-[16px] rounded-full bg-white flex flex-row items-center justify-center py-1 px-3.5 text-white mq450:py-0.5 mq450:px-1 mq450:top-[10px] mq450:right-[10px] mq450:gap-[2px]">
            <Image
              className="h-4 w-4 relative overflow-hidden shrink-0 mq450:h-2 mq450:w-2"
              loading="lazy"
              width={12}
              height={12}
              alt="Rating"
              src={icroundStar}
            />
            <div className="relative leading-[150%] text-black font-medium mq450:text-xs">{rating}</div>
          </div>
        )}
      </div>

      <div className="self-stretch flex h-[130px] mq1050:h-[130px] mq750:h-[130px] mq450:h-[100px] flex-col items-center justify-center py-[24px] px-[16px] gap-[8px] mq450:p-2 text-left no-underline ">
        <div className="self-stretch relative leading-[150%] font-medium text-gray-500 text-sm">
          {classic}
        </div>
        <div className="self-stretch relative text-base mq750:text-sm mq450:text-xs text-black leading-[150%] font-500 cursor-pointer whitespace-nowrap overflow-hidden text-ellipsis hover:underline focus:text-black focus:no-underline mq450:pb-[16px]"
          title={name && name.length > 200 ? name : undefined}
        >
          {typeof name === "object"
            ? name?.en && name.en.length > 200
              ? `${name.en.substring(0, 200)}...`
              : name.en
            : name && name.length > 200
              ? `${name.substring(0, 200)}...`
              : name}
        </div>
        <div className="self-stretch relative text-[18px] mq750:text-sm mq450:text-xs text-black leading-[150%] font-500 whitespace-nowrap overflow-hidden text-ellipsis cursor-pointer">
          {dialColor}
        </div>
        <div className="self-stretch flex items-center justify-between gap-2">
          <span className="text-[15px] mq750:text-sm mq450:text-xs text-black leading-[150%] font-500">
            {formatPriceDisplay(price, discountPrice, country)}
          </span>
          
          {/* Show actions on mobile and tablet (price and buttons in same row) */}
          {(deviceType === "mobile" || deviceType === "tablet") && (
            <div className="flex items-center gap-0">
              {!isOutOfStock ? (
                <>
                  <button
                    onClick={handleAddToCart}
                    className="p-2 rounded-full text-black hover:text-gray-800 transition-colors flex items-center justify-center"
                    style={{ background: "none" }}
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
                        strokeWidth={2}
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={handleWishlist}
                    className={`p-2 rounded-full transition-colors bg-white flex items-center justify-center ${isInWishlist(_id || productId)
                      ? 'text-red-500 hover:text-red-600'
                      : 'text-black hover:text-gray-900'}`}
                    style={{ background: "none" }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill={isInWishlist(_id || productId) ? "currentColor" : "none"}
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 21.364l-7.682-7.682a4.5 4.5 0 010-6.364z"
                      />
                    </svg>
                  </button>
                </>
              ) : (
                <span className="text-red-500 text-sm font-semibold ml-2">Out of Stock</span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Desktop hover actions - also shown on tablet when hovered */}
      {deviceType !== "mobile" && shouldShowActions && (
        <div className="absolute inset-0 flex items-center justify-center gap-4 mq450:gap-1 mq450:flex-col">
          {isOutOfStock ? (
            <div className="bg-gray-300 text-red-600 py-2 px-6 rounded-full font-medium text-sm cursor-not-allowed select-none">
              Out of Stock
            </div>
          ) : (
            <>
              <button
                onClick={handleAddToCart}
                className="bg-black text-white py-2 px-6 mq750:px-4 mq450:px-2 mq450:py-1 rounded-full font-medium transition-colors z-10 text-sm mq450:text-[10px] cursor-pointer focus:outline-none flex items-center gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                Add to Cart
              </button>
              <button
                onClick={handleWishlist}
                className={`p-3 mq450:p-1.5 rounded-full hover:bg-gray-200 transition-colors h-10 w-10 mq450:h-6 mq450:w-6 z-10 flex items-center justify-center cursor-pointer focus:outline-none bg-white shadow ${isInWishlist(_id || productId) ? 'text-red-500' : 'text-black'}`}
                aria-label={isInWishlist(_id || productId) ? "Remove from Wishlist" : "Add to Wishlist"}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mq450:h-4 mq450:w-4"
                  fill={isInWishlist(_id || productId) ? "currentColor" : "none"}
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 21.364l-7.682-7.682a4.5 4.5 0 010-6.364z"
                  />
                </svg>
              </button>
            </>
          )}
        </div>
      )}
    </Link>
  );
};

Card.propTypes = {
  className: PropTypes.string,
  images: PropTypes.string.isRequired,
  hoverImage: PropTypes.string,
  classic: PropTypes.string,
  name: PropTypes.string,
  icroundStar: PropTypes.string,
  price: PropTypes.number.isRequired,
  originalPrice: PropTypes.number,
  dialColor: PropTypes.string,
  productId: PropTypes.string,
  _id: PropTypes.string,
};

export default Card;