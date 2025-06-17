import { useState } from "react";
import PropTypes from "prop-types";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import Image from "next/image";

const Reason = ({ className = "", country }) => {
  const [showCards, setShowCards] = useState(false);

  const mobileHeightClass = showCards
    ? "mq450:h-[633px]"
    : "mq450:h-[480px]";

  return (
    <div
      className={`w-[1360px] h-[700px] rounded-3xl flex flex-col items-center justify-center py-16 px-10 box-border bg-[url('/reason_to_believe.webp')] bg-cover bg-no-repeat bg-[top] text-center text-base text-[#fff] font-h5-24 ${mobileHeightClass} ${className} max-w-full mq750:h-[500px] mq750:py-[36px] mq750:px-8 mq450:py-[16px] mq450:px-5 relative overflow-hidden`}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/40 rounded-3xl"></div>

      {/* Centered Content with Transition */}
      <div
        className={`flex flex-col items-center justify-center w-full z-10 transition-all duration-700 ease-in-out ${
          showCards ? "mt-[80px] mq450:mt-[40px]" : ""
        }`}
      >
        <h2 className="m-0 relative text-[48px] leading-[120%] font-bold font-[inherit] mq750:text-[34px] mq750:leading-[40px] mq1050:text-[45px] mq1050:leading-[54px] mq450:text-[24px] mq450:leading-[120%]">
          Reason to{" "}
          {/* <span className="hidden mq450:block">{"\n"}</span> */}
          Believe
        </h2>
        {!showCards && (
          <div className="w-[1000px] relative leading-[150%] pb-[40px] font-medium text-white text-lg flex items-center justify-center max-w-full px-4 mq750:text-base mq450:w-[350px] mq450:text-sm mq450:pb-[24px]">
            {country?.Reason_to_Believe ||
              "We are committed to making a positive impact on the world."}
          </div>
        )}
        {!showCards && (
          <button
            onClick={() => setShowCards(true)}
            className="mt-2 rounded-[100px] bg-[#fff] overflow-hidden flex flex-row items-center justify-center py-3 px-10 text-center text-base text-[#000] font-h5-24 cursor-pointer hover:bg-gray-100 transition-colors"
          >
            <div className="relative leading-[150%] font-medium">
              Learn More
            </div>
          </button>
        )}
      </div>

      {/* Cards Container */}
      {showCards && (
        <div className="relative w-full z-10 px-4 mq450:px-2 mt-8">
          {/* Cross Button */}
          <button
            onClick={() => setShowCards(false)}
            className="absolute mq450:right-[0.5rem] mq450:top-[3rem] right-0 top-0 z-20 bg-transparent rounded-full p-2 cursor-pointer transition-colors -translate-y-full"
            aria-label="Close"
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 20 20"
              fill="none"
              className="text-white"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6 6L14 14M14 6L6 14"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>

          {/* Swiper with responsive settings */}
          <div className="w-full pb-24">
            <Swiper
              modules={[Navigation]}
              slidesPerView={1}
              spaceBetween={16}
              navigation={{
                prevEl: ".swiper-prev-reason",
                nextEl: ".swiper-next-reason",
              }}
              breakpoints={{
                640: {
                  slidesPerView: 2,
                  spaceBetween: 20
                },
                1024: {
                  slidesPerView: 4,
                  spaceBetween: 24
                }
              }}
            >
              {country?.reason_to_belive?.map((reason, index) => (
                <SwiperSlide key={index}>
                  <div className="rounded-[16px] py-[40px] gap-[16px] px-[24px] text-left bg-black/70 border border-white/30 shadow flex flex-col justify-start h-[298px] mq450:h-auto">
                    <h3 className="text-xl  font-semibold text-left mq450:text-lg">
                      {reason.title}
                    </h3>
                    <p className="text-gray-100 text-base text-left flex-1 mq450:text-[14px]">
                      {reason.content}
                    </p>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Navigation arrows */}
            {country?.reason_to_belive?.length > 1 && (
              <div className="flex flex-row items-center justify-center gap-3 mt-4">
                <button className="swiper-prev-reason bg-black/50 rounded-full p-2 border-0 cursor-pointer focus:outline-none">
                  <Image
                    className="h-8 w-8 object-contain mq450:h-4 mq450:w-4"
                    width={36}
                    height={36}
                    alt="Previous"
                    src="/solararrowuplinear-5@1x.webp"
                    loading="lazy"
                  />
                </button>
                <button className="swiper-next-reason bg-black/50 rounded-full p-2 border-0 cursor-pointer focus:outline-none">
                  <Image
                    className="h-8 w-8 object-contain mq450:h-4 mq450:w-4"
                    width={36}
                    height={36}
                    alt="Next"
                    src="/solararrowuplinear-5@2x.webp"
                    loading="lazy"
                  />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

Reason.propTypes = {
  className: PropTypes.string,
};

export default Reason;