"use client";
import { useState, useEffect, Suspense, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import Image from "next/image";
import { useCart } from "../../context/CartContext";
import Left from "../../components/left";
import R from "../../components/r";
import R1 from "../../components/r1";
import Video from "../../components/video";
import Soecification from "../../components/soecification";
import Testimonials from "../../components/pdpreview";
import Card from "../../components/card";
import Footer from "../../components/footer";
import Navbar from "../../components/navbar";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { useCountry } from "../../context/CountryContext";
import AnimateOnScroll from "../../components/AnimateOnScroll";
import { motion } from "framer-motion";

function ProductDetailsContent({ className = "", textStyle = {} }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [productId, setProductId] = useState("");
  const [product, setProduct] = useState(null);
  const { selectedCountry, updateCountry } = useCountry();
  const swiperRef = useRef(null);

  useEffect(() => {
    const productIdFromParams = searchParams.get("productId");

    if (productIdFromParams) {
      setProductId(productIdFromParams);
      axios.get(`https://0vm9jauvgc.execute-api.us-east-1.amazonaws.com/stag/api/products/${productIdFromParams}`)
        .then(response => {
          setProduct(response.data);
        })
        .catch(error => console.error("Error fetching product data:", error));
    }
  }, [searchParams]);

  const handleAddToCart = () => {
    if (product && product.data && product.data.product) {
      const productData = product.data.product;
      addToCart({
        productId: productData._id || productData.id,
        name: productData.name?.en || productData.name || "",
        price: productData.price,
        images: productData.imageLinks ? Object.values(productData.imageLinks) : [productData.image],
        image: productData.imageLinks?.image1 || productData.image,
        quantity: quantity
      });
      alert("Product added to cart!");
    }
  };

  const handleBuyNow = () => {
    if (product && product.data && product.data.product) {
      const productData = product.data.product;
      addToCart({
        productId: productData._id || productData.id,
        name: productData.name?.en || productData.name || "",
        price: productData.price,
        images: productData.imageLinks ? Object.values(productData.imageLinks) : [productData.image],
        image: productData.imageLinks?.image1 || productData.image,
        quantity: quantity
      });
      router.push("/cart");
    }
  };
  const handleCountrySelect = (country) => {
    updateCountry(country);
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0) {
      setQuantity(value);
    }
  };

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
    <div className="w-full relative bg-white overflow-hidden flex flex-col items-center justify-start pt-[13px] box-border leading-[normal] px-4 tracking-[normal] text-left text-xs text-[rgba(0,0,0,0.6)] font-h5-24">
      <Navbar
        logoSrc="/1623314804-bd8bf9c117ab50f7f842-1@2x.webp"
        search="/search.svg"
        account="/account.svg"
        sVG="/svg.svg"
        onCountrySelect={handleCountrySelect}
        navbarBackgroundColor={"rgba(0, 0, 0, 0.5)"}
      />

      {/* Breadcrumb section */}
      <div className="w-full max-w-[1360px] flex flex-row items-center justify-start pt-[120px] mq450:pt-[110px] box-border">
        <div className="relative leading-[150%] font-medium text-[10px] sm:text-xs space-x-1">
          <Link href="/" className="text-gray-500 no-underline cursor-pointer">
            Home
          </Link>
          <span>{`>`}</span>
          <Link href="/shop" className="text-gray-500 no-underline cursor-pointer ">
            Shop
          </Link>
          <span>{`>`}</span>
          <span className="text-gray-500">{product?.data?.product?.name?.en}</span>
        </div>
      </div>

      {/* Product details section */}

      <section className="w-[1360px] max-w-full bg-[#fff] overflow-hidden text-black overflow-hidden flex flex-row mq1050:flex-col items-center justify-center px-[8px] py-[60px] gap-[60px] mq450:gap-[24px] mq450:px-[8px] mq450:py-[16px] box-border  text-lg text-[#000] font-h5-24">

        <Left product={product?.data?.product} />
        <div className="w-full lg:flex-1 flex flex-col items-center justify-center gap-6 min-w-0 lg:min-w-[455px]">
          <R product={product?.data?.product} relatedProducts={product?.data?.relatedProducts} selectedCountry={selectedCountry} />
          <R1 product={product?.data?.product} />
        </div>
      </section>

      {/* Description section */}
      <section
        className={`self-stretch overflow-hidden flex flex-row mx-auto items-center justify-center box-border gap-[60px] max-w-[1360px] text-37xl text-[#000] font-h5-24 px-[8px] mq1050:flex-row mq450:px-[8px] mq750:gap-[30px] mq750:pt-[26px] mq750:pb-[26px] mq750:box-border ${className}`}
      >
        <AnimateOnScroll
          animation="slideRight"
          className="flex-1 flex flex-col items-center justify-start gap-6 min-w-[520px] pt-0 mq750:min-w-[350px]"
          style={textStyle}
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="m-0 self-stretch relative text-black text-inherit leading-[120%] font-bold font-[inherit] mq450:text-[34px] mq450:leading-[40px] mq1050:text-[45px] mq1050:leading-[54px]"
          >
            Description
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="self-stretch relative text-black text-base mq450:text-sm leading-[150%] font-medium"
          >
            {/* Read More logic */}
            <ReadMoreDescription desc={product?.data?.product?.description?.en || ""} />
          </motion.div>
        </AnimateOnScroll>

        <AnimateOnScroll animation="slideLeft">
          <Image
            className="h-[500px] w-[500px] rounded-3xl object-cover max-w-full mq1050:w-[350px] mq1050:h-[350px] mq750:h-[300px] mq750:w-[300px] mq1125:flex-1 mq450:w-[400px] mq450:h-[300px]"
            loading="lazy"
            width={500}
            height={500}
            alt="about_3"
            src="/about_3.jpg"
          />
        </AnimateOnScroll>
      </section>

      {/* Video section */}
      <Video />

      {/* Specification section */}
      <Soecification product={product?.data?.product} />

      {/* Reviews section */}
      <Testimonials Heading="Reviews" />

      {/* Related Products section */}
      <section className="self-stretch overflow-hidden flex flex-col items-center justify-start pb-[60px] px-[80px] gap-[60px] z-[2] text-left text-37xl text-black font-h5-24 mq1050:gap-[30px] mq1050:pt-[39px] mq1050:pb-[39px] mq1050:px-[8px]  mq1050:box-border mq450:px-[8px] mq450:py-[0px] mq450:pb-[40px]">
        <div className="w-full flex flex-row items-center justify-between gap-4 px-5 sm:px-0">
          <h1 className="m-0 w-full flex-1 relative text-black text-[28px] sm:text-[36px] md:text-[44px] leading-[120%] font-medium font-[inherit]">
            Related Products
          </h1>
          <div className="flex flex-row items-start justify-center gap-2 sm:gap-4 mq450:hidden">
            <button
              className="swiper-button-prev-custom focus:outline-none bg-transparent"
              onClick={() => swiperRef.current?.swiper.slidePrev()}
            >
              <Image
                className="h-8 w-8 sm:h-11 sm:w-11 relative overflow shrink-0 object-contain"
                loading="lazy"
                width={44}
                height={44}
                alt="solararrowuplinear-2@2x"
                src="/solararrowuplinear-2@2x.webp"
              />
            </button>
            <button
              className="swiper-button-next-custom focus:outline-none bg-transparent"
              onClick={() => swiperRef.current?.swiper.slideNext()}
            >
              <Image
                className="h-8 w-8 sm:h-11 sm:w-11 relative overflow shrink-0 object-contain"
                loading="lazy"
                width={44}
                height={44}
                alt="solararrowuplinear-1@2x"
                src="/solararrowuplinear-1@2x.webp"
              />
            </button>
          </div>
        </div>
        <div className="w-full px-5 sm:px-10 md:px-[60px]">
          <Swiper
            ref={swiperRef}
            modules={[Navigation]}
            spaceBetween={10}
            slidesPerView={2}
            breakpoints={{
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
              1280: {
                slidesPerView: 4,
                spaceBetween: 24
              }
            }}
          >
            {product?.data?.youMayAlsoLike?.map((product) => {
              const currencySymbol = getCurrencySymbol(selectedCountry);
              const productPrice = getCountryPrice(product.price);
              const displayPrice = productPrice ? `${currencySymbol} ${productPrice}` : '';
              const productDiscountPrice = getCountryPrice(product.discountPrice);
              const displayDiscountPrice = productDiscountPrice ? `${currencySymbol} ${productDiscountPrice}` : '';

              const productRating = getCountryPrice(product.ratings);
              const displayProductRatings = productRating ? `${productRating}` : '';

              return (
                <SwiperSlide key={product._id}>
                  <Card
                    stock={product.stock}
                    productId={product._id}
                    images={product?.imageLinks?.image1 || "/default-watch.jpg"}
                    hoverImage={product?.imageLinks?.image2 || "/default-watch.jpg"}
                    classic={product.watchDetails?.watchType?.en || "Classic"}
                    name={product.name?.en}
                    icroundStar="/icroundstar-1.svg"
                    dialColor={product.watchDetails?.dialColor?.en || "Black"}
                    price={displayPrice}
                    discountPrice={displayDiscountPrice}
                    rating={displayProductRatings}
                    country={selectedCountry}
                  />
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      </section>
      <Footer
        footerAlignSelf="unset"
        footerWidth="100%"
        maskGroup="/mask-group@2x.webp"
        iconYoutube="/icon--youtube.svg"
        itemImg="/item--img.svg"
        itemImg1="/item--img-1.svg"
        itemImg2="/item--img-2.svg"
      />

    </div>
  );
}

const ProductsDetails = () => {
  return (
    <Suspense fallback={<div className="w-full h-screen flex items-center justify-center bg-black text-white">Loading...</div>}>
      <ProductDetailsContent />
    </Suspense>
  );
};

export default ProductsDetails;

// Add this helper component at the bottom of the file (before export)
function ReadMoreDescription({ desc }) {
  const [showMore, setShowMore] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if window is defined (for SSR safety)
    const checkMobile = () => {
      if (typeof window !== "undefined") {
        setIsMobile(window.innerWidth <= 600);
      }
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (!desc) return null;
  const firstDotIdx = desc.indexOf(".");
  if (!isMobile) {
    // Desktop/tablet: show full description
    return desc;
  }
  if (firstDotIdx === -1 || firstDotIdx === desc.length - 1) {
    return desc;
  }
  const firstPart = desc.slice(0, firstDotIdx + 1);
  const restPart = desc.slice(firstDotIdx + 1);
  return (
    <>
      {showMore ? (
        <>
          {desc}
          <div
            className="w-[100px] rounded-[100px] bg-[#000] overflow-hidden flex flex-row items-center justify-center py-3 px-10 text-center text-base text-[#fff] font-h5-24 cursor-pointer mt-2 mq450:w-[80px] mq450:px-6 mq450:py-2 mq450:text-[14px]"
            onClick={() => setShowMore(false)}
          >
            <div className="relative leading-[150%] font-medium">View less</div>
          </div>
        </>
      ) : (
        <>
          {firstPart}
          <div
            className="w-[100px] rounded-[100px] bg-[#000] overflow-hidden flex flex-row items-center justify-center py-3 px-10 text-center text-base text-[#fff] font-h5-24 cursor-pointer mt-2 mq450:w-[80px] mq450:px-6 mq450:py-2 mq450:text-[14px]"
            onClick={() => setShowMore(true)}
          >
            <div className="relative leading-[150%] font-medium">Read More</div>
          </div>
        </>
      )}
    </>
  );
}