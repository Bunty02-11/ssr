"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import AnimateOnScroll from "../../components/AnimateOnScroll";
import { initiateGoogleLogin, initiateAppleLogin, handleAppleLogin } from "../../services/authService";

const Register = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [socialLoading, setSocialLoading] = useState({ google: false, apple: false });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName) newErrors.firstName = "First name is required";
    if (!formData.lastName) newErrors.lastName = "Last name is required";
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid";
    if (!formData.phone) newErrors.phone = "Phone is required";
    else if (!/^\d{10,15}$/.test(formData.phone)) newErrors.phone = "Phone number is invalid";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    if (!formData.confirmPassword) newErrors.confirmPassword = "Please confirm your password";
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const { confirmPassword, firstName, lastName, ...rest } = formData;
      const registerData = {
        name: `${firstName} ${lastName}`,
        ...rest,
      };

      await axios.post(
        "https://0vm9jauvgc.execute-api.us-east-1.amazonaws.com/stag/api/users/register",
        registerData
      );

      toast.success("Registration successful! Please log in.");
      router.push("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed. Please try again.");
      if (error.response?.data?.message) {
        if (error.response.data.message.includes("email")) {
          setErrors({
            ...errors,
            email: error.response.data.message,
          });
        } else {
          setErrors({
            ...errors,
            general: error.response.data.message,
          });
        }
      }
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
        toast.success("Successfully signed in with Apple!");
        router.push("/");
      }
    } catch (error) {
      toast.error('Apple login failed. Please try again.');
      console.error('Apple login error:', error);
    } finally {
      setSocialLoading({ ...socialLoading, apple: false });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0, opacity: 1, transition: { duration: 0.5 },
    },
  };
  


  return (
    <div className="w-full bg-white text-black overflow-hidden flex flex-col font-inter">
      <Navbar
        logoSrc="/1623314804-bd8bf9c117ab50f7f842-1@2x.webp"
        search="/search1.svg"
        account="/account1.svg"
        sVG="/svg1.svg"
        navbarBackgroundColor={"rgba(0, 0, 0, 0.5)"}
      />

      <div className="flex flex-col lg:flex-row w-full min-h-[calc(100vh-80px)] mt-20 mb-20 mq1050:mt-0 mq1050:mb-0 items-center justify-center ">
        {/* Left form section */}
        <div className="w-full lg:w-1/2 flex items-center justify-center py-8 bg-white">
          <motion.div
            className="w-full max-w-md mx-auto"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <AnimateOnScroll animation="fadeIn">
              <motion.div variants={itemVariants} className="mb-8 mq450:px-4">
                <h1 className="text-32px font-600 mb-2">WELCOME TO TORNADO</h1>
                <p className="text-black text-[16px]" style={{ fontWeight: 500 }}>Join Tornado for exclusive offers</p>
              </motion.div>

              <motion.form variants={itemVariants} onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mq450:px-4">
                  <div className="space-y-2">
                    <label htmlFor="firstName" className="block text-base font-medium" style={{ fontWeight: 500 }}>
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className={`w-full py-3 rounded-lg bg-white border ${errors.firstName ? "border-red-500" : "border-black"
                        } text-black placeholder-gray-500 text-base`}
                      style={{ fontWeight: 500 }}
                      placeholder="John"
                    />
                    {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="lastName" className="block text-base font-medium" style={{ fontWeight: 500 }}>
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className={`w-full py-3 rounded-lg bg-white border ${errors.lastName ? "border-red-500" : "border-black"
                        } text-black placeholder-gray-500 text-base`}
                      style={{ fontWeight: 500 }}
                      placeholder="Doe"
                    />
                    {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mq450:px-4">
                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-base font-medium" style={{ fontWeight: 500 }}>
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full py-3 rounded-lg bg-white border ${errors.email ? "border-red-500" : "border-black"
                        } text-black placeholder-gray-500 text-base`}
                      style={{ fontWeight: 500 }}
                      placeholder="your@email.com"
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="phone" className="block text-base font-medium" style={{ fontWeight: 500 }}>
                      Phone
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`w-full py-3 rounded-lg bg-white border ${errors.phone ? "border-red-500" : "border-black"
                        } text-black placeholder-gray-500 text-base`}
                      style={{ fontWeight: 500 }}
                      placeholder="1234567890"
                    />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                  </div>
                </div>

                <div className="space-y-2 mq450:px-4">
                  <label htmlFor="password" className="block text-base font-medium" style={{ fontWeight: 500 }}>
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full py-3 rounded-lg bg-white border ${errors.password ? "border-red-500" : "border-black"
                      } text-black placeholder-gray-500 text-base`}
                    style={{ fontWeight: 500 }}
                    placeholder="••••••••"
                  />
                  {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                </div>

                <div className="space-y-2 mq450:px-4">
                  <label htmlFor="confirmPassword" className="block text-base font-medium" style={{ fontWeight: 500 }}>
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full py-3 rounded-lg bg-white border ${errors.confirmPassword ? "border-red-500" : "border-black"
                      } text-black placeholder-gray-500 text-base`}
                    style={{ fontWeight: 500 }}
                    placeholder="••••••••"
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
                  )}
                </div>

                <div className="flex items-start mq450:px-4">
                  <div className="flex items-center h-5">
                    <input
                      id="terms"
                      type="checkbox"
                      className="w-4 h-4 bg-gray-900 border-gray-700 rounded focus:ring-0"
                      required
                    />
                  </div>
                  <div className="ml-3 text-base">
                    <label htmlFor="terms" className="text-gray-400" style={{ fontWeight: 500 }}>
                      I agree to the{" "}
                      <Link
                        href="/term-of-use"
                        className="text-black underline hover:text-gray-700 cursor-pointer"
                        style={{ fontWeight: 500 }}
                      >
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link
                        href="/privacy-policy"
                        className="text-black underline hover:text-gray-700 cursor-pointer"
                        style={{ fontWeight: 500 }}
                      >
                        Privacy Policy
                      </Link>
                    </label>
                  </div>
                </div>

                <div className="flex gap-4 flex-col sm:flex-row mq450:px-4">
                  <Link href="/login" className="sm:flex-1">
                    <button
                      type="button"
                      className="w-full py-3 rounded-[100px] bg-white border border-black text-black font-semibold transition cursor-pointer text-base"
                      style={{ fontWeight: 500 }}
                    >
                      Back
                    </button>
                  </Link>
                  <button
                    type="submit"
                    disabled={loading}
                    className="sm:flex-1 py-3 rounded-[100px] bg-black text-white font-semibold transition disabled:opacity-70 cursor-pointer text-base"
                    style={{ fontWeight: 500 }}
                  >
                    {loading ? "Creating Account..." : "Create Account"}
                  </button>
                </div>

                <div className="flex items-center my-6 mq450:px-4">
                  <div className="flex-grow h-px bg-black"></div>
                  <span className="mx-3 text-black text-sm">or sign up with</span>
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
                      <Image src="/google_symbol.svg.webp" alt="google_symbol.svg" width={24} height={24} className="w-6 h-6 md:w-8 md:h-8 object-contain" loading="lazy" />
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
                      <Image src="/Apple-logo.png" alt="Apple-logo" width={24} height={24} className="w-6 h-6 md:w-8 md:h-8 object-contain" loading="lazy" />
                    )}
                  </button>
                  {/* <button type="button" className="p-2 md:p-3 bg-white text-black rounded-full border border-gray-300 hover:bg-gray-50 transition-colors opacity-50 cursor-not-allowed" title="Coming Soon">
                    <Image src="/Symbol.svg.webp" alt="Symbol.svg" width={24} height={24} className="w-6 h-6 md:w-8 md:h-8" loading="lazy" />
                  </button> */}
                </div>
              </motion.form>
            </AnimateOnScroll>
          </motion.div>
        </div>

        {/* Right image section */}

        {/* Right image section - Hidden on screens smaller than lg (1024px) */}
        <div className=" flex w-full w-1/2 items-center justify-center px-4 py-8 mq1050:hidden mq450:hidden">
          <div className="relative h-[500px] w-[400px] ">

       
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

export default Register;