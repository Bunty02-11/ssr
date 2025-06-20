"use client";
import Image from "next/image";
import BtnShop from "./btn-shop";
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";

const MotionOverlay = ({ opacity }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity }}
    transition={{ duration: 1.5 }}
    className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/40 to-black/70 z-[-1]"
  />
);

const Banner = ({ className = "", property1 = "Default", country }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const titleText = "Where Excellence Meets Deep Resonance";
  const subtitleText = "A smaller case that's big on fun and sustainability";

  return (
    <>
      <Head>
        <link
          rel="preload"
          as="image"
          href="/hero-poster.jpg"
          fetchpriority="high"
          importance="high"
        />
        <link
          rel="preconnect"
          href="https://d2gp6k9qqqnc7a.cloudfront.net"
        />
      </Head>
      <section
        ref={ref}
        className={`self-stretch h-[750px] overflow-hidden shrink-0 flex flex-row items-center justify-center py-[250px] px-10 box-border relative text-center text-lg text-[rgba(255,255,255,0.8)] font-h5-24 ${className} mq750:py-[150px] mq450:py-[60px] mq450:pb-0 mq450:px-4 mq450:h-[400px]`}
        data-property1={property1}
        style={{ contain: 'layout style' }}
      >
        {/* Background with optimized loading */}
        <div
          className="absolute top-0 left-0 w-full h-full"
          style={{ transform: `scale(${1 + scrollY * 0.0005})` }}
        >
          {/* Hero poster image for immediate LCP */}
          <Image
            src="/hero.webp"
            alt="Torando Watches Hero"
            fill
            priority
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 100vw"
            className="object-cover object-center"
            style={{
              willChange: 'transform',
              transform: 'translateZ(0)',
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
              zIndex: 1
            }}
          />

          {/* Video loads after hero image renders */}
          {inView && (
            <video
              autoPlay
              muted
              loop
              playsInline
              preload="none"
              className="absolute top-0 left-0 w-full h-full object-cover z-10"
              style={{
                opacity: 1,
                transition: 'opacity 2s ease-in-out',
                willChange: 'opacity'
              }}
            >
              <source src="https://d2gp6k9qqqnc7a.cloudfront.net/new.mp4" type="video/mp4" />
            </video>
          )}
        </div>
        <div className="absolute inset-0 bg-black bg-opacity-40 rounded-3xl"></div>
        {/* Overlay with animated gradient */}
        <MotionOverlay opacity={0.6} />

        <div className="w-full max-w-[1360px] flex flex-col items-center justify-center gap-10 md:gap-8 sm:gap-6 xs:gap-4 z-10 px-4 mq450:py-[40px]">
          <div className="self-stretch flex flex-col items-center justify-center gap-4 md:gap-3 sm:gap-2 xs:gap-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="self-stretch overflow-hidden shrink-0 flex flex-row items-center justify-center gap-[16px]"
            >
              <div className="w-full relative leading-[150%] font-500 flex items-center justify-center shrink-0 text-[18px]">
                Elite Quality
              </div>
            </motion.div>

            <motion.div
              className="w-full max-w-[1072px] overflow-hidden shrink-0 flex flex-row items-center justify-center gap-[16px] text-white"
            >
              <h1 className="m-0 w-full relative leading-[120%] text-[56px] mq450:text-[32px] font-bold font-inherit flex items-center justify-center shrink-0">
                {country?.title || titleText}
              </h1>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.7, delay: 1.2 }}
              className="self-stretch overflow-hidden shrink-0 flex flex-row items-start gap-[16px] justify-start"
            >
              <div className="w-full relative leading-[150%] font-500 flex items-center justify-center shrink-0 text-[18px] px-4">
                {subtitleText}
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
            transition={{
              duration: 0.5,
              delay: 1.5,
              type: "spring",
              stiffness: 200
            }}
            whileHover={{
              scale: 1.05,
              boxShadow: "0px 0px 15px rgba(255, 255, 255, 0.3)"
            }}
            whileTap={{ scale: 0.95 }}
            className="w-full max-w-[200px] sm:max-w-[180px] xs:max-w-[160px] gap-[16px]"
          >
            <BtnShop property1={2} contact_us="Shop Now" onClick={() => handleNavigate("/shop")} />
          </motion.div>
        </div>
      </section>
    </>
  );
};

Banner.propTypes = {
  className: PropTypes.string,
  property1: PropTypes.number,
};

export default Banner;