"use client";
import { useCallback, useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "../../context/CartContext";
import { useUser } from "../../context/UserContext";
import { useCountry } from "../../context/CountryContext";
import Footer from "../../components/footer";
import Navbar from "../../components/navbar";
import AnimateOnScroll from "../../components/AnimateOnScroll";
import PageBanner from "../../components/page-banner";
import { toast } from "react-hot-toast";
import axiosInstance from "../../services/axios";
import Main1 from "../../components/main1";
import axios from "axios";
import { load } from "@cashfreepayments/cashfree-js";

const Cart = () => {
    const {
        cart,
        removeFromCart,
        updateQuantity,
        cartTotal,
        clearCart,
        clearGuestCartAfterCheckout,
        createOrder,
        loading,
        orderProcessing,
        shippingAddress,
        getCartItemsByCurrency,
        getCurrentCurrencyTotal,
        getCurrency,
        currency
    } = useCart();

    const { selectedCountry } = useCountry();
    const { user, loading: userLoading } = useUser();
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState("Strabl");
    const [couponCode, setCouponCode] = useState("");
    const [discount, setDiscount] = useState(0);
    const [couponDetails, setCouponDetails] = useState(null);
    const [filteredCart, setFilteredCart] = useState([]);
    const [filteredTotal, setFilteredTotal] = useState(0);
    const [isCouponInputVisible, setIsCouponInputVisible] = useState(false);

    // Guest form state
    const [guestForm, setGuestForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        country: "",
        city: "",
        address: "",
        pincode: "",
    });
    const [guestRegistering, setGuestRegistering] = useState(false);
    const [guestRegistered, setGuestRegistered] = useState(false);

    // Function to update filtered cart data - memoized to prevent rerenders
    const updateFilteredCart = useCallback(() => {
        if (cart && cart.length > 0) {
            const items = getCartItemsByCurrency();
            setFilteredCart(items);
            setFilteredTotal(getCurrentCurrencyTotal());
        } else {
            setFilteredCart([]);
            setFilteredTotal(0);
        }
    }, [cart, getCartItemsByCurrency, getCurrentCurrencyTotal]);

    // Update filtered cart when cart or currency changes
    useEffect(() => {
        updateFilteredCart();
    }, [cart, currency, updateFilteredCart]);

    // Listen for currency changes via custom event
    useEffect(() => {
        const handleCountryChange = () => {
            updateFilteredCart();
        };

        window.addEventListener('countryChange', handleCountryChange);
        return () => {
            window.removeEventListener('countryChange', handleCountryChange);
        };
    }, [updateFilteredCart]);

    useEffect(() => {
        if (!orderProcessing) {
            setIsSubmitting(false);
        }
    }, [orderProcessing]);

    // Calculate totals based on filtered items - memoized
    const totals = useMemo(() => {
        const subtotal = filteredTotal;
        const discountedSubtotal = Math.max(0, subtotal - discount);
        const tax = (discountedSubtotal * 0.1).toFixed(2);
        const shipping = discountedSubtotal > 5000 ? 0 : 500;
        const total = (parseFloat(discountedSubtotal) + parseFloat(tax) + parseFloat(shipping)).toFixed(2);

        return {
            subtotal,
            discountedSubtotal,
            tax,
            shipping,
            total
        };
    }, [filteredTotal, discount]);

    const handleClearCart = async () => {
        if (window.confirm("Are you sure you want to clear your cart?")) {
            await clearCart();
            setDiscount(0);
            setCouponDetails(null);
            setCouponCode("");
        }
    };

    const handleRemoveItem = async (itemId) => {
        if (window.confirm("Remove this item from cart?")) {
            await removeFromCart(itemId);
            if (cart.length === 1) {
                setDiscount(0);
                setCouponDetails(null);
                setCouponCode("");
            }
        }
    };

    const handleApplyCoupon = async () => {
        if (!couponCode.trim()) {
            toast.error("Please enter a coupon code");
            return;
        }

        // Use guest cart subtotal if guestCart is active, else filteredTotal
        const cartTotalForCoupon = guestCart.length > 0 ? guestTotals.subtotal : filteredTotal;

        try {
            const response = await axiosInstance.post(
                "/api/coupons/validate",
                {
                    code: couponCode,
                    cartTotal: cartTotalForCoupon,
                    userId: user?._id,
                },
            );
            if (response.data.success) {
                setDiscount(response.data.data.discountAmount);
                setCouponDetails(response.data.data.coupon);
                toast.success("Coupon applied successfully!");
            } else {
                setDiscount(0);
                setCouponDetails(null);
                toast.error(response.data.message || "Invalid coupon code.");
            }
        } catch (error) {
            console.error("Coupon validation error:", error);
            setDiscount(0);
            setCouponDetails(null);
            toast.error(error.response?.data?.message || "Failed to validate coupon.");
        }
    };

    // Track which payment button is submitting
    const [submittingButton, setSubmittingButton] = useState(null); // "strabl" | "cashfree" | null

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        setSubmittingButton("strabl");
        setIsSubmitting(true);
        try {
            // Require login only when placing an order
            if (!user) {
                toast.error("Please login to place an order");
                localStorage.setItem("redirectAfterLogin", "/cart");
                router.push("/login");
                setIsSubmitting(false);
                return;
            }

            const currentCurrency = getCurrency();

            const orderItems = filteredCart.map((item) => ({
                product: item.productId,
                name: item.name?.en || item.name || "",
                image: item.image
                    ? item.image.startsWith("http")
                        ? item.image
                        : item.image.startsWith("/")
                            ? item.image
                            : `/${item.image}`
                    : "/no-image.webp",
                price: item.price,
                quantity: item.quantity,
            }));

            if (orderItems.length === 0) {
                toast.error(`No items available for ${currentCurrency} currency`);
                setIsSubmitting(false);
                return;
            }

            const orderPayload = {
                orderItems,
                paymentMethod: paymentMethod,
                coupon: couponDetails ? {
                    code: couponDetails.code,
                    discountAmount: discount,
                    couponId: couponDetails._id
                } : null,
                subtotal: totals.subtotal,
                discount: discount,
                tax: totals.tax,
                shipping: totals.shipping,
                total: totals.total,
                currency: currentCurrency
            };

            if (shippingAddress && shippingAddress.address) {
                orderPayload.shippingAddress = {
                    address: shippingAddress.address,
                    city: shippingAddress.city,
                    postalCode: shippingAddress.postalCode,
                    country: shippingAddress.country,
                };
            }

            const response = await axiosInstance.post("/orders", orderPayload,);
            const cartId = response.data?.strablCheckout?.data?.data?.cartId;

            if (cartId) {
                toast.success("Order placed successfully! Redirecting to payment...");
                const strablCheckoutUrl = `https://sandbox.checkout.strabl.io/?token=${cartId}`;
                window.open(strablCheckoutUrl, "_blank");
                await clearCart();
                setDiscount(0);
                setCouponDetails(null);
                setCouponCode("");
                router.push("/order-success");
            } else {
                console.error("No cartId found in response:", response.data);
                toast.error("Could not process payment. Please try again.");
            }
        } catch (error) {
            console.error("Order placement error:", error);
            toast.error(error.response?.data?.message || "Failed to place order");
        } finally {
            setIsSubmitting(false);
            setSubmittingButton(null);
        }
    };

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

    const handleCouponSubmit = (e) => {
        e.preventDefault();
        if (!couponCode.trim()) {
            toast.error("Please enter a coupon code");
            return;
        }
        handleApplyCoupon();
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

    const handleNavigate = (path) => {
        router.push(path);
    };

    // Use guest cart if not logged in - initialize as empty to prevent hydration issues
    const [guestCart, setGuestCart] = useState([]);
    const [isClient, setIsClient] = useState(false);

    // Get cart items from localStorage for guest users
    const getGuestCart = () => {
        if (typeof window !== "undefined") {
            try {
                return JSON.parse(localStorage.getItem("guestCart") || "[]");
            } catch {
                return [];
            }
        }
        return [];
    };

    // Handle client-side hydration
    useEffect(() => {
        setIsClient(true);
        setGuestCart(getGuestCart());
    }, []);

    // Sync guest cart when localStorage changes (only after hydration)
    useEffect(() => {
        if (!isClient) return;

        const syncGuestCart = () => setGuestCart(getGuestCart());
        window.addEventListener("storage", syncGuestCart);
        return () => window.removeEventListener("storage", syncGuestCart);
    }, [isClient]);

    // Use guestCart for summary if not logged in, else use filteredCart
    const cartItems = guestCart.length > 0 ? guestCart : filteredCart;

    // Calculate totals for guest cart
    const guestTotals = useMemo(() => {
        let subtotal = 0;
        cartItems.forEach(item => {
            let priceValue = item.price;
            let priceNum = 0;
            if (typeof priceValue === "string") {
                const match = priceValue.match(/([\d,.]+)/);
                priceNum = match ? parseFloat(match[1].replace(/,/g, "")) : 0;
            } else if (typeof priceValue === "number") {
                priceNum = priceValue;
            }
            subtotal += priceNum * (item.quantity || 1);
        });
        const discountedSubtotal = Math.max(0, subtotal - (Number(discount) || 0));
        const tax = +(discountedSubtotal * 0.1).toFixed(2);
        const shipping = discountedSubtotal > 5000 ? 0 : 500;
        const total = +(discountedSubtotal + tax + shipping).toFixed(2);
        return { subtotal, discountedSubtotal, tax, shipping, total };
    }, [cartItems, discount]);

    // Handle guest form input change
    const handleGuestInput = (e) => {
        const { name, value } = e.target;
        setGuestForm((prev) => ({ ...prev, [name]: value }));
    };

    // Validate guest form
    const isGuestFormValid = useMemo(() => {
        return (
            guestForm.firstName.trim() &&
            guestForm.lastName.trim() &&
            guestForm.email.trim() &&
            guestForm.phoneNumber.trim() &&
            guestForm.country.trim() &&
            guestForm.city.trim() &&
            guestForm.address.trim() &&
            guestForm.pincode.trim()
        );
    }, [guestForm]);

    // Guest registration API call
    const handleGuestRegister = async () => {
        setGuestRegistering(true);
        try {
            const body = {
                name: `${guestForm.firstName} ${guestForm.lastName}`,
                email: guestForm.email,
                phoneNumber: guestForm.phoneNumber,
                shippingAddress: {
                    name: "Home Address",
                    street: guestForm.address,
                    city: guestForm.city,
                    state: guestForm.city,
                    zipCode: guestForm.pincode,
                    country: guestForm.country,
                    phoneNumber: guestForm.phoneNumber,
                },
            };
            const res = await fetch("/api/guest/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });
            if (!res.ok) throw new Error("Registration failed");
            const data = await res.json();
            // Store sessionId in localStorage with key "x-session-id"
            if (data?.data?.sessionId) {
                localStorage.setItem("x-session-id", data.data.sessionId);
            }
            setGuestRegistered(true);
            toast.success("Guest registered successfully!");

            // Call guest cart API after successful registration
            await handleGuestCartApi();
        } catch (err) {
            toast.error("Guest registration failed");
            setGuestRegistered(false);
        } finally {
            setGuestRegistering(false);
        }
    };

    // Guest cart API call
    const handleGuestCartApi = async () => {
        try {
            const sessionId = localStorage.getItem("x-session-id");
            if (!sessionId) {
                toast.error("Session ID not found");
                return;
            }

            // Get all cart items and send them to the API
            const cartPromises = cartItems.map(async (item) => {
                const body = {
                    productId: item.productId,
                    quantity: item.quantity,
                    currency: item.currency || currency || "UAE"
                };

                const response = await fetch("/api/guest/cart", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "x-session-id": sessionId
                    },
                    body: JSON.stringify(body),
                });

                if (!response.ok) {
                    throw new Error(`Failed to add item ${item.productId} to guest cart`);
                }

                return response.json();
            });

            await Promise.all(cartPromises);
            toast.success("Cart items synchronized successfully!");
        } catch (err) {
            console.error("Guest cart API error:", err);
            toast.error("Failed to sync cart items");
        }
    };

    // Tap payment handler
    const handleTapPay = async () => {
        setSubmittingButton("tap");
        setIsSubmitting(true);
        try {
            const sessionId = localStorage.getItem("x-session-id");
            if (!sessionId) {
                toast.error("Session ID not found. Please register again.");
                setIsSubmitting(false);
                setSubmittingButton(null);
                return;
            }

            // Step 1: Call guest cart API for each cart item
            const cartPromises = cartItems.map(async (item) => {
                const body = {
                    productId: item.productId,
                    quantity: item.quantity,
                    currency: item.currency || currency || "UAE"
                };

                const response = await fetch("/api/guest/cart", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "x-sessionId": sessionId
                    },
                    body: JSON.stringify(body),
                });

                if (!response.ok) {
                    throw new Error(`Failed to add item ${item.productId} to guest cart`);
                }

                return response.json();
            });

            const cartResponses = await Promise.all(cartPromises);
            toast.success("Cart items synchronized!");

            // Step 2: Get cart ID from the first response and call Tap charge API
            if (cartResponses.length > 0 && cartResponses[0].success && cartResponses[0].data._id) {
                const cartId = cartResponses[0].data._id;

                const tapChargeBody = {
                    cartId: cartId,
                    customer: {
                        first_name: guestForm.firstName || "John",
                        last_name: guestForm.lastName || "Guest",
                        email: guestForm.email || "guest@example.com",
                        phone: {
                            country_code: "971", // Default UAE country code
                            number: guestForm.phoneNumber || "501234567"
                        }
                    },
                    source: {
                        id: "src_card"
                    },
                    save_card: false,
                    threeDSecure: true,
                    shippingAddress: {
                        address: guestForm.address || "123 Main Street",
                        city: guestForm.city || "Dubai",
                        postalCode: guestForm.pincode || "12345",
                        country: guestForm.country || "UAE"
                    },
                    description: "Guest purchase - Tornado Watches",
                    metadata: {
                        guest_purchase: true,
                        store_location: guestForm.country || "UAE"
                    }
                };

                const tapResponse = await fetch("/api/tap/guest-charge", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "x-sessionId": sessionId
                    },
                    body: JSON.stringify(tapChargeBody),
                });

                if (tapResponse.ok) {
                    const tapData = await tapResponse.json();
                    console.log("Tap payment response:", tapData);

                    if (tapData.success && tapData.data.transaction_url) {
                        toast.success("Tap payment initiated successfully! Redirecting to payment...");
                        // Redirect to Tap payment page in new tab
                        window.open(tapData.data.transaction_url, "_blank");

                        // Optionally clear cart and redirect to success page
                        clearGuestCartAfterCheckout();
                        setDiscount(0);
                        setCouponDetails(null);
                        setCouponCode("");
                        // router.push("/order-success");
                    } else {
                        toast.error("Payment URL not found in response");
                    }
                } else {
                    throw new Error("Tap payment API failed");
                }
            } else {
                throw new Error("Failed to get cart ID from guest cart API");
            }

        } catch (err) {
            toast.error("Tap payment failed");
            console.error("Tap payment error:", err);
        } finally {
            setIsSubmitting(false);
            setSubmittingButton(null);
        }
    };

    // Guest checkout API call
    const handleGuestCheckout = async () => {
        setIsSubmitting(true);
        try {
            const sessionId = localStorage.getItem("x-session-id");
            if (!sessionId) {
                toast.error("Guest session not found. Please register again.");
                setIsSubmitting(false);
                return;
            }
            // Prepare order items, ensure price is a number
            const orderItems = cartItems.map(item => {
                let priceValue = item.price;
                let priceNum = 0;
                if (typeof priceValue === "string") {
                    const match = priceValue.match(/([\d,.]+)/);
                    priceNum = match ? parseFloat(match[1].replace(/,/g, "")) : 0;
                } else if (typeof priceValue === "number") {
                    priceNum = priceValue;
                }
                return {
                    product: item.productId,
                    name: item.name?.en || item.name || "",
                    image: item.image
                        ? item.image.startsWith("http")
                            ? item.image
                            : item.image.startsWith("/")
                                ? item.image
                                : `/${item.image}`
                        : "/no-image.webp",
                    price: priceNum,
                    quantity: item.quantity,
                };
            });

            const body = {
                guestEmail: guestForm.email,
                orderItems,
                paymentMethod: paymentMethod,
                subtotalPrice: Number(guestTotals.total), // send total as subtotalPrice for strabl
                taxPrice: Number(guestTotals.tax),
                shippingPrice: Number(guestTotals.shipping),
                totalPrice: Number(guestTotals.total),
                discountAmount: Number(discount) || 0,
            };

            const res = await fetch("/api/guest/checkout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-session-id": sessionId
                },
                body: JSON.stringify(body),
            });

            if (res.status === 201) {
                const data = await res.json();
                const cartId = data?.strablCheckout?.data?.data?.cartId;
                if (cartId) {
                    toast.success("Order placed successfully! Redirecting to payment...");
                    const strablCheckoutUrl = `https://sandbox.checkout.strabl.io/?token=${cartId}`;
                    window.open(strablCheckoutUrl, "_blank");
                    // Clear guest cart completely after successful order
                    clearGuestCartAfterCheckout();
                    setDiscount(0);
                    setCouponDetails(null);
                    setCouponCode("");
                    router.push("/order-success");
                } else {
                    toast.success("Order placed, but payment link not found.");
                }
            } else {
                const errData = await res.json();
                toast.error(errData.message || "Guest checkout failed");
            }
        } catch (err) {
            toast.error("Guest checkout failed");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Only show Cashfree for India
    const isCashfreeAvailable = (selectedCountry && selectedCountry.toLowerCase() === "india");

    // Only show Tap for non-India countries
    const isTapAvailable = !(selectedCountry && selectedCountry.toLowerCase() === "india");

    // Show loading during hydration to prevent mismatch
    if (!isClient) {
        return (
            <div className="w-full relative bg-[#fff] overflow-hidden flex flex-col items-center justify-center min-h-screen leading-[normal] tracking-[normal]">
                <Navbar
                    logoSrc="/1623314804-bd8bf9c117ab50f7f842-1@2x.webp"
                    search="/search1.svg"
                    account="/account1.svg"
                    sVG="/svg1.svg"
                    navbarBackgroundColor={"transparent"}
                />
                <div className="flex-1 w-full flex flex-col items-center justify-center">
                    <PageBanner title="Checkout" breadcrumb="Home > Checkout" />
                    <div className="flex items-center justify-center py-20">
                        <div className="text-lg">Loading...</div>
                    </div>
                </div>
                <Footer
                    footerAlignSelf="stretch"
                    footerWidth="unset"
                    maskGroup="/mask-group@2x.webp"
                    iconYoutube="/icon--youtube3.svg"
                    itemImg="/item--img4.svg"
                    itemImg1="/item--img-14.svg"
                    itemImg2="/item--img-24.svg"
                />
            </div>
        );
    }

    return (
        <div className="w-full relative bg-[#fff] overflow-hidden flex flex-col items-center justify-center min-h-screen leading-[normal] tracking-[normal]">
            <Navbar
                logoSrc="/1623314804-bd8bf9c117ab50f7f842-1@2x.webp"
                search="/search1.svg"
                account="/account1.svg"
                sVG="/svg1.svg"
                navbarBackgroundColor={"transparent"}
            />
            <div className="flex-1 w-full flex flex-col items-center justify-center">
                <PageBanner title="Checkout" breadcrumb="Home > Checkout" />
            </div>
            <div className="w-full flex flex-row items-center justify-center py-[60px] mq450:py-[0px]">
                <div className="max-w-[1360px] w-full flex flex-row items-center justify-center px-2 py-8 mq450:py-[0px] mq750:w-full mq750:px-2">
                    <div
                        className="
                            flex flex-row mq1050:flex-col-reverse gap-12 mq750:flex-col-reverse items-start justify-center w-full

                            flex flex-row gap-12 items-start justify-center w-full
                            mq450:flex-col-reverse mq450:items-center mq1050:items-center mq450:gap-6
                        "
                    >
                        {/* --- Delivery Address (Form) --- */}
                        <div
                            className="
                                w-full max-w-[820px] bg-white rounded-lg relative mq1050:w-full mq1050:max-w-[800px] mq750:w-full mq750:max-w-[650px]
                                mq450:w-full mq450:max-w-[410px] mq450:px-[24px] mq450:py-[40px] mq450:rounded-[12px] mq450:mx-auto
                            "
                        >
                            {/* Login as Guest Box */}
                            <div className="absolute top-0 left-0 w-full flex items-center mq450:py-[40px] mq450:px-[24px]">
                                <div className="w-full flex items-center justify-start">
                                    <div className="border border-gray-300 bg-black text-white rounded-[100px] px-[40px] py-[16px] mt-[-32px] mb-6 ml-0">
                                        <span className="font-semibold">Logged in as Guest</span>
                                    </div>
                                </div>
                            </div>
                            <h2 className="text-2xl font-bold mb-6 border-b py-[20px] mq450:py-[24px] mq450:px-0 text-left mt-8">Delivery Address</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mq450:gap-[24px] mq450:w-[300px] mq450:justify-center mq450:items-center">
                                <div>
                                    <label className="block text-black font-500 mb-1 text-[16px]">First Name</label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={guestForm.firstName}
                                        onChange={handleGuestInput}
                                        required
                                        className="w-full p-2.5 border border-gray-700 rounded"
                                    />
                                </div>
                                <div>
                                    <label className="block text-black font-500 mb-1 text-[16px]">Last Name</label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={guestForm.lastName}
                                        onChange={handleGuestInput}
                                        required
                                        className="w-full p-2.5 border border-gray-700 rounded"
                                    />
                                </div>
                                <div>
                                    <label className="block text-black font-500 mb-1 text-[16px]">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={guestForm.email}
                                        onChange={handleGuestInput}
                                        required
                                        className="w-full p-2.5 border border-gray-700 rounded"
                                    />
                                </div>
                                <div>
                                    <label className="block text-black font-500 mb-1 text-[16px]">Mobile Number</label>
                                    <input
                                        type="tel"
                                        name="phoneNumber"
                                        value={guestForm.phoneNumber}
                                        onChange={handleGuestInput}
                                        required
                                        className="w-full p-2.5 border border-gray-700 rounded"
                                    />
                                </div>
                                <div>
                                    <label className="block text-black font-500 mb-1 text-[16px]">Country</label>
                                    <input
                                        type="text"
                                        name="country"
                                        value={guestForm.country}
                                        onChange={handleGuestInput}
                                        required
                                        className="w-full p-2.5 border border-gray-700 rounded"
                                    />
                                </div>
                                <div>
                                    <label className="block text-black font-500 mb-1 text-[16px]">City</label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={guestForm.city}
                                        onChange={handleGuestInput}
                                        required
                                        className="w-full p-2.5 border border-gray-700 rounded"
                                    />
                                </div>
                                <div>
                                    <label className="block text-black font-500 mb-1 text-[16px]">Address</label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={guestForm.address}
                                        onChange={handleGuestInput}
                                        required
                                        className="w-full p-2.5 border border-gray-700 rounded"
                                    />
                                </div>
                                <div>
                                    <label className="block text-black font-500 mb-1 text-[16px]">Pincode</label>
                                    <input
                                        type="text"
                                        name="pincode"
                                        value={guestForm.pincode}
                                        onChange={handleGuestInput}
                                        required
                                        className="w-full p-2.5 border border-gray-700 rounded"
                                    />
                                </div>
                            </div>
                            {/* Submit Button - moved below the address fields */}
                            <div className="w-full gap-6 flex items-center justify-start mt-8 mq450:mt-0 mq450:py-[40px] mq450:px-0 mq450:gap-[24px]">
                                <button
                                    type="button"
                                    className="border border-black bg-white text-black rounded-[100px] px-[40px] py-[16px]"
                                    onClick={() => window.history.back()}
                                >
                                    <span className="font-semibold">Back</span>
                                </button>
                                {/* Only show Submit button if guest is not registered */}
                                {!guestRegistered && (
                                    <button
                                        type="button"
                                        className={`border border-gray-300 bg-black text-white rounded-[100px] px-[40px] py-[16px] ${guestRegistering ? "opacity-70 cursor-not-allowed" : ""}`}
                                        disabled={!isGuestFormValid || guestRegistering}
                                        onClick={handleGuestRegister}
                                    >
                                        <span className="font-semibold">
                                            {guestRegistering ? "Submitting..." : "Submit"}
                                        </span>
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* --- Order Summary --- */}
                        <div
                            className="
                                w-[500px] rounded-2xl border-[rgba(0,0,0,0.16)] border-solid border-[1px] box-border flex flex-col items-end justify-start py-[20px] px-6 gap-4 max-w-full text-base
                                mq750:pt-5 mq750:pb-5 mq750:box-border mq750:min-w-full mq750:mx-4
                                mq450:w-full mq450:max-w-[410px] mq450:ml-0 mq450:rounded-[12px] mq450:border-none
                                mq450:px-[24px] mq450:mx-auto mq1050:w-[800px]
                            "
                        >
                            {/* Cart Items List */}
                            <div className="space-y-2 mb-0 w-full">
                                {cartItems.map(item => (
                                    <div key={item._id || item.productId} className="flex items-center border-b pb-4 gap-4">
                                        <div className="w-16 h-16 flex-shrink-0 rounded bg-white flex items-center justify-center overflow-hidden">
                                            <img
                                                src={
                                                    item.image
                                                        ? item.image.startsWith("http")
                                                            ? item.image
                                                            : item.image.startsWith("/")
                                                                ? item.image
                                                                : `/${item.image}`
                                                        : "/no-image.webp"
                                                }
                                                alt={item.name}
                                                className="object-contain w-full h-full"
                                                loading="lazy"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium text-black">{item.name}</p>
                                            <div className="flex items-center justify-between gap-2 text-black text-sm mt-1">
                                                <span>Qty: {item.quantity}</span>
                                                <span className="font-semibold text-black">
                                                    {getDisplayCurrency(item.currency || currency)}{" "}
                                                    {(() => {
                                                        let priceValue = item.price;
                                                        let priceNum = 0;
                                                        if (typeof priceValue === "string") {
                                                            const match = priceValue.match(/([\d,.]+)/);
                                                            priceNum = match ? parseFloat(match[1].replace(/,/g, "")) : 0;
                                                        } else if (typeof priceValue === "number") {
                                                            priceNum = priceValue;
                                                        }
                                                        return (priceNum * (item.quantity || 1)).toFixed(2);
                                                    })()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div
                                className="self-stretch rounded-[100px] overflow-x-auto flex flex-row items-center justify-start py-0 gap-3 cursor-pointer mq450:flex-col"
                                onClick={() => setIsCouponInputVisible(!isCouponInputVisible)}
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
                            {/* Order Summary */}
                            <div className="w-full border-t pt-6">
                                <div className="space-y-3 text-gray-700">
                                    <div className="flex justify-between">
                                        <span>Subtotal</span>
                                        <span className="font-medium text-gray-900">
                                            {getDisplayCurrency(currency)} {guestTotals.subtotal.toFixed(2)}
                                        </span>
                                    </div>

                                    {discount > 0 && (
                                        <div className="flex justify-between text-green-600">
                                            <span>Discount</span>
                                            <span className="font-medium">
                                                -{getDisplayCurrency(currency)} {Number(discount).toFixed(2)}
                                            </span>
                                        </div>
                                    )}

                                    <div className="flex justify-between">
                                        <span>Tax</span>
                                        <span className="font-medium text-gray-900">
                                            {getDisplayCurrency(currency)} {guestTotals.tax.toFixed(2)}
                                        </span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span>Shipping</span>
                                        <span className="font-medium text-gray-900">
                                            {guestTotals.shipping === 0
                                                ? "Free"
                                                : `${getDisplayCurrency(currency)} ${guestTotals.shipping.toFixed(2)}`}
                                        </span>
                                    </div>
                                </div>

                                {/* Total */}
                                <div className="flex justify-between mt-6 pt-4 border-t text-lg font-semibold text-gray-900">
                                    <span>Total</span>
                                    <span>
                                        {getDisplayCurrency(currency)} {guestTotals.total.toFixed(2)}
                                    </span>
                                </div>
                            </div>

                            {/* Payment button only if guest is registered or user is logged in */}
                            {(user || guestRegistered) && (
                                <>
                                    {/* Show only Cashfree if country is India/IND */}
                                    {isCashfreeAvailable ? (
                                        <button
                                            className={`self-stretch rounded-[100px] bg-[#fff] text-[#000] border-[1px] border-solid border-[#000] h-[52px] flex flex-row items-center justify-center py-[13px] px-6 box-border ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[#000] hover:text-[#fff]  cursor-pointer'} transition-colors`}
                                            onClick={handleCashfreePay}
                                            disabled={isSubmitting && submittingButton !== "cashfree"}
                                        >
                                            {(isSubmitting && submittingButton === "cashfree") ? "Processing..." : "Pay with Cashfree"}
                                        </button>
                                    ) : (
                                        <div className="w-full mt-6 space-y-3">
                                            {/* Strabl Payment Button */}
                                            <button
                                                className="w-full rounded-[100px] bg-black text-white py-4 font-semibold text-lg hover:bg-[#333] transition-colors"
                                                onClick={user ? handlePlaceOrder : handleGuestCheckout}
                                                disabled={isSubmitting && submittingButton !== "strabl"}
                                            >
                                                {(isSubmitting && submittingButton === "strabl") ? "Processing..." : "Pay with Strabl"}
                                            </button>

                                            {/* Tap Payment Button - Only show for non-India countries */}
                                            {isTapAvailable && (
                                                <button
                                                    className="w-full rounded-[100px] bg-blue-600 text-white py-4 font-semibold text-lg hover:bg-blue-700 transition-colors"
                                                    onClick={handleTapPay}
                                                    disabled={isSubmitting && submittingButton !== "tap"}
                                                >
                                                    {(isSubmitting && submittingButton === "tap") ? "Processing..." : "Pay with Tap"}
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Footer
                footerAlignSelf="stretch"
                footerWidth="unset"
                maskGroup="/mask-group@2x.webp"
                iconYoutube="/icon--youtube3.svg"
                itemImg="/item--img4.svg"
                itemImg1="/item--img-14.svg"
                itemImg2="/item--img-24.svg"
            />
        </div>
    );
};

export default Cart;