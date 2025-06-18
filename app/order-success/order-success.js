"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useCart } from "../../context/CartContext";
import { useUser } from "../../context/UserContext";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import AnimateOnScroll from "../../components/AnimateOnScroll";
import PageBanner from "../../components/page-banner";

const OrderSuccess = () => {
  const router = useRouter();
  const { clearCart, clearGuestCartAfterCheckout } = useCart();
  const { user } = useUser();
  const [cartCleared, setCartCleared] = useState(false);
  
  useEffect(() => {
    // Clear the cart only once when the order success page loads
    if (!cartCleared) {
      if (user) {
        // User is logged in, use regular clearCart
        clearCart();
      } else {
        // Guest user, use specific guest cart clearing
        clearGuestCartAfterCheckout();
      }
      setCartCleared(true);
    }
  }, [clearCart, clearGuestCartAfterCheckout, cartCleared, user]);
  
  const handleContinueShopping = () => {
    router.push("/shop");
  };
  
  const handleViewOrders = () => {
    router.push("/account/orders");
  };

  return (
    <div className="w-full relative bg-black text-white overflow-hidden flex flex-col items-start justify-start leading-[normal] tracking-[normal]">
      <header className="self-stretch bg-black text-white overflow-hidden flex flex-row items-start justify-start py-[13px] px-10 box-border top-[0] z-[99] sticky max-w-full text-center text-xs font-h5-24">
        <div className="w-[1360px] flex flex-row items-center justify-between gap-5 max-w-full">
          <Image
            className="h-6 w-6 relative overflow-hidden shrink-0 object-contain"
            loading="lazy"
            width={24}
            height={24}
            alt="iconamoonarrowup2@2x"
            src="/iconamoonarrowup2@2x.webp"
          />
          <div className="relative leading-[150%] font-medium">
            Sale: 20% Off - Limited Time Only
          </div>
          <Image
            className="h-6 w-6 relative overflow-hidden shrink-0 object-contain"
            loading="lazy"
            width={24}
            height={24}
            alt="iconamoonarrowup2-1@2x"
            src="/iconamoonarrowup2-1@2x.webp"
          />
        </div>
      </header>
      
      <PageBanner title="Order Confirmation" breadcrumb="Home > Order Success" />
      
      <AnimateOnScroll animation="fadeIn" className="self-stretch p-10">
        <div className="w-full max-w-[1360px] mx-auto text-center py-16">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-8">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h1 className="text-4xl font-medium mb-4">Order Placed Successfully!</h1>
          <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
            Thank you for your purchase. Your order has been received and is now being processed.
            You will receive an email confirmation shortly.
          </p>
          
          <div className="bg-gray-900 p-8 rounded-lg max-w-md mx-auto mb-10">
            <h2 className="text-xl font-medium mb-4">Order Details</h2>
            <div className="flex justify-between mb-2">
              <span className="text-gray-400">Order Number:</span>
              <span>#{Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-400">Date:</span>
              <span>{new Date().toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-400">Payment Method:</span>
              <span>Credit Card</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Shipping Method:</span>
              <span>Standard Shipping</span>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={handleContinueShopping}
              className="rounded-[100px] bg-white text-black py-3 px-10 font-medium hover:bg-gray-200 transition-colors"
            >
              Continue Shopping
            </button>
            <button 
              onClick={handleViewOrders}
              className="rounded-[100px] border border-white py-3 px-10 font-medium hover:bg-gray-900 transition-colors"
            >
              View My Orders
            </button>
          </div>
        </div>
      </AnimateOnScroll>
      
      <Footer
        footerAlignSelf="stretch"
        footerWidth="unset"
        maskGroup="/mask-group@2x.webp"
        iconYoutube="/icon--youtube3.svg"
        itemImg="/item--img4.svg"
        itemImg1="/item--img-14.svg"
        itemImg2="/item--img-24.svg"
      />
      <Navbar
        logoSrc="/1623314804-bd8bf9c117ab50f7f842-1@2x.webp"
        search="/search3.svg"
        account="/account3.svg"
        sVG="/svg2.svg"
      />
    </div>
  );
};

export default OrderSuccess;
