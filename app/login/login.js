"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import axiosInstance from "../../services/axios";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { useCart } from "../../context/CartContext";
import { useUser } from "../../context/UserContext";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import Cookies from "js-cookie";
import { initiateGoogleLogin, initiateAppleLogin, handleAppleLogin } from "../../services/authService";

const Login = () => {
  const router = useRouter();
  const { checkAuthAndFetchCart } = useCart();
  const { updateUser } = useUser();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [socialLoading, setSocialLoading] = useState({ google: false, apple: false });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid";
    if (!formData.password) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await axiosInstance.post("/users/login", formData);
      localStorage.setItem("token", response.data.token);
      updateUser(response.data.user);
      await checkAuthAndFetchCart();
      toast.success("Login successful!");

      // Handle pending cart item
      const pendingCartItem = localStorage.getItem("pendingCartItem");
      const redirectUrl = localStorage.getItem("redirectAfterLogin");

      if (pendingCartItem) {
        const product = JSON.parse(pendingCartItem);
        const { productId, quantity = 1, name } = product;
        await checkAuthAndFetchCart();

        const selectedCountry = localStorage.getItem('selectedCountry') || 'uae';

        await axiosInstance.post(`/cart`, {
          productId,
          quantity,
          currency: selectedCountry
        });
        toast.success(`Added ${name} to cart`);
        await checkAuthAndFetchCart();
        localStorage.removeItem("pendingCartItem");
      }

      // Handle guest wishlist migration
      let guestWishlist = [];
      try {
        guestWishlist = JSON.parse(localStorage.getItem("guestWishlist") || "[]");
      } catch { guestWishlist = []; }

      if (guestWishlist.length > 0) {
        const migrationResults = await Promise.allSettled(
          guestWishlist.map(item =>
            axiosInstance.post(`/wishlist/${item._id || item.productId}`).catch(() => null)
          )
        );

        const successfulMigrations = migrationResults.filter(
          result => result.status === "fulfilled"
        ).length;

        if (successfulMigrations > 0) {
          toast.success(`Migrated ${successfulMigrations} item(s) from guest wishlist`);
        }

        localStorage.removeItem("guestWishlist");
        Cookies.remove("guestWishlist");
      }

      if (redirectUrl) {
        localStorage.removeItem("redirectAfterLogin");
        router.push(redirectUrl);
      } else {
        router.push("/");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
      setErrors({ general: error.response?.data?.message || "Invalid credentials" });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setSocialLoading({ ...socialLoading, google: true });
    try {
      initiateGoogleLogin();
    } catch (error) {
      toast.error('Failed to initiate Google login');
      setSocialLoading({ ...socialLoading, google: false });
    }
  };

  const handleAppleLoginClick = async () => {
    setSocialLoading({ ...socialLoading, apple: true });
    try {
      const appleAuthData = await initiateAppleLogin();
      const response = await handleAppleLogin(appleAuthData);

      if (response.success) {
        localStorage.setItem("token", response.token);
        updateUser(response.user);
        await checkAuthAndFetchCart();
        toast.success("Successfully signed in with Apple!");

        // Handle pending cart item and redirects (same logic as regular login)
        const pendingCartItem = localStorage.getItem("pendingCartItem");
        const redirectUrl = localStorage.getItem("redirectAfterLogin");

        if (pendingCartItem) {
          const product = JSON.parse(pendingCartItem);
          const { productId, quantity = 1, name } = product;
          await checkAuthAndFetchCart();

          const selectedCountry = localStorage.getItem('selectedCountry') || 'uae';

          await axiosInstance.post(`/cart`, {
            productId,
            quantity,
            currency: selectedCountry
          });
          toast.success(`Added ${name} to cart`);
          await checkAuthAndFetchCart();
          localStorage.removeItem("pendingCartItem");
        }

        // Handle guest wishlist migration
        let guestWishlist = [];
        try {
          guestWishlist = JSON.parse(localStorage.getItem("guestWishlist") || "[]");
        } catch { guestWishlist = []; }

        if (guestWishlist.length > 0) {
          const migrationResults = await Promise.allSettled(
            guestWishlist.map(item =>
              axiosInstance.post(`/wishlist/${item._id || item.productId}`).catch(() => null)
            )
          );

          const successfulMigrations = migrationResults.filter(
            result => result.status === "fulfilled"
          ).length;

          if (successfulMigrations > 0) {
            toast.success(`Migrated ${successfulMigrations} item(s) from guest wishlist`);
          }

          localStorage.removeItem("guestWishlist");
          Cookies.remove("guestWishlist");
        }

        if (redirectUrl) {
          localStorage.removeItem("redirectAfterLogin");
          router.push(redirectUrl);
        } else {
          router.push("/");
        }
      }
    } catch (error) {
      toast.error('Apple login failed. Please try again.');
      console.error('Apple login error:', error);
    } finally {
      setSocialLoading({ ...socialLoading, apple: false });
    }
  };

  return (
    <div className="w-full bg-white text-black overflow-hidden flex flex-col min-h-screen">
      <Navbar
        logoSrc="/1623314804-bd8bf9c117ab50f7f842-1@2x.webp"
        search="/search1.svg"
        account="/account1.svg"
        sVG="/svg1.svg"
        navbarBackgroundColor={"rgba(0, 0, 0, 0.5)"}
      />

      <main className="flex-grow flex items-center justify-center w-full min-h-[calc(100vh-160px)]">
        <div className="flex flex-col md:flex-row justify-center items-center w-full max-w-[1360px] px-[40px] pt-[140px] pb-[60px]">
          {/* Left form section */}
          <div className="w-full max-w-[1360px] flex items-center justify-center bg-white  px-[40px] mq450:px-[24px] mq450:py-[40px] ">
            <div className="w-full max-w-[400px] bg-white">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-3 md:mb-6">WELCOME TO TORNADO</h1>
              <p className="text-black text-[16px] sm:text-sm mb-4 md:mb-8">Login to your Tornado account</p>

              {errors.general && (
                <div className="mb-3 p-2 sm:p-3 bg-red-900/20 border border-red-800 text-red-300 rounded-lg text-center text-xs sm:text-sm">
                  {errors.general}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4 md:space-y-5">
                <div>
                  <label className="block text-xs sm:text-sm mb-1">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full py-2 sm:py-2.5 md:py-3 sm:px-4 rounded-lg bg-white border ${errors.email ? "border-red-500" : "border-black"
                      } text-black placeholder-gray-500 text-xs sm:text-sm md:text-base`}
                    placeholder="you@example.com"
                  />
                  {errors.email && <p className="text-red-500 text-[10px] sm:text-xs mt-1">{errors.email}</p>}
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <label className="block text-xs sm:text-sm">Password</label>
                    <Link href="/forgot-password" className="text-xs sm:text-sm text-teal-400">
                      Forgot Password?
                    </Link>
                  </div>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full py-2 sm:py-2.5 md:py-3 sm:px-4 rounded-lg bg-white border ${errors.password ? "border-red-500" : "border-black"
                      } text-black placeholder-gray-500 text-xs sm:text-sm md:text-base`}
                    placeholder="••••••••"
                  />
                  {errors.password && <p className="text-red-500 text-[10px] sm:text-xs mt-1">{errors.password}</p>}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6">
                  <Link href="/register" className="flex-1">
                    <button
                      type="button"
                      className="w-full py-2.5 md:py-3 rounded-[100px] bg-white border border-black text-black font-semibold transition cursor-pointer hover:bg-gray-100 text-sm md:text-base"
                    >
                      Create Account
                    </button>
                  </Link>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-2.5 md:py-3 rounded-[100px] bg-black text-white font-semibold transition disabled:opacity-70 cursor-pointer hover:bg-gray-800 text-sm md:text-base"
                  >
                    {loading ? "Signing in..." : "Sign In"}
                  </button>
                </div>

                <div className="flex items-center my-4">
                  <div className="flex-grow h-px bg-black"></div>
                  <span className="mx-3 text-black text-sm">or</span>
                  <div className="flex-grow h-px bg-black"></div>
                </div>

                <div className="flex space-x-4 justify-center">
                  <button
                    type="button"
                    onClick={handleGoogleLogin}
                    disabled={socialLoading.google}
                    className="p-2 md:p-3 bg-white text-black rounded-full border border-black hover:bg-gray-50 transition-colors disabled:opacity-50"
                    title="Sign in with Google"
                  >
                    {socialLoading.google ? (
                      <div className="w-6 h-6 md:w-8 md:h-8 animate-spin rounded-full border-2 border-black border-t-black"></div>
                    ) : (
                      <Image src="/google_symbol.svg.webp" alt="google_symbol.svg" width={24} height={24} className="w-6 h-6 md:w-8 md:h-8 object-contain" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleAppleLoginClick}
                    disabled={socialLoading.apple}
                    className="p-2 md:p-3 bg-white text-black rounded-full border border-black hover:bg-gray-50 transition-colors disabled:opacity-50"
                    title="Sign in with Apple"
                  >
                    {socialLoading.apple ? (
                      <div className="w-6 h-6 md:w-8 md:h-8 animate-spin rounded-full border-2 border-gray-300 border-t-black"></div>
                    ) : (
                      <Image src="/Apple-logo.png" alt="Apple-logo" width={24} height={24} className="w-6 h-6 md:w-8 md:h-8 object-contain" />
                    )}
                  </button>
                  {/* <button type="button" className="p-2 md:p-3 bg-white text-black rounded-full border border-gray-300 hover:bg-gray-50 transition-colors opacity-50 cursor-not-allowed" title="Coming Soon">
                    <Image src="/Symbol.svg.webp" alt="Symbol.svg" width={24} height={24} className="w-6 h-6 md:w-8 md:h-8" />
                  </button> */}
                </div>
              </form>
            </div>
          </div>

          {/* Right image section */}

          <div className=" flex w-full w-1/2 items-center justify-center px-4 py-8 mq1050:hidden mq450:hidden">
            <div className="relative h-[740px] w-[610px] ">
              <Image
                src="/cat@3x.webp"
                alt="cat@3x"
                layout="fill"
                objectFit="cover"
                loading="lazy"
                className="rounded-lg lg:rounded-[25px] shadow-xl"
              />
            </div>
          </div>
        </div>
      </main>

      <Footer
        maskGroup="/mask-group@2x.webp"
        iconYoutube="/icon--youtube1.svg"
        itemImg="/item--img1.svg"
        itemImg1="/item--img-11.svg"
        itemImg2="/item--img-21.svg"
      />
    </div>
  );
};

export default Login;