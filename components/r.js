"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import PropTypes from "prop-types";
import { useRouter } from "next/navigation";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { toast } from "react-hot-toast";
import AnimateOnScroll from "../components/AnimateOnScroll";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

const R = ({ className = "", product, relatedProducts, selectedCountry }) => {
  const router = useRouter();
  const { addToCart, isLoggedIn } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(null);
  const [addedToCart, setAddedToCart] = useState(false);
  const [showNotifyModal, setShowNotifyModal] = useState(false);
  const [notifyForm, setNotifyForm] = useState({ name: "", email: "", phone: "" });
  const [notifySubmitted, setNotifySubmitted] = useState(false);

  useEffect(() => {
    if (product?.watchDetails?.dialColor?.en) {
      setSelectedColor(product.watchDetails.dialColor.en);
    }
    setAddedToCart(false);
  }, [product]);

  const getCurrencySymbol = (selectedCountry) => {
    if (!selectedCountry) return '$';
    const countryUpper = selectedCountry.toUpperCase();
    switch (countryUpper) {
      case 'INDIA': return '₹';
      case 'UAE': return 'AED';
      case 'KSA': return 'SR';
      case 'KUWAIT': return 'KD';
      case 'QATAR': return 'QAR';
      default: return '$';
    }
  };

  const getCountryPrice = (priceObj) => {
    if (!priceObj || typeof priceObj !== 'object') return '';
    if (!selectedCountry) return Object.values(priceObj)[0] || '';
    const countryKey = selectedCountry.toLowerCase();
    return priceObj[countryKey] || Object.values(priceObj)[0] || '';
  };

  const getDiscountPrice = (priceObj) => {
    if (!priceObj || typeof priceObj !== 'object') return null;
    if (!selectedCountry) return Object.values(priceObj)[0] || null;
    const countryKey = selectedCountry.toLowerCase();
    return priceObj[countryKey] || Object.values(priceObj)[0] || null;
  };

  const formatPriceDisplay = (price, discountPrice, currencySymbol) => {
    if (!discountPrice || discountPrice === "0" || discountPrice === 0) {
      return <span className="text-5xl">{currencySymbol} {price}</span>;
    }
    return (
      <div className="flex items-end gap-3">
        <span className="text-5xl text-black">
          {currencySymbol} {discountPrice}
        </span>
        <span className="text-[16px] line-through text-gray-500">
          {currencySymbol} {price}
        </span>
      </div>
    );
  };

  const productPrice = getCountryPrice(product?.price);
  const discountPrice = getDiscountPrice(product?.discountPrice);
  const currencySymbol = getCurrencySymbol(selectedCountry);
  const displayPrice = productPrice ? formatPriceDisplay(productPrice, discountPrice, currencySymbol) : '';

  const handleAddToCart = () => {
    if (product) {
      let countryPrice = product.price;
      let countryDiscountPrice = product.discountPrice;
      if (product.price && typeof product.price === "object" && selectedCountry) {
        const countryKey = selectedCountry.toLowerCase();
        countryPrice = product.price[countryKey] || Object.values(product.price)[0] || "";
        countryDiscountPrice = product.discountPrice?.[countryKey] || Object.values(product.discountPrice || {})[0] || "";
      }

      const cartItem = {
        productId: product._id || product.id,
        name: product.name?.en || product.name || "",
        price: countryPrice,
        discountPrice: countryDiscountPrice && countryDiscountPrice !== "0" ? countryDiscountPrice : null,
        images: product.imageLinks ? Object.values(product.imageLinks) : [product.imageLinks?.image1],
        image: product.imageLinks?.image1,
        quantity: quantity,
      };

      addToCart(cartItem);
      toast.success("Added to cart successfully!");
      setAddedToCart(true);
    }
  };

  const handleBuyNow = () => {
    if (product) {
      if (!isLoggedIn) {
        if (typeof window !== "undefined") {
          localStorage.setItem(
            "pendingCartItem",
            JSON.stringify({
              productId: product._id || product.id,
              name: product?.name?.en || product.name,
              price: product.price,
              discountPrice: product.discountPrice,
              images: product.images || [product.image],
              quantity: quantity,
            })
          );
        }
        toast.error("Please login to proceed with checkout");
        router.push("/login");
        return;
      }

      let countryPrice = product.price;
      let countryDiscountPrice = product.discountPrice;
      if (product.price && typeof product.price === "object" && selectedCountry) {
        const countryKey = selectedCountry.toLowerCase();
        countryPrice = product.price[countryKey] || Object.values(product.price)[0] || "";
        countryDiscountPrice = product.discountPrice?.[countryKey] || Object.values(product.discountPrice || {})[0] || "";
      }

      addToCart({
        productId: product._id || product.id,
        name: product.name?.en || product.name || "",
        price: countryPrice,
        discountPrice: countryDiscountPrice && countryDiscountPrice !== "0" ? countryDiscountPrice : null,
        images: product.imageLinks ? Object.values(product.imageLinks) : [product.imageLinks?.image1],
        image: product.imageLinks?.image1,
        quantity: quantity,
      });
      router.push("/cart");
    }
  };

  const increaseQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleColorSelect = (relatedProduct) => {
    router.push(`/products-details?productId=${relatedProduct._id}`);
  };

  const handleWishlist = () => {
    if (!product) return;
    const prodId = product._id || product.id;
    if (!prodId) return;
    const prod = {
      _id: prodId,
      name: product.name?.en || product.name || "",
      price: product.price,
      discountPrice: product.discountPrice,
      imageLinks: product.imageLinks,
      watchDetails: product.watchDetails,
      classic: product.classic,
      dialColor: product.dialColor,
    };
    if (isInWishlist && isInWishlist(prodId)) {
      removeFromWishlist(prodId);
    } else if (addToWishlist) {
      addToWishlist(prod);
    }
  };

  let stock;
  if (product?.stock && typeof product.stock === "object" && selectedCountry) {
    const countryKey = selectedCountry.toLowerCase();
    stock = product.stock[countryKey];
    if (typeof stock === "undefined") {
      stock = Object.values(product.stock)[0];
    }
  } else if (typeof product?.stock === "number") {
    stock = product.stock;
  } else if (typeof product?.stock === "string") {
    stock = parseInt(product.stock, 10);
  } else if (typeof product?.quantity === "number") {
    stock = product.quantity;
  } else if (typeof product?.quantity === "string") {
    stock = parseInt(product.quantity, 10);
  } else {
    stock = undefined;
  }

  const isOutOfStock = !stock || stock <= 0;

  const handleNotifySubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: notifyForm.name,
        email: notifyForm.email,
        phone: notifyForm.phone,
        productId: product?._id || product?.id
      };
      const res = await fetch("https://0vm9jauvgc.execute-api.us-east-1.amazonaws.com/stag/api/notify/notify-me", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        throw new Error("Failed to submit notification request. Please try again.");
      }
      setNotifySubmitted(true);
      toast.success("You will be notified when the product is back in stock!");
      setNotifyForm({ name: "", email: "", phone: "" });
      setTimeout(() => {
        setShowNotifyModal(false);
        setNotifySubmitted(false);
      }, 2000);
    } catch (err) {
      toast.error(err.message || "Something went wrong.");
    }
  };
  return (
    <div
      className={`self-stretch flex flex-col items-start justify-start gap-4 text-left text-base text-[#000] font-H5-24 ${className}`}
    >
      <div className="self-stretch border-[rgba(0,0,0,0.08)] border-solid border-b-[1px] flex flex-col items-start justify-start !pt-0 !pb-3.5 !pl-0 !pr-0 gap-4">
        <div className="self-stretch flex flex-col items-start justify-start gap-4">
          <div className="self-stretch flex flex-col items-start justify-start gap-4">
            {product?.collection?.name && (
              <div className="w-[596px] relative leading-[150%] font-medium flex items-center">
                {product?.collection?.name}
              </div>
            )}
            <h1 className="!m-0 self-stretch relative text-21xl leading-[120%] font-medium font-[inherit] mq450:text-5xl mq450:leading-[29px] mq1050:text-13xl mq1050:leading-[38px]">
              {product?.name?.en}
            </h1>
            <div className="self-stretch flex flex-row items-center justify-start gap-3 mq750:flex-wrap">
              <Image
                className="w-24 relative h-4"
                width={96}
                height={16}
                alt=""
                src="/review.svg"
              />
              <div className="flex-1 relative leading-[150%] font-medium inline-block min-w-[111px]">
                SKU:{product?.sku?.en}
              </div>
            </div>
          </div>
          <div className="w-[701px] h-px relative border-[rgba(0,0,0,0.08)] border-solid border-t-[1px] box-border" />
          <div className="self-stretch flex flex-row items-center justify-center gap-2.5 text-5xl mq750:flex-wrap">
            <div className="flex-1 relative leading-[140%] inline-block min-w-[224px] mq450:text-[19px] mq450:leading-[27px]">
              {displayPrice}
            </div>
            <div className={`flex-1 relative text-base leading-[150%] font-medium text-right inline-block min-w-[224px] ${isOutOfStock ? "text-red-600" : ""}`}>
              {isOutOfStock ? "Out of Stock" : "In Stock"}
            </div>
          </div>
        </div>
        <div className="self-stretch relative text-sm leading-[150%] font-medium">
          {/* {product?.features} */}
        </div>
      </div>
      <div className="flex flex-row items-center justify-start gap-5 text-center">
        <div className="relative text-lg font-medium text-left">Color:</div>

        {Array.isArray(relatedProducts) && relatedProducts.length > 0 ? (
          <div className="w-full">
            {/* Desktop view - show as slider only when more than 4 items */}
            <div className="hidden md:block">
              {relatedProducts.length > 4 ? (
                <Swiper
                  modules={[Navigation]}
                  spaceBetween={16}
                  slidesPerView={4.5}
                  navigation
                  className="color-swiper"
                >
                  {relatedProducts.map((relatedProduct) => {
                    const colorName = relatedProduct?.watchDetails?.dialColor?.en || "Default";
                    const colorImage = relatedProduct?.imageLinks?.image1 || "/default-color.png";
                    const isSelected = colorName === selectedColor;

                    return (
                      <SwiperSlide key={relatedProduct._id} className="!w-auto">
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex flex-col items-center gap-1.5 px-1"
                          onClick={() => handleColorSelect(relatedProduct)}
                        >
                          <div className={`w-16 h-16 rounded-full overflow-hidden border-2 ${isSelected ? 'border-black' : 'border-[rgba(0,0,0,0.16)]'
                            }`}>
                            <img
                              src={colorImage}
                              alt={colorName}
                              className="w-full h-full object-contain"
                              loading="lazy"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "/default-color.png";
                              }}
                            />
                          </div>
                          <div className={`text-sm font-medium ${isSelected ? 'text-black font-semibold' : 'text-gray-600'
                            }`}>
                            {colorName}
                          </div>
                        </motion.div>
                      </SwiperSlide>
                    );
                  })}
                </Swiper>
              ) : (
                <div className="flex flex-row items-center gap-4">
                  {relatedProducts.map((relatedProduct) => {
                    const colorName = relatedProduct?.watchDetails?.dialColor?.en || "Default";
                    const colorImage = relatedProduct?.imageLinks?.image1 || "/default-color.png";
                    const isSelected = colorName === selectedColor;

                    return (
                      <motion.div
                        key={relatedProduct._id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex flex-col items-center gap-1.5"
                        onClick={() => handleColorSelect(relatedProduct)}
                      >
                        <div className={`w-16 h-16 rounded-full overflow-hidden border-2 ${isSelected ? 'border-black' : 'border-[rgba(0,0,0,0.16)]'
                          }`}>
                          <img
                            src={colorImage}
                            alt={colorName}
                            className="w-full h-full object-contain"
                            loading="lazy"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "/default-color.png";
                            }}
                          />
                        </div>
                        <div className={`text-sm font-medium ${isSelected ? 'text-black font-semibold' : 'text-gray-600'
                          }`}>
                          {colorName}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Mobile view - always show as slider with 3.2 visible items */}
            <div className="md:hidden w-full">
              <Swiper
                modules={[Navigation]}
                spaceBetween={12}
                slidesPerView={3.2}
                className="color-swiper-mobile w-full"
                freeMode={true}
              >
                {relatedProducts.map((relatedProduct) => {
                  const colorName = relatedProduct?.watchDetails?.dialColor?.en || "Default";
                  const colorImage = relatedProduct?.imageLinks?.image1 || "/default-color.png";
                  const isSelected = colorName === selectedColor;

                  return (
                    <SwiperSlide key={relatedProduct._id} className="!w-auto">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex flex-col items-center gap-1.5 px-1 min-w-[80px]"
                        onClick={() => handleColorSelect(relatedProduct)}
                      >
                        <div className={`w-16 h-16 rounded-full overflow-hidden border-2 ${isSelected ? 'border-black' : 'border-[rgba(0,0,0,0.16)]'
                          }`}>
                          <img
                            src={colorImage}
                            alt={colorName}
                            className="w-full h-full object-contain"
                            loading="lazy"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "/default-color.png";
                            }}
                          />
                        </div>
                        <div className={`text-sm font-medium text-center ${isSelected ? 'text-black font-semibold' : 'text-gray-600'
                          }`}>
                          {colorName}
                        </div>
                      </motion.div>
                    </SwiperSlide>
                  );
                })}
              </Swiper>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-1.5">
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-black">
              <img
                src={product?.watchDetails?.dialColorImage || "/default-color.png"}
                alt={product?.watchDetails?.dialColor?.en || "Default"}
                className="w-full h-full object-cover"
                loading="lazy"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/default-color.png";
                }}
              />
            </div>
            <div className="text-sm font-semibold text-black">
              {product?.watchDetails?.dialColor?.en || "Default"}
            </div>
          </div>
        )}
      </div>
      <div className="self-stretch flex flex-col items-start justify-start gap-4 text-sm">
        <div className="self-stretch flex flex-row items-center justify-start gap-4 mq750:flex-wrap">
          <div className="h-12 rounded-[100px] border-[rgba(0,0,0,0.08)] border-solid border-[1px] box-border overflow-hidden flex flex-row items-center justify-center gap-3">
            <Image
              className="h-12 w-[42.9px] relative overflow-hidden shrink-0 object-contain cursor-pointer"
              loading="lazy"
              width={43}
              height={48}
              alt=""
              src="/icroundminus@2x.webp"
              onClick={decreaseQuantity}
            />
            <div className="relative leading-[150%] font-medium">{quantity}</div>
            <Image
              className="h-12 w-[42.9px] relative overflow-hidden shrink-0 object-contain cursor-pointer"
              loading="lazy"
              width={43}
              height={48}
              alt=""
              src="/icroundplus@2x.webp"
              onClick={increaseQuantity}
            />
          </div>
          {/* Wishlist button next to quantity */}
          <button
            onClick={handleWishlist}
            className={`p-3 rounded-full transition-colors bg-white border-[rgba(0,0,0,0.08)] border-solid border-[1px] flex items-center justify-center ml-2 ${isInWishlist && isInWishlist(product?._id || product?.id)
              ? 'text-red-500 hover:text-red-600'
              : 'text-black hover:text-gray-900'
              }`}
            style={{ background: "none" }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill={isInWishlist && isInWishlist(product?._id || product?.id) ? "currentColor" : "none"}
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 21.364l-7.682-7.682a4.5 4.5 0 010-6.364z"
              />
            </svg>
          </button>
        </div>
        {/* Add to Cart and Buy It Now in a column, full width */}
        <div className="self-stretch flex flex-col items-stretch justify-start gap-4 text-center text-base text-[#fff]">
          {!isOutOfStock && (
            !addedToCart ? (
              <div
                className="w-full rounded-[50px] border-[#000] border-solid border-[1px] box-border overflow-hidden flex flex-row items-center justify-center !pt-3 !pb-3 !pl-10 !pr-10 min-w-[92px] text-center text-base cursor-pointer bg-white text-black"
                onClick={handleAddToCart}
              >
                <div className="relative leading-[150%] font-medium">
                  Add To Cart
                </div>
              </div>
            ) : (
              <div
                className="w-full rounded-[50px] border-[#000] border-solid border-[1px] box-border overflow-hidden flex flex-row items-center justify-center !pt-3 !pb-3 !pl-10 !pr-10 min-w-[92px] text-center text-base cursor-pointer bg-white text-black"
                onClick={() => router.push("/cart")}
              >
                <div className="relative leading-[150%] font-medium">
                  Go to Cart
                </div>
              </div>
            )
          )}
          <div
            className={`w-full rounded-[50px] ${isOutOfStock ? "bg-[#000]" : "bg-[#000]"} overflow-hidden flex flex-row items-center justify-center !pt-3 !pb-3 !pl-10 !pr-10 box-border min-w-[83px] cursor-pointer`}
            onClick={() => {
              if (isOutOfStock) {
                setShowNotifyModal(true);
              } else {
                // Add to cart logic for both guest and logged in
                if (product) {
                  let countryPrice = product.price;
                  if (product.price && typeof product.price === "object" && selectedCountry) {
                    const countryKey = selectedCountry.toLowerCase();
                    countryPrice = product.price[countryKey] || Object.values(product.price)[0] || "";
                  }
                  const cartItem = {
                    productId: product._id || product.id,
                    name: product.name?.en || product.name || "",
                    price: countryPrice,
                    images: product.imageLinks ? Object.values(product.imageLinks) : [product.imageLinks?.image1],
                    image: product.imageLinks?.image1,
                    quantity: quantity,
                  };
                  addToCart(cartItem);
                  toast.success("Added to cart successfully!");
                  router.push("/cart");
                }
              }
            }}
          >
            <div className="relative leading-[150%] font-medium">
              {isOutOfStock ? "Notify Me" : "Buy Now"}
            </div>
          </div>
        </div>
        {/* Notify Me Modal */}
        {showNotifyModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-lg relative">
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-black text-xl"
                onClick={() => setShowNotifyModal(false)}
              >
                &times;
              </button>
              {!notifySubmitted ? (
                <>
                  <h2 className="text-xl font-bold mb-4 text-black">Get Notified</h2>
                  <form onSubmit={handleNotifySubmit} className="flex flex-col gap-3">
                    <input
                      type="text"
                      placeholder="Name"
                      className="self-stretch rounded-lg border-[rgba(0,0,0,0.24)] border-solid border-[1px] flex flex-row items-center justify-start py-3 px-[11px] bg-transparent text-black placeholder-[rgba(0,0,0,0.7)] focus:outline-none"
                      value={notifyForm.name}
                      onChange={e => setNotifyForm({ ...notifyForm, name: e.target.value })}
                      required
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      className="self-stretch rounded-lg border-[rgba(0,0,0,0.24)] border-solid border-[1px] flex flex-row items-center justify-start py-3 px-[11px] bg-transparent text-black placeholder-[rgba(0,0,0,0.7)] focus:outline-none"
                      value={notifyForm.email}
                      onChange={e => setNotifyForm({ ...notifyForm, email: e.target.value })}
                      required
                    />
                    <input
                      type="tel"
                      placeholder="Phone Number"
                      className="self-stretch rounded-lg border-[rgba(0,0,0,0.24)] border-solid border-[1px] flex flex-row items-center justify-start py-3 px-[11px] bg-transparent text-black placeholder-[rgba(0,0,0,0.7)] focus:outline-none"
                      value={notifyForm.phone}
                      onChange={e => setNotifyForm({ ...notifyForm, phone: e.target.value })}
                      required
                    />
                    <button
                      type="submit"
                      className="mt-2 rounded-[50px] bg-[#000] text-white py-4 font-medium"
                    >
                      Submit
                    </button>
                  </form>
                </>
              ) : (
                <div className="text-center text-black">
                  Thank you! You will be notified when the product is back in stock.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

R.propTypes = {
  className: PropTypes.string,
  product: PropTypes.object,
  relatedProducts: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
  ]),
};

export default R;
