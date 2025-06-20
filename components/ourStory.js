"use client";
import { useMemo } from "react";
import Image from "next/image";
import PropTypes from "prop-types";
import AnimateOnScroll from "./AnimateOnScroll";

const Description = ({
  className = "",
  descriptionAlignSelf,
  descriptionWidth,
  textMinWidth,
  img,
  product,
  country
}) => {
  const descriptionStyle = useMemo(() => {
    return {
      alignSelf: descriptionAlignSelf,
      width: descriptionWidth,
    };
  }, [descriptionAlignSelf, descriptionWidth]);

  const textStyle = useMemo(() => {
    return {
      minWidth: textMinWidth,
    };
  }, [textMinWidth]);

  return (
    <section
      className={`self-stretch overflow-hidden flex flex-row items-center justify-center p-10 box-border gap-[60px] max-w-full text-left text-37xl text-[#000] font-h5-24 mq750:flex-row mq750:gap-[30px] mq750:pt-[26px] mq750:pb-[26px] mq750:box-border mq1050:flex-row mq450:flex-col mq450:px-[24px] mq450:py-[40px] mq450:gap-[24px] ${className}`}
      style={descriptionStyle}
    >
      <AnimateOnScroll
        animation="slideRight"
        className="flex-1 flex flex-col items-start justify-start gap-6 min-w-[520px] mq750:min-w-[350px] mq1125:order-2"
        style={textStyle}
      >
        <h1 className="m-0 self-stretch relative text-black text-[44px] mq450:text-center leading-[120%] font-bold font-[inherit] mq750:text-[28px] mq750:leading-[40px] mq450:text-[24px] mq450:leading-[120%]">
          {country?.our_story_title || "Description"}
        </h1>
        <div className="self-stretch relative text-black mq450:text-center text-base leading-[150%] font-medium mq450:text-[16px]">
          {country?.our_story}
        </div>
      </AnimateOnScroll>

      <AnimateOnScroll 
        animation="slideLeft"
        className="mq1125:order-1 mq1125:w-full mq1125:flex mq1125:justify-center"
      >
        <Image
          className="h-[500px] w-[500px] mq1050:h-[350px] mq1050:w-[350px] rounded-3xl object-cover max-w-full mq750:h-[400px] mq750:w-[400px] mq450:h-[300px] mq450:w-full"
          loading="lazy"
          width={500}
          height={500}
          alt=""
          src={img}
        />
      </AnimateOnScroll>
    </section>
  );
};

Description.propTypes = {
  className: PropTypes.string,
  descriptionAlignSelf: PropTypes.string,
  descriptionWidth: PropTypes.string,
  textMinWidth: PropTypes.string,
  description: PropTypes.string.isRequired,
  img: PropTypes.string.isRequired,
};

export default Description;
