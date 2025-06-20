import Image from "next/image";
import PropTypes from "prop-types";
import { useState, useEffect, useCallback, useMemo } from "react";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { useCart } from "../context/CartContext";
import { useCountry } from "../context/CountryContext";
import { useWishlist } from "../context/WishlistContext";
import { useRouter } from 'next/navigation';

const Main1 = ({
  className = "",
  cart,
  removeFromCart,
  updateQuantity,
  cartTotal,
  clearCart,
  handleApplyCoupon,
  couponCode,
  setCouponCode,
  discount,
  totals,
  handlePlaceOrder,
  isSubmitting,
  setDiscount,
  setCouponDetails,
  paymentMethod,
  setPaymentMethod,
  handleContinueShopping,
  wishlistFromcart,
  handleCashfreePay,
  isCashfreeAvailable,
  handleTapPay,
  isTapPaymentLoading
}) => {
  const [isCouponInputVisible, setIsCouponInputVisible] = useState(false);
  const { getCartItemsByCurrency, getCurrentCurrencyTotal, getCurrency, currency, user } = useCart();
  const { selectedCountry } = useCountry();
  const [filteredCart, setFilteredCart] = useState([]);
  const [filteredTotal, setFilteredTotal] = useState(0);
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const router = useRouter();
  console.log(cart, "cart")
  // Use memoized function to prevent excessive calculations
  const updateFilteredCart = useCallback(() => {
    const items = getCartItemsByCurrency();
    setFilteredCart(items);

    // Calculate total from filtered items
    const calculatedTotal = items.reduce((sum, item) => {
      let priceValue = item.price;
      let priceNum = 0;

      // Handle price whether it's string ("AED 590") or number
      if (typeof priceValue === "string") {
        const match = priceValue.match(/([\d,.]+)/);
        priceNum = match ? parseFloat(match[1].replace(/,/g, "")) : 0;
      } else if (typeof priceValue === "number") {
        priceNum = priceValue;
      }

      return sum + (priceNum * item.quantity);
    }, 0);

    setFilteredTotal(calculatedTotal);
  }, [getCartItemsByCurrency]);

  // Only update filtered cart when cart or currency changes
  useEffect(() => {
    updateFilteredCart();
  }, [cart, currency, updateFilteredCart]);

  // Listen for currency changes via the custom event
  useEffect(() => {
    const handleCountryChange = () => {
      updateFilteredCart();
    };

    window.addEventListener('countryChange', handleCountryChange);
    return () => {
      window.removeEventListener('countryChange', handleCountryChange);
    };
  }, [updateFilteredCart]);

  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 1) {
      toast.error("Quantity cannot be less than 1");
      return;
    }
    await updateQuantity(itemId, newQuantity);
  };

  const toggleCouponInput = () => {
    setIsCouponInputVisible(!isCouponInputVisible);
  };

  const handleNavigate = (path) => {
    router.push(path);
  };

  const handleCouponSubmit = (e) => {
    e.preventDefault();
    if (!couponCode.trim()) {
      toast.error("Please enter a coupon code");
      return;
    }
    handleApplyCoupon();
  };



  // Helper function to get country code for phone
  const getCountryCode = (country) => {
    const countryCodes = {
      'UAE': '971',
      'KSA': '966',
      'KUWAIT': '965',
      'QATAR': '974',
      'USA': '1',
      'UK': '44'
    };
    return countryCodes[country?.toUpperCase()] || '971';
  };

  // Calculate totals based on filtered items - memoize for performance
  const filteredTotals = useMemo(() => {
    // Calculate subtotal from filtered cart items
    const subtotal = filteredCart.reduce((sum, item) => {
      let priceValue = item.price;
      let priceNum = 0;

      if (typeof priceValue === "string") {
        const match = priceValue.match(/([\d,.]+)/);
        priceNum = match ? parseFloat(match[1].replace(/,/g, "")) : 0;
      } else if (typeof priceValue === "number") {
        priceNum = priceValue;
      }

      return sum + (priceNum * item.quantity);
    }, 0);

    const discountedSubtotal = Math.max(0, subtotal - (Number(discount) || 0));
    const tax = +(discountedSubtotal * 0.1).toFixed(2);
    const shipping = discountedSubtotal > 5000 ? 0 : 500;
    const total = +(discountedSubtotal + tax + shipping).toFixed(2);

    return {
      subtotal,
      discountedSubtotal,
      tax,
      shipping,
      total
    };
  }, [filteredCart, discount]);

  const getDisplayCurrency = (currency) => {
    if (!currency) return "AED";
    const val = currency.toUpperCase();
    if (val === "UAE") return "AED";
    if (val === "INDIA") return "INR";
    if (val === "KSA") return "SAR";
    if (val === "KUWAIT") return "KWD";
    if (val === "QATAR") return "QAR";
    if (val === "INR" || val === "AED" || val === "SAR" || val === "KWD" || val === "QAR" || val === "USD" || val === "GBP") return val;
    if (val === "USA") return "USD";
    if (val === "UK") return "GBP";
    return "AED";
  };

  // Removed handleNavigate since we're using Link components now

  return (
    <section
      className={`self-stretch overflow-hidden flex flex-col items-center justify-center py-[60px] px-0 box-border max-w-[1360px] z-[2] text-left text-sm text-[#000] font-h5-24 mq750:pt-[39px] mq750:pb-[39px] mq750:box-border ${className}`}
    >
      {filteredCart.length === 0 ? (
        <div className="w-full min-h-[50vh] flex flex-col items-center justify-center gap-6 py-10 text-center">
          <h2 className="text-2xl font-medium">Your cart is empty</h2>
          <button
            onClick={handleContinueShopping}
            className="rounded-[100px] bg-[#000] text-white px-6 py-3 font-medium hover:bg-[#333] transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="self-stretch flex flex-row items-start justify-center gap-10 max-w-full lg:flex-wrap mq750:gap-5 mq750:flex-col mq450:flex-col mq1050:px-2 mq1050:gap-2 mq750:gap-2 mq750:px-2 mq750:ml-[-15px]">
          <div className="flex-1 flex flex-col gap-4 max-w-full mq750:min-w-full">
            {filteredCart.map((item) => {
              const displayCurrency = getDisplayCurrency(item.currency || currency);
              const itemKey = item._id || item.productId;
              const isGuest = !useCart().isLoggedIn;
              const inWishlist = isInWishlist(item._id || item.productId);

              // Add to wishlist and remove from cart without confirmation or alert
              const handleWishlistAndRemove = async () => {
                const formattedProduct = {
                  _id: item._id || item.productId,
                  name: item.name,
                  price: item.price,
                  imageLinks: { image1: item.image || (item.images && item.images[0]) || "/default-watch.jpg" },
                  watchDetails: item.watchDetails || {},
                  classic: item.classic,
                  dialColor: item.dialColor,
                  createdAt: new Date().toISOString()
                };
                if (!inWishlist) {
                  await addToWishlist(formattedProduct);
                  await wishlistFromcart(item._id || item.productId);
                } else {
                  removeFromWishlist(item._id || item.productId);
                }
              };

              // Remove from cart without confirmation
              const handleRemoveFromCart = () => {
                removeFromCart(item._id || item.productId);
              };

              return (
                <div
                  key={itemKey}
                  className="rounded-2xl bg-gray-100 flex flex-col items-start justify-center max-w-full"
                >
                  <div
                    className="self-stretch flex flex-row items-start justify-center py-0 pl-0 pr-6 box-border gap-6 max-w-full mq1050:px-2 mq450:gap-3 mq450:pr-4 mq450:pl-0"
                  >
                    <Image
                      className="h-[188px] w-[188px] relative overflow-hidden shrink-0 object-contain bg-[#f7f7f7] mq450:h-[90px] mq450:w-[90px]"
                      loading="lazy"
                      width={188}
                      height={188}
                      alt={item.name}
                      src={
                        item.image
                          ? item.image.startsWith("http")
                            ? item.image
                            : item.image.startsWith("/")
                              ? item.image
                              : `/${item.image}`
                          : "/no-image.webp"
                      }
                    />
                    <div className="flex flex-col items-center justify-center pt-6 px-0 pb-0 box-border max-w-full mq450:pt-0 mq450:items-start">
                      <div className="w-[584px] flex flex-col items-start justify-start gap-3 max-w-full mq450:max-w-full mq450:w-auto mq450:px-2">
                        <div className="self-stretch flex flex-col items-start justify-start gap-2">
                          <div className="self-stretch flex flex-row items-start justify-between text-[rgba(0,0,0,0.8)]">
                            <div className="self-stretch flex-1 relative leading-[150%] font-medium flex items-center">
                              {item?.collection?.name || 'Product'}
                            </div>
                          </div>
                          <div className="self-stretch relative text-lg leading-[150%] font-medium mq450:text-xs">
                            {item.name}
                          </div>
                          <div className="self-stretch flex flex-row items-center justify-center text-base">
                            <div className="flex-1 relative leading-[150%] font-medium">
                              {(() => {
                                let priceValue = item.price;
                                let priceNum = 0;
                                if (typeof priceValue === "string") {
                                  const match = priceValue.match(/([\d,.]+)/);
                                  priceNum = match ? parseFloat(match[1].replace(/,/g, "")) : 0;
                                } else if (typeof priceValue === "number") {
                                  priceNum = priceValue;
                                }
                                return `${displayCurrency} ${priceNum.toFixed(2)}`;
                              })()}
                            </div>
                          </div>
                        </div>
                        <div className="self-stretch h-10 flex flex-row items-end justify-start py-0 pl-0 pr-[5px] box-border gap-3 max-w-full text-center font-p5-121 mq750:h-auto mq750:flex-wrap mq450:items-center">
                          <div className="w-[106px] rounded-[100px] border-[rgba(0,0,0,0.16)] border-solid border-[1px] box-border overflow-hidden shrink-0 flex flex-row items-center justify-center mq450:flex-1 mq450:max-w-[120px]">
                            <button
                              className="h-10 w-10 flex items-center justify-center"
                              onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                            >
                              <Image
                                className="h-6 w-6 relative overflow-hidden shrink-0 object-contain"
                                loading="lazy"
                                width={24}
                                height={24}
                                alt="icroundminus1@2x"
                                src="/icroundminus1@2x.webp"
                              />
                            </button>
                            <div className="flex-1 relative leading-[150%] font-medium">
                              {item.quantity}
                            </div>
                            <button
                              className="h-10 w-10 flex items-center justify-center"
                              onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                            >
                              <Image
                                className="h-6 w-6 relative overflow-hidden shrink-0 object-contain"
                                loading="lazy"
                                width={24}
                                height={24}
                                alt="icroundplus1@2x"
                                src="/icroundplus1@2x.webp"
                              />
                            </button>
                          </div>
                          <div className="w-[395px] flex flex-col items-start justify-start max-w-full mq450:w-auto mq450:flex-1">
                            <button
                              className={`p-3 mq450:p-1.5 rounded-full hover:bg-gray-200 transition-colors h-10 w-10 mq450:h-6 mq450:w-6 z-10 flex items-center justify-center cursor-pointer focus:outline-none bg-white shadow ${inWishlist ? 'text-red-500' : 'text-black'}`}
                              aria-label={inWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
                              onClick={handleWishlistAndRemove}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 mq450:h-4 mq450:w-4"
                                fill={inWishlist ? "currentColor" : "none"}
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
                          </div>
                          <div className="flex flex-col items-start justify-end pt-0 px-4 pb-[9px] text-left text-[rgba(0,0,0,0.4)] font-h5-24 mq450:flex-1 mq450:items-end mq450:pb-0">
                            <button
                              // Remove by correct id: use _id if present, else productId
                              onClick={handleRemoveFromCart}
                              className="w-[54px] relative [text-decoration:underline] leading-[150%] font-medium inline-block hover:text-[#000]"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="w-[500px] rounded-2xl border-[rgba(0,0,0,0.16)] border-solid border-[1px] box-border flex flex-col items-end justify-start py-[20px] px-6 gap-4 max-w-full text-base mq1050:w-[800px] mq750:pt-5 mq750:pb-5 mq750:box-border mq750:min-w-full mq750:mx-4  mq450:w-[300px] mq450:ml-[-17px] mq450:rounded-[0px] mq450:border-0"
          >
            {/* Only show coupon input if logged in */}
            {useCart().isLoggedIn && (
              <div
                className="self-stretch rounded-[100px] overflow-x-auto flex flex-row items-center justify-start py-3.5 gap-3 cursor-pointer mq450:flex-col"
                onClick={toggleCouponInput}
              >
                <div className="w-full flex items-center gap-4">
                  <form onSubmit={handleCouponSubmit} className="w-full flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Enter coupon code"
                      className="flex-1 border-[rgba(0,0,0,0.16)] border-solid border-[1px] px-[15px] py-3.5 rounded-[100px]"
                      required
                      disabled={discount > 0}
                    />
                    {discount > 0 ? (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          setCouponCode('');
                          setDiscount(0);
                          setCouponDetails(null);
                        }}
                        className="px-[15px] py-3.5 rounded-[100px] bg-red-500 text-white font-medium hover:bg-red-600 transition-colors"
                      >
                        Remove
                      </button>
                    ) : (
                      <button
                        type="submit"
                        className="px-[15px] py-3.5 rounded-[100px] bg-black text-white font-medium hover:bg-[#333] transition-colors"
                      >
                        Apply
                      </button>
                    )}
                  </form>
                </div>
              </div>
            )}

            <div className="self-stretch flex flex-col items-start justify-start gap-6 text-xl">
              <div className="self-stretch relative text-[20px] leading-[150%] font-semibold">
                Order Summary
              </div>
              <div className="self-stretch flex flex-col items-start justify-start gap-3 text-base text-[rgba(0,0,0,0.8)]">
                <div className="self-stretch flex flex-row items-start justify-between">
                  <div className="relative leading-[150%]">Subtotal</div>
                  <div className="relative leading-[150%] font-medium text-[#000]">
                    {getDisplayCurrency(currency)} {filteredTotals.subtotal.toFixed(2)}
                  </div>
                </div>
                {discount > 0 && (
                  <div className="self-stretch flex flex-row items-start justify-between text-green-600">
                    <div className="relative leading-[150%]">Discount</div>
                    <div className="relative leading-[150%] font-medium">
                      -{getDisplayCurrency(currency)} {Number(discount).toFixed(2)}
                    </div>
                  </div>
                )}
                <div className="self-stretch flex flex-row items-start justify-between">
                  <div className="relative leading-[150%]">Tax</div>
                  <div className="relative leading-[150%] font-medium text-[#000]">
                    {getDisplayCurrency(currency)} {filteredTotals.tax.toFixed(2)}
                  </div>
                </div>
                <div className="self-stretch flex flex-row items-start justify-between">
                  <div className="relative leading-[150%]">Shipping</div>
                  <div className="relative leading-[150%] font-medium text-[#000]">
                    {filteredTotals.shipping === 0 ? "Free" : `${getDisplayCurrency(currency)} ${filteredTotals.shipping.toFixed(2)}`}
                  </div>
                </div>
                <div className="self-stretch flex flex-row items-start justify-between text-xl text-[#000]">
                  <div className="relative leading-[150%] font-semibold">
                    Total
                  </div>
                  <div className="relative leading-[150%] font-semibold">
                    {getDisplayCurrency(currency)} {filteredTotals.total.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>

            {/* Show payment buttons only if logged in */}
            {useCart().isLoggedIn && (
              <>
                {/* Show only Cashfree if country is India/IND */}
                {isCashfreeAvailable ? (
                  <button
                    className={`self-stretch rounded-[100px] bg-[#fff] text-[#000] border-[1px] border-solid border-[#000] h-[52px] flex flex-row items-center justify-center py-[13px] px-6 box-border ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[#000] hover:text-[#fff]  cursor-pointer'} transition-colors`}
                    onClick={handleCashfreePay}
                    disabled={isSubmitting || filteredCart.length === 0}
                  >
                    {isSubmitting ? "Processing..." : "Pay with Cashfree"}
                  </button>
                ) : (
                  <>
                    {/* Show Tap Payment for all countries except India */}
                    <button
                      className={`self-stretch rounded-[100px] bg-[#fff] text-[#000] border-[1px] border-solid border-[#000] h-[52px] flex flex-row items-center justify-center py-[13px] px-6 box-border mb-3 ${isTapPaymentLoading || isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[#000] hover:text-[#fff]  cursor-pointer'} transition-colors`}
                      onClick={handleTapPay}
                      disabled={isTapPaymentLoading || isSubmitting || filteredCart.length === 0}
                    >
                      {isTapPaymentLoading ? "Processing Tap Payment..." : "Pay with Tap"}
                    </button>

                    {/* Keep existing Place Order button as fallback */}
                    <button
                      className={`self-stretch rounded-[100px] bg-[#fff] text-[#000] border-[1px] border-solid border-[#000] h-[52px] flex flex-row items-center justify-center py-[13px] px-6 box-border ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[#000] hover:text-[#fff]  cursor-pointer'} transition-colors`}
                      onClick={handlePlaceOrder}
                      disabled={isSubmitting || filteredCart.length === 0}
                    >
                      {isSubmitting ? "Processing..." : "Place Order"}
                    </button>
                  </>
                )}
              </>
            )}
            {!useCart().isLoggedIn && (
              <button
                className="self-stretch rounded-[100px] bg-[#000] h-[52px] flex flex-row items-center justify-center py-[13px] px-6 box-border text-[#fff] hover:bg-[#333] transition-colors"
                onClick={() => handleNavigate("/checkout")}
              >
                Continue as Guest
              </button>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

Main1.propTypes = {
  className: PropTypes.string,
  cart: PropTypes.array.isRequired,
  removeFromCart: PropTypes.func.isRequired,
  updateQuantity: PropTypes.func.isRequired,
  cartTotal: PropTypes.number.isRequired,
  clearCart: PropTypes.func.isRequired,
  handleApplyCoupon: PropTypes.func.isRequired,
  couponCode: PropTypes.string.isRequired,
  setCouponCode: PropTypes.func.isRequired,
  discount: PropTypes.number.isRequired,
  totals: PropTypes.object.isRequired,
  handlePlaceOrder: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
  paymentMethod: PropTypes.string.isRequired,
  setPaymentMethod: PropTypes.func.isRequired,
  handleContinueShopping: PropTypes.func.isRequired,
  handleCashfreePay: PropTypes.func,
  isCashfreeAvailable: PropTypes.bool,
  handleTapPay: PropTypes.func,
  isTapPaymentLoading: PropTypes.bool
};

export default Main1;