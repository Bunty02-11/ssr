import Image from "next/image";
import PropTypes from "prop-types";

const Content1 = ({ className = "", countryData }) => {
  return (
    <section
      className={`w-[1440px] overflow-hidden flex flex-row items-center justify-center py-[60px] px-[40px] box-border gap-[40px] max-w-full text-left text-21xl text-[#000] font-h5-24 mq750:gap-[29px] mq750:pt-[23px] mq750:pb-[23px] mq750:box-border mq1125:h-auto mq450:px-[24px] mq450:py-[40px] mq450:gap-[24px] mq1125:flex-wrap ${className}`}
      style={{ margin: "0 auto" }}
    >
      <div className="flex flex-col items-center  justify-center box-border max-w-full mq750:min-w-full mq1050:box-border mq1125:flex-1">
        <div className="w-[652px] flex flex-col items-center justify-center gap-6 max-w-full">
          <div className="self-stretch flex flex-row items-center justify-between">
            <h1 className="m-0 relative text-inherit leading-[120%] font-medium font-[inherit] mq750:text-13xl mq750:leading-[38px] mq1050:text-5xl mq1050:leading-[29px]">
              Get In Touch
            </h1>
          </div>
          <div className="self-stretch flex flex-col items-start justify-start gap-6 text-base">
            <div className="self-stretch relative leading-[150%] font-medium">
              {countryData?.get_in_touch}
            </div>
            <div className="self-stretch flex flex-col items-start justify-start gap-4">
              <div className="self-stretch flex flex-row items-center justify-start gap-3">
                <Image
                  className="h-6 w-6 relative overflow-hidden shrink-0"
                  loading="lazy"
                  width={24}
                  height={24}
                  alt="call"
                  src="/call.webp"
                />
                <a href="tel:+12018564358" className="flex-1 relative leading-[150%] font-medium no-underline text-inherit">
                  +1 (201) 856-4358
                </a>
              </div>
              <div className="self-stretch flex flex-row items-center justify-start gap-2.5">
                <Image
                  className="h-6 w-6 relative overflow-hidden shrink-0"
                  loading="lazy"
                  width={24}
                  height={24}
                  alt="mail"
                  src="/mail.webp"
                />
                <a href="mailto:info@tornado.store" className="flex-1 relative leading-[150%] font-medium no-underline text-inherit">
                  info@tornado.store
                </a>
              </div>
              <div className="flex items-center gap-2 mq450:w-[300px] ">
                <Image
                  className="h-6 w-6 relative overflow-hidden shrink-0"
                  loading="lazy"
                  width={24}
                  height={24}
                  alt="location"
                  src="/location.webp"
                />
                <div className="flex-1 relative leading-[150%] font-medium inline-block min-w-[402px] mq750:min-w-full">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. 
                  </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Image
        className="w-[650px] relative rounded-3xl max-h-full object-cover max-w-full mq1125:flex-1 mq450:w-[325px] mq450:h-[275px] mq450:rounded-3xl"
        loading="lazy"
        width={650}
        height={550}
        alt="get_in_touch"
        src="/get_in_touch.jpg"
      />
    </section>
  );
};

Content1.propTypes = {
  className: PropTypes.string,
};

export default Content1;
