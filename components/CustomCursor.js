"use client";
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const CustomCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [cursorVariant, setCursorVariant] = useState("default");

  useEffect(() => {
    const mouseMove = (e) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY
      });
    };

    window.addEventListener("mousemove", mouseMove);

    return () => {
      window.removeEventListener("mousemove", mouseMove);
    };
  }, []);

  useEffect(() => {
    const handleLinkHover = () => setCursorVariant("link");
    const handleLinkLeave = () => setCursorVariant("default");

    const links = document.querySelectorAll('a, button, [role="button"]');
    
    links.forEach(link => {
      link.addEventListener('mouseenter', handleLinkHover);
      link.addEventListener('mouseleave', handleLinkLeave);
    });

    return () => {
      links.forEach(link => {
        link.removeEventListener('mouseenter', handleLinkHover);
        link.removeEventListener('mouseleave', handleLinkLeave);
      });
    };
  }, []);

  const variants = {
    default: {
      x: mousePosition.x - 16,
      y: mousePosition.y - 16,
      height: 32,
      width: 32,
      backgroundColor: "rgba(255, 255, 255, 0)",
      border: "2px solid rgba(255, 255, 255, 0.5)",
    },
    link: {
      x: mousePosition.x - 24,
      y: mousePosition.y - 24,
      height: 48,
      width: 48,
      backgroundColor: "rgba(255, 255, 255, 0.1)",
      border: "2px solid rgba(255, 255, 255, 0.8)",
    }
  };

  const dotVariants = {
    default: {
      x: mousePosition.x - 5,
      y: mousePosition.y - 5,
      height: 10,
      width: 10,
    },
    link: {
      x: mousePosition.x - 5,
      y: mousePosition.y - 5,
      height: 10,
      width: 10,
    }
  };

  return (
    <>
      <motion.div
        className="cursor-outline fixed top-0 left-0 rounded-full pointer-events-none z-[9999]"
        variants={variants}
        animate={cursorVariant}
        transition={{ type: "spring", stiffness: 500, damping: 28 }}
      />
      <motion.div
        className="cursor-dot fixed top-0 left-0 rounded-full bg-white pointer-events-none z-[9999]"
        variants={dotVariants}
        animate={cursorVariant}
        transition={{ type: "spring", stiffness: 500, damping: 28 }}
      />
    </>
  );
};

export default CustomCursor;