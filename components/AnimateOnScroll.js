"use client";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import PropTypes from "prop-types";

const AnimateOnScroll = ({ 
  children, 
  className = "", 
  animation = "fadeIn", 
  delay = 0,
  duration = 0.5,
  once = true
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once });
  
  const animations = {
    fadeIn: {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { duration, delay } }
    },
    slideUp: {
      hidden: { opacity: 0, y: 50 },
      visible: { opacity: 1, y: 0, transition: { duration, delay } }
    },
    slideRight: {
      hidden: { opacity: 0, x: -50 },
      visible: { opacity: 1, x: 0, transition: { duration, delay } }
    },
    slideLeft: {
      hidden: { opacity: 0, x: 50 },
      visible: { opacity: 1, x: 0, transition: { duration, delay } }
    },
    scale: {
      hidden: { opacity: 0, scale: 0.8 },
      visible: { opacity: 1, scale: 1, transition: { duration, delay } }
    }
  };

  const selectedAnimation = animations[animation];

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={selectedAnimation}
      className={className}
    >
      {children}
    </motion.div>
  );
};

AnimateOnScroll.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  animation: PropTypes.oneOf(["fadeIn", "slideUp", "slideRight", "slideLeft", "scale"]),
  delay: PropTypes.number,
  duration: PropTypes.number,
  once: PropTypes.bool
};

export default AnimateOnScroll;