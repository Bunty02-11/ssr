"use client";
import { useState } from "react";
import Image from "next/image";
import PropTypes from "prop-types";

const Faqs = ({ className = "", country }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? -1 : index);
  };

  return (
    <section
      className={`w-[1440px] max-w-full flex flex-row items-center justify-center px-10 box-border z-[11] text-left text-base text-black font-h5-24 mq450:box-border mq1050:gap-[30px] mq750:flex-col mq450:px-4 ${className}`}
    >
      <div className="flex-1 flex flex-col items-start justify-start gap-6 mq750:w-full">
        <div className="self-stretch flex flex-col items-start justify-start text-21xl">
          <h2 className="m-0 relative text-[48px] leading-[120%] mq450:text-center font-bold font-[inherit] mq750:text-5xl mq750:leading-[29px] mq1050:text-13xl mq1050:leading-[38px] mq450:text-[24px] mq450:leading-[100%]">
            {country?.faq_title || "Frequently Asked Questions"}
          </h2>
        </div>

        <div className="self-stretch flex flex-col items-start justify-start">
          {country?.faqs?.map((faq, index) => (
            <div
              key={index}
              className={`self-stretch flex flex-col items-start justify-start transition-all duration-200 ${
                index === 0 ? "sticky top-[0] z-[99]" : ""
              } ${
                activeIndex === index
                  ? "border-b border-white/10"
                  : "border-b border-transparent"
              }`}
            >
              <div
                className="self-stretch overflow-hidden flex flex-row items-center justify-between py-4 px-0 gap-6 cursor-pointer mq450:gap-3"
                onClick={() => toggleFAQ(index)}
              >
                <div className="flex-1 relative leading-[150%] font-medium text-lg mq450:text-base">
                  {faq.question}
                </div>
                <Image
                  className={`w-6 h-6 transition-transform duration-200 ${
                    activeIndex === index ? "rotate-180" : ""
                  }`}
                  width={24}
                  height={24}
                  alt="iconamoonarrowup21-1@2x"
                  src="/iconamoonarrowup21-1@2x.webp"
                />
              </div>
              <div
                className={`self-stretch overflow-hidden transition-all duration-200 ${
                  activeIndex === index
                    ? "max-h-[500px] opacity-100 pb-4"
                    : "max-h-0 opacity-0"
                }`}
              >
                <div className="relative leading-[150%] font-medium text-black/80">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* <Image
        className="w-[600px] rounded-3xl h-[600px] object-cover mq750:w-full mq750:h-auto mq450:h-[300px]"
        width={600}
        height={600}
        alt="pexels-pixabay-221164"
        src="/pexels-pixabay-221164.webp"
      /> */}
    </section>
  );
};

Faqs.propTypes = {
  className: PropTypes.string,
  country: PropTypes.object,
};

export default Faqs;