"use client";
import { useMemo, useEffect, useState } from "react";
import Image from "next/image";
import PropTypes from "prop-types";
import { getTopCollections, getTopProducts } from "../services/productService";
import Link from "next/link";
import { useCountry } from "../context/CountryContext";
import { toast } from "react-hot-toast"; // <-- Add this import

const Footer = ({
  className = "",
  footerAlignSelf,
  footerWidth,
  maskGroup,
  iconYoutube,
  itemImg,
  itemImg1,
  itemImg2,
  onCountrySelect, // allow prop override
}) => {
  const [topCollections, setTopCollections] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { selectedCountry, updateCountry } = useCountry();

  // Collapsible state for mobile
  const [openSection, setOpenSection] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const collections = await getTopCollections(5);
        const products = await getTopProducts(5);

        setTopCollections(collections);
        setTopProducts(products);
      } catch (error) {
        console.error("Error fetching data for footer:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const footerStyle = useMemo(() => {
    return {
      alignSelf: footerAlignSelf,
      width: footerWidth,
    };
  }, [footerAlignSelf, footerWidth]);

  const handleSocialIcons = (path) => {
    window.open(path, "_blank", "noopener,noreferrer");
  };

  // Removed handleNavigate since we're using Link components now

  // Helper for mobile: toggle section
  const handleToggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  // Mobile check (simple, for demo; use a better hook in production)
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // List of countries for dropdown
  const countryOptions = [
    { value: "uae", label: "AED" },
    { value: "india", label: "INR" },
    { value: "ksa", label: "SAR" },
    { value: "kuwait", label: "KWD" },
    { value: "qatar", label: "QAR" },

  ];

  const handleCountryChange = (e) => {
    const value = e.target.value;
    if (onCountrySelect) {
      onCountrySelect(value);
    } else {
      updateCountry(value);
    }
  };

  // Newsletter form state
  const [newsletterForm, setNewsletterForm] = useState({ name: "", email: "" });
  const [newsletterLoading, setNewsletterLoading] = useState(false);
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);
  const [newsletterError, setNewsletterError] = useState("");

  // Newsletter form submit handler
  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    setNewsletterLoading(true);
    setNewsletterError("");
    setNewsletterSuccess(false);

    try {
      const res = await fetch("https://0vm9jauvgc.execute-api.us-east-1.amazonaws.com/stag/api/notify/newsletter-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newsletterForm),
      });
      if (!res.ok) {
        throw new Error("Failed to subscribe. Please try again.");
      }
      setNewsletterSuccess(true);
      setNewsletterForm({ name: "", email: "" });
      toast.success("Thank you for subscribing!"); // <-- Show toast on success
    } catch (err) {
      setNewsletterError(err.message || "Something went wrong.");
      toast.error(err.message || "Something went wrong."); // <-- Show toast on error
    } finally {
      setNewsletterLoading(false);
    }
  };

  return (
    <section
      className={`self-stretch bg-[#000] overflow-hidden flex flex-col items-center justify-start py-[60px] px-10 gap-[60px] z-[13] text-left text-base text-[#fff] font-h5-24 ${className} mq750:py-[40px] mq750:px-6 mq450:py-[30px] mq450:px-4`}
      style={footerStyle}
    >
      <div className="w-[1360px] max-w-full flex flex-row items-start justify-center gap-10 mq750:flex-col">
        <div className="flex-1 flex flex-row items-start justify-start gap-10 mq750:flex-col mq750:w-full">
          {/* Logo */}
          {/* <div className="overflow-hidden flex flex-col items-start justify-start mq750:mb-6">
            <Image
              className="w-[136px] h-10 relative object-cover"
              loading="lazy"
              width={136}
              height={40}
              alt=""
              src={maskGroup}
            />
          </div> */}
          {/* Feature Product */}
          <div className="flex-1 overflow-hidden flex flex-col items-start justify-start gap-4 mq750:w-full">
            {isMobile ? (
              <>
                <button
                  className="w-full text-white text-16px text-left bg-black font-medium py-2 flex items-center justify-between"
                  onClick={() => handleToggleSection("feature")}
                >
                  Feature Product
                  <Image
                    src={openSection === "collection" ? "/iconamoonarrowup2light@2x.webp" : "/iconamoonarrowup2light@2x.webp"}
                    alt="toggle"
                    width={16}
                    height={16}
                    className="w-[24px] h-[24px]" // Adjust size as needed
                  />
                </button>
                {openSection === "feature" && (
                  <div className="self-stretch px-[24px] flex flex-col items-start justify-start text-sm">
                    {loading ? (
                      Array(5).fill(0).map((_, index) => (
                        <div key={index} className="self-stretch flex flex-row items-start justify-start py-1 px-0">
                          <div className="flex-1 relative leading-[150%] font-medium">
                            Loading...
                          </div>
                        </div>
                      ))
                    ) : topProducts.length > 0 ? (
                      topProducts.map((product) => (
                        <div key={product._id} className="self-stretch flex flex-row items-start justify-start py-1 px-0">
                          <Link
                            href={`/products-details?productId=${product._id}`}
                            className="flex-1 relative leading-[150%] font-medium text-white no-underline hover:no-underline"
                          >
                            {product.name?.en ?
                              `AURORA EON ${product.watchDetails?.gender?.en || "Men's"} dial watch` :
                              "AURORA EON Men's dial watch"}
                          </Link>
                        </div>
                      ))
                    ) : (
                      Array(5).fill(0).map((_, index) => (
                        <div key={index} className="self-stretch flex flex-row items-start justify-start py-1 px-0">
                          <div className="flex-1 relative leading-[150%] font-medium">
                            Lorem Lipsum
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="self-stretch relative leading-[150%] font-medium">
                  Feature Product
                </div>
                <div className="self-stretch flex flex-col items-start justify-start text-sm">
                  {loading ? (
                    Array(5).fill(0).map((_, index) => (
                      <div key={index} className="self-stretch flex flex-row items-start justify-start py-1 px-0">
                        <div className="flex-1 relative leading-[150%] font-medium">
                          Loading...
                        </div>
                      </div>
                    ))
                  ) : topProducts.length > 0 ? (
                    topProducts.map((product) => (
                      <div key={product._id} className="self-stretch flex flex-row items-start justify-start py-1 px-0">
                        <Link
                          href={`/products-details?productId=${product._id}`}
                          className="flex-1 relative leading-[150%] font-medium text-white no-underline hover:no-underline"
                        >
                          {product.name?.en ?
                            `AURORA EON ${product.watchDetails?.gender?.en || "Men's"} dial watch` :
                            "AURORA EON Men's dial watch"}
                        </Link>
                      </div>
                    ))
                  ) : (
                    Array(5).fill(0).map((_, index) => (
                      <div key={index} className="self-stretch flex flex-row items-start justify-start py-1 px-0">
                        <div className="flex-1 relative leading-[150%] font-medium">
                          Lorem Lipsum
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </>
            )}
          </div>
          {/* Collection */}
          <div className="flex-1 overflow-hidden flex flex-col items-start justify-start gap-4 mq750:w-full">
            {isMobile ? (
              <>
                <button
                  className="w-full text-white text-16px text-left bg-black font-medium py-2 flex items-center justify-between"
                  onClick={() => handleToggleSection("collection")}
                >
                  Collection
                  <Image
                    src={openSection === "collection" ? "/iconamoonarrowup2light@2x.webp" : "/iconamoonarrowup2light@2x.webp"}
                    alt="toggle"
                    width={16}
                    height={16}
                    className="w-[24px] h-[24px]" // Adjust size as needed
                  />
                </button>
                {openSection === "collection" && (
                  <div className="self-stretch flex flex-col items-start px-[24px] justify-start text-sm">
                    {loading ? (
                      Array(5).fill(0).map((_, index) => (
                        <div key={index} className="self-stretch flex flex-row items-start justify-start py-1 px-0">
                          <div className="flex-1 relative leading-[150%] font-medium">
                            Loading...
                          </div>
                        </div>
                      ))
                    ) : topCollections.length > 0 ? (
                      topCollections.map((collection) => (
                        <div key={collection._id} className="self-stretch flex flex-row items-start justify-start py-1 px-0">
                          <Link
                            href={`/collection?id=${collection._id}`}
                            className="flex-1 relative leading-[150%] font-medium text-white no-underline hover:no-underline"
                          >
                            {collection.name?.en || collection.name || "Collection"}
                          </Link>
                        </div>
                      ))
                    ) : (
                      Array(5).fill(0).map((_, index) => (
                        <div key={index} className="self-stretch flex flex-row items-start justify-start py-1 px-0">
                          <div className="flex-1 relative leading-[150%] font-medium">
                            Lorem Lipsum
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="self-stretch relative leading-[150%] font-medium">
                  Collection
                </div>
                <div className="self-stretch flex flex-col items-start justify-start text-sm">
                  {loading ? (
                    Array(5).fill(0).map((_, index) => (
                      <div key={index} className="self-stretch flex flex-row items-start justify-start py-1 px-0">
                        <div className="flex-1 relative leading-[150%] font-medium">
                          Loading...
                        </div>
                      </div>
                    ))
                  ) : topCollections.length > 0 ? (
                    topCollections.map((collection) => (
                      <div key={collection._id} className="self-stretch flex flex-row items-start justify-start py-1 px-0">
                        <Link
                          href={`/collection?id=${collection._id}`}
                          className="flex-1 relative leading-[150%] font-medium text-white no-underline hover:no-underline"
                        >
                          {collection.name?.en || collection.name || "Collection"}
                        </Link>
                      </div>
                    ))
                  ) : (
                    Array(5).fill(0).map((_, index) => (
                      <div key={index} className="self-stretch flex flex-row items-start justify-start py-1 px-0">
                        <div className="flex-1 relative leading-[150%] font-medium">
                          Lorem Lipsum
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </>
            )}
          </div>
          {/* Company */}
          <div className="flex-1 overflow-hidden flex flex-col items-start justify-start gap-4 font-p4-14 mq750:w-full">
            {isMobile ? (
              <>
                <button
                  className="w-full text-white text-16px text-left bg-black font-medium py-2 flex items-center justify-between"
                  onClick={() => handleToggleSection("company")}
                >
                  Company
                  <Image
                    src={openSection === "collection" ? "/iconamoonarrowup2light@2x.webp" : "/iconamoonarrowup2light@2x.webp"}
                    alt="toggle"
                    width={16}
                    height={16}
                    className="w-[24px] h-[24px]" // Adjust size as needed
                  />
                </button>
                {openSection === "company" && (
                  <div className="self-stretch flex flex-col items-start px-[24px] justify-start text-sm font-h5-24">
                    <div className="self-stretch flex flex-row items-start justify-start py-1 px-0 cursor-pointer"
                      onClick={() => handleNavigate("/contact")}
                    >
                      <div className="flex-1 relative leading-[150%] font-medium">
                        Contact Us
                      </div>
                    </div>
                    <div className="self-stretch flex flex-row items-start justify-start py-1 px-0  cursor-pointer"
                      onClick={() => handleNavigate("/about-us")}
                    >
                      <div className="flex-1 relative leading-[150%] font-medium">
                        About Us
                      </div>
                    </div>
                    <div className="self-stretch flex flex-row items-start justify-start py-1 px-0 cursor-pointer"
                      onClick={() => handleNavigate("/blog")}
                    >
                      <div className="flex-1 relative leading-[150%] font-medium">
                        Blogs
                      </div>
                    </div>
                    <div className="self-stretch flex flex-row items-start justify-start py-1 px-0 cursor-pointer"
                      onClick={() => handleNavigate("/faqs")}
                    >
                      <div className="flex-1 relative leading-[150%] font-medium">
                        FAQs
                      </div>
                    </div>
                    <div className="self-stretch flex flex-row items-start justify-start py-1 px-0 cursor-pointer"
                      onClick={() => handleNavigate("/profile")}
                    >
                      <div className="flex-1 relative leading-[150%] font-medium">
                        My Account
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="self-stretch relative leading-[150%] font-medium">
                  Company
                </div>
                <div className="self-stretch flex flex-col items-start justify-start text-sm font-h5-24">
                  <Link href="/contact" className="self-stretch flex flex-row items-start justify-start py-1 px-0 cursor-pointer">
                    <div className="flex-1 relative leading-[150%] font-medium">
                      Contact Us
                    </div>
                  </Link>
                  <Link href="/about-us" className="self-stretch flex flex-row items-start justify-start py-1 px-0 cursor-pointer">
                    <div className="flex-1 relative leading-[150%] font-medium">
                      About Us
                    </div>
                  </Link>
                  <Link href="/blog" className="self-stretch flex flex-row items-start justify-start py-1 px-0 cursor-pointer">
                    <div className="flex-1 relative leading-[150%] font-medium">
                      Blogs
                    </div>
                  </Link>
                  <Link href="/faqs" className="self-stretch flex flex-row items-start justify-start py-1 px-0 cursor-pointer">
                    <div className="flex-1 relative leading-[150%] font-medium">
                      FAQs
                    </div>
                  </Link>
                  <Link href="/profile" className="self-stretch flex flex-row items-start justify-start py-1 px-0 cursor-pointer">
                    <div className="flex-1 relative leading-[150%] font-medium">
                      My Account
                    </div>
                  </Link>
                </div>
              </>
            )}
          </div>
          {/* Policy */}
          <div className="w-[151px] overflow-hidden shrink-0 flex flex-col items-start justify-start gap-4 mq750:w-full">
            {isMobile ? (
              <>
                <button
                  className="w-full text-white text-16px text-left bg-black font-medium py-2 flex items-center justify-between"
                  onClick={() => handleToggleSection("policy")}
                >
                  Policy
                  <Image
                    src={openSection === "collection" ? "/iconamoonarrowup2light@2x.webp" : "/iconamoonarrowup2light@2x.webp"}
                    alt="toggle"
                    width={16}
                    height={16}
                    className="w-[24px] h-[24px]" // Adjust size as needed
                  />
                </button>
                {openSection === "policy" && (
                  <div className="self-stretch flex flex-col px-[24px] items-start justify-start text-sm">
                    <Link href="/shipping&delivery" className="self-stretch flex flex-row items-start justify-start py-1 px-0 cursor-pointer">
                      <div className="flex-1 relative leading-[150%] font-medium">
                        Shipping & Delivery
                      </div>
                    </Link>
                    <div className="self-stretch flex flex-row items-start justify-start py-1 px-0">
                      <div className="flex-1 relative leading-[150%] font-medium">
                        Returns & Exchange
                      </div>
                    </div>
                    <Link href="/privacy-policy" className="self-stretch flex flex-row items-start justify-start py-1 px-0 cursor-pointer">
                      <div className="flex-1 relative leading-[150%] font-medium">
                        Privacy Policy
                      </div>
                    </Link>
                    <Link href="/term-of-use" className="self-stretch flex flex-row items-start justify-start py-1 px-0 cursor-pointer">
                      <div className="flex-1 relative leading-[150%] font-medium">
                        Terms of Service
                      </div>
                    </Link>
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="self-stretch relative leading-[150%] font-medium">
                  Policy
                </div>
                <div className="self-stretch flex flex-col items-start justify-start text-sm">
                  <Link href="/shipping&delivery" className="self-stretch flex flex-row items-start justify-start py-1 px-0 cursor-pointer">
                    <div className="flex-1 relative leading-[150%] font-medium">
                      Shipping & Delivery
                    </div>
                  </Link>
                  <div className="self-stretch flex flex-row items-start justify-start py-1 px-0">
                    <div className="flex-1 relative leading-[150%] font-medium">
                      Returns & Exchange
                    </div>
                  </div>
                  <Link href="/privacy-policy" className="self-stretch flex flex-row items-start justify-start py-1 px-0 cursor-pointer">
                    <div className="flex-1 relative leading-[150%] font-medium">
                      Privacy Policy
                    </div>
                  </Link>
                  <Link href="/term-of-use" className="self-stretch flex flex-row items-start justify-start py-1 px-0 cursor-pointer">
                    <div className="flex-1 relative leading-[150%] font-medium">
                      Terms of Service
                    </div>
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
        <div className="w-[400px] flex flex-col items-start justify-start gap-6 mq750:w-full">
          {/* Stay In Loop section */}
          <div className="self-stretch flex flex-col items-start justify-start gap-4">
            <div className="self-stretch relative leading-[150%] font-medium">
              Stay In Loop
            </div>
            <div className="self-stretch relative text-sm leading-[150%] font-medium">
              Be the first to know about our exclusive offers, newest
              collections, and latest products!
            </div>
          </div>

          {/* Form section */}
          <div className="self-stretch flex flex-col items-start justify-start gap-4">
            <form
              className="m-0 self-stretch flex flex-col items-start justify-start gap-4"
              onSubmit={handleNewsletterSubmit}
            >
              <input
                type="text"
                placeholder="Enter your name"
                className="self-stretch rounded-lg border-[#fff] border-solid border-[1px] flex flex-row items-center justify-start p-3 bg-transparent text-sm leading-[150%] font-medium font-p4-14 text-[#fff] text-left placeholder-[#fff] focus:outline-none"
                value={newsletterForm.name}
                onChange={e => setNewsletterForm({ ...newsletterForm, name: e.target.value })}
                required
              />
              <input
                type="email"
                placeholder="Enter your email"
                className="self-stretch rounded-lg border-[#fff] border-solid border-[1px] flex flex-row items-center justify-start p-3 bg-transparent text-sm leading-[150%] font-medium font-p4-14 text-[#fff] text-left placeholder-[#fff] focus:outline-none"
                value={newsletterForm.email}
                onChange={e => setNewsletterForm({ ...newsletterForm, email: e.target.value })}
                required
              />
              <button
                type="submit"
                className="self-stretch rounded-[100px] bg-[#fff] flex flex-row items-center justify-center py-3 px-6"
                disabled={newsletterLoading}
              >
                <div className="relative text-sm leading-[150%] font-medium font-p4-14 text-[#000] text-center">
                  {newsletterLoading ? "Submitting..." : "Join"}
                </div>
              </button>
              {newsletterSuccess && (
                <div className="text-green-400 mt-2">Thank you for subscribing!</div>
              )}
              {newsletterError && (
                <div className="text-red-400 mt-2">{newsletterError}</div>
              )}
            </form>
          </div>

          {/* Social icons and country dropdown */}
          <div className="w-full flex flex-row items-center justify-between">
            <div className="flex flex-row items-center gap-4">
              <Image
                onClick={() => handleSocialIcons("https://www.facebook.com/people/Tornado-World/61556313113779/")}
                className="h-6 w-6 relative overflow-hidden shrink-0 cursor-pointer"
                loading="lazy"
                width={24}
                height={24}
                alt="Facebook"
                src="/icon--facebook.svg"
              />
              <Image
                onClick={() => handleSocialIcons("https://www.instagram.com/tornado.watches/")}
                className="h-6 w-6 relative overflow-hidden shrink-0 cursor-pointer"
                loading="lazy"
                width={24}
                height={24}
                alt="Instagram"
                src="/icon--instagram.svg"
              />
              <Image
                onClick={() => handleSocialIcons("https://x.com/tornadowatches")}
                className="w-6 relative h-6 overflow-hidden shrink-0 cursor-pointer"
                width={24}
                height={24}
                alt="Twitter/X"
                src="/icon--x.svg"
                loading="lazy"
              />
              <Image
                onClick={() => handleSocialIcons("https://www.youtube.com/@tornadowatches")}
                className="w-6 relative h-6 overflow-hidden shrink-0 cursor-pointer"
                width={24}
                height={24}
                alt="YouTube"
                src={iconYoutube}
              />
            </div>

            {/* Country Dropdown */}
            <select
              value={selectedCountry || "uae"}
              onChange={handleCountryChange}
              className="px-2 py-2  rounded-[50px] bg-[#000] text-white border border-[#fff] focus:outline-none focus:ring-2 focus:ring-[#fff] text-sm"
              style={{ minWidth: 110 }}
            >
              {countryOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <div className="w-[1360px] max-w-full flex flex-row items-center justify-between gap-5 text-center text-sm mq750:flex-col">
        <div className="relative leading-[150%] font-medium">
          2025 Aurora Eon. All rights reserved.
        </div>
        <div className="flex flex-row items-center justify-center gap-4">
          {/* <div
            className="h-10 w-10 rounded-[50%] bg-[#fff] overflow-hidden shrink-0 flex flex-row items-center justify-center cursor-pointer"
          >
            <Image
              className="h-6 w-6 relative overflow-hidden shrink-0 object-cover"
              loading="lazy"
              width={24}
              height={24}
              alt=""
              src={itemImg}
            />
          </div> */}
          <div
            className="h-10 w-10 rounded-[50%] bg-[#fff] overflow-hidden shrink-0 flex flex-row items-center justify-center cursor-pointer"
          >
            <Image
              className="h-8 w-8 relative overflow-hidden shrink-0 object-contain"
              loading="lazy"
              width={24}
              height={24}
              alt=""
              src="/tabby.webp"
            />
          </div>
          <div
            className="h-10 w-10 rounded-[50%] bg-[#fff] overflow-hidden shrink-0 flex flex-row items-center justify-center cursor-pointer"
          >
            <Image
              className="h-8 w-8 relative overflow-hidden shrink-0 object-contain"
              loading="lazy"
              width={24}
              height={24}
              alt=""
              src="/tap.png"
            />
          </div>
          <div
            className="h-10 w-10 rounded-[50%] bg-[#fff] overflow-hidden shrink-0 flex flex-row items-center justify-center cursor-pointer"
          >
            <Image
              className="h-8 w-8 relative overflow-hidden shrink-0 object-contain"
              loading="lazy"
              width={24}
              height={24}
              alt=""
              src="/strabl.webp"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

Footer.propTypes = {
  className: PropTypes.string,
  maskGroup: PropTypes.string.isRequired,
  iconYoutube: PropTypes.string.isRequired,
  itemImg: PropTypes.string.isRequired,
  itemImg1: PropTypes.string.isRequired,
  itemImg2: PropTypes.string.isRequired,

  /** Style props */
  footerAlignSelf: PropTypes.string,
  footerWidth: PropTypes.string,
};

export default Footer;
