"use client";
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const PageBanner = ({ title, breadcrumb }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const videoVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 1.2 }
    }
  };

  const textVariants = {
    hidden: { opacity: 0, y: 20 }, // Reduced y-distance for mobile
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.8,
        delay: 0.3
      }
    }
  };

  const breadcrumbVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.5,
        delay: 0.6
      }
    }
  };

  return (
    <section 
      ref={ref}
      className="self-stretch h-[450px] overflow-hidden shrink-0 flex flex-row items-center justify-center py-[250px] px-10 box-border relative text-center text-lg text-[rgba(255,255,255,0.8)] font-h5-24 ${className} mq750:py-[150px] mq450:py-[60px] mq450:pb-0 mq450:px-4 mq450:h-[300px]"
    >
      {/* Video background with animation */}
      <motion.div
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={videoVariants}
        className="absolute top-0 left-0 w-full h-full z-0"
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover"
        >
          <source src="https://d2gp6k9qqqnc7a.cloudfront.net/99d0928cc6844f789dedade93cce2bd5.HD-1080p-7.2Mbps-40198216.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
        {/* Overlay with gradient */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/40 to-black/70 z-0"></div>
      </motion.div>
      
      <div className="w-full max-w-[1360px] px-4 sm:px-6 md:px-8 
                     flex flex-col items-center justify-center gap-4 sm:gap-6 z-10 relative h-full">
        <motion.h1 
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={textVariants}
          className="m-0 w-full font-bold
                     text-3xl sm:text-4xl md:text-5xl lg:text-6xl
                     leading-tight sm:leading-snug md:leading-normal"
        >
          {title}
        </motion.h1>
        <motion.div 
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={breadcrumbVariants}
          className="w-full text-sm sm:text-base md:text-lg leading-relaxed"
        >
          {breadcrumb}
        </motion.div>
      </div>
    </section>
  );
};

PageBanner.propTypes = {
  title: PropTypes.string.isRequired,
  breadcrumb: PropTypes.string.isRequired
};

export default PageBanner;