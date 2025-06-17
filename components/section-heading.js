"use client";
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const SectionHeading = ({ title, subtitle, className = "" }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const headingVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.7 }
    }
  };

  const subtitleVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.5,
        delay: 0.3
      }
    }
  };

  return (
    <div ref={ref} className={`flex flex-col items-center justify-start gap-4 ${className}`}>
      <motion.h2
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={headingVariants}
        className="text-37xl font-bold leading-[120%] text-white"
      >
        {title}
      </motion.h2>
      {subtitle && (
        <motion.p
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={subtitleVariants}
          className="text-base leading-[150%] font-medium text-[rgba(255,255,255,0.8)] max-w-2xl text-center"
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
};

SectionHeading.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  className: PropTypes.string
};

export default SectionHeading;