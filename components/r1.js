import Image from "next/image";
import PropTypes from "prop-types";
import { useRouter } from "next/navigation";

const R1 = ({ className = "", product }) => {
  const router = useRouter();

  const handleSocialIcons = (path) => {
    window.open(path, "_blank", "noopener,noreferrer");
  };

  const handleNavigate = (path) => {
    router.push(path);
  };

  return (
    <div
      className={`self-stretch flex flex-row items-start justify-between !pt-4 !pb-4 !pl-0 !pr-0 gap-0 text-left text-base text-[#000] font-H5-24 mq750:flex-wrap ${className}`}
    >
      <div className="flex flex-row items-center justify-start gap-2"
        onClick={() => handleNavigate("/faqs")}
      >
        <Image
          className="w-[18px] relative h-[18px] overflow-hidden shrink-0 mq450:w-[16px] mq450:h-[16px]"
          width={18}
          height={18}
          alt="materialsymbolsinfooutlinerounded"
          src="/materialsymbolsinfooutlinerounded.svg"
          loading="lazy"
        />
        <div className="relative leading-[150%] font-medium mq450:text-[16px] mq450:leading-[16px]">
          Ask a question
        </div>
      </div>
      <div className="flex flex-row items-center justify-start gap-2"
        onClick={() => handleNavigate("/shipping&delivery")}
      >
        <Image
          className="w-[18px] relative h-[18px] overflow-hidden shrink-0 mq450:w-[16px] mq450:h-[16px]"
          width={18}
          height={18}
          alt="solarboxlinear"
          src="/solarboxlinear.svg"
          loading="lazy"
        />
        <div className="relative leading-[150%] font-medium mq450:text-[16px] mq450:leading-[16px]">
          Delivery Return
        </div>
      </div>
      <div className="flex flex-row items-center justify-start gap-[2px]">
        <Image
          className="w-[18px] relative rounded-[100px] h-[18px] overflow-hidden shrink-0 mq450:w-[16px] mq450:h-[16px]"
          width={18}
          height={18}
          alt="hugeiconstick02"
          src="/hugeiconstick02.svg"
          loading="lazy"
        />
        <div className="relative leading-[150%] font-medium mq450:text-[16px] mq450:leading-[16px]">
          3 Year Warranty
        </div>
      </div>
      <div className="flex flex-row items-center justify-start gap-[7px]">
        <div className="relative leading-[150%] font-medium">Share:</div>
        <div className="flex flex-row items-center justify-start gap-4 mq450:gap-2">
          <Image
            className="w-[18px] relative h-[18px] object-cover mq450:w-[16px] mq450:h-[16px]"
            width={18}
            height={18}
            alt=""
            src="/symbolpng@2x.webp"
            loading="lazy"
            onClick={() =>
              handleSocialIcons(
                "https://www.instagram.com/tornado.watches/"
              )
            }
          />
          <Image
            className="h-[18px] w-[18px] relative object-cover mq450:w-[16px] mq450:h-[16px]"
            width={18}
            height={18}
            alt=""
            src="/symbolpng-1@2x.webp"
            loading="lazy"
            onClick={() =>
              handleSocialIcons(
                "https://www.facebook.com/people/Tornado-World/61556313113779/"
              )
            }
          />
          <Image
            className="w-[18px] relative h-[18px] object-cover mq450:w-[16px] mq450:h-[16px]"
            width={18}
            height={18}
            alt=""
            src="/x-logopng@2x.webp"
            loading="lazy"
            onClick={() =>
              handleSocialIcons(
                "https://x.com/tornadowatches"
              )
            }
          />
          <Image
            className="h-[18px] w-[18px] relative object-cover mq450:w-[16px] mq450:h-[16px]"
            width={18}
            height={18}
            alt=""
            src="/symbolpng-2@2x.webp"
            loading="lazy"
            onClick={() => handleSocialIcons("https://api.whatsapp.com/send/?phone=971505057445&text=Hi&type=phone_number&app_absent=0")}
          />
        </div>
      </div>
    </div>
  );
};

R1.propTypes = {
  className: PropTypes.string,
};

export default R1;
