"use client";
import { useMemo } from "react";
import Image from "next/image";
import PropTypes from "prop-types";

const TestimonialItems = ({
  className = "",
  testimonialItemsBackgroundImage,
  author = "",
  quote = "",
}) => {
  const testimonialItemsStyle = useMemo(() => {
    return {
      backgroundImage: testimonialItemsBackgroundImage,
    };
  }, [testimonialItemsBackgroundImage]);

  return (
    <div
      className={`h-[322px] flex-1 rounded-2xl overflow-hidden flex flex-col items-start justify-end py-6 pl-6 pr-5 box-border gap-4 bg-cover bg-no-repeat bg-[top] text-left text-base text-[#fff] font-h5-24 relative group ${className}`}
      style={testimonialItemsStyle}
    >
      {/* Permanent dark overlay at bottom for name readability */}
      <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/50 to-transparent z-10"></div>
      
      {/* Name - always visible at bottom */}
      <h2 className="m-0 self-stretch relative text-xl leading-[140%] font-semibold font-[inherit] mq750:text-[19px] mq750:leading-[27px] z-20 mb-2">
        {author}
      </h2>
      
      {/* Hover overlay - covers entire item */}
      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
      
      {/* Content - visible on hover */}
      <div className="absolute inset-0 flex flex-col justify-end pb-24 pl-6 pr-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
        <div className="flex flex-row items-start justify-start gap-1 mb-4">
          {[...Array(5)].map((_, i) => (
            <Image
              key={i}
              className="h-5 w-5 relative overflow-hidden shrink-0"
              width={20}
              height={20}
              alt="Star rating"
              src="/icroundstar-1.svg"
              loading="lazy"
            />
          ))}
        </div>
        <div className="w-full max-w-[274px] relative leading-[150%] font-medium mb-4">
          "{quote}"
        </div>
      </div>
    </div>
  );
};

TestimonialItems.propTypes = {
  className: PropTypes.string,
  testimonialItemsBackgroundImage: PropTypes.string,
  author: PropTypes.string,
  quote: PropTypes.string,
};

export default TestimonialItems;