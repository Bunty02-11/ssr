import Image from "next/image";
import Navbar from "./navbar";
import PropTypes from "prop-types";

const FrameComponent = ({ className = "" }) => {
  return (
    <section
      className={`self-stretch flex flex-col items-start justify-start pt-0 px-0 pb-4 box-border gap-[13px] max-w-full text-center text-xs text-white font-h5-24 ${className}`}
    >
      <div className="self-stretch flex flex-row items-start justify-start py-0 px-10 box-border max-w-full">
        <div className="flex-1 flex flex-row items-center justify-between gap-5 max-w-full mq450:flex-wrap">
          <Image
            className="h-6 w-6 relative overflow-hidden shrink-0 object-contain"
            width={24}
            height={24}
            alt=""
            src="/iconamoonarrowup2@2x.webp"
          />
          <div className="relative leading-[150%] font-medium">
            Sale: 20% Off - Limited Time Only
          </div>
          <Image
            className="h-6 w-6 relative overflow-hidden shrink-0 object-contain"
            width={24}
            height={24}
            alt=""
            src="/iconamoonarrowup2-1@2x.webp"
          />
        </div>
      </div>
      <Navbar
        navbarMargin="unset"
        navbarPosition="unset"
        navbarTop="unset"
        navbarRight="unset"
        navbarLeft="unset"
        navbarBackgroundColor="#000"
        bd8bf9c117ab50f7f8421="/1623314804-bd8bf9c117ab50f7f842-1@2x.webp"
        search="/search.svg"
        account="/account.svg"
        sVG="/svg.svg"
      />
    </section>
  );
};

FrameComponent.propTypes = {
  className: PropTypes.string,
};

export default FrameComponent;
