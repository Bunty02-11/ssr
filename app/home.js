"use client"
import Image from "next/image";
import Banner from "../components/banner";
import Bestsellers from "../components/bestsellers";
import Reason from "../components/reason";
import Card from "../components/card";
import BtnShop from "../components/btn-shop";
import Offers from "../components/offers";
import Blogs from "../components/blogs";
import Faqs from "../components/faqs";
import Footer from "../components/footer";
import Navbar from "../components/navbar";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useCountry } from "../context/CountryContext";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import Collection from "../components/collection";
import SkeletonLoader from "../components/SkeletonLoader";
import Link from "next/link";
import Testimonials from "../components/testimonials";

const Home = ({ initialData }) => {
  const [products, setProducts] = useState(initialData?.countryProducts || []);
  const [home, setHome] = useState(initialData?.homeData || { data: [] });
  const [loading, setLoading] = useState(false); // Start with false since we have initial data
  const [error, setError] = useState(null);
  const { selectedCountry, updateCountry, countryData, setCountryData } = useCountry();

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(
        `https://0vm9jauvgc.execute-api.us-east-1.amazonaws.com/stag/api/products/new-arrivals` // Adjusted endpoint to match your API
      );
      // console.log(response.data, "Products data from API");

      if (selectedCountry) {
        const countryKey = selectedCountry.toLowerCase();
        const countryProducts = response.data.data[countryKey] || [];
        setProducts(countryProducts);
      } else {
        // Default to US or empty array if no country selected
        setProducts(response.data.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("Failed to load products. Please try again later.");
    } finally {
      setLoading(false);
    }
  };
  // console.log(products, "new arrivals data from API");

  const fetchHome = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`https://0vm9jauvgc.execute-api.us-east-1.amazonaws.com/stag/api/home/`);
      // console.log(response.data, "Products data from API");
      setHome(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("Failed to load products. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Initialize country data from SSR if available
  useEffect(() => {
    if (initialData?.countryData && !countryData) {
      setCountryData(initialData.countryData);
    }
  }, [initialData?.countryData, countryData, setCountryData]);

  useEffect(() => {
    if (home && home[0]) {
      const countrySpecificData = home[0]?.[selectedCountry];
      // console.log('Country specific data:', countrySpecificData);
      if (countrySpecificData) {
        setCountryData(countrySpecificData);
        // console.log('Updated country data:', countrySpecificData);
      } else {
        console.log('No data found for country:', selectedCountry);
      }
    } else {
      console.log('No home data available yet');
    }
  }, [selectedCountry, home.data, setCountryData]);

  const handleCountrySelect = (country) => {
    updateCountry(country);
  };

  useEffect(() => {
    // Only fetch if we don't have initial data from SSR
    if (!initialData?.homeData?.data?.length) {
      fetchHome();
    }
    if (!initialData?.countryProducts?.length) {
      fetchProducts();
    }
  }, [initialData]);

  const handleSocialIcons = (path) => {
    window.open(path, "_blank", "noopener,noreferrer");
  };

  // console.log(selectedCountry, "Country data from API");

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

  return (
    <div className="w-full relative bg-white text-black overflow-hidden flex flex-col items-center justify-center leading-[normal] tracking-[normal] text-center text-xs font-h5-24">
      {/* <PerformanceMonitor /> */}
      {/* <div className="self-stretch bg-white text-black overflow-hidden flex flex-row items-start justify-start py-[13px] px-10 box-border max-w-full mq750:h-auto mq450:px-4">
        <div className="w-[1360px] flex flex-row items-center justify-between gap-5 max-w-full mq750:flex-wrap">
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
      </div> */}
      <Banner property1={2} country={countryData} />
      {/* <div className="hero-title-section w-full px-[40px] bg-black text-white flex flex-row items-center justify-center py-[60px] mq750:py-5 max-w-full mq750:flex-col mq450:py-[40px] mq450:px-[24px] mq450:gap-[24px]">
        <div className="w-full flex flex-col items-center">
          <h1 className="m-0 mt-0 mb-0 text-[56px] md:text-6xl lg:text-7xl leading-[120%] font-semibold font-[inherit] text-center 
                   mq750:text-4xl mq750:leading-[1.15]
                   mq1050:text-5xl mq1050:leading-[1.15]
                   mq450:text-[30px] mq450:leading-[1.15] mq450:px-[24px] mq450:text-center mq450:fontweight-600"
            style={{ minHeight: '68px' }}>
            {countryData?.title || "Buy Stylish Torando Watches for Men"}
          </h1>
        </div>
      </div> */}

      {/* Tabbed Content for Desktop/Tablet - Hidden on Mobile */}

      {/* Original Mobile Layout - Hidden on Desktop/Tablet */}
      <div className=" w-full">
        <Bestsellers country={countryData} selectedCountry={selectedCountry} />
        <section className="self-stretch overflow-hidden flex flex-col items-center justify-start py-[60px] mq750:py-5 mq450:py-5 px-[40px] z-[3] mq1050:gap-0 mq450:px-[24px]">
          <Reason country={countryData} />
        </section>
        <section className="self-stretch overflow-hidden flex flex-col items-center justify-start py-[60px] mq750:py-5 mq450:py-5 px-[40px] gap-12 z-[6] text-left text-29xl text-[#000] font-h5-24 mq1050:gap-8 mq1050:py-5 mq1050:box-border mq450:px-[24px] mq450:gap-[24px] mq450:py-[40px]">
          <div className="w-[1360px] max-w-full flex flex-row items-center justify-between gap-12 mq450:flex-col mq450:gap-6">
            {/* Changed mq750:flex-col to mq450:flex-col so only mobile is column, iPad/desktop remain row */}
            <h2 className="m-0 relative text-[48px] leading-[120%] font-bold font-[inherit] mq450:text-center mq750:text-[34px] mq750:leading-[40px] mq1050:text-[45px] mq1050:leading-[54px] mq450:text-[24px] mq450:leading-[120%]">
              {countryData?.new_Seller_title}
            </h2>
            <div className="flex flex-row items-start justify-center gap-4 mq450:gap-2 ">
              <button className="swiper-button-prev-custom focus:outline-none bg-transparent">
                <Image
                  className="h-11 w-11 relative overflow shrink-0 object-contain mq450:h-8 mq450:w-8"
                  loading="lazy"
                  width={44}
                  height={44}
                  alt="solararrowuplinear-2@2x"
                  src="/solararrowuplinear-2@2x.webp"
                />
              </button>
              <button className="swiper-button-next-custom focus:outline-none bg-transparent">
                <Image
                  className="h-11 w-11 relative overflow shrink-0 object-contain mq450:h-8 mq450:w-8"
                  loading="lazy"
                  width={44}
                  height={44}
                  alt="solararrowuplinear-1@2x"
                  src="/solararrowuplinear-1@2x.webp"
                />
              </button>
            </div>
          </div>

          <div className="w-[1360px] max-w-full">
            {loading ? (
              <div className="skeleton-grid grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {Array.from({ length: 4 }, (_, index) => (
                  <div key={`skeleton-${index}`} className="flex justify-center min-h-[480px]">
                    <SkeletonLoader />
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="text-red-500">{error}</div>
            ) : products.length > 0 ? (
              <div className="relative flex justify-center items-center">
                <Swiper
                  modules={[Navigation]}
                  navigation={{
                    nextEl: '.swiper-button-next-custom',
                    prevEl: '.swiper-button-prev-custom',
                  }}
                  spaceBetween={24}
                  slidesPerView={4}
                  breakpoints={{
                    0: {
                      slidesPerView: 2,
                      spaceBetween: 15
                    },
                    640: {
                      slidesPerView: 2,
                      spaceBetween: 15
                    },
                    768: {
                      slidesPerView: 2.4,
                      spaceBetween: 20
                    },
                    1024: {
                      slidesPerView: 3,
                      spaceBetween: 20
                    },
                    1360: {
                      slidesPerView: 4,
                      spaceBetween: 24
                    }
                  }}
                  style={{
                    "--swiper-navigation-color": "#fff",
                    "--swiper-pagination-color": "#fff",
                    width: "100%"
                  }}
                  className="!p-[2px] flex justify-center items-center"
                >
                  {products.map((product) => {
                    const currencySymbol = getCurrencySymbol(selectedCountry);
                    const productPrice = getCountryPrice(product.price);
                    const displayPrice = productPrice ? `${currencySymbol} ${productPrice}` : '';

                    const productDiscountPrice = getCountryPrice(product.discountPrice);
                    const displayDiscountPrice = productDiscountPrice ? `${currencySymbol} ${productDiscountPrice}` : '';

                    const productRating = getCountryPrice(product.ratings);
                    const displayProductRatings = productRating ? `${productRating}` : '';

                    return (
                      <SwiperSlide key={product._id} className="flex justify-center">
                        <Card
                          stock={product.stock}
                          productId={product._id}
                          images={product?.imageLinks?.image1 || "/default-watch.jpg"}
                          hoverImage={product.imageLinks?.image3}
                          classic={product.collection?.name || "Classic"}
                          name={product.name?.en}
                          icroundStar="/icroundstar-1.svg"
                          dialColor={product.watchDetails?.dialColor?.en || "Black"}
                          price={displayPrice}
                          discountPrice={displayDiscountPrice}
                          country={selectedCountry}
                          rating={displayProductRatings}
                        />
                      </SwiperSlide>
                    );
                  })}
                </Swiper>
              </div>
            ) : (
              <div className="text-black">No New Arrivals found</div>
            )}
          </div>
        </section>
        <section className="self-stretch overflow-hidden flex flex-row flex-wrap items-start justify-center pb-[40px] pt-[60px] mq750:py-5 mq450:py-[40px] mq450:px-[24px] px-[40px] z-[5] text-center text-base text-[rgba(255,255,255,0.8)] font-h5-24 mq1050:flex-row mq1050:gap-8 mq1050:py-5 mq1050:box-border">
          <div className="w-[1360px] flex flex-row flex-wrap items-center justify-between gap-0 mq1050:flex-row mq1050:gap-6 mq750:flex-col">
            {/* First Card */}
            <div className="h-[700px] w-[660px] rounded-3xl flex flex-row items-start justify-center p-10 box-border bg-[url('/aurora_eon_celestial3.webp')] bg-cover bg-no-repeat bg-center mq450:h-[520px] mq450:gap-[30px] mq1050:w-[48%] mq1050:h-[600px] mq1050:p-8 mq750:w-full mq750:h-auto mq750:p-6 relative">
              {/* Black overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-40 rounded-3xl"></div>
              <div className="flex-1 flex flex-col items-center justify-start gap-6 relative z-[1]">
                <div className="self-stretch flex flex-col items-start justify-start gap-4">
                  <div className="self-stretch relative leading-[150%] font-medium">
                    Limited Offer
                  </div>
                  <b className="self-stretch relative text-[48px] leading-[120%] mq450:text-[24px] text-[#fff] mq750:text-[34px] mq750:leading-[40px] mq1050:text-[40px] mq1050:leading-[120%] mq450:leading-[120%]">
                    Aurora Eon Celestial
                  </b>
                  <div className="self-stretch relative leading-[150%] font-medium mq450:text-[16px] mq450:leading-[150%] mq450:pb-[30px]">
                    Discover the limited edition Aurora Eon Celestial, a masterpiece of watchmaking that combines elegance with precision.
                  </div>
                </div>
                <BtnShop contact_us="Shop Now" onClick={() => handleNavigate("/featured")} />
              </div>
            </div>
            {/* Second Card */}
            <div className="h-[700px] w-[660px] rounded-3xl flex flex-row items-end justify-center p-10 box-border bg-[url('/aurora_eon_celestial1.webp')] bg-cover bg-no-repeat bg-[top] mq450:h-[520px] mq750:pt-[26px] mq750:pb-[26px] mq750:box-border mq450:gap-[30px] mq1050:w-[48%] mq1050:h-[600px] mq1050:p-8 mq750:w-full mq750:h-auto mq750:p-6 relative">
              {/* Black overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-40 rounded-3xl"></div>
              <div className="flex-1 flex flex-col items-center justify-start gap-6 relative z-[1]">
                <div className="self-stretch flex flex-col items-start justify-start gap-4">
                  <div className="self-stretch relative leading-[150%] font-medium">
                    Recommended
                  </div>
                  <h1 className="m-0 self-stretch relative text-[48px] mq450:text-[24px] leading-[120%] font-bold font-[inherit] text-[#fff] mq750:text-[34px] mq750:leading-[40px] mq1050:text-[40px] mq1050:leading-[120%] mq450:leading-[120%]">
                    Personalized Watches
                  </h1>
                  <div className="self-stretch relative leading-[150%] font-medium">
                    Contact-Us on whatsapp for more details.
                  </div>
                </div>
                <BtnShop contact_us="Contact Us" onClick={() => handleSocialIcons("https://api.whatsapp.com/send/?phone=971505057445&text=Hi&type=phone_number&app_absent=0")} />
              </div>
            </div>
          </div>
        </section>

        < Collection property1={2} country={countryData} />
        <Offers country={countryData} selectedCountry={selectedCountry} />
        <Testimonials Heading={countryData} />
        <Blogs
          heading={countryData}
          solararrowUpLinear="/solararrowuplinear1@2x.webp"
          solararrowUpLinear1="/solararrowuplinear-11@2x.webp"
          category="AUTOMATIC"
          category1="ANALOG"
          category2="DIGITAL"
          category3="VINTAGE"
        />
      </div>

      <section className="self-stretch overflow-hidden flex flex-col items-center justify-start py-[60px] mq750:py-5 mq450:py-5 px-[40px] gap-[40px] z-[10] text-center text-29xl text-[#fff] font-h5-24 mq1050:gap-8 mq450:py-[40px] mq450:px-[24px] mq450:gap-[24px]">
        <div className="w-[1360px] rounded-3xl flex flex-row items-center justify-center py-20 px-10 box-border bg-[url('/send_a_gift_to_a_friend.webp')] bg-cover bg-no-repeat bg-[top] mq750:pt-[52px] mq750:pb-[52px] mq750:box-border mq450:gap-[30px] max-w-full mq450:py-10 mq450:px-5 mq450:h-[480px] mq450:w-[380px] relative">
          {/* Black overlay with opacity */}
          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-3xl"></div>

          <div className="flex-1 flex flex-col items-center justify-start gap-6 relative z-[1]">
            <h1 className="m-0 w-[1000px] relative text-[48px] mq450:text-center leading-[1.15] font-bold font-[inherit] flex items-center justify-center mq750:text-2xl mq750:leading-[1.15] mq1050:text-3xl mq1050:leading-[1.15] mq450:text-[24px] mq450:leading-[120%] mq450:w-full max-w-full">
              Send a Gift to a Friend
            </h1>
            <div className="w-[1000px] relative text-base leading-[150%] font-medium text-[rgba(255,255,255,0.8)] flex items-center justify-center mq450:w-[332px] mq450:text-[16px] mq450:leading-[150%]">
              {countryData?.Send_a_Gift_to_a_Friend}
            </div>
            <BtnShop
              onClick={() => handleNavigate("/shop")}
              contact_us="Shop Now"
              btnShopPosition="unset"
              btnShopWidth="unset"
              btnShopAlignSelf="unset"
            />
          </div>
        </div>
      </section>
      {/* <section className="self-stretch overflow-hidden flex flex-col items-center justify-start pt-[40px] pb-[60px] mq750:py-5 px-[40px] z-[10] text-center text-29xl text-[#fff] font-h5-24 mq1050:gap-8 mq450:px-4 mq450:py-5 mq450:gap-[24px]">
        <Faqs country={countryData} />
      </section> */}
      <Footer
        maskGroup="/mask-group@2x.webp"
        iconYoutube="/icon--youtube1.svg"
        itemImg="/item--img1.svg"
        itemImg1="/item--img-11.svg"
        itemImg2="/item--img-21.svg"
      />
      <Navbar
        logoSrc="/logo.webp"
        search="/search1.svg"
        account="/account1.svg"
        sVG="/svg1.svg"
        onCountrySelect={handleCountrySelect}
        navbarBackgroundColor={"transparent"}
      />
    </div>
  );
};

export default Home;
