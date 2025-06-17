"use client";
import { useMemo } from "react";
import Image from "next/image";
import PropTypes from "prop-types";

const Review = ({
  className = "",
  property1 = "Default",
  reviewBackgroundImage,
  icroundStar,
  icroundStar1,
  icroundStar2,
  icroundStar3,
  icroundStar4,
}) => {
  const reviewStyle = useMemo(() => {
    return {
      backgroundImage: reviewBackgroundImage,
    };
  }, [reviewBackgroundImage]);

  return (
    <div
      className={`h-[322px] flex-1 rounded-2xl overflow-hidden flex flex-col items-start justify-end p-6 box-border gap-4 bg-[url('/review1@3x.webp')] bg-cover bg-no-repeat bg-[top] text-left text-base text-[#fff] font-h5-24 ${className}`}
      data-property1={property1}
      style={reviewStyle}
    >
      <div className="overflow-hidden hidden flex-row items-start justify-start gap-1">
        <Image
          className="h-6 w-6 relative overflow-hidden shrink-0"
          width={24}
          height={24}
          alt=""
          src={icroundStar}
          loading="lazy"
        />
        <Image
          className="h-6 w-6 relative overflow-hidden shrink-0"
          width={24}
          height={24}
          alt=""
          src={icroundStar1}
          loading="lazy"
        />
        <Image
          className="h-6 w-6 relative overflow-hidden shrink-0"
          width={24}
          height={24}
          alt=""
          src={icroundStar2}
          loading="lazy"
        />
        <Image
          className="h-6 w-6 relative overflow-hidden shrink-0"
          width={24}
          height={24}
          alt=""
          src={icroundStar3}
          loading="lazy"
        />
        <Image
          className="h-6 w-6 relative overflow-hidden shrink-0"
          width={24}
          height={24}
          alt=""
          src={icroundStar4}
          loading="lazy"
        />
      </div>
      <div className="w-[274px] relative leading-[150%] font-medium hidden">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit Suspendisse
        varius enim in eros elementum tristique l orem ipsum dolor sit amet,
        consectetur adipiscing.
      </div>
      <h2 className="m-0 self-stretch relative text-5xl leading-[140%] font-semibold font-[inherit]">
        Lorem lipsum
      </h2>
    </div>
  );
};

Review.propTypes = {
  className: PropTypes.string,
  icroundStar: PropTypes.string.isRequired,
  icroundStar1: PropTypes.string.isRequired,
  icroundStar2: PropTypes.string.isRequired,
  icroundStar3: PropTypes.string.isRequired,
  icroundStar4: PropTypes.string.isRequired,

  /** Variant props */
  property1: PropTypes.number,

  /** Style props */
  reviewBackgroundImage: PropTypes.string,
};

export default Review;
