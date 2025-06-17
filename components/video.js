import Image from "next/image";
import PropTypes from "prop-types";
import BtnShop from "./btn-shop";
import Link from "next/link";

const Video = ({ className = "" }) => {
  return (
    <section className={`w-full max-w-[1360px] overflow-hidden mx-auto px-[8px] mq450:px-[8px] box-border text-left text-[#fff] font-h5-24 items-center justify-center py-[60px] mq450:py-[40px] ${className}`}>
      <div className="w-full max-w-[1360px] mx-auto">
        <div className="w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] rounded-2xl md:rounded-3xl flex flex-row items-end justify-start py-6 sm:py-8 md:py-12 lg:py-[60px] px-4 sm:px-6 md:px-8 lg:px-10 box-border gap-4 sm:gap-6 md:gap-8 lg:gap-[60px] bg-[url('/about_1.webp')] bg-cover bg-no-repeat bg-[center]">
          <div className="flex-1 flex flex-col items-start justify-start gap-3 sm:gap-4 md:gap-6">
            <h1 className="m-0 w-full md:w-[543px] relative text-xl sm:text-2xl md:text-3xl lg:text-[48px] leading-[120%] font-medium font-[inherit] flex items-center">
              Relish the Resonance of Refined Watches
            </h1>
            <div className="relative text-xs sm:text-sm md:text-base leading-[150%] font-medium text-[rgba(255,255,255,0.8)]">
              Tornado looks for ways to support and celebrate the planet.
            </div>
            <Link href="/shop">
              <BtnShop contact_us="Shop Now" />
            </Link>
          </div>
          <Image
            className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 lg:h-11 lg:w-11 relative rounded-[100px] overflow-hidden shrink-0 cursor-pointer"
            loading="lazy"
            width={44}
            height={44}
            alt="Play button"
            src="/riplayfill.svg"
          />
        </div>
      </div>
    </section>
  );
};

Video.propTypes = {
  className: PropTypes.string,
};

export default Video;